import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Bell,
  Globe,
  Lock,
  Building,
  Users,
  Shield,
  Trash2,
  Share2,
  Clock,
  Camera,
  Upload
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { 
  useGetEmployerProfileQuery, 
  useUpdateEmployerProfileMutation,
  useGetEmployerProfileImageQuery,
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation
} from "@/app/queries/employerApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useChangePasswordMutation, useDeleteMyAccountMutation } from "@/app/queries/profileApi";
import { useLogoutMutation } from "@/app/queries/loginApi";
import useLogout from "@/hooks/useLogout";

interface SettingsUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
  company?: string;
}

const EmployerSettings = () => {
  const [activeNav, setActiveNav] = useState('General Account');
  const [tfa, setTfa] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);

  const { token, userDetails } = useSelector((state: RootState) => state.user);
  const user = userDetails as SettingsUser;
  
  const { data: profile, isLoading: isProfileLoading } = useGetEmployerProfileQuery(undefined, {
    skip: !token,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateEmployerProfileMutation();
  const [uploadProfileImage, { isLoading: isUploadingImage }] = useUploadProfileImageMutation();
  const [removeProfileImage, { isLoading: isRemovingImage }] = useRemoveProfileImageMutation();
  
  const { currentData: profileImage } = useGetEmployerProfileImageQuery(
    token && user?.id ? user.id : skipToken,
  );

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteMyAccountMutation();
  const [handleLogout] = useLogout();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const employerData = profile?.data?.employerProfile || profile?.data;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    companyName: '',
    industry: '',
    location: '',
    companySize: '',
    website: '',
    description: '',
    primaryUseCase: 'internal'
  });

  useEffect(() => {
    if (employerData || user) {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        emailAddress: user?.email || '',
        companyName: employerData?.companyName || user?.companyName || user?.company || '',
        industry: employerData?.industry || '',
        location: employerData?.location || '',
        companySize: employerData?.companySize || '',
        website: employerData?.website || '',
        description: employerData?.description || '',
        primaryUseCase: employerData?.primaryUseCase || 'internal'
      });
    }
  }, [employerData, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      const data = new FormData();
      data.append("image", file);

      try {
        await uploadProfileImage(data).unwrap();
        toast.success("Profile image updated successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to upload image");
      }
    }
  };

  const handleImageRemove = async () => {
    if (!user?.id) return;
    try {
      await removeProfileImage(user.id).unwrap();
      toast.success("Profile image removed");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove image");
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        companyName: formData.companyName,
        industry: formData.industry,
        location: formData.location,
        companySize: formData.companySize,
        website: formData.website,
        description: formData.description,
      }).unwrap();
      toast.success("Settings updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap();
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordFields(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action is irreversible.")) {
      try {
        await deleteAccount({}).unwrap();
        toast.success("Account deleted successfully");
        handleLogout();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete account");
      }
    }
  };

  const navItems = [
    { label: 'General Account', icon: User },
    { label: 'Company Profile', icon: Building },
    { label: 'Team & Members', icon: Users },
    { label: 'Notifications', icon: Bell },
    { label: 'Integrations', icon: Share2 },
    { label: 'Billing & Plans', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#f2f5fa] font-sans pb-12">
      {/* Header */}
      <div className="bg-white px-4 sm:px-8 py-2.5 sm:py-3.5 border-b border-gray-100 flex items-center gap-4 sticky top-0 z-40 mb-8">
        <SidebarTrigger className="text-muted-foreground hover:bg-gray-100 shrink-0" title="Toggle Sidebar" />
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">Settings</h1>
          <p className="text-gray-500 text-sm hidden sm:block text-[13px]">Manage your account preferences, company profile, and team settings.</p>
        </div>
      </div>

      <div className="px-8 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-[260px] flex flex-col gap-1 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeNav === item.label 
                ? 'bg-white text-[#08b8cc] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <item.icon className={`h-4 w-4 ${activeNav === item.label ? 'text-[#08b8cc]' : 'text-gray-400'}`} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Section: Personal Information */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Personal Information</h2>
              <p className="text-xs text-gray-500 mt-1">Update your personal profile details and email address.</p>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-2 border-slate-100 bg-slate-100 shadow-inner">
                    {profileImage && (
                      <AvatarImage
                        className="object-cover"
                        src={profileImage}
                        alt={`${user?.firstName ?? "User"} profile image`}
                      />
                    )}
                    <AvatarFallback className="bg-[#08b8cc]/10 text-[#08b8cc] text-xl font-bold">
                      {(formData.firstName?.charAt(0) || user?.firstName?.charAt(0) || "U")}
                      {(formData.lastName?.charAt(0) || user?.lastName?.charAt(0) || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                      <SpinnerLoader className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="h-9 px-4 text-xs font-bold border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage || isRemovingImage}
                    >
                      {isUploadingImage ? <SpinnerLoader className="mr-2 h-3 w-3" /> : <Upload className="h-3 w-3 mr-1" />}
                      Upload new image
                    </Button>
                    {profileImage && (
                      <Button 
                        variant="ghost" 
                        className="h-9 px-4 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleImageRemove}
                        disabled={isRemovingImage || isUploadingImage}
                      >
                        {isRemovingImage ? <SpinnerLoader className="mr-2 h-3 w-3" /> : "Remove"}
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">Recommended size is 256x256px. Max 2MB.</p>
                  <input
                    type="file"
                    ref={imageInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/png,image/webp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">First Name</Label>
                  <Input 
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter First Name"
                    className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Last Name</Label>
                  <Input 
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter Last Name"
                    className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Email Address</Label>
                  <Input 
                    id="emailAddress"
                    value={formData.emailAddress}
                    readOnly
                    className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-gray-50 text-sm text-gray-500 cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  className="bg-[#08b8cc] hover:bg-[#07a3b5] text-white px-8 h-10 text-sm font-bold rounded-md shadow-sm transition-all"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? <SpinnerLoader className="mr-2 h-4 w-4" /> : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section: Company Details */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Company Details</h2>
              <p className="text-xs text-gray-500 mt-1">These details will be visible to candidates during the interview process.</p>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Company Name</Label>
                  <Input 
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter Company Name"
                    className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Company Size</Label>
                  <Select 
                    value={formData.companySize}
                    onValueChange={(value) => handleSelectChange('companySize', value)}
                  >
                    <SelectTrigger className="h-11 rounded-md border-gray-200 bg-white text-sm font-medium text-gray-700">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1 - 10 employees</SelectItem>
                      <SelectItem value="11-50">11 - 50 employees</SelectItem>
                      <SelectItem value="51-200">51 - 200 employees</SelectItem>
                      <SelectItem value="201-500">201 - 500 employees</SelectItem>
                      <SelectItem value="501-1000">501 - 1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Industry</Label>
                  <Input 
                    id="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="eg. Software Development"
                    className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Location</Label>
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter Location"
                    className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Company Website</Label>
                  <Input 
                    id="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Company Description</Label>
                  <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your company..."
                    className="min-h-[100px] rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" 
                  />
                </div>
                {/* <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Primary Use-Case</Label>
                  <Select 
                    value={formData.primaryUseCase}
                    onValueChange={(value) => handleSelectChange('primaryUseCase', value)}
                  >
                    <SelectTrigger className="h-11 rounded-md border-gray-200 bg-white text-sm font-medium text-gray-700">
                      <SelectValue placeholder="Select use-case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Hiring for my own company</SelectItem>
                      <SelectItem value="agency">Recruiting for external clients (Agency)</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  className="bg-[#08b8cc] hover:bg-[#07a3b5] text-white px-8 h-10 text-sm font-bold rounded-md shadow-sm transition-all"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? <SpinnerLoader className="mr-2 h-4 w-4" /> : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section: Security & Preferences */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Security & Preferences</h2>
              <p className="text-xs text-gray-500 mt-1">Manage your account security and general application preferences.</p>
            </div>
            <CardContent className="p-8 space-y-8">
              {/* <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-700">Two-factor Authentication</h3>
                  <p className="text-xs text-gray-400">Require an extra security step when logging into your account.</p>
                </div>
                <Switch 
                  checked={tfa} 
                  onCheckedChange={setTfa}
                  className="data-[state=checked]:bg-[#08b8cc]"
                />
              </div> */}

              {/* <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-700">AI Matching Alerts</h3>
                  <p className="text-xs text-gray-400">Receive daily digest emails when AI finds matches above 85%.</p>
                </div>
                <Switch 
                  checked={aiAlerts} 
                  onCheckedChange={setAiAlerts}
                  className="data-[state=checked]:bg-[#08b8cc]"
                />
              </div> */}

              <div className="pt-2 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-700">Change Password</h3>
                    <p className="text-xs text-gray-400">Update your login credentials here.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="h-10 px-6 text-sm font-bold border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                  >
                    {showPasswordFields ? "Cancel" : "Update password"}
                  </Button>
                </div>

                {showPasswordFields && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700">Current Password</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        className="h-10 bg-white"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700">New Password</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••"
                        className="h-10 bg-white"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700">Confirm New Password</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="password"
                          placeholder="••••••••"
                          className="h-10 bg-white"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                        <Button 
                          className="bg-[#08b8cc] hover:bg-[#07a3b5] text-white h-10 font-bold px-4"
                          onClick={handleUpdatePassword}
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? <SpinnerLoader className="h-4 w-4" /> : "Update"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section: Danger Zone */}
          <Card className="border border-red-100 shadow-sm rounded-xl overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-red-50 bg-red-50/10">
              <h2 className="text-sm font-bold text-red-500 tracking-tight uppercase">Danger Zone</h2>
              <p className="text-xs text-red-400 mt-1">Irreversible and destructive actions for your account.</p>
            </div>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-700">Delete Account</h3>
                  <p className="text-xs text-gray-400 max-w-md">Permanently delete your account and all associated data, jobs, and candidates.</p>
                </div>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white px-6 h-10 text-xs font-bold rounded-md shadow-sm transition-all whitespace-nowrap"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? <SpinnerLoader className="mr-2 h-4 w-4" /> : null}
                  Delete account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerSettings;
