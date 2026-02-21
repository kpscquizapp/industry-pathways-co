import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "../../lib/helpers";

export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface JobSkill {
  name?: string;
  [key: string]: unknown;
}

export interface Job {
  id: number | string;
  title?: string;
  skills?: string | Array<string | JobSkill>;
  [key: string]: unknown;
}

export interface MatchExpectedSalary {
  min?: number;
  max?: number;
  [key: string]: unknown;
}

export interface Match {
  id: number;
  name?: string;
  role?: string;
  matchScore?: number;
  skills?: string[] | string;
  experience?: number | string;
  hourlyRate?: number;
  expectedSalary?: MatchExpectedSalary;
  source?: "bench" | "individual" | string;
  location?: string;
  englishLevel?: string;
  certifications?: unknown;
  about?: string;
  workExperience?: unknown;
  projects?: unknown;
  [key: string]: unknown;
}

export interface EmployerJobsResponse {
  data: Job[];
  meta?: Pagination;
  [key: string]: unknown;
}

export interface JobMatchesResponse {
  data: Match[];
  meta?: Pagination;
  [key: string]: unknown;
}

export interface GetEmployerJobsArgs {
  page?: number;
  limit?: number;
}

export interface GetJobMatchesArgs {
  id: string;
  page?: number;
  limit?: number;
}

export const aiShortlistApi = createApi({
  reducerPath: "aiShortlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseURL,
    prepareHeaders: (headers) => {
      const authHeaders = getAuthHeaders();

      Object.entries(authHeaders).forEach(([key, value]) => {
        if (value) {
          headers.set(key, String(value));
        }
      });

      return headers;
    },
  }),
  tagTypes: ["AiShortlistJobs", "AiShortlistMatches"],
  endpoints: (builder) => ({
    getEmployerJobs: builder.query<EmployerJobsResponse, GetEmployerJobsArgs>({
      query: ({ page = 1, limit = 50 }) => ({
        method: "GET",
        url: "employers/jobs",
        params: { page, limit },
      }),
      providesTags: ["AiShortlistJobs"],
    }),
    getJobMatches: builder.query<JobMatchesResponse, GetJobMatchesArgs>({
      query: ({ id, page = 1, limit = 20 }) => ({
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
