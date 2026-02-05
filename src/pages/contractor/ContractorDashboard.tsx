import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  FileCheck,
  Video,
  ChevronRight,
  Clock,
  Eye,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import BarLoader from "@/components/loader/BarLoader";

const interviewInvitations = [
  {
    id: 1,
    company: "TechCorp",
    role: "Senior React Developer",
    scheduledDate: "2024-02-10",
    status: "pending",
  },
  {
    id: 2,
    company: "InnovateLab",
    role: "Full Stack Engineer",
    scheduledDate: "2024-02-12",
    status: "confirmed",
  },
];

const skillTestInvitations = [
  {
    id: 1,
    company: "DataFlow",
    role: "Frontend Specialist",
    testName: "React Advanced",
    deadline: "2024-02-08",
    duration: "45 min",
  },
  {
    id: 2,
    company: "CloudSys",
    role: "UI Developer",
    testName: "JavaScript Fundamentals",
    deadline: "2024-02-15",
    duration: "30 min",
  },
];

const profileViews = [
  {
    id: 1,
    company: "TechCorp",
    viewedAt: "2 hours ago",
    recruiterName: "Sarah Johnson",
  },
  {
    id: 2,
    company: "InnovateLab",
    viewedAt: "5 hours ago",
    recruiterName: "Mike Chen",
  },
  {
    id: 3,
    company: "DataFlow",
    viewedAt: "1 day ago",
    recruiterName: "Emily Davis",
  },
];

const ContractorDashboard = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <BarLoader />
        <p className="text-muted-foreground animate-pulse">
          Personalizing your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-green-400 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h2>
            <p className="text-white/80">
              You have 2 new interview invitations and 2 skill tests pending.
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
            asChild
          >
            <Link to="/contractor/profile">Complete Profile</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">
                  Interview Invites
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Pending Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Profile Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">87</p>
                <p className="text-sm text-muted-foreground">Skill Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Interview Invitations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              AI Interview Invitations
            </CardTitle>
            <Link
              to="/contractor/interviews"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {interviewInvitations.map((invite) => (
              <div
                key={invite.id}
                className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {invite.role}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {invite.company}
                    </p>
                  </div>
                  <Badge
                    variant={
                      invite.status === "confirmed" ? "default" : "secondary"
                    }
                  >
                    {invite.status === "confirmed" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" /> Pending
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{invite.scheduledDate}</span>
                </div>
                <div className="flex gap-2">
                  {invite.status === "pending" ? (
                    <>
                      <Button size="sm" className="flex-1 rounded-lg">
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                      >
                        Reschedule
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="flex-1 rounded-lg">
                      Join Interview
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skill Test Invitations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              Skill Test Invitations
            </CardTitle>
            <Link
              to="/contractor/tests"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillTestInvitations.map((test) => (
              <div
                key={test.id}
                className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {test.testName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{test.role}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {test.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {test.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {test.deadline}
                  </span>
                </div>
                <Button size="sm" className="w-full rounded-lg">
                  Take Test
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Views */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Recent Profile Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileViews.map((view) => (
                <div
                  key={view.id}
                  className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {view.company}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {view.recruiterName}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {view.viewedAt}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Gap Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Skill Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>React.js</span>
                <span className="text-primary font-medium">Expert</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>TypeScript</span>
                <span className="text-primary font-medium">Advanced</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Node.js</span>
                <span className="text-orange-500 font-medium">
                  Intermediate
                </span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>AWS</span>
                <span className="text-red-500 font-medium">Needs Work</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-lg"
                asChild
              >
                <Link to="/contractor/tests">View All Tests</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractorDashboard;
