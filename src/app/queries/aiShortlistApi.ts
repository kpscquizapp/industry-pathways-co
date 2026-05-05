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
  name: string;
  [key: string]: unknown;
}

export type EntityId = number | string;

export interface Job {
  id: EntityId;
  title: string;
  status?: string;
  category?: string;
  description?: string;
  companyName?: string;
  employmentType?: string;
  location?: string;
  numberOfOpenings?: number;
  createdAt?: string;
  skills?: Array<string | JobSkill>;
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
  /** Backend-persisted shortlist status */
  isShortlisted?: boolean;
  /** Pipeline stage persisted in EmployerShortlist — returned by GET /jobs/:id/matches */
  stage?: "shortlisted" | "invited" | null;
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

export interface ShortlistCandidateArgs {
  jobId: EntityId;
  talentId: EntityId;
  talentSource: "candidate" | "bench";
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
        url: `jobs/${id}/matches-ai`,
        params: { page: resolvePage(page), limit: resolveLimit(limit) },
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "AiShortlistMatches", id },
        "AiShortlistMatches",
      ],
      // Keep unused cache alive for 30s
      keepUnusedDataFor: 30,
    }),
    shortlistCandidate: builder.mutation<
      { success: boolean; data?: unknown },
      ShortlistCandidateArgs
    >({
      query: ({ jobId, talentId, talentSource }) => ({
        method: "POST",
        url: `jobs/${jobId}/shortlist`,
        body: { talentId, talentSource },
      }),
      // Auto-refetch matches after shortlisting
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "AiShortlistMatches", id: String(jobId) },
      ],
    }),
    removeShortlistCandidate: builder.mutation<
      { success: boolean; message?: string },
      ShortlistCandidateArgs
    >({
      query: ({ jobId, talentId, talentSource }) => ({
        method: "DELETE",
        url: `jobs/${jobId}/shortlist`,
        body: { talentId, talentSource },
      }),
      // Auto-refetch matches after removing shortlist
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "AiShortlistMatches", id: String(jobId) },
      ],
    }),
    createCodingTest: builder.mutation<
      any,
      { jobRoles: string[]; testLevel: string; durationMinutes: number }
    >({
      query: (body) => ({
        method: "POST",
        url: "coding/tests",
        body,
      }),
    }),
    sendInviteEmail: builder.mutation<
      any,
      { codingTestId: string; candidateEmail?: string; expiresInHours?: number }
    >({
      query: ({ codingTestId, ...body }) => ({
        method: "POST",
        url: `coding/tests/${codingTestId}/invite`,
        body,
      }),
      // Refresh matches after invite so the invited count updates in EmployerSkillTests
      invalidatesTags: ["AiShortlistMatches"],
    }),
    createCustomTest: builder.mutation<
      any,
      { title: string; questions: any[]; candidateEmail?: string }
    >({
      query: (body) => ({
        url: "/coding/tests/custom",
        method: "POST",
        body,
      }),
    }),
    updateCustomTest: builder.mutation<
      any,
      { id: number; title: string; questions: any[] }
    >({
      query: ({ id, ...body }) => ({
        url: `/coding/tests/${id}/custom`,
        method: "PUT",
        body,
      }),
    }),
    getCustomTestByCandidate: builder.query<any, { candidateEmail: string }>({
      query: ({ candidateEmail }) => ({
        method: "GET",
        url: "coding/tests/by-candidate",
        params: { candidateEmail },
      }),
    }),
    getCustomTestsByEmployer: builder.query<any, void>({
      query: () => ({
        method: "GET",
        url: "coding/tests/all/custom",
      }),
    }),
    deleteCustomQuestion: builder.mutation<
      any,
      { testId: number; questionIndex: number }
    >({
      query: ({ testId, questionIndex }) => ({
        method: "DELETE",
        url: `coding/tests/${testId}/questions/${questionIndex}`,
      }),
    }),
    getProblems: builder.query<any, any>({
      query: (params) => ({
        url: "coding/problems",
        method: "GET",
        params,
      }),
    }),
    updateShortlistStage: builder.mutation<
      { success: boolean; message?: string },
      {
        jobId: EntityId;
        talentId: EntityId;
        talentSource: "candidate" | "bench";
        stage: "shortlisted" | "invited";
      }
    >({
      query: ({ jobId, ...body }) => ({
        method: "PATCH",
        url: `jobs/${jobId}/shortlist/stage`,
        body,
      }),
      // Refresh matches so the stage shows in the UI
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "AiShortlistMatches", id: String(jobId) },
      ],
    }),
  }),
});

export const {
  useGetEmployerJobsQuery,
  useGetJobMatchesQuery,
  useLazyGetJobMatchesQuery,
  useShortlistCandidateMutation,
  useRemoveShortlistCandidateMutation,
  useCreateCodingTestMutation,
  useSendInviteEmailMutation,
  useCreateCustomTestMutation,
  useUpdateCustomTestMutation,
  useUpdateShortlistStageMutation,
  useGetCustomTestByCandidateQuery,
  useGetCustomTestsByEmployerQuery,
  useDeleteCustomQuestionMutation,
  useGetProblemsQuery,
} = aiShortlistApi;
