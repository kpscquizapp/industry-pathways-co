import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Bookmark, 
  MapPin, 
  Building2, 
  Clock, 
  Trash2, 
  Briefcase,
  Sparkles,
  ArrowRight,
  Search
} from 'lucide-react';

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  savedAt: string;
}

// Mock saved jobs data - in real app, this would come from localStorage or backend
const mockSavedJobs: SavedJob[] = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'Tata Consultancy Services',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹15-25 LPA',
    skills: ['React', 'Node.js', 'AWS'],
    savedAt: '2 hours ago'
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'Infosys',
    location: 'Hyderabad',
    type: 'Full-time',
    salary: '₹18-30 LPA',
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    savedAt: '1 day ago'
  },
  {
    id: 4,
    title: 'Product Manager',
    company: 'Flipkart',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹25-40 LPA',
    skills: ['Product Strategy', 'Agile', 'Data Analytics'],
    savedAt: '3 days ago'
  },
];

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(mockSavedJobs);

  const removeJob = (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        <section className="py-6 sm:py-10">
          <div className="container mx-auto px-3 sm:px-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                  <Bookmark className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Saved Jobs</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/jobs')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 self-start sm:self-auto"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse All Jobs
              </Button>
            </div>

            {/* Jobs List */}
            {savedJobs.length === 0 ? (
              <div className="bg-card border border-border/50 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">No saved jobs yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start exploring and save jobs that interest you. They'll appear here for easy access.
                </p>
                <Button 
                  onClick={() => navigate('/jobs')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-8 py-6 shadow-lg shadow-primary/25"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Explore Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {savedJobs.map((job, index) => (
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
                              {/* Title */}
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-bold text-foreground text-base sm:text-lg group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                  {job.title}
                                </h3>
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold rounded-full flex items-center gap-1 flex-shrink-0">
                                  <Bookmark className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                                  Saved
                                </span>
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
                                  {job.type}
                                </span>
                              </div>
                            </div>

                            {/* Salary and Actions - Desktop */}
                            <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                              <div className="text-lg font-bold text-primary">
                                {job.salary}
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={(e) => removeJob(job.id, e)}
                                  className="p-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                                  title="Remove from saved"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                                <Button 
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJobClick(job.id);
                                  }}
                                >
                                  Apply Now
                                  <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Mobile: Salary and Actions */}
                          <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-border/30">
                            <div className="text-base font-bold text-primary">
                              {job.salary}
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => removeJob(job.id, e)}
                                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <Button 
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJobClick(job.id);
                                }}
                              >
                                Apply
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
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
                            </div>
                            <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 bg-secondary px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full self-start sm:self-auto">
                              <Clock className="h-3 w-3" />
                              Saved {job.savedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Browse More Section */}
            {savedJobs.length > 0 && (
              <div className="mt-10 bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 rounded-2xl p-6 sm:p-8 text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Looking for more opportunities?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Explore thousands of jobs from top companies across India
                </p>
                <Button 
                  onClick={() => navigate('/jobs')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  Explore All Jobs
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedJobs;
