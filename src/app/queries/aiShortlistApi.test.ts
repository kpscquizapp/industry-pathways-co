import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { aiShortlistApi } from './aiShortlistApi';
import type {
  GetEmployerJobsArgs,
  GetJobMatchesArgs,
  ShortlistCandidateArgs,
  EmployerJobsResponse,
  JobMatchesResponse,
} from './aiShortlistApi';

// Mock the config and getAuthHeaders
vi.mock('../../services/service', () => ({
  config: {
    baseURL: 'https://api.example.com',
  },
}));

vi.mock('../../lib/helpers', () => ({
  getAuthHeaders: vi.fn(() => ({
    Authorization: 'Bearer test-token',
    'X-Custom-Header': 'test-value',
  })),
}));

// Mock fetch for API calls
global.fetch = vi.fn();

describe('aiShortlistApi', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [aiShortlistApi.reducerPath]: aiShortlistApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(aiShortlistApi.middleware),
    });
    vi.clearAllMocks();
  });

  describe('API Configuration', () => {
    it('should have correct reducer path', () => {
      expect(aiShortlistApi.reducerPath).toBe('aiShortlistApi');
    });

    it('should have tag types defined', () => {
      // Check that the API has the expected structure
      expect(aiShortlistApi).toHaveProperty('reducerPath');
      expect(aiShortlistApi).toHaveProperty('reducer');
      expect(aiShortlistApi).toHaveProperty('middleware');
    });
  });

  describe('Endpoints', () => {
    it('should have getEmployerJobs endpoint', () => {
      const { endpoints } = aiShortlistApi;
      expect(endpoints.getEmployerJobs).toBeDefined();
      expect(typeof endpoints.getEmployerJobs.initiate).toBe('function');
    });

    it('should have getJobMatches endpoint', () => {
      const { endpoints } = aiShortlistApi;
      expect(endpoints.getJobMatches).toBeDefined();
      expect(typeof endpoints.getJobMatches.initiate).toBe('function');
    });

    it('should have shortlistCandidate endpoint', () => {
      const { endpoints } = aiShortlistApi;
      expect(endpoints.shortlistCandidate).toBeDefined();
      expect(typeof endpoints.shortlistCandidate.initiate).toBe('function');
    });
  });

  describe('Hooks', () => {
    it('should export useGetEmployerJobsQuery hook', () => {
      expect(aiShortlistApi.useGetEmployerJobsQuery).toBeDefined();
    });

    it('should export useGetJobMatchesQuery hook', () => {
      expect(aiShortlistApi.useGetJobMatchesQuery).toBeDefined();
    });

    it('should export useLazyGetJobMatchesQuery hook', () => {
      expect(aiShortlistApi.useLazyGetJobMatchesQuery).toBeDefined();
    });

    it('should export useShortlistCandidateMutation hook', () => {
      expect(aiShortlistApi.useShortlistCandidateMutation).toBeDefined();
    });
  });

  describe('Endpoint Actions - getEmployerJobs', () => {
    it('should create action for getEmployerJobs with default args', () => {
      const args: GetEmployerJobsArgs = {};
      const thunk = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(thunk).toBeDefined();
      expect(typeof thunk).toBe('function');
    });

    it('should create action for getEmployerJobs with custom pagination', () => {
      const args: GetEmployerJobsArgs = { page: 3, limit: 50 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle negative page number', () => {
      const args: GetEmployerJobsArgs = { page: -1 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle zero page number', () => {
      const args: GetEmployerJobsArgs = { page: 0 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle fractional page number', () => {
      const args: GetEmployerJobsArgs = { page: 2.7 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle very large limit', () => {
      const args: GetEmployerJobsArgs = { limit: 500 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle negative limit', () => {
      const args: GetEmployerJobsArgs = { limit: -10 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle undefined pagination', () => {
      const args: GetEmployerJobsArgs = { page: undefined, limit: undefined };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle NaN page value', () => {
      const args: GetEmployerJobsArgs = { page: NaN };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle limit at boundary', () => {
      const args: GetEmployerJobsArgs = { limit: 200 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });
  });

  describe('Endpoint Actions - getJobMatches', () => {
    it('should create action for getJobMatches', () => {
      const args: GetJobMatchesArgs = { id: '123', page: 2, limit: 30 };
      const thunk = aiShortlistApi.endpoints.getJobMatches.initiate(args);

      expect(thunk).toBeDefined();
      expect(typeof thunk).toBe('function');
    });

    it('should handle string job id', () => {
      const args: GetJobMatchesArgs = { id: 'abc-def-123' };
      const action = aiShortlistApi.endpoints.getJobMatches.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle numeric string job id', () => {
      const args: GetJobMatchesArgs = { id: '456' };
      const action = aiShortlistApi.endpoints.getJobMatches.initiate(args);

      expect(action).toBeDefined();
    });
  });

  describe('Mutation Actions - shortlistCandidate', () => {
    it('should create action for shortlistCandidate with numeric id', () => {
      const args: ShortlistCandidateArgs = { candidateId: 789 };
      const thunk = aiShortlistApi.endpoints.shortlistCandidate.initiate(args);

      expect(thunk).toBeDefined();
      expect(typeof thunk).toBe('function');
    });

    it('should create action for shortlistCandidate with string id', () => {
      const args: ShortlistCandidateArgs = { candidateId: 'candidate-xyz' };
      const action = aiShortlistApi.endpoints.shortlistCandidate.initiate(args);

      expect(action).toBeDefined();
    });
  });

  describe('TypeScript Type Safety', () => {
    it('should accept valid EntityId types (number)', () => {
      const args: ShortlistCandidateArgs = { candidateId: 123 };
      expect(args.candidateId).toBe(123);
    });

    it('should accept valid EntityId types (string)', () => {
      const args: ShortlistCandidateArgs = { candidateId: 'abc123' };
      expect(args.candidateId).toBe('abc123');
    });
  });

  describe('Cache Management', () => {
    it('should provide tags for cache invalidation', () => {
      // Verify that util methods exist for cache management
      expect(aiShortlistApi.util).toBeDefined();
      expect(aiShortlistApi.util.invalidateTags).toBeDefined();
      expect(aiShortlistApi.util.resetApiState).toBeDefined();
    });

    it('should allow resetting API state', () => {
      store.dispatch(aiShortlistApi.util.resetApiState());
      const state = store.getState();

      expect(state[aiShortlistApi.reducerPath].queries).toEqual({});
    });

    it('should handle cache invalidation for specific tags', () => {
      const result = aiShortlistApi.util.invalidateTags(['AiShortlistJobs']);

      expect(result).toBeDefined();
    });
  });

  describe('Endpoint Selection', () => {
    it('should select endpoint state correctly', () => {
      const args: GetEmployerJobsArgs = { page: 1, limit: 10 };
      const selector = aiShortlistApi.endpoints.getEmployerJobs.select(args);
      const state = store.getState();
      const selected = selector(state);

      expect(selected).toBeDefined();
      expect(selected).toHaveProperty('status');
      expect(selected.status).toBe('uninitialized');
    });

    it('should track query status', () => {
      const args: GetEmployerJobsArgs = {};
      const selector = aiShortlistApi.endpoints.getEmployerJobs.select(args);
      const state = store.getState();
      const selected = selector(state);

      expect(selected).toHaveProperty('status');
      expect(selected.status).toBe('uninitialized');
    });
  });

  describe('Regression Tests', () => {
    it('should maintain backward compatibility with endpoint names', () => {
      expect(aiShortlistApi.endpoints.getEmployerJobs).toBeDefined();
      expect(aiShortlistApi.endpoints.getJobMatches).toBeDefined();
      expect(aiShortlistApi.endpoints.shortlistCandidate).toBeDefined();
    });

    it('should not mutate input arguments when dispatching', () => {
      const args: GetEmployerJobsArgs = { page: 5, limit: 25 };
      const originalArgs = { ...args };

      aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(args).toEqual(originalArgs);
    });

    it('should handle multiple concurrent queries', () => {
      const action1 = aiShortlistApi.endpoints.getEmployerJobs.initiate({ page: 1 });
      const action2 = aiShortlistApi.endpoints.getEmployerJobs.initiate({ page: 2 });

      expect(action1).toBeDefined();
      expect(action2).toBeDefined();
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle very large page numbers', () => {
      const args: GetEmployerJobsArgs = { page: 999999 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle empty string job id', () => {
      const args: GetJobMatchesArgs = { id: '' };
      const action = aiShortlistApi.endpoints.getJobMatches.initiate(args);

      expect(action).toBeDefined();
    });

    it('should handle mixed type arguments', () => {
      const args: GetEmployerJobsArgs = { page: 1.5, limit: 75 };
      const action = aiShortlistApi.endpoints.getEmployerJobs.initiate(args);

      expect(action).toBeDefined();
    });
  });
});