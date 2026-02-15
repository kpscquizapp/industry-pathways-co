import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "@/lib/helpers";

const blobResponseHandler = (response: Response) => response.blob();

export const profileApi = createApi({
  reducerPath: "profileApi",
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
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: (data) => ({
        method: "GET",
        url: "jobboard/profile",
      }),
      providesTags: ["Profile"],
    }),
    viewResume: builder.query<string, { resumeId: number }>({
      query: ({ resumeId }) => ({
        url: `/jobboard/profile/resume/${resumeId}?view=inline`,
        responseHandler: blobResponseHandler,
      }),
      transformResponse: (blob: Blob) => URL.createObjectURL(blob),
      keepUnusedDataFor: 0, // Don't cache - immediately remove from store
    }),
    uploadResume: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "jobboard/profile/resume",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    setDefaultResume: builder.mutation<void, number>({
      query: (resumeId) => ({
        url: `jobboard/profile/resume/${resumeId}/default`,
        method: "PATCH",
      }),
      invalidatesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        method: "PUT",
        url: "jobboard/profile",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    removeSkill: builder.mutation<void, number>({
      query: (skillId) => ({
        method: "DELETE",
        url: `jobboard/profile/skills/${skillId}`,
      }),
      async onQueryStarted(skillId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          profileApi.util.updateQueryData("getProfile", undefined, (draft) => {
            if (!draft?.candidateProfile?.primarySkills) return;
            draft.candidateProfile.primarySkills =
              draft.candidateProfile.primarySkills.filter(
                (s: any) => String(s.id) !== String(skillId),
              );
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Profile"],
    }),
    removeWorkExperience: builder.mutation<void, number>({
      query: (workExperienceId) => ({
        method: "DELETE",
        url: `jobboard/profile/work-experience/${workExperienceId}`,
      }),
      invalidatesTags: ["Profile"],
    }),
    removeProject: builder.mutation<void, number>({
      query: (projectId) => ({
        method: "DELETE",
        url: `jobboard/profile/projects/${projectId}`,
      }),
      invalidatesTags: ["Profile"],
    }),
    removeCertificate: builder.mutation<void, number>({
      query: (certificateId) => ({
        method: "DELETE",
        url: `jobboard/profile/certifications/${certificateId}`,
      }),
      invalidatesTags: ["Profile"],
    }),
    removeResume: builder.mutation<void, number>({
      query: (resumeId) => ({
        method: "DELETE",
        url: `jobboard/profile/resume/${resumeId}`,
      }),
      invalidatesTags: ["Profile"],
    }),
    uploadProfileImage: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "jobboard/profile/image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    getProfileImage: builder.query<string, string>({
      query: (id) => ({
        url: `users/${id}/avatar`,
        method: "GET",
        responseHandler: async (response) => {
          if (!response.ok) throw new Error("Failed to fetch image");

          const blob = await response.blob();

          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        },
      }),
    }),
    removeProfileImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}/avatar`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyViewResumeQuery,
  useSetDefaultResumeMutation,
  useUploadResumeMutation,
  useUpdateProfileMutation,
  useGetProfileImageQuery,
  useRemoveResumeMutation,
  useRemoveSkillMutation,
  useRemoveWorkExperienceMutation,
  useRemoveProjectMutation,
  useRemoveCertificateMutation,
  useRemoveProfileImageMutation,
  useUploadProfileImageMutation,
} = profileApi;
