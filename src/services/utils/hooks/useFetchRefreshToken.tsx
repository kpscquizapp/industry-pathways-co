import { useEffect } from "react";
import {
  useGetRefreshTokenMutation,
  useLogoutMutation,
} from "../../../app/queries/loginApi";
import { removeUser, setNewAccessToken } from "../../../app/slices/userAuth";
import { useDispatch, useSelector } from "react-redux";
import { isTokenExpired } from "../../../lib/helpers";

const REFRESH_INTERVAL = 12 * 60 * 1000;

export const useFetchRefreshToken = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.user);

  const [triggerRefresh] = useGetRefreshTokenMutation();

  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (!userDetails?.refreshToken || !userDetails?.token) {
      return;
    }

    const handleLogoutUser = async () => {
      try {
        await logout(userDetails.refreshToken).unwrap();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    const refreshAccessToken = async () => {
      try {
        const result = await triggerRefresh({
          refreshToken: userDetails?.refreshToken,
        }).unwrap();
        const newAccessToken = result?.accessToken;

        if (newAccessToken) {
          dispatch(setNewAccessToken(newAccessToken));
        }
      } catch (error: any) {
        console.error("Refresh token failed:", error);

        if (
          error?.status === 401 ||
          error?.status === 403 ||
          error?.data?.message?.toLowerCase().includes("invalid") ||
          error?.data?.message?.toLowerCase().includes("expired")
        ) {
          await handleLogoutUser();
          dispatch(removeUser());
        }
      }
    };

    // Only refresh on mount if the token is already expired
    let expired = true;
    try {
      expired = isTokenExpired(userDetails.token);
    } catch {
      expired = true;
    }
    if (expired) {
      refreshAccessToken();
    }

    const intervalId = setInterval(refreshAccessToken, REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    userDetails?.refreshToken,
    userDetails?.token,
    logout,
    dispatch,
    triggerRefresh,
  ]);
};
