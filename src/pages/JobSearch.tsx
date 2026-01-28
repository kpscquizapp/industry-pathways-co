import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { jobListings } from '@/data/jobListings';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  MapPin, 
  Clock, 
  Bookmark,
  Filter,
  Building2,
  Briefcase,
  Zap,
  Sparkles,
  DollarSign,
  Award,
  Clock3,
  Navigation,
  Code,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filterData = {
  category: [
    { id: 'it', label: 'IT & Software', count: 12450 },
    { id: 'finance', label: 'Banking & Finance', count: 5890 },
    { id: 'marketing', label: 'Sales & Marketing', count: 9340 },
    { id: 'healthcare', label: 'Healthcare', count: 4120 },
    { id: 'design', label: 'Design & Creative', count: 3670 },
  ],
  salary: [
    { id: '0-5', label: '₹0 - ₹5 LPA', count: 8520 },
    { id: '5-10', label: '₹5 - ₹10 LPA', count: 15230 },
    { id: '10-20', label: '₹10 - ₹20 LPA', count: 12450 },
    { id: '20-35', label: '₹20 - ₹35 LPA', count: 6780 },
    { id: '35+', label: '₹35 LPA+', count: 2340 },
  ],
  experience: [
    { id: 'fresher', label: 'Fresher', count: 5420 },
    { id: '1-3', label: '1-3 Years', count: 18650 },
    { id: '3-5', label: '3-5 Years', count: 14320 },
    { id: '5-10', label: '5-10 Years', count: 8970 },
    { id: '10+', label: '10+ Years', count: 3450 },
  ],
  type: [
    { id: 'full-time', label: 'Full-time', count: 35420 },
    { id: 'part-time', label: 'Part-time', count: 4560 },
    { id: 'contract', label: 'Contract', count: 7890 },
    { id: 'internship', label: 'Internship', count: 3210 },
    { id: 'freelance', label: 'Freelance', count: 2340 },
  ],
  location: [
    { id: 'bangalore', label: 'Bangalore', count: 18540 },
    { id: 'mumbai', label: 'Mumbai', count: 12350 },
    { id: 'delhi', label: 'Delhi NCR', count: 9870 },
    { id: 'hyderabad', label: 'Hyderabad', count: 8650 },
    { id: 'remote', label: 'Remote', count: 6780 },
  ],
  skills: [
    { id: 'javascript', label: 'JavaScript', count: 15420 },
    { id: 'python', label: 'Python', count: 12350 },
    { id: 'react', label: 'React', count: 9870 },
    { id: 'java', label: 'Java', count: 11650 },
    { id: 'nodejs', label: 'Node.js', count: 8780 },
    { id: 'aws', label: 'AWS', count: 7650 },
    { id: 'sql', label: 'SQL', count: 14320 },
    { id: 'typescript', label: 'TypeScript', count: 6540 },
  ],
};

interface FilterConfig {
  key: keyof typeof filterData;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const filterConfigs: FilterConfig[] = [
  { 
    key: 'category', 
    title: 'Job Category', 
    icon: <Briefcase className="h-4 w-4" />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  { 
    key: 'skills', 
    title: 'Skills', 
    icon: <Code className="h-4 w-4" />,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  { 
    key: 'salary', 
    title: 'Salary Range', 
    icon: <DollarSign className="h-4 w-4" />,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  { 
    key: 'experience', 
    title: 'Experience Level', 
    icon: <Award className="h-4 w-4" />,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  { 
    key: 'type', 
    title: 'Job Type', 
    icon: <Clock3 className="h-4 w-4" />,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600'
  },
  { 
    key: 'location', 
    title: 'Location', 
    icon: <Navigation className="h-4 w-4" />,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
];

interface FilterSectionProps {
  config: FilterConfig;
  isOpen: boolean;
  onToggle: () => void;
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  config,
  isOpen, 
  onToggle, 
  selectedFilters, 
  onFilterChange 
}) => {
  const selectedCount = selectedFilters.length;
  
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
          isOpen 
            ? 'bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20' 
            : 'hover:bg-muted/50 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${config.iconBg} ${config.iconColor} flex items-center justify-center rounded-lg`}>
            {config.icon}
          </div>
          <span className={`font-medium ${isOpen ? 'text-primary' : 'text-foreground'}`}>
            {config.title}
          </span>
          {selectedCount > 0 && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
        }`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 ml-3 pl-8 border-l-2 border-primary/20 space-y-2 pb-2 animate-fade-in">
          {filterData[config.key].map((option) => (
            <label 
              key={option.id}
              className="flex items-center justify-between cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  id={option.id}
                  checked={selectedFilters.includes(option.id)}
                  onCheckedChange={() => onFilterChange(option.id)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
                />
                <span className={`text-sm transition-colors ${
                  selectedFilters.includes(option.id) 
                    ? 'text-primary font-medium' 
                    : 'text-foreground group-hover:text-primary'
                }`}>
                  {option.label}
                </span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted/70 px-2 py-1 rounded-full font-medium">
                {option.count.toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterContent: React.FC<{
  openFilters: string[];
  toggleFilter: (filter: string) => void;
  selectedFilters: Record<string, string[]>;
  handleFilterChange: (category: string, filterId: string) => void;
  clearAllFilters: () => void;
  totalSelected: number;
  onApply?: () => void;
}> = ({ openFilters, toggleFilter, selectedFilters, handleFilterChange, clearAllFilters, totalSelected, onApply }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">Filters</h3>
            {totalSelected > 0 && (
              <p className="text-xs text-muted-foreground">{totalSelected} filters applied</p>
            )}
          </div>
        </div>
        {totalSelected > 0 && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 font-semibold bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="space-y-1">
        {filterConfigs.map((config) => (
          <FilterSection 
            key={config.key}
            config={config}
            isOpen={openFilters.includes(config.key)} 
            onToggle={() => toggleFilter(config.key)}
            selectedFilters={selectedFilters[config.key]}
            onFilterChange={(id) => handleFilterChange(config.key, id)}
          />
        ))}
      </div>

      {totalSelected > 0 && (
        <div className="mt-5 pt-4 border-t border-border/50">
          <Button 
            onClick={onApply}
            className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-semibold py-5 rounded-xl shadow-lg shadow-primary/25"
          >
            Apply Filters ({totalSelected})
          </Button>
        </div>
      )}
    </>
  );
};

const topCompanies = [
  { name: 'Infosys', logo: 'https://companieslogo.com/img/orig/INFY-1f0d6412.png?t=1720244492' },
  { name: 'Wipro', logo: 'https://companieslogo.com/img/orig/WIT-a3015b82.png?t=1720244495' },
  { name: 'HCL', logo: 'https://companieslogo.com/img/orig/HCLTECH.NS-29c68f6e.png?t=1720244493' },
  { name: 'TCS', logo: 'https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1720244494' },
  { name: 'Cognizant', logo: 'https://companieslogo.com/img/orig/CTSH-82a8444b.png?t=1720244491' },
  { name: 'Mindtree', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mindtree_logo.svg/320px-Mindtree_logo.svg.png' },
];

const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query') || '';
  const quickFilter = searchParams.get('filter') || '';
  
  // Parse URL filter parameters
  const getFiltersFromURL = () => {
    const filters: Record<string, string[]> = {
      category: [],
      salary: [],
      experience: [],
      type: [],
      location: [],
      skills: [],
    };
    
    Object.keys(filters).forEach(key => {
      const value = searchParams.get(key);
      if (value) {
        filters[key] = value.split(',');
      }
    });
    
    return filters;
  };

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState<string[]>(['category', 'skills']);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(getFiltersFromURL());

  // Update URL when filters change
  const updateURLParams = (newFilters: Record<string, string[]>, newSort?: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Update filter params
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key].length > 0) {
        params.set(key, newFilters[key].join(','));
      } else {
        params.delete(key);
      }
    });
    
    // Update sort param
    if (newSort && newSort !== 'default') {
      params.set('sort', newSort);
    } else if (newSort === 'default') {
      params.delete('sort');
    }
    
    setSearchParams(params);
  };

  const toggleFilter = (filter: string) => {
    setOpenFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const handleFilterChange = (category: string, filterId: string) => {
    const newFilters = {
      ...selectedFilters,
      [category]: selectedFilters[category].includes(filterId)
        ? selectedFilters[category].filter(f => f !== filterId)
        : [...selectedFilters[category], filterId]
    };
    setSelectedFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateURLParams(selectedFilters, newSort);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      category: [],
      salary: [],
      experience: [],
      type: [],
      location: [],
      skills: [],
    };
    setSelectedFilters(emptyFilters);
    // Clear all URL params
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    setSearchParams(params);
  };

  const totalSelected = Object.values(selectedFilters).flat().length + (quickFilter ? 1 : 0);

  const filteredJobs = useMemo(() => {
    let jobs = jobListings.filter(job => {
      // Text search
      const matchesQuery = query === '' || 
        job.title.en.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(query.toLowerCase()));
      
      // Quick filter matching
      let matchesQuickFilter = true;
      if (quickFilter) {
        switch (quickFilter) {
          case 'remote':
            matchesQuickFilter = job.type.en.toLowerCase().includes('remote') || 
                                 job.location.toLowerCase().includes('remote');
            break;
          case 'engineering':
            matchesQuickFilter = job.title.en.toLowerCase().includes('engineer') ||
                                 job.title.en.toLowerCase().includes('developer') ||
                                 job.industry?.toLowerCase().includes('software') ||
                                 job.skills?.some(s => ['React', 'Node.js', 'Java', 'Python', 'AWS', 'Docker', 'Kubernetes'].includes(s));
            break;
          case 'product':
            matchesQuickFilter = job.title.en.toLowerCase().includes('product') ||
                                 job.skills?.some(s => s.toLowerCase().includes('product'));
            break;
          case 'design':
            matchesQuickFilter = job.title.en.toLowerCase().includes('design') ||
                                 job.title.en.toLowerCase().includes('ui') ||
                                 job.title.en.toLowerCase().includes('ux') ||
                                 job.skills?.some(s => ['Figma', 'UI Design', 'UX', 'Prototyping'].includes(s));
            break;
          case 'marketing':
            matchesQuickFilter = job.title.en.toLowerCase().includes('marketing') ||
                                 job.industry?.toLowerCase().includes('marketing') ||
                                 job.skills?.some(s => s.toLowerCase().includes('marketing'));
            break;
        }
      }

      // URL-based filter matching
      let matchesCategoryFilter = selectedFilters.category.length === 0;
      if (!matchesCategoryFilter) {
        const categoryMap: Record<string, string[]> = {
          'it': ['IT & Software', 'Blockchain'],
          'finance': ['Banking & Finance', 'FinTech'],
          'marketing': ['Marketing'],
          'healthcare': ['Healthcare'],
          'design': ['Design', 'EdTech', 'Gaming & Sports'],
        };
        matchesCategoryFilter = selectedFilters.category.some(cat => 
          categoryMap[cat]?.some(ind => job.industry?.toLowerCase().includes(ind.toLowerCase()))
        );
      }

      let matchesTypeFilter = selectedFilters.type.length === 0;
      if (!matchesTypeFilter) {
        matchesTypeFilter = selectedFilters.type.some(type => 
          job.contractType === type || job.type.en.toLowerCase().includes(type)
        );
      }

      let matchesLocationFilter = selectedFilters.location.length === 0;
      if (!matchesLocationFilter) {
        matchesLocationFilter = selectedFilters.location.some(loc => 
          job.location.toLowerCase().includes(loc.toLowerCase())
        );
      }

      let matchesExperienceFilter = selectedFilters.experience.length === 0;
      if (!matchesExperienceFilter) {
        const expMap: Record<string, (exp: string) => boolean> = {
          'fresher': (exp) => exp.includes('0') || exp.toLowerCase().includes('fresher'),
          '1-3': (exp) => exp.includes('1') || exp.includes('2') || exp.includes('3'),
          '3-5': (exp) => exp.includes('3') || exp.includes('4') || exp.includes('5'),
          '5-10': (exp) => exp.includes('5') || exp.includes('6') || exp.includes('7') || exp.includes('8') || exp.includes('9') || exp.includes('10'),
          '10+': (exp) => parseInt(exp.split('-')[0]) >= 10 || exp.includes('10') || exp.includes('12') || exp.includes('15'),
        };
        matchesExperienceFilter = selectedFilters.experience.some(exp => 
          job.experience && expMap[exp]?.(job.experience)
        );
      }

      let matchesSkillsFilter = selectedFilters.skills.length === 0;
      if (!matchesSkillsFilter) {
        const skillMap: Record<string, string[]> = {
          'javascript': ['JavaScript', 'TypeScript', 'React', 'Node.js'],
          'python': ['Python'],
          'react': ['React'],
          'java': ['Java', 'Spring Boot'],
          'nodejs': ['Node.js'],
          'aws': ['AWS'],
          'sql': ['SQL', 'MySQL', 'PostgreSQL'],
          'typescript': ['TypeScript'],
        };
        matchesSkillsFilter = selectedFilters.skills.some(skill =>
          job.skills?.some(s => skillMap[skill]?.some(mapped => s.toLowerCase().includes(mapped.toLowerCase())))
        );
      }
      
      return matchesQuery && matchesQuickFilter && matchesCategoryFilter && matchesTypeFilter && matchesLocationFilter && matchesExperienceFilter && matchesSkillsFilter;
    });

    if (sortBy === 'salary-high') {
      jobs.sort((a, b) => {
        const salaryA = parseInt(a.salary.split('-')[0]) || 0;
        const salaryB = parseInt(b.salary.split('-')[0]) || 0;
        return salaryB - salaryA;
      });
    } else if (sortBy === 'salary-low') {
      jobs.sort((a, b) => {
        const salaryA = parseInt(a.salary.split('-')[0]) || 0;
        const salaryB = parseInt(b.salary.split('-')[0]) || 0;
        return salaryA - salaryB;
      });
    }

    return jobs;
  }, [query, sortBy, quickFilter, selectedFilters]);

  const toggleSaveJob = (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        <section className="py-6 sm:py-8">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Desktop Filters Sidebar */}
              <aside className="w-80 flex-shrink-0 hidden lg:block">
                <div className="bg-card border border-border/50 rounded-2xl p-5 sticky top-24 shadow-lg">
                  <FilterContent 
                    openFilters={openFilters}
                    toggleFilter={toggleFilter}
                    selectedFilters={selectedFilters}
                    handleFilterChange={handleFilterChange}
                    clearAllFilters={clearAllFilters}
                    totalSelected={totalSelected}
                  />
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                  <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all"
                      >
                        <Filter className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary text-sm">Filters</span>
                        {totalSelected > 0 && (
                          <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                            {totalSelected}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full sm:max-w-md p-0 bg-background">
                      <SheetHeader className="p-4 border-b border-border/50">
                        <SheetTitle className="flex items-center gap-3 text-base">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-violet-600 rounded-lg flex items-center justify-center">
                            <Filter className="h-4 w-4 text-white" />
                          </div>
                          <span>Filter Jobs</span>
                        </SheetTitle>
                      </SheetHeader>
                      <div className="p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
                        <FilterContent 
                          openFilters={openFilters}
                          toggleFilter={toggleFilter}
                          selectedFilters={selectedFilters}
                          handleFilterChange={handleFilterChange}
                          clearAllFilters={clearAllFilters}
                          totalSelected={totalSelected}
                          onApply={() => setMobileFilterOpen(false)}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Jobs Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                      </div>
                      {query ? `Results for "${query}"` : quickFilter ? `${quickFilter.charAt(0).toUpperCase() + quickFilter.slice(1)} Jobs` : 'All Jobs'}
                    </h2>
                    {quickFilter && (
                      <div className="flex items-center gap-2 mt-2 ml-12">
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium flex items-center gap-1">
                          Filter: {quickFilter.charAt(0).toUpperCase() + quickFilter.slice(1)}
                          <button 
                            onClick={() => navigate('/jobs')}
                            className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <span className="sr-only">Remove filter</span>
                            ×
                          </button>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm text-muted-foreground bg-secondary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                      <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs
                    </span>
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[140px] sm:w-[160px] bg-card border-border/50 text-sm">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="default">Relevance</SelectItem>
                        <SelectItem value="salary-high">Highest Salary</SelectItem>
                        <SelectItem value="salary-low">Lowest Salary</SelectItem>
                        <SelectItem value="recent">Most Recent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Job Cards */}
                <div className="space-y-3 sm:space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="bg-card border border-border/50 rounded-2xl p-12 text-center">
                      <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">No jobs found</h3>
                      <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
                      <Button 
                        onClick={clearAllFilters}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <div
                        key={job.id}
                        onClick={() => handleJobClick(job.id)}
                        className="block bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-500 group hover:-translate-y-1 cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Top Border */}
                        <div className="h-1 bg-primary group-hover:h-1.5 transition-all duration-300" />
                        
                        <div className="p-4 sm:p-6">
                          <div className="flex gap-3 sm:gap-5">
                            {/* Company Logo */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/30 group-hover:scale-105 group-hover:border-primary/30 transition-all duration-300">
                              <span className="text-lg sm:text-xl font-bold text-primary">{job.company[0]}</span>
                            </div>

                            {/* Job Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  {/* Title and badges */}
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-bold text-foreground text-base sm:text-lg group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                      {job.title.en}
                                    </h3>
                                    {job.featured && (
                                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold rounded-full flex items-center gap-1 flex-shrink-0">
                                        <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Company */}
                                  <div className="flex items-center gap-2 text-sm mb-2 sm:mb-3">
                                    <span className="font-medium text-foreground">{job.company}</span>
                                  </div>
                                  
                                  {/* Location and Type Pills */}
                                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
                                      <MapPin className="h-3 w-3 text-primary" />
                                      {job.location}
                                    </span>
                                    <span className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
                                      <Building2 className="h-3 w-3 text-primary" />
                                      {job.type.en}
                                    </span>
                                  </div>
                                </div>

                                {/* Salary and Save - Desktop */}
                                <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                                  <div className="text-lg font-bold text-primary">
                                    ₹{job.salary}
                                  </div>
                                  <button 
                                    onClick={(e) => toggleSaveJob(job.id, e)}
                                    className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                                      savedJobs.includes(job.id)
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-secondary text-muted-foreground hover:text-primary'
                                    }`}
                                  >
                                    <Bookmark className={`h-5 w-5 transition-all duration-300 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                                  </button>
                                </div>
                              </div>

                              {/* Mobile: Salary row */}
                              <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-border/30">
                                <div className="text-base font-bold text-primary">
                                  ₹{job.salary}
                                </div>
                                <button 
                                  onClick={(e) => toggleSaveJob(job.id, e)}
                                  className={`p-2 rounded-lg transition-all duration-300 ${
                                    savedJobs.includes(job.id)
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-secondary text-muted-foreground'
                                  }`}
                                >
                                  <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                                </button>
                              </div>

                              {/* Skills & Time */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-border/30 group-hover:border-primary/20 transition-colors">
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                  {job.skills?.slice(0, 3).map((skill, skillIndex) => (
                                    <span 
                                      key={skillIndex}
                                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-secondary text-foreground text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg border border-border/30"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {job.skills && job.skills.length > 3 && (
                                    <span className="px-2.5 py-1 bg-muted text-muted-foreground text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg">
                                      +{job.skills.length - 3}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 bg-secondary px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full self-start sm:self-auto">
                                  <Clock className="h-3 w-3" />
                                  2d ago
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Load More */}
                {filteredJobs.length > 0 && (
                  <div className="text-center mt-6 sm:mt-10">
                    <Button className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base">
                      Load More Jobs
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobSearch;
