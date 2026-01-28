
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import JobCard from './jobs/JobCard';
import JobPagination from './jobs/JobPagination';
import { jobListings } from '@/data/jobListings';

const HighlightedJob = () => {
  const { translations } = useLanguage();
  
  // State to track current page of job listings
  const [currentPage, setCurrentPage] = useState(0);
  const jobsPerPage = 3;
  const totalPages = Math.ceil(jobListings.length / jobsPerPage);
  
  // Get current jobs based on pagination
  const currentJobs = jobListings.slice(
    currentPage * jobsPerPage, 
    (currentPage + 1) * jobsPerPage
  );

  // Navigation functions
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-teal-50 via-sky-50 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_30%,rgba(3,179,176,0.15),transparent_50%)]"></div>
      <div className="absolute -top-20 right-0 w-80 h-80 bg-teal-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 -left-20 w-80 h-80 bg-sky-100/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-3">
            <span className="bg-teal-100/50 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full">
              {translations.latestJobs}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
            {translations.featuredJobs}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {translations.discoverBestJobs}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <JobPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          prevPage={prevPage}
          nextPage={nextPage}
        />
        
        <div className="text-center mt-12">
          <Button variant="outline" className="rounded-full px-8 py-6 text-base bg-white hover:bg-teal-50 text-teal-600 hover:text-teal-700 border border-teal-200/50 shadow-sm hover:shadow transition-all">
            {translations.browseAllJobs} <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HighlightedJob;
