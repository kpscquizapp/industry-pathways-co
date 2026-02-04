import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Clock,
  Linkedin,
  Github,
  Globe,
  Award,
  GraduationCap,
  CheckCircle,
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useExtractResumeMutation } from '@/app/queries/atsApi';
import SpinnerLoader from '@/components/loader/SpinnerLoader';

const ContractorProfile = () => {
  const [extractResume, { isLoading: isExtracting }] = useExtractResumeMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    hourlyRate: '',
    availability: 'immediate',
    experienceYears: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: [] as string[],
    certifications: [] as string[],
    education: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    
    try {
      const result = await extractResume(file).unwrap();
      
      // Extract data from resume and populate fields
      if (result) {
        setProfileData(prev => ({
          ...prev,
          firstName: result.firstName || result.name?.split(' ')[0] || prev.firstName,
          lastName: result.lastName || result.name?.split(' ').slice(1).join(' ') || prev.lastName,
          email: result.email || prev.email,
          phone: result.phone || prev.phone,
          location: result.location || result.address || prev.location,
          title: result.title || result.currentTitle || prev.title,
          summary: result.summary || result.objective || prev.summary,
          skills: result.skills || prev.skills,
          certifications: result.certifications || prev.certifications,
          education: result.education?.[0]?.degree || result.education || prev.education,
          experienceYears: result.experienceYears || result.totalExperience || prev.experienceYears,
          linkedin: result.linkedin || prev.linkedin,
          github: result.github || prev.github,
        }));
        toast.success('Resume parsed successfully! Skills and details extracted.');
      }
    } catch (error) {
      toast.error('Failed to parse resume. Please fill in details manually.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !profileData.certifications.includes(newCertification.trim())) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const calculateProfileCompletion = () => {
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.email,
      profileData.phone,
      profileData.location,
      profileData.title,
      profileData.summary,
      profileData.hourlyRate,
      profileData.experienceYears,
      profileData.skills.length > 0
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleSaveProfile = () => {
    toast.success('Profile saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <SpinnerLoader className="w-10 h-10 text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-primary to-emerald-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Complete Your Profile</h1>
            <p className="text-white/80">A complete profile increases your chances of getting matched with top contracts</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/80">Profile Completion</p>
              <p className="text-2xl font-bold">{profileCompletion}%</p>
            </div>
            <div className="w-24">
              <Progress value={profileCompletion} className="h-2 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Resume Upload Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Smart Resume Upload
              </CardTitle>
              <CardDescription>
                Upload your resume and we'll auto-extract your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Extracting skills...</p>
                  </div>
                ) : uploadedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Upload Resume</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF or Word, max 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              {uploadedFile && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Resume uploaded & parsed</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    name="location" 
                    value={profileData.location}
                    onChange={handleInputChange}
                    placeholder="San Francisco, CA"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={profileData.title}
                    onChange={handleInputChange}
                    placeholder="Senior React Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Select 
                    value={profileData.experienceYears} 
                    onValueChange={(value) => handleSelectChange('experienceYears', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea 
                  id="summary" 
                  name="summary" 
                  value={profileData.summary}
                  onChange={handleInputChange}
                  placeholder="A brief summary of your experience and expertise..."
                  rows={4}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="hourlyRate" 
                      name="hourlyRate" 
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={handleInputChange}
                      placeholder="75"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select 
                    value={profileData.availability} 
                    onValueChange={(value) => handleSelectChange('availability', value)}
                  >
                    <SelectTrigger>
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediately Available</SelectItem>
                      <SelectItem value="2-weeks">Available in 2 weeks</SelectItem>
                      <SelectItem value="1-month">Available in 1 month</SelectItem>
                      <SelectItem value="negotiable">Negotiable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="education" 
                    name="education" 
                    value={profileData.education}
                    onChange={handleInputChange}
                    placeholder="B.S. Computer Science, MIT"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Skills
              </CardTitle>
              <CardDescription>Add your technical and professional skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button onClick={addSkill} type="button">Add</Button>
              </div>
              
              {profileData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                    >
                      {skill}
                      <button 
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Certifications
              </CardTitle>
              <CardDescription>Add your professional certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add a certification..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                />
                <Button onClick={addCertification} type="button">Add</Button>
              </div>
              
              {profileData.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.certifications.map((cert, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                    >
                      <Award className="w-3 h-3" />
                      {cert}
                      <button 
                        onClick={() => removeCertification(cert)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Social & Portfolio Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="linkedin" 
                    name="linkedin" 
                    value={profileData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/johndoe"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="github" 
                    name="github" 
                    value={profileData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/johndoe"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="portfolio" 
                    name="portfolio" 
                    value={profileData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://johndoe.dev"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveProfile} className="px-8">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorProfile;
