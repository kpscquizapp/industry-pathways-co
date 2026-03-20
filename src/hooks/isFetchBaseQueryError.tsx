import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}
