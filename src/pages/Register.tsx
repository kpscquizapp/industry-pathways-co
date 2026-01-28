import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Building2, Mail, Lock, Phone, Briefcase, Users, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [accountType, setAccountType] = useState<'candidate' | 'employer'>('candidate');

  // Candidate form state
  const [candidateData, setCandidateData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    lookingForContract: false,
  });

  // Employer form state
  const [employerData, setEmployerData] = useState({
    companyName: '',
    companyEmail: '',
    contactPerson: '',
    phone: '',
    location: '',
    employeeCount: '',
    password: '',
    confirmPassword: '',
  });

  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (candidateData.password !== candidateData.confirmPassword) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    if (candidateData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    const fullName = `${candidateData.firstName} ${candidateData.lastName}`.trim();
    const success = await signup(
      candidateData.email, 
      candidateData.password, 
      fullName, 
      'candidate',
      candidateData.lookingForContract
    );
    
    if (success) {
      toast.success('Your candidate account has been created! 🎉');
      setTimeout(() => navigate('/job-recommendations'), 1500);
    } else {
      toast.error('Email already exists');
    }
  };

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (employerData.password !== employerData.confirmPassword) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    if (employerData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    const success = await signup(employerData.companyEmail, employerData.password, employerData.companyName, 'employer');
    
    if (success) {
      toast.success('Your employer account has been created! 🎉');
      setTimeout(() => navigate('/employer'), 1500);
    } else {
      toast.error('Email already exists');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 bg-gradient-to-br from-teal-50 via-white to-teal-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-teal-100 shadow-2xl">
              <CardHeader className="text-center pb-6 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-t-lg">
                <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
                <CardDescription className="text-teal-50">
                  Join thousands of professionals and companies on HIRION
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Tabs value={accountType} onValueChange={(v) => setAccountType(v as 'candidate' | 'employer')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="candidate" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      I'm a Candidate
                    </TabsTrigger>
                    <TabsTrigger value="employer" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      I'm an Employer
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Candidate Registration Form */}
                  <TabsContent value="candidate">
                    <form onSubmit={handleCandidateSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              placeholder="John"
                              value={candidateData.firstName}
                              onChange={(e) => setCandidateData({...candidateData, firstName: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              value={candidateData.lastName}
                              onChange={(e) => setCandidateData({...candidateData, lastName: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={candidateData.email}
                            onChange={(e) => setCandidateData({...candidateData, email: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 1234567890"
                            value={candidateData.phone}
                            onChange={(e) => setCandidateData({...candidateData, phone: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={candidateData.password}
                            onChange={(e) => setCandidateData({...candidateData, password: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={candidateData.confirmPassword}
                            onChange={(e) => setCandidateData({...candidateData, confirmPassword: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 py-2">
                        <Checkbox 
                          id="contract-pref" 
                          checked={candidateData.lookingForContract}
                          onCheckedChange={(checked) => setCandidateData({
                            ...candidateData, 
                            lookingForContract: checked as boolean
                          })}
                        />
                        <Label 
                          htmlFor="contract-pref" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          I'm looking for contract/temporary jobs
                        </Label>
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white font-medium py-6">
                        Create Candidate Account
                      </Button>
                      
                      <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/employer" className="text-teal-600 hover:underline font-medium">
                          Sign In
                        </Link>
                      </div>
                    </form>
                  </TabsContent>
                  
                  {/* Employer Registration Form */}
                  <TabsContent value="employer">
                    <form onSubmit={handleEmployerSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="companyName"
                            placeholder="Acme Corporation"
                            value={employerData.companyName}
                            onChange={(e) => setEmployerData({...employerData, companyName: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="companyEmail">Company Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="companyEmail"
                            type="email"
                            placeholder="hr@company.com"
                            value={employerData.companyEmail}
                            onChange={(e) => setEmployerData({...employerData, companyEmail: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">Contact Person</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="contactPerson"
                              placeholder="Jane Smith"
                              value={employerData.contactPerson}
                              onChange={(e) => setEmployerData({...employerData, contactPerson: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="employerPhone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="employerPhone"
                              type="tel"
                              placeholder="+91 1234567890"
                              value={employerData.phone}
                              onChange={(e) => setEmployerData({...employerData, phone: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="location"
                              placeholder="Bangalore"
                              value={employerData.location}
                              onChange={(e) => setEmployerData({...employerData, location: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="employeeCount">Employee Count</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="employeeCount"
                              placeholder="50-100"
                              value={employerData.employeeCount}
                              onChange={(e) => setEmployerData({...employerData, employeeCount: e.target.value})}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="employerPassword">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="employerPassword"
                            type="password"
                            placeholder="••••••••"
                            value={employerData.password}
                            onChange={(e) => setEmployerData({...employerData, password: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="employerConfirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="employerConfirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={employerData.confirmPassword}
                            onChange={(e) => setEmployerData({...employerData, confirmPassword: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white font-medium py-6">
                        Create Employer Account
                      </Button>
                      
                      <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/employer" className="text-teal-600 hover:underline font-medium">
                          Sign In
                        </Link>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
