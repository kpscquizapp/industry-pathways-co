import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "../../lib/helpers";

interface GetEmployerJobsArgs {
  page?: number;
  limit?: number;
}

interface GetEmployerJobsArgs {
  page?: number;
  limit?: number;
}

interface GetJobMatchesArgs {
  id: string;
  page?: number;
  limit?: number;
}

export const aiShortlistApi = createApi({
  reducerPath: "aiShortlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseURL,
  }),
  tagTypes: ["AiShortlistJobs", "AiShortlistMatches"],
  endpoints: (builder) => ({
    getEmployerJobs: builder.query<any, GetEmployerJobsArgs>({
      query: ({ page = 1, limit = 50 }) => ({
        headers: getAuthHeaders(),
        method: "GET",
        url: "employers/jobs",
        params: { page, limit },
      }),
      providesTags: ["AiShortlistJobs"],
    }),
    getJobMatches: builder.query<any, GetJobMatchesArgs>({
      query: ({ id, page = 1, limit = 20 }) => ({
        headers: getAuthHeaders(),
        method: "GET",
        url: `jobs/${id}/matches`,
        params: { page, limit },
      }),
      providesTags: ["AiShortlistMatches"],
    }),
  }),
});

export const {
  useGetEmployerJobsQuery,
  useGetJobMatchesQuery,
  useLazyGetJobMatchesQuery,
} = aiShortlistApi;
