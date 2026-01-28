import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Award, MapPin, Star, Users } from 'lucide-react';

interface PlatformSuggestionsStepProps {
  learningMode: 'online' | 'offline';
  careerPath: string;
  onNext: () => void;
}

const onlinePlatforms = [
  {
    name: 'LinkedIn Learning',
    description: 'Professional courses with industry certificates',
    duration: 'Self-paced',
    certification: 'Yes',
    price: '₹1,999/month',
    rating: 4.7
  },
  {
    name: 'Pluralsight',
    description: 'Technology skills platform for developers',
    duration: 'Self-paced',
    certification: 'Yes',
    price: '₹2,499/month',
    rating: 4.6
  },
  {
    name: 'Udemy',
    description: 'Wide variety of affordable courses',
    duration: 'Lifetime access',
    certification: 'Yes',
    price: '₹499-₹2,999',
    rating: 4.5
  },
  {
    name: 'Coursera',
    description: 'University-level courses and degrees',
    duration: 'Flexible schedule',
    certification: 'Yes',
    price: '₹3,999/month',
    rating: 4.8
  },
  {
    name: 'Edureka',
    description: 'Live interactive classes with mentors',
    duration: '4-8 weeks',
    certification: 'Yes',
    price: '₹15,000-₹40,000',
    rating: 4.4
  },
  {
    name: 'Codecademy',
    description: 'Interactive coding lessons',
    duration: 'Self-paced',
    certification: 'Yes',
    price: '₹1,599/month',
    rating: 4.5
  }
];

const offlineInstitutes = [
  {
    name: 'NIIT',
    location: 'Bangalore (Koramangala)',
    duration: '3-6 months',
    placement: 'Yes',
    rating: 4.3,
    reviews: 250
  },
  {
    name: 'Aptech Learning',
    location: 'Bangalore (Marathahalli)',
    duration: '4-8 months',
    placement: 'Yes',
    rating: 4.2,
    reviews: 180
  },
  {
    name: 'Java Full Stack Training Institute',
    location: 'Bangalore (BTM Layout)',
    duration: '3-5 months',
    placement: 'Yes',
    rating: 4.4,
    reviews: 320
  },
  {
    name: 'Besant Technologies',
    location: 'Bangalore (Jayanagar)',
    duration: '2-4 months',
    placement: 'Yes',
    rating: 4.1,
    reviews: 150
  },
  {
    name: 'Simplilearn Offline Center',
    location: 'Bangalore (Indiranagar)',
    duration: '4-6 months',
    placement: 'Yes',
    rating: 4.5,
    reviews: 420
  }
];

const PlatformSuggestionsStep = ({ learningMode, careerPath, onNext }: PlatformSuggestionsStepProps) => {
  const items = learningMode === 'online' ? onlinePlatforms : offlineInstitutes;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          {learningMode === 'online' ? 'Recommended Online Platforms' : 'Nearby Training Institutes'}
        </h2>
        <p className="text-lg text-neutral-600">
          {learningMode === 'online' 
            ? 'Top platforms to learn and get certified'
            : 'Best institutes in Bangalore for classroom training'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {learningMode === 'online' ? (
          onlinePlatforms.map((platform, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{platform.name}</CardTitle>
                  <Badge className="bg-teal-600">
                    <Star className="h-3 w-3 mr-1" />
                    {platform.rating}
                  </Badge>
                </div>
                <CardDescription>{platform.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-neutral-500" />
                    <span>{platform.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-neutral-500" />
                    <span>Certification: {platform.certification}</span>
                  </div>
                  <div className="text-teal-600 font-semibold text-lg">
                    {platform.price}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Visit Platform
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          offlineInstitutes.map((institute, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{institute.name}</CardTitle>
                  <Badge className="bg-teal-600">
                    <Star className="h-3 w-3 mr-1" />
                    {institute.rating}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {institute.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-neutral-500" />
                    <span>Duration: {institute.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-neutral-500" />
                    <span>Placement Support: {institute.placement}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-neutral-500" />
                    <span>{institute.reviews} reviews</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Contact Institute
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          size="lg"
          className="px-12 py-6 text-lg bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
        >
          View Certification Requirements
        </Button>
      </div>
    </div>
  );
};

export default PlatformSuggestionsStep;
