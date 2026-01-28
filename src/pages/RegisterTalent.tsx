import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  ArrowRight,
  Upload,
  User,
  Briefcase,
  DollarSign,
  CheckCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RegisterTalent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrationType, setRegistrationType] = useState<'individual' | 'company'>('individual');
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Individual form state
  const [individualData, setIndividualData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    experience: '',
    skills: [] as string[],
    availability: '',
    rate: '',
    bio: '',
    portfolio: ''
  });

  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !individualData.skills.includes(skillInput.trim())) {
      setIndividualData({
        ...individualData,
        skills: [...individualData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setIndividualData({
      ...individualData,
      skills: individualData.skills.filter(s => s !== skill)
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Registration Successful!",
      description: "Your profile has been created and will be reviewed shortly.",
    });
    navigate('/marketplace');
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>

          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Register Talent</h1>
          <p className="text-neutral-600 mb-8">Join our talent marketplace</p>

          {/* Registration Type Selection */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Registration Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={registrationType} onValueChange={(v) => setRegistrationType(v as 'individual' | 'company')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="company">Company (Bench Resources)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="individual" className="mt-6">
                    <div className="text-center p-8">
                      <User className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Register as Individual</h3>
                      <p className="text-neutral-600 mb-6">
                        Create your professional profile and get matched with projects
                      </p>
                      <Button size="lg" onClick={() => setStep(2)}>
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="company" className="mt-6">
                    <div className="text-center p-8">
                      <Briefcase className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Register Bench Resources</h3>
                      <p className="text-neutral-600 mb-6">
                        List your available bench employees for short-term opportunities
                      </p>
                      <Button size="lg" onClick={() => setStep(2)}>
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Individual Registration Steps */}
          {step > 1 && registrationType === 'individual' && (
            <>
              <Progress value={progress} className="mb-6" />
              
              {/* Step 2: Personal Info */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={individualData.name}
                          onChange={(e) => setIndividualData({...individualData, name: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={individualData.email}
                          onChange={(e) => setIndividualData({...individualData, email: e.target.value})}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={individualData.phone}
                          onChange={(e) => setIndividualData({...individualData, phone: e.target.value})}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={individualData.location}
                          onChange={(e) => setIndividualData({...individualData, location: e.target.value})}
                          placeholder="Bangalore, India"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={individualData.bio}
                        onChange={(e) => setIndividualData({...individualData, bio: e.target.value})}
                        placeholder="Tell us about your experience and expertise..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button onClick={() => setStep(3)}>Next</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Skills & Experience */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          value={individualData.title}
                          onChange={(e) => setIndividualData({...individualData, title: e.target.value})}
                          placeholder="Senior Java Developer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Input
                          id="experience"
                          value={individualData.experience}
                          onChange={(e) => setIndividualData({...individualData, experience: e.target.value})}
                          placeholder="5"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="skills">Skills *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          placeholder="Add a skill and press Enter"
                        />
                        <Button onClick={addSkill}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {individualData.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="gap-1">
                            {skill}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="portfolio">Portfolio/GitHub URL</Label>
                      <Input
                        id="portfolio"
                        value={individualData.portfolio}
                        onChange={(e) => setIndividualData({...individualData, portfolio: e.target.value})}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                      <Button onClick={() => setStep(4)}>Next</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Availability & Rate */}
              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Availability & Rates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="availability">Availability *</Label>
                        <Input
                          id="availability"
                          value={individualData.availability}
                          onChange={(e) => setIndividualData({...individualData, availability: e.target.value})}
                          placeholder="Immediate / 2 weeks"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rate">Hourly Rate (₹) *</Label>
                        <Input
                          id="rate"
                          value={individualData.rate}
                          onChange={(e) => setIndividualData({...individualData, rate: e.target.value})}
                          placeholder="2500"
                        />
                      </div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-teal-900 mb-1">AI Interview Available</h4>
                          <p className="text-sm text-teal-700">
                            Enable AI-powered interviews to help companies assess your skills quickly
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                      <Button onClick={handleSubmit} className="bg-gradient-to-r from-teal-600 to-teal-800">
                        Submit Registration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Company Bulk Upload */}
          {step > 1 && registrationType === 'company' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Bench Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Upload CSV or Excel File</h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    Drag and drop your file here or click to browse
                  </p>
                  <Button variant="outline">
                    Choose File
                  </Button>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Required Columns:</h4>
                  <p className="text-sm text-muted-foreground">
                    Name, Email, Skills, Experience, Location, Availability, Rate
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handleSubmit}>
                    Upload & Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterTalent;
