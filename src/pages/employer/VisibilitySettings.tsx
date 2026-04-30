/* 
// ---- OLD VISIBILITY SETTINGS PAGE (COMMENTED AS REQUESTED) ----
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
  Settings as SettingsIcon,
  Target,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

const VisibilitySettingsOld = () => {
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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Visibility Settings
            </h1>
            <p className="text-slate-500 mt-1">Control how your company and bench resources are discovered in the marketplace.</p>
          </div>
        </div>

        <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-0">
            <div className="px-6 pt-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Globe color="#007bff" size={18} />
                <span className="font-semibold text-slate-800">Marketplace Settings</span>
              </div>
              <p className="text-sm text-slate-500">Manage the global visibility of your resources in the marketplace.</p>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-slate-800">Marketplace Visibility</p>
                <p className="text-sm text-slate-500 mt-0.5">Turn on to make your bench resources discoverable by clients. If turned off, your profiles remain private.</p>
              </div>
              <Switch
                checked={settings.marketplaceVisibility}
                onCheckedChange={(checked) => updateSetting("marketplaceVisibility", checked)}
                className="data-[state=checked]:bg-[#0ea5e9]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="text-card-foreground border border-slate-200 shadow-sm rounded-xl bg-white">
          <CardHeader className="pb-4 border-b border-slate-100 ">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
              <div className="flex flex-col gap-[2px]">
                <div className="w-5 h-[6px] border-2 border-blue-500 rounded-sm"></div>
                <div className="flex gap-[2px]">
                  <div className="w-3 h-[6px] border-2 border-blue-500 rounded-sm"></div>
                  <div className="w-[6px] h-[6px] border-2 border-blue-500 rounded-sm"></div>
                </div>
              </div>
              Company Profile Display 
            </CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">Mention what information is visible to clients on your resourse listing.</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div></div>
                <div>
                  <p className="font-medium text-slate-800">Show Company Name</p>
                  <p className="text-sm text-slate-500 mt-0.5">Display your company name on resource profiles</p>
                </div>
              </div>
              <Switch
                checked={settings.showCompanyName}
                onCheckedChange={(checked) => updateSetting("showCompanyName", checked)}
                className="data-[state=checked]:bg-[#0ea5e9]"
              />
            </div>

            <div className="flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div></div>
                <div>
                  <p className="font-medium text-slate-800">Show Total Resource Count</p>
                  <p className="text-sm text-slate-500 mt-0.5">Display total number of bench resourses your company has avaliable on your public profile.</p>
                </div>
              </div>
              <Switch
                checked={settings.showResourceCount}
                onCheckedChange={(checked) => updateSetting("showResourceCount", checked)}
                className="data-[state=checked]:bg-[#0ea5e9]"
              />
            </div>

            <div className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div></div>
                <div>
                  <p className="font-medium text-slate-800">Show Hourly Rates</p>
                  <p className="text-sm text-slate-500 mt-0.5">Display the hourly rate.if disabled, it will prompt clients to "Contact for Rate".</p>
                </div>
              </div>
              <Switch
                checked={settings.showBenchRates}
                onCheckedChange={(checked) => updateSetting("showBenchRates", checked)}
                className="data-[state=checked]:bg-[#0ea5e9]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
          <CardHeader className="pb-4 border-b border-gray-500/20">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 ">
                <Star className="h-4 w-4 text-white" />
              </div>
              Premium Features
            </CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">Unlock advanced visibility optionsto increase client engagment and inquires.</p>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-5 border-b border-amber-100/50 ">
              <div className="flex items-start gap-4">
                <div></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">Featured Listing</p>
                    <Badge className="bg-[#fbd6bc] text-orange-600 text-xs rounded-full px-2 transition-all duration-200 hover:bg-orange-200 hover:text-orange-700">Premium</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">Boost visibility with premium placement in search results</p>
                </div>
              </div>
              <Switch
                checked={settings.featuredListing}
                onCheckedChange={(checked) => updateSetting("featuredListing", checked)}
                className="data-[state=checked]:bg-[#0ea5e9]"
              />
            </div>

            <div className="flex items-center justify-between p-5 ">
              <div className="flex items-start gap-4">
                <div></div>
               <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">Premium Visibility Placement</p>
                    <Badge className="bg-[#fbd6bc] text-orange-600 text-xs rounded-full px-2 transition-all duration-200 hover:bg-orange-200 hover:text-orange-700">Premium</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">Boost visibility with premium placement in search results</p>
                </div>
              </div>
              <Switch
                checked={settings.searchEngineIndexing}
                onCheckedChange={(checked) => updateSetting("searchEngineIndexing", checked)}
                className="data-[state=checked]:bg-[#0ea5e9]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="outline" 
            className="px-6 h-10 rounded-xl  hover:bg-[#1e293b] text-slate-600 font-medium"
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSave}
            className="px-8 h-11 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-lg shadow-emerald-500/25"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
*/

// ---- NEW SETTINGS UI ----
import React, { useState, useRef } from "react";
import {
  User,
  FileText,
  Upload,
  Shield,
  Trash2,
  Lock,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useGetEmployerProfileQuery,
  useGetEmployerProfileImageQuery,
  useRemoveProfileImageMutation,
  useUpdateEmployerProfileMutation,
  useUploadProfileImageMutation,
} from "@/app/queries/employerApi";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChangePasswordMutation, useDeleteMyAccountMutation } from "@/app/queries/profileApi";
import Cookies from "js-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";

const VisibilitySettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [searchParams] = useSearchParams();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteMyAccount, { isLoading: isDeletingAccount }] =
    useDeleteMyAccountMutation();
  const [uploadProfileImage, { isLoading: isUploadingProfileImage }] =
    useUploadProfileImageMutation();
  const [removeProfileImage] = useRemoveProfileImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.user.userDetails);
  const { data: employerProfileData, isFetching: isProfileLoading, refetch: refetchProfile } = useGetEmployerProfileQuery();
  const { data: employerProfileImage } = useGetEmployerProfileImageQuery(
    user?.id as any,
  );
  const [updateProfile, { isLoading: isSaving }] = useUpdateEmployerProfileMutation();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    companySize: "11-50",
    industry: "",
    location: "",
    website: "",
    description: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");


  React.useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (employerProfileData?.data) {
      const p = employerProfileData.data;
      setCompanyDetails({
        companyName: p.companyName || "",
        companySize: p.employerProfile?.companySize || "11-50",
        industry: p.employerProfile?.industry || "",
        location: p.employerProfile?.location || "",
        website: p.employerProfile?.website || "",
        description: p.employerProfile?.description || "",
      });
      setPersonalInfo({
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        email: p.email || "",
      });
    }
  }, [employerProfileData]);

  React.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "account") {
      setActiveTab("security");
    } else if (tab === "general") {
      setActiveTab("general");
    }
  }, [searchParams]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setProfileImage(url);

    const formData = new FormData();
    formData.append("image", file);

    try {
      await uploadProfileImage(formData).unwrap();
      toast.success("Profile image updated successfully!");
      await refetchProfile();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to upload profile image.");
      setProfileImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (user?.id) {
        await removeProfileImage(user.id as any).unwrap();
      }
      toast.success("Profile image removed successfully!");
      setProfileImage(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove profile image.");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSavePersonal = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      await updateProfile({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
      }).unwrap();

      await refetchProfile();
      toast.success("Personal information saved successfully!");
    } catch (err) {
      console.error("Failed to save personal information:", err);
      toast.error("Failed to save personal information. Please try again.");
    }
  };

  const handleSaveCompany = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log("Save clicked");
    console.log("Saving company details...", companyDetails);
    try {
      const payload = {
        companyName: companyDetails.companyName,
        companySize: companyDetails.companySize,
        industry: companyDetails.industry,
        location: companyDetails.location,
        website: companyDetails.website,
        description: companyDetails.description,
      };
      console.log("Executing updateProfile mutation with:", payload);
      await updateProfile(payload).unwrap();

      // Refetch to reflect the updated profile data
      await refetchProfile();

      toast.success("Company details saved successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to save company details. Please try again.");
    }
  };


  const handleChangePassword = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMyAccount({ password: deletePassword }).unwrap();
      setShowDeleteModal(false);
      setDeletePassword("");
      Cookies.remove("userInfo");
      Cookies.remove("userInfo", { path: "/" });
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/bench-login";
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };




  // Keep a generic handleSave for other uses
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 py-4 flex items-center gap-3 px-4 sm:px-6">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger
              className="text-muted-foreground hover:bg-[#0b1221]/10"
              title="Toggle Sidebar"
            />
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Settings</h1>
          </div>
          <p className="text-slate-400 text-sm ml-7">Manage your account preferences, company profile, and team settings.</p>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 mb-3">
        <div className="max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-6 mt-5">

            {/* Left Navigation */}
            <div className="w-full md:w-56 flex-shrink-0 px-1">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "general"
                    ? "bg-white text-[#0eb5b9] shadow-sm"
                    : "text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm"
                    }`}
                >
                  <User className="h-4 w-4" />
                  General Account
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "security"
                    ? "bg-white text-[#0eb5b9] shadow-sm"
                    : "text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm"
                    }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Account Settings
                </button>
              </nav>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 space-y-6">

              {activeTab === "general" && (
                isProfileLoading ? (
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-200 p-7 space-y-4 animate-pulse">
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                        <div className="h-3 w-72 bg-gray-100 rounded" />
                        <div className="grid grid-cols-2 gap-5 pt-4">
                          <div className="h-12 bg-gray-100 rounded-xl" />
                          <div className="h-12 bg-gray-100 rounded-xl" />
                        </div>
                        <div className="h-12 bg-gray-100 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">

                    {/* Personal Information */}
                    <div>
                      <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
                        <CardContent className="p-4 sm:p-7 space-y-6">

                          {/* Header */}
                          <div>
                            <h2 className="text-[15px] font-bold text-slate-800 uppercase">PERSONAL INFORMATION</h2>
                            <p className="text-[13px] text-slate-400 mt-1 mb-6">Update your personal profile details and email address.</p>
                          </div>

                          {/* Avatar Upload */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="h-[76px] w-[76px] bg-[#0b1b33] rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md relative">
                              {(profileImage || employerProfileImage) ? (
                                <img
                                  src={profileImage || employerProfileImage || ""}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col justify-between p-2">
                                  <div className="space-y-[3px]">
                                    {[100, 100, 80, 100, 65].map((w, i) => (
                                      <div key={i} className="h-[3px] rounded-sm bg-white/25" style={{ width: `${w}%` }} />
                                    ))}
                                  </div>
                                  <div className="flex gap-[3px]">
                                    <div className="h-[3px] w-[45%] bg-white/25 rounded-sm" />
                                    <div className="h-[3px] w-[30%] bg-white/15 rounded-sm" />
                                  </div>
                                </div>
                              )}
                              {isUploadingProfileImage && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="h-6 w-6 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="h-9 text-slate-600 border-slate-200 text-sm font-normal gap-1.5 hover:bg-[#0B1221] hover:text-white"
                                >
                                  <Upload className="h-3.5 w-3.5" />
                                  Upload new image
                                </Button>
                                <button
                                  onClick={handleRemoveImage}
                                  className="text-sm text-red-500 font-medium hover:text-red-500 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                              <p className="text-xs text-slate-400">Recommended size is 256x256px. Max 2MB.</p>
                            </div>
                          </div>

                          {/* Name Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700">First Name</Label>
                              <Input
                                value={personalInfo.firstName}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                                className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700">Last Name</Label>
                              <Input
                                value={personalInfo.lastName}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                                className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700"
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                            <Input
                              value={personalInfo.email}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                              type="email"
                              className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700"
                            />
                          </div>

                          {/* Save */}
                          <div className="flex justify-end pt-1">
                            <Button onClick={handleSavePersonal} className="bg-[#0eb5b9] hover:bg-[#0da0a3] text-white rounded-lg px-7 h-10 font-semibold">
                              Save Changes
                            </Button>
                          </div>

                        </CardContent>
                      </Card>
                    </div>





                    {/* Company Details */}
                    <div>

                      <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
                        <CardContent className="p-4 sm:p-7 space-y-5">
                          <div>
                            <h2 className="text-[15px] font-bold text-slate-800 uppercase mb-1">COMPANY DETAILS</h2>
                            <p className="text-[13px] text-slate-400 mb-6">These details will be visible to candidates during the interview process.</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700">Company Name</Label>
                              <Input
                                value={companyDetails.companyName}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
                                className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700">Company Size</Label>
                              <select
                                value={companyDetails.companySize}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, companySize: e.target.value })}
                                className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none text-sm text-slate-700"
                              >
                                <option value="1-10">1 - 10 employees</option>
                                <option value="11-50">11 - 50 employees</option>
                                <option value="51-200">51 - 200 employees</option>
                                <option value="201-500">201 - 500 employees</option>
                                <option value="501-1000">501 - 1000 employees</option>
                                <option value="1000+">1000+ employees</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700">Industry</Label>
                              <Input
                                value={companyDetails.industry}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, industry: e.target.value })}
                                className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700">Location</Label>
                              <Input
                                value={companyDetails.location}
                                onChange={(e) => setCompanyDetails({ ...companyDetails, location: e.target.value })}
                                className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-slate-700">Company Website</Label>
                            <Input
                              value={companyDetails.website}
                              onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })}
                              className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-slate-700">Company Description</Label>
                            <Textarea
                              value={companyDetails.description}
                              onChange={(e) => setCompanyDetails({ ...companyDetails, description: e.target.value })}
                              className="min-h-[130px] w-full px-4 py-3 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700 resize-none"
                            />
                          </div>

                          <div className="flex justify-end pt-1">
                            <Button
                              onClick={handleSaveCompany}
                              disabled={isSaving}
                              className="bg-[#0eb5b9] hover:bg-[#0da0a3] text-white rounded-lg px-6 h-10 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                  </div>
                )
              )}

              {activeTab === "security" && (
                <div className="space-y-6 animate-fade-in fade-in zoom-in duration-300">

                  {/* Account Security */}
                  <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                    <CardContent className="p-5 sm:p-8 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[#e6f7f8] text-[#0eb5b9] flex items-center justify-center shrink-0">
                          <Shield className="h-6 w-6 text-[#0eb5b9]" strokeWidth={2} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-800">Account Security</h2>
                          <p className="text-sm text-slate-500 mt-0.5">Secure your account with a strong password</p>
                        </div>
                      </div>

                      <div className="space-y-6 pt-2">
                        <div className="space-y-1.5 ">
                          <Label className="text-sm font-semibold text-slate-700">Current Password</Label>
                          <Input type="password" placeholder="Enter Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5 ">
                            <Label className="text-sm font-semibold text-slate-700">New Password</Label>
                            <Input type="password" placeholder="Enter New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700" />

                          </div>
                          <div className="space-y-1.5 ">
                            <Label className="text-sm font-semibold text-slate-700">Confirm New Password</Label>
                            <Input type="password" placeholder="Enter Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="h-12 w-full px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700" />

                          </div>
                        </div>

                        <div className="pt-2">
                          <Button onClick={handleChangePassword} disabled={isChangingPassword} className="bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg px-8 h-11 font-medium shadow-sm transition-all hover:shadow-md">
                            {isChangingPassword ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <Card className="border-none shadow-sm rounded-2xl bg-red-50/60 overflow-hidden">
                    <CardContent className="p-5 sm:p-8 space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-white text-red-500 border border-red-100 flex items-center justify-center shrink-0">
                          <Trash2 className="h-5 w-5 text-red-500/80" strokeWidth={2} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-800">Danger Zone</h2>
                          <p className="text-sm text-slate-600 mt-0.5">Permanently delete your account and data</p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                        Once you delete your account, there is no going back. All your profile data, interview history, and skill assessment results will be permanently removed.
                      </p>

                      <div className="pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteModal(true)}
                          className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-lg h-11 px-6 font-semibold shadow-sm transition-all focus:ring-2 focus:ring-red-100 outline-none"
                        >
                          Delete My Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                </div>
              )}

            </div>
          </div>
        </div >
      </div >

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 z-50">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[425px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg">

            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="h-6 w-6 text-red-500" />
                Confirm Account Deletion
              </h2>
              <p className="text-sm text-slate-600 py-4">
                This action is{" "}
                <span className="font-bold text-red-600 uppercase tracking-tight">permanent</span>{" "}
                and cannot be undone. All your professional data will be wiped from our systems.
              </p>
            </div>

            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  To confirm, please enter your password:
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your account password"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DD9E8]/30 focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-3 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                }}
                className="h-10 px-4 py-2 mt-2 sm:mt-0 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="h-10 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-300 shadow-lg shadow-red-200 disabled:opacity-50 text-sm"
              >
                {isDeletingAccount ? "Deleting..." : "Confirm Deletion"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default VisibilitySettings;

