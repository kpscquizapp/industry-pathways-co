
import React from 'react';
import { MapPin, Home, Building, Laptop, ArrowRight } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  jobCount: string;
  color: string;
}

const locations: Location[] = [
  { id: 1, name: 'Bangalore', jobCount: '8,450+', color: 'text-blue-600' },
  { id: 2, name: 'Hyderabad', jobCount: '6,230+', color: 'text-purple-600' },
  { id: 3, name: 'Pune', jobCount: '5,890+', color: 'text-green-600' },
  { id: 4, name: 'Mumbai', jobCount: '7,120+', color: 'text-orange-600' },
  { id: 5, name: 'Delhi NCR', jobCount: '4,560+', color: 'text-red-600' },
];

interface WorkType {
  id: number;
  title: string;
  subtitle: string;
  jobCount: string;
  icon: React.ReactNode;
  gradient: string;
}

const workTypes: WorkType[] = [
  {
    id: 1,
    title: 'Remote Jobs',
    subtitle: 'Work from anywhere',
    jobCount: '15,240',
    icon: <Laptop className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-600'
  },
  {
    id: 2,
    title: 'Hybrid Jobs',
    subtitle: 'Flexible work model',
    jobCount: '8,560',
    icon: <Building className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500'
  },
  {
    id: 3,
    title: 'Work from Home',
    subtitle: '100% remote positions',
    jobCount: '12,890',
    icon: <Home className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-orange-500 to-red-500'
  }
];

const JobLocations = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in-section">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Job Locations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find opportunities in top cities across India
          </p>
        </div>
        
        {/* City Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {locations.map((location) => (
            <a
              key={location.id}
              href={`/jobs?location=${location.name.toLowerCase()}`}
              className="bg-card border border-border/50 rounded-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group fade-in-section"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center`}>
                  <MapPin className={`h-4 w-4 ${location.color}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{location.jobCount}</span>
              </div>
              <h3 className="font-semibold text-foreground">{location.name}</h3>
            </a>
          ))}
        </div>
        
        {/* Work Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workTypes.map((type) => (
            <a
              key={type.id}
              href={`/jobs?workType=${type.title.toLowerCase().replace(/ /g, '-')}`}
              className={`${type.gradient} rounded-xl p-6 text-white hover:shadow-xl transition-all duration-300 group fade-in-section`}
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                {type.icon}
              </div>
              <h3 className="text-xl font-bold mb-1">{type.title}</h3>
              <p className="text-white/80 text-sm mb-4">{type.subtitle}</p>
              <div className="flex items-center text-sm font-medium">
                {type.jobCount} jobs available <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobLocations;
