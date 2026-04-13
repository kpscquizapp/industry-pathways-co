import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../services/service";

export type RecordingType = "webcam" | "screen";

export interface StreamingInitResponse {
  nextChunkIndex: number;
  recordingId: number;
}

export interface StreamingEndResponse {
  totalChunks: number;
  integrity?: {
    isValid?: boolean;
    missingChunks?: number[];
    duplicateChunks?: number[];
  };
}

export interface UploadChunkArgs {
  sessionId: string;
  chunkIndex: number;
  type: RecordingType;
  timestamp: number;
  recordingId: number;
  chunk: Blob;
}

export const assessmentApi = createApi({
  reducerPath: "assessmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseURL,
  }),
  tagTypes: ["Test"],
  endpoints: (builder) => ({
    // ── Test lifecycle ──────────────────────────────────────────────
    getTestStatus: builder.query<any, { testId: string; token?: string | null }>({
      query: ({ testId, token }) => ({
        url: `coding/tests/${testId}/status`,
        method: "GET",
        params: token ? { token } : undefined,
      }),
    }),
    getTestProblems: builder.query<any, { testId: string; token?: string | null }>({
      query: ({ testId, token }) => ({
        url: `coding/tests/${testId}/problems`,
        method: "GET",
        params: token ? { token } : undefined,
      }),
    }),
    startTest: builder.mutation<any, { testId: string; token?: string | null }>({
      query: ({ testId, token }) => ({
        url: `coding/tests/${testId}/start`,
        method: "PATCH",
        params: token ? { token } : undefined,
      }),
    }),
    endTest: builder.mutation<any, { testId: string; token?: string | null }>({
      query: ({ testId, token }) => ({
        url: `coding/tests/${testId}/end`,
        method: "PATCH",
        params: token ? { token } : undefined,
      }),
    }),

    // ── Session management ──────────────────────────────────────────
    startSession: builder.mutation<{ sessionId: string }, { candidateId: string; jobId?: string }>({
      query: (body) => ({
        url: "session/start",
        method: "POST",
        body,
      }),
    }),
    endSession: builder.mutation<any, { sessionId: string }>({
      query: (body) => ({
        url: "session/end",
        method: "POST",
        body,
      }),
    }),

    // ── Anti-cheat ─────────────────────────────────────────────────
    logViolation: builder.mutation<any, { sessionId: string; reason: string }>({
      query: (body) => ({
        url: "violations/log",
        method: "POST",
        body,
      }),
    }),

    // ── Recording ──────────────────────────────────────────────────
    startRecording: builder.mutation<
      StreamingInitResponse,
      { sessionId: string; type: RecordingType }
    >({
      query: (body) => ({
        url: "recordings/start",
        method: "POST",
        body,
      }),
    }),
    uploadChunk: builder.mutation<any, UploadChunkArgs>({
      query: ({ sessionId, chunkIndex, type, timestamp, recordingId, chunk }) => {
        const formData = new FormData();
        formData.append("sessionId", sessionId);
        formData.append("chunkIndex", String(chunkIndex));
        formData.append("type", type);
        formData.append("timestamp", String(timestamp));
        formData.append("recordingId", String(recordingId));
        formData.append(
          "chunk",
          new Blob([chunk], { type: "video/webm" }),
          `chunk-${chunkIndex}.webm`,
        );
        return {
          url: `recordings/chunk/${sessionId}/${type}/${chunkIndex}`,
          method: "POST",
          body: formData,
        };
      },
    }),
    endRecording: builder.mutation<
      StreamingEndResponse,
      { sessionId: string; type: RecordingType }
    >({
      query: (body) => ({
        url: "recordings/end",
        method: "POST",
        body,
      }),
    }),
    recordingPing: builder.mutation<any, { sessionId: string }>({
      query: (body) => ({
        url: "recordings/ping",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLazyGetTestStatusQuery,
  useLazyGetTestProblemsQuery,
  useStartTestMutation,
  useEndTestMutation,
  useStartSessionMutation,
  useEndSessionMutation,
  useLogViolationMutation,
  useStartRecordingMutation,
  useUploadChunkMutation,
  useEndRecordingMutation,
  useRecordingPingMutation,
} = assessmentApi;
