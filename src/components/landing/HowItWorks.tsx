import React from 'react';
import { FileText, Brain, Rocket } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Post Job / Join Marketplace',
    description: 'Upload your job description or register as a contractor. Our platform accepts all formats.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    number: '02',
    title: 'AI Match + Skill Validation',
    description: 'Our AI analyzes resumes against job requirements, validates skills through automated tests.',
    color: 'from-primary to-green-400',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Interview & Deploy',
    description: 'AI-powered interviews provide insights. Hire with confidence and deploy within days.',
    color: 'from-purple-500 to-pink-500',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From job posting to deployment in three simple steps. Our AI handles the heavy lifting.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-border via-primary/30 to-border -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="relative group"
              >
                <div className="bg-card rounded-2xl p-8 border border-border shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2">
                  {/* Step number */}
                  <div className="absolute -top-4 left-8 px-4 py-1 bg-background border border-border rounded-full">
                    <span className="text-sm font-bold text-muted-foreground">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Animated arrow for non-last items */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg group-hover:border-primary transition-colors">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
