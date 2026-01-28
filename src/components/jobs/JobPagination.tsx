
import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  prevPage: () => void;
  nextPage: () => void;
}

const JobPagination = ({ currentPage, totalPages, prevPage, nextPage }: JobPaginationProps) => {
  const { translations } = useLanguage();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12 gap-4">
      <Button 
        onClick={prevPage}
        variant="outline" 
        size="icon"
        className="rounded-full bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
        aria-label={translations.previousPage}
      >
        <ChevronLeft className="h-5 w-5 text-neutral-600" />
      </Button>
      <div className="flex items-center bg-white text-neutral-600 px-6 py-2 rounded-full border border-neutral-200 shadow-sm">
        <span className="font-medium">{currentPage + 1}</span>
        <span className="mx-2 text-neutral-400">/</span>
        <span>{totalPages}</span>
      </div>
      <Button 
        onClick={nextPage}
        variant="outline"
        size="icon"
        className="rounded-full bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
        aria-label={translations.nextPage}
      >
        <ChevronRight className="h-5 w-5 text-neutral-600" />
      </Button>
    </div>
  );
};

export default JobPagination;
