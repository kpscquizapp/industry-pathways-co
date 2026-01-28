
import React from 'react';
import { Briefcase, Code, PenTool, LineChart, Building, ShoppingCart, PieChart, GraduationCap } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  jobCount: number;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Software Development',
    icon: <Code className="h-6 w-6" />,
    jobCount: 842
  },
  {
    id: 2,
    name: 'Design & Creative',
    icon: <PenTool className="h-6 w-6" />,
    jobCount: 651
  },
  {
    id: 3,
    name: 'Marketing & Sales',
    icon: <LineChart className="h-6 w-6" />,
    jobCount: 723
  },
  {
    id: 4,
    name: 'Business & Finance',
    icon: <PieChart className="h-6 w-6" />,
    jobCount: 510
  },
  {
    id: 5,
    name: 'Engineering',
    icon: <Building className="h-6 w-6" />,
    jobCount: 435
  },
  {
    id: 6,
    name: 'Retail & Commerce',
    icon: <ShoppingCart className="h-6 w-6" />,
    jobCount: 312
  },
  {
    id: 7,
    name: 'Education',
    icon: <GraduationCap className="h-6 w-6" />,
    jobCount: 289
  },
  {
    id: 8,
    name: 'All Categories',
    icon: <Briefcase className="h-6 w-6" />,
    jobCount: 5000
  }
];

const PopularCategories = () => {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in-section">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
            Browse Popular Categories
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Find the perfect role in your area of expertise
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.id}`}
              className="glass-card p-6 flex flex-col items-center text-center group fade-in-section"
            >
              <div className="w-14 h-14 bg-teal-50 flex items-center justify-center rounded-full mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                {category.icon}
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">{category.name}</h3>
              <p className="text-sm text-neutral-500">{category.jobCount} jobs</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
