import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Calendar,
  MessageSquare,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles
} from 'lucide-react';

const TalentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - would come from API
  const talent = {
    id: 1,
    name: 'Rajesh Kumar',
    title: 'Senior Java Developer',
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Docker', 'Kubernetes'],
    experience: '8 years',
    location: 'Bangalore',
    availability: 'Immediate',
    rate: '₹2,500/hour',
    rating: 4.8,
    matchScore: 95,
    type: 'Freelancer',
    bio: 'Experienced Java developer with expertise in building scalable microservices. Strong background in cloud architecture and DevOps practices.',
    education: [
      { degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2015' }
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Oracle Certified Professional',
      'Kubernetes Administrator'
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built scalable microservices architecture serving 1M+ users',
        tech: ['Java', 'Spring Boot', 'AWS', 'Redis']
      },
      {
        title: 'Payment Gateway Integration',
        description: 'Integrated multiple payment providers with fraud detection',
        tech: ['Java', 'Microservices', 'PostgreSQL']
      }
    ],
    reviews: [
      { rating: 5, text: 'Excellent developer, delivered on time', client: 'Tech Corp' },
      { rating: 4.5, text: 'Great communication and technical skills', client: 'Startup Inc' }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Header Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                  {talent.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-neutral-900">
                          {talent.name}
                        </h1>
                        <Badge className={talent.type === 'Freelancer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                          {talent.type}
                        </Badge>
                      </div>
                      <p className="text-xl text-neutral-600 mb-3">{talent.title}</p>
                      <p className="text-neutral-700">{talent.bio}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-4 py-2 rounded-full">
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-amber-700 text-lg">{talent.rating}</span>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-teal-600" />
                      <span className="text-sm font-semibold text-teal-600">
                        {talent.matchScore}% AI Match Score
                      </span>
                    </div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden max-w-md">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                        style={{ width: `${talent.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <span className="text-neutral-500 text-sm">Experience</span>
                      <p className="font-semibold text-lg">{talent.experience}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-sm">Location</span>
                      <p className="font-semibold text-lg flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {talent.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-sm">Availability</span>
                      <p className="font-semibold text-lg text-green-600">{talent.availability}</p>
                    </div>
                  </div>

                  {/* Rate & Actions */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-teal-600">
                      {talent.rate}
                    </span>
                    <div className="flex gap-3 ml-auto">
                      <Button size="lg" variant="outline">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Message
                      </Button>
                      <Button size="lg" className="bg-gradient-to-r from-teal-600 to-teal-800">
                        <Calendar className="h-5 w-5 mr-2" />
                        Schedule Interview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Tabs */}
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {talent.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-teal-600" />
                      Certifications
                    </h3>
                    <div className="space-y-2">
                      {talent.certifications.map(cert => (
                        <div key={cert} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                          <Award className="h-4 w-4 text-teal-600" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <div className="space-y-4">
                {talent.projects.map((project, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map(tech => (
                          <Badge key={tech} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-teal-600" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {talent.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                      <h3 className="font-semibold text-lg">{edu.degree}</h3>
                      <p className="text-neutral-600">{edu.institution}</p>
                      <p className="text-neutral-500 text-sm">{edu.year}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {talent.reviews.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="font-semibold">{review.rating}</span>
                        </div>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-600">{review.client}</span>
                      </div>
                      <p className="text-neutral-700">{review.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TalentProfile;
