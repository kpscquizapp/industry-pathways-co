import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Lock, 
  ArrowRight,
  Sparkles,
  Mail
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/slices/userAuth";
import { toast } from "sonner";

const EmployerLogin1 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - accept any credentials
    setTimeout(() => {
      const mockUser = {
        accessToken: "mock-token-" + Date.now(),
        refreshToken: "mock-refresh-" + Date.now(),
        user: {
          id: "1",
          uuid: "mock-uuid",
          email: email,
          firstName: email.split("@")[0],
          lastName: "User",
          role: "employer",
          admin: false
        }
      };
      
      dispatch(setUser(mockUser));
      toast.success("Login successful!");
      navigate("/employer/dashboard");
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-xl border border-border rounded-2xl overflow-hidden bg-card">
            <CardContent className="p-8 sm:p-10">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                    <Sparkles className="h-4 w-4" />
                    Employer Login
                  </span>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground text-sm">
                    Sign in to access your employer dashboard
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all text-base shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?
                  </p>
                  <Link to="/employer-signup1" className="text-primary hover:underline font-medium text-sm">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default EmployerLogin1;
