import React from 'react';
import { Zap, Target, Bot, Users } from 'lucide-react';

const metrics = [
  {
    icon: Zap,
    value: '70%',
    label: 'Faster Hiring',
    description: 'Reduce time-to-hire with AI automation',
  },
  {
    icon: Target,
    value: '90%',
    label: 'Skill Match Accuracy',
    description: 'Precise matching using semantic analysis',
  },
  {
    icon: Bot,
    value: '100%',
    label: 'AI-Assessed Candidates',
    description: 'Every candidate verified through AI',
  },
  {
    icon: Users,
    value: '10K+',
    label: 'Contractors',
    description: 'Growing network of verified talent',
  },
];

const TrustMetrics = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Companies Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Real results from real companies using our platform
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="bg-card rounded-2xl border border-border p-8 text-center hover:border-primary/30 hover:shadow-premium-lg transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <metric.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Value */}
                <p className="text-4xl font-bold text-foreground mb-2">
                  {metric.value}
                </p>

                {/* Label */}
                <p className="text-lg font-semibold text-foreground mb-1">
                  {metric.label}
                </p>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Company logos placeholder */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['TechCorp', 'InnovateLab', 'FutureTech', 'CodeBase', 'DataFlow'].map((company) => (
              <div 
                key={company}
                className="px-6 py-3 bg-muted rounded-lg text-muted-foreground font-semibold"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustMetrics;
