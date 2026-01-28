import React from "react";
import {
  Download,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Globe,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Certification {
  name: string;
  issueDate: string;
}

interface WorkHistoryItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
}

interface ProjectItem {
  name: string;
  tech: string;
  icon?: React.ReactNode;
}

interface AiScores {
  technical: number;
  communication: number;
  problemSolving: number;
}

interface Candidate {
  name: string;
  phone?: string;
  matchPercentage: number;
  title: string;
  location?: string;
  experience?: string;
  language?: string;
  hourlyRate?: string;
  profileType: "bench" | "contract";
  skills?: string[];
  availability?: string;
  resume?: string;
  coverLetter?: string;
  certifications?: Certification[];
  workHistory: WorkHistoryItem[];
  projects?: ProjectItem[];
  topMatch: boolean;
  about?: string;
  aiScores: AiScores;
}

interface AiMatchedProfileProps {
  candidate: Candidate;
}

// Small helper to create stable, readable IDs
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);

const AiMatchedProfile = ({ candidate }: AiMatchedProfileProps) => {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const candidateId = React.useMemo(() => {
    const nameSlug = slugify(candidate.name || "candidate");
    return `AiMatchedProfile-${nameSlug}`;
  }, [candidate.name]);

  return (
    <div
      id={candidateId}
      className={`min-h-screen bg-muted/30 dark:bg-muted/60`}
    >
      {/* Header */}
      {/* <header className="bg-[#1a2332] text-white px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-[#1a2332] rounded-sm"></div>
              </div>
              <span className="font-bold text-lg">HIRION</span>
            </div>
            <nav className="hidden lg:flex gap-6">
              <a href="#" className="text-gray-300 hover:text-white">Dashboard</a>
              <a href="#" className="text-gray-300 hover:text-white">Talent Marketplace</a>
              <a href="#" className="text-gray-300 hover:text-white">Interviews</a>
              <a href="#" className="text-gray-300 hover:text-white">Contracts</a>
            </nav>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Bell className="w-5 h-5 cursor-pointer" />
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <button 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
      {/* {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-2">
            <a href="#" className="block text-gray-300 hover:text-white py-2">Dashboard</a>
            <a href="#" className="block text-gray-300 hover:text-white py-2">Talent Marketplace</a>
            <a href="#" className="block text-gray-300 hover:text-white py-2">Interviews</a>
            <a href="#" className="block text-gray-300 hover:text-white py-2">Contracts</a>
          </nav>
        )}
      </header> */}

      <div className="max-w-8xl mx-auto p-6 sm:py-12 sm:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 bg-muted/30 dark:bg-muted/60">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Profile Card */}
          <Card
            id={`AiMatchedProfile-${candidateId}-profile`}
            className="dark:bg-slate-800 dark:border-slate-700"
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 shadow-xl ring-4 ring-white/90 dark:ring-slate-700/90">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <h2 className="text-lg sm:text-xl font-bold mb-1 dark:text-slate-100">
                {candidate.name}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mb-3 font-semibold">
                {candidate.title}
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold text-xs">
                  {candidate.profileType === "bench"
                    ? "BENCH RESOURCE"
                    : "CONTRACT RESOURCE"}
                </Badge>
                {candidate.topMatch && (
                  <Badge className="bg-blue-100 font-bold text-blue-700 hover:bg-blue-100 text-xs">
                    <Sparkles className="w-3 h-3 flex-shrink-0 mr-1" />
                    Top 5% Match
                  </Badge>
                )}
              </div>
              <div className="xl:flex gap-x-4 my-8">
                <Button className="w-full bg-[#0285c7] hover:bg-[#0285c7]/90 mb-2 text-sm sm:text-base text-white">
                  Book Interview
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full xl:w-16 hover:bg-[#0285c7]/90 mb-2 text-sm sm:text-base dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Details Card */}
              <div className="border-t-2 border-t-gray-200 dark:border-t-slate-700 mt-8" />
              <CardContent className="p-0 my-8 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Hourly Rate</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap dark:text-slate-200">
                    {candidate.hourlyRate} / hr
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Availability</span>
                  </span>
                  <span className="font-semibold text-green-600 whitespace-nowrap">
                    {candidate.availability}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Location</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap dark:text-slate-200">
                    {candidate.location}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Experience</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap dark:text-slate-200">
                    {candidate.experience}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">English</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap dark:text-slate-200">
                    {candidate.language}
                  </span>
                </div>
              </CardContent>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card
            id={`AiMatchedProfile-${candidateId}-skillsCard`}
            className="dark:bg-slate-800 dark:border-slate-700"
          >
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-bold mb-3 text-sm sm:text-base dark:text-slate-100">
                Skills & Tech
              </h3>
              <div
                id={`AiMatchedProfile-${candidateId}-skills`}
                className="flex flex-wrap gap-2"
              >
                {candidate.skills?.map((skill) => (
                  <Badge
                    key={skill}
                    id={`AiMatchedProfile-${candidateId}-skill-${skill
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}`}
                    variant="secondary"
                    className="bg-gray-100 text-xs dark:bg-slate-700 dark:text-slate-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications Card */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-bold mb-3 text-sm sm:text-base dark:text-slate-100">
                Certifications
              </h3>
              <div className="space-y-3">
                {candidate.certifications?.length ? (
                  candidate.certifications.map(
                    ({ name, issueDate }, cIndex) => (
                      <div
                        id={`AiMatchedProfile-${candidateId}-cert-${slugify(
                          name
                        )}-${cIndex}`}
                        className="flex items-start gap-3"
                        key={`${name}-${cIndex}`}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 dark:bg-blue-900/40">
                          <span role="img" aria-label="diploma">
                            🎓
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm dark:text-slate-200">
                            {name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {issueDate}
                          </p>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      🎓
                    </div>
                    <div>
                      <p className="font-semibold text-xs my-auto sm:text-sm text-gray-500">
                        No Certifications
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full justify-start overflow-x-auto dark:bg-slate-800 dark:text-slate-400">
              <TabsTrigger
                value="overview"
                className="text-xs sm:text-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="text-xs sm:text-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="assessment"
                className="text-xs sm:text-sm whitespace-nowrap dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
              >
                Assessment Report
              </TabsTrigger>
              <TabsTrigger
                value="resume"
                className="text-xs sm:text-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
              >
                Resume
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* AI Matching Score */}
              <Card
                id={`AiMatchedProfile-${candidateId}-aiCard`}
                className="dark:bg-slate-800 dark:border-slate-700"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative flex-shrink-0">
                        <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="#e5e7eb"
                            strokeWidth="5"
                            fill="none"
                            className="sm:hidden"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="#0ea5e9"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray={`${
                              (candidate.matchPercentage / 100) * 176
                            } 176`}
                            strokeLinecap="round"
                            className="sm:hidden"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                            fill="none"
                            className="hidden sm:block"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="#0ea5e9"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${
                              (candidate.matchPercentage / 100) * 213.6
                            } 213.6`}
                            strokeLinecap="round"
                            className="hidden sm:block"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl sm:text-2xl font-bold text-[#0285c7]">
                            {candidate.matchPercentage}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold dark:text-slate-100">
                          AI Matching Score
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                          Based on your project requirements for "
                          {candidate.title}".
                        </p>
                      </div>
                    </div>
                    <Button className="bg-[#0285c7] hover:bg-[#0285c7]/90 w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap">
                      View Detailed Report
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border-2 border-gray-200 dark:border-slate-600">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mb-1 font-semibold">
                        Technical Skill
                      </p>
                      <p className="text-xl sm:text-2xl font-bold dark:text-slate-100">
                        {candidate.aiScores.technical}/10
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border-2 border-gray-200 dark:border-slate-600">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mb-1 font-semibold">
                        Communication
                      </p>
                      <p className="text-xl sm:text-2xl font-bold dark:text-slate-100">
                        {candidate.aiScores.communication}/10
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border-2 border-gray-200 dark:border-slate-600">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mb-1 font-semibold">
                        Problem Solving
                      </p>
                      <p className="text-xl sm:text-2xl font-bold dark:text-slate-100">
                        {candidate.aiScores.problemSolving}/10
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Candidate */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-3 dark:text-slate-100">
                    About Candidate
                  </h3>
                  <p
                    className="text-sm sm:text-base text-gray-700 dark:text-slate-300 mb-3"
                    style={{ lineHeight: "1.8" }}
                  >
                    {candidate.about}
                  </p>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-4 dark:text-slate-100">
                    Work Experience
                  </h3>
                  <div className="space-y-6">
                    {candidate.workHistory.map((entry, index) => {
                      const { id, role, company, period, location, bullets } =
                        entry;
                      const entryId =
                        id ?? `${candidateId}-work-${slugify(role)}-${index}`;
                      return (
                        <div
                          key={entryId}
                          id={entryId}
                          className="flex gap-3 sm:gap-4"
                        >
                          <div className="w-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm sm:text-base dark:text-slate-100">
                              {role}
                            </h4>
                            <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm mb-1 font-semibold">
                              {company}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mb-2 ">
                              {period} • {location}
                            </p>
                            <ul className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                              {bullets.map((bullet, bIndex) => (
                                <li key={`${entryId}-bullet-${bIndex}`}>
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Projects */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-bold dark:text-slate-100">
                      Featured Projects
                    </h3>
                    <Button
                      variant="link"
                      className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm p-0"
                    >
                      View Portfolio
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {candidate.projects?.map(({ name, tech, icon }, pIndex) => (
                      <Card
                        id={`AiMatchedProfile-${candidateId}-project-${slugify(
                          name
                        )}-${pIndex}`}
                        className="border dark:border-slate-700 dark:bg-slate-800"
                        key={`${name}-${pIndex}`}
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="w-full h-24 sm:h-32 bg-gray-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <div className="w-10 h-14 sm:w-12 sm:h-16 border-2 border-gray-300 dark:border-slate-500 rounded flex items-center justify-center text-2xl dark:text-slate-300">
                              {icon}
                            </div>
                          </div>
                          <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base dark:text-slate-100">
                            {name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                            {tech}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projects" className="space-y-4">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6 text-center text-gray-500 dark:text-slate-400">
                  Projects content coming soon...
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6 text-center text-gray-500 dark:text-slate-400">
                  Assessment Report coming soon...
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume" className="space-y-4">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6 text-center text-gray-500 dark:text-slate-400">
                  Resume viewer coming soon...
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AiMatchedProfile;
