import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "@/lib/helpers";
import { profileApi } from "./profileApi";

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
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    updateEmployerProfile: builder.mutation<void, any>({
      query: (data) => ({
        url: "jobboard/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate profileApi's Profile tag manually to sync caches
          dispatch(
            profileApi.util.invalidateTags([{ type: "Profile" as const }]),
          );
        } catch (error) {
          console.error("Profile update failed:", error);
        }
      },
    }),
    uploadProfileImage: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "jobboard/profile/image/employer-hr",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    getProfileImage: builder.query<string | null, string>({
      query: (id) => ({
        url: `users/${id}/avatar/business`,
        method: "GET",
        validateStatus: (response) => {
          // Treat both 200 and 404 as successful responses
          return response.status === 200 || response.status === 404;
        },
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
      }),
      providesTags: ["Profile"],
      keepUnusedDataFor: 0,
    }),
    removeProfileImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}/avatar/business`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
      // Optional: optimistic update to clear image immediately
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          employerApi.util.updateQueryData("getProfileImage", id, () => null),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useUpdateEmployerProfileMutation,
  useUploadProfileImageMutation,
  useGetProfileImageQuery,
  useRemoveProfileImageMutation,
} = employerApi;
