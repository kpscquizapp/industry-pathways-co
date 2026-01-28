import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Mail, 
  Lock, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Zap,
  Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const EmployerSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [useCase, setUseCase] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const useCases = [
    { id: "fulltime", label: "Full-time hiring" },
    { id: "contract", label: "Contract & gig talent" },
    { id: "bench", label: "Bench monetization" }
  ];

  const toggleUseCase = (id: string) => {
    setUseCase(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signup(email, password, "Employer", "employer");
      if (success) {
        toast.success("Account created successfully!");
        navigate("/employer-dashboard");
      } else {
        toast.error("Email already registered");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: CheckCircle2, label: "AI-verified skill scores", highlight: true },
    { icon: Target, label: "Bench to billable in days", highlight: false },
    { icon: Sparkles, label: "Automated screening & interviews", highlight: false },
    { icon: TrendingUp, label: "Monetize internal talent", highlight: false }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-8">
            {/* Left Column - Features */}
            <div className="space-y-6 order-2 lg:order-1">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-foreground">HIRION</span>
                    <p className="text-xs text-muted-foreground">AI Talent & Bench Marketplace</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                  <Sparkles className="h-4 w-4" />
                  Employer Sign Up
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Turn Your Bench Into Billable Talent
                </h1>
                <p className="text-muted-foreground text-lg">
                  AI verifies skills. Companies deploy instantly. You earn from idle resources across full-time and contract hiring.
                </p>
              </div>

              {/* Feature Pills Grid */}
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                      feature.highlight 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-white/80 dark:bg-slate-800/80 border-border/50"
                    }`}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.highlight ? "" : "text-primary"}`} />
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-50 dark:bg-slate-800/50 border-border/30 rounded-xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">TIME TO HIRE</p>
                  <p className="text-3xl font-bold text-primary">-40%</p>
                  <p className="text-xs text-muted-foreground mt-1">with AI interview & scoring</p>
                </Card>
                <Card className="bg-slate-50 dark:bg-slate-800/50 border-border/30 rounded-xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">BENCH UTILIZATION</p>
                  <p className="text-3xl font-bold text-green-600">↑ 30%</p>
                  <p className="text-xs text-muted-foreground mt-1">turn idle talent into revenue</p>
                </Card>
              </div>
            </div>

            {/* Right Column - Signup Form */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 order-1 lg:order-2">
              <CardContent className="p-8 sm:p-10">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Create Employer Account</h2>
                    <p className="text-muted-foreground text-sm">
                      Access AI hiring, deployments, and bench monetization in one secure workspace.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Company Email</Label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 h-12 rounded-xl border-border"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-size" className="text-sm font-medium">Company Size (Optional)</Label>
                        <div className="relative">
                          <Users className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="company-size"
                            type="text"
                            placeholder="e.g. 50-200"
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                            className="pl-12 h-12 rounded-xl border-border"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Primary Use Case</Label>
                      <div className="flex flex-wrap gap-2">
                        {useCases.map((uc) => (
                          <button
                            key={uc.id}
                            type="button"
                            onClick={() => toggleUseCase(uc.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              useCase.includes(uc.id)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {uc.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all text-base shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : (
                        <>
                          Create Employer Account
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl border-2"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Or request a demo of the employer console
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/employer-login" className="text-primary hover:underline font-medium">
                      Log in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployerSignup;