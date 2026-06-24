import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "../../lib/helpers";

/** Raw shape returned by GET /employers/bench-resources/:id */
export interface BenchResourceRawDto {
  id: number;
  employerProfileId?: number;
  resourceName?: string;
  name?: string;
  currentRole?: string;
  role?: string;
  about?: string;
  professionalSummary?: string;
  location?: string;
  city?: string;
  country?: string;
  skills?: string | string[];
  technicalSkills?: string | string[];
  primarySkills?: string[];
  secondarySkills?: string[];
  experienceYears?: number | string;
  experience?: number | string;
  totalExperience?: string;
  hourlyRate?: number | { min: number; max: number };
  hourlyRateMin?: number | string;
  hourlyRateMax?: number | string;
  expectedSalary?: { min?: number; max?: number };
  expectedSalaryMin?: number | string;
  expectedSalaryMax?: number | string;
  currency?: string;
  certifications?: Array<
    | string
    | {
      name?: string;
      title?: string;
      issuer?: string;
      year?: string;
      issueDate?: string;
    }
  >;
  workExperience?: Array<{
    role?: string;
    companyName?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    description?: string | string[];
  }>;
  projects?: Array<{
    name?: string;
    title?: string;
    description?: string;
    technologies?: string[];
    techStack?: string[];
    url?: string;
    projectUrl?: string;
  }>;
  resumes?: Array<{
    id: number;
    originalName: string;
    mimeType?: string;
    fileSize?: number;
    uploadedAt?: string;
    isDefault?: boolean;
  }>;
  resumePath?: string;
  resumeOriginalName?: string;
  deploymentPreference?: string | string[];
  availableFrom?: string;
  availability?: string;
  availableIn?: string;
  minimumContractDuration?: number;
  category?: string;
  designation?: string;
  employeeId?: string;
  refCode?: string;
  englishLevel?: string;
  englishProficiency?: string;
  email?: string;
  mobileNumber?: string;
  userId?: number;
  isActive?: boolean;
  requireNonSolicitation?: boolean;
  availableForDeployment?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BenchResourceResponse {
  success: boolean;
  data: BenchResourceRawDto;
}

export interface ShortlistedBenchDetail {
  talentId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
}
export interface BenchTestResult {
  id: number;
  title: string;
  status: string;
  created_at: string;
  candidate_email: string;
  job_id: number | null;
  job_title: string | null;
  company_name: string | null;
}


export const benchApi = createApi({
  reducerPath: "benchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseURL,
    prepareHeaders: (headers) => {
      const authHeaders = getAuthHeaders() as { Authorization?: string };
      if (authHeaders.Authorization) {
        headers.set("Authorization", authHeaders.Authorization);
      }
      return headers;
    },
  }),
  tagTypes: ["BenchResources"],
  endpoints: (builder) => ({
    postBenchResource: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "employers/post-bench-resource",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["BenchResources"],
    }),
    getBenchResources: builder.query<any, any>({
      query: (params) => ({
        url: "employers/bench-resources",
        method: "GET",
        params: params,
      }),
      providesTags: ["BenchResources"],
    }),
    deleteBenchResource: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `employers/bench-resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BenchResources"],
    }),



    permanentDeleteBenchResource: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `employers/bench-resources/${id}/permanent`,
        method: "DELETE",
      }),
      invalidatesTags: ["BenchResources"],
    }),

    // shortlisting....
    getShortlistedBenchResourceIds: builder.query<{ success: boolean; data: ShortlistedBenchDetail[] }, void>({
      query: () => ({
        url: 'employers/bench-resources/shortlisted-ids',
        method: 'GET',
      }),
      providesTags: ['BenchResources'],
    }),

    // to restore bench resources

    restoreBenchResource: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `employers/bench-resources/${id}/restore`,
        method: "PUT",
      }),
      invalidatesTags: ["BenchResources"],
    }),

    getTestByBenchEmail: builder.query<{ success: boolean; data: BenchTestResult[] }, string>({
  query: (email) => ({
    url: `coding/tests/by-email?candidateEmail=${email}`,
    method: 'GET',
  }),
}),

getBenchTestReport: builder.query<{ success: boolean; data: any }, number>({
  query: (id) => ({
    url: `coding/tests/report/${id}`,
    method: 'GET',
  }),
}),



    getBenchResourceById: builder.query<BenchResourceResponse, number | string>(
      {
        query: (id) => ({
          url: `employers/bench-resources/${id}`,
          method: "GET",
        }),
        providesTags: ["BenchResources"],
      },
    ),
    updateBenchResource: builder.mutation<
      any,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `employers/bench-resources/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["BenchResources"],
    }),
    viewBenchResume: builder.query<string, number | string>({
      query: (id) => ({
        method: "GET",
        url: `employers/bench-resources/${id}/resume`,
        responseHandler: async (response: Response) => {
          if (!response.ok) throw new Error("Failed to fetch resume");
          return response.blob();
        },
      }),
      transformResponse: (blob: Blob) => URL.createObjectURL(blob),
      keepUnusedDataFor: 0,
    }),
    downloadBenchResume: builder.mutation<void, number>({
      queryFn: async (id, _queryApi, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `employers/bench-resources/${id}/resume`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        });

        if (result.error) return { error: result.error };

        // Handle download immediately, don't return the blob
        const blob = result.data as Blob;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resume.pdf`; // You can pass filename as part of the mutation arg
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        return { data: undefined }; // Return void instead of blob
      },
    }),
  }),
});

export const {
  usePostBenchResourceMutation,
  useGetBenchResourcesQuery,
  useGetTestByBenchEmailQuery,
  useGetBenchTestReportQuery,
  useDownloadBenchResumeMutation,
  useUpdateBenchResourceMutation,
  useDeleteBenchResourceMutation,
  useGetBenchResourceByIdQuery,
  useLazyViewBenchResumeQuery,
  useRestoreBenchResourceMutation,
  useGetShortlistedBenchResourceIdsQuery,
  usePermanentDeleteBenchResourceMutation,
} = benchApi;
