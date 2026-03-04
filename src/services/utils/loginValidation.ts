import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const CREDENTIAL_ERROR_MSG = "Please check your credentials";

export type LoginField = "email" | "password";

export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginFieldErrors = Partial<Record<LoginField, string>>;

export const LOGIN_VALIDATION = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate: (email: string) => {
      const trimmed = email?.trim() ?? "";
      if (!trimmed) return "Email address is required";
      if (!LOGIN_VALIDATION.email.regex.test(trimmed)) {
        return "Please enter a valid email address";
      }
      return null;
    },
  },
  password: {
    validate: (password: string) => {
      if (!password) return "Password is required";
      if (password.length < 8) return "Password must be at least 8 characters";
      return null;
    },
  },
};

export const sanitizeLoginEmail = (email: string) => email.toLowerCase().trim();

export const validateLoginField = (
  field: LoginField,
  formData: LoginFormData,
): string | null => {
  if (field === "email") return LOGIN_VALIDATION.email.validate(formData.email);
  return LOGIN_VALIDATION.password.validate(formData.password);
};

export const validateLoginForm = (
  formData: LoginFormData,
): {
  errors: LoginFieldErrors;
  firstError: string | null;
} => {
  const errors: LoginFieldErrors = {};

  const emailError = LOGIN_VALIDATION.email.validate(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = LOGIN_VALIDATION.password.validate(formData.password);
  if (passwordError) errors.password = passwordError;

  const firstError = Object.values(errors)[0] ?? null;

  return { errors, firstError };
};

export const clearLoginFieldErrors = (
  prevErrors: Record<string, string>,
  field: LoginField,
): Record<string, string> => {
  const newErrors = { ...prevErrors };
  delete newErrors[field];

  const otherField = field === "email" ? "password" : "email";
  if (prevErrors[otherField] === CREDENTIAL_ERROR_MSG) {
    delete newErrors[otherField];
  }

  return newErrors;
};

export const clearCredentialErrors = (
  prevErrors: Record<string, string>,
): Record<string, string> => {
  const newErrors = { ...prevErrors };

  for (const key of Object.keys(newErrors)) {
    if (newErrors[key] === CREDENTIAL_ERROR_MSG) {
      delete newErrors[key];
    }
  }

  return newErrors;
};

const extractApiMessage = (error: FetchBaseQueryError): string | null => {
  if (
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof (error.data as { message: string }).message === "string"
  ) {
    return (error.data as { message: string }).message;
  }

  return null;
};

const isStatusError = (
  error: unknown,
): error is { status: unknown; data?: unknown } => {
  return typeof error === "object" && error != null && "status" in error;
};

export const getLoginErrorDetails = (
  error: unknown,
): {
  message: string;
  hasCredentialError: boolean;
} => {
  let message = "Login failed. Please try again.";
  let hasCredentialError = false;

  if (isStatusError(error)) {
    if (typeof error.status === "string") {
      if (error.status === "FETCH_ERROR") {
        message =
          "Network error. Please check your internet connection and try again.";
      } else if (error.status === "TIMEOUT_ERROR") {
        message = "Request timed out. Please try again in a moment.";
      } else if (error.status === "PARSING_ERROR") {
        message = "Unexpected server response. Please try again later.";
      } else if (error.status === "CUSTOM_ERROR") {
        message = "Unable to complete login right now. Please try again.";
      }
    } else if (typeof error.status === "number") {
      if (error.status === 401 || error.status === 404) {
        message =
          "Invalid email or password. Please check your credentials and try again.";
        hasCredentialError = true;
      } else if (error.status === 403) {
        message = "Your account has been suspended. Please contact support.";
      } else if (error.status === 429) {
        message = "Too many login attempts. Please try again in a few minutes.";
      } else if (error.status === 500 || error.status === 503) {
        message = "Server error. Please try again later or contact support.";
      } else {
        const apiMessage = extractApiMessage(error as FetchBaseQueryError);
        if (apiMessage) message = apiMessage;
      }
    }
  } else if (error instanceof Error) {
    message = error.message || message;
  }

  return { message, hasCredentialError };
};
