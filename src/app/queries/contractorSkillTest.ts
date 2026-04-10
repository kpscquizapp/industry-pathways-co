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
    }),
})

export const { 
    useCreateSkillTestMutation, 
    useGetMyTestResultsQuery, 
    useGetTestReportQuery,
    useGetProblemTagsQuery
} = contractorSkillTestApi;

