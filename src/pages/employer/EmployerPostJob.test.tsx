import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import EmployerPostJob from './EmployerPostJob';

const mockNavigate = vi.fn();
const mockCreateJob = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../app/queries/jobApi', () => ({
  useCreateJobMutation: () => [
    mockCreateJob,
    { isLoading: false },
  ],
  jobApi: {
    reducerPath: 'jobApi',
    reducer: vi.fn((state = {}) => state),
    middleware: vi.fn(() => (next: any) => (action: any) => next(action)),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('EmployerPostJob', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the page title', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Post a New Job')).toBeInTheDocument();
    });

    it('should render the page description', () => {
      render(<EmployerPostJob />);
      expect(
        screen.getByText('Create a contract opportunity for top talent'),
      ).toBeInTheDocument();
    });

    it('should render all accordion sections', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByText('Skills & Experience')).toBeInTheDocument();
      expect(screen.getByText('Location & Terms')).toBeInTheDocument();
      expect(screen.getByText('Budget & Duration')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Save Draft')).toBeInTheDocument();
      expect(screen.getByText('Post Job')).toBeInTheDocument();
      expect(screen.getByText('Post & Show Relevant Profiles')).toBeInTheDocument();
    });
  });

  describe('Basic Information Section', () => {
    it('should render job title input', () => {
      render(<EmployerPostJob />);
      const input = screen.getByLabelText('Job Title');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'e.g., Senior React Native Developer (Contract)');
    });

    it('should render job description textarea', () => {
      render(<EmployerPostJob />);
      const textarea = screen.getByLabelText('Job Description');
      expect(textarea).toBeInTheDocument();
    });

    it('should render job category select', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Job Category')).toBeInTheDocument();
    });

    it('should render employment type select', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Employment Type')).toBeInTheDocument();
    });

    it('should render number of openings input', () => {
      render(<EmployerPostJob />);
      const input = screen.getByLabelText('Number of Openings');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Skills Section', () => {
    it('should render skill input field', () => {
      render(<EmployerPostJob />);
      const input = screen.getByPlaceholderText('Add a skill...');
      expect(input).toBeInTheDocument();
    });

    it('should add skill when Add button is clicked', async () => {
      const user = userEvent.setup();
      render(<EmployerPostJob />);

      const input = screen.getByPlaceholderText('Add a skill...');
      const addButton = screen.getByRole('button', { name: /Add/i });

      await user.type(input, 'React');
      await user.click(addButton);

      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should add skill when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<EmployerPostJob />);

      const input = screen.getByPlaceholderText('Add a skill...');
      await user.type(input, 'TypeScript{Enter}');

      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should not add duplicate skills', async () => {
      const user = userEvent.setup();
      render(<EmployerPostJob />);

      const input = screen.getByPlaceholderText('Add a skill...');
      const addButton = screen.getByRole('button', { name: /Add/i });

      await user.type(input, 'React');
      await user.click(addButton);

      await user.type(input, 'React');
      await user.click(addButton);

      const skillBadges = screen.getAllByText('React');
      expect(skillBadges.length).toBe(1);
    });

    it('should not add empty skill', async () => {
      const user = userEvent.setup();
      render(<EmployerPostJob />);

      const addButton = screen.getByRole('button', { name: /Add/i });
      await user.click(addButton);

      const badges = screen.queryByRole('button', { name: /×/ });
      expect(badges).not.toBeInTheDocument();
    });

    it('should remove skill when X button is clicked', async () => {
      const user = userEvent.setup();
      render(<EmployerPostJob />);

      const input = screen.getByPlaceholderText('Add a skill...');
      const addButton = screen.getByRole('button', { name: /Add/i });

      await user.type(input, 'React');
      await user.click(addButton);

      expect(screen.getByText('React')).toBeInTheDocument();

      // Find and click the X button within the skill badge
      const skillBadge = screen.getByText('React').closest('div');
      const removeButton = skillBadge?.querySelector('button');
      if (removeButton) {
        await user.click(removeButton);
      }

      await waitFor(() => {
        expect(screen.queryByText('React')).not.toBeInTheDocument();
      });
    });

    it('should render experience level select', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Experience Level')).toBeInTheDocument();
    });

    it('should render certifications input', () => {
      render(<EmployerPostJob />);
      const input = screen.getByLabelText('Certifications');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'e.g., AWS Certified, PMP, CISSP');
    });
  });

  describe('Location & Terms Section', () => {
    it('should render work mode select', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Work Mode')).toBeInTheDocument();
    });

    it('should render location input', () => {
      render(<EmployerPostJob />);
      const input = screen.getByLabelText('Location');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'City, Country');
    });

    it('should render open to bench resources toggle', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Open to Bench Resources')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Allow agencies and companies to propose their bench employees',
        ),
      ).toBeInTheDocument();
    });

    it.skip('should toggle bench resources switch', async () => {
      const user = userEvent.setup();
      render(<EmployerPostJob />);

      const switchElement = screen
        .getByText('Open to Bench Resources')
        .closest('div')
        ?.querySelector('button');

      expect(switchElement).toBeInTheDocument();
      if (switchElement) {
        await user.click(switchElement);
        // Switch should be toggled
      }
    });
  });

  describe('Budget & Duration Section', () => {
    it('should render duration input', () => {
      render(<EmployerPostJob />);
      const input = screen.getByLabelText('Duration');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render start date input', () => {
      render(<EmployerPostJob />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'date');
    });

    it('should render payment type select', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Payment Type')).toBeInTheDocument();
    });

    it('should render currency select', () => {
      render(<EmployerPostJob />);
      expect(screen.getByText('Currency')).toBeInTheDocument();
    });

    it('should render min budget input', () => {
      render(<EmployerPostJob />);
      const input = screen.getByLabelText(/Min Budget/);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render max budget input', () => {
      render(<EmployerPostJob />);
      const input = screen.getByLabelText(/Max Budget/);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Form Submission - Post Job', () => {
    it('should show error when title is missing', async () => {
      const user = userEvent.setup();
      const toast = await import('sonner');

      render(<EmployerPostJob />);

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(toast.toast.error).toHaveBeenCalledWith(
          'Job title and description are required.',
        );
      });
    });

    it('should show error when description is missing', async () => {
      const user = userEvent.setup();
      const toast = await import('sonner');

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      await user.type(titleInput, 'Senior Developer');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(toast.toast.error).toHaveBeenCalledWith(
          'Job title and description are required.',
        );
      });
    });

    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 123 } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');

      await user.type(titleInput, 'Senior React Developer');
      await user.type(descriptionInput, 'Looking for an experienced React developer');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(mockCreateJob).toHaveBeenCalled();
      });
    });

    it('should navigate to dashboard after successful post', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 123 } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');

      await user.type(titleInput, 'Senior Developer');
      await user.type(descriptionInput, 'Job description here');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/hire-talent/dashboard', undefined);
      });
    });
  });

  describe('Form Submission - Post and Show Profiles', () => {
    it('should enable AI matching when Post & Show Relevant Profiles is clicked', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 456 } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');

      await user.type(titleInput, 'Senior Developer');
      await user.type(descriptionInput, 'Job description');

      const button = screen.getByText('Post & Show Relevant Profiles');
      await user.click(button);

      await waitFor(() => {
        expect(mockCreateJob).toHaveBeenCalledWith(
          expect.objectContaining({
            enableAiTalentMatching: true,
            aiMatchingEnabled: true,
          }),
        );
      });
    });

    it('should navigate to ai-shortlists with jobId after successful post with AI', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 789 } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');

      await user.type(titleInput, 'Senior Developer');
      await user.type(descriptionInput, 'Job description');

      const button = screen.getByText('Post & Show Relevant Profiles');
      await user.click(button);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          '/hire-talent/ai-shortlists?jobId=789',
          expect.objectContaining({
            state: expect.objectContaining({
              job: expect.any(Object),
            }),
          }),
        );
      });
    });
  });

  describe('Save Draft', () => {
    it('should show info message when Save Draft is clicked', async () => {
      const user = userEvent.setup();
      const toast = await import('sonner');

      render(<EmployerPostJob />);

      const draftButton = screen.getByText('Save Draft');
      await user.click(draftButton);

      await waitFor(() => {
        expect(toast.toast.info).toHaveBeenCalledWith(
          'Draft saving is not yet available.',
        );
      });
    });
  });

  describe('Form Data Handling', () => {
    it('should handle skill addition and form submission together', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 111 } }),
      });

      render(<EmployerPostJob />);

      // Fill basic info
      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');
      await user.type(titleInput, 'Developer');
      await user.type(descriptionInput, 'Description');

      // Add skills
      const skillInput = screen.getByPlaceholderText('Add a skill...');
      const addButton = screen.getByRole('button', { name: /Add/i });
      await user.type(skillInput, 'React');
      await user.click(addButton);
      await user.type(skillInput, 'Node.js');
      await user.click(addButton);

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(mockCreateJob).toHaveBeenCalledWith(
          expect.objectContaining({
            skills: expect.arrayContaining([
              { name: 'React' },
              { name: 'Node.js' },
            ]),
          }),
        );
      });
    });

    it('should handle salary range normalization when min > max', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 222 } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');
      const minBudget = screen.getByLabelText(/Min Budget/);
      const maxBudget = screen.getByLabelText(/Max Budget/);

      await user.type(titleInput, 'Developer');
      await user.type(descriptionInput, 'Description');
      await user.type(minBudget, '5000');
      await user.type(maxBudget, '3000');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(mockCreateJob).toHaveBeenCalledWith(
          expect.objectContaining({
            salaryMin: 3000, // Swapped
            salaryMax: 5000, // Swapped
          }),
        );
      });
    });

    it('should parse certifications as comma-separated array', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 333 } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');
      const certsInput = screen.getByLabelText('Certifications');

      await user.type(titleInput, 'Developer');
      await user.type(descriptionInput, 'Description');
      await user.type(certsInput, 'AWS, PMP, CISSP');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(mockCreateJob).toHaveBeenCalledWith(
          expect.objectContaining({
            certifications: ['AWS', 'PMP', 'CISSP'],
          }),
        );
      });
    });

    it('should map duration units correctly', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 444 } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');
      const durationInput = screen.getByLabelText('Duration');

      await user.type(titleInput, 'Developer');
      await user.type(descriptionInput, 'Description');
      await user.type(durationInput, '6');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(mockCreateJob).toHaveBeenCalledWith(
          expect.objectContaining({
            duration: 6,
          }),
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error toast on submission failure', async () => {
      const user = userEvent.setup();
      const toast = await import('sonner');
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue({ data: { message: 'Server error' } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');

      await user.type(titleInput, 'Developer');
      await user.type(descriptionInput, 'Description');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(toast.toast.error).toHaveBeenCalledWith('Server error');
      });
    });

    it('should show generic error message when error has no message', async () => {
      const user = userEvent.setup();
      const toast = await import('sonner');
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue({}),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');

      await user.type(titleInput, 'Developer');
      await user.type(descriptionInput, 'Description');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(toast.toast.error).toHaveBeenCalledWith('Failed to post job');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only title as invalid', async () => {
      const user = userEvent.setup();
      const toast = await import('sonner');

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');

      await user.type(titleInput, '   ');
      await user.type(descriptionInput, 'Description');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(toast.toast.error).toHaveBeenCalledWith(
          'Job title and description are required.',
        );
      });
    });

    it('should trim whitespace from skills', async () => {
      const user = userEvent.setup();
      render(<EmployerPostJob />);

      const input = screen.getByPlaceholderText('Add a skill...');
      const addButton = screen.getByRole('button', { name: /Add/i });

      await user.type(input, '  React  ');
      await user.click(addButton);

      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should handle empty certifications string', async () => {
      const user = userEvent.setup();
      mockCreateJob.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ data: { id: 555 } }),
      });

      render(<EmployerPostJob />);

      const titleInput = screen.getByLabelText('Job Title');
      const descriptionInput = screen.getByLabelText('Job Description');

      await user.type(titleInput, 'Developer');
      await user.type(descriptionInput, 'Description');

      const postButton = screen.getByText('Post Job');
      await user.click(postButton);

      await waitFor(() => {
        expect(mockCreateJob).toHaveBeenCalledWith(
          expect.objectContaining({
            certifications: undefined,
          }),
        );
      });
    });
  });
});