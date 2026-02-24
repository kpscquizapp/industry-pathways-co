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
  tagTypes: ["EmployerProfile"],
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
      invalidatesTags: ["EmployerProfile"],
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
      providesTags: ["EmployerProfile"],
    }),
    removeProfileImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}/avatar/business`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployerProfile"],
    }),
    // Dedicated employer profile query — tagged EmployerProfile so it
    // auto-refetches after updateEmployerProfile/uploadProfileImage/removeProfileImage.
    // Keeps employer data completely isolated from profileApi ("Profile" tag).
    getEmployerProfile: builder.query<any, void>({
      query: () => ({
        method: "GET",
        url: "jobboard/profile",
      }),
      providesTags: ["EmployerProfile"],
    }),
  }),
});

export const {
  useUpdateEmployerProfileMutation,
  useUploadProfileImageMutation,
  useGetEmployerProfileImageQuery,
  useRemoveProfileImageMutation,
  useGetEmployerProfileQuery,
} = employerApi;
