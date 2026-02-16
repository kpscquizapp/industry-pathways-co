import React, { useState, useRef, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon, Camera } from "lucide-react";
import { toast } from "sonner";
import { VALIDATION } from "@/services/utils/signUpValidation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  const [activeTab, setActiveTab] = useState("view");
  //   const { data: profileImage } = useGetProfileImageQuery(user?.id || "", {
  //     skip: !user?.id,
  //   });

  //   const [uploadProfileImage, { isLoading: isUploadingImage }] =
  //     useUploadProfileImageMutation();
  //   const [removeProfileImage, { isLoading: isRemovingImage }] =
  //     useRemoveProfileImageMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    companyName: user?.companyName || "",
    companyDetails: user?.companyDetails || "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        email: user?.email || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        companyName: user?.companyName || "",
        companyDetails: user?.companyDetails || "",
      });
      setErrors({});
      setCompanyDocument(null);
      setActiveTab("view");
    }
  }, [open, user]);

  const [companyDocument, setCompanyDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileError = VALIDATION.document.validate(file);
      if (fileError) {
        toast.error(fileError);
        return;
      }
      setCompanyDocument(file);
      // Reset input so re-selecting the same file triggers onChange
      e.target.value = "";
      if (errors.companyDocument) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.companyDocument;
          return newErrors;
        });
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation for images
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      const data = new FormData();
      data.append("image", file);

      try {
        // await uploadProfileImage(data).unwrap();
        // toast.success("Profile image updated successfully"); API coming soon
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to upload image");
      }
    }
  };

  const handleImageRemove = async () => {
    try {
      //   await removeProfileImage(user?.id).unwrap(); API coming soon
      // toast.success("Profile image removed");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove image");
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const firstNameErr = VALIDATION.name.validate(
      formData.firstName,
      "First name",
    );
    if (firstNameErr) newErrors.firstName = firstNameErr;
    const lastNameErr = VALIDATION.name.validate(
      formData.lastName,
      "Last name",
    );
    if (lastNameErr) newErrors.lastName = lastNameErr;
    const emailErr = VALIDATION.email.validate(formData.email);
    if (emailErr) newErrors.email = emailErr;
    const companyErr = VALIDATION.companyName.validate(formData.companyName);
    if (companyErr) newErrors.companyName = companyErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("companyName", formData.companyName);
      if (formData.companyDetails) {
        data.append("companyDetails", formData.companyDetails);
      }
      if (companyDocument) {
        data.append("companyDocument", companyDocument);
      }

      //   await updateProfile(data).unwrap(); //API not implemented
      // toast.success("Profile updated successfully");
      // setActiveTab("view");
      // TODO: uncomment setActiveTab("view") once updateProfile API is wired up
      toast.info("Profile update is not yet available");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl">
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
              <Avatar className="h-24 w-24 border-2 border-slate-100">
                {/* <AvatarImage src={profileImage || ""} /> */}
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
                  {user?.companyName || user?.company || "N/A"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="update" className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Management */}
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-slate-100">
                    {/* <AvatarImage src={profileImage || ""} /> */}
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  {/* {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )} */}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs"
                    onClick={() => imageInputRef.current?.click()}
                    // disabled={isUploadingImage}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Change Photo
                  </Button>
                  {/* {profileImage && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="rounded-xl text-xs h-8 px-3"
                      onClick={handleImageRemove}
                      disabled={isRemovingImage}
                    >
                      {isRemovingImage ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  )} */}
                </div>
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <p className="text-[10px] text-muted-foreground">
                  JPG, PNG or GIF. Max 5MB
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Mike"
                    className="rounded-xl border-slate-200 focus:border-primary"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Johnson"
                    className="rounded-xl border-slate-200 focus:border-primary"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="hr@company.com"
                  className="rounded-xl border-slate-200 focus:border-primary"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Organization Name
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Tech Corp"
                  className="rounded-xl border-slate-200 focus:border-primary"
                />
                {errors.companyName && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDetails" className="text-sm font-medium">
                  Organization Bio
                </Label>
                <Textarea
                  id="companyDetails"
                  name="companyDetails"
                  value={formData.companyDetails}
                  onChange={handleInputChange}
                  placeholder="Brief description about your organization..."
                  className="rounded-xl border-slate-200 focus:border-primary min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Verification Document (PDF/DOCX)
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-1 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all hover:bg-slate-50 flex flex-col items-center gap-3 ${
                    errors.companyDocument
                      ? "border-red-500 bg-red-50/10"
                      : "border-slate-200"
                  }`}
                >
                  {companyDocument ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-slate-900">
                          {companyDocument.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">
                          {(companyDocument.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCompanyDocument(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-700">
                          Drop file here or click
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Security verification required (.pdf, .doc, .docx)
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                {errors.companyDocument && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.companyDocument}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl px-6 hover:bg-red-600 border border-slate-300 hover:text-white"
                  onClick={() => setActiveTab("view")}
                >
                  Discard Changes
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl px-8"
                  //   disabled={isLoading}
                >
                  {/* {isLoading ? ( */}
                  {/* <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : ( */}
                  Save All Changes
                  {/* )} */}
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
