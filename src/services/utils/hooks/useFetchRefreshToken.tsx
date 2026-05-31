import { useEffect, useRef, useCallback } from "react";
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
import { REFRESH_TOKEN_LIFETIME_MS } from "../../../app/slices/authConstants";

const REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before expiry
const FALLBACK_REFRESH_MS = 55 * 60 * 1000; // fallback when exp claim missing
const TRANSIENT_RETRY_MS = 30_000; // base retry delay
const MAX_TRANSIENT_RETRIES = 5;
const MAX_BACKOFF_MS = 5 * 60 * 1000;
const REFRESH_API_TIMEOUT_MS = 15_000;

const isJwt = (t: string) => t.split(".").length === 3;

const isRefreshExpired = (token: string, issuedAt: number): boolean => {
  if (Date.now() - issuedAt >= REFRESH_TOKEN_LIFETIME_MS) return true;
  if (!isJwt(token)) return false;
  try {
    return getTokenExpiry(token) <= Date.now();
  } catch {
    return false;
  }
};

const calcRefreshDelay = (accessToken: string): number => {
  try {
    const ttl = getTokenExpiry(accessToken) - Date.now();
    if (ttl <= 0) return 5_000;
    return Math.max(
      5_000,
      ttl - Math.min(REFRESH_BUFFER_MS, Math.floor(ttl / 2)),
    );
  } catch {
    return FALLBACK_REFRESH_MS;
  }
};

export const useFetchRefreshToken = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [triggerRefresh] = useGetRefreshTokenMutation();
  const [logout] = useLogoutMutation();

  const refreshTokenRef = useRef(user?.refreshToken);
  const tokenRef = useRef(user?.token);
  const issuedAtRef = useRef<number>(user?.refreshTokenIssuedAt ?? Date.now());
  const isRefreshingRef = useRef(false);
  const isMountedRef = useRef(false);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // "Latest ref" pattern: direct render-time assignment keeps refs current
  // without useEffect firing after every render (consistent with doRefreshRef below)
  refreshTokenRef.current = user?.refreshToken;
  tokenRef.current = user?.token;

  // doRefresh is a hoisted function declaration — available here before its definition
  const doRefreshRef = useRef<() => Promise<void>>(doRefresh);
  doRefreshRef.current = doRefresh;

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback(
    (accessToken: string) => {
      clearTimer();
      timeoutRef.current = setTimeout(
        () => doRefreshRef.current(),
        calcRefreshDelay(accessToken),
      );
    },
    [clearTimer],
  );

  // dispatch(removeUser()) is intentionally NOT gated on isMountedRef —
  // dispatch is safe after unmount and must always run to prevent auth state
  // from getting stuck in authInitStart (= infinite loading screen).
  const handleLogout = useCallback(async () => {
    clearTimer();
    try {
      if (refreshTokenRef.current)
        await logout(refreshTokenRef.current).unwrap();
    } catch (e) {
      if (!isExpectedLogoutError(e)) console.error("Logout failed:", e);
    } finally {
      dispatch(removeUser());
    }
  }, [logout, dispatch, clearTimer]);

  // Hoisted function declaration — captured by doRefreshRef above on every render.
  // All referenced values are either stable useCallbacks or refs (always current).
  async function doRefresh() {
    if (isRefreshingRef.current) return;
    const refreshToken = refreshTokenRef.current;
    if (!refreshToken) return;

    isRefreshingRef.current = true;

    // Only flash the loader when the user is actually blocked (token already gone/expired).
    // Proactive pre-expiry background refreshes should be invisible.
    if (!tokenRef.current || isTokenExpired(tokenRef.current))
      dispatch(authInitStart());

    try {
      if (isRefreshExpired(refreshToken, issuedAtRef.current)) {
        dispatch(authInitFail());
        await handleLogout();
        return;
      }

      // Hard timeout — a hung request would keep authInitStart active forever.
      // .finally() ensures clearTimeout always runs regardless of success or failure,
      // and avoids the "variable used before assignment" TypeScript issue of let+try-finally.
      const req = triggerRefresh(refreshToken);
      const tid = setTimeout(() => req.abort(), REFRESH_API_TIMEOUT_MS);
      const result = await req.unwrap().finally(() => clearTimeout(tid));

      const newToken = result?.accessToken || result?.token;
      if (!newToken) {
        console.error("Refresh response missing token field; logging out.");
        dispatch(authInitFail());
        await handleLogout();
        return;
      }

      retryCountRef.current = 0;
      dispatch(setNewAccessToken(newToken));
      dispatch(authInitSuccess());
      if (isMountedRef.current) scheduleRefresh(newToken);
    } catch (err) {
      const { status, name: errName } = (err ?? {}) as {
        status?: unknown;
        name?: string;
      };
      const isAuth = status === 401 || status === 403;
      const isTransient =
        status === "FETCH_ERROR" ||
        status === "TIMEOUT_ERROR" ||
        status === "PARSING_ERROR" ||
        status === "ABORTED" ||
        errName === "AbortError";
      const isServer = typeof status === "number" && status >= 500;
      const canRetry =
        (isTransient || isServer) &&
        !!refreshTokenRef.current &&
        retryCountRef.current < MAX_TRANSIENT_RETRIES;

      if (!canRetry)
        console.error(`Refresh failed (status=${String(status)}):`, err);

      if (isAuth || !canRetry) {
        dispatch(authInitFail());
        await handleLogout();
      } else {
        retryCountRef.current++;
        const backoff = Math.min(
          MAX_BACKOFF_MS,
          TRANSIENT_RETRY_MS * 2 ** (retryCountRef.current - 1),
        );
        console.warn(
          `Refresh error — retry ${retryCountRef.current}/${MAX_TRANSIENT_RETRIES} in ${backoff}ms`,
        );

        if (isMountedRef.current) {
          clearTimer();
          timeoutRef.current = setTimeout(
            () => doRefreshRef.current(),
            backoff,
          );
        } else {
          // Unmounted during back-off — must still resolve auth state or the store
          // stays in authInitStart with nothing alive to ever clear it
          dispatch(authInitFail());
          await handleLogout();
        }
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }

  useEffect(() => {
    if (!user?.refreshToken) {
      // No session — resolve immediately so ProtectedLayout can redirect to login
      dispatch(authInitSuccess());
      return;
    }

    isMountedRef.current = true;
    retryCountRef.current = 0;
    issuedAtRef.current = user.refreshTokenIssuedAt ?? Date.now();
    dispatch(authInitStart());

    if (!user.token || isTokenExpired(user.token)) {
      doRefreshRef.current();
    } else {
      scheduleRefresh(user.token);
      dispatch(authInitSuccess());
    }

    return () => {
      isMountedRef.current = false;
      clearTimer();
    };
    // Intentional: only re-run on session boundary (refreshToken change).
    // Access-token rotation is handled inside doRefresh/scheduleRefresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.refreshToken]);

  // visibilitychange recovers timers that drifted while the tab was hidden/device slept
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible" || !refreshTokenRef.current)
        return;
      if (!tokenRef.current || isTokenExpired(tokenRef.current))
        doRefreshRef.current();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);
};
