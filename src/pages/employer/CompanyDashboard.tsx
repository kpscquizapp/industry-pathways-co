import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetBenchDashboardQuery } from "@/app/queries/employerApi";
import { useGetBenchResourcesQuery } from "@/app/queries/benchApi";
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Bot,
  FileText,
  Eye,
  Target,
  Award,
  ClipboardCheck,
  Handshake,
  Gauge,
  DollarSign,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Filter,
  Calendar
} from "lucide-react";

const CompanyDashboard = () => {
  const { data: benchData } = useGetBenchResourcesQuery({ page: 1, limit: 1 });
  const totalResources = benchData?.pagination?.total ?? 0;
  const { data: dashboardData } = useGetBenchDashboardQuery();
  const kpiData = [

    {
      title: "Bench Utilization",
      value: dashboardData?.data?.benchUtilization ?? "0%",
      description: "Posted bench resources contracted",
      change: "+15%",
      trend: "up",
      icon: Gauge,
      gradient: "from-teal-500 to-emerald-600",
      bgGradient: "from-teal-50 to-emerald-50",
    },
    {
      title: "Active Resources",
      value: String(totalResources),
      description: "Currently listed on marketplace",
      change: "+3",
      trend: "up",
      icon: Users,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "Profile Views",
      value: String(dashboardData?.data?.profileViews ?? 0),
      description: "Views this week",
      change: "+28",
      trend: "up",
      icon: Eye,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
    },
    {
      title: "Contract Requests",
      value: "0",
      description: "Pending review",
      change: "+0",
      trend: "up",
      icon: Handshake,
      gradient: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
    },
  ];

  const recentActivity = [
    {
      type: "match",
      message: "8 new AI matches for Senior Developer role",
      time: "5 min ago",
      icon: Sparkles,
      color: "bg-violet-100 text-violet-600",
    },
    {
      type: "screening",
      message: "AI screening completed for 12 candidates",
      time: "1 hour ago",
      icon: Bot,
      color: "bg-blue-100 text-blue-600",
    },
    {
      type: "test",
      message: "5 candidates passed Java skill assessment",
      time: "2 hours ago",
      icon: ClipboardCheck,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      type: "hire",
      message: "Contract signed with bench resource",
      time: "1 day ago",
      icon: Handshake,
      color: "bg-green-100 text-green-600",
    },
  ];

  const hiringFunnel = [
    {
      stage: "Matches Received",
      count: 248,
      percentage: 100,
      color: "bg-gradient-to-r from-violet-500 to-purple-500",
    },
    {
      stage: "AI Screened",
      count: 156,
      percentage: 63,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      stage: "Skill Tested",
      count: 81,
      percentage: 33,
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      stage: "AI Interviewed",
      count: 45,
      percentage: 18,
      color: "bg-gradient-to-r from-orange-500 to-amber-500",
    },
    {
      stage: "Contracted",
      count: 26,
      percentage: 10,
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
  ];

  const aiRecommendations = [
    {
      title: "Pendig match review",
      description: "23 AI matches awaiting review for more than 3 days",
      priority: "high",
    },
    {
      title: "Improve visibility",
      description: "3 bench resources have low marketplace visibility",
      priority: "medium",
    },
    {
      title: "Schedule interviews",
      description: "8 candidates passed skill tests, ready for AI interview",
      priority: "low",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-2">
      {/* Page Header */}
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-teal-500" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Bench performance
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">
              Bench Dashboard
            </h1>
            <p className="text-slate-400 text-sm mb-4">
              Overview of your available talent, pipeline performance, and actionable AI-driven match recommendations.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-700">{kpiData[1]?.value}</span>&nbsp;Active
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-700">{kpiData[3]?.value}</span>&nbsp;Contracted
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="h-4 w-4 text-slate-400" />
                Updated just now
              </div>
            </div>
          </div>

          {/* Right side: Donut + Utilization — hidden on mobile */}
          <div className="hidden sm:flex flex-col items-end gap-4">

            {/* Donut Chart */}
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#14b8a6" strokeWidth="3"
                    strokeDasharray={`${parseFloat(kpiData[0]?.value) || 0}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-slate-800">{kpiData[0]?.value}</span>
                </div>
              </div>
              <span className="text-sm text-slate-400 font-medium">Utilization</span>
            </div>
          </div>
        </div>
      </div>








      {/* KPI Cards - Single row */}
      {/* KPI Cards - Single row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpiData.slice(1).map((kpi, index) => (
          <Card
            key={index}
            className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <kpi.icon className="h-5 w-5 text-slate-300" />
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-teal-500" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                )}
                <span className={`text-xs font-medium ${kpi.trend === "up" ? "text-teal-500" : "text-red-400"}`}>
                  {kpi.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Funnel */}
        <div className="relative lg:col-span-2">
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Filter className="h-4 w-4 text-white" />
                </div>
                Talent Acquisition Funnel
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-5">
                {hiringFunnel.map((stage, index) => (
                  <div key={index} className="space-y-2">

                    <div className="flex items-center justify-between text-sm">

                      {/* Stage Name */}
                      <span className="font-semibold text-slate-700">
                        {stage.stage}
                      </span>

                      {/* Count + Percentage */}
                      <span className="flex items-center gap-3">
                        <span className="font-bold text-slate-800">
                          {stage.count}
                        </span>
                        <span className="text-slate-400">
                          {stage.percentage}%
                        </span>
                      </span>

                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>

                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Overlay */}
          {/* <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center z-10">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl px-8 py-5 shadow-lg border border-white/50 text-center">
              <span className="text-2xl font-bold text-slate-700 tracking-wide">Coming Soon</span>
              <p className="text-sm text-slate-400 mt-1">
                This feature is under development
              </p>
            </div>
          </div> */}
        </div>

        {/* AI Recommendations */}
        <div className="relative h-full">
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <div className="p-1.5 rounded-lg bg-teal-50">
                  <Bot className="h-4 w-4 text-teal-500" />
                </div>
                AI Recommendations
              </CardTitle>
              <p className="text-sm text-slate-500">Actionable insights to boost placements.</p>
            </CardHeader>
            <CardContent className="pt-2 space-y-0">
              {aiRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="py-4 border-t border-slate-100 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-teal-50 shrink-0">
                      {index === 0 ? <Users className="h-4 w-4 text-teal-500" />
                        : index === 1 ? <Eye className="h-4 w-4 text-teal-500" />
                          : <Calendar className="h-4 w-4 text-teal-500" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        {rec.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{rec.description}</p>
                      <p className="text-xs text-teal-500 font-medium mt-2 flex items-center gap-1">
                        <div className="p-2 rounded-lg  shrink-0">
                          {index === 0 && "Review Matches →"}
                          {index === 1 && "Update Profile →"}
                          {index === 2 && "Schedule Now →"}
                        </div>

                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Coming Soon Overlay */}
          {/* <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center z-10">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl px-8 py-5 shadow-lg border border-white/50 text-center">
              <span className="text-2xl font-bold text-slate-700 tracking-wide">Coming Soon</span>
              <p className="text-sm text-slate-400 mt-1">
                This feature is under development
              </p>
            </div>
          </div> */}
        </div>
      </div>






      {/* Recent Activity 
      
{aiRecommendations.map((rec, index) => (
  <div
    key={index}
    className="flex gap-3 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all bg-white"
  >
    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center mt-1">
      <rec.icon className="h-4 w-4 text-teal-500" />
    </div>
    <div>
      <p className="font-semibold text-sm text-slate-800">{rec.title}</p>
      <p className="text-xs text-slate-500 mt-1">{rec.description}</p>
      <button
        disabled
        className="mt-2 text-xs font-medium text-teal-500 flex items-center gap-1 cursor-not-allowed opacity-70"
      >
        {rec.action} →
      </button>
    </div>
  </div>
))}
      
      
      
      
      */}




















      {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Clock className="h-4 w-4 text-white" />
              </div>
              Recent Activity
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50/80 transition-colors group"
              >
                <div className={`p-2.5 rounded-xl ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>*/}
    </div>
  );
};

export default CompanyDashboard;
