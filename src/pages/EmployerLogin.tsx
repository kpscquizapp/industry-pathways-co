import React, { useState, useEffect, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Zap,
  Target,
  Users,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const EmployerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "employer") {
      navigate("/employer-dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, "employer");
      if (success) {
        toast.success("Welcome back!");
        navigate("/employer-dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      id: useId(),
      icon: Zap,
      title: "AI technical fit score",
      description:
        "Skip up to three rounds with 0-100 fit scores from coding tests and real-world assessments.",
      color: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    },
    {
      id: useId(),
      icon: Target,
      title: "Bench-to-billable",
      description:
        "List idle talent, get matched to contract demand, and turn bench into a profit center.",
      color:
        "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    },
    {
      id: useId(),
      icon: Users,
      title: "AI skill filtering",
      description:
        "Only validated experts surface to your recruiters across permanent, contract & project roles.",
      color:
        "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    },
    {
      id: useId(),
      icon: TrendingUp,
      title: "Growth for top 1% talent",
      description:
        "Career path visualization, paid mentorship, and continuous upskilling keep your best engaged.",
      color:
        "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
    },
  ];

  const stats = [
    { id: useId(), value: "40%", label: "Reduction in time-to-hire" },
    { id: useId(), value: "3x", label: "Faster deployment from bench" },
    { id: useId(), value: "100%", label: "Skills verified before interview" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-8">
            {/* Left Column - Login Form */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <CardContent className="p-8 sm:p-10">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xl font-bold text-foreground">
                        HIRION
                      </span>
                      <span className="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Enterprise Grade
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                      EMPLOYER LOGIN
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
                      Move beyond resumes.
                      <br />
                      Deploy verified talent.
                    </h1>
                    <p className="text-muted-foreground">
                      Sign in to manage hiring, deployments, and bench
                      monetization from a single, AI-enabled employer workspace.
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Work email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-12 rounded-xl border-border"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 h-12 rounded-xl border-border"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="keep-signed-in"
                          className="min-h-0 min-w-0"
                          checked={keepSignedIn}
                          onCheckedChange={(checked) =>
                            setKeepSignedIn(checked as boolean)
                          }
                        />
                        <label
                          htmlFor="keep-signed-in"
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          Keep me signed in
                        </label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all text-base shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Signing in..."
                      ) : (
                        <>
                          Login to Employer Dashboard
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl border-2"
                      onClick={() => navigate("/employer-signup")}
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Request employer access
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Features */}
            <div className="space-y-6">
              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  AI technical scoring (0-100)
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                  <Target className="h-4 w-4" />
                  Bench-to-billable marketplace
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  Career growth ecosystem
                </div>
              </div>

              {/* Main Headline */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 leading-tight">
                  Hire faster. Deploy smarter. Monetize your bench.
                </h2>
                <p className="text-muted-foreground text-lg">
                  Move beyond resume matching. Deploy verified talent with
                  AI-driven scoring, bench monetization, and career growth tools
                  built for modern staffing and enterprises.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <Card
                    key={feature.id}
                    className="bg-white/80 dark:bg-slate-800/80 border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Stats */}
              <Card className="bg-white/60 dark:bg-slate-800/60 border-border/30 rounded-xl p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {stats.map((stat) => (
                    <div key={stat.id}>
                      <p className="text-2xl lg:text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <p className="text-sm text-muted-foreground text-center">
                From resumes to real results. From hiring to deployment.
              </p>
            </div>
          </div>

          {/* Candidate Login Link */}
          <div className="mt-8 text-center">
            <Card className="inline-block border-primary/20 bg-primary/5 rounded-xl">
              <CardContent className="py-4 px-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Looking for a job?
                </p>
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2"
                >
                  Candidate Login <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployerLogin;
