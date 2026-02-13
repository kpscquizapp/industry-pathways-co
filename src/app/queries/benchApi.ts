import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "../../lib/helpers";

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
    getBenchResourceById: builder.query<any, number | string>({
      query: (id) => ({
        url: `employers/bench-resources/${id}`,
        method: "GET",
      }),
      providesTags: ["BenchResources"],
    }),
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
  useDownloadBenchResumeMutation,
  useUpdateBenchResourceMutation,
  useDeleteBenchResourceMutation,
  useGetBenchResourceByIdQuery,
} = benchApi;
