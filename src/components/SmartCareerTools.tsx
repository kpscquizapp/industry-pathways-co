
import React from 'react';
import { Sparkles, Users, TrendingUp, ClipboardCheck, FileText, DollarSign, ArrowRight } from 'lucide-react';

interface Tool {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  link: string;
  linkText: string;
}

const tools: Tool[] = [
  {
    id: 1,
    title: 'AI Talent Matching',
    description: 'Get matched with jobs that perfectly align with your skills, experience, and career goals using advanced AI algorithms.',
    icon: <Sparkles className="h-6 w-6" />,
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    link: '/job-recommendations',
    linkText: 'Try Now'
  },
  {
    id: 2,
    title: 'AI Interview Prep',
    description: 'Practice with AI-powered mock interviews, get instant feedback, and improve your performance before the real interview.',
    icon: <Users className="h-6 w-6" />,
    iconBg: 'bg-pink-500',
    iconColor: 'text-white',
    link: '/skills-assessment',
    linkText: 'Start Practice'
  },
  {
    id: 3,
    title: 'Career Path Visualization',
    description: 'Discover potential career trajectories based on your current role, skills, and industry trends with AI insights.',
    icon: <TrendingUp className="h-6 w-6" />,
    iconBg: 'bg-green-500',
    iconColor: 'text-white',
    link: '/career-path',
    linkText: 'Explore Paths'
  },
  {
    id: 4,
    title: 'Skills Assessment',
    description: 'Take AI-powered skill tests to validate your expertise and showcase verified skills to potential employers.',
    icon: <ClipboardCheck className="h-6 w-6" />,
    iconBg: 'bg-orange-500',
    iconColor: 'text-white',
    link: '/skills-assessment',
    linkText: 'Take Test'
  },
  {
    id: 5,
    title: 'Resume Builder',
    description: 'Create ATS-optimized resumes with AI suggestions for content, formatting, and keywords to increase your chances.',
    icon: <FileText className="h-6 w-6" />,
    iconBg: 'bg-yellow-500',
    iconColor: 'text-white',
    link: '/candidate-profile',
    linkText: 'Build Resume'
  },
  {
    id: 6,
    title: 'Salary Insights',
    description: 'Access real-time salary data and compensation trends for your role, location, and experience level.',
    icon: <DollarSign className="h-6 w-6" />,
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    link: '/jobs',
    linkText: 'View Insights'
  }
];

const SmartCareerTools = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-violet-50/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in-section">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-card border border-primary/20 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-POWERED PLATFORM</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Career Tools
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leverage AI technology to accelerate your career growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group fade-in-section"
            >
              <div className={`w-12 h-12 ${tool.iconBg} ${tool.iconColor} flex items-center justify-center rounded-xl mb-5`}>
                {tool.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{tool.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{tool.description}</p>
              <a 
                href={tool.link}
                className="text-primary text-sm font-medium inline-flex items-center group-hover:gap-2 transition-all"
              >
                {tool.linkText} <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartCareerTools;
