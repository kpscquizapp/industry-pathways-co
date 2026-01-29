import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  User,
  ArrowRight,
  Sparkles,
  Upload,
  CheckCircle2
} from "lucide-react";

const ContractorRegistration = () => {
  const navigate = useNavigate();

  const handleContractorContinue = () => {
    navigate("/contractor/dashboard");
  };

  const handleBenchContinue = () => {
    navigate("/bench/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary/15 rounded-full blur-2xl" />
        
        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">HIRION</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Contractors & Bench,<br />
              <span className="text-primary">One Smart Entry Point.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              Pick the right track for yourself or your team. Join as an independent contractor or list internal bench talent in a dedicated marketplace.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Independent Talent</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Build a verified contractor profile with skills, rate, and availability visible to hiring teams.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Bench Monetization</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Publish ready-to-deploy employees from your bench and keep them billable on external projects.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Matching</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  AI surfaces the best contract, part-time and short-term roles for each profile automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground">
            Designed for Contract & Bench Monetization
          </p>
        </div>
      </div>

      {/* Right Side - Registration Options */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HIRION</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              How would you like to register?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Choose a track to continue. You can always add the other mode later from your dashboard.
            </p>
          </div>

          {/* Registration Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Join as Contractor Card */}
            <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Join as Contractor</h3>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Solo Profile
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  For freelancers, independent consultants and gig experts.
                </p>

                {/* Benefits List */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Highlight skills, rate (₹/hour or ₹/day) & availability.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Get AI-matched to full-time, contract & part-time work.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Control profile visibility and who can contact you.</span>
                  </li>
                </ul>

                <Button 
                  onClick={handleContractorContinue}
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Continue Contractor Registration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* List Bench Resource Card */}
            <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">List Bench Resource</h3>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Bench Listing
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  For companies listing idle internal employees.
                </p>

                {/* Benefits List */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Add employee details, role, skills & bill rate in ₹.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Showcase availability window & non-compete notes.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Track which bench profiles are deployed via Hirion.</span>
                  </li>
                </ul>

                <Button 
                  onClick={handleBenchContinue}
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Continue Bench Resource Listing
                  <Upload className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Login Link */}
          <p className="text-center mt-8 text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Go to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractorRegistration;
