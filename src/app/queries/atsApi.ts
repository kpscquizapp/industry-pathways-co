import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const atsApi = createApi({
  reducerPath: "atsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ATS_BASE_URL || "http://localhost:5001",
    prepareHeaders: (headers) => {
      const apiKey = import.meta.env.VITE_ATS_API_KEY;
      if (apiKey) {
        headers.set("X-API-KEY", apiKey);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    extractResume: builder.mutation<any, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        return {
          url: "api/v1/extract",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useExtractResumeMutation } = atsApi;
