// Single source of truth for auth token lifetimes.
// Imported by both userAuth.ts and useFetchRefreshToken.ts.

/** Must match the backend refresh-token TTL (30 days) */
export const REFRESH_TOKEN_LIFETIME_DAYS = 30;
export const REFRESH_TOKEN_LIFETIME_MS =
  REFRESH_TOKEN_LIFETIME_DAYS * 24 * 60 * 60 * 1000;
