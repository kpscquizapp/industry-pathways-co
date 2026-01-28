import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Eye,
  EyeOff,
  Bell,
  Shield,
  Download,
  Building2,
  Users,
  Globe,
  Lock,
  CheckCircle2
} from "lucide-react";

const ProfileVisibility = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    profileStatus: true,
    anonymousBrowsing: false,
    directEmployers: true,
    contractAgencies: true,
    currentEmployerExclusion: true,
    searchEngineIndexing: false
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  const sidebarItems = [
    { id: "profile", label: "Profile Information", icon: User, active: false },
    { id: "visibility", label: "Visibility & Privacy", icon: Eye, active: true },
    { id: "notifications", label: "Notifications", icon: Bell, active: false },
    { id: "security", label: "Security & Login", icon: Shield, active: false },
    { id: "data", label: "Data Export", icon: Download, active: false }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 mt-8">
            {/* Left Sidebar */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold px-4 mb-4">
                SETTINGS
              </p>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Visibility & Privacy</h1>
                <p className="text-muted-foreground">Control who can see your profile and personal details.</p>
              </div>

              {/* Profile Status */}
              <Card className="border-border/50 rounded-xl overflow-hidden shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground">Profile Status</span>
                        <Badge className={`${settings.profileStatus ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"} rounded-full px-2 py-0.5 text-xs font-semibold`}>
                          {settings.profileStatus ? "Public" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        When active, your profile is visible to employers and recruiters. Turn this off to hide your profile completely.
                      </p>
                    </div>
                    <Switch
                      checked={settings.profileStatus}
                      onCheckedChange={(checked) => updateSetting("profileStatus", checked)}
                      className="ml-4"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Anonymous Browsing Mode */}
              <Card className="border-border/50 rounded-xl overflow-hidden shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">Anonymous Browsing Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Hide your name, contact details, and current employer until you accept an interview request or reveal your identity.
                      </p>
                    </div>
                    <Switch
                      checked={settings.anonymousBrowsing}
                      onCheckedChange={(checked) => updateSetting("anonymousBrowsing", checked)}
                      className="ml-4"
                    />
                  </div>

                  {/* Anonymous Preview */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Candidate #8492</p>
                        <p className="text-sm text-muted-foreground">Senior Java Developer • 8 Yrs Exp</p>
                        <p className="text-xs text-muted-foreground">(Hidden)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Who can find you */}
              <Card className="border-border/50 rounded-xl overflow-hidden shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Who can find you?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {/* Direct Employers */}
                  <div className="flex items-start justify-between py-4 border-b border-border/50 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Direct Employers</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow companies hiring for full-time roles to view your profile.
                      </p>
                    </div>
                    <Switch
                      checked={settings.directEmployers}
                      onCheckedChange={(checked) => updateSetting("directEmployers", checked)}
                      className="ml-4"
                    />
                  </div>

                  {/* Contract & Staffing Agencies */}
                  <div className="flex items-start justify-between py-4 border-b border-border/50 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Contract & Staffing Agencies</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow staffing firms to find you for contract or short-term gig opportunities.
                      </p>
                    </div>
                    <Switch
                      checked={settings.contractAgencies}
                      onCheckedChange={(checked) => updateSetting("contractAgencies", checked)}
                      className="ml-4"
                    />
                  </div>

                  {/* Current Employer Exclusion */}
                  <div className="flex items-start justify-between py-4 border-b border-border/50 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <EyeOff className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Current Employer Exclusion</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        We try to hide your profile from your current employer based on the company name in your profile.
                      </p>
                    </div>
                    <Switch
                      checked={settings.currentEmployerExclusion}
                      onCheckedChange={(checked) => updateSetting("currentEmployerExclusion", checked)}
                      className="ml-4"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Search Engine Indexing */}
              <Card className="border-border/50 rounded-xl overflow-hidden shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">Search Engine Indexing</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow search engines like Google to index your public profile URL. This increases your visibility outside the platform.
                      </p>
                    </div>
                    <Switch
                      checked={settings.searchEngineIndexing}
                      onCheckedChange={(checked) => updateSetting("searchEngineIndexing", checked)}
                      className="ml-4"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="px-6 h-12 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // Save settings logic here
                  }}
                  className="px-8 h-12 rounded-xl bg-primary hover:bg-primary/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileVisibility;