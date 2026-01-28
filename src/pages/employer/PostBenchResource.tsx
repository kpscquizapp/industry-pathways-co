import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload,
  FileText,
  CheckCircle2,
  Lightbulb,
  X,
  User,
  Calendar,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Building2
} from "lucide-react";
import { toast } from "sonner";

const PostBenchResource = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  
  const steps = [
    { number: 1, title: "Company Profile", completed: true },
    { number: 2, title: "Resource Details", current: true },
    { number: 3, title: "Contract Terms", completed: false },
    { number: 4, title: "Review & Publish", completed: false }
  ];

  const [formData, setFormData] = useState({
    resourceName: "John D.",
    currentRole: "",
    totalExperience: "",
    employeeId: "",
    skills: ["Java Spring Boot", "Microservices", "Kubernetes", "PostgreSQL"] as string[],
    professionalSummary: "",
    hourlyRate: "",
    currency: "USD - US Dollar",
    availableFrom: "",
    minimumDuration: "1 Month",
    locationPreferences: {
      remote: true,
      hybrid: true,
      onSite: false
    },
    requireNonSolicitation: true,
    resumeFile: null as File | null
  });
  
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved", {
      description: "You can continue later from where you left off."
    });
  };

  const handleProceed = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Bench resource posted successfully!", {
        description: "Your resource is now visible to potential clients."
      });
      navigate("/employer-dashboard/talent-marketplace");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Title Card */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-6">
                <h1 className="text-xl font-bold text-slate-800 mb-6">Post Bench Resource</h1>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
                        step.completed 
                          ? "bg-blue-500 text-white shadow-md shadow-blue-500/30" 
                          : step.current 
                            ? "bg-blue-100 text-blue-600 ring-2 ring-blue-500 ring-offset-2" 
                            : "bg-slate-100 text-slate-400"
                      }`}>
                        {step.completed ? <CheckCircle2 className="h-4 w-4" /> : step.number}
                      </div>
                      <span className={`text-sm font-medium ${
                        step.current ? "text-blue-600" : step.completed ? "text-slate-700" : "text-slate-400"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Main Form */}
          <div className="space-y-6">
            {/* Policy Alert */}
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-sm text-orange-800">
                  <strong>Bench Policy:</strong> Resources listed here must be on your company payroll. Profiles can be anonymized until an interview request is accepted.
                </p>
              </CardContent>
            </Card>

            {/* Resource Basic Info */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
              <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Resource Basic Info</CardTitle>
                    <p className="text-sm text-slate-500">Details about the professional you want to deploy</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Resource Name (Internal)</Label>
                    <Input
                      placeholder="John D."
                      value={formData.resourceName}
                      onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <p className="text-xs text-slate-400">Will be shown as "John D." publicly</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Current Role / Designation</Label>
                    <Input
                      placeholder="e.g. Senior Java Developer"
                      value={formData.currentRole}
                      onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Total Experience (Years)</Label>
                    <Select value={formData.totalExperience} onValueChange={(v) => setFormData({ ...formData, totalExperience: v })}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {["0-1", "1-3", "3-5", "5-8", "8-10", "10+"].map((exp) => (
                          <SelectItem key={exp} value={exp}>{exp} years</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Employee ID / Ref Code</Label>
                    <Input
                      placeholder="Optional internal tracking code"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Technical Skills *</Label>
                  <Input
                    placeholder="Type skill and press enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        className="px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer shadow-sm shadow-blue-500/30 transition-all"
                      >
                        {skill}
                        <X 
                          className="h-3 w-3 ml-2 cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => removeSkill(skill)} 
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Professional Summary</Label>
                  <Textarea
                    placeholder="Brief summary of their expertise and key projects..."
                    value={formData.professionalSummary}
                    onChange={(e) => setFormData({ ...formData, professionalSummary: e.target.value })}
                    rows={4}
                    className="rounded-xl resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Availability & Contract Terms */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
              <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Availability & Contract Terms</CardTitle>
                    <p className="text-sm text-slate-500">Define the commercials and deployment conditions</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Hourly Rate (Client Billable)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <Input
                        placeholder="e.g. 45"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="pl-9 pr-14 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">/ hr</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Currency</Label>
                    <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["USD - US Dollar", "EUR - Euro", "GBP - British Pound", "INR - Indian Rupee"].map((curr) => (
                          <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Available From</Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="date"
                        placeholder="dd-mm-yyyy"
                        value={formData.availableFrom}
                        onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                        className="pl-12 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Minimum Contract Duration</Label>
                    <Select value={formData.minimumDuration} onValueChange={(v) => setFormData({ ...formData, minimumDuration: v })}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1 Month", "3 Months", "6 Months", "12 Months"].map((dur) => (
                          <SelectItem key={dur} value={dur}>{dur}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Deployment Location Preference</Label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: "remote", label: "Remote", checked: formData.locationPreferences.remote },
                      { id: "hybrid", label: "Hybrid", checked: formData.locationPreferences.hybrid },
                      { id: "onSite", label: "On-site", checked: formData.locationPreferences.onSite }
                    ].map((loc) => (
                      <div key={loc.id} className="flex items-center space-x-2 bg-slate-50 px-4 py-2.5 rounded-xl">
                        <Checkbox 
                          id={loc.id}
                          checked={loc.checked}
                          onCheckedChange={(checked) => setFormData({
                            ...formData,
                            locationPreferences: { ...formData.locationPreferences, [loc.id]: checked }
                          })}
                          className="border-slate-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <label htmlFor={loc.id} className="text-sm cursor-pointer text-slate-600 font-medium">{loc.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <Checkbox 
                    id="non-solicitation"
                    checked={formData.requireNonSolicitation}
                    onCheckedChange={(checked) => setFormData({ ...formData, requireNonSolicitation: checked as boolean })}
                    className="mt-0.5 border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <div>
                    <label htmlFor="non-solicitation" className="text-sm font-semibold text-slate-800 cursor-pointer">
                      Require Non-Solicitation Agreement
                    </label>
                    <p className="text-xs text-slate-500 mt-1">
                      Client cannot hire this resource permanently for 12 months.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
              <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 p-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Upload Anonymized Resume (PDF)</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Click to upload resume</p>
                    <p className="text-xs text-slate-400 mt-2">Max file size 5MB. Please remove contact details.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-2 pb-8">
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
                className="px-8 h-12 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"
              >
                Save Draft
              </Button>
              <Button 
                onClick={handleProceed}
                className="px-10 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
              >
                Proceed to Review
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBenchResource;