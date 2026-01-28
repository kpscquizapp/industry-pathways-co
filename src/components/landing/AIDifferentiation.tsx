import React from 'react';
import { 
  Brain, 
  FileSearch, 
  Target, 
  Code, 
  Video, 
  Shield,
  Sparkles,
  Zap
} from 'lucide-react';

const capabilities = [
  {
    icon: FileSearch,
    title: 'Resume ↔ JD Semantic Matching',
    description: 'Deep understanding of skills, experience, and context — not just keyword matching.',
  },
  {
    icon: Target,
    title: 'Skill Gap Analysis',
    description: 'Instantly identify which candidates have the required skills and where gaps exist.',
  },
  {
    icon: Code,
    title: 'Automated Coding & Domain Tests',
    description: 'AI-generated skill assessments tailored to each job requirement.',
  },
  {
    icon: Video,
    title: 'AI Interview Scoring',
    description: 'Analyze communication, technical depth, and confidence in automated interviews.',
  },
  {
    icon: Shield,
    title: 'Bias-Reduced Ranking',
    description: 'Fair, objective candidate ranking based purely on skills and qualifications.',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Get AI-matched shortlists within minutes, not days or weeks.',
  },
];

const AIDifferentiation = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by AI</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI That Actually Understands Hiring
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Our proprietary AI goes beyond basic matching to deliver genuinely qualified candidates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 hover:border-primary/30 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-green-400/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <capability.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {capability.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {capability.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Central AI visualization */}
        <div className="mt-16 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-green-400 flex items-center justify-center animate-pulse">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s' }}>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-2.5 h-2.5 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDifferentiation;
