type ErrorLike = {
  status?: unknown;
  data?: {
    code?: unknown;
  };
};

export const isExpectedLogoutError = (error: unknown): boolean => {
  const { status, data } = (error ?? {}) as ErrorLike;
  const code = data?.code;
  return status === 401 || status === 403 || code === "ERR_NO_TOKEN";
};
