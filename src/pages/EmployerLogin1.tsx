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
  Sparkles
} from "lucide-react";
import { useLoginMutation } from "@/app/queries/loginApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/slices/userAuth";
import { toast } from "sonner";

const EmployerLogin1 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setUser(response));
      toast.success("Login successful!");
      navigate("/employer/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-xl border-border rounded-2xl overflow-hidden bg-card">
            <CardContent className="p-8 sm:p-10">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
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
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-border bg-background"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
                        className="pl-12 h-12 rounded-xl border-border bg-background"
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

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/employer-signup1" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
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
