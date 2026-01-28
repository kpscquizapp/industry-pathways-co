import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, RotateCcw, Sparkles } from 'lucide-react';

interface FilterState {
  aiScoreMin: number;
  skillsMatchMin: number;
  experienceRange: [number, number];
  location: string;
  availability: string;
  education: string;
  assessmentStatus: string[];
  status: string[];
}

interface CandidateFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  totalCandidates: number;
  filteredCount: number;
}

const CandidateFilters: React.FC<CandidateFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  totalCandidates,
  filteredCount,
}) => {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'assessmentStatus' | 'status', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Filters</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="font-normal">
            {filteredCount} of {totalCandidates} candidates
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Match Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Match Score
            </Label>
            <span className="text-sm font-medium text-primary">{filters.aiScoreMin}%+</span>
          </div>
          <Slider
            value={[filters.aiScoreMin]}
            onValueChange={([value]) => updateFilter('aiScoreMin', value)}
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Skills Match */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Skills Match</Label>
            <span className="text-sm font-medium text-primary">{filters.skillsMatchMin}%+</span>
          </div>
          <Slider
            value={[filters.skillsMatchMin]}
            onValueChange={([value]) => updateFilter('skillsMatchMin', value)}
            min={0}
            max={100}
            step={5}
          />
        </div>

        {/* Experience Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Experience (years)</Label>
            <span className="text-sm font-medium text-primary">
              {filters.experienceRange[0]}-{filters.experienceRange[1]} yrs
            </span>
          </div>
          <Slider
            value={filters.experienceRange}
            onValueChange={(value) => updateFilter('experienceRange', value as [number, number])}
            min={0}
            max={20}
            step={1}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location</Label>
          <Select 
            value={filters.location} 
            onValueChange={(value) => updateFilter('location', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Location</SelectItem>
              <SelectItem value="remote">Remote Only</SelectItem>
              <SelectItem value="onsite">On-site Only</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="warsaw">Warsaw</SelectItem>
              <SelectItem value="krakow">Krakow</SelectItem>
              <SelectItem value="berlin">Berlin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Availability</Label>
          <Select 
            value={filters.availability} 
            onValueChange={(value) => updateFilter('availability', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Availability</SelectItem>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="2weeks">Within 2 weeks</SelectItem>
              <SelectItem value="1month">Within 1 month</SelectItem>
              <SelectItem value="3months">Within 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Education</Label>
          <Select 
            value={filters.education} 
            onValueChange={(value) => updateFilter('education', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Education</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assessment Status */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Assessment Status</Label>
          <div className="space-y-2">
            {[
              { value: 'completed', label: 'Assessment Completed' },
              { value: 'pending', label: 'Assessment Pending' },
              { value: 'not_started', label: 'Not Started' },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`assessment-${option.value}`}
                  checked={filters.assessmentStatus.includes(option.value)}
                  onCheckedChange={() => toggleArrayFilter('assessmentStatus', option.value)}
                />
                <Label 
                  htmlFor={`assessment-${option.value}`} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Status */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Candidate Status</Label>
          <div className="space-y-2">
            {[
              { value: 'new', label: 'New' },
              { value: 'reviewed', label: 'Reviewed' },
              { value: 'interviewed', label: 'Interviewed' },
              { value: 'shortlisted', label: 'Shortlisted' },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.status.includes(option.value)}
                  onCheckedChange={() => toggleArrayFilter('status', option.value)}
                />
                <Label 
                  htmlFor={`status-${option.value}`} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateFilters;
