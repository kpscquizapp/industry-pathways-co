import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";
import { getAuthHeaders } from "@/lib/helpers";

interface CreateSkillTest {
    title: string;
    totalTime: number;
    difficultyDistribution: {
        easy: number;
        medium: number;
        hard: number;
    };
}

export const contractorSkillTestApi = createApi({
    reducerPath: "contractorSkillTestApi",
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
    tagTypes: ["ContractorSkillTest"],
    endpoints: (builder) => ({
        createSkillTest: builder.mutation<any, CreateSkillTest>({
            query: (data) => ({
                method: "POST",
                url: "coding/tests",
                body: data,
            }),
            invalidatesTags: ["ContractorSkillTest"],
        }),
        getMyTestResults: builder.query<any, void>({
            query: () => ({
                method: "GET",
                url: "coding/tests/my-results",
            }),
            providesTags: ["ContractorSkillTest"],
        }),
        getTestReport: builder.query<any, string | number>({
            query: (id) => ({
                method: "GET",
                url: `coding/tests/report/${id}`,
            }),
        }),
        getProblemTags: builder.query<any, void>({
            query: () => ({
                method: "GET",
                url: "coding/tags",
            }),
        }),
        getTestStatusById: builder.query<any, { testId: string | number; token?: string }>({
            query: ({ testId, token }) => ({
                method: "GET",
                url: `coding/tests/${testId}/status`,
                params: token ? { token } : undefined,
            }),
        }),
        // New endpoint to fetch webcam and screen‑share URLs for a session
        getWebcamMetadata: builder.query<any, string>({
            query: (sessionId) => ({
                method: "GET",
                url: `recordings/chunks/${sessionId}/metadata`,
            }),
        }),
        // New endpoint to fetch violation logs (JSON) for a session
        getSessionViolations: builder.query<any, string>({
            query: (sessionId) => ({
                method: "GET",
                url: `session/${sessionId}`,
            }),
        }),
        // Fetches a recorded video and returns a blob object URL for <video> src
        getRecordingPlay: builder.query<string, { sessionId: string; type: "webcam" | "screen" }>({
            query: ({ sessionId, type }) => ({
                method: "GET",
                url: `recordings/play/${sessionId}/${type}`,
                responseHandler: async (response: Response) => {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
                cache: "no-cache",
            }),
        }),
    }),
})

export const {
    useCreateSkillTestMutation,
    useGetMyTestResultsQuery,
    useGetTestReportQuery,
    useGetProblemTagsQuery,
    useLazyGetTestStatusByIdQuery,
    useGetWebcamMetadataQuery,
    useGetSessionViolationsQuery,
    useGetRecordingPlayQuery,
} = contractorSkillTestApi;
