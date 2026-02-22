import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import EmployerLogin from './EmployerLogin';

// Mock the login API
const mockLoginMutation = vi.fn();
vi.mock('@/app/queries/loginApi', () => ({
  useLoginEmployerMutation: () => [
    mockLoginMutation,
    { isLoading: false },
  ],
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  };
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('EmployerLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginMutation.mockReset();
    mockNavigate.mockReset();
  });

  it('should render login form', () => {
    renderWithProviders(<EmployerLogin />);

    expect(screen.getByText('Hire Talent Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('employer@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation error for empty email', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    renderWithProviders(<EmployerLogin />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email address is required');
    });
  });

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    renderWithProviders(<EmployerLogin />);

    const emailInput = screen.getByPlaceholderText('employer@example.com');
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address');
    });
  });

  it('should show validation error for empty password', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    renderWithProviders(<EmployerLogin />);

    const emailInput = screen.getByPlaceholderText('employer@example.com');
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Password is required');
    });
  });

  it('should show validation error for short password', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    renderWithProviders(<EmployerLogin />);

    const emailInput = screen.getByPlaceholderText('employer@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Password must be at least 8 characters'
      );
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();

    renderWithProviders(<EmployerLogin />);

    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleButton = screen.getByLabelText('Show password');
    await user.click(toggleButton);

    expect(passwordInput.type).toBe('text');

    await user.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    mockLoginMutation.mockResolvedValue({
      unwrap: () =>
        Promise.resolve({
          user: { firstName: 'John', id: '1', role: 'employer' },
          token: 'test-token',
        }),
    });

    renderWithProviders(<EmployerLogin />);

    const emailInput = screen.getByPlaceholderText('employer@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginMutation).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(toast.success).toHaveBeenCalledWith('Welcome back, John!');
      expect(mockNavigate).toHaveBeenCalledWith('/hire-talent/dashboard');
    });
  });

  it('should handle login failure with 401 error', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    mockLoginMutation.mockResolvedValue({
      unwrap: () =>
        Promise.reject({
          status: 401,
          data: {},
        }),
    });

    renderWithProviders(<EmployerLogin />);

    const emailInput = screen.getByPlaceholderText('employer@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'WrongPass123!');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid email or password. Please check your credentials and try again.'
      );
    });
  });

  it('should handle login failure with 403 error (account suspended)', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    mockLoginMutation.mockResolvedValue({
      unwrap: () =>
        Promise.reject({
          status: 403,
          data: {},
        }),
    });

    renderWithProviders(<EmployerLogin />);

    const emailInput = screen.getByPlaceholderText('employer@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'suspended@example.com');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Your account has been suspended. Please contact support.'
      );
    });
  });

  it('should handle too many login attempts error', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    mockLoginMutation.mockResolvedValue({
      unwrap: () =>
        Promise.reject({
          status: 429,
          data: {},
        }),
    });

    renderWithProviders(<EmployerLogin />);

    const emailInput = screen.getByPlaceholderText('employer@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Too many login attempts. Please try again in a few minutes.'
      );
    });
  });

  it('should clear field errors when user starts typing', async () => {
    const user = userEvent.setup();
    const { toast } = await import('sonner');

    renderWithProviders(<EmployerLogin />);

    // First submit to trigger errors
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    // Type in email field
    const emailInput = screen.getByPlaceholderText('employer@example.com');
    await user.type(emailInput, 'test@example.com');

    // Email field should no longer show error
    const emailField = emailInput.closest('div');
    expect(emailField?.querySelector('.border-red-500')).not.toBeInTheDocument();
  });

  it('should sanitize email before submission', async () => {
    const user = userEvent.setup();

    mockLoginMutation.mockResolvedValue({
      unwrap: () =>
        Promise.resolve({
          user: { firstName: 'Test', id: '1', role: 'employer' },
          token: 'test-token',
        }),
    });

    renderWithProviders(<EmployerLogin />);

    const emailInput = screen.getByPlaceholderText('employer@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    // Type with spaces and mixed case
    await user.type(emailInput, '  Test@Example.COM  ');
    await user.type(passwordInput, 'Password123!');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginMutation).toHaveBeenCalledWith({
        email: 'test@example.com', // Should be lowercased and trimmed
        password: 'Password123!',
      });
    });
  });

  it('should redirect if user is already logged in as employer', () => {
    const initialState = {
      user: {
        userDetails: {
          id: '1',
          role: 'employer',
          firstName: 'John',
        },
        token: 'existing-token',
        refreshToken: 'refresh-token',
      },
    };

    renderWithProviders(<EmployerLogin />, {
      preloadedState: initialState,
    });

    expect(mockNavigate).toHaveBeenCalledWith('/hire-talent/dashboard');
  });

  it('should have link to signup page', () => {
    renderWithProviders(<EmployerLogin />);

    const signupLink = screen.getByText('Sign up here');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/hire-talent-signup');
  });

  it('should have link to forgot password', () => {
    renderWithProviders(<EmployerLogin />);

    const forgotPasswordLink = screen.getByText('Forgot Password?');
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });
});