import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { employerApi } from './employerApi';

// Mock the config and helpers
vi.mock('../../services/service', () => ({
  config: { baseURL: 'http://localhost:3000/api' },
}));

vi.mock('@/lib/helpers', () => ({
  getAuthHeaders: vi.fn(() => ({
    Authorization: 'Bearer test-token',
  })),
}));

describe('employerApi', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [employerApi.reducerPath]: employerApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(employerApi.middleware),
    });
  });

  it('should have correct reducer path', () => {
    expect(employerApi.reducerPath).toBe('employerApi');
  });

  it('should have updateEmployerProfile endpoint', () => {
    expect(employerApi.endpoints.updateEmployerProfile).toBeDefined();
  });

  it('should have uploadProfileImage endpoint', () => {
    expect(employerApi.endpoints.uploadProfileImage).toBeDefined();
  });

  it('should have getEmployerProfileImage endpoint', () => {
    expect(employerApi.endpoints.getEmployerProfileImage).toBeDefined();
  });

  it('should have removeProfileImage endpoint', () => {
    expect(employerApi.endpoints.removeProfileImage).toBeDefined();
  });

  it('should have getEmployerProfile endpoint', () => {
    expect(employerApi.endpoints.getEmployerProfile).toBeDefined();
  });

  describe('updateEmployerProfile mutation', () => {
    it('should configure PUT request to correct endpoint', () => {
      const endpoint = employerApi.endpoints.updateEmployerProfile;
      const queryConfig = endpoint.query({
        companyName: 'Test Company',
        industry: 'Tech',
      });

      expect(queryConfig.url).toBe('jobboard/profile');
      expect(queryConfig.method).toBe('PUT');
      expect(queryConfig.body).toEqual({
        companyName: 'Test Company',
        industry: 'Tech',
      });
    });

    it('should invalidate EmployerProfile tag on success', () => {
      const endpoint = employerApi.endpoints.updateEmployerProfile;
      expect(endpoint.invalidatesTags).toEqual(['EmployerProfile']);
    });
  });

  describe('uploadProfileImage mutation', () => {
    it('should configure POST request with FormData', () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.jpg');

      const endpoint = employerApi.endpoints.uploadProfileImage;
      const queryConfig = endpoint.query(formData);

      expect(queryConfig.url).toBe('jobboard/profile/image/employer-hr');
      expect(queryConfig.method).toBe('POST');
      expect(queryConfig.body).toBe(formData);
    });
  });

  describe('getEmployerProfileImage query', () => {
    it('should configure GET request with correct URL', () => {
      const endpoint = employerApi.endpoints.getEmployerProfileImage;
      const queryConfig = endpoint.query('user-123');

      expect(queryConfig.url).toBe('users/user-123/avatar/business');
      expect(queryConfig.method).toBe('GET');
    });

    it('should validate status for both 200 and 404', () => {
      const endpoint = employerApi.endpoints.getEmployerProfileImage;
      const queryConfig = endpoint.query('user-123');

      if (queryConfig.validateStatus) {
        expect(queryConfig.validateStatus({ status: 200 } as Response)).toBe(true);
        expect(queryConfig.validateStatus({ status: 404 } as Response)).toBe(true);
        expect(queryConfig.validateStatus({ status: 500 } as Response)).toBe(false);
      }
    });

    it('should provide EmployerProfile tag', () => {
      const endpoint = employerApi.endpoints.getEmployerProfileImage;
      expect(endpoint.providesTags).toEqual(['EmployerProfile']);
    });

    it('should keep unused data for 30 seconds', () => {
      const endpoint = employerApi.endpoints.getEmployerProfileImage;
      expect(endpoint.keepUnusedDataFor).toBe(30);
    });
  });

  describe('removeProfileImage mutation', () => {
    it('should configure DELETE request', () => {
      const endpoint = employerApi.endpoints.removeProfileImage;
      const queryConfig = endpoint.query('user-123');

      expect(queryConfig.url).toBe('users/user-123/avatar/business');
      expect(queryConfig.method).toBe('DELETE');
    });

    it('should have onQueryStarted handler', () => {
      const endpoint = employerApi.endpoints.removeProfileImage;
      expect(endpoint.onQueryStarted).toBeDefined();
      expect(typeof endpoint.onQueryStarted).toBe('function');
    });
  });

  describe('getEmployerProfile query', () => {
    it('should configure GET request to profile endpoint', () => {
      const endpoint = employerApi.endpoints.getEmployerProfile;
      const queryConfig = endpoint.query();

      expect(queryConfig.url).toBe('jobboard/profile');
      expect(queryConfig.method).toBe('GET');
    });

    it('should provide EmployerProfile tag', () => {
      const endpoint = employerApi.endpoints.getEmployerProfile;
      expect(endpoint.providesTags).toEqual(['EmployerProfile']);
    });
  });

  describe('API Tags', () => {
    it('should define EmployerProfile as tag type', () => {
      expect(employerApi.tagTypes).toContain('EmployerProfile');
    });
  });

  describe('Exported Hooks', () => {
    it('should export useUpdateEmployerProfileMutation', async () => {
      const { useUpdateEmployerProfileMutation } = await import('./employerApi');
      expect(useUpdateEmployerProfileMutation).toBeDefined();
    });

    it('should export useUploadProfileImageMutation', async () => {
      const { useUploadProfileImageMutation } = await import('./employerApi');
      expect(useUploadProfileImageMutation).toBeDefined();
    });

    it('should export useGetEmployerProfileImageQuery', async () => {
      const { useGetEmployerProfileImageQuery } = await import('./employerApi');
      expect(useGetEmployerProfileImageQuery).toBeDefined();
    });

    it('should export useRemoveProfileImageMutation', async () => {
      const { useRemoveProfileImageMutation } = await import('./employerApi');
      expect(useRemoveProfileImageMutation).toBeDefined();
    });

    it('should export useGetEmployerProfileQuery', async () => {
      const { useGetEmployerProfileQuery } = await import('./employerApi');
      expect(useGetEmployerProfileQuery).toBeDefined();
    });
  });
});