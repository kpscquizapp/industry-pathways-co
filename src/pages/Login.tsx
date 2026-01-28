import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  MapPin,
  Briefcase,
  Target,
  Award,
  Building2,
  Globe,
  Users,
  Loader,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  useCreateCandidateMutation,
  useCreateEmployerMutation,
  useLoginMutation,
} from "@/app/queries/loginApi";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/app/slices/userAuth";
import { RootState } from "@/app/store";

type Role = "candidate" | "employer";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>("candidate");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Common
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");

  // Candidate fields
  const [availability, setAvailability] = useState("full-time");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState<number>(0);

  // Employer fields
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const [createEmployer, { isLoading: isLoadingEmployer }] =
    useCreateEmployerMutation();
  const [createCandidate, { isLoading: isLoadingCandidate }] =
    useCreateCandidateMutation();
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state: RootState) => state.user.userDetails);

  useEffect(() => {
    if (!userDetails || !isLogin) return;
    navigate(
      userDetails.role === "candidate" ? "/jobs" : "/employer-dashboard",
    );
  }, [userDetails, isLogin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const result = await login({ email, password });
        if ("data" in result) {
          dispatch(setUser(result.data));
          toast.success("Welcome back!");
        } else {
          toast.error("Invalid email or password");
        }
      } catch {
        toast.error("Connection error. Please try again.");
      }
      return;
    }

    const parsedSkills = skills.trim()
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    if (role === "candidate" && parsedSkills.length === 0) {
      toast.error("Please enter at least one skill");
      return;
    }

    // Signup payloads
    const payload =
      role === "candidate"
        ? {
            email,
            password,
            firstName,
            lastName,
            location,
            availability,
            skills: parsedSkills,
            bio,
            yearsExperience,
          }
        : {
            email,
            password,
            firstName,
            lastName,
            companyName,
            industry,
            location,
            companySize,
            website,
            description,
          };

    if (role === "candidate") {
      const result = await createCandidate(payload);
      if ("data" in result) {
        dispatch(setUser(result.data));
        toast.success("Account created successfully!");
        navigate("/profile");
      } else {
        toast.error("Signup failed");
      }
    } else {
      const result = await createEmployer(payload);
      if ("data" in result) {
        dispatch(setUser(result.data));
        toast.success("Account created successfully!");
        navigate("/employer-dashboard");
      } else {
        toast.error("Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />

      <main className="flex-1 pt-16 pb-8 px-3 sm:pt-20 sm:pb-12 md:pt-24 md:pb-20">
        <div className="container mx-auto w-full px-2 sm:px-4 md:max-w-7xl">
          {isLogin ? (
            // Login Layout - Two Column
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch mt-8">
              {/* Left Column - Login Form */}
              <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border dark:border-slate-800">
                <CardContent className="p-8 sm:p-10 flex flex-col justify-center">
                  <div className="space-y-8">
                    {/* Hirion Logo Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-8">
                        <Building2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                          HIRION
                        </span>
                      </div>
                      <div className="inline-block mb-4 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                        Enterprise Grade
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                        Your next career opportunity awaits.
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                        Sign in to access AI-powered job matching, showcase your
                        verified skills, and connect with top employers seeking
                        talent like you.
                      </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                        >
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                          <Input
                            id="email"
                            className="pl-12 h-12 text-base border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                          <Input
                            id="password"
                            className="pl-12 pr-12 h-12 text-base border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors min-h-0 min-w-0"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            aria-pressed={showPassword}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Link
                          to="/employer-login"
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          Employer Login →
                        </Link>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-green-600 dark:bg-green-700 text-white font-semibold rounded-lg transition-all text-base shadow-lg hover:shadow-xl hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-70"
                        disabled={isLoadingLogin}
                      >
                        {isLoadingLogin ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...{" "}
                          </>
                        ) : (
                          <>Login</>
                        )}
                      </Button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm pt-2 sm:pt-3">
                      <span className="text-slate-600 dark:text-slate-400">
                        Don't have an account?{" "}
                      </span>
                      <button
                        type="button"
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
                        onClick={() => setIsLogin(false)}
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Features */}
              <div className="hidden lg:flex flex-col justify-between py-4">
                <div className="space-y-6">
                  {/* Main Headline */}
                  <div>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                      Get discovered. Get hired. Grow your career.
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                      Stand out with AI-verified skills, get matched to
                      opportunities that fit, and access career growth tools
                      designed for top talent.
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      <Zap className="h-4 w-4" />
                      AI technical scoring (0-100)
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      Smart job matching
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                      <Target className="h-4 w-4" />
                      Career growth tools
                    </div>
                  </div>

                  {/* Feature Cards Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {/* Feature 1 */}
                    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          AI technical fit score
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                        Showcase your 0-100 skill score from coding tests and
                        real-world assessments to stand out to employers.
                      </p>
                    </Card>

                    {/* Feature 2 */}
                    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          Smart job matching
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                        Get matched to roles that fit your skills, experience
                        level, and career goals across permanent, contract &
                        freelance positions.
                      </p>
                    </Card>

                    {/* Feature 3 */}
                    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          Career growth tools
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                        Access career path visualization, paid mentorship
                        opportunities, and continuous upskilling to advance your
                        career.
                      </p>
                    </Card>

                    {/* Feature 4 */}
                    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <Award className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          Verified skills badge
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                        Earn validation through assessments and let your proven
                        expertise speak louder than any resume.
                      </p>
                    </Card>
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        50%
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Faster interview callbacks
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        3x
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        More relevant job matches
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        100%
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Skills verified, credibility proven
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom tagline */}
              </div>
            </div>
          ) : (
            // Sign Up Layout - Keep original with dark mode & mobile responsiveness
            <Card className="shadow-2xl border-0 overflow-hidden bg-white dark:bg-slate-900 my-8">
              <CardHeader className="space-y-2 text-center bg-gradient-to-br from-primary to-primary/80 dark:from-primary/80 dark:to-primary/60 text-primary-foreground p-6 sm:p-8">
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm md:text-base">
                  {role === "candidate"
                    ? "Join HIRION to find your dream job"
                    : "Post jobs and find top talent"}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
                  <Button
                    type="button"
                    variant={role === "candidate" ? "default" : "outline"}
                    onClick={() => setRole("candidate")}
                    className="w-full py-5 sm:py-6 text-xs sm:text-sm md:text-base font-medium transition-all hover:scale-[1.02] dark:border-slate-700"
                  >
                    <User className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                    Job Seeker
                  </Button>
                  <Button
                    type="button"
                    variant={role === "employer" ? "default" : "outline"}
                    onClick={() => setRole("employer")}
                    className="w-full py-5 sm:py-6 text-xs sm:text-sm md:text-base font-medium transition-all hover:scale-[1.02] dark:border-slate-700"
                  >
                    <Building2 className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                    Employer
                  </Button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* Common Fields */}

                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="firstName"
                          className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="lastName"
                          className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="email"
                          className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          placeholder="john@example.com"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="password"
                          className="pl-10 sm:pl-11 pr-10 sm:pr-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors min-h-0 min-w-0"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          aria-pressed={showPassword}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 sm:h-5 w-4 sm:w-5" />
                          ) : (
                            <Eye className="h-4 sm:h-5 w-4 sm:w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Location
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="location"
                          className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          placeholder="New York, NY"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Candidate-specific Fields */}
                    {role === "candidate" && (
                      <>
                        <div className="space-y-2">
                          <Label
                            htmlFor="availability"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Availability
                          </Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                              id="availability"
                              className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                              placeholder="Full-time, Part-time, etc."
                              value={availability}
                              onChange={(e) => setAvailability(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="yearsExperience"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Years of Experience
                          </Label>
                          <div className="relative">
                            <Award className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                              id="yearsExperience"
                              className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                              placeholder="5"
                              type="number"
                              min="0"
                              max="70"
                              value={yearsExperience}
                              onChange={(e) =>
                                setYearsExperience(Number(e.target.value))
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label
                            htmlFor="skills"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Skills
                          </Label>
                          <div className="relative">
                            <Target className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                              id="skills"
                              className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                              placeholder="React, TypeScript, Node.js (comma separated)"
                              value={skills}
                              onChange={(e) => setSkills(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label
                            htmlFor="bio"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Short Bio
                          </Label>
                          <textarea
                            id="bio"
                            className="w-full min-h-[100px] rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-background px-3 py-2 text-xs sm:text-base ring-offset-background placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell us about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}

                    {/* Employer-specific Fields */}
                    {role === "employer" && (
                      <>
                        <div className="space-y-2">
                          <Label
                            htmlFor="companyName"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Company Name
                          </Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                              id="companyName"
                              className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                              placeholder="Acme Corp"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="industry"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Industry
                          </Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                              id="industry"
                              className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                              placeholder="Technology, Finance, etc."
                              value={industry}
                              onChange={(e) => setIndustry(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="companySize"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Company Size
                          </Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                              id="companySize"
                              className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                              placeholder="51-200 employees"
                              value={companySize}
                              onChange={(e) => setCompanySize(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="website"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Website
                          </Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                              type="url"
                              id="website"
                              className="pl-10 sm:pl-11 h-10 sm:h-12 text-xs sm:text-base dark:bg-slate-800 dark:text-white dark:border-slate-700"
                              placeholder="https://example.com"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label
                            htmlFor="description"
                            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                          >
                            Company Description
                          </Label>
                          <textarea
                            id="description"
                            className="w-full min-h-[100px] rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white bg-background px-3 py-2 text-xs sm:text-base ring-offset-background placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell us about your company..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="sm:pt-2 md:pt-4">
                    <Button
                      type="submit"
                      className="w-full h-10 sm:h-12 text-xs sm:text-sm md:text-base font-medium transition-all hover:scale-[1.02] shadow-lg dark:hover:opacity-90"
                      disabled={
                        isLoadingEmployer ||
                        isLoadingCandidate ||
                        isLoadingLogin
                      }
                    >
                      {isLoadingEmployer || isLoadingCandidate ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>Create Account</>
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-xs sm:text-sm pt-2 md:pt-3">
                    <span className="text-slate-600 dark:text-slate-400">
                      {isLogin
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    </span>
                    <button
                      type="button"
                      className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 font-semibold transition-colors"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
