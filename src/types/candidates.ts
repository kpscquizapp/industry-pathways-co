import type { EntityId } from "@/app/queries/aiShortlistApi";

export interface CandidateProfile {
  id: EntityId;
  name: string;
  role: string;
  avatar?: string;
  matchScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  hourlyRate: { min: number; max: number };
  availability: string;
  location: string;
  experience: string;
  englishLevel?: string;
  type: "individual" | "bench";
  company?: string;
  skills: string[];
  certifications?: { name: string; issuer: string; year: string }[];
  about?: string;
  workExperience?: {
    role: string;
    company: string;
    companyColor?: string;
    period: string;
    location: string;
    highlights: string[];
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    icon: "smartphone" | "shopping";
  }[];
}
