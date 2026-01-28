import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Sparkles
} from 'lucide-react';

const CompanyDashboard = () => {
  const kpiData = [
    {
      title: 'Matches Received',
      value: '47',
      description: 'AI-suggested profiles for open jobs',
      target: '5-10 per job',
      change: '+12',
      trend: 'up',
      icon: Users,
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50'
    },
    {
      title: 'Avg AI Resume Score',
      value: '78%',
      description: 'Mean score of shortlisted candidates',
      target: 'Target: >75%',
      change: '+5%',
      trend: 'up',
      icon: Award,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      title: 'Skill Test Pass Rate',
      value: '52%',
      description: 'Candidates passing initiated tests',
      target: 'Target: 40-60%',
      change: '+8%',
      trend: 'up',
      icon: ClipboardCheck,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'AI Interview Success',
      value: '58%',
      description: 'Interviews leading to offers',
      target: 'Target: 50%',
      change: '+3%',
      trend: 'up',
      icon: Bot,
      gradient: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-50 to-blue-50'
    },
    {
      title: 'Bench Utilization',
      value: '72%',
      description: 'Posted bench resources contracted',
      target: 'Target: >60%',
      change: '+15%',
      trend: 'up',
      icon: Gauge,
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-50'
    },
    {
      title: 'Cost per Hire',
      value: '$380',
      description: 'Average cost per successful contract',
      target: 'Target: <$500',
      change: '-$45',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Response Time',
      value: '18h',
      description: 'Avg hours to first interaction',
      target: 'Target: <24 hours',
      change: '-4h',
      trend: 'up',
      icon: Timer,
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50'
    },
  ];

  const recentActivity = [
    { type: 'match', message: '8 new AI matches for Senior Developer role', time: '5 min ago', icon: Sparkles, color: 'bg-violet-100 text-violet-600' },
    { type: 'screening', message: 'AI screening completed for 12 candidates', time: '1 hour ago', icon: Bot, color: 'bg-blue-100 text-blue-600' },
    { type: 'test', message: '5 candidates passed Java skill assessment', time: '2 hours ago', icon: ClipboardCheck, color: 'bg-emerald-100 text-emerald-600' },
    { type: 'hire', message: 'Contract signed with bench resource', time: '1 day ago', icon: Handshake, color: 'bg-green-100 text-green-600' },
  ];

  const hiringFunnel = [
    { stage: 'Matches Received', count: 248, percentage: 100, color: 'bg-gradient-to-r from-violet-500 to-purple-500' },
    { stage: 'AI Screened', count: 156, percentage: 63, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { stage: 'Skill Tested', count: 81, percentage: 33, color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    { stage: 'AI Interviewed', count: 45, percentage: 18, color: 'bg-gradient-to-r from-orange-500 to-amber-500' },
    { stage: 'Contracted', count: 26, percentage: 10, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
  ];

  const aiRecommendations = [
    { title: 'Review pending matches', description: '23 AI matches awaiting review for more than 3 days', priority: 'high' },
    { title: 'Increase bench visibility', description: '3 bench resources have low marketplace visibility', priority: 'medium' },
    { title: 'Schedule AI interviews', description: '8 candidates passed skill tests, ready for AI interview', priority: 'low' },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-2">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Employer Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's your talent acquisition overview.</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl h-11 px-6">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* KPI Cards - 2 rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiData.slice(0, 4).map((kpi, index) => (
          <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br ${kpi.bgGradient} group`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.gradient} shadow-lg`}>
                  <kpi.icon className="h-5 w-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{kpi.value}</p>
              <p className="text-sm font-medium text-slate-700">{kpi.title}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-200/50">
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {kpi.target}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpiData.slice(4).map((kpi, index) => (
          <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br ${kpi.bgGradient}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.gradient} shadow-lg`}>
                  <kpi.icon className="h-5 w-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{kpi.value}</p>
              <p className="text-sm font-medium text-slate-700">{kpi.title}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-200/50">
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {kpi.target}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Funnel */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Talent Acquisition Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-5">
              {hiringFunnel.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{stage.stage}</span>
                    <span className="text-slate-500 font-medium">{stage.count} <span className="text-slate-400">({stage.percentage}%)</span></span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border-l-4 hover:shadow-md transition-all cursor-pointer ${
                  rec.priority === 'high' 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-500' 
                    : rec.priority === 'medium' 
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-500' 
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
                }`}
              >
                <p className="font-medium text-sm text-slate-800">{rec.title}</p>
                <p className="text-xs text-slate-500 mt-1">{rec.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Clock className="h-4 w-4 text-white" />
              </div>
              Recent Activity
            </span>
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
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
                  <p className="text-sm font-medium text-slate-700">{activity.message}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
