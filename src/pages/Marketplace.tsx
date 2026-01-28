import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  Search, 
  TrendingUp, 
  Clock, 
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Marketplace = () => {
  const navigate = useNavigate();

  const features = {
    findTalent: [
      { icon: Search, text: 'AI-powered talent search' },
      { icon: Users, text: 'Access bench resources' },
      { icon: Clock, text: 'Hire in days, not weeks' },
      { icon: Award, text: 'Pre-vetted candidates' },
    ],
    registerTalent: [
      { icon: TrendingUp, text: 'Showcase your skills' },
      { icon: Sparkles, text: 'AI interview preparation' },
      { icon: CheckCircle, text: 'Get matched instantly' },
      { icon: Clock, text: 'Flexible contracts' },
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
                Talent Marketplace
              </h1>
              <p className="text-xl text-neutral-600 mb-4">
                Connect companies with ready-to-deploy talent for short-term projects and bench resources
              </p>
              <div className="flex items-center justify-center gap-2 text-teal-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">AI-Powered Matching</span>
                <span className="text-neutral-300">•</span>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Instant Availability</span>
                <span className="text-neutral-300">•</span>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Verified Profiles</span>
              </div>
            </div>

            {/* Main Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Find Talent Card */}
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-transparent hover:border-blue-500 bg-gradient-to-br from-blue-50 to-white"
                onClick={() => navigate('/find-talent')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Search className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-neutral-900 mb-3">
                    Find Talent
                  </CardTitle>
                  <CardDescription className="text-lg text-neutral-600">
                    Hire ready-to-deploy talent in days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {features.findTalent.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-neutral-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white group-hover:shadow-lg"
                  >
                    Start Hiring
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* List Your Talent Card - For Employers */}
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-transparent hover:border-green-500 bg-gradient-to-br from-green-50 to-white"
                onClick={() => navigate('/employer-login')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <UserPlus className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-neutral-900 mb-3">
                    List Your Talent
                  </CardTitle>
                  <CardDescription className="text-lg text-neutral-600">
                    Showcase your skills or bench resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {features.registerTalent.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-neutral-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white group-hover:shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                Why Choose Our Talent Marketplace?
              </h2>
              <p className="text-lg text-neutral-600">
                Built for speed, efficiency, and quality matches
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
                  <p className="text-neutral-600">
                    Smart algorithms match the perfect talent to your requirements
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quick Deployment</h3>
                  <p className="text-neutral-600">
                    Hire verified talent in days with streamlined processes
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
                  <p className="text-neutral-600">
                    All profiles are verified with skill assessments and reviews
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-teal-100">Active Talent</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5K+</div>
                <div className="text-teal-100">Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-teal-100">Match Success</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">48h</div>
                <div className="text-teal-100">Avg. Hire Time</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
