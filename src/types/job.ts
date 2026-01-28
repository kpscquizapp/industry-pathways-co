
export type JobListing = {
  id: number;
  title: {
    pl: string;
    en: string;
  };
  company: string;
  description: {
    pl: string;
    en: string;
  };
  salary: string;
  location: string;
  type: {
    pl: string;
    en: string;
  };
  contractType?: 'full-time' | 'contract' | 'temporary' | 'freelance';
  featured?: boolean;
  experience?: string;
  skills?: string[];
  industry?: string;
  fullDescription?: string;
};

export type CareerPath = {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  recommendedCourses: Course[];
  salaryRange: string;
  demandLevel: 'high' | 'medium' | 'low';
  growthPotential: 'high' | 'medium' | 'low';
};

export type Course = {
  id: number;
  title: string;
  provider: string;
  duration: string;
  cost: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  url: string;
};
