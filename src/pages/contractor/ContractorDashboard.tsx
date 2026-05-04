import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetDashboardStatsQuery } from "@/app/queries/profileApi";
import {
  TrendingUp,
  FileCheck,
  Video,
  Eye,
  Star,
  AlertCircle,
} from "lucide-react";
import ContractorProfile from "./ContractorProfile";
import SpinnerLoader from "@/components/loader/SpinnerLoader";

const GlassCard = ({ children, gradient, className = "" }: { children: React.ReactNode; gradient: string; className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient} ${className}`}>
    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10" />
    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5" />
    <div className="relative z-10">{children}</div>
  </div>
);

const ContractorDashboard = () => {
  const { userDetails } = useSelector((state: RootState) => state.user);
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const navigate = useNavigate();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center gap-4 h-full">
        <SpinnerLoader className="w-10 h-10" />
        <p className="text-muted-foreground">
          Personalizing your dashboard...
        </p>
      </div>
    );
  }

  if (!statsData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 py-20">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <h3 className="text-xl font-bold text-slate-900">Stats Unavailable</h3>
        <p className="text-slate-500 max-w-sm text-center">
          We couldn&apos;t retrieve your dashboard statistics. Some activity data might be temporarily unavailable.
        </p>
      </div>
    );
  }

  const stats = statsData.data;

  const KPI = [
    { label: "Interview Invites", value: stats.interviewInvites, icon: Video, gradient: "bg-gradient-to-br from-cyan-700 to-cyan-500", change: "0", sub: "this week" },
    { label: "Pending Tests", value: stats.pendingTests, icon: FileCheck, gradient: "bg-gradient-to-br from-cyan-700 to-cyan-500", change: "0", sub: "due soon" },
    { label: "Profile Views", value: stats.profileViews, icon: Eye, gradient: "bg-gradient-to-br from-cyan-700 to-cyan-500", change: "0", sub: "total views" },
    { label: "Skill Score", value: stats.skillScore ? `${stats.skillScore}%` : "0%", icon: Star, gradient: "bg-gradient-to-br from-cyan-700 to-cyan-500", change: "0", sub: "highest score" },
  ];



  return (
    <div className="py-4 sm:py-4 flex flex-col font-sans sm:px-2 animate-in fade-in slide-in-from-bottom-3 duration-500 font-inter">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-2 mb-8">Welcome back, {userDetails?.firstName}. Here's your activity overview.</p>
      </div>
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI.map((k, i) => {
          const IconObj = k.icon;
          return (
            <GlassCard key={i} gradient={k.gradient} className="px-5 py-5 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <IconObj className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 text-[11px] font-semibold border border-white/10 shadow-sm">
                  <TrendingUp className="w-3 h-3 text-white/90" /> {k.change}
                </div>
              </div>
              <div className="text-[32px] font-extrabold tracking-tight mb-0.5 leading-none">{k.value}</div>
              <div className="text-[13px] font-semibold text-white/90">{k.label}</div>
              <div className="text-[11px] font-medium text-white/60 mt-1">{k.sub}</div>
            </GlassCard>
          )
        })}
      </div>

      {/* Main Content Rendered by Profile */}
      <ContractorProfile />
    </div>
  );
};

export default ContractorDashboard;
