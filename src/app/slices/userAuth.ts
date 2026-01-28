import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export type UserState = {
  token: string | null;
  refreshToken: string | null;
  userDetails: {
    id?: string;
    uuid?: string;
    role?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    admin?: boolean;
  } | null;
};

const cookieData = Cookies.get("userInfo")
  ? JSON.parse(Cookies.get("userInfo") as string)
  : null;

  // console.log(cookieData, 'cookieData')
const initialState: UserState = {
  token: cookieData?.token ?? null,
  refreshToken: cookieData?.refreshToken ?? null,
  userDetails: cookieData?.userDetails ?? null,
};




export const userAuth = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { accessToken: token, refreshToken, user:userDetails } = action.payload;
      const payloadToStore = { token, refreshToken, userDetails  };
      Cookies.set("userInfo", JSON.stringify(payloadToStore), { expires: 15 });
      state.token = token;
      state.refreshToken = refreshToken;
      state.userDetails = userDetails;
    },
    removeUser: (state) => {
      Cookies.remove("userInfo");
      state.token = null;
      state.refreshToken = null;
      state.userDetails = null;
    },
    setNewAccessToken: (state, action) => {
      Cookies.set("userInfo", JSON.stringify({ ...state, token: action.payload }), { expires: 15 });
    },
  },
});

export const { setUser, removeUser,setNewAccessToken } = userAuth.actions;

export default userAuth.reducer;