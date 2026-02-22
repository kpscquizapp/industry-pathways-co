import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/app/queries/loginApi";
import { RootState } from "@/app/store";
import { removeUser } from "@/app/slices/userAuth";
import { employerApi } from "@/app/queries/employerApi";
import { profileApi } from "@/app/queries/profileApi";

const dispatch = useDispatch();

const resetCache = () => {
  dispatch(employerApi.util.resetApiState());
  dispatch(profileApi.util.resetApiState());
};

const useLogout = () => {
  const user = useSelector((state: any) => state.user.userDetails);
  const navigate = useNavigate();

  const [logout, { isLoading }] = useLogoutMutation();

  const { refreshToken } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    if (!refreshToken) {
      dispatch(removeUser());
      resetCache();
      navigate("/");
      return;
    }

    try {
      await logout(refreshToken).unwrap();
      dispatch(removeUser());
      resetCache();
      navigate("/");
    } catch (error) {
      console.error("Backend logout failed", error);
      dispatch(removeUser());
      resetCache();
      navigate("/");
    }
  };

  return [handleLogout, isLoading, user];
};

export default useLogout;
