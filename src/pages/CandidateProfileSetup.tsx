import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, User, Briefcase, GraduationCap, Award, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUploadResumeMutation, useUpdateProfileMutation } from "@/app/queries/profileApi";

type ProfileStep = "resume" | "personal" | "experience" | "skills" | "complete";

const CandidateProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [uploadResume] = useUploadResumeMutation();
  const [updateProfile] = useUpdateProfileMutation();
  
  const [currentStep, setCurrentStep] = useState<ProfileStep>("resume");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    headline: "",
    summary: "",
    currentRole: "",
    experience: "",
    company: "",
    skills: "",
    education: "",
    certifications: "",
  });

  const steps: { key: ProfileStep; label: string; icon: React.ReactNode }[] = [
    { key: "resume", label: "Resume", icon: <FileText className="w-4 h-4" /> },
    { key: "personal", label: "Personal Info", icon: <User className="w-4 h-4" /> },
    { key: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
    { key: "skills", label: "Skills", icon: <Award className="w-4 h-4" /> },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 5 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxBytes || !allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file up to 5MB.");
      e.target.value = "";
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("resume", file);

    try {
      await uploadResume(formDataUpload).unwrap();
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume. You can try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    const stepOrder: ProfileStep[] = ["resume", "personal", "experience", "skills", "complete"];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentStep === "skills") {
      // Save profile data before completing
      try {
        await updateProfile({
          fullName: formData.fullName,
          phone: formData.phone,
          location: formData.location,
          headline: formData.headline,
          summary: formData.summary,
          currentRole: formData.currentRole,
          experience: formData.experience,
          company: formData.company,
          skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
          education: formData.education,
          certifications: formData.certifications,
        }).unwrap();
        toast.success("Profile saved successfully!");
      } catch (error) {
        console.error("Error saving profile:", error);
        // Continue anyway - they can update later
      }
      navigate("/contractor/dashboard");
    } else {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleSkip = () => {
    navigate("/contractor/dashboard");
  };

  const handleBack = () => {
    const stepOrder: ProfileStep[] = ["resume", "personal", "experience", "skills"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "resume":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Resume</h2>
              <p className="text-muted-foreground">
                Help employers find you faster by uploading your resume
              </p>
            </div>

            {!uploadedFile ? (
              <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-xl p-12 bg-muted/20 hover:bg-muted/30 transition-all duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Drag & drop your resume here
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Supported formats: PDF, DOCX • Maximum size: 5MB
                  </p>
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm transition-all duration-200">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </div>
                  </label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        {isUploading && " • Uploading..."}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        );

      case "personal":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Personal Information</h2>
              <p className="text-muted-foreground">
                Tell us a bit about yourself
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  name="headline"
                  placeholder="Senior Software Engineer with 5+ years experience"
                  value={formData.headline}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Brief overview of your professional background and career goals..."
                  rows={4}
                  value={formData.summary}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Work Experience</h2>
              <p className="text-muted-foreground">
                Share your professional experience
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current/Recent Job Title</Label>
                  <Input
                    id="currentRole"
                    name="currentRole"
                    placeholder="Software Engineer"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Tech Company Inc."
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  placeholder="5 years"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  name="education"
                  placeholder="BS in Computer Science, Stanford University"
                  value={formData.education}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Skills & Certifications</h2>
              <p className="text-muted-foreground">
                Highlight your key skills and certifications
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  placeholder="React, TypeScript, Node.js, Python, AWS, Docker..."
                  rows={3}
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  name="certifications"
                  placeholder="AWS Certified Developer, Google Cloud Professional..."
                  rows={3}
                  value={formData.certifications}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/635c4f04-521e-4c70-9b0a-7796b57a77bd.png"
              alt="Hirion"
              className="h-8 w-auto"
            />
          </div>
          <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
            Skip for now
          </Button>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  currentStep === step.key
                    ? "bg-primary text-primary-foreground"
                    : steps.findIndex(s => s.key === currentStep) > index
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.icon}
                <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    steps.findIndex(s => s.key === currentStep) > index
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <Card className="p-6 md:p-8 shadow-lg">
          {renderStepContent()}
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-4">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === "resume"}
          >
            Back
          </Button>
          <Button onClick={handleNext} className="gap-2">
            {currentStep === "skills" ? "Complete Profile" : "Continue"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileSetup;
