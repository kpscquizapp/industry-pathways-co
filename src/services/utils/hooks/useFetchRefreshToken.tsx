import { useEffect, useRef, useCallback } from "react";
import {
  useGetRefreshTokenMutation,
  useLogoutMutation,
} from "../../../app/queries/loginApi";
import { removeUser, setNewAccessToken } from "../../../app/slices/userAuth";
import { useDispatch, useSelector } from "react-redux";
import { isTokenExpired, getTokenExpiry } from "../../../lib/helpers";

const REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before expiry

export const useFetchRefreshToken = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.user);
  const [triggerRefresh] = useGetRefreshTokenMutation();
  const [logout] = useLogoutMutation();

  // Stable refs to avoid effect re-runs
  const refreshTokenRef = useRef(userDetails?.refreshToken);
  const accessTokenRef = useRef(userDetails?.token);
  const isRefreshingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doRefreshRef = useRef<() => Promise<void>>();

  useEffect(() => {
    refreshTokenRef.current = userDetails?.refreshToken;
    accessTokenRef.current = userDetails?.token;
  }, [userDetails?.refreshToken, userDetails?.token]);

  const handleLogout = useCallback(async () => {
    try {
      await logout(refreshTokenRef.current).unwrap();
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
      delay = Math.max(0, exp - Date.now() - REFRESH_BUFFER_MS);
    } catch {
      delay = 55 * 60 * 1000; // fallback if exp claim is missing: 55 min
    }

    timeoutRef.current = setTimeout(() => doRefreshRef.current?.(), delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    if (!refreshTokenRef.current) return;

    isRefreshingRef.current = true;
    try {
      const result = await triggerRefresh({
        refreshToken: refreshTokenRef.current,
      }).unwrap();

      const newAccessToken = result?.accessToken;
      if (newAccessToken) {
        dispatch(setNewAccessToken(newAccessToken));
        scheduleRefresh(newAccessToken); // schedule next refresh
      } else {
        console.error("Refresh response missing accessToken, logging out");
        await handleLogout();
      }
    } catch (error: any) {
      console.error("Refresh failed:", error);
      const status = error?.status;
      const msg =
        typeof error?.data?.message === "string"
          ? error.data.message.toLowerCase()
          : "";
      if (
        status === 401 ||
        status === 403 ||
        msg.includes("invalid") ||
        msg.includes("expired")
      ) {
        await handleLogout();
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [triggerRefresh, dispatch, handleLogout, scheduleRefresh]);

  // Keep the ref in sync so the setTimeout callback always calls the latest doRefresh
  doRefreshRef.current = doRefresh;

  useEffect(() => {
    if (!userDetails?.refreshToken || !userDetails?.token) return;

    // Kick off immediately if already expired, otherwise schedule
    if (isTokenExpired(userDetails.token)) {
      doRefresh();
    } else {
      scheduleRefresh(userDetails.token);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // Only run on mount / login — refs handle token updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.refreshToken]);
};
