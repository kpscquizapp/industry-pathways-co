import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Shield,
  Save,
  Send,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateJobMutation } from '@/app/queries/jobApi';

const EmployerPostJob = () => {
  const navigate = useNavigate();
  const [createJob, { isLoading: createJobLoading }] = useCreateJobMutation();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [openToBench, setOpenToBench] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    employmentType: '',
    openings: '',
    experienceLevel: '',
    certifications: '',
    workMode: '',
    location: '',
    duration: '',
    durationUnit: '',
    startDate: '',
    paymentType: '',
    salaryMin: '',
    salaryMax: '',
    currency: '',
  });

  const parseOptionalNumber = (value: string) => {
    if (!value) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const mapDurationUnit = (unit: string) => {
    switch (unit) {
      case 'week':
        return 'weeks';
      case 'month':
        return 'months';
      case 'year':
        return 'years';
      default:
        return undefined;
    }
  };

  const parseCertifications = (value: string) => {
    if (!value.trim()) {
      return undefined;
    }
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length > 0 ? items : undefined;
  };

  const buildCreateJobPayload = (enableAiMatching: boolean) => ({
    title: formData.title,
    description: formData.description,
    category: formData.category || undefined,
    location: formData.location || undefined,
    experienceLevel: formData.experienceLevel || undefined,
    employmentType: formData.employmentType || undefined,
    workMode: formData.workMode || undefined,
    duration: parseOptionalNumber(formData.duration),
    durationUnit: mapDurationUnit(formData.durationUnit),
    startDate: formData.startDate || undefined,
    paymentType: formData.paymentType || undefined,
    salaryMin: parseOptionalNumber(formData.salaryMin),
    salaryMax: parseOptionalNumber(formData.salaryMax),
    currency: formData.currency || undefined,
    openToBenchResources: openToBench,
    certifications: parseCertifications(formData.certifications),
    numberOfOpenings: parseOptionalNumber(formData.openings),
    enableAiTalentMatching: enableAiMatching,
    aiMatchingEnabled: enableAiMatching,
    skills: skills.map((skill) => ({ name: skill })),
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const handlePostJob = async () => {
    try {
      const payload = buildCreateJobPayload(false);
      await createJob(payload).unwrap();
      toast.success('Job posted successfully!');
      navigate('/hire-talent/dashboard');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to post job');
    }
  };

  const handlePostAndShowProfiles = async () => {
    try {
      const payload = buildCreateJobPayload(true);
      await createJob(payload).unwrap();
      toast.success('Job posted! Finding AI-matched candidates...');
      navigate('/hire-talent/ai-shortlists');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
          <p className="text-muted-foreground">Create a contract opportunity for top talent</p>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['basic', 'skills', 'location', 'budget']} className="space-y-4">
        {/* Basic Information */}
        <AccordionItem value="basic" className="border border-border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">1</span>
              </div>
              <span className="font-semibold text-foreground">Basic Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-foreground">Job Title</Label>
                <Input 
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Senior React Native Developer (Contract)"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">Job Description</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={5}
                  className="mt-1.5 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Job Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="qa">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(v) => setFormData({...formData, employmentType: v})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="openings" className="text-sm font-medium">Number of Openings</Label>
                  <Input 
                    id="openings"
                    type="number"
                    placeholder="0"
                    min="1"
                    value={formData.openings}
                    onChange={(e) => setFormData({...formData, openings: e.target.value})}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skills & Experience */}
        <AccordionItem value="skills" className="border border-border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">2</span>
              </div>
              <span className="font-semibold text-foreground">Skills & Experience</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Required Skills</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                    >
                      {skill}
                      <button 
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(v) => setFormData({...formData, experienceLevel: v})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (0-2 Years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 Years)</SelectItem>
                      <SelectItem value="mid-senior">Mid Senior (6-9 Years)</SelectItem>
                      <SelectItem value="senior">Senior (10+ Years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="certifications" className="text-sm font-medium">Certifications</Label>
                  <Input 
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                    placeholder="e.g., AWS Certified"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location & Terms */}
        <AccordionItem value="location" className="border border-border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">3</span>
              </div>
              <span className="font-semibold text-foreground">Location & Terms</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Work Mode</Label>
                  <Select value={formData.workMode} onValueChange={(v) => setFormData({...formData, workMode: v})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger> 
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <div className="relative mt-1.5">
                    <Input 
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="City, Country"
                      className="pr-10"
                    />
                    <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={openToBench} 
                      onCheckedChange={setOpenToBench}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <div>
                      <p className="font-medium text-sm">Open to Bench Resources</p>
                      <p className="text-xs text-muted-foreground">
                        Allow agencies and companies to propose their bench employees
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Budget & Duration */}
        <AccordionItem value="budget" className="border border-border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">4</span>
              </div>
              <span className="font-semibold text-foreground">Budget & Duration</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="duration" className="text-sm font-medium text-foreground">Duration</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input 
                      id="duration"
                      type="number"
                      placeholder="Enter duration"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="flex-1"
                    />
                    <Select value={formData.durationUnit} onValueChange={(v) => setFormData({...formData, durationUnit: v})}>
                      <SelectTrigger className="w-32" >
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                  <div className="relative mt-1.5">
                    <Input 
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Payment Type</Label>
                  <Select value={formData.paymentType} onValueChange={(v) => setFormData({...formData, paymentType: v})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Currency</Label>
                  <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budgetMin" className="text-sm font-medium">Min Budget ({formData.currency})</Label>
                  <Input 
                    id="budgetMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                    placeholder="e.g., 1500"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="budgetMax" className="text-sm font-medium">Max Budget ({formData.currency})</Label>
                  <Input 
                    id="budgetMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                    placeholder="e.g., 2500"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-border">
        <Button variant="outline" onClick={handleSaveDraft} className="rounded-xl">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button
          onClick={handlePostJob}
          className="rounded-xl bg-primary hover:bg-primary/90"
          disabled={createJobLoading}
        >
          <Send className="h-4 w-4 mr-2" />
          {createJobLoading ? 'Posting...' : 'Post Job'}
        </Button>
        <Button
          onClick={handlePostAndShowProfiles}
          className="rounded-xl bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
          disabled={createJobLoading}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {createJobLoading ? 'Posting...' : 'Post & Show Relevant Profiles'}
        </Button>
      </div>
    </div>
  );
};

export default EmployerPostJob;
