import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  TrendingUp,
  FileCheck,
  Video,
  Eye,
  Star,
} from "lucide-react";
import BarLoader from "@/components/loader/BarLoader";
import ContractorProfile from "./ContractorProfile";

const GlassCard = ({ children, gradient, className = "" }: { children: React.ReactNode; gradient: string; className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient} ${className}`}>
    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10" />
    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5" />
    <div className="relative z-10">{children}</div>
  </div>
);



const KPI = [
  { label: "Interview Invites", value: "-", icon: Video, gradient: "bg-gradient-to-br from-cyan-700 to-cyan-500", change: "-", sub: "this week" },
  { label: "Pending Tests", value: "-", icon: FileCheck, gradient: "bg-gradient-to-br from-cyan-700 to-cyan-500", change: "-", sub: "due soon" },
  { label: "Profile Views", value: "-", icon: Eye, gradient: "bg-gradient-to-br from-cyan-700 to-cyan-500", change: "-", sub: "this month" },
  { label: "Skill Score", value: "-", icon: Star, gradient: "bg-gradient-to-br from-cyan-700 to-cyan-500", change: "-", sub: "-" },
];

const ContractorDashboard = () => {
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
