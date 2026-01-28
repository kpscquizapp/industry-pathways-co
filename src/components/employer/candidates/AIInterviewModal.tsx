import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Video, 
  Mic, 
  MessageSquare, 
  ClipboardCheck,
  Clock,
  Calendar as CalendarIcon,
  Sparkles,
  Send,
  Check,
  ChevronRight,
  ChevronLeft,
  Mail,
  AlertCircle
} from 'lucide-react';
import { Candidate } from './CandidateCard';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AIInterviewModalProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
  onComplete: (candidate: Candidate, settings: InterviewSettings) => void;
}

interface InterviewSettings {
  type: 'video' | 'audio' | 'text' | 'assessment';
  duration: number;
  questionSet: 'ai_generated' | 'custom' | 'role_based';
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  autoEvaluation: boolean;
  scheduling: 'immediate' | 'scheduled' | 'flexible';
  scheduledDate?: Date;
  flexibleWindow?: '24' | '48' | '72';
  customQuestions?: string;
}

const steps = [
  { id: 1, title: 'Interview Type', icon: Video },
  { id: 2, title: 'Configure', icon: Sparkles },
  { id: 3, title: 'Schedule', icon: CalendarIcon },
  { id: 4, title: 'Confirm', icon: Check },
];

const AIInterviewModal: React.FC<AIInterviewModalProps> = ({
  candidate,
  open,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState<InterviewSettings>({
    type: 'video',
    duration: 30,
    questionSet: 'ai_generated',
    difficulty: 'medium',
    language: 'en',
    autoEvaluation: true,
    scheduling: 'immediate',
  });

  const updateSettings = <K extends keyof InterviewSettings>(key: K, value: InterviewSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (candidate) {
      onComplete(candidate, settings);
      toast.success('AI Interview scheduled successfully!');
      onClose();
      setCurrentStep(1);
    }
  };

  const interviewTypes = [
    { 
      value: 'video', 
      label: 'AI Video Interview', 
      icon: Video, 
      description: 'Face-to-face AI interview with video recording',
      recommended: true 
    },
    { 
      value: 'audio', 
      label: 'AI Audio Interview', 
      icon: Mic, 
      description: 'Voice-only interview for focused conversation' 
    },
    { 
      value: 'text', 
      label: 'AI Text Interview', 
      icon: MessageSquare, 
      description: 'Text-based Q&A format' 
    },
    { 
      value: 'assessment', 
      label: 'Role-based Assessment', 
      icon: ClipboardCheck, 
      description: 'Technical or skills assessment' 
    },
  ];

  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Schedule AI Interview
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            for {candidate.name}
          </p>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 mt-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                    currentStep >= step.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-xs mt-1.5 font-medium",
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2",
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Step 1: Interview Type */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Select Interview Type</h3>
            <RadioGroup 
              value={settings.type} 
              onValueChange={(value) => updateSettings('type', value as InterviewSettings['type'])}
              className="space-y-3"
            >
              {interviewTypes.map((type) => (
                <Card 
                  key={type.value}
                  className={cn(
                    "cursor-pointer transition-all",
                    settings.type === type.value && "ring-2 ring-primary"
                  )}
                  onClick={() => updateSettings('type', type.value as InterviewSettings['type'])}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      settings.type === type.value ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={type.value} className="font-medium cursor-pointer">
                          {type.label}
                        </Label>
                        {type.recommended && (
                          <Badge className="bg-primary/10 text-primary text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Configure */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="font-semibold">Configure Interview</h3>

            {/* Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Interview Duration
                </Label>
                <span className="text-sm font-medium text-primary">{settings.duration} minutes</span>
              </div>
              <Slider
                value={[settings.duration]}
                onValueChange={([value]) => updateSettings('duration', value)}
                min={15}
                max={60}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>15 min</span>
                <span>30 min</span>
                <span>45 min</span>
                <span>60 min</span>
              </div>
            </div>

            {/* Question Set */}
            <div className="space-y-2">
              <Label>Question Set</Label>
              <Select 
                value={settings.questionSet}
                onValueChange={(value) => updateSettings('questionSet', value as InterviewSettings['questionSet'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai_generated">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI-Generated Questions
                    </div>
                  </SelectItem>
                  <SelectItem value="role_based">Role-Specific Questions</SelectItem>
                  <SelectItem value="custom">Custom Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.questionSet === 'custom' && (
              <div className="space-y-2">
                <Label>Custom Questions</Label>
                <Textarea 
                  placeholder="Enter your custom interview questions..."
                  value={settings.customQuestions || ''}
                  onChange={(e) => updateSettings('customQuestions', e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {/* Difficulty */}
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <RadioGroup 
                value={settings.difficulty}
                onValueChange={(value) => updateSettings('difficulty', value as InterviewSettings['difficulty'])}
                className="flex gap-4"
              >
                {['easy', 'medium', 'hard'].map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <RadioGroupItem value={level} id={`difficulty-${level}`} />
                    <Label htmlFor={`difficulty-${level}`} className="capitalize cursor-pointer">
                      {level}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>Interview Language</Label>
              <Select 
                value={settings.language}
                onValueChange={(value) => updateSettings('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pl">Polish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auto Evaluation */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Auto AI Evaluation
                </Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Automatically generate scores and insights after interview
                </p>
              </div>
              <Switch
                checked={settings.autoEvaluation}
                onCheckedChange={(checked) => updateSettings('autoEvaluation', checked)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="font-semibold">Schedule Interview</h3>

            <RadioGroup 
              value={settings.scheduling}
              onValueChange={(value) => updateSettings('scheduling', value as InterviewSettings['scheduling'])}
              className="space-y-3"
            >
              <Card 
                className={cn(
                  "cursor-pointer",
                  settings.scheduling === 'immediate' && "ring-2 ring-primary"
                )}
                onClick={() => updateSettings('scheduling', 'immediate')}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Send className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="immediate" className="font-medium cursor-pointer">
                      Send Immediately
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Candidate receives interview invite right away
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "cursor-pointer",
                  settings.scheduling === 'scheduled' && "ring-2 ring-primary"
                )}
                onClick={() => updateSettings('scheduling', 'scheduled')}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Label htmlFor="scheduled" className="font-medium cursor-pointer">
                      Schedule Date & Time
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Set a specific date and time for the interview
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "cursor-pointer",
                  settings.scheduling === 'flexible' && "ring-2 ring-primary"
                )}
                onClick={() => updateSettings('scheduling', 'flexible')}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="flexible" className="font-medium cursor-pointer">
                      Flexible Window
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow candidate to complete within a time window
                    </p>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>

            {settings.scheduling === 'scheduled' && (
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {settings.scheduledDate 
                        ? format(settings.scheduledDate, 'PPP')
                        : 'Pick a date'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={settings.scheduledDate}
                      onSelect={(date) => updateSettings('scheduledDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {settings.scheduling === 'flexible' && (
              <div className="space-y-2">
                <Label>Completion Window</Label>
                <Select 
                  value={settings.flexibleWindow}
                  onValueChange={(value) => updateSettings('flexibleWindow', value as InterviewSettings['flexibleWindow'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                    <SelectItem value="72">72 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="font-semibold">Confirm & Send</h3>

            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interview Type</span>
                  <span className="font-medium capitalize">{settings.type} Interview</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{settings.duration} minutes</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Question Set</span>
                  <span className="font-medium capitalize">{settings.questionSet.replace('_', ' ')}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-medium capitalize">{settings.difficulty}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">{settings.language.toUpperCase()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduling</span>
                  <span className="font-medium capitalize">{settings.scheduling}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto Evaluation</span>
                  <span className="font-medium">{settings.autoEvaluation ? 'Enabled' : 'Disabled'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Email Preview */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">Email Preview</span>
                </div>
                <div className="bg-background p-3 rounded-lg border text-sm">
                  <p className="font-medium">Subject: AI Interview Invitation - Senior Developer Role</p>
                  <Separator className="my-2" />
                  <p>Dear {candidate.name},</p>
                  <p className="mt-2">
                    You have been invited to complete an AI-powered {settings.type} interview for the Senior Developer position.
                  </p>
                  <p className="mt-2">
                    Duration: {settings.duration} minutes<br />
                    {settings.scheduling === 'flexible' 
                      ? `Complete within: ${settings.flexibleWindow} hours`
                      : settings.scheduling === 'scheduled' && settings.scheduledDate
                        ? `Scheduled: ${format(settings.scheduledDate, 'PPP')}`
                        : 'Available: Immediately'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-800">
                The candidate will receive an email notification with the interview link.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
          >
            {currentStep === 1 ? 'Cancel' : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </>
            )}
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2" />
              Confirm & Send
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIInterviewModal;
