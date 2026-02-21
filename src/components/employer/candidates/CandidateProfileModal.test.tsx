import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/test-utils';
import CandidateProfileModal, {
  CandidateProfile,
} from './CandidateProfileModal';

// Mock the benchApi
const mockDownloadResume = vi.fn();
vi.mock('../../../app/queries/benchApi', () => ({
  useDownloadBenchResumeMutation: () => [
    mockDownloadResume,
    { isLoading: false },
  ],
  benchApi: {
    reducerPath: 'benchApi',
    reducer: vi.fn((state = {}) => state),
    middleware: vi.fn(() => (next: any) => (action: any) => next(action)),
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CandidateProfileModal', () => {
  const mockCandidate: CandidateProfile = {
    id: 1,
    name: 'John Doe',
    role: 'Senior React Developer',
    avatar: 'https://example.com/avatar.jpg',
    matchScore: 85,
    technicalScore: 9,
    communicationScore: 8,
    problemSolvingScore: 9,
    hourlyRate: { min: 50, max: 80 },
    availability: 'Immediate',
    location: 'New York, USA',
    experience: '5 Years',
    englishLevel: 'Native',
    type: 'individual',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    certifications: [
      { name: 'AWS Certified', issuer: 'Amazon', year: '2023' },
    ],
    about: 'Experienced developer with a passion for building scalable applications.',
    workExperience: [
      {
        role: 'Senior Developer',
        company: 'Tech Corp',
        period: '2020 - Present',
        location: 'New York',
        highlights: ['Led team of 5 developers', 'Improved performance by 50%'],
      },
    ],
    projects: [
      {
        name: 'E-commerce App',
        description: 'Built a scalable e-commerce platform',
        technologies: ['React', 'Node.js'],
        icon: 'shopping',
      },
    ],
  };

  const mockBenchCandidate: CandidateProfile = {
    ...mockCandidate,
    id: 2,
    name: 'Jane Smith',
    type: 'bench',
    company: 'TechStaff Solutions',
  };

  const mockOnClose = vi.fn();
  const mockOnScheduleInterview = vi.fn();
  const mockOnShortlist = vi.fn();
  const mockOnSkillTest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockDownloadResume.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ data: {} }),
    });
  });

  describe('Rendering', () => {
    it('should not render when candidate is null', () => {
      const { container } = render(
        <CandidateProfileModal
          candidate={null}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render candidate name and role', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
    });

    it('should render hourly rate', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText(/\$50 - \$80 \/ hr/)).toBeInTheDocument();
    });

    it('should render availability', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('Immediate')).toBeInTheDocument();
    });

    it('should render location', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('New York, USA')).toBeInTheDocument();
    });

    it('should render experience', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('5 Years')).toBeInTheDocument();
    });

    it('should render English level when provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('Native')).toBeInTheDocument();
    });

    it('should not render English level when not provided', () => {
      const candidateWithoutEnglish = { ...mockCandidate, englishLevel: undefined };
      render(
        <CandidateProfileModal
          candidate={candidateWithoutEnglish}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });
  });

  describe('Skills Display', () => {
    it('should render all skills', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('GraphQL')).toBeInTheDocument();
    });
  });

  describe('Bench Resource Badge', () => {
    it('should show bench resource badge for bench candidates', () => {
      render(
        <CandidateProfileModal
          candidate={mockBenchCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('BENCH RESOURCE')).toBeInTheDocument();
    });

    it('should not show bench resource badge for individual candidates', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText('BENCH RESOURCE')).not.toBeInTheDocument();
    });
  });

  describe('Scores Display', () => {
    it('should render match score when provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('AI Matching Score')).toBeInTheDocument();
    });

    it('should render technical score when provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      // Check for "Technical Skill" label which indicates scores are rendered
      expect(screen.getByText('Technical Skill')).toBeInTheDocument();
    });

    it('should not render scores section when matchScore is undefined', () => {
      const candidateWithoutScore = { ...mockCandidate, matchScore: undefined };
      render(
        <CandidateProfileModal
          candidate={candidateWithoutScore}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText('AI Matching Score')).not.toBeInTheDocument();
    });
  });

  describe('About Section', () => {
    it('should render about section when provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('About Candidate')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Experienced developer with a passion for building scalable applications.',
        ),
      ).toBeInTheDocument();
    });

    it('should not render about section when not provided', () => {
      const candidateWithoutAbout = { ...mockCandidate, about: undefined };
      render(
        <CandidateProfileModal
          candidate={candidateWithoutAbout}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText('About Candidate')).not.toBeInTheDocument();
    });
  });

  describe('Work Experience', () => {
    it('should render work experience when provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText(/2020 - Present/)).toBeInTheDocument();
    });

    it('should not render work experience section when not provided', () => {
      const candidateWithoutWork = { ...mockCandidate, workExperience: undefined };
      render(
        <CandidateProfileModal
          candidate={candidateWithoutWork}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText('Work Experience')).not.toBeInTheDocument();
    });
  });

  describe('Certifications', () => {
    it('should render certifications when provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('Certifications')).toBeInTheDocument();
      expect(screen.getByText('AWS Certified')).toBeInTheDocument();
      expect(screen.getByText('Issued 2023')).toBeInTheDocument();
    });

    it('should not render certifications section when empty array', () => {
      const candidateWithoutCerts = { ...mockCandidate, certifications: [] };
      render(
        <CandidateProfileModal
          candidate={candidateWithoutCerts}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText('Certifications')).not.toBeInTheDocument();
    });
  });

  describe('Projects', () => {
    it('should render projects when provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('Featured Projects')).toBeInTheDocument();
      expect(screen.getByText('E-commerce App')).toBeInTheDocument();
    });

    it('should not render projects section when empty array', () => {
      const candidateWithoutProjects = { ...mockCandidate, projects: [] };
      render(
        <CandidateProfileModal
          candidate={candidateWithoutProjects}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText('Featured Projects')).not.toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render Download Resume button', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      const buttons = screen.getAllByText('Download Resume');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render Book Interview button when handler is provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
          onScheduleInterview={mockOnScheduleInterview}
        />,
      );

      expect(screen.getByText('Book Interview')).toBeInTheDocument();
    });

    it('should not render Book Interview button when handler is not provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText('Book Interview')).not.toBeInTheDocument();
    });

    it('should render Shortlist button when handler is provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
          onShortlist={mockOnShortlist}
        />,
      );

      expect(screen.getByText('Shortlist')).toBeInTheDocument();
    });

    it('should render Schedule Skill Test button when handler is provided', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
          onSkillTest={mockOnSkillTest}
        />,
      );

      expect(screen.getByText('Schedule Skill Test')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onShortlist when Shortlist button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
          onShortlist={mockOnShortlist}
        />,
      );

      const button = screen.getByText('Shortlist');
      await user.click(button);

      await waitFor(() => {
        expect(mockOnShortlist).toHaveBeenCalledWith(mockCandidate);
      });
    });

    it('should call onScheduleInterview when Book Interview button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
          onScheduleInterview={mockOnScheduleInterview}
        />,
      );

      const button = screen.getByText('Book Interview');
      await user.click(button);

      await waitFor(() => {
        expect(mockOnScheduleInterview).toHaveBeenCalledWith(mockCandidate);
      });
    });

    it('should call onSkillTest when Schedule Skill Test button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
          onSkillTest={mockOnSkillTest}
        />,
      );

      const button = screen.getByText('Schedule Skill Test');
      await user.click(button);

      await waitFor(() => {
        expect(mockOnSkillTest).toHaveBeenCalledWith(mockCandidate);
      });
    });
  });

  describe('Tabs', () => {
    it('should render Overview and Resume tabs', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Resume')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle candidate with minimal data', () => {
      const minimalCandidate: CandidateProfile = {
        id: 999,
        name: 'Minimal User',
        role: 'Developer',
        hourlyRate: { min: 30, max: 50 },
        availability: 'Available',
        location: 'Remote',
        experience: '2 Years',
        type: 'individual',
        skills: [],
      };

      render(
        <CandidateProfileModal
          candidate={minimalCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('Minimal User')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
    });

    it('should handle very long skill lists', () => {
      const candidateWithManySkills: CandidateProfile = {
        ...mockCandidate,
        skills: Array.from({ length: 20 }, (_, i) => `Skill ${i + 1}`),
      };

      render(
        <CandidateProfileModal
          candidate={candidateWithManySkills}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('Skill 1')).toBeInTheDocument();
    });

    it('should handle string candidate ID', () => {
      const candidateWithStringId: CandidateProfile = {
        ...mockCandidate,
        id: 'string-id-123',
      };

      render(
        <CandidateProfileModal
          candidate={candidateWithStringId}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('ScoreCircle Component', () => {
    it('should render score circles with correct values', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      // Match score should be displayed
      expect(screen.getByText('85')).toBeInTheDocument();
    });

    it('should handle score of 0', () => {
      const candidateWithZeroScore: CandidateProfile = {
        ...mockCandidate,
        matchScore: 0,
      };

      render(
        <CandidateProfileModal
          candidate={candidateWithZeroScore}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle score of 100', () => {
      const candidateWithPerfectScore: CandidateProfile = {
        ...mockCandidate,
        matchScore: 100,
      };

      render(
        <CandidateProfileModal
          candidate={candidateWithPerfectScore}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper avatar fallback with initials', () => {
      render(
        <CandidateProfileModal
          candidate={mockCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      // Should show initials JD for John Doe
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should handle single name for avatar fallback', () => {
      const singleNameCandidate: CandidateProfile = {
        ...mockCandidate,
        name: 'Madonna',
      };

      render(
        <CandidateProfileModal
          candidate={singleNameCandidate}
          open={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('M')).toBeInTheDocument();
    });
  });
});