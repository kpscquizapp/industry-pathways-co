import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Eye,
  EyeOff,
  Shield,
  Building2,
  Users,
  Globe,
  Lock,
  Search,
  Star,
  Zap,
  CheckCircle,
  Settings,
  Target,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

const VisibilitySettings = () => {
  const [settings, setSettings] = useState({
    marketplaceVisibility: true,
    showCompanyName: true,
    showBenchRates: false,
    allowDirectContact: true,
    featuredListing: false,
    searchEngineIndexing: false,
    showResourceCount: true,
    allowBenchInquiries: true
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    toast.success("Visibility settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Visibility Settings
            </h1>
            <p className="text-slate-500 mt-1">Control how your company and bench resources appear in the Talent Marketplace</p>
          </div>
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-4 py-1.5 rounded-full">
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Marketplace Settings
          </Badge>
        </div>

        {/* Marketplace Visibility Status */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-slate-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-slate-800 text-lg">Marketplace Visibility</span>
                    <Badge className={`${settings.marketplaceVisibility ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"} rounded-full px-3 py-0.5 text-xs font-semibold`}>
                      {settings.marketplaceVisibility ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 max-w-md">
                    When active, your bench resources are visible to potential clients in the Talent Marketplace. Turn this off to hide all resources.
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.marketplaceVisibility}
                onCheckedChange={(checked) => updateSetting("marketplaceVisibility", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Profile Settings */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              Company Profile Display
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Show Company Name */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Show Company Name</p>
                  <p className="text-sm text-slate-500 mt-0.5">Display your company name on resource profiles</p>
                </div>
              </div>
              <Switch
                checked={settings.showCompanyName}
                onCheckedChange={(checked) => updateSetting("showCompanyName", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            {/* Show Resource Count */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-violet-100">
                  <Users className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Show Total Resource Count</p>
                  <p className="text-sm text-slate-500 mt-0.5">Display the number of available bench resources</p>
                </div>
              </div>
              <Switch
                checked={settings.showResourceCount}
                onCheckedChange={(checked) => updateSetting("showResourceCount", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            {/* Show Bench Rates */}
            <div className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-100">
                  <Target className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Show Hourly Rates</p>
                  <p className="text-sm text-slate-500 mt-0.5">Display billing rates publicly (hide to negotiate privately)</p>
                </div>
              </div>
              <Switch
                checked={settings.showBenchRates}
                onCheckedChange={(checked) => updateSetting("showBenchRates", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact & Inquiry Settings */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/50">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Contact & Inquiry Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Allow Direct Contact */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-green-100">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Allow Direct Contact</p>
                  <p className="text-sm text-slate-500 mt-0.5">Let potential clients contact you directly from the marketplace</p>
                </div>
              </div>
              <Switch
                checked={settings.allowDirectContact}
                onCheckedChange={(checked) => updateSetting("allowDirectContact", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            {/* Allow Bench Inquiries */}
            <div className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-teal-100">
                  <CheckCircle className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Allow Bench Inquiries</p>
                  <p className="text-sm text-slate-500 mt-0.5">Receive inquiry requests for individual bench resources</p>
                </div>
              </div>
              <Switch
                checked={settings.allowBenchInquiries}
                onCheckedChange={(checked) => updateSetting("allowBenchInquiries", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Premium Features */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader className="pb-4 border-b border-amber-100/50">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Star className="h-4 w-4 text-white" />
              </div>
              Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Featured Listing */}
            <div className="flex items-center justify-between p-5 border-b border-amber-100/50 hover:bg-amber-100/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-100">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">Featured Listing</p>
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full px-2">Premium</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">Boost visibility with premium placement in search results</p>
                </div>
              </div>
              <Switch
                checked={settings.featuredListing}
                onCheckedChange={(checked) => updateSetting("featuredListing", checked)}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>

            {/* Search Engine Indexing */}
            <div className="flex items-center justify-between p-5 hover:bg-amber-100/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-orange-100">
                  <Search className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Search Engine Indexing</p>
                  <p className="text-sm text-slate-500 mt-0.5">Allow Google to index your public resource listings</p>
                </div>
              </div>
              <Switch
                checked={settings.searchEngineIndexing}
                onCheckedChange={(checked) => updateSetting("searchEngineIndexing", checked)}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="outline" 
            className="px-6 h-11 rounded-xl border-slate-200 hover:bg-slate-50"
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSave}
            className="px-8 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySettings;
