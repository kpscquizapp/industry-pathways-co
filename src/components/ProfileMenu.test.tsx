import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ProfileMenu from './ProfileMenu';
import userEvent from '@testing-library/user-event';

// Mock hooks and components
vi.mock('@/hooks/useLogout', () => ({
  default: vi.fn(() => [vi.fn(), false, null]),
}));

vi.mock('./ProfileDialog', () => ({
  default: ({ open, user }: any) => (
    <div data-testid="profile-dialog">{open ? 'Dialog Open' : 'Dialog Closed'}</div>
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/app/queries/employerApi', () => ({
  useGetEmployerProfileImageQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
  useGetEmployerProfileQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

describe('ProfileMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render profile menu with user avatar', () => {
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          role: 'employer',
          email: 'john@example.com',
        },
        token: 'test-token',
        refreshToken: 'refresh-token',
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="test-class" avatarFallback="bg-primary" />,
      {
        preloadedState: initialState,
      }
    );

    // Check if user name is displayed
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should display avatar fallback with first letter of name', () => {
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          firstName: 'Alice',
          role: 'employer',
        },
        token: 'test-token',
        refreshToken: null,
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="bg-blue-500" />,
      {
        preloadedState: initialState,
      }
    );

    // Check if fallback shows first letter
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should show role when firstName is not available', () => {
    const initialState = {
      user: {
        userDetails: {
          id: '2',
          role: 'employer',
        },
        token: 'test-token',
        refreshToken: null,
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="" />,
      {
        preloadedState: initialState,
      }
    );

    expect(screen.getByText('employer')).toBeInTheDocument();
  });

  it('should open dropdown menu on click', async () => {
    const user = userEvent.setup();
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          firstName: 'Test',
          role: 'employer',
        },
        token: 'test-token',
        refreshToken: null,
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="" />,
      {
        preloadedState: initialState,
      }
    );

    // Click the dropdown trigger
    const button = screen.getByRole('button');
    await user.click(button);

    // Check for dropdown items
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should handle profile click for HR role', async () => {
    const user = userEvent.setup();
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          firstName: 'HR',
          role: 'hr',
        },
        token: 'test-token',
        refreshToken: null,
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="" />,
      {
        preloadedState: initialState,
      }
    );

    const button = screen.getByRole('button');
    await user.click(button);

    const profileMenuItem = screen.getByText('Profile');
    expect(profileMenuItem).toBeInTheDocument();
  });

  it('should display loading state when logging out', async () => {
    const mockLogout = vi.fn();
    const mockUseLogout = await import('@/hooks/useLogout');
    vi.mocked(mockUseLogout.default).mockReturnValue([mockLogout, true, null]);

    const user = userEvent.setup();
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          firstName: 'Test',
          role: 'employer',
        },
        token: 'test-token',
        refreshToken: 'refresh',
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="" />,
      {
        preloadedState: initialState,
      }
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Signing out...')).toBeInTheDocument();
  });

  it('should call logout when sign out is clicked', async () => {
    const mockLogout = vi.fn();
    const mockUseLogout = await import('@/hooks/useLogout');
    vi.mocked(mockUseLogout.default).mockReturnValue([mockLogout, false, null]);

    const user = userEvent.setup();
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          firstName: 'Test',
          role: 'employer',
        },
        token: 'test-token',
        refreshToken: 'refresh',
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="" />,
      {
        preloadedState: initialState,
      }
    );

    const button = screen.getByRole('button');
    await user.click(button);

    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('should show default "U" when no user data available', () => {
    const initialState = {
      user: {
        userDetails: null,
        token: null,
        refreshToken: null,
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="" />,
      {
        preloadedState: initialState,
      }
    );

    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('should handle candidate role navigation', async () => {
    const user = userEvent.setup();
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          firstName: 'Candidate',
          role: 'candidate',
        },
        token: 'test-token',
        refreshToken: null,
      },
    };

    renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="" />,
      {
        preloadedState: initialState,
      }
    );

    const button = screen.getByRole('button');
    await user.click(button);

    const profileMenuItem = screen.getByText('Profile');
    expect(profileMenuItem).toBeInTheDocument();
  });

  it('should disable sign out button when loading', async () => {
    const mockLogout = vi.fn();
    const mockUseLogout = await import('@/hooks/useLogout');
    vi.mocked(mockUseLogout.default).mockReturnValue([mockLogout, true, null]);

    const user = userEvent.setup();
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          firstName: 'Test',
          role: 'employer',
        },
        token: 'test-token',
        refreshToken: 'refresh',
      },
    };

    const { container } = renderWithProviders(
      <ProfileMenu btnClass="" avatarFallback="" />,
      {
        preloadedState: initialState,
      }
    );

    const button = screen.getByRole('button');
    await user.click(button);

    const signOutItem = screen.getByText('Signing out...').closest('[role="menuitem"]');
    expect(signOutItem).toHaveAttribute('data-disabled', '');
  });
});