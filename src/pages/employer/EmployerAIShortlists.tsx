import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  RefreshCw,
  Filter,
  Download,
  Eye,
  UserCheck,
  Search,
  Sparkles,
  Building2,
  User,
  ArrowRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  Play,
  CircleDot,
  Mail,
  Phone,
  AlertCircle,
  Video,
  FileText,
  Bell,
  Plus,
  X,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { CandidateProfile } from "@/types/candidates";
import {
  useGetEmployerJobsQuery,
  useGetJobMatchesQuery,
  aiShortlistApi,
  useShortlistCandidateMutation,
  useRemoveShortlistCandidateMutation,
  useGetCustomTestByCandidateQuery,
} from "@/app/queries/aiShortlistApi";
import { useGetTestReportQuery } from "@/app/queries/contractorSkillTest";
import type { EntityId, Job, Match } from "@/app/queries/aiShortlistApi";

type CandidateProfileWithMeta = CandidateProfile & {
  experienceYears?: number;
  talentSource: 'candidate' | 'bench';
  email?: string;
  mobileNumber?: string;
};

type CandidateListItem = CandidateProfileWithMeta & {
  stage: "matched" | "shortlisted" | "invited";
  matchReasons: string[];
};

const EMPLOYER_JOBS_PAGE_SIZE = 100;
const JOB_MATCHES_PAGE_SIZE = 50;

const mergeUniqueById = <T extends { id: EntityId }>(
  existingItems: T[],
  nextItems: T[],
) => {
  const seenIds = new Set(existingItems.map((item) => String(item.id)));
  const mergedItems = [...existingItems];

  nextItems.forEach((item) => {
    const itemId = String(item.id);
    if (!seenIds.has(itemId)) {
      seenIds.add(itemId);
      mergedItems.push(item);
    }
  });

  return mergedItems;
};

const getEntityIdKey = (id: EntityId) => String(id);

const normalizeSkills = (skills: unknown): string[] => {
  if (Array.isArray(skills)) {
    return skills.filter(
      (skill) => typeof skill === "string" && skill.trim().length > 0,
    );
  }
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeJobSkills = (skills: unknown): string[] => {
  if (Array.isArray(skills)) {
    return skills
      .map((skill) =>
        typeof skill === "string"
          ? skill
          : typeof skill?.name === "string"
            ? skill.name
            : "",
      )
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeCertifications = (
  certs: unknown,
): Array<{ name: string; issuer: string; year: string }> => {
  if (Array.isArray(certs)) {
    return certs.filter(
      (cert) =>
        typeof cert === "object" &&
        cert !== null &&
        typeof cert.name === "string" &&
        typeof cert.issuer === "string" &&
        typeof cert.year === "string",
    );
  }
  return [];
};

const normalizeWorkExperience = (
  experience: unknown,
): Array<{
  role: string;
  company: string;
  companyColor?: string;
  period: string;
  location: string;
  highlights: string[];
}> => {
  if (Array.isArray(experience)) {
    return experience.filter(
      (exp) =>
        typeof exp === "object" &&
        exp !== null &&
        typeof exp.role === "string" &&
        typeof exp.company === "string" &&
        typeof exp.period === "string" &&
        typeof exp.location === "string" &&
        Array.isArray(exp.highlights),
    );
  }
  return [];
};

const normalizeProjects = (
  projects: unknown,
): Array<{
  name: string;
  description: string;
  technologies: string[];
  icon: "smartphone" | "shopping";
}> => {
  if (Array.isArray(projects)) {
    return projects.filter(
      (project) =>
        typeof project === "object" &&
        project !== null &&
        typeof project.name === "string" &&
        typeof project.description === "string" &&
        Array.isArray(project.technologies) &&
        (project.icon === "smartphone" || project.icon === "shopping"),
    );
  }
  return [];
};

const mapMatchToCandidate = (match: Match): CandidateProfileWithMeta | null => {
  const matchId = match.id;
  if (typeof matchId !== "number" && typeof matchId !== "string") {
    console.error("Unexpected match.id type in mapMatchToCandidate", {
      id: match.id,
      type: typeof match.id,
    });
    return null;
  }

  const parsedExperience =
    typeof match.experience === "number"
      ? match.experience
      : typeof match.experience === "string"
        ? Number.parseFloat(match.experience)
        : undefined;
  const hourlyFallback =
    typeof match.hourlyRate === "number"
      ? match.hourlyRate
      : typeof match.expectedSalary?.min === "number"
        ? match.expectedSalary.min
        : 0;
  const hourlyMax =
    typeof match.hourlyRate === "number"
      ? match.hourlyRate
      : typeof match.expectedSalary?.max === "number"
        ? match.expectedSalary.max
        : hourlyFallback;

  return {
    id: matchId,
    name: match.name || "Unknown",
    role: match.role || "Unknown Role",
    matchScore: typeof match.matchScore === "number" ? match.matchScore : 0,
    skills: normalizeSkills(match.skills),
    experience:
      parsedExperience !== undefined && !Number.isNaN(parsedExperience)
        ? `${parsedExperience} Years`
        : "Not specified",
    experienceYears:
      parsedExperience !== undefined && !Number.isNaN(parsedExperience)
        ? parsedExperience
        : undefined,
    availability: "Not specified",
    type: match.source === "bench" ? "bench" : "individual",
    talentSource: (match.source === "bench" ? "bench" : "candidate") as 'candidate' | 'bench',
    hourlyRate: { min: hourlyFallback, max: hourlyMax },
    location: match.location || "Not specified",
    englishLevel: match.englishLevel,
    certifications: normalizeCertifications(match.certifications),
    about: match.about,
    workExperience: normalizeWorkExperience(match.workExperience),
    projects: normalizeProjects(match.projects),
    email: match.email as string | undefined,
    mobileNumber: match.mobileNumber as string | undefined,
  };
};

const CandidateSkillTestDetails = ({ candidate }: { candidate: CandidateListItem | undefined }) => {
  const { data: testData, isLoading: isTestsLoading } = useGetCustomTestByCandidateQuery(
    { candidateEmail: candidate?.email || "" },
    { skip: !candidate?.email }
  );

  const testId = testData?.data?.tests?.[0]?.id;

  const { data: reportData, isLoading: isReportLoading } = useGetTestReportQuery(
    testId as number,
    { skip: !testId }
  );

  if (!candidate) return <div className="text-gray-400 font-medium text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-12">Select a candidate to view their skill test scores</div>;
  if (isTestsLoading || isReportLoading) return <div className="text-gray-400 font-medium text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-12">Loading test details...</div>;
  if (!testId || !reportData?.data) return <div className="text-gray-400 font-medium text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-12">No skill test found for this candidate.</div>;

  const report = reportData.data;
  const overallScore = report.test?.overallScore || 0;
  // Fallback integrity and time taken if not provided
  const codingAccuracy = report.stats?.codingAccuracy || 0;
  const durationStr = report.test?.duration ? `${report.test.duration}m` : "N/A";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-6">
      {/* Header (No inner card wrapper, just layout) */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 shrink-0"><AvatarFallback className="bg-gray-100 text-gray-700 text-lg font-bold">{candidate.name.charAt(0)}</AvatarFallback></Avatar>
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">{candidate.name}</h2>
            <div className="flex items-center text-[13px] text-gray-500 mt-1">
              {candidate.email && <span className="text-[#08b8cc]">{candidate.email}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {/* <Button className="h-9 text-xs font-bold bg-[#08b8cc] hover:bg-[#07a3b5] shadow-sm text-white"><ArrowRight className="h-3.5 w-3.5 mr-2" /> Move to Interview</Button> */}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-8 pt-6">
        <div className="col-span-2 flex flex-col gap-8">
          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#fcfdfa] border border-[#f0f0f0] rounded-xl py-4 flex flex-col items-center shadow-sm">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wide">Overall Score</p>
              <p className="text-[28px] font-bold text-[#08b8cc] mt-1 leading-none">{overallScore}%</p>
            </div>
            <div className="bg-[#fcfdfa] border border-[#f0f0f0] rounded-xl py-4 flex flex-col items-center shadow-sm">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wide">Coding Accuracy</p>
              <p className="text-[28px] font-bold text-gray-900 mt-1 leading-none">{report.stats?.codingAccuracy || 0}%</p>
            </div>
            <div className="bg-[#fcfdfa] border border-[#f0f0f0] rounded-xl py-4 flex flex-col items-center shadow-sm">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wide">Time Taken</p>
              <p className="text-[28px] font-bold text-gray-900 mt-1 leading-none">{durationStr}</p>
            </div>
          </div>

          {/* Test Recording (No card wrapper) */}
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4 text-[15px]">Test Recording</h3>
            <div className="relative bg-gray-900 h-[260px] w-full flex items-center justify-center rounded-xl overflow-hidden shadow-sm">
              <Video className="h-16 w-16 text-gray-700" />
              <Button variant="secondary" className="absolute rounded-full h-14 w-14 p-0 bg-white/20 hover:bg-white/30 border-none items-center justify-center">
                <Play className="h-6 w-6 text-white ml-1" />
              </Button>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded font-bold">42:15</div>
            </div>
          </div>

          {/* Skill Breakdown (No card wrapper) */}
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-900 mb-5 text-[15px]">Test Stats</h3>
            <div className="space-y-5">
              <div className="flex justify-between text-[13px] font-bold text-gray-800 mb-2">
                <span>Questions Reviewed</span>
                <span>{report.stats?.questionsReviewed || 0}</span>
              </div>
              <div className="flex justify-between text-[13px] font-bold text-gray-800 mb-2">
                <span>Correct Answers</span>
                <span>{report.stats?.correctAnswers || 0}</span>
              </div>
              <div className="flex justify-between text-[13px] font-bold text-gray-800 mb-2">
              </div>
              <div className="flex justify-between text-[13px] font-bold text-gray-800 mb-2">
                <span>Improvement Focus</span>
                <span className="text-[#f59e0b]">{report.stats?.improvementFocus || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col h-full">
          {/* Proctoring Log (Side card) */}
          <div className="bg-[#fcfdfc] border border-gray-100 rounded-xl shadow-sm p-5 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-[15px]">Proctoring Log</h3>
              <span className="bg-[#e0fafe] text-[#08b8cc] text-[10px] font-bold px-2 py-0.5 rounded">Low Risk</span>
            </div>

            {/* Timeline */}
            <div className="relative pl-[18px] space-y-6 before:absolute before:left-[4px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-gray-200">
              <div className="relative">
                <div className="absolute -left-[24px] w-[10px] h-[10px] rounded-full bg-[#08b8cc] shadow-sm ring-[3px] ring-white"></div>
                <h4 className="text-[13px] font-bold text-gray-900 leading-none">Identity Verified</h4>
                <p className="text-[11px] text-gray-400 mt-1">10:00 AM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[24px] w-[10px] h-[10px] rounded-full bg-[#08b8cc] shadow-sm ring-[3px] ring-white"></div>
                <h4 className="text-[13px] font-bold text-gray-900 leading-none">Test Started</h4>
                <p className="text-[11px] text-gray-400 mt-1">10:02 AM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[24px] w-[10px] h-[10px] rounded-full bg-[#f59e0b] shadow-sm ring-[3px] ring-white"></div>
                <h4 className="text-[13px] font-bold text-gray-900 leading-none">Browser tab switched</h4>
                <p className="text-[11px] text-gray-400 mt-1 mb-2">10:15 AM</p>
                <div className="bg-[#fefce8] border border-[#fef08a] text-[#a16207] text-[11px] p-3 rounded-lg leading-relaxed shadow-sm">
                  Candidate navigated away from the test window for 12 seconds.
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[24px] w-[10px] h-[10px] rounded-full bg-[#08b8cc] shadow-sm ring-[3px] ring-white"></div>
                <h4 className="text-[13px] font-bold text-gray-900 leading-none">Coding Challenge Submitted</h4>
                <p className="text-[11px] text-gray-400 mt-1">10:25 AM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[24px] w-[10px] h-[10px] rounded-full bg-[#08b8cc] shadow-sm ring-[3px] ring-white"></div>
                <h4 className="text-[13px] font-bold text-gray-900 leading-none">Test Completed</h4>
                <p className="text-[11px] text-gray-400 mt-1">10:42 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateAiInterviewDetails = ({ candidate }: { candidate: CandidateListItem | undefined }) => {
  if (!candidate) return <div className="text-gray-400 font-medium text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-12">Select a candidate to view their AI interview scores</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 shrink-0"><AvatarFallback className="bg-gray-100 text-gray-700 text-lg font-bold">{candidate.name.charAt(0)}</AvatarFallback></Avatar>
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">{candidate.name}</h2>
            <div className="flex items-center text-[13px] text-gray-500 mt-1">
              {candidate.email && <span className="text-[#08b8cc]">{candidate.email}</span>}
              {candidate.email && <span className="mx-2 text-gray-300">•</span>}
              <span>{candidate.mobileNumber}</span>
              <span className="mx-2 text-gray-300">•</span>
              <div className="flex items-center gap-1.5 text-[#08b8cc] font-bold"><CheckCircle2 className="h-3.5 w-3.5" /> AI Interview Scored</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-9 text-xs font-bold text-gray-700 border-gray-200 shadow-sm">View Profile</Button>
          <Button variant="outline" className="h-9 text-xs font-bold text-red-500 border-red-100 bg-white hover:bg-red-50 shadow-sm">Reject</Button>
          {/* <Button className="h-9 text-xs font-bold bg-[#08b8cc] hover:bg-[#07a3b5] shadow-sm text-white"><UserCheck className="h-3.5 w-3.5 mr-2" /> Shortlist & Offer</Button> */}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-8 pt-6">
        <div className="col-span-2 flex flex-col gap-8">
          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#fcfdfa] border border-[#f0f0f0] rounded-xl py-4 flex flex-col items-center shadow-sm">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wide">Overall AI Score</p>
              <p className="text-[28px] font-bold text-[#08b8cc] mt-1 leading-none">92%</p>
            </div>
            <div className="bg-[#fcfdfa] border border-[#f0f0f0] rounded-xl py-4 flex flex-col items-center shadow-sm">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wide">Communication</p>
              <p className="text-[28px] font-bold text-gray-900 mt-1 leading-none">95%</p>
            </div>
            <div className="bg-[#fcfdfa] border border-[#f0f0f0] rounded-xl py-4 flex flex-col items-center shadow-sm">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wide">Technical Depth</p>
              <p className="text-[28px] font-bold text-gray-900 mt-1 leading-none">89%</p>
            </div>
          </div>

          {/* Test Recording */}
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4 text-[15px]">Interview Recording</h3>
            <div className="relative bg-gray-900 h-[260px] w-full flex items-center justify-center rounded-xl overflow-hidden shadow-sm">
              <Video className="h-16 w-16 text-gray-700" />
              <Button variant="secondary" className="absolute rounded-full h-14 w-14 p-0 bg-white/20 hover:bg-white/30 border-none items-center justify-center">
                <Play className="h-6 w-6 text-white ml-1" />
              </Button>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded font-bold">18:45</div>
            </div>
          </div>

          {/* Questions & AI Evaluation */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 mb-2 text-[15px]">Questions & AI Evaluation</h3>

            {[
              { q: "Can you describe a complex problem you solved using React Hooks and how you approached state management?", score: "95% Match", text: "Candidate gave a detailed example of refactoring a legacy class component to functional components using useReducer and Context API. They clearly explained the performance benefits and how it reduced boilerplate code. Excellent technical depth." },
              { q: "How do you ensure your web applications are accessible (a11y) and performant?", score: "75% Match", text: "Addressed performance well (lazy loading, code splitting), but only briefly mentioned ARIA labels for accessibility. Lacked depth on semantic HTML and keyboard navigation testing.", yellow: true },
              { q: "Tell me about a time you had a disagreement with a product manager about a feature.", score: "92% Match", text: "Candidate provided a great STAR method example showing excellent communication and negotiation skills without compromising standard design practices." },
            ].map((item, i) => (
              <div key={i} className="bg-[#fcfdfc] border border-gray-100 rounded-xl shadow-sm p-5 text-sm">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h4 className="font-bold text-gray-900 leading-snug">{i + 1}. {item.q}</h4>
                  <span className={`shrink-0 font-bold px-2 py-1 rounded text-[11px] ${item.yellow ? 'bg-[#fefce8] border border-[#fef08a] text-[#a16207]' : 'bg-[#e0fafe] text-[#08b8cc]'}`}>{item.score}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-[13px] text-gray-600 leading-relaxed shadow-sm">
                  <span className="font-bold text-gray-800">AI Summary: </span>{item.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          {/* AI Behavioral Insights */}
          <div className="bg-[#fcfdfc] border border-gray-100 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-[14px]">
              <Sparkles className="h-4 w-4 text-[#08b8cc] shrink-0" /> AI Behavioral Insights
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full p-0.5 mt-0.5"><CheckCircle2 className="h-3 w-3" /></div>
                <div className="text-[12px] text-gray-600 leading-relaxed"><strong className="text-gray-900">Confident Delivery:</strong> Maintained consistent eye contact with the camera and spoke clearly with steady pacing.</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full p-0.5 mt-0.5"><CheckCircle2 className="h-3 w-3" /></div>
                <div className="text-[12px] text-gray-600 leading-relaxed"><strong className="text-gray-900">Structured Thinking:</strong> Consistently used the STAR method (Situation, Task, Action, Result) when answering behavioral questions.</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-red-100 text-red-600 rounded-full p-0.5 mt-0.5"><span className="h-3 w-3 flex items-center justify-center font-bold text-[13px] leading-none">-</span></div>
                <div className="text-[12px] text-gray-600 leading-relaxed"><strong className="text-gray-900">Technical Vocabulary:</strong> Slightly overused jargon when explaining concepts to non-technical stakeholders in scenario 3.</div>
              </div>
            </div>
          </div>

          {/* Soft Skills Scoring */}
          <div className="bg-[#fcfdfc] border border-gray-100 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-5 text-[14px]">Soft Skills Scoring</h3>
            <div className="space-y-5">
              {[
                { name: "Clarity & Articulation", score: 95, color: "bg-[#08b8cc]" },
                { name: "Problem Solving Approach", score: 88, color: "bg-[#08b8cc]" },
                { name: "Enthusiasm & Energy", score: 92, color: "bg-[#08b8cc]" },
                { name: "Cultural Fit", score: 85, color: "bg-[#08b8cc]" },
              ].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-[13px] font-bold text-gray-700 mb-2">
                    <span>{skill.name}</span>
                    <span>{skill.score}%</span>
                  </div>
                  <div className="h-[6px] w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarCandidateItem = ({
  candidate,
  isSelected,
  onClick,
  tab,
}: {
  candidate: CandidateListItem;
  isSelected: boolean;
  onClick: () => void;
  tab: "skill-test" | "ai-interview";
}) => {
  const { data: testData } = useGetCustomTestByCandidateQuery(
    { candidateEmail: candidate.email || "" },
    { skip: !candidate.email || tab !== "skill-test" }
  );

  const testId = testData?.data?.tests?.[0]?.id;
  const { data: reportData } = useGetTestReportQuery(
    testId as number,
    { skip: !testId || tab !== "skill-test" }
  );

  let statusDisplay = tab === "skill-test" ? "Pending" : "Interviewed";
  if (tab === "skill-test" && reportData?.data?.questions?.length > 0) {
    statusDisplay = reportData.data.questions[0].status;
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${isSelected ? 'border-[#08b8cc] border-l-[3px] shadow-sm bg-white' : 'border-gray-100 border-l-[3px] border-l-transparent bg-white shadow-sm'}`}
    >
      <Avatar className="h-10 w-10 shrink-0 shadow-sm border border-gray-100">
        <AvatarFallback className="bg-gray-100 text-gray-700 font-bold">{candidate.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 text-[14px] truncate">{candidate.name}</h4>
        <div className="mt-2 text-[11px] font-bold flex items-center justify-between tracking-wide">
          <div className={`flex items-center gap-1.5 ${statusDisplay === "Correct" || statusDisplay === "Completed" ? "text-[#08b8cc]" : statusDisplay === "Incorrect" ? "text-red-500" : "text-gray-400"}`}>
            <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
            {statusDisplay}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployerAIShortlists = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const [selectedJob, setSelectedJob] = useState(
    jobIdParam && jobIdParam !== "all" ? jobIdParam : "",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCandidateId, setSelectedCandidateId] = useState<EntityId | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<EntityId[]>([]);
  const [bulkFilterStatus, setBulkFilterStatus] = useState<"" | "shortlisted" | "unshortlisted">("");
  const [employerJobsPage, setEmployerJobsPage] = useState(1);
  const [loadedEmployerJobs, setLoadedEmployerJobs] = useState<Job[]>([]);
  const [jobMatchesPage, setJobMatchesPage] = useState(1);
  const [loadedMatches, setLoadedMatches] = useState<Match[]>([]);
  const { data: employerJobsResponse, isLoading: jobsLoading } =
    useGetEmployerJobsQuery({
      page: employerJobsPage,
      limit: EMPLOYER_JOBS_PAGE_SIZE,
    });

  const employerJobs = loadedEmployerJobs;
  const isAllJobsSelected = !selectedJob;
  const selectedJobId = !isAllJobsSelected ? String(selectedJob) : null;
  const shouldFetchMatches = selectedJobId !== null;
  const jobMatchesQueryId = selectedJobId ?? "";
  const stateJob = (location.state as { job?: Job } | null)?.job;
  const selectedJobDetails =
    employerJobs.find((job) => String(job.id) === selectedJobId) ??
    (stateJob && String(stateJob.id) === selectedJobId ? stateJob : undefined);

  const {
    data: matchesResponse,
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches,
  } = useGetJobMatchesQuery(
    {
      id: jobMatchesQueryId,
      page: jobMatchesPage,
      limit: JOB_MATCHES_PAGE_SIZE,
    },
    { skip: !shouldFetchMatches, pollingInterval: 30000 },
  );

  const [shortlistCandidateMutation] = useShortlistCandidateMutation();
  const [removeShortlistCandidateMutation] = useRemoveShortlistCandidateMutation();

  // On component mount, ensure we load the correct job if it's in URL params
  useEffect(() => {
    const initialJobId = searchParams.get("jobId");
    if (initialJobId && initialJobId !== "all" && !selectedJob) {
      setSelectedJob(initialJobId);
    }
    // Intentionally mount-only: selectedJob is read only as a guard to avoid
    // overwriting user selections on re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Sync selectedJob with URL search params on mount and navigation
  useEffect(() => {
    const currentJobIdParam = searchParams.get("jobId");
    const jobIdFromUrl =
      currentJobIdParam && currentJobIdParam !== "all" ? currentJobIdParam : "";
    if (selectedJob !== jobIdFromUrl) {
      setSelectedJob(jobIdFromUrl);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    const nextJobs = employerJobsResponse?.data ?? [];
    const responsePageNumber = employerJobsResponse?.meta?.page;

    // Only update if response page matches current page (prevents stale responses from earlier pages)
    if (
      responsePageNumber !== undefined &&
      responsePageNumber !== employerJobsPage
    ) {
      return;
    }

    setLoadedEmployerJobs((previousJobs) => {
      const publishedJobs = nextJobs.filter(
        (job: Job) => job.status === "published" || job.status === "active",
      );
      return employerJobsPage === 1
        ? publishedJobs
        : mergeUniqueById(previousJobs, publishedJobs);
    });
  }, [
    employerJobsPage,
    employerJobsResponse?.data,
    employerJobsResponse?.meta?.page,
  ]);

  useEffect(() => {
    if (!shouldFetchMatches) {
      setLoadedMatches([]);
      return;
    }

    const nextMatches = matchesResponse?.data ?? [];
    setLoadedMatches((previousMatches) =>
      jobMatchesPage === 1
        ? nextMatches
        : mergeUniqueById(previousMatches, nextMatches),
    );

    // Seed shortlistedIds from backend-persisted isShortlisted flag.
    // This means on page refresh, candidates the backend already knows are
    // shortlisted will immediately show up with the correct "shortlisted" stage.
    const backendShortlistedIds = nextMatches
      .filter((m: Match) => m.isShortlisted === true)
      .map((m: Match) => m.id);

    if (backendShortlistedIds.length > 0) {
      setShortlistedIds((prev) => {
        const existingKeys = new Set(prev.map(getEntityIdKey));
        const newIds = backendShortlistedIds.filter(
          (id) => !existingKeys.has(getEntityIdKey(id)),
        );
        return newIds.length > 0 ? [...prev, ...newIds] : prev;
      });
    }
  }, [jobMatchesPage, matchesResponse?.data, shouldFetchMatches]);

  const hasMoreEmployerJobs = useMemo(() => {
    const totalPages = employerJobsResponse?.meta?.totalPages;
    if (typeof totalPages === "number") {
      return employerJobsPage < totalPages;
    }

    const total = employerJobsResponse?.meta?.total;
    if (typeof total === "number") {
      return employerJobs.length < total;
    }

    return false; // unknown pagination — don't assume more pages exist
  }, [
    employerJobs.length,
    employerJobsPage,
    employerJobsResponse?.meta?.total,
    employerJobsResponse?.meta?.totalPages,
  ]);

  const hasMoreMatches = useMemo(() => {
    if (!shouldFetchMatches) {
      return false;
    }

    const totalPages = matchesResponse?.meta?.totalPages;
    if (typeof totalPages === "number") {
      return jobMatchesPage < totalPages;
    }

    const total = matchesResponse?.meta?.total;
    if (typeof total === "number") {
      return loadedMatches.length < total;
    }

    return false;
  }, [
    jobMatchesPage,
    loadedMatches.length,
    matchesResponse?.meta?.total,
    matchesResponse?.meta?.totalPages,
    shouldFetchMatches,
  ]);

  const candidates = useMemo<CandidateListItem[]>(() => {
    const shortlistedIdKeys = new Set(
      shortlistedIds.map((shortlistedId) => getEntityIdKey(shortlistedId)),
    );

    return loadedMatches
      .map(mapMatchToCandidate)
      .filter(
        (candidate): candidate is CandidateProfileWithMeta =>
          candidate !== null,
      )
      .map((c) => ({
        ...c,
        stage: shortlistedIdKeys.has(getEntityIdKey(c.id))
          ? "shortlisted"
          : "matched",
        matchReasons: [],
      }));
  }, [loadedMatches, shortlistedIds]);

  // No client-side filtering — display exactly what the backend returns for the selected job

  // Filter by tab and search term only — no additional relevance filtering
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredCandidates = useMemo(
    () =>
      candidates
        .filter((c) => {
          if (activeTab === "matched") return c.stage === "matched";
          if (activeTab === "shortlisted") return c.stage === "shortlisted";
          return true;
        })
        .filter((c) => {
          if (bulkFilterStatus === "shortlisted") return c.stage === "shortlisted";
          if (bulkFilterStatus === "unshortlisted") return c.stage === "matched";
          return true;
        })
        .filter((c) => {
          if (!normalizedSearchTerm) return true;
          return c.name.toLowerCase().includes(normalizedSearchTerm);
        }),
    [candidates, activeTab, bulkFilterStatus, normalizedSearchTerm],
  );

  // Sidebar always shows only shortlisted candidates for the selected job,
  // independent of activeTab / bulkFilterStatus filters on the main list.
  const sidebarCandidates = useMemo(
    () =>
      candidates
        .filter((c) => c.stage === "shortlisted")
        .filter((c) =>
          !normalizedSearchTerm
            ? true
            : c.name.toLowerCase().includes(normalizedSearchTerm)
        ),
    [candidates, normalizedSearchTerm],
  );

  const counts = useMemo(() => {
    const matchesSearch = (candidate: CandidateListItem) =>
      !normalizedSearchTerm ||
      candidate.name.toLowerCase().includes(normalizedSearchTerm);

    return {
      all: candidates.filter(matchesSearch).length,
      matched: candidates.filter(
        (candidate) =>
          candidate.stage === "matched" && matchesSearch(candidate),
      ).length,
      shortlisted: candidates.filter(
        (candidate) =>
          candidate.stage === "shortlisted" && matchesSearch(candidate),
      ).length,
    };
  }, [candidates, normalizedSearchTerm]);

  // Real-time search as user types
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectedJobChange = (value: string) => {
    setSelectedJob(value === "all" ? "" : value);
    setLoadedMatches([]);
    setJobMatchesPage(1);
    // Update URL search params so jobId persists across navigation
    const nextParams = new URLSearchParams(searchParams);
    if (!value) {
      nextParams.delete("jobId");
    } else {
      nextParams.set("jobId", value);
    }
    setSearchParams(nextParams);
  };

  const handleLoadMoreJobs = () => {
    if (!hasMoreEmployerJobs || jobsLoading) return;
    setEmployerJobsPage((currentPage) => currentPage + 1);
  };

  const handleLoadMoreMatches = () => {
    if (!hasMoreMatches || matchesLoading || !shouldFetchMatches) return;
    setJobMatchesPage((currentPage) => currentPage + 1);
  };

  const handleRefreshMatches = () => {
    if (!shouldFetchMatches) return;
    dispatch(aiShortlistApi.util.invalidateTags(["AiShortlistMatches"]));
    setLoadedMatches([]);
    setJobMatchesPage(1);
  };

  const handleViewProfile = (candidate: CandidateProfile) => {
    if (candidate.type === "bench") {
      navigate(`/hire-talent/candidate/${candidate.id}?source=bench`, {
        state: { benchCandidate: candidate },
      });
    } else {
      navigate(`/hire-talent/candidate/${candidate.id}`);
    }
  };

  // Helper function to highlight matching text in candidate name
  const getHighlightedName = (name: string, query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return name;

    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "i");
    const parts = name.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          part.match(regex) ? (
            <span key={index} className="bg-yellow-200 font-semibold">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </span>
    );
  };

  const handleShortlist = (candidate: CandidateProfile & { talentSource?: 'candidate' | 'bench' }) => {
    if (!selectedJobId) {
      toast.error("Please select a job first.");
      return;
    }

    const shortlistedCandidateKey = getEntityIdKey(candidate.id);
    const hasAlreadyShortlisted = shortlistedIds.some(
      (shortlistedId) =>
        getEntityIdKey(shortlistedId) === shortlistedCandidateKey,
    );

    if (hasAlreadyShortlisted) {
      // Logic for undoing shortlist
      setShortlistedIds((prev) =>
        prev.filter((id) => getEntityIdKey(id) !== shortlistedCandidateKey),
      );
      toast.info(`${candidate.name} removed from shortlist`);

      removeShortlistCandidateMutation({
        jobId: selectedJobId,
        talentId: candidate.id,
        talentSource: candidate.talentSource ?? "candidate",
      })
        .unwrap()
        .catch(() => {
          // Rollback on error
          setShortlistedIds((prev) => [...prev, candidate.id]);
          toast.error("Failed to remove from shortlist. Please try again.");
        });
    } else {
      // Logic for adding to shortlist
      setShortlistedIds((prev) => [...prev, candidate.id]);
      toast.success(`${candidate.name} added to shortlist!`);

      shortlistCandidateMutation({
        jobId: selectedJobId,
        talentId: candidate.id,
        talentSource: candidate.talentSource ?? "candidate",
      })
        .unwrap()
        .catch(() => {
          // Rollback on error
          setShortlistedIds((prev) =>
            prev.filter((id) => getEntityIdKey(id) !== shortlistedCandidateKey),
          );
          toast.error(`Failed to shortlist ${candidate.name}. Please try again.`);
        });
    }
  };

  useEffect(() => {
    // Force the whole page background to match EmployerPostJob
    document.body.style.setProperty("background-color", "#f2f5fa", "important");
    // Ensure the parent container doesn't have a background that conflicts
    const root = document.getElementById("root");
    if (root) root.style.backgroundColor = "#f2f5fa";

    return () => {
      document.body.style.backgroundColor = "";
      if (root) root.style.backgroundColor = "";
    };
  }, []);

  const handleSkillTest = (candidate: CandidateProfile) => {
    toast.success(`Skill test scheduled for ${candidate.name}!`);
    navigate("/hire-talent/skill-tests");
  };

  const renderSidebar = (tab: "skill-test" | "ai-interview") => (
    <div className="w-[320px] shrink-0 sticky top-[100px] h-fit">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search name..." value={searchTerm} onChange={e => handleSearchChange(e.target.value)} className="pl-9 h-10 border-gray-200 text-[13px] focus-visible:ring-[#08b8cc] rounded-lg shadow-sm bg-white" />
        </div>
        <Button variant="outline" className="h-10 px-3 text-[13px] font-bold text-gray-700 bg-white border-gray-200 hover:bg-gray-50 flex items-center gap-2 rounded-lg shadow-sm">Filter <Filter className="h-3 w-3" /></Button>
      </div>
      <div className="flex flex-col gap-2 pb-4">
        {sidebarCandidates.length === 0 && (
          <div className="p-4 text-center text-[12px] text-gray-400 font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
            {!selectedJob ? "Select a job to see shortlisted candidates." : "No shortlisted candidates yet."}
          </div>
        )}
        {sidebarCandidates.map(candidate => (
          <SidebarCandidateItem
            key={candidate.id}
            candidate={candidate}
            isSelected={selectedCandidateId === candidate.id}
            onClick={() => setSelectedCandidateId(candidate.id)}
            tab={tab}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f5fa] font-sans text-gray-900 flex flex-col">
      {/* Restored Sticky Original Navbar */}
      {/* <div className="bg-white px-4 sm:px-8 py-2.5 sm:py-3.5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <SidebarTrigger className="text-muted-foreground hover:bg-gray-100" title="Toggle Sidebar" />
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-10 px-5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
          <Button size="icon" className="relative bg-transparent hover:bg-gray-100 rounded-xl h-10 w-10">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </div> */}

      <div className="px-8 mt-8 max-w-[1400px] w-full mx-auto pb-10 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight text-gray-900 leading-tight">Talent Pipeline</h1>
        </div>
        <p className="text-gray-500 font-medium text-sm mb-6">
          {selectedJobDetails?.title ?? "Senior Frontend Engineer"} •{" "}
          {bulkFilterStatus === "shortlisted" ? (
            <span className="text-[#08b8cc] font-semibold">{counts.shortlisted} Shortlisted</span>
          ) : bulkFilterStatus === "unshortlisted" ? (
            <span className="text-gray-600 font-semibold">{counts.matched} Unshortlisted</span>
          ) : (
            <span>{counts.all} Total Candidates</span>
          )}
        </p>

        {/* Stages Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-8">
            <TabsList className="bg-[#f2efe9] p-1.5 rounded-xl h-auto inline-flex gap-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg px-5 py-2.5 text-gray-500 font-bold text-sm transition-all"
              >
                All Candidates
              </TabsTrigger>
              <TabsTrigger
                value="skill-test"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg px-5 py-2.5 text-gray-500 font-bold text-sm transition-all"
              >
                Skill Test Scores
              </TabsTrigger>
              <TabsTrigger
                value="ai-interview"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg px-5 py-2.5 text-gray-500 font-bold text-sm transition-all"
              >
                AI Interview Scores
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0 outline-none">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <div className="relative flex-1 min-w-[260px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, skill, or role..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-10 rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#08b8cc] bg-white shadow-sm"
                />
              </div>

              <Select value={selectedJob} onValueChange={handleSelectedJobChange}>
                <SelectTrigger className="w-[200px] h-10 rounded-xl border-gray-200 text-sm bg-white font-medium text-gray-700 shadow-sm">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobsLoading && (
                    <SelectItem value="__loading__" disabled>Loading jobs...</SelectItem>
                  )}
                  {!jobsLoading && employerJobs.length === 0 && (
                    <SelectItem value="__none__" disabled>No jobs found</SelectItem>
                  )}
                  {employerJobs.map((job) => (
                    <SelectItem key={job.id} value={String(job.id)}>{job.title ?? "Untitled Job"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-10 rounded-xl border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-gray-50 shadow-sm flex items-center gap-2 ${bulkFilterStatus ? "border-[#08b8cc] text-[#08b8cc]" : ""
                        }`}
                    >
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                      Bulk Actions
                      {bulkFilterStatus && (
                        <span className="ml-1 bg-[#08b8cc] text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                          1
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-72 rounded-xl shadow-xl border-border p-4 bg-white flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">Filter Candidates</span>
                      {bulkFilterStatus && (
                        <button
                          onClick={() => setBulkFilterStatus("")}
                          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-500">Select Job</span>
                      <Select value={selectedJob || ""} onValueChange={handleSelectedJobChange}>
                        <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 text-sm bg-white font-medium text-gray-700 shadow-sm">
                          <SelectValue placeholder="Select Job" />
                        </SelectTrigger>
                        <SelectContent>
                          {employerJobs.map((job) => (
                            <SelectItem key={job.id} value={String(job.id)}>
                              {job.title ?? "Untitled Job"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-500">Filter by Status</span>
                      <Select
                        value={bulkFilterStatus}
                        onValueChange={(v) => setBulkFilterStatus(v as "shortlisted" | "unshortlisted" | "")}
                      >
                        <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 text-sm bg-white font-medium text-gray-700 shadow-sm">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="unshortlisted">Unshortlisted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-3">
              {matchesLoading && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">Loading candidates...</div>
              )}
              {!matchesLoading && matchesError && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">Failed to load candidates. Please try again.</div>
              )}
              {!matchesLoading && !matchesError && !shouldFetchMatches && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">Select a job to see matched candidates.</div>
              )}
              {!matchesLoading && !matchesError && !jobsLoading && shouldFetchMatches && candidates.length === 0 && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">No candidates found for this job.</div>
              )}
              {!matchesLoading && !matchesError && shouldFetchMatches && candidates.length > 0 && filteredCandidates.length === 0 && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">
                  <p className="font-semibold mb-1">No results found</p>
                  <p className="text-sm">No candidates matching "{searchTerm}".</p>
                </div>
              )}

              {filteredCandidates.map((candidate: CandidateListItem) => {
                const scoreColor = candidate.matchScore >= 90 ? "text-[#08b8cc]" : candidate.matchScore >= 80 ? "text-[#3b82f6]" : "text-[#f59e0b]";
                const scoreBorder = candidate.matchScore >= 90 ? "border-[#08b8cc]" : candidate.matchScore >= 80 ? "border-[#3b82f6]" : "border-[#f59e0b]";

                let badgeUI;
                if (candidate.stage === "invited") {
                  badgeUI = <Badge className="bg-[#e0e7ff] text-[#4f46e5] hover:bg-[#e0e7ff] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">Invited</Badge>;
                } else if (candidate.stage === "shortlisted") {
                  badgeUI = <Badge className="bg-[#ccfbf1] text-[#0f766e] hover:bg-[#ccfbf1] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">Shortlisted</Badge>;
                } else if (candidate.matchScore >= 90) {
                  badgeUI = (
                    <div className="flex flex-col gap-1.5 items-center">
                      <Badge className="bg-[#f3e8ff] hover:bg-[#f3e8ff] text-[#7e22ce] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">Interview Done</Badge>
                      <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1 border border-gray-200 bg-white rounded px-1.5 py-0.5 whitespace-nowrap"><div className="w-1.5 h-1.5 rounded-full bg-[#08b8cc]"></div> Test: 92%</div>
                    </div>
                  );
                } else if (candidate.matchScore >= 80) {
                  badgeUI = <Badge className="bg-[#e0f2fe] text-[#0369a1] hover:bg-[#e0f2fe] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">New Match</Badge>;
                } else {
                  badgeUI = null;
                }

                return (
                  <div key={candidate.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-6 shadow-sm">
                    <div className="flex items-center gap-4 min-w-[280px]">
                      {/* <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#08b8cc] focus:ring-[#08b8cc]" /> */}
                      <Avatar className="h-12 w-12 rounded-full border border-gray-100 shadow-sm">
                        <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold text-lg">{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-gray-900 text-[15px] cursor-pointer hover:underline" onClick={() => handleViewProfile(candidate)}>
                          {getHighlightedName(candidate.name, searchTerm)}
                        </h3>
                        <div className="flex items-center gap-2 text-[12px] text-gray-500 mt-0.5">
                          <span className="truncate max-w-[150px]">{candidate.role}</span>
                          <span className="text-gray-300">•</span>
                          <span>{candidate.experience.split(" ")[0]} yrs</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 5).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-[#fefdfa] border border-gray-100 shadow-sm text-gray-600 text-[11px] font-semibold rounded-md shrink-0">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[11px] font-semibold rounded-md shrink-0 border border-gray-100 shadow-sm">
                            +{candidate.skills.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                      <div className={`w-11 h-11 rounded-full border-2 ${scoreBorder} flex items-center justify-center`}>
                        <span className={`font-bold text-[13px] ${scoreColor}`}>{Math.round(candidate.matchScore)}%</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium mt-1">AI Match</span>
                    </div>

                    <div className="min-w-[120px] flex justify-center">
                      {badgeUI}
                    </div>

                    <div className="flex items-center gap-2 ml-auto min-w-[220px] justify-end">
                      <Button
                        variant="outline"
                        onClick={() => candidate.stage !== "shortlisted" && candidate.stage !== "invited" && handleShortlist(candidate)}
                        className={`h-9 px-4 text-[13px] font-bold rounded-xl border shadow-sm transition-all ${
                          candidate.stage === "invited"
                            ? "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700"
                            : candidate.stage === "shortlisted"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {candidate.stage === "invited" ? (
                          <span className="flex items-center gap-1.5">
                            <Check className="w-4 h-4" strokeWidth={3} />
                            Invited
                          </span>
                        ) : candidate.stage === "shortlisted" ? (
                          <span className="flex items-center gap-1.5">
                            <Check className="w-4 h-4" strokeWidth={3} />
                            Shortlisted
                          </span>
                        ) : (
                          "Shortlist"
                        )}
                      </Button>

                      {(candidate.stage === "shortlisted" || candidate.stage === "invited") && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShortlist(candidate)}
                          className="h-9 w-9 rounded-xl border-rose-200 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 shadow-sm"
                          title="Remove from shortlist"
                        >
                          <X className="h-5 w-5" strokeWidth={2.5} />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}

              {shouldFetchMatches && !matchesError && (candidates.length > 0 || hasMoreMatches) && (
                <div className="flex justify-center pt-6 pb-4">
                  <Button
                    variant="outline"
                    className="rounded-xl border-gray-200 h-10 px-6 text-sm font-bold shadow-sm"
                    onClick={handleLoadMoreMatches}
                    disabled={matchesLoading || !hasMoreMatches}
                  >
                    {matchesLoading ? "Loading..." : hasMoreMatches ? "Load More Candidates" : "All Candidates Loaded"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skill-test" className="mt-0 outline-none">
            <div className="flex gap-6 items-start w-full">
              {renderSidebar("skill-test")}
              <div className="flex-1 min-w-0">
                <CandidateSkillTestDetails candidate={filteredCandidates.find(c => c.id === selectedCandidateId)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-interview" className="mt-0 outline-none">
            <div className="flex gap-6 items-start w-full">
              {renderSidebar("ai-interview")}
              <div className="flex-1 min-w-0">
                <CandidateAiInterviewDetails candidate={filteredCandidates.find(c => c.id === selectedCandidateId)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerAIShortlists;
