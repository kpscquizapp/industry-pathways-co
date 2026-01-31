import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock,
  ChevronRight,
  Plus,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SpinnerLoader from '@/components/loader/SpinnerLoader';

const benchTalent = [
  { id: 1, name: 'Sarah Chen', skills: ['React', 'Node.js'], score: 92, status: 'available', matches: 5 },
  { id: 2, name: 'Alex Kumar', skills: ['Python', 'AWS'], score: 88, status: 'interviewing', matches: 3 },
  { id: 3, name: 'Maria Silva', skills: ['Java', 'Spring'], score: 85, status: 'available', matches: 7 },
  { id: 4, name: 'James Wilson', skills: ['Angular', 'TypeScript'], score: 90, status: 'placed', matches: 0 },
];

const BenchDashboard = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <SpinnerLoader className="w-10 h-10 text-primary" />
        <p className="text-muted-foreground animate-pulse">Fetching bench resources...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Bench Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">67%</p>
                <p className="text-sm text-muted-foreground">Utilization Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">$24.5K</p>
                <p className="text-sm text-muted-foreground">Revenue MTD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-sm text-muted-foreground">Avg Days to Place</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bench Talent Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bench Talent</CardTitle>
              <Button size="sm" className="rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benchTalent.map((talent) => (
                  <div key={talent.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-green-400/30 flex items-center justify-center">
                        <span className="font-semibold text-sm">{talent.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="font-medium">{talent.name}</p>
                        <div className="flex gap-1 mt-1">
                          {talent.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{talent.score}</p>
                        <p className="text-xs text-muted-foreground">AI Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{talent.matches}</p>
                        <p className="text-xs text-muted-foreground">Matches</p>
                      </div>
                      <Badge 
                        variant={talent.status === 'available' ? 'default' : talent.status === 'interviewing' ? 'secondary' : 'outline'}
                        className={talent.status === 'available' ? 'bg-green-500' : ''}
                      >
                        {talent.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics & Requests */}
        <div className="space-y-6">
          {/* Job Match Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Incoming Requests
                <Badge className="bg-primary">3 New</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Senior React Dev</p>
                  <Badge variant="secondary">InnovateLab</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Match: Sarah Chen (92%)</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-lg text-xs">Decline</Button>
                  <Button size="sm" className="flex-1 rounded-lg text-xs">Submit</Button>
                </div>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Python Engineer</p>
                  <Badge variant="secondary">DataFlow</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Match: Alex Kumar (88%)</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-lg text-xs">Decline</Button>
                  <Button size="sm" className="flex-1 rounded-lg text-xs">Submit</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Demand Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Demand Trends</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>React.js</span>
                  <span className="text-primary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +15%
                  </span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Python</span>
                  <span className="text-primary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12%
                  </span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>AWS</span>
                  <span className="text-primary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +20%
                  </span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Java</span>
                  <span className="text-muted-foreground">0%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BenchDashboard;
