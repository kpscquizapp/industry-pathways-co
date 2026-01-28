import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, MapPin, Building2, Clock, Bookmark, Zap, Sparkles, Briefcase, DollarSign, Award, Clock3, Navigation, Code, X, Filter, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  postedTime: string;
  accentColor: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: 'Engineering Team Leader',
    company: 'Flipkart',
    companyLogo: 'https://logo.clearbit.com/flipkart.com',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹35L - ₹50L',
    skills: ['Java', 'Microservices', 'Team Lead'],
    isNew: true,
    isFeatured: true,
    postedTime: '2h ago',
    accentColor: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Senior Frontend Developer',
    company: 'Zomato',
    companyLogo: 'https://logo.clearbit.com/zomato.com',
    location: 'Gurgaon (Hybrid)',
    type: 'Full-time',
    salary: '₹25L - ₹40L',
    skills: ['React Native', 'TypeScript', 'Redux'],
    postedTime: '5h ago',
    accentColor: 'from-red-500 to-red-600'
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'Swiggy',
    companyLogo: 'https://logo.clearbit.com/swiggy.com',
    location: 'Bangalore',
    type: 'On-site',
    salary: '₹28L - ₹45L',
    skills: ['Product Strategy', 'Analytics', 'Agile'],
    isFeatured: true,
    postedTime: '1d ago',
    accentColor: 'from-orange-500 to-orange-600'
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'Razorpay',
    companyLogo: 'https://logo.clearbit.com/razorpay.com',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹30L - ₹55L',
    skills: ['Python', 'Machine Learning', 'SQL'],
    isNew: true,
    postedTime: '3h ago',
    accentColor: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Paytm',
    companyLogo: 'https://logo.clearbit.com/paytm.com',
    location: 'Noida',
    type: 'Full-time',
    salary: '₹20L - ₹35L',
    skills: ['AWS', 'Docker', 'Kubernetes'],
    postedTime: '1d ago',
    accentColor: 'from-cyan-500 to-cyan-600'
  }
];

const topCompanies = [
  { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com' },
  { name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com' },
  { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com' },
  { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com' },
  { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com' },
];

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

// Filter Content Component for both desktop and mobile
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
      {/* Filter Header */}
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
      
      {/* Filter Sections */}
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

      {/* Apply Filters Button */}
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

const HomeJobsSection = () => {
  const [openFilters, setOpenFilters] = useState<string[]>(['category', 'skills']);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    category: [],
    salary: [],
    experience: [],
    type: [],
    location: [],
    skills: [],
  });
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleFilter = (filter: string) => {
    setOpenFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const handleFilterChange = (category: string, filterId: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(filterId)
        ? prev[category].filter(f => f !== filterId)
        : [...prev[category], filterId]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      category: [],
      salary: [],
      experience: [],
      type: [],
      location: [],
      skills: [],
    });
  };

  const toggleSaveJob = (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  const totalSelected = Object.values(selectedFilters).flat().length;

  return (
    <section className="py-6 sm:py-8 bg-background">
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

            {/* Recommended Jobs Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                Recommended Jobs
              </h2>
              <span className="text-xs sm:text-sm text-muted-foreground bg-secondary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full self-start sm:self-auto">
                Showing <span className="font-semibold text-foreground">428</span> jobs
              </span>
            </div>

            {/* Job Cards with mobile-optimized layout */}
            <div className="space-y-3 sm:space-y-4">
              {jobs.map((job, index) => (
                <a
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-500 group hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Top Border */}
                  <div className="h-1 bg-primary group-hover:h-1.5 transition-all duration-300" />
                  
                  <div className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="flex gap-3 sm:gap-5">
                      {/* Company Logo */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/30 group-hover:scale-105 group-hover:border-primary/30 transition-all duration-300">
                        <img 
                          src={job.companyLogo} 
                          alt={job.company}
                          className="w-7 h-7 sm:w-9 sm:h-9 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<span class="text-lg sm:text-xl font-bold text-primary">${job.company[0]}</span>`;
                          }}
                        />
                      </div>

                      {/* Job Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Title and badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-bold text-foreground text-base sm:text-lg group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                {job.title}
                              </h3>
                              {job.isFeatured && (
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold rounded-full flex items-center gap-1 flex-shrink-0">
                                  <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  Featured
                                </span>
                              )}
                            </div>
                            
                            {/* Company */}
                            <div className="flex items-center gap-2 text-sm mb-2 sm:mb-3">
                              <span className="font-medium text-foreground">{job.company}</span>
                              {job.isNew && (
                                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold rounded-full">
                                  NEW
                                </span>
                              )}
                            </div>
                            
                            {/* Location and Type Pills */}
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <span className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
                                <MapPin className="h-3 w-3 text-primary" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
                                <Building2 className="h-3 w-3 text-primary" />
                                {job.type}
                              </span>
                            </div>
                          </div>

                          {/* Salary and Save - Desktop */}
                          <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="text-lg font-bold text-primary">
                              {job.salary}
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
                            {job.salary}
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
                            {job.skills.slice(0, 3).map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-secondary text-foreground text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg border border-border/30"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="px-2.5 py-1 bg-muted text-muted-foreground text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg">
                                +{job.skills.length - 3}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 bg-secondary px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full self-start sm:self-auto">
                            <Clock className="h-3 w-3" />
                            {job.postedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-6 sm:mt-10">
              <Button className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base">
                Load More Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeJobsSection;
