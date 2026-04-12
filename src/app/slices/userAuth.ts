import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenExpired } from "@/lib/helpers";
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
  authInitialized: boolean;
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
      const token = (parsed as any).token ?? null;
      const refreshToken = (parsed as any).refreshToken ?? null;

      // If the access token is expired but we still have a valid refresh token,
      // keep the session data so the refresh-token hook can obtain a new access token.
      // Only nuke the cookie when there's no refresh token at all.
      if (token && isTokenExpired(token)) {
        if (refreshToken) {
          // Clear only the expired access token; keep refreshToken & userDetails
          // so useFetchRefreshToken can silently refresh the session.
          return { ...parsed, token: null } as UserState;
        }
        // No refresh token either — fully unauthenticated
        Cookies.remove("userInfo");
        return null;
      }
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
  authInitialized: false,
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
    authInitStart: (state) => {
      state.authInitialized = false;
    },
    authInitSuccess: (state) => {
      state.authInitialized = true;
    },
    authInitFail: (state) => {
      state.authInitialized = true;
    },
  },
});

export const {
  setUser,
  removeUser,
  setNewAccessToken,
  authInitStart,
  authInitSuccess,
  authInitFail,
} = userAuth.actions;

export default userAuth.reducer;
