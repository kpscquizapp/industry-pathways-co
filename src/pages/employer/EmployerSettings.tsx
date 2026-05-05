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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  const accountSecurityRef = useRef<HTMLDivElement>(null);

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteMyAccountMutation();
  const [handleLogout] = useLogout();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

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
    if (!deletePassword) {
      toast.error("Please enter your password to confirm account deletion");
      return;
    }
    try {
      await deleteAccount({ password: deletePassword }).unwrap();
      toast.success("Account deleted successfully");
      handleLogout();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete account");
      setIsDeleteDialogOpen(false);
      setDeletePassword("");
    }
  };

  const navItems = [
    { label: 'General Account', icon: User },
    { label: 'Account Settings', icon: Building },
  ];

  return (
    <div className="min-h-full bg-[#f2f5fa] font-sans pb-12">
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-[1400px] mx-auto space-y-8">
        {/* ═══════════════ HEADER ═══════════════ */}
        <div>
          <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Settings
          </h1>
          <p className="text-gray-400 text-[15px] mt-1">
            Manage your account preferences, company profile, and team settings.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-[260px] flex flex-col gap-1 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveNav(item.label);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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

          {/* ── General Account Tab ── */}
          {activeNav === 'General Account' && (
            <>
              {/* Section: Personal Information */}
              <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                <div className="px-6 py-5 border-b border-gray-50">
                  <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Personal Information</h2>
                  <p className="text-xs text-gray-500 mt-1">Update your personal profile details and email address.</p>
                </div>
                <CardContent className="p-8 space-y-8">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-20 w-20 border-2 border-slate-100 bg-slate-100 shadow-inner">
                        {profileImage && (
                          <AvatarImage className="object-cover" src={profileImage} alt={`${user?.firstName ?? "User"} profile image`} />
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

                  {/* Name & Email fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700">First Name</Label>
                      <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter First Name" className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700">Last Name</Label>
                      <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter Last Name" className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-xs font-bold text-gray-700">Email Address</Label>
                      <Input id="emailAddress" value={formData.emailAddress} readOnly className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-gray-50 text-sm text-gray-500 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button className="bg-[#08b8cc] hover:bg-[#07a3b5] text-white px-8 h-10 text-sm font-bold rounded-md shadow-sm transition-all" onClick={handleSave} disabled={isUpdating}>
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
                      <Input id="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Enter Company Name" className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700">Company Size</Label>
                      <Select value={formData.companySize} onValueChange={(value) => handleSelectChange('companySize', value)}>
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
                      <Input id="industry" value={formData.industry} onChange={handleInputChange} placeholder="eg. Software Development" className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700">Location</Label>
                      <Input id="location" value={formData.location} onChange={handleInputChange} placeholder="Enter Location" className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-xs font-bold text-gray-700">Company Website</Label>
                      <Input id="website" value={formData.website} onChange={handleInputChange} placeholder="https://example.com" className="h-11 rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-xs font-bold text-gray-700">Company Description</Label>
                      <Textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Briefly describe your company..." className="min-h-[100px] rounded-md border-gray-200 focus-visible:ring-[#08b8cc] bg-white text-sm" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button className="bg-[#08b8cc] hover:bg-[#07a3b5] text-white px-8 h-10 text-sm font-bold rounded-md shadow-sm transition-all" onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? <SpinnerLoader className="mr-2 h-4 w-4" /> : null}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── Account Settings Tab ── */}
          {activeNav === 'Account Settings' && (
            <>
              {/* Section: Account Security */}
              <Card ref={accountSecurityRef} className="p-5 sm:p-6 md:p-8 flex flex-col gap-6 shadow-sm border border-gray-100 rounded-2xl bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#4DD9E8]/10 flex items-center justify-center text-[#0e8a96] shrink-0">
                    <Shield size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Account Security</h3>
                    <p className="text-sm text-slate-500 mt-1">Secure your account with a strong password</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6 max-w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-[13px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none transition-all duration-200 focus:border-[#4DD9E8] focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[13px] font-bold text-slate-700 ml-1 uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter New Password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none transition-all duration-200 focus:border-[#4DD9E8] focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[13px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Enter Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none transition-all duration-200 focus:border-[#4DD9E8] focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleUpdatePassword}
                    disabled={isChangingPassword}
                    className="mt-2 w-full sm:w-fit px-8 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </Card>

              {/* Section: Danger Zone */}
              <Card className="p-5 sm:p-6 md:p-8 border-red-100 bg-red-50/90 shadow-red-100/20 rounded-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#4DD9E8]/10 flex items-center justify-center text-[#0e8a96] shrink-0">
                    <Trash2 size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Danger Zone</h3>
                    <p className="text-sm text-slate-500 mt-1">Permanently delete your account and data</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                    Once you delete your account, there is no going back. All your profile data, interview history, and skill assessment results will be permanently removed.
                  </p>

                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={isDeletingAccount}
                        className="w-full sm:w-fit px-8 py-3 rounded-xl bg-white border-2 border-red-100 text-red-500 text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-all duration-300 shadow-sm disabled:opacity-50"
                        onClick={() => {
                          setDeletePassword("");
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        {isDeletingAccount ? "Deleting..." : "Delete My Account"}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[425px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Trash2 className="text-red-500" size={24} />
                          Confirm Account Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 py-4">
                          This action is <span className="font-bold text-red-600 uppercase tracking-tight">permanent</span> and cannot be undone.
                          All your professional data will be wiped from our systems.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" title="password confirmation field" className="text-sm font-semibold text-slate-700">
                            To confirm, please enter your password:
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Your account password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="border-slate-200 focus-visible:ring-[#4DD9E8]/30"
                          />
                        </div>
                      </div>

                      <AlertDialogFooter className="gap-3 sm:gap-2">
                        <AlertDialogCancel className="rounded-xl border-slate-200 font-semibold hover:bg-slate-50 transition-colors">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteAccount();
                          }}
                          disabled={!deletePassword || isDeletingAccount}
                          className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-300 shadow-lg shadow-red-200 disabled:opacity-50"
                        >
                          {isDeletingAccount ? "Processing..." : "Confirm Deletion"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            </>
          )}

        </div>
      </div>
    </div>
  </div>
  );
};

export default EmployerSettings;
