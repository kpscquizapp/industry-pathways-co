import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  MapPin,
  CheckCircle2,
  X,
  Save,
  Eye,
  Send,
  Bold,
  Italic,
  List,
  Link2,
  Briefcase,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface JobFormData {
  // Basic Information
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  jobRole: string;
  
  // Employment & Location
  employmentType: string;
  workMode: string;
  duration: string;
  city: string;
  state: string;
  country: string;
  multipleLocations: boolean;
  
  // Experience & Skills
  minExperience: string;
  maxExperience: string;
  fresherAllowed: boolean;
  mandatorySkills: string[];
  educationQualification: string;
  languagesKnown: string;
  
  // Compensation & Benefits
  salaryType: string;
  minSalary: string;
  maxSalary: string;
  showSalary: boolean;
  perks: {
    healthInsurance: boolean;
    esops: boolean;
    performanceBonus: boolean;
    remoteAllowance: boolean;
  };
  
  // AI & Application Settings
  enableAIMatching: boolean;
  autoScreenCandidates: boolean;
  enableSkillAssessment: boolean;
  scheduleAIInterview: boolean;
  applicationDeadline: string;
  numberOfOpenings: string;
  
  // Compliance & Publishing
  equalOpportunityEmployer: boolean;
  agreeToPrivacy: boolean;
  acceptTerms: boolean;
  jobVisibility: string;
  urgency: string;
}

const STEPS = [
  { id: 1, title: 'Basic Information', icon: FileText },
  { id: 2, title: 'Employment & Location', icon: MapPin },
  { id: 3, title: 'Experience & Skills', icon: CheckCircle2 },
  { id: 4, title: 'Compensation & Benefits', icon: Briefcase },
  { id: 5, title: 'AI & Application Settings', icon: Settings },
  { id: 6, title: 'Compliance & Publishing', icon: Shield },
];

const PostJob = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    jobDescription: '',
    jobCategory: '',
    jobRole: '',
    employmentType: '',
    workMode: '',
    duration: '',
    city: '',
    state: '',
    country: 'India',
    multipleLocations: false,
    minExperience: '',
    maxExperience: '',
    fresherAllowed: false,
    mandatorySkills: [],
    educationQualification: '',
    languagesKnown: '',
    salaryType: '',
    minSalary: '',
    maxSalary: '',
    showSalary: true,
    perks: {
      healthInsurance: false,
      esops: false,
      performanceBonus: false,
      remoteAllowance: false,
    },
    enableAIMatching: true,
    autoScreenCandidates: false,
    enableSkillAssessment: true,
    scheduleAIInterview: false,
    applicationDeadline: '',
    numberOfOpenings: '1',
    equalOpportunityEmployer: true,
    agreeToPrivacy: true,
    acceptTerms: false,
    jobVisibility: 'public',
    urgency: 'normal',
  });

  const updateFormData = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePerks = (perk: keyof JobFormData['perks'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      perks: { ...prev.perks, [perk]: value }
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.mandatorySkills.includes(skillInput.trim())) {
      updateFormData('mandatorySkills', [...formData.mandatorySkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    updateFormData('mandatorySkills', formData.mandatorySkills.filter(s => s !== skill));
  };

  const handleSaveDraft = () => {
    toast.success('Job saved as draft');
  };

  const handlePreview = () => {
    toast.info('Preview functionality coming soon');
  };

  const handlePublish = () => {
    if (!formData.acceptTerms) {
      toast.error('Please accept Terms & Conditions to publish');
      return;
    }
    toast.success('Job posted successfully! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/employer-dashboard');
    }, 1500);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 1: Basic Information
  const renderBasicInformation = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <FileText className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title <span className="text-destructive">*</span></Label>
          <Input
            id="jobTitle"
            placeholder="e.g. Senior Product Designer"
            value={formData.jobTitle}
            onChange={(e) => updateFormData('jobTitle', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Job Description <span className="text-destructive">*</span></Label>
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center gap-1 p-2 bg-muted/50 border-b">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Write the job overview, responsibilities, and key requirements..."
              className="border-0 rounded-none min-h-[120px] focus-visible:ring-0"
              value={formData.jobDescription}
              onChange={(e) => updateFormData('jobDescription', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Job Category <span className="text-destructive">*</span></Label>
            <Select value={formData.jobCategory} onValueChange={(v) => updateFormData('jobCategory', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it-software">IT & Software</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR & Admin</SelectItem>
                <SelectItem value="finance">Finance & Accounting</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Job Role <span className="text-destructive">*</span></Label>
            <Select value={formData.jobRole} onValueChange={(v) => updateFormData('jobRole', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 2: Employment & Location
  const renderEmploymentLocation = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" />
          Employment & Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Employment Type <span className="text-destructive">*</span></Label>
            <Select value={formData.employmentType} onValueChange={(v) => updateFormData('employmentType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-Time</SelectItem>
                <SelectItem value="part-time">Part-Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Work Mode <span className="text-destructive">*</span></Label>
            <Select value={formData.workMode} onValueChange={(v) => updateFormData('workMode', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-orange-600">Duration (if Contract)</Label>
            <Input
              placeholder="e.g. 6 Months"
              value={formData.duration}
              onChange={(e) => updateFormData('duration', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>City <span className="text-destructive">*</span></Label>
            <Input
              placeholder="e.g. Bangalore"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input
              placeholder="e.g. Karnataka"
              value={formData.state}
              onChange={(e) => updateFormData('state', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-orange-600">Country</Label>
            <Input
              value={formData.country}
              onChange={(e) => updateFormData('country', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="multipleLocations"
            checked={formData.multipleLocations}
            onCheckedChange={(checked) => updateFormData('multipleLocations', checked)}
          />
          <Label htmlFor="multipleLocations" className="cursor-pointer text-sm">
            Multiple Locations Allowed
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  // Step 3: Experience & Skills
  const renderExperienceSkills = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <CheckCircle2 className="h-5 w-5" />
          Experience & Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Min Experience (Years) <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              placeholder="2"
              value={formData.minExperience}
              onChange={(e) => updateFormData('minExperience', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-orange-600">Max Experience (Years)</Label>
            <Input
              type="number"
              placeholder="5"
              value={formData.maxExperience}
              onChange={(e) => updateFormData('maxExperience', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="fresherAllowed"
            checked={formData.fresherAllowed}
            onCheckedChange={(checked) => updateFormData('fresherAllowed', checked)}
          />
          <Label htmlFor="fresherAllowed" className="cursor-pointer text-sm">
            Fresher Allowed
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Mandatory Skills <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.mandatorySkills.map((skill) => (
              <Badge key={skill} className="bg-primary text-primary-foreground gap-1 py-1.5 px-3">
                {skill}
                <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => removeSkill(skill)} />
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Type and press enter..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-orange-600">Education Qualification</Label>
            <Input
              placeholder="e.g. B.Tech / MCA"
              value={formData.educationQualification}
              onChange={(e) => updateFormData('educationQualification', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-orange-600">Languages Known</Label>
            <Input
              placeholder="e.g. English, Hindi"
              value={formData.languagesKnown}
              onChange={(e) => updateFormData('languagesKnown', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 4: Compensation & Benefits
  const renderCompensation = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Briefcase className="h-5 w-5" />
          Compensation & Benefits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Salary Type <span className="text-destructive">*</span></Label>
            <Select value={formData.salaryType} onValueChange={(v) => updateFormData('salaryType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Range</SelectItem>
                <SelectItem value="negotiable">Negotiable</SelectItem>
                <SelectItem value="not-disclosed">Not Disclosed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-orange-600">Min Salary</Label>
            <Input
              placeholder="₹ 5,00,000"
              value={formData.minSalary}
              onChange={(e) => updateFormData('minSalary', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-orange-600">Max Salary</Label>
            <Input
              placeholder="₹ 12,00,000"
              value={formData.maxSalary}
              onChange={(e) => updateFormData('maxSalary', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showSalary"
            checked={formData.showSalary}
            onCheckedChange={(checked) => updateFormData('showSalary', checked)}
          />
          <Label htmlFor="showSalary" className="cursor-pointer text-sm text-primary">
            Show Salary to Candidates
          </Label>
        </div>

        <div className="space-y-2">
          <Label className="text-orange-600">Additional Perks</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="healthInsurance"
                checked={formData.perks.healthInsurance}
                onCheckedChange={(checked) => updatePerks('healthInsurance', !!checked)}
              />
              <Label htmlFor="healthInsurance" className="cursor-pointer text-sm">Health Insurance</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="esops"
                checked={formData.perks.esops}
                onCheckedChange={(checked) => updatePerks('esops', !!checked)}
              />
              <Label htmlFor="esops" className="cursor-pointer text-sm">ESOPs</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="performanceBonus"
                checked={formData.perks.performanceBonus}
                onCheckedChange={(checked) => updatePerks('performanceBonus', !!checked)}
              />
              <Label htmlFor="performanceBonus" className="cursor-pointer text-sm">Performance Bonus</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="remoteAllowance"
                checked={formData.perks.remoteAllowance}
                onCheckedChange={(checked) => updatePerks('remoteAllowance', !!checked)}
              />
              <Label htmlFor="remoteAllowance" className="cursor-pointer text-sm">Remote Allowance</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 5: AI & Application Settings
  const renderAISettings = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Settings className="h-5 w-5" />
          AI & Application Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label className="cursor-pointer">Enable AI Talent Matching</Label>
            <Switch
              checked={formData.enableAIMatching}
              onCheckedChange={(checked) => updateFormData('enableAIMatching', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label className="cursor-pointer">Auto-Screen Candidates</Label>
            <Switch
              checked={formData.autoScreenCandidates}
              onCheckedChange={(checked) => updateFormData('autoScreenCandidates', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label className="cursor-pointer">Enable Skill Assessment</Label>
            <Switch
              checked={formData.enableSkillAssessment}
              onCheckedChange={(checked) => updateFormData('enableSkillAssessment', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label className="cursor-pointer">Schedule AI Interview</Label>
            <Switch
              checked={formData.scheduleAIInterview}
              onCheckedChange={(checked) => updateFormData('scheduleAIInterview', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-orange-600">Application Deadline</Label>
            <Input
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) => updateFormData('applicationDeadline', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Number of Openings <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              placeholder="1"
              value={formData.numberOfOpenings}
              onChange={(e) => updateFormData('numberOfOpenings', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 6: Compliance & Publishing
  const renderCompliance = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Shield className="h-5 w-5" />
          Compliance & Publishing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="equalOpportunity"
              checked={formData.equalOpportunityEmployer}
              onCheckedChange={(checked) => updateFormData('equalOpportunityEmployer', checked)}
            />
            <Label htmlFor="equalOpportunity" className="cursor-pointer text-sm text-primary">
              Equal Opportunity Employer
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="privacyPolicy"
              checked={formData.agreeToPrivacy}
              onCheckedChange={(checked) => updateFormData('agreeToPrivacy', checked)}
            />
            <Label htmlFor="privacyPolicy" className="cursor-pointer text-sm">
              I agree to <span className="text-primary hover:underline cursor-pointer">Data Privacy Policies</span>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="termsConditions"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => updateFormData('acceptTerms', checked)}
            />
            <Label htmlFor="termsConditions" className="cursor-pointer text-sm">
              I accept <span className="text-destructive hover:underline cursor-pointer">Terms & Conditions</span> <span className="text-destructive">*</span>
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Job Visibility <span className="text-destructive">*</span></Label>
            <Select value={formData.jobVisibility} onValueChange={(v) => updateFormData('jobVisibility', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public (Visible to all)</SelectItem>
                <SelectItem value="private">Private (Invite only)</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-orange-600">Urgency</Label>
            <Select value={formData.urgency} onValueChange={(v) => updateFormData('urgency', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderEmploymentLocation();
      case 3:
        return renderExperienceSkills();
      case 4:
        return renderCompensation();
      case 5:
        return renderAISettings();
      case 6:
        return renderCompliance();
      default:
        return renderBasicInformation();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create New Job Post</h1>
        <p className="text-muted-foreground">Fill in the details to publish a new opportunity for candidates.</p>
      </div>

      {/* Step Indicator */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={index} className='my-2'>
                <button
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 min-w-[100px] transition-all",
                    isActive && "scale-105",
                    (isActive || isCompleted) ? "cursor-pointer" : "cursor-pointer opacity-70 hover:opacity-100"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isActive && "bg-primary text-primary-foreground shadow-lg",
                      isCompleted && "bg-green-500 text-white",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium text-center whitespace-nowrap",
                      isActive && "text-primary",
                      isCompleted && "text-green-600",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 min-w-[20px]",
                      isCompleted ? "bg-green-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      {renderCurrentStep()}

      {/* Action Buttons - Fixed at bottom */}
      <div className="sticky bottom-0 left-0 right-0 bg-background border p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
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
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handlePublish} className="bg-primary hover:bg-primary/90">
                Publish Job Post
                <Send className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
