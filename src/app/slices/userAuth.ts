import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenExpired } from "@/lib/helpers";
import Cookies from "js-cookie";
import { REFRESH_TOKEN_LIFETIME_DAYS } from "./authConstants";

export type UserState = {
  token: string | null;
  refreshToken: string | null;
  /** Unix-ms when the refresh token was first stored — used for 30-day lifetime enforcement */
  refreshTokenIssuedAt: number | null;
  userDetails: {
    id?: string;
    uuid?: string;
    role?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    admin?: boolean;
  } | null;
  /** false = bootstrapping (show loader), true = done (check token for redirect) */
  authInitialized: boolean;
};

export type SetUserPayload = {
  accessToken: string;
  refreshToken: string;
  user: UserState["userDetails"];
};

type CookiePayload = Pick<
  UserState,
  "token" | "refreshToken" | "refreshTokenIssuedAt" | "userDetails"
>;

// Defined before the cookieData IIFE — const arrow functions are not hoisted
const cookieOptions = (): Cookies.CookieAttributes => ({
  expires: REFRESH_TOKEN_LIFETIME_DAYS,
  path: "/",
  secure:
    typeof window !== "undefined" && window.location.protocol === "https:",
  sameSite: "strict",
});

const COOKIE_KEY = "userInfo";
const removeCookie = () => Cookies.remove(COOKIE_KEY, { path: "/" });
const saveCookie = (d: CookiePayload) =>
  Cookies.set(COOKIE_KEY, JSON.stringify(d), cookieOptions());

// Picks and validates only known fields — prevents stale/tampered cookies from
// injecting bad data into Redux state (e.g. from an older app version).
const sanitizeCookie = (raw: unknown): CookiePayload | null => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  return {
    token: typeof r.token === "string" ? r.token : null,
    refreshToken: typeof r.refreshToken === "string" ? r.refreshToken : null,
    refreshTokenIssuedAt:
      typeof r.refreshTokenIssuedAt === "number"
        ? r.refreshTokenIssuedAt
        : null,
    userDetails:
      r.userDetails &&
      typeof r.userDetails === "object" &&
      !Array.isArray(r.userDetails)
        ? (r.userDetails as UserState["userDetails"])
        : null,
  };
};

const cookieData = (() => {
  try {
    const data = sanitizeCookie(JSON.parse(Cookies.get(COOKIE_KEY) ?? "null"));
    if (!data) return null;
    if (data.token && isTokenExpired(data.token)) {
      if (!data.refreshToken) {
        removeCookie();
        return null;
      }
      // Strip expired access token; keep refreshToken so the hook can silently refresh
      const sanitized: CookiePayload = { ...data, token: null };
      saveCookie(sanitized);
      return sanitized;
    }
    return data;
  } catch {
    removeCookie();
    return null;
  }
})();

const initialState: UserState = {
  token: cookieData?.token ?? null,
  refreshToken: cookieData?.refreshToken ?? null,
  refreshTokenIssuedAt: cookieData?.refreshTokenIssuedAt ?? null,
  userDetails: cookieData?.userDetails ?? null,
  authInitialized: false,
};

export const userAuth = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<SetUserPayload>) => {
      const { accessToken: token, refreshToken, user: userDetails } = payload;
      const refreshTokenIssuedAt = Date.now();
      saveCookie({ token, refreshToken, refreshTokenIssuedAt, userDetails });
      Object.assign(state, {
        token,
        refreshToken,
        refreshTokenIssuedAt,
        userDetails,
      });
    },
    removeUser: (state) => {
      removeCookie();
      // authInitialized=true ensures ProtectedLayout can redirect even if
      // authInitFail was not dispatched before this action
      Object.assign(state, {
        token: null,
        refreshToken: null,
        refreshTokenIssuedAt: null,
        userDetails: null,
        authInitialized: true,
      });
    },
    setNewAccessToken: (state, { payload: token }: PayloadAction<string>) => {
      state.token = token;
      const { refreshToken, refreshTokenIssuedAt, userDetails } = state; // refreshTokenIssuedAt unchanged — only the access token rotated
      saveCookie({ token, refreshToken, refreshTokenIssuedAt, userDetails });
    },
    authInitStart: (state) => {
      state.authInitialized = false;
    },
    authInitSuccess: (state) => {
      state.authInitialized = true;
    },
    authInitFail: (state) => {
      state.authInitialized = true;
    }, // init done, just failed
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
