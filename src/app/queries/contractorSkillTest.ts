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
        }),
    }),
})

export const { useCreateSkillTestMutation } = contractorSkillTestApi;

