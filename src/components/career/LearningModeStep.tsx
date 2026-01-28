import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Laptop, School } from 'lucide-react';

interface LearningModeStepProps {
  learningMode: 'online' | 'offline' | null;
  setLearningMode: (value: 'online' | 'offline') => void;
  onNext: () => void;
}

const LearningModeStep = ({ learningMode, setLearningMode, onNext }: LearningModeStepProps) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          How do you want to learn?
        </h2>
        <p className="text-lg text-neutral-600">
          Choose your preferred learning style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Online Learning */}
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
            learningMode === 'online'
              ? 'ring-4 ring-teal-600 shadow-2xl scale-105'
              : 'hover:scale-102'
          }`}
          onClick={() => setLearningMode('online')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Laptop className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-3xl">📚 Online Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-lg mb-6">
              Learn at your own pace with flexible schedules
            </CardDescription>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <span>Access courses anytime, anywhere</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <span>Wide variety of platforms to choose from</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <span>Usually more affordable</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <span>Self-paced learning</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Learning */}
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
            learningMode === 'offline'
              ? 'ring-4 ring-teal-600 shadow-2xl scale-105'
              : 'hover:scale-102'
          }`}
          onClick={() => setLearningMode('offline')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-3xl">🏫 Offline Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-lg mb-6">
              Classroom training with direct mentorship
            </CardDescription>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-teal-600 rounded-full mt-2"></div>
                <span>Face-to-face interaction with instructors</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-teal-600 rounded-full mt-2"></div>
                <span>Structured learning environment</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-teal-600 rounded-full mt-2"></div>
                <span>Networking opportunities</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-teal-600 rounded-full mt-2"></div>
                <span>Hands-on practical sessions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-10">
        <Button
          onClick={onNext}
          disabled={!learningMode}
          size="lg"
          className="px-12 py-6 text-lg bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
        >
          Show Me {learningMode === 'online' ? 'Platforms' : 'Institutes'}
        </Button>
      </div>
    </div>
  );
};

export default LearningModeStep;
