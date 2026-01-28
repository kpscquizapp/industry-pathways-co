import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, Search, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'Contract & Gig Talent',
    description: 'Find skilled professionals for short-term projects and specialized tasks'
  },
  {
    title: 'Bench Resources',
    description: 'Access pre-vetted talent from IT services companies available immediately'
  },
  {
    title: 'AI Interview Scheduling',
    description: 'Automate screening with AI interviews and make faster hiring decisions'
  }
];

const TalentMarketplace = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="fade-in-section">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full mb-6">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">TALENT MARKETPLACE</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find the Perfect Talent for Your Project
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg">
              Access contract professionals, freelancers, and bench resources from top companies. Hire faster with AI-powered matching.
            </p>
            
            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate('/find-talent')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 rounded-lg"
              >
                Find Talent
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/employer-login')}
                className="border-border text-foreground px-6 py-5 rounded-lg hover:bg-muted"
              >
                List Your Talent
              </Button>
            </div>
          </div>
          
          {/* Right Content - Image Area */}
          <div className="relative fade-in-section">
            <div className="relative">
              {/* Main image placeholder */}
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 rounded-3xl overflow-hidden relative border border-border/30">
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-24 h-24 bg-yellow-200/40 rounded-full blur-xl"></div>
                <div className="absolute bottom-8 left-8 w-32 h-32 bg-orange-200/40 rounded-full blur-xl"></div>
                
                {/* Abstract pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M20 20h20v20H20V20zm0-20h20v20H20V0zM0 20h20v20H0V20zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                ></div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 left-6 bg-card rounded-xl shadow-lg p-4 flex items-center gap-3 border border-border/50">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">25,000+</div>
                  <div className="text-xs text-muted-foreground">Verified Professionals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="mt-20 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals finding their dream jobs and companies hiring top talent
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/jobs')}
              className="bg-white text-primary hover:bg-white/90 border-white px-6 py-5 rounded-lg font-semibold"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Jobs
            </Button>
            <Button 
              onClick={() => navigate('/employer-dashboard/post-job')}
              className="bg-primary/20 hover:bg-primary/30 text-white border border-white/20 px-6 py-5 rounded-lg font-semibold"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Post a Job
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TalentMarketplace;
