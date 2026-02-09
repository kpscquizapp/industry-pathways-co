import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import PageTransition from "./components/PageTransition";
import Index from "./pages/Index";
const NotFound = lazy(() => import("./pages/NotFound"));
// import CareerPath from "./pages/CareerPath";
// import Marketplace from "./pages/Marketplace";
// import FindTalent from "./pages/FindTalent";
// import TalentProfile from "./pages/TalentProfile";
// import RegisterTalent from "./pages/RegisterTalent";
const EmployerSignup = lazy(() => import("./pages/EmployerSignup"));
const BenchRegistration = lazy(() => import("./pages/BenchRegistration"));
const CandidateSignup = lazy(() => import("./pages/CandidateSignup"));
import EmployerLogin from "./pages/EmployerLogin";
import BenchLogin from "./pages/BenchLogin";
import CandidateLogin from "./pages/CandidateLogin";
// import ProfileVisibility from "./pages/ProfileVisibility";
// import Register from "./pages/Register";
// import JobSearch from "./pages/JobSearch";
// import JobDetails from "./pages/JobDetails";
// import ListBenchTalent from "./pages/ListBenchTalent";
// import Login from "./pages/Login";
// import CandidateProfile from "./pages/CandidateProfile";
// import JobRecommendations from "./pages/JobRecommendations";
// import SkillsAssessment from "./pages/SkillsAssessment";
// import SavedJobs from "./pages/SavedJobs";

// Old Employer Dashboard (keeping for compatibility)
const EmployerLayoutOld = lazy(
  () => import("./components/employer/EmployerLayout"),
);
const CompanyDashboard = lazy(
  () => import("./pages/employer/CompanyDashboard"),
);
const PostJob = lazy(() => import("./pages/employer/PostJob"));
const AIScreening = lazy(() => import("./pages/employer/AIScreening"));
const HireFullTime = lazy(() => import("./pages/employer/HireFullTime"));
const HireInterns = lazy(() => import("./pages/employer/HireInterns"));
const ContractHiring = lazy(() => import("./pages/employer/ContractHiring"));
const TalentMarketplace = lazy(
  () => import("./pages/employer/TalentMarketplace"),
);
const PostBenchResource = lazy(
  () => import("./pages/employer/PostBenchResource"),
);
const ActiveResources = lazy(() => import("./pages/employer/ActiveResources"));
const VisibilitySettings = lazy(
  () => import("./pages/employer/VisibilitySettings"),
);
const JobCandidates = lazy(() => import("./pages/employer/JobCandidates"));
const AIInterviewResults = lazy(
  () => import("./pages/employer/AIInterviewResults"),
);
const JobBoard = lazy(() => import("./pages/employer/JobBoard"));
const CreateJob = lazy(() => import("./pages/employer/CreateJob"));
const JobDetailsPage = lazy(() => import("./pages/employer/JobDetails"));
const CandidateDetailPage = lazy(
  () => import("./pages/employer/CandidateDetailPage"),
);
// New Dashboard Layout
const UnifiedDashboardLayout = lazy(
  () => import("./components/dashboard/UnifiedDashboardLayout"),
);

// New Dashboard Pages
const ContractorDashboard = lazy(
  () => import("./pages/contractor/ContractorDashboard"),
);
const ContractorProfile = lazy(
  () => import("./pages/contractor/ContractorProfile"),
);
const ContractorSettings = lazy(
  () => import("./pages/contractor/ContractorSettings"),
);
const BenchDashboard = lazy(() => import("./pages/bench/BenchDashboard"));
// import HiringDashboardNew from "./pages/employer/HiringDashboardNew";
// import EmployerPostJob from "./pages/employer/EmployerPostJob";
// import EmployerAIShortlists from "./pages/employer/EmployerAIShortlists";
// import EmployerSkillTests from "./pages/employer/EmployerSkillTests";
// import EmployerAIInterviews from "./pages/employer/EmployerAIInterviews";
// import EmployerContracts from "./pages/employer/EmployerContracts";
// import EmployerSettings from "./pages/employer/EmployerSettings";

import { useFetchRefreshToken } from "./services/utils/hooks/useFetchRefreshToken";
import ForgotPassword from "./pages/ForgotPassword";
import { ProtectedLayout } from "./components/auth/ProtectedLayout";
import BarLoader from "./components/loader/BarLoader";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Component to handle refresh token logic - must be inside all providers
const RefreshTokenHandler = () => {
  useFetchRefreshToken();
  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <RefreshTokenHandler />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* <Route path="/career-path" element={<CareerPath />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/find-talent" element={<FindTalent />} />
                    <Route path="/talent/:id" element={<TalentProfile />} /> */}
                    {/* <Route
                      path="/register-talent"
                      element={<RegisterTalent />}
                    /> */}
                    <Route path="/employer-login" element={<EmployerLogin />} />
                    <Route
                      path="/employer-signup"
                      element={
                        <Suspense fallback={<BarLoader />}>
                          <EmployerSignup />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/bench-registration"
                      element={
                        <Suspense fallback={<BarLoader />}>
                          <BenchRegistration />
                        </Suspense>
                      }
                    />
                    <Route path="/bench-login" element={<BenchLogin />} />
                    <Route
                      path="/candidate-login"
                      element={<CandidateLogin />}
                    />
                    <Route
                      path="/candidate-signup"
                      element={
                        <Suspense fallback={<BarLoader />}>
                          <CandidateSignup />
                        </Suspense>
                      }
                    />
                    {/* <Route
                      path="/profile-visibility"
                      element={<ProfileVisibility />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/jobs" element={<JobSearch />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                    <Route path="/job/:id" element={<JobDetails />} />
                    <Route
                      path="/list-bench-talent"
                      element={<ListBenchTalent />}
                    />
                    <Route path="/login" element={<Login />} /> */}
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    {/* <Route
                      path="/job-recommendations"
                      element={<JobRecommendations />}
                    />
                    <Route
                      path="/skills-assessment"
                      element={<SkillsAssessment />}
                    />
                    <Route path="/saved-jobs" element={<SavedJobs />} /> */}

                    {/* NEW: Contractor Dashboard Routes */}
                    <Route
                      element={<ProtectedLayout allowedRoles={["candidate"]} />}
                    >
                      <Route
                        path="/contractor"
                        element={<UnifiedDashboardLayout role="contractor" />}
                      >
                        <Route index element={<ContractorDashboard />} />
                        <Route
                          path="dashboard"
                          element={<ContractorDashboard />}
                        />
                        <Route path="profile" element={<ContractorProfile />} />
                        <Route path="tests" element={<ContractorDashboard />} />
                        <Route
                          path="interviews"
                          element={<ContractorDashboard />}
                        />
                        <Route
                          path="settings"
                          element={<ContractorSettings />}
                        />
                      </Route>
                    </Route>

                    {/* NEW: Bench Resources Dashboard Routes */}
                    <Route element={<ProtectedLayout allowedRoles={["hr"]} />}>
                      <Route
                        path="/bench"
                        element={<UnifiedDashboardLayout role="bench" />}
                      >
                        <Route index element={<BenchDashboard />} />
                        <Route path="dashboard" element={<BenchDashboard />} />
                        <Route path="talent" element={<BenchDashboard />} />
                        <Route path="matches" element={<BenchDashboard />} />
                        <Route path="analytics" element={<BenchDashboard />} />
                        <Route path="contracts" element={<BenchDashboard />} />
                        <Route path="billing" element={<BenchDashboard />} />
                      </Route>
                    </Route>

                    {/* Legacy (Current using) Employer Dashboard Routes */}
                    <Route
                      element={<ProtectedLayout allowedRoles={["employer"]} />}
                    >
                      <Route
                        path="/employer-dashboard"
                        element={<EmployerLayoutOld />}
                      >
                        <Route index element={<CompanyDashboard />} />
                        <Route
                          path="dashboard"
                          element={<CompanyDashboard />}
                        />
                        <Route path="job-board" element={<JobBoard />} />
                        <Route path="create-job" element={<CreateJob />} />
                        <Route path="post-job" element={<PostJob />} />
                        <Route
                          path="hire-fulltime"
                          element={<HireFullTime />}
                        />
                        <Route path="hire-interns" element={<HireInterns />} />
                        <Route
                          path="contract-hiring"
                          element={<ContractHiring />}
                        />
                        <Route
                          path="talent-marketplace"
                          element={<TalentMarketplace />}
                        />
                        <Route
                          path="post-bench-resource"
                          element={<PostBenchResource />}
                        />
                        <Route
                          path="active-resources"
                          element={<ActiveResources />}
                        />
                        <Route
                          path="visibility-settings"
                          element={<VisibilitySettings />}
                        />
                        <Route path="ai-screening" element={<AIScreening />} />
                        <Route path="job/:jobId" element={<JobDetailsPage />} />
                        <Route
                          path="job/:jobId/candidates"
                          element={<JobCandidates />}
                        />
                        <Route
                          path="job/:jobId/candidate/:candidateId"
                          element={<CandidateDetailPage />}
                        />
                        <Route
                          path="interview-results/:candidateId"
                          element={<AIInterviewResults />}
                        />
                      </Route>
                    </Route>

                    {/* NEW: (But not used) Hiring Company Dashboard Routes */}
                    {/* <Route
                      path="/employer"
                      element={<UnifiedDashboardLayout role="employer" />}
                    >
                      <Route index element={<HiringDashboardNew />} />
                      <Route
                        path="dashboard"
                        element={<HiringDashboardNew />}
                      />
                      <Route path="post-job" element={<EmployerPostJob />} />
                      <Route
                        path="ai-shortlists"
                        element={<EmployerAIShortlists />}
                      />
                      <Route
                        path="skill-tests"
                        element={<EmployerSkillTests />}
                      />
                      <Route
                        path="ai-interviews"
                        element={<EmployerAIInterviews />}
                      />
                      <Route path="contracts" element={<EmployerContracts />} />
                      <Route path="settings" element={<EmployerSettings />} />
                    </Route> */}

                    {/* Standalone employer routes (redirect to dashboard) */}
                    {/* <Route path="/post-job" element={<EmployerLayoutOld />}>
                      <Route index element={<PostJob />} />
                    </Route>
                    <Route
                      path="/hire-fulltime"
                      element={<EmployerLayoutOld />}
                    >
                      <Route index element={<HireFullTime />} />
                    </Route>
                    <Route path="/hire-interns" element={<EmployerLayoutOld />}>
                      <Route index element={<HireInterns />} />
                    </Route>
                    <Route
                      path="/contract-hiring"
                      element={<EmployerLayoutOld />}
                    >
                      <Route index element={<ContractHiring />} />
                    </Route>
                    <Route
                      path="/talent-marketplace"
                      element={<EmployerLayoutOld />}
                    >
                      <Route index element={<TalentMarketplace />} />
                    </Route>
                    <Route path="/ai-screening" element={<EmployerLayoutOld />}>
                      <Route index element={<AIScreening />} />
                    </Route>
                    <Route
                      path="/company-dashboard"
                      element={<EmployerLayoutOld />}
                    >
                      <Route index element={<CompanyDashboard />} />
                    </Route> */}

                    <Route path="/unauthorized" element={<Unauthorized />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route
                      path="*"
                      element={
                        <Suspense fallback={<BarLoader />}>
                          <NotFound />
                        </Suspense>
                      }
                    />
                  </Routes>
                </PageTransition>
              </BrowserRouter>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
