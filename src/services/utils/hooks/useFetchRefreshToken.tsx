import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import {
  useGetRefreshTokenMutation,
  useLogoutMutation,
} from "../../../app/queries/loginApi";
import { removeUser, setNewAccessToken } from "../../../app/slices/userAuth";
import { useDispatch, useSelector } from "react-redux";
import { isTokenExpired, getTokenExpiry } from "../../../lib/helpers";

const REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before expiry
const FALLBACK_REFRESH_MS = 55 * 60 * 1000; // used when token has no exp claim
const TRANSIENT_RETRY_MS = 30_000; // 30s
const MAX_TRANSIENT_RETRIES = 5; // 5 retries

export const useFetchRefreshToken = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.user);
  const [triggerRefresh] = useGetRefreshTokenMutation();
  const [logout] = useLogoutMutation();

  // Stable refs to avoid effect re-runs
  const refreshTokenRef = useRef(userDetails?.refreshToken);
  const isRefreshingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doRefreshRef = useRef<(() => Promise<void>) | null>(null);
  const isMountedRef = useRef(false);
  const retryCountRef = useRef(0);

  useEffect(() => {
    refreshTokenRef.current = userDetails?.refreshToken;
  }, [userDetails?.refreshToken]);

  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = refreshTokenRef.current;
      if (refreshToken) {
        await logout(refreshToken).unwrap();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(removeUser());
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
        delay = 0;
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
    if (!refreshTokenRef.current) return;

    isRefreshingRef.current = true;
    try {
      if (!isMountedRef.current) return;
      const result = await triggerRefresh({
        refreshToken: refreshTokenRef.current,
      }).unwrap();

      const newAccessToken = result?.accessToken;

      if (newAccessToken) {
        if (!isMountedRef.current) return;
        retryCountRef.current = 0; // reset on success
        dispatch(setNewAccessToken(newAccessToken));
        scheduleRefresh(newAccessToken); // schedule next refresh
      } else {
        if (!isMountedRef.current) return;
        console.error("Refresh response missing accessToken, logging out");
        await handleLogout();
      }
    } catch (error: any) {
      console.error("Refresh failed:", error);
      const status = error?.status;

      if (isMountedRef.current && (status === 401 || status === 403)) {
        await handleLogout();
      } else if (
        isMountedRef.current &&
        refreshTokenRef.current &&
        retryCountRef.current < MAX_TRANSIENT_RETRIES
      ) {
        retryCountRef.current += 1;
        const backoff =
          TRANSIENT_RETRY_MS * Math.pow(2, retryCountRef.current - 1);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          () => doRefreshRef.current?.(),
          backoff,
        );
      } else if (isMountedRef.current) {
        // Exhausted retries — treat as auth failure
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

    // Refresh immediately when access token is missing/expired, otherwise schedule.
    if (!userDetails?.token || isTokenExpired(userDetails.token)) {
      doRefreshRef.current?.();
    } else {
      scheduleRefresh(userDetails.token);
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
};
