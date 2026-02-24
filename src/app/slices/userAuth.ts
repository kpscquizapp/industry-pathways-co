import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export type SetUserPayload = {
  accessToken: string;
  refreshToken: string;
  user: UserState["userDetails"];
};

const cookieData = (() => {
  try {
    const raw = Cookies.get("userInfo");
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as UserState;
    }
    return null;
  } catch {
    Cookies.remove("userInfo"); // evict the bad cookie
    return null;
  }
})();

const initialState: UserState = {
  token: cookieData?.token ?? null,
  refreshToken: cookieData?.refreshToken ?? null,
  userDetails: cookieData?.userDetails ?? null,
};

const cookieOptions = (): Cookies.CookieAttributes => ({
  expires: 15,
  secure:
    typeof window !== "undefined" && window.location.protocol === "https:",
  sameSite: "strict",
});

export const userAuth = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const {
        accessToken: token,
        refreshToken,
        user: userDetails,
      } = action.payload;
      const payloadToStore = { token, refreshToken, userDetails };
      Cookies.set("userInfo", JSON.stringify(payloadToStore), cookieOptions());
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
    setNewAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      const payloadToStore = {
        token: action.payload,
        refreshToken: state.refreshToken,
        userDetails: state.userDetails,
      };
      Cookies.set("userInfo", JSON.stringify(payloadToStore), cookieOptions());
    },
  },
});

export const { setUser, removeUser, setNewAccessToken } = userAuth.actions;

export default userAuth.reducer;
