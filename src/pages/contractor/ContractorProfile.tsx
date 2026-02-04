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
  Sparkles,
  Camera,
  Star,
  TrendingUp,
  Zap,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useExtractResumeMutation } from '@/app/queries/atsApi';
import SpinnerLoader from '@/components/loader/SpinnerLoader';

const ContractorProfile = () => {
  const [extractResume, { isLoading: isExtracting }] = useExtractResumeMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior React Developer',
    summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, TypeScript, and Node.js ecosystems.',
    hourlyRate: '85',
    availability: 'immediate',
    experienceYears: '5-10',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    portfolio: 'johndoe.dev',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL', 'Tailwind CSS', 'Next.js'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    education: 'B.S. Computer Science, Stanford University',
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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success('Profile photo updated!');
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
    setIsEditing(false);
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
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Hero Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(222,47%,15%)] to-[hsl(222,47%,20%)]">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 p-1 shadow-2xl shadow-primary/30">
                <Avatar className="w-full h-full rounded-xl">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback className="rounded-xl bg-white/10 text-white text-3xl font-bold">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <button 
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-xl text-white/80 mb-4">{profileData.title}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {profileData.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {profileData.experienceYears} years
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {profileData.availability === 'immediate' ? 'Available Now' : profileData.availability}
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                <div className="text-3xl font-bold text-white">${profileData.hourlyRate}</div>
                <div className="text-xs text-white/60">per hour</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                <div className="text-3xl font-bold text-primary">{profileCompletion}%</div>
                <div className="text-xs text-white/60">complete</div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "secondary" : "default"}
              className="rounded-xl"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
            <Button 
              variant="outline" 
              className="rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isExtracting ? 'Extracting...' : 'Upload Resume'}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Quick Stats & Skills */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-primary to-emerald-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Profile Strength</span>
                </div>
                <span className="text-2xl font-bold">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2 mt-3 bg-white/20" />
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                {profileCompletion < 100 
                  ? 'Complete your profile to increase visibility and match rate with top contracts.'
                  : 'Excellent! Your profile is fully optimized for maximum visibility.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Skills Showcase */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Skills
                </h3>
                <span className="text-xs text-muted-foreground">{profileData.skills.length} skills</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 bg-primary/10 text-primary border-0 hover:bg-primary/20 transition-all cursor-default group"
                  >
                    {skill}
                    {isEditing && (
                      <button 
                        onClick={() => removeSkill(skill)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 mt-4">
                  <Input 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill..."
                    className="text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button size="sm" onClick={addSkill}>Add</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Certifications</h3>
              </div>
              
              <div className="space-y-3">
                {profileData.certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium flex-1">{cert}</span>
                    {isEditing && (
                      <button 
                        onClick={() => removeCertification(cert)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 mt-4">
                  <Input 
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add certification..."
                    className="text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  />
                  <Button size="sm" onClick={addCertification}>Add</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Connect
              </h3>
              
              <div className="space-y-3">
                {profileData.linkedin && (
                  <a 
                    href={`https://${profileData.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#0077B5]/10 rounded-xl hover:bg-[#0077B5]/20 transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-[#0077B5]" />
                    <span className="text-sm flex-1 truncate">{profileData.linkedin}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </a>
                )}
                {profileData.github && (
                  <a 
                    href={`https://${profileData.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-all group"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm flex-1 truncate">{profileData.github}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </a>
                )}
                {profileData.portfolio && (
                  <a 
                    href={`https://${profileData.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl hover:bg-primary/20 transition-all group"
                  >
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-sm flex-1 truncate">{profileData.portfolio}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="about" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">About</TabsTrigger>
              <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Details</TabsTrigger>
              <TabsTrigger value="resume" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Resume</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6 space-y-6">
              {/* Bio Section */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    About Me
                  </h3>
                  {isEditing ? (
                    <Textarea 
                      name="summary"
                      value={profileData.summary}
                      onChange={handleInputChange}
                      rows={4}
                      className="resize-none"
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{profileData.summary}</p>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Education
                  </h3>
                  {isEditing ? (
                    <Input 
                      name="education"
                      value={profileData.education}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{profileData.education}</p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Overview */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">87</div>
                    <div className="text-sm text-muted-foreground">Skill Score</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                  <CardContent className="p-6 text-center">
                    <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
                  <CardContent className="p-6 text-center">
                    <Briefcase className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6 space-y-6">
              {/* Contact Details */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Contact Information
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">First Name</Label>
                      {isEditing ? (
                        <Input name="firstName" value={profileData.firstName} onChange={handleInputChange} />
                      ) : (
                        <p className="font-medium">{profileData.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Last Name</Label>
                      {isEditing ? (
                        <Input name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                      ) : (
                        <p className="font-medium">{profileData.lastName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Email</Label>
                      {isEditing ? (
                        <Input name="email" type="email" value={profileData.email} onChange={handleInputChange} />
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {profileData.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Phone</Label>
                      {isEditing ? (
                        <Input name="phone" value={profileData.phone} onChange={handleInputChange} />
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {profileData.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Location</Label>
                      {isEditing ? (
                        <Input name="location" value={profileData.location} onChange={handleInputChange} />
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {profileData.location}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Professional Details
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Title</Label>
                      {isEditing ? (
                        <Input name="title" value={profileData.title} onChange={handleInputChange} />
                      ) : (
                        <p className="font-medium">{profileData.title}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Experience</Label>
                      {isEditing ? (
                        <Select value={profileData.experienceYears} onValueChange={(v) => handleSelectChange('experienceYears', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{profileData.experienceYears} years</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Hourly Rate</Label>
                      {isEditing ? (
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input name="hourlyRate" value={profileData.hourlyRate} onChange={handleInputChange} className="pl-9" />
                        </div>
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          ${profileData.hourlyRate}/hr
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Availability</Label>
                      {isEditing ? (
                        <Select value={profileData.availability} onValueChange={(v) => handleSelectChange('availability', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediately Available</SelectItem>
                            <SelectItem value="2-weeks">Available in 2 weeks</SelectItem>
                            <SelectItem value="1-month">Available in 1 month</SelectItem>
                            <SelectItem value="negotiable">Negotiable</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {profileData.availability === 'immediate' ? 'Immediately Available' : profileData.availability}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links Edit */}
              {isEditing && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Social Links
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">LinkedIn</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input name="linkedin" value={profileData.linkedin} onChange={handleInputChange} className="pl-9" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">GitHub</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input name="github" value={profileData.github} onChange={handleInputChange} className="pl-9" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Portfolio</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input name="portfolio" value={profileData.portfolio} onChange={handleInputChange} className="pl-9" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="resume" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-2xl p-12 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      {isExtracting ? (
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="w-16 h-16 text-primary animate-spin" />
                          <div>
                            <p className="font-semibold text-lg">Analyzing Resume...</p>
                            <p className="text-sm text-muted-foreground">Extracting skills and experience</p>
                          </div>
                        </div>
                      ) : uploadedFile ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <FileText className="w-10 h-10 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg truncate max-w-xs">{uploadedFile.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">Click to replace</p>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Parsed Successfully
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center">
                            <Upload className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">Upload Your Resume</p>
                            <p className="text-sm text-muted-foreground mt-1">PDF or Word document, max 5MB</p>
                          </div>
                          <p className="text-xs text-primary flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI will auto-extract your skills
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button - Only show when editing */}
          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile} className="px-8">
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorProfile;
