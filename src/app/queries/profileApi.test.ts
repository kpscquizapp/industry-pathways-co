import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { profileApi } from './profileApi';

// Mock the config and helpers
vi.mock('../../services/service', () => ({
  config: { baseURL: 'http://localhost:3000/api' },
}));

vi.mock('@/lib/helpers', () => ({
  getAuthHeaders: vi.fn(() => ({
    Authorization: 'Bearer test-token',
  })),
}));

describe('profileApi', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [profileApi.reducerPath]: profileApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(profileApi.middleware),
    });
  });

  it('should have correct reducer path', () => {
    expect(profileApi.reducerPath).toBe('profileApi');
  });

  describe('Endpoints', () => {
    it('should have getProfile endpoint', () => {
      expect(profileApi.endpoints.getProfile).toBeDefined();
    });

    it('should have viewResume endpoint', () => {
      expect(profileApi.endpoints.viewResume).toBeDefined();
    });

    it('should have uploadResume endpoint', () => {
      expect(profileApi.endpoints.uploadResume).toBeDefined();
    });

    it('should have setDefaultResume endpoint', () => {
      expect(profileApi.endpoints.setDefaultResume).toBeDefined();
    });

    it('should have updateProfile endpoint', () => {
      expect(profileApi.endpoints.updateProfile).toBeDefined();
    });

    it('should have removeSkill endpoint', () => {
      expect(profileApi.endpoints.removeSkill).toBeDefined();
    });

    it('should have removeWorkExperience endpoint', () => {
      expect(profileApi.endpoints.removeWorkExperience).toBeDefined();
    });

    it('should have removeProject endpoint', () => {
      expect(profileApi.endpoints.removeProject).toBeDefined();
    });

    it('should have removeCertificate endpoint', () => {
      expect(profileApi.endpoints.removeCertificate).toBeDefined();
    });

    it('should have removeResume endpoint', () => {
      expect(profileApi.endpoints.removeResume).toBeDefined();
    });

    it('should have uploadProfileImage endpoint', () => {
      expect(profileApi.endpoints.uploadProfileImage).toBeDefined();
    });

    it('should have getCandidateProfileImage endpoint', () => {
      expect(profileApi.endpoints.getCandidateProfileImage).toBeDefined();
    });

    it('should have removeProfileImage endpoint', () => {
      expect(profileApi.endpoints.removeProfileImage).toBeDefined();
    });
  });

  describe('getProfile query', () => {
    it('should configure GET request to profile endpoint', () => {
      const endpoint = profileApi.endpoints.getProfile;
      const queryConfig = endpoint.query();

      expect(queryConfig.url).toBe('jobboard/profile');
      expect(queryConfig.method).toBe('GET');
    });

    it('should provide Profile tag', () => {
      const endpoint = profileApi.endpoints.getProfile;
      expect(endpoint.providesTags).toEqual(['Profile']);
    });
  });

  describe('viewResume query', () => {
    it('should configure GET request with resume ID', () => {
      const endpoint = profileApi.endpoints.viewResume;
      const queryConfig = endpoint.query({ resumeId: 123 });

      expect(queryConfig.url).toBe('/jobboard/profile/resume/123?view=inline');
    });

    it('should have blob response handler', () => {
      const endpoint = profileApi.endpoints.viewResume;
      const queryConfig = endpoint.query({ resumeId: 123 });

      expect(queryConfig.responseHandler).toBeDefined();
    });

    it('should not cache resume data', () => {
      const endpoint = profileApi.endpoints.viewResume;
      expect(endpoint.keepUnusedDataFor).toBe(0);
    });
  });

  describe('uploadResume mutation', () => {
    it('should configure POST request with FormData', () => {
      const formData = new FormData();
      formData.append('resume', new Blob(['test']), 'resume.pdf');

      const endpoint = profileApi.endpoints.uploadResume;
      const queryConfig = endpoint.query(formData);

      expect(queryConfig.url).toBe('jobboard/profile/resume');
      expect(queryConfig.method).toBe('POST');
      expect(queryConfig.body).toBe(formData);
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.uploadResume;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('setDefaultResume mutation', () => {
    it('should configure PATCH request', () => {
      const endpoint = profileApi.endpoints.setDefaultResume;
      const queryConfig = endpoint.query(123);

      expect(queryConfig.url).toBe('jobboard/profile/resume/123/default');
      expect(queryConfig.method).toBe('PATCH');
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.setDefaultResume;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('updateProfile mutation', () => {
    it('should configure PUT request', () => {
      const profileData = { bio: 'Updated bio', headline: 'New headline' };
      const endpoint = profileApi.endpoints.updateProfile;
      const queryConfig = endpoint.query(profileData);

      expect(queryConfig.url).toBe('jobboard/profile');
      expect(queryConfig.method).toBe('PUT');
      expect(queryConfig.body).toEqual(profileData);
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.updateProfile;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('removeSkill mutation', () => {
    it('should configure DELETE request', () => {
      const endpoint = profileApi.endpoints.removeSkill;
      const queryConfig = endpoint.query(456);

      expect(queryConfig.url).toBe('jobboard/profile/skills/456');
      expect(queryConfig.method).toBe('DELETE');
    });

    it('should have onQueryStarted for optimistic updates', () => {
      const endpoint = profileApi.endpoints.removeSkill;
      expect(endpoint.onQueryStarted).toBeDefined();
      expect(typeof endpoint.onQueryStarted).toBe('function');
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.removeSkill;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('removeWorkExperience mutation', () => {
    it('should configure DELETE request', () => {
      const endpoint = profileApi.endpoints.removeWorkExperience;
      const queryConfig = endpoint.query(789);

      expect(queryConfig.url).toBe('jobboard/profile/work-experience/789');
      expect(queryConfig.method).toBe('DELETE');
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.removeWorkExperience;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('removeProject mutation', () => {
    it('should configure DELETE request', () => {
      const endpoint = profileApi.endpoints.removeProject;
      const queryConfig = endpoint.query(101);

      expect(queryConfig.url).toBe('jobboard/profile/projects/101');
      expect(queryConfig.method).toBe('DELETE');
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.removeProject;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('removeCertificate mutation', () => {
    it('should configure DELETE request', () => {
      const endpoint = profileApi.endpoints.removeCertificate;
      const queryConfig = endpoint.query(202);

      expect(queryConfig.url).toBe('jobboard/profile/certifications/202');
      expect(queryConfig.method).toBe('DELETE');
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.removeCertificate;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('removeResume mutation', () => {
    it('should configure DELETE request', () => {
      const endpoint = profileApi.endpoints.removeResume;
      const queryConfig = endpoint.query(303);

      expect(queryConfig.url).toBe('jobboard/profile/resume/303');
      expect(queryConfig.method).toBe('DELETE');
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.removeResume;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('uploadProfileImage mutation', () => {
    it('should configure POST request', () => {
      const formData = new FormData();
      formData.append('image', new Blob(['test']), 'profile.jpg');

      const endpoint = profileApi.endpoints.uploadProfileImage;
      const queryConfig = endpoint.query(formData);

      expect(queryConfig.url).toBe('jobboard/profile/image');
      expect(queryConfig.method).toBe('POST');
      expect(queryConfig.body).toBe(formData);
    });

    it('should invalidate Profile tag', () => {
      const endpoint = profileApi.endpoints.uploadProfileImage;
      expect(endpoint.invalidatesTags).toEqual(['Profile']);
    });
  });

  describe('getCandidateProfileImage query', () => {
    it('should configure GET request', () => {
      const endpoint = profileApi.endpoints.getCandidateProfileImage;
      const queryConfig = endpoint.query('user-123');

      expect(queryConfig.url).toBe('users/user-123/avatar');
      expect(queryConfig.method).toBe('GET');
    });

    it('should validate status for both 200 and 404', () => {
      const endpoint = profileApi.endpoints.getCandidateProfileImage;
      const queryConfig = endpoint.query('user-123');

      if (queryConfig.validateStatus) {
        expect(queryConfig.validateStatus({ status: 200 } as Response)).toBe(true);
        expect(queryConfig.validateStatus({ status: 404 } as Response)).toBe(true);
        expect(queryConfig.validateStatus({ status: 500 } as Response)).toBe(false);
      }
    });

    it('should provide Profile tag', () => {
      const endpoint = profileApi.endpoints.getCandidateProfileImage;
      expect(endpoint.providesTags).toEqual(['Profile']);
    });

    it('should keep unused data for 30 seconds', () => {
      const endpoint = profileApi.endpoints.getCandidateProfileImage;
      expect(endpoint.keepUnusedDataFor).toBe(30);
    });
  });

  describe('removeProfileImage mutation', () => {
    it('should configure DELETE request', () => {
      const endpoint = profileApi.endpoints.removeProfileImage;
      const queryConfig = endpoint.query('user-123');

      expect(queryConfig.url).toBe('users/user-123/avatar');
      expect(queryConfig.method).toBe('DELETE');
    });

    it('should have onQueryStarted for optimistic updates', () => {
      const endpoint = profileApi.endpoints.removeProfileImage;
      expect(endpoint.onQueryStarted).toBeDefined();
      expect(typeof endpoint.onQueryStarted).toBe('function');
    });
  });

  describe('API Tags', () => {
    it('should define Profile as tag type', () => {
      expect(profileApi.tagTypes).toContain('Profile');
    });
  });

  describe('Exported Hooks', () => {
    it('should export useGetProfileQuery', async () => {
      const { useGetProfileQuery } = await import('./profileApi');
      expect(useGetProfileQuery).toBeDefined();
    });

    it('should export useLazyViewResumeQuery', async () => {
      const { useLazyViewResumeQuery } = await import('./profileApi');
      expect(useLazyViewResumeQuery).toBeDefined();
    });

    it('should export useSetDefaultResumeMutation', async () => {
      const { useSetDefaultResumeMutation } = await import('./profileApi');
      expect(useSetDefaultResumeMutation).toBeDefined();
    });

    it('should export useUploadResumeMutation', async () => {
      const { useUploadResumeMutation } = await import('./profileApi');
      expect(useUploadResumeMutation).toBeDefined();
    });

    it('should export useUpdateProfileMutation', async () => {
      const { useUpdateProfileMutation } = await import('./profileApi');
      expect(useUpdateProfileMutation).toBeDefined();
    });

    it('should export useGetCandidateProfileImageQuery', async () => {
      const { useGetCandidateProfileImageQuery } = await import('./profileApi');
      expect(useGetCandidateProfileImageQuery).toBeDefined();
    });

    it('should export all removal mutations', async () => {
      const {
        useRemoveResumeMutation,
        useRemoveSkillMutation,
        useRemoveWorkExperienceMutation,
        useRemoveProjectMutation,
        useRemoveCertificateMutation,
        useRemoveProfileImageMutation,
      } = await import('./profileApi');

      expect(useRemoveResumeMutation).toBeDefined();
      expect(useRemoveSkillMutation).toBeDefined();
      expect(useRemoveWorkExperienceMutation).toBeDefined();
      expect(useRemoveProjectMutation).toBeDefined();
      expect(useRemoveCertificateMutation).toBeDefined();
      expect(useRemoveProfileImageMutation).toBeDefined();
    });
  });
});