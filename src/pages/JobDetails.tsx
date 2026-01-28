import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { jobListings } from '@/data/jobListings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  MapPin,
  Building2,
  ArrowRight,
  Calendar,
  Clock,
  Briefcase,
  Share2,
  Copy,
  Linkedin,
  Twitter,
  Mail,
  ChevronRight,
  Upload,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentCompany: '',
    experience: '',
    expectedSalary: '',
    noticePeriod: '',
    coverLetter: '',
    resume: null as File | null
  });
  
  const job = jobListings.find(j => j.id === parseInt(id || '0'));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`${job?.title.en} at ${job?.company}`);
    
    const shareUrls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      email: `mailto:?subject=${title}&body=Check out this job: ${url}`,
    };
    
    window.open(shareUrls[platform], '_blank');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.experience) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setApplicationSubmitted(true);
    toast.success('Application submitted successfully!');
  };

  const resetModal = () => {
    setIsApplyModalOpen(false);
    setApplicationSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      currentCompany: '',
      experience: '',
      expectedSalary: '',
      noticePeriod: '',
      coverLetter: '',
      resume: null
    });
  };

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Job not found</h1>
            <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/jobs')} className="bg-primary hover:bg-primary/90">
              Browse All Jobs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse full description into sections
  const parseDescription = (desc: string) => {
    const sections: Record<string, string[]> = {
      about: [],
      responsibilities: [],
      requirements: [],
      benefits: []
    };
    
    if (!desc) return sections;
    
    const lines = desc.split('\n').filter(line => line.trim());
    let currentSection = 'about';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('About the Role') || trimmed.includes('We Are')) {
        currentSection = 'about';
      } else if (trimmed.includes('Responsibilities') || trimmed.includes('Key Responsibilities') || trimmed.includes('You Will')) {
        currentSection = 'responsibilities';
      } else if (trimmed.includes('Requirements') || trimmed.includes('Desired Experience')) {
        currentSection = 'requirements';
      } else if (trimmed.includes('Benefits') || trimmed.includes('What We Offer')) {
        currentSection = 'benefits';
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        sections[currentSection].push(trimmed.replace(/^[-•]\s*/, ''));
      } else if (!trimmed.startsWith('#') && trimmed.length > 10) {
        if (currentSection === 'about' && sections.about.length === 0) {
          sections.about.push(trimmed);
        }
      }
    });
    
    return sections;
  };

  const descSections = parseDescription(job.fullDescription || '');

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Job Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">{job.company[0]}</span>
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                    {job.title.en}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>at <span className="font-medium text-foreground">{job.company}</span></span>
                    <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5 rounded-md">
                      {job.type.en.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button 
                size="lg"
                onClick={() => setIsApplyModalOpen(true)}
                className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-semibold px-8 rounded-xl shadow-lg shadow-primary/25"
              >
                Apply Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Location Bar */}
              <div className="inline-flex items-center gap-2 text-sm bg-primary/5 text-primary px-4 py-2 rounded-lg border border-primary/20">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Location:</span>
                <span className="text-foreground">{job.location}</span>
              </div>

              {/* We Are Section */}
              <section className="bg-card rounded-2xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-primary mb-4">We Are:</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {job.company} is a global company that provides state-of-the-art technology solutions for top brands and agencies worldwide. Our proprietary technology is powered by Deep Learning algorithms, enabling businesses to achieve outstanding results and reach their goals at every stage of the funnel. As a {job.title.en}, you will be responsible for its development.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Founded and now operating in 90+ markets, {job.company} has always been private-by-design. It embraces first-party advertising and a relentless approach to innovation. We offer end-to-end Deep Learning-powered solutions to maximize conversion, drive new customer acquisition, create engagement, and fuel long-term demand for a global base of clients.
                </p>
              </section>

              {/* You Will Section */}
              <section className="bg-card rounded-2xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-primary mb-4">You Will:</h2>
                <ul className="space-y-3">
                  {(descSections.responsibilities.length > 0 ? descSections.responsibilities : [
                    'Designing and implementing models, most often of deep neural networks, used to predict the behavior and preferences of Internet users',
                    'Analysis of the latest works in the field of Machine Learning',
                    'Conducting and analyzing A/B tests of new solutions',
                    'Developing and testing new approaches to modeling key issues, such as bidding in first-price auctions'
                  ]).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Desired Experience Section */}
              <section className="bg-card rounded-2xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-primary mb-4">Desired Experience:</h2>
                <ul className="space-y-3">
                  {(descSections.requirements.length > 0 ? descSections.requirements : [
                    `${job.experience || '4+ years'} of hands-on experience with Machine Learning / Data Science`,
                    'Interest and willingness to constantly develop in the area of Machine Learning',
                    'Knowledge of statistics and probability',
                    'Experience in Python and PyTorch / TensorFlow',
                    'Strong analytical and problem-solving skills',
                    'Ability to work effectively in a team environment'
                  ]).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* What We Offer Section */}
              <section className="bg-card rounded-2xl p-6 border border-border/50">
                <h2 className="text-lg font-bold text-primary mb-4">What We Offer:</h2>
                <ul className="space-y-3">
                  {(descSections.benefits.length > 0 ? descSections.benefits : [
                    'Competitive salary and performance-based bonuses',
                    'Opportunity to work on state-of-the-art Deep Learning technology',
                    'Flexible working hours and remote work options',
                    'Private healthcare and multisport card',
                    'Modern office in the city center with great amenities'
                  ]).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Location Card */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                  <p className="font-semibold text-foreground">{job.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">India</p>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="flex flex-wrap gap-2 justify-center">
                  {job.skills?.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="px-4 py-2 text-sm bg-background hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {job.industry && (
                    <Badge 
                      variant="outline"
                      className="px-4 py-2 text-sm bg-primary/5 border-primary/20 text-primary"
                    >
                      {job.industry}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Job Overview */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="text-base font-bold text-foreground mb-5 text-center">Job Overview</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">JOB POSTED</p>
                    <p className="text-sm font-semibold text-foreground">2 mo ago</p>
                  </div>
                  <div>
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">JOB EXPIRES</p>
                    <p className="text-sm font-semibold text-foreground">—</p>
                  </div>
                  <div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">JOB TYPE</p>
                    <p className="text-sm font-semibold text-foreground">{job.type.en}</p>
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div className="bg-gradient-to-br from-primary to-violet-600 rounded-2xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90 mb-1">Salary Range</h3>
                <p className="text-2xl font-bold">₹{job.salary}</p>
                <p className="text-sm opacity-75 mt-1">Per Annum</p>
              </div>

              {/* Share This Job */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="text-base font-bold text-foreground mb-4 text-center">Share This Job:</h3>
                
                {/* Copy Link */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                  <input 
                    type="text" 
                    value={window.location.href}
                    readOnly
                    className="flex-1 text-xs bg-transparent text-muted-foreground truncate outline-none"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    <Copy className={`h-4 w-4 ${copied ? 'text-green-500' : 'text-muted-foreground'}`} />
                  </button>
                </div>

                {/* Social Share Buttons */}
                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => handleShare('linkedin')}
                    className="w-10 h-10 bg-[#0077b5] hover:bg-[#0077b5]/90 rounded-lg flex items-center justify-center transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-white" />
                  </button>
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="w-10 h-10 bg-[#1da1f2] hover:bg-[#1da1f2]/90 rounded-lg flex items-center justify-center transition-colors"
                    title="Share on Twitter"
                  >
                    <Twitter className="h-5 w-5 text-white" />
                  </button>
                  <button 
                    onClick={() => handleShare('email')}
                    className="w-10 h-10 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center transition-colors"
                    title="Share via Email"
                  >
                    <Mail className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <span className="text-xl font-bold text-primary">{job.company[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{job.company}</h3>
                    <p className="text-xs text-muted-foreground">{job.industry || 'Technology'}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {job.company} is a leading technology company committed to innovation and excellence, creating cutting-edge solutions that transform businesses.
                </p>
                <Button variant="outline" className="w-full rounded-xl">
                  View Company Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Jobs Section */}
        <SimilarJobs currentJob={job} />
      </main>
      
      <Footer />

      {/* Apply Now Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={(open) => !open && resetModal()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {!applicationSubmitted ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Apply for {job.title.en}</DialogTitle>
                <DialogDescription>
                  at {job.company} • {job.location}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmitApplication} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentCompany">Current Company</Label>
                    <Input
                      id="currentCompany"
                      name="currentCompany"
                      placeholder="Your current company"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Total Experience <span className="text-destructive">*</span></Label>
                    <Input
                      id="experience"
                      name="experience"
                      placeholder="e.g., 5 years"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedSalary">Expected Salary (LPA)</Label>
                    <Input
                      id="expectedSalary"
                      name="expectedSalary"
                      placeholder="e.g., 15"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period</Label>
                  <Input
                    id="noticePeriod"
                    name="noticePeriod"
                    placeholder="e.g., 30 days, Immediate"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Upload Resume</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      {formData.resume ? (
                        <p className="text-sm text-primary font-medium">{formData.resume.name}</p>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    placeholder="Tell us why you're interested in this role..."
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground mb-6">
                Your application for <span className="font-medium text-foreground">{job.title.en}</span> at <span className="font-medium text-foreground">{job.company}</span> has been submitted successfully.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                We'll review your application and get back to you soon. Check your email for confirmation.
              </p>
              <Button onClick={resetModal} className="bg-primary hover:bg-primary/90">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Similar Jobs Component
const SimilarJobs = ({ currentJob }: { currentJob: typeof jobListings[0] }) => {
  const navigate = useNavigate();
  
  // Find similar jobs based on skills, industry, or job type
  const similarJobs = jobListings
    .filter(job => {
      if (job.id === currentJob.id) return false;
      
      // Match by skills
      const sharedSkills = job.skills?.filter(skill => 
        currentJob.skills?.includes(skill)
      ) || [];
      if (sharedSkills.length > 0) return true;
      
      // Match by industry
      if (job.industry && job.industry === currentJob.industry) return true;
      
      // Match by job type
      if (job.type.en === currentJob.type.en) return true;
      
      return false;
    })
    .slice(0, 4);

  if (similarJobs.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Similar Jobs</h2>
        <p className="text-sm text-muted-foreground mt-1">Other positions you might be interested in</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {similarJobs.map((job) => (
          <div 
            key={job.id}
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="bg-card rounded-xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
          >
            {/* Company Logo & Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-lg flex items-center justify-center border border-primary/20">
                <span className="text-lg font-bold text-primary">{job.company[0]}</span>
              </div>
              {job.featured && (
                <Badge className="bg-amber-100 text-amber-700 text-xs">Featured</Badge>
              )}
            </div>

            {/* Job Info */}
            <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {job.title.en}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{job.company}</p>
            
            {/* Location & Type */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{job.location}</span>
            </div>
            
            {/* Salary & Type */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <span className="text-sm font-semibold text-primary">₹{job.salary}</span>
              <Badge variant="outline" className="text-xs">
                {job.type.en}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Button */}
      <div className="text-center mt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/jobs')}
          className="rounded-xl px-8"
        >
          View All Jobs
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default JobDetails;
