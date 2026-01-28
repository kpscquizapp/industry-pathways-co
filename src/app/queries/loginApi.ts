import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "../../lib/helpers";

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
    createCandidate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
        url: "jobboard/register/candidate",
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
        url: "auth/login",
      }),
    }),
    getRefreshToken: builder.mutation({
      query: (data) => ({
        headers: getAuthHeaders(),
        method: "POST",
        url: `auth/refresh`,
        body: data,
      }),
    }),
    logout: builder.mutation<void, string>({
      query: (refreshToken) => ({
        headers: getAuthHeaders(),
        method: "POST",
        url: `auth/logout`, // sample api
        body: { refreshToken },
      }),
    }),
  }),
});

export const {
  useCreateEmployerMutation,
  useCreateCandidateMutation,
  useLoginMutation,
  useGetRefreshTokenMutation,
  useLogoutMutation,
} = loginApi;
