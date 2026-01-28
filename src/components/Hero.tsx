import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, SlidersHorizontal, TrendingUp, Clock, Sparkles, Briefcase, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jobListings } from '@/data/jobListings';

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const quickFilters = [
    { id: 'remote', label: 'Remote Only' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'product', label: 'Product' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' },
  ];

  const locationSuggestions = [
    'Bangalore',
    'Mumbai',
    'Delhi NCR',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Remote',
  ];

  // Get unique job titles and companies from job listings
  const allJobTitles = useMemo(() => 
    [...new Set(jobListings.map(job => job.title.en))], 
    []
  );

  const allCompanies = useMemo(() => 
    [...new Set(jobListings.map(job => job.company))], 
    []
  );

  const allSkills = useMemo(() => 
    [...new Set(jobListings.flatMap(job => job.skills || []))], 
    []
  );

  // Filter suggestions based on search query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        titles: allJobTitles.slice(0, 4),
        companies: allCompanies.slice(0, 3),
        skills: allSkills.slice(0, 4)
      };
    }

    const query = searchQuery.toLowerCase();
    return {
      titles: allJobTitles.filter(t => t.toLowerCase().includes(query)).slice(0, 4),
      companies: allCompanies.filter(c => c.toLowerCase().includes(query)).slice(0, 3),
      skills: allSkills.filter(s => s.toLowerCase().includes(query)).slice(0, 4)
    };
  }, [searchQuery, allJobTitles, allCompanies, allSkills]);

  const hasResults = filteredSuggestions.titles.length > 0 || 
                     filteredSuggestions.companies.length > 0 || 
                     filteredSuggestions.skills.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (location) params.append('location', location);
    if (activeFilter) params.append('filter', activeFilter);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleLocationClick = (loc: string) => {
    setLocation(loc.toLowerCase());
    setShowLocationSuggestions(false);
  };

  return (
    <section className="pt-32 pb-16 bg-navy-900 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900 to-navy-800 opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Content - Centered */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-white/80 font-medium">10,000+ opportunities waiting</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Find your dream job
          </h1>
          
          <p className="text-lg text-white/60 mb-12 max-w-xl mx-auto leading-relaxed">
            Discover opportunities matching your skills and aspirations from top companies globally.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-10">
            <div ref={searchRef} className="relative bg-white rounded-2xl p-2 shadow-2xl shadow-black/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl mx-auto">
              {/* Job Search Input */}
              <div className="flex-1 relative">
                <div className="flex items-center gap-3 pl-4">
                  <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full h-12 text-foreground bg-transparent border-none focus:outline-none placeholder:text-muted-foreground text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      setShowSuggestions(true);
                      setShowLocationSuggestions(false);
                    }}
                  />
                </div>
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden animate-scale-in max-h-[400px] overflow-y-auto">
                    {hasResults ? (
                      <>
                        {/* Job Titles */}
                        {filteredSuggestions.titles.length > 0 && (
                          <div className="p-4 border-b border-border">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Briefcase className="h-3.5 w-3.5" />
                              Job Titles
                            </p>
                            <div className="space-y-1">
                              {filteredSuggestions.titles.map((title, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSuggestionClick(title)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-all text-left group"
                                >
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Briefcase className="h-4 w-4 text-primary" />
                                  </div>
                                  <span className="text-sm text-foreground font-medium">{title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Companies */}
                        {filteredSuggestions.companies.length > 0 && (
                          <div className="p-4 border-b border-border">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Building2 className="h-3.5 w-3.5" />
                              Companies
                            </p>
                            <div className="space-y-1">
                              {filteredSuggestions.companies.map((company, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSuggestionClick(company)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-left group"
                                >
                                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center font-bold text-primary">
                                    {company[0]}
                                  </div>
                                  <span className="text-sm text-foreground">{company}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {filteredSuggestions.skills.length > 0 && (
                          <div className="p-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                              <TrendingUp className="h-3.5 w-3.5" />
                              Popular Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {filteredSuggestions.skills.map((skill, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSuggestionClick(skill)}
                                  className="px-3 py-1.5 bg-secondary hover:bg-primary/10 hover:text-primary text-foreground text-sm font-medium rounded-lg transition-colors"
                                >
                                  {skill}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-6 text-center">
                        <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No results for "{searchQuery}"</p>
                        <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Divider - hidden on mobile */}
              <div className="hidden sm:block w-px h-8 bg-border"></div>
              
              {/* Location Input */}
              <div className="flex-1 relative">
                <div className="flex items-center gap-3 pl-4">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    className="w-full h-12 capitalize text-foreground bg-transparent border-none focus:outline-none placeholder:text-muted-foreground text-sm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => {
                      setShowLocationSuggestions(true);
                      setShowSuggestions(false);
                    }}
                  />
                </div>
                
                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden animate-scale-in">
                    <div className="p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        Popular Locations
                      </p>
                      <div className="space-y-1">
                        {locationSuggestions
                          .filter(loc => !location || loc.toLowerCase().includes(location.toLowerCase()))
                          .map((loc, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleLocationClick(loc)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-left group"
                          >
                            <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm text-foreground">{loc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Search Button */}
              <Button 
                type="submit" 
                size="icon"
                className="h-12 w-full sm:w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/jobs')}
              className="rounded-xl bg-white text-foreground border-white hover:bg-white/90 font-medium shadow-lg transition-all hover:-translate-y-0.5"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              All Filters
            </Button>
            
            {quickFilters.map((filter) => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  // Navigate to jobs page with filter
                  const params = new URLSearchParams();
                  params.append('filter', filter.id);
                  navigate(`/jobs?${params.toString()}`);
                }}
                className={`rounded-xl font-medium transition-all hover:-translate-y-0.5 ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                    : 'bg-transparent text-white/80 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
