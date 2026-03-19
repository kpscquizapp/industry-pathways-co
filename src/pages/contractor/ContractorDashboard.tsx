import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
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
  const { userDetails } = useSelector((state: RootState) => state.user);
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
            <h2 className="text-2xl font-bold mb-2">
              Welcome, {userDetails?.firstName?.trim() || "there"}! 👋
            </h2>
          </div>
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
                <p className="text-2xl font-bold">-</p>
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
                <p className="text-2xl font-bold">-</p>
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
                <p className="text-2xl font-bold">-</p>
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
                <p className="text-2xl font-bold">-</p>
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
        </Card>
      </div>

    </div>
  );
};

export default ContractorDashboard;
