import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  Sparkles,
  X,
  User,
  Linkedin,
  Github,
  Plus,
  ArrowRight,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

const ContractorRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(2);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    experience: "",
    bio: "",
    skills: ["Java", "Spring Boot", "Microservices", "Docker"] as string[],
    workMode: "contract / freelance",
    hourlyRate: "45",
    preferredDuration: "",
    availability: "Immediately available",
    linkedinUrl: "",
    githubUrl: "",
    resumeFile: null as File | null,
    photoFile: null as File | null
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

  const handleSubmit = () => {
    toast.success("Profile completed successfully!", {
      description: "Your contractor profile is now live."
    });
    navigate("/marketplace");
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved", {
      description: "You can continue later from where you left off."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HIRION</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`w-2 h-2 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-primary">Step {step} of {totalSteps}</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            {/* Left Sidebar */}
            <div className="space-y-5">
              {/* Photo Upload */}
              <Card className="border-border/50 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block">
                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-4 border-dashed border-primary/30 hover:border-primary transition-all cursor-pointer group">
                      <Camera className="h-10 w-10 text-primary/60 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Plus className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="font-semibold text-foreground mt-4 mb-1">Upload Photo</p>
                  <p className="text-xs text-muted-foreground">Professional headshots work best</p>
                </CardContent>
              </Card>

              {/* Resume Upload */}
              <Card className="border-border/50 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">Resume</span>
                  </div>
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                    <Upload className="h-8 w-8 text-primary/60 mx-auto mb-2 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-medium text-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX (Max 5MB)</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">Auto-fill from resume</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">Skill extraction active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Profile Benefits</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-xs text-muted-foreground">Get matched with 500+ companies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-xs text-muted-foreground">AI-powered skill verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-xs text-muted-foreground">Priority visibility for 30 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Form */}
            <div className="space-y-5">
              {/* Personal Details */}
              <Card className="border-border/50 rounded-2xl overflow-hidden shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-border/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">First Name</Label>
                      <Input
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="h-11 rounded-xl border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Last Name</Label>
                      <Input
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="h-11 rounded-xl border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Job Title</Label>
                      <Input
                        placeholder="e.g. Senior Java Developer"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="h-11 rounded-xl border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Total Experience</Label>
                      <Select value={formData.experience} onValueChange={(v) => setFormData({ ...formData, experience: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-border/50">
                          <SelectValue placeholder="5-8 years" />
                        </SelectTrigger>
                        <SelectContent>
                          {["0-1 years", "1-3 years", "3-5 years", "5-8 years", "8-10 years", "10+ years"].map((exp) => (
                            <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Summary / Bio</Label>
                    <Textarea
                      placeholder="Briefly describe your professional background..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      className="rounded-xl resize-none border-border/50 focus:border-primary"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Expertise */}
              <Card className="border-border/50 rounded-2xl overflow-hidden shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-border/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Add Skills (Type and press Enter)</Label>
                    <Input
                      placeholder="e.g. React, Spring Boot, AWS"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-11 rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-default shadow-sm"
                      >
                        {skill}
                        <X 
                          className="h-3 w-3 ml-2 cursor-pointer hover:text-destructive" 
                          onClick={() => removeSkill(skill)} 
                        />
                      </Badge>
                    ))}
                    <button 
                      onClick={() => document.querySelector<HTMLInputElement>('input[placeholder*="React"]')?.focus()}
                      className="px-3 py-1.5 rounded-full text-sm text-primary border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add more
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Work Preferences & Availability */}
              <Card className="border-border/50 rounded-2xl overflow-hidden shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-border/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Work Preferences & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preferred Work Mode</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "full-time", label: "Full-Time" },
                        { id: "contract / freelance", label: "Contract / Freelance" },
                        { id: "internship", label: "Internship" }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, workMode: mode.id })}
                          className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                            formData.workMode === mode.id
                              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                              : "bg-white dark:bg-slate-800 text-foreground border-border/50 hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.workMode === "contract / freelance" && (
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 space-y-4">
                      <p className="text-sm font-semibold text-primary flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Contract & Freelance Settings
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Hourly Rate (USD)</Label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-muted-foreground font-medium">$</span>
                            <Input
                              placeholder="45"
                              value={formData.hourlyRate}
                              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                              className="pl-8 h-11 rounded-xl border-border/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Preferred Duration</Label>
                          <Select value={formData.preferredDuration} onValueChange={(v) => setFormData({ ...formData, preferredDuration: v })}>
                            <SelectTrigger className="h-11 rounded-xl border-border/50">
                              <SelectValue placeholder="Any duration" />
                            </SelectTrigger>
                            <SelectContent>
                              {["Any duration", "1-3 months", "3-6 months", "6-12 months", "12+ months"].map((dur) => (
                                <SelectItem key={dur} value={dur}>{dur}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Availability to Join</Label>
                    <Select value={formData.availability} onValueChange={(v) => setFormData({ ...formData, availability: v })}>
                      <SelectTrigger className="h-11 rounded-xl border-border/50">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Immediately available", "1 week notice", "2 weeks notice", "1 month notice", "2+ months notice"].map((avail) => (
                          <SelectItem key={avail} value={avail}>{avail}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.availability === "Immediately available" && (
                      <button className="text-sm text-primary font-semibold flex items-center gap-1.5 mt-2 hover:underline">
                        <Sparkles className="h-4 w-4" />
                        Mark as Immediately Available
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Online Presence */}
              <Card className="border-border/50 rounded-2xl overflow-hidden shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-border/50">
                  <CardTitle className="text-lg font-semibold">Online Presence</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                        LinkedIn URL
                      </Label>
                      <Input
                        placeholder="linkedin.com/in/username"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="h-11 rounded-xl border-border/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub / Portfolio
                      </Label>
                      <Input
                        placeholder="github.com/username"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="h-11 rounded-xl border-border/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-2 pb-4">
                <Button 
                  variant="outline" 
                  onClick={handleSaveDraft}
                  className="px-6 h-12 rounded-xl border-2 hover:bg-muted"
                >
                  Save as Draft
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="px-8 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                >
                  Complete Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractorRegistration;