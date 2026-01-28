import React from 'react';
import { Code, Headphones, Building2, TrendingUp, Heart, Palette, Database, Users, ArrowRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  jobCount: string;
  image: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'IT & Software',
    subtitle: 'Development, Testing, DevOps',
    icon: <Code className="h-5 w-5" />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    jobCount: '12,450',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'BPO / KPO',
    subtitle: 'Customer Service, Support',
    icon: <Headphones className="h-5 w-5" />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    jobCount: '8,230',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Banking & Finance',
    subtitle: 'Accounting, Investment',
    icon: <Building2 className="h-5 w-5" />,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    jobCount: '5,890',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'Sales & Marketing',
    subtitle: 'Digital Marketing, Brand Dev',
    icon: <TrendingUp className="h-5 w-5" />,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    jobCount: '9,340',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: 'Healthcare',
    subtitle: 'Medical, Pharma, Nursing',
    icon: <Heart className="h-5 w-5" />,
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    jobCount: '4,120',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    name: 'Design & Creative',
    subtitle: 'UI/UX, Graphic Design',
    icon: <Palette className="h-5 w-5" />,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    jobCount: '3,670',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
  },
  {
    id: 7,
    name: 'Data & Analytics',
    subtitle: 'Data Science, ML, AI',
    icon: <Database className="h-5 w-5" />,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    jobCount: '6,780',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
  },
  {
    id: 8,
    name: 'HR & Recruitment',
    subtitle: 'Talent Acquisition, Training',
    icon: <Users className="h-5 w-5" />,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    jobCount: '2,340',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop'
  }
];

const JobCategories = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse Jobs by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore opportunities across diverse industries and roles
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/jobs?category=${category.name.toLowerCase().replace(/ /g, '-')}`}
              className="bg-card border border-border/40 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Category Image */}
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className={`absolute bottom-3 left-3 w-10 h-10 ${category.iconBg} ${category.iconColor} flex items-center justify-center rounded-lg backdrop-blur-sm`}>
                  {category.icon}
                </div>
              </div>
              
              {/* Category Info */}
              <div className="p-5">
                <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{category.subtitle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-primary">{category.jobCount}</span>
                    <span className="text-sm text-muted-foreground">jobs</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;
