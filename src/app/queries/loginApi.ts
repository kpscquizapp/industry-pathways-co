import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "../../lib/helpers";

interface ForgotPassword {
  code?: string;
  success: boolean;
  message: string;
}

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseURL,
  }),

  endpoints: (builder) => ({
    createEmployer: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
        url: "jobboard/register/employer",
      }),
    }),
    registerEmployer: builder.mutation({
      query: (formData) => ({
        method: "POST",
        body: formData,
        url: "auth/register-employer",
      }),
    }),
    registerHr: builder.mutation({
      query: (formData) => ({
        method: "POST",
        body: formData,
        url: "auth/register-hr",
      }),
    }),
    createCandidate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
        url: "auth/register-candidate",
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
        url: "auth/login",
      }),
    }),
    loginCandidate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
        url: "auth/login-candidate",
      }),
    }),
    loginEmployer: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
        url: "auth/login-employer",
      }),
    }),
    loginHr: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
        url: "auth/login-hr",
      }),
    }),
    checkExistingEmail: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "auth/check-email",
        body: data,
      }),
    }),
    sendVerificationOtp: builder.mutation<void, { email: string }>({
      query: (data) => ({
        method: "POST",
        url: "auth/send-verification-otp",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<void, { email: string; otp: string }>({
      query: (data) => ({
        method: "POST",
        url: "auth/verify-otp",
        body: data,
      }),
    }),
    getRefreshToken: builder.mutation<
      { accessToken?: string; token?: string },
      string
    >({
      query: (refreshToken) => ({
        method: "POST",
        url: `auth/refresh`,
        // Backend accepts both field names for compatibility
        body: { refreshToken, token: refreshToken },
      }),
    }),
    logout: builder.mutation<void, string>({
      query: (refreshToken) => ({
        headers: getAuthHeaders(),
        method: "POST",
        url: `auth/logout`,
        body: { refreshToken },
      }),
    }),
    forgotPassword: builder.mutation<ForgotPassword, { email: string }>({
      query: (data) => ({
        method: "POST",
        url: "jobboard/forgot-password",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      ForgotPassword,
      { token: string; password: string }
    >({
      query: (data) => ({
        method: "POST",
        url: "jobboard/reset-password",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateEmployerMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRegisterEmployerMutation,
  useRegisterHrMutation,
  useCreateCandidateMutation,
  useLoginMutation,
  useGetRefreshTokenMutation,
  useCheckExistingEmailMutation,
  useLogoutMutation,
  useLoginCandidateMutation,
  useLoginEmployerMutation,
  useLoginHrMutation,
  useSendVerificationOtpMutation,
  useVerifyOtpMutation,
} = loginApi;
