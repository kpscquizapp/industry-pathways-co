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
  }),
});

export const { 
  usePostBenchResourceMutation, 
  useGetBenchResourcesQuery, 
  useDeleteBenchResourceMutation 
} = benchApi;
