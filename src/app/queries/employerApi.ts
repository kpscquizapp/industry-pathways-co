import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "@/lib/helpers";

interface UpdateEmployerProfile {
  companyName?: string;
  industry?: string;
  location?: string;
  companySize?: string;
  website?: string;
  description?: string;
}

export interface CandidateWorkExperience {
  id: number;
  companyName: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string;
}

export interface CandidateProject {
  id: number;
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
}

export interface CandidateCertification {
  id: number;
  name: string;
  issuer: string;
  year?: string;
}

export interface CandidateResume {
  id: number;
  candidateProfileId: number;
  filePath: string;
  originalName: string;
  fileSize?: number;
  mimeType?: string;
  isDefault?: boolean;
}

export interface CandidateProfile {
  id: number;
  userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  location?: string;
  city?: string;
  country?: string;
  candidateType?: string;
  primaryJobRole?: string;
  bio?: string;
  headline?: string;
  resourceType?: string;
  availability?: string;
  availableIn?: string;
  yearsExperience?: number;
  primarySkills?: string[];
  secondarySkills?: string[];
  preferredWorkType?: string | string[];
  preferredJobLocations?: string[];
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  englishProficiency?: string;
  enableAiMatching?: boolean;
  workExperiences: CandidateWorkExperience[];
  projects: CandidateProject[];
  certifications: CandidateCertification[];
  resumes: CandidateResume[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CandidateByIdResponse {
  success: boolean;
  data: CandidateProfile;
}

export const employerApi = createApi({
  reducerPath: "employerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseURL,
    prepareHeaders: (headers) => {
      const { Authorization } = getAuthHeaders();
      if (Authorization) {
        headers.set("Authorization", Authorization);
      }
      return headers;
    },
  }),
  tagTypes: ["EmployerProfile", "EmployerProfileImage"],
  endpoints: (builder) => ({
    updateEmployerProfile: builder.mutation<void, UpdateEmployerProfile>({
      query: (data) => ({
        url: "jobboard/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["EmployerProfile"],
    }),
    uploadProfileImage: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "jobboard/profile/image/employer-hr",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["EmployerProfile", "EmployerProfileImage"],
    }),
    getEmployerProfileImage: builder.query<string | null, string>({
      query: (id) => ({
        url: `users/${id}/avatar/business`,
        method: "GET",
        responseHandler: async (response) => {
          if (response.status === 404) return null;

          const blob = await response.blob();
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () =>
              reject(new Error("Failed to read image blob"));
            reader.readAsDataURL(blob);
          });
        },
        validateStatus: (response) =>
          response.status === 200 || response.status === 404,
      }),
      providesTags: ["EmployerProfileImage"],
    }),
    removeProfileImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}/avatar/business`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployerProfileImage"],
    }),
    getEmployerProfile: builder.query<any, void>({
      query: () => ({
        method: "GET",
        url: "jobboard/profile",
      }),
      providesTags: ["EmployerProfile"],
    }),
    getCandidateById: builder.query<CandidateByIdResponse, string | number>({
      query: (id) => ({
        method: "GET",
        url: `employers/candidates/${id}`,
      }),
    }),
    viewCandidateResume: builder.query<
      string,
      { candidateId: string | number; resumeId: number }
    >({
      query: ({ candidateId, resumeId }) => ({
        method: "GET",
        url: `employers/candidates/${candidateId}/resume/${resumeId}?view=inline`,
        responseHandler: async (response: Response) => {
          if (!response.ok) throw new Error("Failed to fetch resume");
          return response.blob();
        },
      }),
      transformResponse: (blob: Blob) => URL.createObjectURL(blob),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useUpdateEmployerProfileMutation,
  useUploadProfileImageMutation,
  useGetEmployerProfileImageQuery,
  useRemoveProfileImageMutation,
  useGetEmployerProfileQuery,
  useGetCandidateByIdQuery,
  useLazyViewCandidateResumeQuery,
} = employerApi;
