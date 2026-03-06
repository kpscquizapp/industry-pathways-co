import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginApi, useLogoutMutation } from "@/app/queries/loginApi";
import { RootState } from "@/app/store";
import { removeUser } from "@/app/slices/userAuth";
import { employerApi } from "@/app/queries/employerApi";
import { profileApi } from "@/app/queries/profileApi";
import { isTokenExpired } from "@/lib/helpers";

const isExpectedLogoutError = (error: any) => {
  const status = error?.status;
  const code = error?.data?.code;
  return status === 401 || status === 403 || code === "ERR_NO_TOKEN";
};

const useLogout = () => {
  const user = useSelector((state: any) => state.user.userDetails);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logout, { isLoading }] = useLogoutMutation();

  const { refreshToken, token } = useSelector(
    (state: RootState) => state.user,
  );

  const handleLogout = async () => {
    try {
      if (refreshToken && token && !isTokenExpired(token)) {
        await logout(refreshToken).unwrap();
      }
    } catch (error) {
      if (!isExpectedLogoutError(error)) {
        console.error("Backend logout failed", error);
      }
    } finally {
      navigate("/");
      // Let components unmount before clearing state
      setTimeout(() => {
        dispatch(removeUser());
        dispatch(employerApi.util.resetApiState());
        dispatch(profileApi.util.resetApiState());
        dispatch(loginApi.util.resetApiState());
      }, 0);
    }
  };

  return [handleLogout, isLoading, user];
};

export default useLogout;
