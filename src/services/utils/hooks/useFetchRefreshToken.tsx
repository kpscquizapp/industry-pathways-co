import { useEffect } from "react";
import Cookies from "js-cookie";
import { useGetRefreshTokenMutation, useLogoutMutation } from "../../../app/queries/loginApi";
import { removeUser, setNewAccessToken } from "../../../app/slices/userAuth";
import { useDispatch, useSelector } from "react-redux";

const REFRESH_INTERVAL = 12 * 60 * 1000; 

export const useFetchRefreshToken = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.user);

  const [triggerRefresh] = useGetRefreshTokenMutation();


  const [logout] = useLogoutMutation();


const handleLogoutUser = async () => {
    try {
        await logout('').unwrap();
        window.alert('')
    } catch (error) {
              window.alert('')

        console.error("Logout failed:", error);
    }
};
  useEffect(() => {
    if (!userDetails?.refreshToken || !userDetails?.token) {
      return;
    }

    const refreshAccessToken = async () => {
      try {
        const result = await triggerRefresh({ refreshToken:userDetails?.refreshToken }).unwrap();

        const newAccessToken =  result?.accessToken;

        if (newAccessToken) {
          dispatch(setNewAccessToken(newAccessToken));

          const existingUserInfo = Cookies.get("userInfo");
          if (existingUserInfo) {
            const parsed = JSON.parse(existingUserInfo);
            Cookies.set("userInfo", JSON.stringify({ ...parsed, token: newAccessToken }), {
              expires: 15,
            });
          }
        }
      } catch (error: any) {
        console.error("Refresh token failed:", error);

        if (error?.status === 401 || error?.data?.message?.includes("invalid")) {
          handleLogoutUser();
          dispatch(removeUser());
        }
      }
    };

    refreshAccessToken();

    const intervalId = setInterval(refreshAccessToken, REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [userDetails?.refreshToken, userDetails?.token, dispatch, triggerRefresh]);
};