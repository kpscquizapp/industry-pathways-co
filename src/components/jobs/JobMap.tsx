import React from 'react';
import { MapPin } from 'lucide-react';
import { JobListing } from '@/types/job';

interface JobMapProps {
  jobs: JobListing[];
}

// Mock coordinates for Indian cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Noida': { lat: 28.5355, lng: 77.3910 },
  'Gurgaon': { lat: 28.4595, lng: 77.0266 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Delhi': { lat: 28.7041, lng: 77.1025 }
};

const JobMap = ({ jobs }: JobMapProps) => {
  // Group jobs by location
  const jobsByLocation = jobs.reduce((acc, job) => {
    const location = job.location.split(',')[0].trim();
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(job);
    return acc;
  }, {} as Record<string, JobListing[]>);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-teal-100 via-blue-50 to-green-100 rounded-lg overflow-hidden">
      {/* Map Background with India outline effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(20,184,166,0.3)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(59,130,246,0.3)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,_rgba(34,197,94,0.3)_0%,_transparent_50%)]"></div>
      </div>

      {/* Grid overlay for map-like appearance */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Location Pins */}
      <div className="absolute inset-0 p-8">
        {Object.entries(jobsByLocation).map(([location, locationJobs], index) => {
          const coords = cityCoordinates[location] || { lat: 20 + Math.random() * 10, lng: 75 + Math.random() * 10 };
          
          // Convert lat/lng to approximate pixel positions (simplified)
          const top = `${30 + (index * 15) % 60}%`;
          const left = `${20 + (index * 20) % 60}%`;
          
          return (
            <div
              key={location}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in duration-700"
              style={{ top, left, animationDelay: `${index * 100}ms` }}
            >
              {/* Pin with job count */}
              <div className="relative group cursor-pointer">
                <div className="relative">
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-teal-500 rounded-full opacity-20 animate-ping"></div>
                  
                  {/* Pin marker */}
                  <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full shadow-lg flex items-center justify-center border-4 border-white transform transition-transform hover:scale-110">
                    <span className="text-white font-bold text-sm">
                      {locationJobs.length}
                    </span>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-white rounded-lg shadow-xl p-3 whitespace-nowrap border border-neutral-200">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      <span className="font-semibold text-sm">{location}</span>
                    </div>
                    <div className="text-xs text-neutral-600">
                      {locationJobs.length} job{locationJobs.length !== 1 ? 's' : ''} available
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-neutral-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
        Interactive Job Map
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs">
        <div className="font-semibold mb-2 text-neutral-700">Legend</div>
        <div className="flex items-center gap-2 text-neutral-600">
          <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
            N
          </div>
          <span>Jobs in location</span>
        </div>
      </div>
    </div>
  );
};

export default JobMap;
