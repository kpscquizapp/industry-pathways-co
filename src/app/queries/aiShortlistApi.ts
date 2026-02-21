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

export type EntityId = number | string;

export interface Job {
  id: EntityId;
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
  id: EntityId;
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

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;

const resolvePage = (page?: number) =>
  Number.isFinite(page) && Number(page) > 0
    ? Math.floor(Number(page))
    : DEFAULT_PAGE;

const resolveLimit = (limit?: number) => {
  const parsedLimit =
    Number.isFinite(limit) && Number(limit) > 0
      ? Math.floor(Number(limit))
      : DEFAULT_LIMIT;
  return Math.min(parsedLimit, MAX_LIMIT);
};

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
      query: ({ page, limit }) => ({
        method: "GET",
        url: "employers/jobs",
        params: { page: resolvePage(page), limit: resolveLimit(limit) },
      }),
      providesTags: ["AiShortlistJobs"],
    }),
    getJobMatches: builder.query<JobMatchesResponse, GetJobMatchesArgs>({
      query: ({ id, page, limit }) => ({
        method: "GET",
        url: `jobs/${id}/matches`,
        params: { page: resolvePage(page), limit: resolveLimit(limit) },
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "AiShortlistMatches", id },
        "AiShortlistMatches",
      ],
    }),
  }),
});

export const {
  useGetEmployerJobsQuery,
  useGetJobMatchesQuery,
  useLazyGetJobMatchesQuery,
} = aiShortlistApi;
