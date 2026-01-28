import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/app/queries/loginApi";
import { RootState } from "@/app/store";
import { removeUser } from "@/app/slices/userAuth";

const useLogout = () => {
  const user = useSelector((state: any) => state.user.userDetails);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const { refreshToken } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    if (!refreshToken) {
      dispatch(removeUser());
      navigate("/");
      return;
    }

    try {
      await logout(refreshToken).unwrap();
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      console.error("Backend logout failed", error);
      dispatch(removeUser());
      navigate("/");
    }
  };

  return [handleLogout, isLoading, user];
};

export default useLogout;
