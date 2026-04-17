import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import {
  useGetRefreshTokenMutation,
  useLogoutMutation,
} from "../../../app/queries/loginApi";
import {
  removeUser,
  setNewAccessToken,
  authInitStart,
  authInitSuccess,
  authInitFail,
} from "../../../app/slices/userAuth";
import { useDispatch, useSelector } from "react-redux";
import { isTokenExpired, getTokenExpiry } from "../../../lib/helpers";
import { RootState } from "@/app/store";
import { isExpectedLogoutError } from "@/lib/authErrorUtils";

const REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before expiry
const FALLBACK_REFRESH_MS = 55 * 60 * 1000; // used when token has no exp claim
const TRANSIENT_RETRY_MS = 30_000; // 30s
const MAX_TRANSIENT_RETRIES = 5; // 5 retries
const MAX_BACKOFF_MS = 5 * 60 * 1000; // 5 min cap

const isJwtToken = (token: string) => token.split(".").length === 3;

const isRefreshJwtExpired = (token: string) => {
  if (!isJwtToken(token)) return false;
  try {
    return getTokenExpiry(token) <= Date.now();
  } catch {
    // If decode fails, do not force logout; let backend validate.
    return false;
  }
};

export const useFetchRefreshToken = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.user);
  const [triggerRefresh] = useGetRefreshTokenMutation();
  const [logout] = useLogoutMutation();

  // Stable refs to avoid stale closures and unnecessary effect re-runs
  const refreshTokenRef = useRef(userDetails?.refreshToken);
  const tokenRef = useRef(userDetails?.token);
  const isRefreshingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doRefreshRef = useRef<(() => Promise<void>) | null>(null);
  const isMountedRef = useRef(false);
  const retryCountRef = useRef(0);

  // Keep refs in sync with latest Redux values
  useEffect(() => {
    refreshTokenRef.current = userDetails?.refreshToken;
  }, [userDetails?.refreshToken]);

  useEffect(() => {
    tokenRef.current = userDetails?.token;
  }, [userDetails?.token]);

  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = refreshTokenRef.current;
      if (refreshToken) {
        await logout(refreshToken).unwrap();
      }
    } catch (error) {
      if (!isExpectedLogoutError(error)) {
        console.error("Logout failed:", error);
      }
    } finally {
      if (isMountedRef.current) {
        dispatch(removeUser());
      }
    }
  }, [logout, dispatch]);

  const scheduleRefresh = useCallback((accessToken: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let delay: number;
    try {
      // getTokenExpiry returns exp in ms
      const exp = getTokenExpiry(accessToken);
      const now = Date.now();
      const ttl = exp - now;
      if (ttl <= 0) {
        delay = 5_000; // floor to prevent tight loops on clock-skew or bad tokens
      } else {
        const effectiveBuffer = Math.min(
          REFRESH_BUFFER_MS,
          Math.floor(ttl / 2),
        );
        delay = Math.min(ttl, Math.max(5_000, ttl - effectiveBuffer));
      }
    } catch {
      delay = FALLBACK_REFRESH_MS; // fallback if exp claim is missing: 55 min
    }

    timeoutRef.current = setTimeout(() => doRefreshRef.current?.(), delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    const refreshToken = refreshTokenRef.current;
    if (!refreshToken) return;

    isRefreshingRef.current = true;

    // If the access token is already expired / missing, set authInitialized=false
    // BEFORE the async API call. This tells ProtectedLayout to show BarLoader
    // instead of redirecting to login while we silently refresh.
    // (When the token is still valid — i.e. normal scheduled pre-expiry refresh —
    // we skip this so the user never sees a loader flash.)
    const currentToken = tokenRef.current;
    if (!currentToken || isTokenExpired(currentToken)) {
      dispatch(authInitStart());
    }

    try {
      if (!isMountedRef.current) return;
      if (isRefreshJwtExpired(refreshToken)) {
        dispatch(authInitFail());
        await handleLogout();
        return;
      }

      const result = await triggerRefresh(refreshToken).unwrap();

      const newAccessToken = result?.accessToken || result?.token;

      if (newAccessToken) {
        if (!isMountedRef.current) return;
        retryCountRef.current = 0; // reset on success
        dispatch(setNewAccessToken(newAccessToken));
        dispatch(authInitSuccess());
        scheduleRefresh(newAccessToken); // schedule next refresh
      } else {
        if (!isMountedRef.current) return;
        console.error(
          "Refresh response missing accessToken/token, logging out",
        );
        dispatch(authInitFail());
        await handleLogout();
      }
    } catch (error: any) {
      const status = error?.status;
      const isAuthError = status === 401 || status === 403;
      const isServerError = typeof status === "number" && status >= 500;
      const isTransientError =
        status === "FETCH_ERROR" ||
        status === "TIMEOUT_ERROR" ||
        status === "PARSING_ERROR";

      const willRetry =
        (isTransientError || isServerError) &&
        refreshTokenRef.current &&
        retryCountRef.current < MAX_TRANSIENT_RETRIES;
      if (!willRetry) {
        console.error("Refresh failed:", error);
      }
      if (isMountedRef.current && isAuthError) {
        dispatch(authInitFail());
        await handleLogout();
      } else if (
        isMountedRef.current &&
        (isTransientError || isServerError) &&
        refreshTokenRef.current &&
        retryCountRef.current < MAX_TRANSIENT_RETRIES
      ) {
        retryCountRef.current += 1;
        const backoff = Math.min(
          MAX_BACKOFF_MS,
          TRANSIENT_RETRY_MS * Math.pow(2, retryCountRef.current - 1),
        );
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          () => doRefreshRef.current?.(),
          backoff,
        );
      } else if (isMountedRef.current) {
        // Exhausted retries — treat as auth failure
        dispatch(authInitFail());
        await handleLogout();
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [triggerRefresh, dispatch, handleLogout, scheduleRefresh]);

  // Keep the ref in sync so the setTimeout callback always calls the latest doRefresh
  useLayoutEffect(() => {
    doRefreshRef.current = doRefresh;
  }, [doRefresh]);

  useEffect(() => {
    if (!userDetails?.refreshToken) return;
    isMountedRef.current = true;
    retryCountRef.current = 0; // reset retry budget on new session / token rotation

    // Mark auth initialization as started
    dispatch(authInitStart());

    // Refresh immediately when access token is missing/expired, otherwise schedule.
    if (!userDetails?.token || isTokenExpired(userDetails.token)) {
      doRefreshRef.current?.();
    } else {
      scheduleRefresh(userDetails.token);
      // If token is valid, auth initialization is successful
      dispatch(authInitSuccess());
    }

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // Intentional dependency choice:
    // - This effect keys off refreshToken (session boundary) only.
    // - Access-token refresh done by this hook schedules the next timer inside doRefresh.
    // - If another flow updates accessToken without changing refreshToken,
    //   this effect will not re-run and the existing schedule is kept.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.refreshToken]);

  // When the user returns / switches back to the tab,
  // setTimeout timers may have drifted or not fired. The visibilitychange
  // event fires reliably on wake, so we use it to check & refresh immediately.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (!refreshTokenRef.current) return;

      // Read latest token from the ref (always current, no stale closure)
      const currentToken = tokenRef.current;
      if (!currentToken || isTokenExpired(currentToken)) {
        doRefreshRef.current?.();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // All values are read from refs — no deps needed, registered once.
  }, []);
};
