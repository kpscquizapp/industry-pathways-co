import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Rocket, Wrench, Star, Brain, FolderKanban, Award, TrendingUp } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface CareerPathDetailsStepProps {
  careerPath: string;
  onNext: () => void;
}

const pathDetails: Record<string, any> = {
  'Java Developer': {
    coreCourses: [
      'Core Java (OOPs, Collections, Generics)',
      'Exception Handling & Multithreading',
      'Java 8+ Features (Streams, Lambda)',
      'Data Structures & Algorithms',
      'SQL & Databases (MySQL/PostgreSQL)'
    ],
    advancedCourses: [
      'Java Frameworks (Spring, Spring Boot)',
      'Hibernate / JPA',
      'REST API development',
      'Microservices Architecture',
      'Cloud Basics (AWS / Azure / GCP)'
    ],
    tools: [
      'Git & GitHub',
      'Maven / Gradle',
      'Postman',
      'IntelliJ IDEA / Eclipse',
      'Docker basics'
    ],
    optionalCourses: [
      'Messaging systems (Kafka / RabbitMQ)',
      'CI/CD (Jenkins, GitHub Actions)',
      'Kubernetes basics',
      'Frontend basics (HTML, CSS, JS)'
    ],
    skillsRequired: [
      'Strong Core Java fundamentals',
      'Ability to build REST APIs',
      'Understanding MVC & layered architecture',
      'Relational database knowledge',
      'Debugging & problem-solving skills',
      'Clean coding practices',
      'Basic microservices understanding',
      'Familiarity with Agile/Scrum'
    ],
    projects: [
      'CRUD API using Spring Boot',
      'Authentication & Authorization (JWT/Spring Security)',
      'Database integration (MySQL/PostgreSQL)',
      'Microservices demo project',
      'Dockerized Java application',
      'GitHub portfolio with 3–5 projects'
    ],
    certifications: [
      'Oracle Certified Associate Java Programmer (OCAJP)',
      'Oracle Certified Professional Java Programmer (OCPJP)',
      'Spring Professional Certification',
      'AWS Cloud Practitioner / Developer Associate'
    ],
    activities: [
      'Contribute to GitHub open-source projects',
      'Freelance / part-time backend development',
      'Hackathons & coding challenges',
      'Internships',
      'Build real-world Java applications'
    ]
  },
  // Add similar detailed structures for other career paths
  'Python Developer': {
    coreCourses: ['Python Fundamentals', 'OOP in Python', 'Data Structures', 'Web Frameworks (Django/Flask)', 'Database Management'],
    advancedCourses: ['Advanced Python', 'RESTful APIs', 'Asynchronous Programming', 'Testing & TDD', 'Cloud Deployment'],
    tools: ['PyCharm/VS Code', 'Git', 'Docker', 'Postman', 'PostgreSQL'],
    optionalCourses: ['Machine Learning Basics', 'Web Scraping', 'GraphQL', 'Celery'],
    skillsRequired: ['Python expertise', 'Web development', 'Database design', 'API development', 'Problem solving'],
    projects: ['Blog Application', 'E-commerce API', 'Data Analysis Dashboard', 'Chat Application', 'Portfolio Website'],
    certifications: ['PCAP', 'PCPP', 'AWS Certified Developer', 'Python Institute Certifications'],
    activities: ['Open source contributions', 'Code review participation', 'Tech meetups', 'Online coding challenges']
  }
};

const CareerPathDetailsStep = ({ careerPath, onNext }: CareerPathDetailsStepProps) => {
  const details = pathDetails[careerPath] || pathDetails['Java Developer'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-neutral-900 mb-3">
          {careerPath} Career Path
        </h2>
        <p className="text-lg text-neutral-600">
          Everything you need to become a successful {careerPath}
        </p>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full mb-6">
          <TabsTrigger value="core">Core</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="optional">Optional</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certs">Certs</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[500px] w-full rounded-lg border p-6">
          <TabsContent value="core" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                  🧱 Core Courses to Learn
                </CardTitle>
                <CardDescription>
                  Essential fundamentals you must master
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.coreCourses.map((course: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                      <Badge className="mt-1">{index + 1}</Badge>
                      <span className="text-lg">{course}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-teal-600" />
                  🚀 Advanced Courses
                </CardTitle>
                <CardDescription>
                  Take your skills to the next level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.advancedCourses.map((course: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Badge variant="secondary" className="mt-1">{index + 1}</Badge>
                      <span className="text-lg">{course}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-6 w-6 text-teal-600" />
                  🧰 Tools You Must Learn
                </CardTitle>
                <CardDescription>
                  Essential tools for daily development work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {details.tools.map((tool: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <Wrench className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">{tool}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optional" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-teal-600" />
                  🌟 Optional but Valuable Courses
                </CardTitle>
                <CardDescription>
                  Stand out from the competition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.optionalCourses.map((course: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <Star className="h-5 w-5 text-amber-600" />
                      <span className="text-lg">{course}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-teal-600" />
                  🧠 Skills Required for a Job
                </CardTitle>
                <CardDescription>
                  What employers are looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {details.skillsRequired.map((skill: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2">
                      <div className="h-2 w-2 bg-teal-600 rounded-full"></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-6 w-6 text-teal-600" />
                  🗂️ Hands-On Projects You Must Build
                </CardTitle>
                <CardDescription>
                  Build your portfolio with real projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.projects.map((project: string, index: number) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-green-600">{index + 1}</Badge>
                        <div>
                          <span className="font-medium text-lg">{project}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certs" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-teal-600" />
                  🥇 Recommended Certifications
                </CardTitle>
                <CardDescription>
                  Boost your credibility and job prospects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.certifications.map((cert: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <Award className="h-6 w-6 text-indigo-600 mt-1" />
                      <div>
                        <span className="font-semibold text-lg">{cert}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                  🎯 Experience-Building Activities
                </CardTitle>
                <CardDescription>
                  Gain practical experience before landing a job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.activities.map((activity: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-rose-600" />
                      <span className="text-lg">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button
          onClick={onNext}
          size="lg"
          className="px-12 py-6 text-lg bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
        >
          Choose Learning Mode
        </Button>
      </div>
    </div>
  );
};

export default CareerPathDetailsStep;
