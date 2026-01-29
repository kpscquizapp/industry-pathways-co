import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  User,
  Users,
  Mail,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  Briefcase,
  DollarSign,
  Upload
} from "lucide-react";
import { toast } from "sonner";

const ContractorRegistration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'contractor' | 'bench'>('contractor');
  
  // Contractor form state
  const [contractorForm, setContractorForm] = useState({
    fullName: "",
    primarySkill: "",
    workEmail: "",
    availability: ""
  });

  // Bench form state
  const [benchForm, setBenchForm] = useState({
    companyName: "",
    resourceName: "",
    primarySkill: "",
    billingRate: ""
  });

  const handleContractorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile created successfully!", {
      description: "Welcome to HIRION! Redirecting to your dashboard..."
    });
    setTimeout(() => {
      navigate("/contractor/dashboard");
    }, 1000);
  };

  const handleBenchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bench resource listed!", {
      description: "Your resource is now visible to hiring companies."
    });
    setTimeout(() => {
      navigate("/bench/dashboard");
    }, 1000);
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
              Turn Bench & Contractors<br />
              <span className="text-primary">into Billable Revenue.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              Onboard independent contractors or list your internal bench resources in one place. AI helps you deploy faster and keep everyone billable.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Two Powerful Modes</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Register independent contractors or publish ready-to-deploy bench talent for external projects.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI-Matched Engagements</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Smart matching engine connects your profiles to the right full-time, contract, or short-term work.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Bench-to-Billable</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Reduce idle time with a live marketplace for your bench and individual contractors.
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

      {/* Right Side - Forms */}
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
              Choose how you want to onboard
            </h2>
            <p className="mt-2 text-muted-foreground">
              Register as an individual contractor or list internal bench resources from your company.
            </p>
          </div>

          {/* Tab Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contractor Card */}
            <Card 
              className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                activeTab === 'contractor' 
                  ? 'ring-2 ring-primary shadow-lg shadow-primary/10' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setActiveTab('contractor')}
            >
              <CardContent className="p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Join as Contractor</h3>
                      <p className="text-xs text-muted-foreground">For individual freelancers and independent consultants.</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Solo Profile
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleContractorSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Jane Contractor"
                          value={contractorForm.fullName}
                          onChange={(e) => setContractorForm({ ...contractorForm, fullName: e.target.value })}
                          className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Primary Skill</Label>
                      <div className="relative">
                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g. React Developer"
                          value={contractorForm.primarySkill}
                          onChange={(e) => setContractorForm({ ...contractorForm, primarySkill: e.target.value })}
                          className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Work Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@email.com"
                          value={contractorForm.workEmail}
                          onChange={(e) => setContractorForm({ ...contractorForm, workEmail: e.target.value })}
                          className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Availability</Label>
                      <Select 
                        value={contractorForm.availability} 
                        onValueChange={(v) => setContractorForm({ ...contractorForm, availability: v })}
                      >
                        <SelectTrigger className="h-10 rounded-xl bg-muted/50 border-0 focus:ring-2 focus:ring-primary/20 text-sm">
                          <SelectValue placeholder="Immediately" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediately">Immediately</SelectItem>
                          <SelectItem value="1-week">Within 1 week</SelectItem>
                          <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                          <SelectItem value="1-month">Within 1 month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    Complete Contractor Registration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Bench Resource Card */}
            <Card 
              className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                activeTab === 'bench' 
                  ? 'ring-2 ring-primary shadow-lg shadow-primary/10' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setActiveTab('bench')}
            >
              <CardContent className="p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">List Bench Resource</h3>
                      <p className="text-xs text-muted-foreground">For companies listing internal bench talent.</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Bench Listing
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleBenchSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g. Acme Inc"
                          value={benchForm.companyName}
                          onChange={(e) => setBenchForm({ ...benchForm, companyName: e.target.value })}
                          className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Bench Resource Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="John Doe"
                          value={benchForm.resourceName}
                          onChange={(e) => setBenchForm({ ...benchForm, resourceName: e.target.value })}
                          className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Primary Skill / Role</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Java Developer"
                          value={benchForm.primarySkill}
                          onChange={(e) => setBenchForm({ ...benchForm, primarySkill: e.target.value })}
                          className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Billing Rate (₹ / hour)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="1200"
                          value={benchForm.billingRate}
                          onChange={(e) => setBenchForm({ ...benchForm, billingRate: e.target.value })}
                          className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    List Bench Resource
                    <Upload className="ml-2 h-5 w-5" />
                  </Button>
                </form>
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
