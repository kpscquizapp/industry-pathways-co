import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Building2, CheckCircle } from 'lucide-react';

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

            {/* CTA Buttons - All similar style */}
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/employer-signup1">
                  Hire Talent
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/candidate-signup">
                  <Users className="mr-2 h-5 w-5" />
                  Join as Contractor
                </Link>
              </Button>
              
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/bench-registration">
                  <Building2 className="mr-2 h-5 w-5" />
                  List Bench Resources
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Animated AI Matching Flow */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main Card - AI Matching Visualization */}
              <div className="bg-navy-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Window controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-primary text-sm font-medium">Skill Verified</span>
                  </div>
                </div>
                
                {/* Job Posting Card */}
                <div className="flex items-center gap-4 p-4 bg-navy-700/50 rounded-xl border border-white/10 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-400/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Senior React Developer</p>
                    <p className="text-white/50 text-sm">Posted 2 mins ago</p>
                  </div>
                  <div className="px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-lg">
                    <span className="text-primary text-sm font-medium">New</span>
                  </div>
                </div>

                {/* AI Matching Indicator */}
                <div className="flex items-center justify-center gap-3 py-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-primary" />
                  <div className="flex items-center gap-2 text-white/60">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium">AI Matching</span>
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent via-primary/50 to-primary" />
                </div>

                {/* Matched Candidates with Progress Bars */}
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Chen', match: 94, delay: '0.3s', color: 'from-primary to-green-400' },
                    { name: 'Alex Kumar', match: 89, delay: '0.5s', color: 'from-primary to-green-400' },
                    { name: 'Maria Silva', match: 87, delay: '0.7s', color: 'from-primary to-green-400' },
                  ].map((candidate, i) => (
                    <div 
                      key={candidate.name}
                      className="flex items-center gap-4 p-3 bg-navy-700/50 rounded-xl border border-white/10 transition-all hover:border-primary/30 animate-fade-in"
                      style={{ animationDelay: candidate.delay }}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-green-400/20 border border-primary/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{candidate.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-navy-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${candidate.color} rounded-full transition-all duration-1000`}
                            style={{ 
                              width: `${candidate.match}%`,
                              animation: 'grow-width 1.5s ease-out forwards',
                              animationDelay: candidate.delay
                            }}
                          />
                        </div>
                        <span className="text-primary font-bold text-sm min-w-[40px] text-right">{candidate.match}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating AI Interview Badge */}
              <div 
                className="absolute -left-6 bottom-24 bg-navy-800/90 backdrop-blur-xl border border-primary/30 rounded-xl px-4 py-2.5 shadow-xl animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">AI Interview Ready</span>
                </div>
              </div>

              {/* Floating Skill Test Badge */}
              <div 
                className="absolute -right-4 top-1/2 bg-navy-800/90 backdrop-blur-xl border border-green-400/30 rounded-xl px-4 py-2.5 shadow-xl animate-float"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-400/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Auto Skill Test</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe for progress bar animation */}
      <style>{`
        @keyframes grow-width {
          from { width: 0%; }
          to { width: var(--target-width); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
