import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/app/queries/loginApi";
import { RootState } from "@/app/store";
import { removeUser } from "@/app/slices/userAuth";
import { employerApi } from "@/app/queries/employerApi";
import { profileApi } from "@/app/queries/profileApi";

const useLogout = () => {
  const user = useSelector((state: any) => state.user.userDetails);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logout, { isLoading }] = useLogoutMutation();

  const { refreshToken } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    if (!refreshToken) {
      dispatch(removeUser());
      dispatch(employerApi.util.resetApiState());
      dispatch(profileApi.util.resetApiState());
      navigate("/");
      return;
    }

    try {
      await logout(refreshToken).unwrap();
      dispatch(removeUser());
      dispatch(employerApi.util.resetApiState());
      dispatch(profileApi.util.resetApiState());
      navigate("/");
    } catch (error) {
      console.error("Backend logout failed", error);
      dispatch(removeUser());
      dispatch(employerApi.util.resetApiState());
      dispatch(profileApi.util.resetApiState());
      navigate("/");
    }
  };

  return [handleLogout, isLoading, user];
};

export default useLogout;
