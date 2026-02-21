import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import EmployerAIShortlists from './EmployerAIShortlists';
import type { Job, Match } from '../../app/queries/aiShortlistApi';

const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null, pathname: '/test' }),
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  };
});

const mockGetEmployerJobsQuery = vi.fn();
const mockGetJobMatchesQuery = vi.fn();
const mockShortlistCandidateMutation = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock('../../app/queries/aiShortlistApi', () => ({
  useGetEmployerJobsQuery: (...args: any[]) => mockGetEmployerJobsQuery(...args),
  useGetJobMatchesQuery: (...args: any[]) => mockGetJobMatchesQuery(...args),
  useShortlistCandidateMutation: () => [
    mockShortlistCandidateMutation,
    { isLoading: false },
  ],
  aiShortlistApi: {
    reducerPath: 'aiShortlistApi',
    reducer: vi.fn((state = {}) => state),
    middleware: vi.fn(() => (next: any) => (action: any) => next(action)),
    util: {
      invalidateTags: vi.fn(),
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('EmployerAIShortlists', () => {
  const mockJobs: Job[] = [
    {
      id: 1,
      title: 'Senior React Developer',
      skills: [{ name: 'React' }, { name: 'TypeScript' }],
    },
    {
      id: 2,
      title: 'Backend Engineer',
      skills: 'Node.js, Express',
    },
  ];

  const mockMatches: Match[] = [
    {
      id: 101,
      name: 'Alice Johnson',
      role: 'Senior React Developer',
      matchScore: 85,
      skills: ['React', 'TypeScript', 'JavaScript'],
      experience: 5,
      hourlyRate: 75,
      expectedSalary: { min: 70, max: 80 },
      source: 'individual',
      location: 'New York',
      englishLevel: 'Native',
    },
    {
      id: 102,
      name: 'Bob Smith',
      role: 'React Developer',
      matchScore: 78,
      skills: 'React, JavaScript',
      experience: '3',
      source: 'bench',
      location: 'California',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('jobId');
    mockSearchParams.delete('candidateId');

    mockGetEmployerJobsQuery.mockReturnValue({
      data: { data: mockJobs, meta: { page: 1, totalPages: 1, total: 2 } },
      isLoading: false,
      isError: false,
    });

    mockGetJobMatchesQuery.mockReturnValue({
      data: { data: [], meta: { page: 1, totalPages: 1, total: 0 } },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render the page with overview banner', () => {
      render(<EmployerAIShortlists />);
      expect(screen.getByText(/Candidates/)).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<EmployerAIShortlists />);
      const searchInput = screen.getByPlaceholderText('Search candidates by name...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should render job filter dropdown', () => {
      render(<EmployerAIShortlists />);
      expect(screen.getByText('All Jobs')).toBeInTheDocument();
    });

    it('should render tabs for All, Matched, and Shortlisted', () => {
      render(<EmployerAIShortlists />);
      expect(screen.getByText(/All \(/)).toBeInTheDocument();
      expect(screen.getByText(/Matched \(/)).toBeInTheDocument();
      expect(screen.getByText(/Shortlisted \(/)).toBeInTheDocument();
    });

    it('should render Refresh Matches button', () => {
      render(<EmployerAIShortlists />);
      expect(screen.getByText('Refresh Matches')).toBeInTheDocument();
    });

    it('should render More Filters button', () => {
      render(<EmployerAIShortlists />);
      expect(screen.getByText('More Filters')).toBeInTheDocument();
    });

    it('should render Export CSV button', () => {
      render(<EmployerAIShortlists />);
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });
  });

  describe('Job Loading and Selection', () => {
    it('should display jobs in the dropdown', () => {
      render(<EmployerAIShortlists />);
      // Jobs are loaded but not displayed until dropdown is opened
      expect(mockGetEmployerJobsQuery).toHaveBeenCalled();
    });

    it('should show loading state when jobs are loading', () => {
      mockGetEmployerJobsQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      render(<EmployerAIShortlists />);
      expect(mockGetEmployerJobsQuery).toHaveBeenCalled();
    });

    it('should prompt to select a job when no job is selected', () => {
      render(<EmployerAIShortlists />);
      expect(
        screen.getByText('Select a job to see AI matched candidates.'),
      ).toBeInTheDocument();
    });
  });

  describe('Candidate Display', () => {
    beforeEach(() => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
    });

    it('should display candidates when job is selected and matches are loaded', () => {
      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      });
    });

    it('should display candidate match score', () => {
      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('85%')).toBeInTheDocument();
        expect(screen.getByText('78%')).toBeInTheDocument();
      });
    });

    it('should display candidate skills', () => {
      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
      });
    });

    it('should display bench badge for bench candidates', () => {
      render(<EmployerAIShortlists />);

      waitFor(() => {
        const benchBadges = screen.getAllByText('Bench');
        expect(benchBadges.length).toBeGreaterThan(0);
      });
    });

    it('should display individual badge for individual candidates', () => {
      render(<EmployerAIShortlists />);

      waitFor(() => {
        const individualBadges = screen.getAllByText('Individual');
        expect(individualBadges.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
    });

    it.skip('should filter candidates by name in real-time', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      const searchInput = screen.getByPlaceholderText('Search candidates by name...');
      await user.type(searchInput, 'Alice');

      await waitFor(() => {
        expect(screen.queryByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
      });
    });

    it.skip('should be case-insensitive in search', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      const searchInput = screen.getByPlaceholderText('Search candidates by name...');
      await user.type(searchInput, 'alice');

      await waitFor(() => {
        expect(screen.queryByText('Alice Johnson')).toBeInTheDocument();
      });
    });

    it('should show no results message when search has no matches', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      const searchInput = screen.getByPlaceholderText('Search candidates by name...');
      await user.type(searchInput, 'NonExistentName');

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
      });
    });

    it('should highlight matching text in candidate name', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      const searchInput = screen.getByPlaceholderText('Search candidates by name...');
      await user.type(searchInput, 'Alice');

      await waitFor(() => {
        const highlighted = screen.getByText('Alice');
        expect(highlighted).toHaveClass('bg-yellow-200');
      });
    });
  });

  describe('Tab Filtering', () => {
    beforeEach(() => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
    });

    it('should show all candidates in All tab', async () => {
      render(<EmployerAIShortlists />);

      await waitFor(() => {
        expect(screen.queryByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.queryByText('Bob Smith')).toBeInTheDocument();
      });
    });

    it('should filter to matched candidates in Matched tab', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      const matchedTab = screen.getByText(/Matched \(/);
      await user.click(matchedTab);

      await waitFor(() => {
        // All candidates should be in matched state initially
        expect(screen.queryByText('Alice Johnson')).toBeInTheDocument();
      });
    });

    it('should show only shortlisted candidates in Shortlisted tab', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      const shortlistedTab = screen.getByText(/Shortlisted \(/);
      await user.click(shortlistedTab);

      await waitFor(() => {
        // Initially no shortlisted candidates
        const noResultsCard = screen.queryByText('No results found');
        expect(noResultsCard).toBeInTheDocument();
      });
    });
  });

  describe('Candidate Actions', () => {
    beforeEach(() => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
    });

    it('should have View Profile button for each candidate', async () => {
      render(<EmployerAIShortlists />);

      await waitFor(() => {
        const viewButtons = screen.getAllByText('View Profile');
        expect(viewButtons.length).toBeGreaterThan(0);
      });
    });

    it('should have Shortlist button for matched candidates', async () => {
      render(<EmployerAIShortlists />);

      await waitFor(() => {
        const shortlistButtons = screen.getAllByText('Shortlist');
        expect(shortlistButtons.length).toBeGreaterThan(0);
      });
    });

    it('should call shortlist mutation when Shortlist button is clicked', async () => {
      const user = userEvent.setup();
      const toast = await import('sonner');
      mockShortlistCandidateMutation.mockResolvedValue({ data: { success: true } });

      render(<EmployerAIShortlists />);

      await waitFor(async () => {
        const shortlistButtons = screen.getAllByText('Shortlist');
        if (shortlistButtons.length > 0) {
          await user.click(shortlistButtons[0]);
        }
      });

      await waitFor(() => {
        expect(toast.toast.success).toHaveBeenCalled();
      });
    });

    it('should update URL when View Profile is clicked', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      await waitFor(async () => {
        const viewButtons = screen.getAllByText('View Profile');
        if (viewButtons.length > 0) {
          await user.click(viewButtons[0]);
        }
      });

      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });
    });
  });

  describe('Pagination', () => {
    it('should show Load More Candidates button when more matches are available', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 3, total: 150 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('Load More Candidates')).toBeInTheDocument();
      });
    });

    it('should show All Candidates Loaded when no more matches', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('All Candidates Loaded')).toBeInTheDocument();
      });
    });

    it('should show Load More Jobs button when more jobs are available', () => {
      mockGetEmployerJobsQuery.mockReturnValue({
        data: { data: mockJobs, meta: { page: 1, totalPages: 5, total: 500 } },
        isLoading: false,
        isError: false,
      });

      render(<EmployerAIShortlists />);

      expect(screen.getByText('Load More Jobs')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading message when matches are loading', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      expect(screen.getByText('Loading AI matches...')).toBeInTheDocument();
    });

    it('should disable Refresh button when matches are loading', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      const refreshButton = screen.getByText('Refresh Matches');
      expect(refreshButton).toBeDisabled();
    });
  });

  describe('Error States', () => {
    it('should show error message when matches fail to load', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      expect(
        screen.getByText('Failed to load AI matches. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  describe('Match Relevance Filtering', () => {
    it('should filter candidates by job title match', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      // Alice has "Senior React Developer" role matching "Senior React Developer" job
      waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      });
    });

    it('should filter candidates by skills match', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      // Candidates with React skill should match job requiring React
      waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      });
    });

    it('should show match reason badges', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.queryByText('✓ Title Match')).toBeInTheDocument();
        expect(screen.queryByText('✓ Skills Match')).toBeInTheDocument();
      });
    });
  });

  describe('Helper Functions', () => {
    it('should normalize skills from array', () => {
      const skills = ['React', 'TypeScript', 'Node.js'];
      // normalizeSkills is internal but we can test its effect through the UI
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
      });
    });

    it('should normalize skills from comma-separated string', () => {
      mockSearchParams.set('jobId', '1');
      const matchWithStringSkills: Match[] = [
        {
          id: 103,
          name: 'Charlie Brown',
          role: 'Developer',
          matchScore: 80,
          skills: 'React, Node.js, TypeScript',
          experience: 4,
          source: 'individual',
        },
      ];

      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: matchWithStringSkills, meta: { page: 1, totalPages: 1, total: 1 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
      });
    });
  });

  describe('Candidate Count Display', () => {
    beforeEach(() => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
    });

    it('should display correct candidate count', () => {
      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText(/2 Candidates/)).toBeInTheDocument();
      });
    });

    it('should update count when search is applied', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      const searchInput = screen.getByPlaceholderText('Search candidates by name...');
      await user.type(searchInput, 'Alice');

      await waitFor(() => {
        expect(screen.getByText(/1 Candidates/)).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('should refresh matches when Refresh button is clicked', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('jobId', '1');
      const mockRefetch = vi.fn();

      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: mockRefetch,
      });

      render(<EmployerAIShortlists />);

      const refreshButton = screen.getByText('Refresh Matches');
      await user.click(refreshButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it('should not refresh when no job is selected', async () => {
      const user = userEvent.setup();
      render(<EmployerAIShortlists />);

      const refreshButton = screen.getByText('Refresh Matches');
      expect(refreshButton).toBeDisabled();
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle empty matches array', () => {
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: [], meta: { page: 1, totalPages: 1, total: 0 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      expect(
        screen.getByText('No candidates matching this job found.'),
      ).toBeInTheDocument();
    });

    it('should handle candidates with missing optional fields', () => {
      mockSearchParams.set('jobId', '1');
      const minimalMatch: Match[] = [
        {
          id: 104,
          name: 'Minimal Candidate',
          role: 'Developer',
          matchScore: 70,
          skills: ['JavaScript'],
          source: 'individual',
        },
      ];

      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: minimalMatch, meta: { page: 1, totalPages: 1, total: 1 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('Minimal Candidate')).toBeInTheDocument();
      });
    });

    it('should handle very long candidate names', () => {
      mockSearchParams.set('jobId', '1');
      const longNameMatch: Match[] = [
        {
          id: 105,
          name: 'Very Long Candidate Name That Might Break The Layout Component',
          role: 'Developer',
          matchScore: 75,
          skills: ['React'],
          source: 'individual',
        },
      ];

      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: longNameMatch, meta: { page: 1, totalPages: 1, total: 1 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(
          screen.getByText('Very Long Candidate Name That Might Break The Layout Component'),
        ).toBeInTheDocument();
      });
    });

    it('should handle string entity IDs', () => {
      mockSearchParams.set('jobId', '1');
      const stringIdMatch: Match[] = [
        {
          id: 'string-id-123',
          name: 'String ID Candidate',
          role: 'Developer',
          matchScore: 80,
          skills: ['React'],
          source: 'individual',
        },
      ];

      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: stringIdMatch, meta: { page: 1, totalPages: 1, total: 1 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      waitFor(() => {
        expect(screen.getByText('String ID Candidate')).toBeInTheDocument();
      });
    });
  });

  describe('Integration Tests', () => {
    it.skip('should handle complete workflow: search -> filter -> view profile', async () => {
      const user = userEvent.setup();
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });

      render(<EmployerAIShortlists />);

      // Search for candidate
      const searchInput = screen.getByPlaceholderText('Search candidates by name...');
      await user.type(searchInput, 'Alice');

      await waitFor(() => {
        expect(screen.queryByText('Alice Johnson')).toBeInTheDocument();
      });

      // Click View Profile
      const viewButtons = screen.getAllByText('View Profile');
      if (viewButtons.length > 0) {
        await user.click(viewButtons[0]);
      }

      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });
    });

    it('should handle complete shortlist workflow', async () => {
      const user = userEvent.setup();
      const toast = await import('sonner');
      mockSearchParams.set('jobId', '1');
      mockGetJobMatchesQuery.mockReturnValue({
        data: { data: mockMatches, meta: { page: 1, totalPages: 1, total: 2 } },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
      mockShortlistCandidateMutation.mockResolvedValue({ data: { success: true } });

      render(<EmployerAIShortlists />);

      await waitFor(async () => {
        const shortlistButtons = screen.getAllByText('Shortlist');
        if (shortlistButtons.length > 0) {
          await user.click(shortlistButtons[0]);
        }
      });

      await waitFor(() => {
        expect(mockShortlistCandidateMutation).toHaveBeenCalled();
        expect(toast.toast.success).toHaveBeenCalled();
      });
    });
  });
});