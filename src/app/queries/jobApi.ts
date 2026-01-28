import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "../../lib/helpers";

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseURL,
  }),
  tagTypes: ["Jobs", "DashboardJobs"],

  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => ({
        headers: getAuthHeaders(),
        method: "GET",
        url: "jobs",
      }),
      providesTags: ["Jobs"],
    }),

    getJobsById: builder.query({
      query: ({ id }) => ({
        headers: getAuthHeaders(),
        method: "GET",
        url: "employers/jobs",
        params: { id: id },
      }),
      providesTags: ["Jobs"],
    }),
    getDashboardJobs: builder.query({
      query: () => ({
        headers: getAuthHeaders(),
        method: "GET",
        url: "employers/dashboard",
      }),
      providesTags: ["DashboardJobs"],
    }),
    createJob: builder.mutation({
      query: (data) => ({
        headers: getAuthHeaders(),
        method: "POST",
        body: data,
        url: "jobs",
      }),
      invalidatesTags: ["Jobs", "DashboardJobs"],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetJobsQuery,
  useGetJobsByIdQuery,
  useGetDashboardJobsQuery,
} = jobApi;
