import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import useLogout from './useLogout';
import userReducer, { removeUser } from '@/app/slices/userAuth';
import { employerApi } from '@/app/queries/employerApi';
import { profileApi } from '@/app/queries/profileApi';
import React from 'react';

// Mock the loginApi
const mockLogoutMutation = vi.fn();
vi.mock('@/app/queries/loginApi', () => ({
  useLogoutMutation: () => [mockLogoutMutation, { isLoading: false }],
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useLogout', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogoutMutation.mockReset();
    mockNavigate.mockReset();

    store = configureStore({
      reducer: {
        user: userReducer,
        [employerApi.reducerPath]: employerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          employerApi.middleware,
          profileApi.middleware
        ),
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  it('should return handleLogout function, isLoading, and user', () => {
    const { result } = renderHook(() => useLogout(), { wrapper });

    expect(result.current).toHaveLength(3);
    const [handleLogout, isLoading, user] = result.current;

    expect(typeof handleLogout).toBe('function');
    expect(typeof isLoading).toBe('boolean');
    expect(user).toBeDefined();
  });

  it('should handle logout without refresh token', async () => {
    // Create store with no refresh token
    const storeWithoutToken = configureStore({
      reducer: {
        user: userReducer,
        [employerApi.reducerPath]: employerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
      },
      preloadedState: {
        user: {
          userDetails: { name: 'Test User' },
          token: null,
          refreshToken: null,
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          employerApi.middleware,
          profileApi.middleware
        ),
    });

    const wrapperWithoutToken = ({ children }: { children: React.ReactNode }) => (
      <Provider store={storeWithoutToken}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(() => useLogout(), {
      wrapper: wrapperWithoutToken,
    });

    const [handleLogout] = result.current;

    // Call logout
    await handleLogout();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // Should not call logout API
    expect(mockLogoutMutation).not.toHaveBeenCalled();
  });

  it('should handle successful logout with refresh token', async () => {
    const storeWithToken = configureStore({
      reducer: {
        user: userReducer,
        [employerApi.reducerPath]: employerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
      },
      preloadedState: {
        user: {
          userDetails: { name: 'Test User', role: 'employer' },
          token: 'access-token',
          refreshToken: 'refresh-token-123',
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          employerApi.middleware,
          profileApi.middleware
        ),
    });

    mockLogoutMutation.mockResolvedValue({
      unwrap: () => Promise.resolve({}),
    });

    const wrapperWithToken = ({ children }: { children: React.ReactNode }) => (
      <Provider store={storeWithToken}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(() => useLogout(), {
      wrapper: wrapperWithToken,
    });

    const [handleLogout] = result.current;

    // Call logout
    await handleLogout();

    await waitFor(() => {
      expect(mockLogoutMutation).toHaveBeenCalledWith('refresh-token-123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should handle logout API failure gracefully', async () => {
    const storeWithToken = configureStore({
      reducer: {
        user: userReducer,
        [employerApi.reducerPath]: employerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
      },
      preloadedState: {
        user: {
          userDetails: { name: 'Test User', role: 'candidate' },
          token: 'access-token',
          refreshToken: 'refresh-token-123',
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          employerApi.middleware,
          profileApi.middleware
        ),
    });

    // Mock API error
    mockLogoutMutation.mockResolvedValue({
      unwrap: () => Promise.reject(new Error('Network error')),
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapperWithToken = ({ children }: { children: React.ReactNode }) => (
      <Provider store={storeWithToken}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(() => useLogout(), {
      wrapper: wrapperWithToken,
    });

    const [handleLogout] = result.current;

    // Call logout
    await handleLogout();

    await waitFor(() => {
      expect(mockLogoutMutation).toHaveBeenCalledWith('refresh-token-123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should return user details from state', () => {
    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
        [employerApi.reducerPath]: employerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
      },
      preloadedState: {
        user: {
          userDetails: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'employer',
          },
          token: 'token-123',
          refreshToken: 'refresh-123',
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          employerApi.middleware,
          profileApi.middleware
        ),
    });

    const wrapperWithUser = ({ children }: { children: React.ReactNode }) => (
      <Provider store={storeWithUser}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(() => useLogout(), {
      wrapper: wrapperWithUser,
    });

    const [, , user] = result.current;

    expect(user).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'employer',
    });
  });

  it('should clear API state on logout', async () => {
    const storeWithToken = configureStore({
      reducer: {
        user: userReducer,
        [employerApi.reducerPath]: employerApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
      },
      preloadedState: {
        user: {
          userDetails: { name: 'Test' },
          token: 'token',
          refreshToken: 'refresh-token',
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          employerApi.middleware,
          profileApi.middleware
        ),
    });

    mockLogoutMutation.mockResolvedValue({
      unwrap: () => Promise.resolve({}),
    });

    const wrapperWithToken = ({ children }: { children: React.ReactNode }) => (
      <Provider store={storeWithToken}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(() => useLogout(), {
      wrapper: wrapperWithToken,
    });

    const [handleLogout] = result.current;

    // Verify initial state has user data
    expect(storeWithToken.getState().user.userDetails).toBeDefined();

    await handleLogout();

    await waitFor(() => {
      // Verify user state is cleared
      const userState = storeWithToken.getState().user;
      expect(userState.userDetails).toBeNull();
      expect(userState.token).toBeNull();
      expect(userState.refreshToken).toBeNull();
    });
  });
});