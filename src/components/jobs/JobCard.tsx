
import React from 'react';
import { ChevronRight, Clock, MapPin, Briefcase, Star, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { JobListing } from '@/types/job';

interface JobCardProps {
  job: JobListing;
}

const JobCard = ({ job }: JobCardProps) => {
  const { translations } = useLanguage();
  const [isSaved, setIsSaved] = React.useState(false);

  return (
    <Card 
      key={job.id} 
      className="premium-card bg-card p-0 overflow-hidden border-border/50 group h-full"
    >
      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">{job.company.charAt(0)}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">{job.company}</span>
              {job.featured && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                  <span className="text-xs text-primary font-medium">{translations.featured}</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-lg transition-all ${
              isSaved 
                ? 'bg-primary/10 text-primary' 
                : 'bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
          {job.title.en}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-5 line-clamp-2 flex-grow leading-relaxed">
          {job.description.en}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex items-center bg-secondary px-3 py-1.5 rounded-lg text-xs font-medium text-foreground">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {job.salary}
          </div>
          <div className="flex items-center bg-secondary px-3 py-1.5 rounded-lg text-xs font-medium text-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {job.location}
          </div>
          <div className="flex items-center bg-secondary px-3 py-1.5 rounded-lg text-xs font-medium text-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {job.type.en}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <a 
            href={`/company/${job.company.toLowerCase()}`} 
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            {translations.aboutCompany} {job.company}
          </a>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
          >
            {translations.apply} 
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
