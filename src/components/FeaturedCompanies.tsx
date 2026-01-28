import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  positions: number;
  logo: string;
}

const companies: Company[] = [
  { id: 1, name: 'Infosys', positions: 78, logo: 'https://logo.clearbit.com/infosys.com' },
  { id: 2, name: 'TCS', positions: 120, logo: 'https://logo.clearbit.com/tcs.com' },
  { id: 3, name: 'Wipro', positions: 67, logo: 'https://logo.clearbit.com/wipro.com' },
  { id: 4, name: 'Accenture', positions: 93, logo: 'https://logo.clearbit.com/accenture.com' },
  { id: 5, name: 'IBM', positions: 84, logo: 'https://logo.clearbit.com/ibm.com' },
  { id: 6, name: 'Microsoft', positions: 56, logo: 'https://logo.clearbit.com/microsoft.com' },
  { id: 7, name: 'Google', positions: 45, logo: 'https://logo.clearbit.com/google.com' },
  { id: 8, name: 'Amazon', positions: 112, logo: 'https://logo.clearbit.com/amazon.com' },
  { id: 9, name: 'Meta', positions: 38, logo: 'https://logo.clearbit.com/meta.com' },
  { id: 10, name: 'Oracle', positions: 72, logo: 'https://logo.clearbit.com/oracle.com' },
];

const FeaturedCompanies = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Featured Companies
          </h2>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Companies Carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide gap-8 pb-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {companies.map((company) => (
            <a
              key={company.id}
              href={`/jobs?company=${company.name.toLowerCase()}`}
              className="flex-none group"
            >
              <div className="w-44 text-center">
                {/* Logo Container */}
                <div className="h-24 flex items-center justify-center mb-4">
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    className="max-h-16 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-3xl font-bold text-primary">${company.name}</span>`;
                    }}
                  />
                </div>
                
                {/* Company Info */}
                <h3 className="font-semibold text-foreground mb-1">{company.name}</h3>
                <p className="text-sm text-muted-foreground">{company.positions} open positions</p>
                
                {/* Progress Bar */}
                <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-500 group-hover:from-primary group-hover:to-primary"
                    style={{ width: `${Math.min(company.positions, 100)}%` }}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
