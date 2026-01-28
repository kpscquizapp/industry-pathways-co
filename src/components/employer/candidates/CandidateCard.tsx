import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, UserCheck, UserX, Video, Star, Briefcase, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Candidate {
  id: number;
  name: string;
  avatar?: string;
  currentRole: string;
  experience: string;
  location: string;
  aiScore: number;
  skillsMatch: number;
  experienceMatch: number;
  cultureFit: number;
  tags: string[];
  status: 'new' | 'reviewed' | 'interviewed' | 'shortlisted' | 'rejected';
  interviewStatus?: 'pending' | 'in_progress' | 'completed' | 'results_available';
  appliedDate: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
  onScheduleInterview: (candidate: Candidate) => void;
  onShortlist: (candidate: Candidate) => void;
  onReject: (candidate: Candidate) => void;
  isSelected?: boolean;
  viewMode?: 'grid' | 'list';
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-500';
};

const getScoreRingColor = (score: number) => {
  if (score >= 80) return 'stroke-green-500';
  if (score >= 60) return 'stroke-amber-500';
  return 'stroke-red-500';
};

const getStatusBadge = (status: Candidate['status']) => {
  const variants: Record<Candidate['status'], { label: string; className: string }> = {
    new: { label: 'New', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    reviewed: { label: 'Reviewed', className: 'bg-purple-100 text-purple-700 border-purple-200' },
    interviewed: { label: 'Interviewed', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    shortlisted: { label: 'Shortlisted', className: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
  };
  return variants[status];
};

const getInterviewStatusBadge = (status: Candidate['interviewStatus']) => {
  if (!status) return null;
  const variants: Record<NonNullable<Candidate['interviewStatus']>, { label: string; icon: React.ReactNode; className: string }> = {
    pending: { label: 'Pending AI Interview', icon: <span className="mr-1">🕒</span>, className: 'bg-gray-100 text-gray-700' },
    in_progress: { label: 'In Progress', icon: <span className="mr-1">🎥</span>, className: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completed', icon: <span className="mr-1">✅</span>, className: 'bg-green-100 text-green-700' },
    results_available: { label: 'Results Available', icon: <span className="mr-1">📊</span>, className: 'bg-purple-100 text-purple-700' },
  };
  return variants[status];
};

const CircularProgress = ({ score, size = 64 }: { score: number; size?: number }) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-500", getScoreRingColor(score))}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-lg font-bold", getScoreColor(score))}>{score}%</span>
      </div>
    </div>
  );
};

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  onScheduleInterview,
  onShortlist,
  onReject,
  isSelected,
  viewMode = 'grid',
}) => {
  const statusBadge = getStatusBadge(candidate.status);
  const interviewBadge = getInterviewStatusBadge(candidate.interviewStatus);

  if (viewMode === 'list') {
    return (
      <Card 
        className={cn(
          "hover:shadow-md transition-all cursor-pointer",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={() => onSelect(candidate)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
                <Badge variant="outline" className={statusBadge.className}>
                  {statusBadge.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{candidate.currentRole}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {candidate.experience}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {candidate.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <CircularProgress score={candidate.aiScore} size={48} />
                <p className="text-xs text-muted-foreground mt-1">AI Score</p>
              </div>
              
              <div className="hidden md:flex flex-col gap-1 w-32">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-14">Skills</span>
                  <Progress value={candidate.skillsMatch} className="h-2" />
                  <span className="text-xs font-medium w-8">{candidate.skillsMatch}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-14">Exp</span>
                  <Progress value={candidate.experienceMatch} className="h-2" />
                  <span className="text-xs font-medium w-8">{candidate.experienceMatch}%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); onScheduleInterview(candidate); }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Video className="h-4 w-4 mr-1" />
                  AI Interview
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); onShortlist(candidate); }}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); onReject(candidate); }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <UserX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-all cursor-pointer group",
        isSelected && "ring-2 ring-primary",
        candidate.aiScore >= 80 && "border-l-4 border-l-green-500"
      )}
      onClick={() => onSelect(candidate)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.currentRole}</p>
            </div>
          </div>
          <CircularProgress score={candidate.aiScore} />
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{candidate.experience}</span>
          <span className="mx-1">•</span>
          <MapPin className="h-4 w-4" />
          <span>{candidate.location}</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-20">Skills Match</span>
            <Progress value={candidate.skillsMatch} className="h-2 flex-1" />
            <span className={cn("text-xs font-medium w-10", getScoreColor(candidate.skillsMatch))}>
              {candidate.skillsMatch}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-20">Experience</span>
            <Progress value={candidate.experienceMatch} className="h-2 flex-1" />
            <span className={cn("text-xs font-medium w-10", getScoreColor(candidate.experienceMatch))}>
              {candidate.experienceMatch}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-20">Culture Fit</span>
            <Progress value={candidate.cultureFit} className="h-2 flex-1" />
            <span className={cn("text-xs font-medium w-10", getScoreColor(candidate.cultureFit))}>
              {candidate.cultureFit}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {candidate.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-primary/5 text-primary border-primary/20"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={statusBadge.className}>
            {statusBadge.label}
          </Badge>
          {interviewBadge && (
            <Badge variant="outline" className={interviewBadge.className}>
              {interviewBadge.icon}
              {interviewBadge.label}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={(e) => { e.stopPropagation(); onScheduleInterview(candidate); }}
          >
            <Video className="h-4 w-4 mr-2" />
            AI Interview
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={(e) => { e.stopPropagation(); onShortlist(candidate); }}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <UserCheck className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={(e) => { e.stopPropagation(); onReject(candidate); }}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <UserX className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
