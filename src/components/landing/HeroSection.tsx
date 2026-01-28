import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Building2 } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-400/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Hiring Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Hire Contract Talent in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                Days, Not Weeks
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-lg">
              AI-matched resumes, skill tests, and automated interviews — all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/employer/dashboard">
                  Hire Talent
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                <Link to="/contractor/dashboard">
                  <Users className="mr-2 h-5 w-5" />
                  Join as Contractor
                </Link>
              </Button>
              
              <Button asChild variant="ghost" size="lg" className="text-white/80 hover:text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                <Link to="/bench/dashboard">
                  <Building2 className="mr-2 h-5 w-5" />
                  List Bench Resources
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Product Mockup Animation */}
          <div className="relative animate-fade-in-right hidden lg:block">
            <div className="relative">
              {/* Main Card - AI Matching */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                
                {/* Job Flow Animation */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Senior React Developer</p>
                      <p className="text-white/50 text-sm">Posted 2 mins ago</p>
                    </div>
                    <div className="px-3 py-1 bg-primary/20 rounded-full">
                      <span className="text-primary text-sm font-medium">New</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-white/40">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-primary/50" />
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-xs">AI Matching</span>
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-primary/50" />
                  </div>

                  {/* Matched Candidates */}
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Chen', match: 94, avatar: '👩‍💻' },
                      { name: 'Alex Kumar', match: 89, avatar: '👨‍💼' },
                      { name: 'Maria Silva', match: 87, avatar: '👩‍🔬' },
                    ].map((candidate, i) => (
                      <div 
                        key={candidate.name}
                        className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10 animate-fade-in"
                        style={{ animationDelay: `${(i + 1) * 0.2}s` }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-green-400/30 flex items-center justify-center text-xl">
                          {candidate.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{candidate.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full"
                              style={{ width: `${candidate.match}%` }}
                            />
                          </div>
                          <span className="text-primary font-bold text-sm">{candidate.match}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -right-4 top-8 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2 animate-float">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white text-sm">Skill Verified</span>
                </div>
              </div>

              <div className="absolute -left-4 bottom-20 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-primary">🎯</span>
                  <span className="text-white text-sm">AI Interview Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
