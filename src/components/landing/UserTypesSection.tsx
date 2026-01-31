import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';

const userTypes = {
  contractor: {
    title: 'Individual Contractors',
    icon: User,
    description: 'Get matched to jobs automatically and accelerate your career',
    color: 'from-blue-500 to-cyan-500',
    benefits: [
      { icon: Target, text: 'Get matched to jobs automatically' },
      { icon: Zap, text: 'Take AI skill tests to prove expertise' },
      { icon: TrendingUp, text: 'AI interview feedback to improve' },
      { icon: Clock, text: 'Faster short-term gig placements' },
    ],
    cta: 'Join as Contractor',
    link: '/candidate-signup',
  },
  bench: {
    title: 'Companies with Bench Resources',
    icon: Building2,
    description: 'Monetize your idle talent and maximize resource utilization',
    color: 'from-primary to-green-400',
    benefits: [
      { icon: Users, text: 'Upload multiple resumes at once' },
      { icon: Target, text: 'AI ranks bench talent per job match' },
      { icon: TrendingUp, text: 'Visibility to hiring companies' },
      { icon: DollarSign, text: 'Monetize idle resources' },
    ],
    cta: 'List Bench Resources',
    link: '/bench-registration',
  },
  hiring: {
    title: 'Hiring Companies',
    icon: Briefcase,
    description: 'Find and hire the best contract talent with AI-powered insights',
    color: 'from-purple-500 to-pink-500',
    benefits: [
      { icon: Target, text: 'JD → AI resume shortlist instantly' },
      { icon: Zap, text: 'Automated skill tests for validation' },
      { icon: TrendingUp, text: 'AI interview insights & scoring' },
      { icon: Clock, text: 'Hire fast, pay per contract' },
    ],
    cta: 'Start Hiring',
    link: '/employer-signup',
  },
};

const UserTypesSection = () => {
  const [activeTab, setActiveTab] = useState('contractor');

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Every Role in Contract Hiring
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're a contractor, a company with bench resources, or hiring — we've got you covered.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12 bg-card border border-border rounded-xl p-1 h-auto">
            {Object.entries(userTypes).map(([key, type]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <type.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{key === 'contractor' ? 'Contractors' : key === 'bench' ? 'Bench' : 'Hiring'}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(userTypes).map(([key, type]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Benefits */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{type.title}</h3>
                      <p className="text-muted-foreground">{type.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {type.benefits.map((benefit, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <benefit.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-foreground font-medium">{benefit.text}</span>
                        <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                      </div>
                    ))}
                  </div>

                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-xl px-8">
                    <Link to={type.link}>
                      {type.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* Right: Visual */}
                <div className="relative">
                  <div className="bg-card rounded-2xl border border-border p-8 shadow-premium">
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center animate-float`}>
                        <type.icon className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <p className="text-2xl font-bold text-primary">70%</p>
                        <p className="text-xs text-muted-foreground">Faster</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <p className="text-2xl font-bold text-primary">90%</p>
                        <p className="text-xs text-muted-foreground">Match Rate</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <p className="text-2xl font-bold text-primary">100%</p>
                        <p className="text-xs text-muted-foreground">AI-Assessed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default UserTypesSection;
