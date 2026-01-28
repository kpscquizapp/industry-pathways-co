import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  MapPin,
  Zap,
  Brain,
  Send,
  Save,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Settings,
  Briefcase,
  Code,
  MessageSquare,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreateJobMutation } from "@/app/queries/jobApi";

const STEPS = [
  { id: 1, title: "Job Details", icon: FileText },
  { id: 2, title: "Skills & Requirements", icon: Zap },
  { id: 3, title: "Skill Validation", icon: Code },
  { id: 4, title: "AI Interview", icon: Brain },
  { id: 5, title: "Publish", icon: Send },
];

const CreateJob = () => {
  const [createJob, { isLoading: createJobLoading }] = useCreateJobMutation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [niceToHaveInput, setNiceToHaveInput] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Job Details
    jobTitle: "",
    jobDescription: "",
    employmentType: "",
    experienceLevel: "",
    workLocation: "",
    salaryMin: "",
    salaryMax: "",

    // Step 2: Skills & Requirements
    requiredSkills: [] as { name: string; level: string }[],
    niceToHaveSkills: [] as string[],

    // Step 3: Skill Validation
    enableSkillTest: false,
    testType: "",
    difficultyLevel: "",
    timeLimit: "60",
    autoRejectScore: 50,

    // Step 4: AI Interview
    enableAIInterview: false,
    interviewType: "",
    evaluateCommunication: true,
    evaluateProblemSolving: true,
    evaluateTechnicalDepth: true,
    autoAdvanceScore: 70,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      updateFormData("requiredSkills", [
        ...formData.requiredSkills,
        { name: skillInput.trim(), level: "Intermediate" },
      ]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    updateFormData(
      "requiredSkills",
      formData.requiredSkills.filter((_, i) => i !== index),
    );
  };

  const updateSkillLevel = (index: number, level: string) => {
    const updated = [...formData.requiredSkills];
    updated[index].level = level;
    updateFormData("requiredSkills", updated);
  };

  const addNiceToHave = () => {
    if (
      niceToHaveInput.trim() &&
      !formData.niceToHaveSkills.includes(niceToHaveInput.trim())
    ) {
      updateFormData("niceToHaveSkills", [
        ...formData.niceToHaveSkills,
        niceToHaveInput.trim(),
      ]);
      setNiceToHaveInput("");
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = () => {
    toast.success("Job saved as draft");
  };

  const handlePreview = () => {
    toast.info("Preview functionality coming soon");
  };

  const buildCreateJobPayload = () => {
    return {
      title: formData.jobTitle,
      description: formData.jobDescription,

      // category: "Engineering",
      // role: "Frontend Engineer",

      // location: formData.workLocation,
      // city: "Bangalore",
      // state: "Karnataka",
      // country: "India",

      employmentType: formData.employmentType,

      workMode: formData.workLocation, // remote | hybrid | onsite

      experienceLevel: formData.experienceLevel,
      // maxExperience: formData.experienceLevel === "senior" ? 8 : 7,
      // fresherAllowed: formData.experienceLevel === "entry",

      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
      // salaryType: "fixed-range",
      // currency: "INR",

      // numberOfOpenings: 1,
      // duration: 12,
      // mltipleLocationsAllowed: false,

      // jobVisibility: "public",
      // urgency: "normal",

      enableAiTalentMatching: true,
      aiMatchingEnabled: true,
      autoScreenCandidates: true,

      enableSkillAssessment: formData.enableSkillTest,

      testType: formData.testType,
      difficultyLevel: formData.difficultyLevel,
      timeLimit: formData.timeLimit,
      autoRejectBelowScore: formData.autoRejectScore,
      interviewType: formData.interviewType,
      aiEvaluationCriteria: [
        formData.evaluateCommunication && "Communication",
        formData.evaluateProblemSolving && "Problem Solving",
        formData.evaluateTechnicalDepth && "Technical Depth",
      ].filter(Boolean),

      autoAdvanceScore: formData.autoAdvanceScore,

      scheduleAIInterviews: formData.enableAIInterview,

      // healthInsurance: true,
      // ESOPs: true,
      // performanceBonus: true,
      // remoteAllowance: formData.workLocation === "remote",

      // educationQualification: "B.Tech / B.E",
      // languagesKnown: "English, Hindi",

      // equalOpportunityEmployer: true,
      // dataPrivacyPolicies: true,
      // termsAndConditions: true,

      expiresAt: new Date(
        new Date().setMonth(new Date().getMonth() + 2),
      ).toISOString(),

      skills: formData.requiredSkills.map((skill) => ({
        name: skill.name,
        proficiencyLevel: skill.level.toLowerCase(),
      })),
      niceToHaveSkills: formData.niceToHaveSkills.map((skill) => ({
        name: skill,
        // proficiencyLevel: "beginner",
      })),
    };
  };

  // const handlePublish = () => {
  //   toast.success('Job posted successfully!');
  //   setTimeout(() => navigate('/employer-dashboard/job-board'), 1500);
  // };

  const handlePublish = async () => {
    try {
      const payload = buildCreateJobPayload();

      await createJob(payload).unwrap();

      toast.success("Job posted successfully!");
      navigate("/employer-dashboard/job-board");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create job");
    }
  };

  // Step 1: Job Details
  const renderJobDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <FileText className="h-5 w-5" />
          Job Details
        </CardTitle>
        <CardDescription>Basic information about the position</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>
            Job Title <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g. Senior Frontend Developer"
            value={formData.jobTitle}
            onChange={(e) => updateFormData("jobTitle", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Job Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            placeholder="Describe the role, responsibilities, and expectations..."
            className="min-h-[150px]"
            value={formData.jobDescription}
            onChange={(e) => updateFormData("jobDescription", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Employment Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.employmentType}
              onValueChange={(v) => updateFormData("employmentType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>
              Experience Level <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(v) => updateFormData("experienceLevel", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>
              Work Location <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.workLocation}
              onValueChange={(v) => updateFormData("workLocation", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Min Salary</Label>
            <Input
              placeholder="₹ 8,00,000"
              value={formData.salaryMin}
              onChange={(e) => updateFormData("salaryMin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Salary</Label>
            <Input
              placeholder="₹ 15,00,000"
              value={formData.salaryMax}
              onChange={(e) => updateFormData("salaryMax", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 2: Skills & Requirements
  const renderSkillsRequirements = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Zap className="h-5 w-5" />
          Skills & Requirements
        </CardTitle>
        <CardDescription>
          Define the skills needed for this role
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>
            Required Skills <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill and press Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              className="flex-1"
            />
            <Button type="button" onClick={addSkill} variant="outline">
              Add
            </Button>
          </div>

          {formData.requiredSkills.length > 0 && (
            <div className="space-y-2 mt-3">
              {formData.requiredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <Badge className="bg-primary text-primary-foreground">
                    {skill.name}
                  </Badge>
                  <Select
                    value={skill.level}
                    onValueChange={(v) => updateSkillLevel(index, v)}
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeSkill(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label>Nice-to-Have Skills</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Optional skills..."
              value={niceToHaveInput}
              onChange={(e) => setNiceToHaveInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addNiceToHave())
              }
              className="flex-1"
            />
            <Button type="button" onClick={addNiceToHave} variant="outline">
              Add
            </Button>
          </div>
          {formData.niceToHaveSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.niceToHaveSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="gap-1 py-1.5">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      updateFormData(
                        "niceToHaveSkills",
                        formData.niceToHaveSkills.filter((_, i) => i !== index),
                      )
                    }
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Step 3: Skill Validation
  const renderSkillValidation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Code className="h-5 w-5" />
          Automated Skill Validation
        </CardTitle>
        <CardDescription>
          Configure technical assessments for candidates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Enable Skill Test</Label>
            <p className="text-sm text-muted-foreground">
              Automatically test candidates' technical skills
            </p>
          </div>
          <Switch
            checked={formData.enableSkillTest}
            onCheckedChange={(checked) =>
              updateFormData("enableSkillTest", checked)
            }
          />
        </div>

        {formData.enableSkillTest && (
          <div className="space-y-5 animate-in fade-in-50 slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Test Type</Label>
                <Select
                  value={formData.testType}
                  onValueChange={(v) => updateFormData("testType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coding">Coding Challenge</SelectItem>
                    <SelectItem value="mcq">MCQ Assessment</SelectItem>
                    <SelectItem value="system-design">System Design</SelectItem>
                    <SelectItem value="mixed">Mixed Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={formData.difficultyLevel}
                  onValueChange={(v) => updateFormData("difficultyLevel", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time Limit (minutes)</Label>
              <Input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => updateFormData("timeLimit", e.target.value)}
                className="w-[120px]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Auto-Reject Below Score</Label>
                <span className="text-sm font-medium">
                  {formData.autoRejectScore}%
                </span>
              </div>
              <Slider
                value={[formData.autoRejectScore]}
                onValueChange={(v) => updateFormData("autoRejectScore", v[0])}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Candidates scoring below this threshold will be automatically
                rejected
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Step 4: AI Interview
  const renderAIInterview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Brain className="h-5 w-5" />
          AI Interview Setup
        </CardTitle>
        <CardDescription>
          Configure AI-powered candidate interviews
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Enable AI Interview</Label>
            <p className="text-sm text-muted-foreground">
              Conduct automated interviews with AI evaluation
            </p>
          </div>
          <Switch
            checked={formData.enableAIInterview}
            onCheckedChange={(checked) =>
              updateFormData("enableAIInterview", checked)
            }
          />
        </div>

        {formData.enableAIInterview && (
          <div className="space-y-5 animate-in fade-in-50 slide-in-from-top-2">
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select
                value={formData.interviewType}
                onValueChange={(v) => updateFormData("interviewType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="mixed">
                    Mixed (Technical + Behavioral)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>AI Evaluation Criteria</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="communication"
                    checked={formData.evaluateCommunication}
                    onCheckedChange={(checked) =>
                      updateFormData("evaluateCommunication", checked)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <Label
                      htmlFor="communication"
                      className="cursor-pointer font-normal"
                    >
                      Communication Skills
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="problemSolving"
                    checked={formData.evaluateProblemSolving}
                    onCheckedChange={(checked) =>
                      updateFormData("evaluateProblemSolving", checked)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <Label
                      htmlFor="problemSolving"
                      className="cursor-pointer font-normal"
                    >
                      Problem Solving
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="technicalDepth"
                    checked={formData.evaluateTechnicalDepth}
                    onCheckedChange={(checked) =>
                      updateFormData("evaluateTechnicalDepth", checked)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <Label
                      htmlFor="technicalDepth"
                      className="cursor-pointer font-normal"
                    >
                      Technical Depth
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Auto-Advance Score</Label>
                <span className="text-sm font-medium">
                  {formData.autoAdvanceScore}%
                </span>
              </div>
              <Slider
                value={[formData.autoAdvanceScore]}
                onValueChange={(v) => updateFormData("autoAdvanceScore", v[0])}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Candidates scoring above this will be automatically advanced to
                human interview
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Step 5: Publish
  const renderPublish = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Send className="h-5 w-5" />
          Review & Publish
        </CardTitle>
        <CardDescription>
          Review your job posting before publishing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg">
              {formData.jobTitle || "Untitled Job"}
            </h3>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">
                {formData.employmentType || "Type not set"}
              </Badge>
              <Badge variant="outline">
                {formData.workLocation || "Location not set"}
              </Badge>
              <Badge variant="outline">
                {formData.experienceLevel || "Level not set"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Skill Test</h4>
              <Badge
                variant={formData.enableSkillTest ? "default" : "secondary"}
              >
                {formData.enableSkillTest ? "Enabled" : "Disabled"}
              </Badge>
              {formData.enableSkillTest && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.testType} • {formData.difficultyLevel} •{" "}
                  {formData.timeLimit}min
                </p>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">AI Interview</h4>
              <Badge
                variant={formData.enableAIInterview ? "default" : "secondary"}
              >
                {formData.enableAIInterview ? "Enabled" : "Disabled"}
              </Badge>
              {formData.enableAIInterview && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.interviewType} interview
                </p>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">
              Required Skills ({formData.requiredSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
              {formData.requiredSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills added</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderJobDetails();
      case 2:
        return renderSkillsRequirements();
      case 3:
        return renderSkillValidation();
      case 4:
        return renderAIInterview();
      case 5:
        return renderPublish();
      default:
        return renderJobDetails();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Create Job Posting
        </h1>
        <p className="text-muted-foreground">
          Post a new job with skill tests and AI interviews
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    isActive && "bg-primary-foreground/20",
                    isCompleted && "bg-primary/10",
                    !isActive && !isCompleted && "bg-muted",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {step.title}
                </span>
              </button>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current Step Content */}
      {renderCurrentStep()}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}

            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={createJobLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {createJobLoading ? "Publishing..." : "Publish Job"}
                <Send className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
