
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  translations: {
    [key: string]: string;
  };
}

const translations = {
  // Main Navigation
  candidates: 'Candidates',
  talentMarketplace: 'Talent Marketplace',
  employers: 'Employers',
  services: 'Services',
  resources: 'Resources',
  aboutUs: 'About',
  account: 'Account',
  
  // Candidates Menu
  jobsByCategory: 'Jobs by Category',
  jobsByIndustry: 'Jobs by Industry',
  jobsByRole: 'Jobs by Role',
  jobsByLocation: 'Jobs by Location',
  candidateTools: 'Candidate Tools & Resources',
  
  // Industries
  itSoftware: 'IT & Software',
  bpoKpo: 'BPO / KPO',
  bankingFinance: 'Banking & Finance',
  salesMarketing: 'Sales & Marketing',
  manufacturing: 'Manufacturing',
  healthcare: 'Healthcare',
  education: 'Education & Training',
  logistics: 'Logistics / Supply Chain',
  retail: 'Retail',
  governmentJobs: 'Government Jobs',
  startupJobs: 'Startup Jobs',
  
  // Roles
  developer: 'Developer',
  designer: 'Designer',
  dataAnalyst: 'Data Analyst',
  hr: 'HR',
  salesExecutive: 'Sales Executive',
  operations: 'Operations',
  supportEngineer: 'Support Engineer',
  
  // Locations
  bangalore: 'Bangalore',
  hyderabad: 'Hyderabad',
  pune: 'Pune',
  mumbai: 'Mumbai',
  delhiNCR: 'Delhi NCR',
  chennai: 'Chennai',
  tier2Cities: 'Tier-2 Cities',
  remoteJobs: 'Remote Jobs',
  hybridJobs: 'Hybrid Jobs',
  workFromHome: 'Work-from-Home',
  
  // Candidate Tools
  resumeBuilder: 'Resume Builder',
  careerPathVisualization: 'Career Path Visualization',
  interviewPrep: 'Interview Preparation',
  salaryInsights: 'Salary Insights',
  skillTests: 'Skill Tests & Assessments',
  careerGuidance: 'Career Guidance',
  applicationTracker: 'Application Tracker',
  
  // Talent Marketplace Menu
  findTalent: 'Find Talent',
  registerTalent: 'Register Talent',
  contractTalent: 'Contract / Gig Talent',
  shortTermProject: 'Short-Term Project Resources',
  benchResources: 'Bench Resources from Companies',
  aiTalentMatching: 'AI Talent Matching',
  scheduleAIInterview: 'Schedule AI Interview',
  requestPhysicalInterview: 'Request Physical Interview',
  registerAsFreelance: 'Register as Contract/Freelance Talent',
  addSkillsAvailability: 'Add Skills & Availability',
  addBenchResources: 'Add Bench Resources',
  bulkUpload: 'Bulk Upload Profiles',
  manageBenchDashboard: 'Manage Bench Dashboard',
  setRates: 'Set Hourly/Monthly Rates',
  
  // Employers Menu
  postJob: 'Post a Job',
  hireFullTime: 'Hire Full-Time',
  hireInterns: 'Hire Interns',
  shortTermHiring: 'Short-Term Contract Hiring',
  marketplaceAccess: 'Talent Marketplace Access',
  aiScreening: 'AI Screening',
  companyDashboard: 'Company Dashboard',
  pricingPlans: 'Pricing & Plans',
  
  // Services Menu
  resumeWriting: 'Resume Writing',
  interviewCoaching: 'Interview Coaching',
  aiResumeReview: 'AI Resume Review',
  backgroundVerification: 'Background Verification',
  skillAssessments: 'Skill Assessments',
  rpo: 'Recruitment Process Outsourcing (RPO)',
  employerBranding: 'Employer Branding',
  
  // Resources Menu
  blogInsights: 'Blog & Insights',
  salaryTrends: 'Salary Trends',
  marketReports: 'Market Reports',
  careerAdvice: 'Career Advice',
  hiringTrends: 'Hiring Trends',
  successStories: 'Success Stories',
  faqs: 'FAQs',
  
  // About Menu
  aboutUsPage: 'About Us',
  hirioAI: 'Hirio AI Platform',
  ourTeam: 'Our Team',
  contact: 'Contact',
  pressMedia: 'Press & Media',
  
  // Account Menu
  login: 'Login / Register',
  candidateDashboard: 'Candidate Dashboard',
  employerDashboard: 'Employer Dashboard',
  savedJobs: 'Saved Jobs / Saved Talent',
  messages: 'Messages / Interviews',
  logout: 'Logout',
  
  // Legacy/Other
  employerLogin: 'Employer Login',
  register: 'Register',
  blog: 'Blog',
  marketplace: 'Talent Marketplace',
  
  // Hero
  findDreamJob: 'Find your dream job',
  discoverOpportunities: 'Discover opportunities matching your skills and aspirations',
  searchJobs: 'Search jobs',
  positionSkillsCompany: 'Position, skills or company',
  location: 'Location',
  experienceLevel: 'Experience level',
  entry: 'Entry',
  mid: 'Mid-level',
  senior: 'Senior',
  executive: 'Executive',
  popular: 'Popular: Developer, Project Manager, Marketing, Sales',
  
  // Featured Jobs
  latestJobs: 'Latest jobs',
  featuredJobs: 'Featured job offers',
  discoverBestJobs: 'Discover the best job opportunities from leading companies. Apply now to take the next step in your career.',
  featured: 'Featured',
  apply: 'Apply',
  aboutCompany: 'About',
  browseAllJobs: 'Browse all jobs',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  
  // Career Path
  experience: 'Experience',
  skills: 'Skills',
  careerGoals: 'Career Goals',
  areYouExperienced: 'Are you an experienced IT professional?',
  yes: 'Yes',
  no: 'No',
  haveExperience: 'I have professional experience in IT',
  newToField: "I'm new to the IT field",
  nextStep: 'Next Step',
  selectYourSkills: 'Select your skills',
  back: 'Back',
  viewCareerPaths: 'View Career Paths',
  recommendedCareerPaths: 'Recommended Career Paths',
  availablePaths: 'Available Paths',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  requiredSkills: 'Required Skills',
  salaryRange: 'Salary Range',
  demandLevel: 'Demand Level',
  recommendedCourses: 'Recommended Courses',
  all: 'All',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  providedBy: 'Provided by',
  duration: 'Duration',
  cost: 'Cost',
  level: 'Level',
  goToCourse: 'Go to Course',
  selectPath: 'Select a career path on the left',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
