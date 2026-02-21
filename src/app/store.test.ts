import { describe, it, expect } from 'vitest';
import store from './store';
import { loginApi } from './queries/loginApi';
import { profileApi } from './queries/profileApi';
import { jobApi } from './queries/jobApi';
import { atsApi } from './queries/atsApi';
import { benchApi } from './queries/benchApi';
import { aiShortlistApi } from './queries/aiShortlistApi';
import { employerApi } from './queries/employerApi';
import type { RootState, AppDispatch } from './store';

describe('Redux Store', () => {
  describe('Store Configuration', () => {
    it('should be defined', () => {
      expect(store).toBeDefined();
    });

    it('should have getState method', () => {
      expect(store.getState).toBeDefined();
      expect(typeof store.getState).toBe('function');
    });

    it('should have dispatch method', () => {
      expect(store.dispatch).toBeDefined();
      expect(typeof store.dispatch).toBe('function');
    });

    it('should have subscribe method', () => {
      expect(store.subscribe).toBeDefined();
      expect(typeof store.subscribe).toBe('function');
    });
  });

  describe('Reducers', () => {
    it('should include user reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty('user');
    });

    it('should include resumeSkills reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty('resumeSkills');
    });

    it('should include loginApi reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty(loginApi.reducerPath);
    });

    it('should include profileApi reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty(profileApi.reducerPath);
    });

    it('should include employerApi reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty(employerApi.reducerPath);
    });

    it('should include jobApi reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty(jobApi.reducerPath);
    });

    it('should include atsApi reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty(atsApi.reducerPath);
    });

    it('should include benchApi reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty(benchApi.reducerPath);
    });

    it('should include aiShortlistApi reducer', () => {
      const state = store.getState();
      expect(state).toHaveProperty(aiShortlistApi.reducerPath);
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state structure', () => {
      const state = store.getState();

      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('resumeSkills');
      expect(state).toHaveProperty(loginApi.reducerPath);
      expect(state).toHaveProperty(profileApi.reducerPath);
      expect(state).toHaveProperty(employerApi.reducerPath);
      expect(state).toHaveProperty(jobApi.reducerPath);
      expect(state).toHaveProperty(atsApi.reducerPath);
      expect(state).toHaveProperty(benchApi.reducerPath);
      expect(state).toHaveProperty(aiShortlistApi.reducerPath);
    });

    it('should have RTK Query API reducers with correct initial state', () => {
      const state = store.getState();

      // RTK Query reducers should have queries and mutations objects
      expect(state[loginApi.reducerPath]).toHaveProperty('queries');
      expect(state[loginApi.reducerPath]).toHaveProperty('mutations');
      expect(state[aiShortlistApi.reducerPath]).toHaveProperty('queries');
      expect(state[aiShortlistApi.reducerPath]).toHaveProperty('mutations');
    });
  });

  describe('Type Exports', () => {
    it('should export RootState type', () => {
      const state: RootState = store.getState();
      expect(state).toBeDefined();
    });

    it('should export AppDispatch type', () => {
      const dispatch: AppDispatch = store.dispatch;
      expect(dispatch).toBeDefined();
      expect(typeof dispatch).toBe('function');
    });
  });

  describe('Middleware', () => {
    it('should handle API middleware for loginApi', () => {
      const state = store.getState();
      expect(state[loginApi.reducerPath]).toBeDefined();
    });

    it('should handle API middleware for profileApi', () => {
      const state = store.getState();
      expect(state[profileApi.reducerPath]).toBeDefined();
    });

    it('should handle API middleware for employerApi', () => {
      const state = store.getState();
      expect(state[employerApi.reducerPath]).toBeDefined();
    });

    it('should handle API middleware for jobApi', () => {
      const state = store.getState();
      expect(state[jobApi.reducerPath]).toBeDefined();
    });

    it('should handle API middleware for atsApi', () => {
      const state = store.getState();
      expect(state[atsApi.reducerPath]).toBeDefined();
    });

    it('should handle API middleware for benchApi', () => {
      const state = store.getState();
      expect(state[benchApi.reducerPath]).toBeDefined();
    });

    it('should handle API middleware for aiShortlistApi', () => {
      const state = store.getState();
      expect(state[aiShortlistApi.reducerPath]).toBeDefined();
    });
  });

  describe('State Updates', () => {
    it('should allow dispatching actions', () => {
      const initialState = store.getState();

      // Dispatch an action (using RTK Query's util actions)
      store.dispatch(aiShortlistApi.util.resetApiState());

      const newState = store.getState();
      expect(newState).toBeDefined();
    });

    it('should maintain immutability', () => {
      const state1 = store.getState();
      const state2 = store.getState();

      // Same reference when no changes
      expect(state1).toBe(state2);
    });

    it('should update state when actions are dispatched', () => {
      const initialState = store.getState();
      const initialQueries = { ...initialState[aiShortlistApi.reducerPath].queries };

      // Reset API state
      store.dispatch(aiShortlistApi.util.resetApiState());

      const newState = store.getState();
      const newQueries = newState[aiShortlistApi.reducerPath].queries;

      // State should be updated (queries should be reset)
      expect(newQueries).toEqual({});
    });
  });

  describe('Subscriptions', () => {
    it('should allow subscribing to state changes', () => {
      let called = false;

      const unsubscribe = store.subscribe(() => {
        called = true;
      });

      store.dispatch(aiShortlistApi.util.resetApiState());

      expect(called).toBe(true);
      unsubscribe();
    });

    it('should stop calling callback after unsubscribe', () => {
      let callCount = 0;

      const unsubscribe = store.subscribe(() => {
        callCount++;
      });

      const initialCount = callCount;
      store.dispatch(aiShortlistApi.util.resetApiState());
      const countAfterFirst = callCount;
      expect(countAfterFirst).toBeGreaterThan(initialCount);

      unsubscribe();

      store.dispatch(aiShortlistApi.util.resetApiState());
      // Should remain the same after unsubscribe
      expect(callCount).toBe(countAfterFirst);
    });
  });

  describe('Integration Tests', () => {
    it('should integrate all API slices correctly', () => {
      const state = store.getState();

      const expectedReducers = [
        'user',
        'resumeSkills',
        loginApi.reducerPath,
        profileApi.reducerPath,
        employerApi.reducerPath,
        jobApi.reducerPath,
        atsApi.reducerPath,
        benchApi.reducerPath,
        aiShortlistApi.reducerPath,
      ];

      expectedReducers.forEach((reducer) => {
        expect(state).toHaveProperty(reducer);
      });
    });

    it('should handle multiple API calls without conflicts', () => {
      // Reset all API states
      store.dispatch(loginApi.util.resetApiState());
      store.dispatch(aiShortlistApi.util.resetApiState());
      store.dispatch(jobApi.util.resetApiState());

      const state = store.getState();

      // All should be reset independently
      expect(state[loginApi.reducerPath].queries).toEqual({});
      expect(state[aiShortlistApi.reducerPath].queries).toEqual({});
      expect(state[jobApi.reducerPath].queries).toEqual({});
    });
  });

  describe('Regression Tests', () => {
    it('should maintain consistent reducer paths', () => {
      // These paths should never change as they're part of the API contract
      expect(loginApi.reducerPath).toBe('loginApi');
      expect(profileApi.reducerPath).toBe('profileApi');
      expect(employerApi.reducerPath).toBe('employerApi');
      expect(jobApi.reducerPath).toBe('jobApi');
      expect(atsApi.reducerPath).toBe('atsApi');
      expect(benchApi.reducerPath).toBe('benchApi');
      expect(aiShortlistApi.reducerPath).toBe('aiShortlistApi');
    });

    it('should not have duplicate reducer paths', () => {
      const reducerPaths = [
        loginApi.reducerPath,
        profileApi.reducerPath,
        employerApi.reducerPath,
        jobApi.reducerPath,
        atsApi.reducerPath,
        benchApi.reducerPath,
        aiShortlistApi.reducerPath,
      ];

      const uniquePaths = new Set(reducerPaths);
      expect(uniquePaths.size).toBe(reducerPaths.length);
    });
  });
});