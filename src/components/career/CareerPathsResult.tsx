
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, BriefcaseBusiness, GraduationCap, LineChart, Award } from 'lucide-react';
import { CareerPath, Course } from '@/types/job';

interface CareerPathsResultProps {
  careerPaths: CareerPath[];
  onBack: () => void;
  experience: 'experienced' | 'fresher';
}

const CareerPathsResult = ({ careerPaths, onBack, experience }: CareerPathsResultProps) => {
  const { translations } = useLanguage();
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(careerPaths[0] || null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-neutral-800">
          {translations.recommendedCareerPaths}
        </h2>
        <Button variant="outline" onClick={onBack}>
          {translations.back}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Career paths list */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-700">
            {translations.availablePaths}
          </h3>
          
          <div className="space-y-3">
            {careerPaths.map((path) => (
              <Card 
                key={path.id}
                className={`cursor-pointer transition hover:shadow-md ${selectedPath?.id === path.id ? 'border-teal-500 ring-1 ring-teal-500' : ''}`}
                onClick={() => {
                  setSelectedPath(path);
                  setSelectedCourse(null);
                }}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-teal-600">
                      <LineChart className="w-3 h-3 mr-1" />
                      <span>{translations[path.demandLevel]}</span>
                    </div>
                    <div>{path.salaryRange}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right columns - Path details and courses */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPath ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BriefcaseBusiness className="mr-2 h-5 w-5 text-teal-600" />
                    {selectedPath.title}
                  </CardTitle>
                  <CardDescription>{selectedPath.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">{translations.requiredSkills}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPath.requiredSkills.map((skill) => (
                          <span 
                            key={skill} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <div className="text-sm text-neutral-500">{translations.salaryRange}</div>
                        <div className="font-medium">{selectedPath.salaryRange}</div>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <div className="text-sm text-neutral-500">{translations.demandLevel}</div>
                        <div className="font-medium">{translations[selectedPath.demandLevel]}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-medium text-neutral-700 mb-4 flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-teal-600" />
                  {translations.recommendedCourses}
                </h3>
                
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full justify-start mb-4">
                    <TabsTrigger value="all">{translations.all}</TabsTrigger>
                    <TabsTrigger value="beginner">{translations.beginner}</TabsTrigger>
                    <TabsTrigger value="intermediate">{translations.intermediate}</TabsTrigger>
                    <TabsTrigger value="advanced">{translations.advanced}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {selectedPath.recommendedCourses.map((course) => (
                      <CourseCard 
                        key={course.id}
                        course={course}
                        onClick={() => setSelectedCourse(course)}
                        isSelected={selectedCourse?.id === course.id}
                      />
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="beginner" className="space-y-4">
                    {selectedPath.recommendedCourses
                      .filter(course => course.level === 'beginner')
                      .map((course) => (
                        <CourseCard 
                          key={course.id}
                          course={course}
                          onClick={() => setSelectedCourse(course)}
                          isSelected={selectedCourse?.id === course.id}
                        />
                      ))}
                  </TabsContent>
                  
                  <TabsContent value="intermediate" className="space-y-4">
                    {selectedPath.recommendedCourses
                      .filter(course => course.level === 'intermediate')
                      .map((course) => (
                        <CourseCard 
                          key={course.id}
                          course={course}
                          onClick={() => setSelectedCourse(course)}
                          isSelected={selectedCourse?.id === course.id}
                        />
                      ))}
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4">
                    {selectedPath.recommendedCourses
                      .filter(course => course.level === 'advanced')
                      .map((course) => (
                        <CourseCard 
                          key={course.id}
                          course={course}
                          onClick={() => setSelectedCourse(course)}
                          isSelected={selectedCourse?.id === course.id}
                        />
                      ))}
                  </TabsContent>
                </Tabs>
              </div>
              
              {selectedCourse && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-teal-600" />
                      {selectedCourse.title}
                    </CardTitle>
                    <CardDescription>{translations.providedBy} {selectedCourse.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{selectedCourse.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <div className="text-sm text-neutral-500">{translations.duration}</div>
                        <div className="font-medium">{selectedCourse.duration}</div>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <div className="text-sm text-neutral-500">{translations.cost}</div>
                        <div className="font-medium">{selectedCourse.cost}</div>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <div className="text-sm text-neutral-500">{translations.level}</div>
                        <div className="font-medium">{translations[selectedCourse.level]}</div>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <a href={selectedCourse.url} target="_blank" rel="noopener noreferrer">
                        {translations.goToCourse}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-60 text-neutral-400">
              {translations.selectPath}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  isSelected: boolean;
}

const CourseCard = ({ course, onClick, isSelected }: CourseCardProps) => {
  const { translations } = useLanguage();
  
  return (
    <Card 
      className={`cursor-pointer transition hover:shadow-md ${isSelected ? 'border-teal-500 ring-1 ring-1 ring-teal-500' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h4 className="font-medium">{course.title}</h4>
          <div className="flex items-center mt-1">
            <span className="text-sm text-neutral-500">{course.provider}</span>
            <span className="mx-2 text-neutral-300">•</span>
            <span className="text-sm text-neutral-500">{course.duration}</span>
          </div>
          <div className="mt-1">
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
              course.level === 'beginner' ? 'bg-green-100 text-green-800' :
              course.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {translations[course.level]}
            </span>
          </div>
        </div>
        <div className="text-sm font-semibold">{course.cost}</div>
      </CardContent>
    </Card>
  );
};

export default CareerPathsResult;
