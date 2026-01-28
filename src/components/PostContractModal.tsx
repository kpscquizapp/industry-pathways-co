import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Briefcase, 
  MapPin, 
  Wallet,
  X,
  Sparkles,
  Calendar
} from 'lucide-react';

interface PostContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostContractModal = ({ open, onOpenChange }: PostContractModalProps) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobCategory: '',
    numberOfOpenings: '1',
    requiredSkills: [] as string[],
    experienceLevel: '',
    certifications: '',
    workMode: '',
    location: '',
    openToBench: true,
    duration: '',
    durationUnit: 'Month',
    startDate: '',
    paymentType: '',
    budgetMin: '',
    budgetMax: '',
  });

  const [skillInput, setSkillInput] = useState('');

  const addSkill = (skill: string) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = (action: 'draft' | 'post' | 'postAndShow') => {
    console.log('Form submitted:', { action, formData });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-primary">
              Post a Contract Opportunity
            </DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary text-primary hover:bg-primary/10"
            >
              <Sparkles className="h-4 w-4" />
              Contract Mode Enabled
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Fill in the details to find the perfect freelancer or bench talent for your project.
          </p>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Basic Information</h3>
                <p className="text-xs text-muted-foreground">Define the core requirements of the role</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="jobTitle" className="text-sm font-medium">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Senior React Native Developer (Contract)"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-primary hover:bg-primary/10"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="jobDescription" className="text-sm font-medium">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Describe the project scope, deliverables, and expectations..."
                  value={formData.jobDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Job Category</Label>
                  <Select
                    value={formData.jobCategory}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, jobCategory: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="openings" className="text-sm font-medium">
                    Number of Openings
                  </Label>
                  <Input
                    id="openings"
                    type="number"
                    min="1"
                    value={formData.numberOfOpenings}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfOpenings: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="bg-gradient-to-r from-amber-500/5 to-transparent rounded-lg p-4 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Skills & Experience</h3>
                <p className="text-xs text-muted-foreground">What technologies should the candidate know?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Required Skills <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {formData.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 px-3 py-1">
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => addSkill(skillInput)}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Experience Level</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Mid-Senior (3-5 Years)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 Years)</SelectItem>
                      <SelectItem value="mid">Mid-Senior (3-5 Years)</SelectItem>
                      <SelectItem value="senior">Senior (5-8 Years)</SelectItem>
                      <SelectItem value="lead">Lead (8+ Years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="certifications" className="text-sm font-medium">
                    Certifications (Optional)
                  </Label>
                  <Input
                    id="certifications"
                    placeholder="e.g. AWS Certified"
                    value={formData.certifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location & Terms */}
          <div className="bg-gradient-to-r from-blue-500/5 to-transparent rounded-lg p-4 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Location & Terms</h3>
                <p className="text-xs text-muted-foreground">Where will the candidate work?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Work Mode</Label>
                  <Select
                    value={formData.workMode}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, workMode: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Remote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <div className="relative mt-1">
                    <Input
                      id="location"
                      placeholder="Bangalore, India"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="pr-10"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div>
                  <p className="font-medium text-sm text-foreground">Open to Bench Resources</p>
                  <p className="text-xs text-muted-foreground">Allow agencies and companies to propose their bench employees</p>
                </div>
                <Switch 
                  checked={formData.openToBench}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, openToBench: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Budget & Duration */}
          <div className="bg-gradient-to-r from-green-500/5 to-transparent rounded-lg p-4 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Budget & Duration</h3>
                <p className="text-xs text-muted-foreground">Set your financial limits for this contract</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      min="1"
                      placeholder="3"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-20"
                    />
                    <Select
                      value={formData.durationUnit}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, durationUnit: value }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Week">Week</SelectItem>
                        <SelectItem value="Month">Month</SelectItem>
                        <SelectItem value="Year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <div className="relative mt-1">
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Payment Type</Label>
                  <Select
                    value={formData.paymentType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentType: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Hourly Rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="monthly">Monthly Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Budget Range (INR)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Min"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
                    />
                    <span className="flex items-center text-muted-foreground">-</span>
                    <Input
                      placeholder="Max"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-end gap-3 sticky bottom-0">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit('draft')}
          >
            Save Draft
          </Button>
          <Button 
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => handleSubmit('post')}
          >
            Post Job Only
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 gap-2"
            onClick={() => handleSubmit('postAndShow')}
          >
            <Sparkles className="h-4 w-4" />
            Post & Show Relevant Profiles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostContractModal;
