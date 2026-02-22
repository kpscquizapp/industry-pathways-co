import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetProfileImageQuery,
  useRemoveProfileImageMutation,
  useUpdateEmployerProfileMutation,
  useUploadProfileImageMutation,
  useGetEmployerProfileQuery,
} from "@/app/queries/employerApi";
import SpinnerLoader from "./loader/SpinnerLoader";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface UserProfile {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  company?: string;
  companyDetails?: string;
  role?: string;
}

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
}

const ProfileDialog = ({ open, onOpenChange, user }: ProfileDialogProps) => {
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateEmployerProfileMutation();
  const [activeTab, setActiveTab] = useState("view");
  const { data: profileImage, isError: isProfileImageError } =
    useGetProfileImageQuery(user?.id || "", {
      skip: !user?.id,
    });
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetEmployerProfileQuery(undefined, {
    skip: !open,
  });
  const prevOpen = useRef(false);
  const hasPopulated = useRef(false);

  const [uploadProfileImage, { isLoading: isUploadingImage }] =
    useUploadProfileImageMutation();
  const [removeProfileImage, { isLoading: isRemovingImage }] =
    useRemoveProfileImageMutation();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const updateData = profile?.data?.employerProfile;

  const updatedData = useMemo(
    () => ({
      companyName: updateData?.companyName || "",
      industry: updateData?.industry || "",
      location: updateData?.location || "",
      companySize: updateData?.companySize || "",
      website: updateData?.website || "",
      description: updateData?.description || "",
    }),
    [updateData],
  );

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    location: "",
    companySize: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    if (open && !prevOpen.current) {
      hasPopulated.current = false; // reset on new open
    }
    if (open && !hasPopulated.current && updateData) {
      setFormData(updatedData);

      hasPopulated.current = true;
      if (!prevOpen.current) setActiveTab("view");
    } else if (open && !prevOpen.current) {
      // dialog opened but data not yet available — clear stale values
      setFormData({
        companyName: "",
        industry: "",
        location: "",
        companySize: "",
        website: "",
        description: "",
      });
    }
    prevOpen.current = open;
  }, [open, updateData, updatedData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation for images
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        if (imageInputRef.current) imageInputRef.current.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("Image size should be less than 2MB");
        if (imageInputRef.current) imageInputRef.current.value = "";
        return;
      }

      const data = new FormData();
      data.append("image", file);

      try {
        await uploadProfileImage(data).unwrap();
        toast.success("Profile image updated successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to upload image");
      } finally {
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
      }
    }
  };

  const handleImageRemove = async () => {
    if (!user?.id) {
      toast.error("User ID not available");
      return;
    }
    try {
      await removeProfileImage(user.id).unwrap();
      toast.success("Profile image removed");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim())
      return toast.error("Company name is required");

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        industry: formData.industry.trim(),
        location: formData.location.trim(),
        companySize: formData.companySize,
        description: formData.description.trim(),
        website: formData.website.trim(),
      };

      await updateProfile(payload).unwrap();
      toast.success("Profile updated successfully");
      hasPopulated.current = false;
      setActiveTab("view");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            View and update your profile information.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:p-1 p-0">
            <TabsTrigger value="view">View Profile</TabsTrigger>
            <TabsTrigger value="update">Update Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-slate-100 bg-slate-300">
                {profileImage && (
                  <AvatarImage
                    className="object-cover"
                    src={profileImage}
                    alt={`${user?.firstName ?? "User"} profile image`}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {user?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground uppercase text-left">
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-300 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    First Name
                  </Label>
                  <p className="font-medium text-slate-900">
                    {user?.firstName || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Last Name
                  </Label>
                  <p className="font-medium text-slate-900">
                    {user?.lastName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Email
                </Label>
                <p className="font-medium text-slate-900">
                  {user?.email || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Organization
                </Label>
                <p className="font-medium text-slate-900">
                  {updateData?.companyName ||
                    user?.companyName ||
                    user?.company ||
                    "N/A"}
                </p>
              </div>
              {updateData ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Industry
                    </Label>
                    <p className="font-medium text-slate-900">
                      {updateData.industry || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Location
                    </Label>
                    <p className="font-medium text-slate-900">
                      {updateData.location || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Company Size
                    </Label>
                    <p className="font-medium text-slate-900">
                      {updateData.companySize || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Website
                    </Label>
                    <p className="font-medium text-slate-900">
                      {updateData.website || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Description
                    </Label>
                    <p className="font-medium text-slate-900">
                      {updateData.description || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center my-8">
                  <SpinnerLoader />
                  Loading...
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="update" className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Management */}
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-slate-100 bg-slate-300">
                    {profileImage && (
                      <AvatarImage
                        className="object-cover"
                        src={profileImage}
                        alt={`${user?.firstName ?? "User"} profile image`}
                      />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (!isUploadingImage && !isRemovingImage)
                        imageInputRef.current?.click();
                    }}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        !isUploadingImage &&
                        !isRemovingImage
                      )
                        imageInputRef.current?.click();
                    }}
                    className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                      <SpinnerLoader className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploadingImage || isRemovingImage}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Change Photo
                  </Button>
                  {profileImage && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="rounded-xl text-xs h-8 px-3"
                      aria-label="Remove photo"
                      onClick={handleImageRemove}
                      disabled={isRemovingImage || isUploadingImage}
                    >
                      {isRemovingImage ? (
                        <SpinnerLoader className="h-3 w-3" />
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/webp"
                />
                <p className="text-[10px] text-muted-foreground">
                  JPG, PNG or WebP. Max 2MB
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter Your Company Name"
                    className="rounded-xl border-slate-200 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    type="text"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="eg. Software Development"
                    className="rounded-xl border-slate-200 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter Your Location"
                  className="rounded-xl border-slate-200 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm font-medium">
                  Company Size
                </Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, companySize: value }))
                  }
                >
                  <SelectTrigger
                    id="companySize"
                    className="rounded-xl border-slate-200 focus:border-primary"
                  >
                    <SelectValue placeholder="Select Company Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="501-1000">501-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief company description"
                  rows={3}
                  className="rounded-xl border-slate-200 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="eg. https://example.com"
                  className="rounded-xl border-slate-200 focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isUpdating}
                  className="rounded-xl px-6 hover:bg-red-600 border border-slate-300 hover:text-white"
                  onClick={() => {
                    setFormData(updatedData);
                    setActiveTab("view");
                  }}
                >
                  Discard Changes
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl px-8"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <SpinnerLoader className="mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>Save All Changes</>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
