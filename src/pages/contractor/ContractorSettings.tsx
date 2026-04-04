import React, { useState, memo } from "react";
import { Bell, Shield, Eye, Trash2, Lock, Mail, Smartphone, Globe } from "lucide-react";
import { toast } from "sonner";
import BarLoader from "@/components/loader/BarLoader";
import { cn } from "@/lib/utils";
import { useChangePasswordMutation, useDeleteMyAccountMutation } from "@/app/queries/profileApi";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/app/queries/loginApi";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ═══════════ DESIGN TOKENS ═══════════ */
const C = {
  accent: "#4DD9E8",
  accentDark: "#0e8a96",
  accentBg: "rgba(77,217,232,0.08)",
  accentBorder: "rgba(77,217,232,0.18)",
  text: "#1a1a2e",
  textSec: "#555",
  textMuted: "#999",
  border: "#e8eaef",
  bgInput: "#f8f9fb",
  bgPage: "#f5f6f8",
  bgCard: "#fff",
  danger: "#ef4444",
  dangerBg: "rgba(239,68,68,0.06)",
  green: "#22c55e",
  greenBg: "rgba(34,197,94,0.08)",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.08)",
};

/* ═══════════ REUSABLE COMPONENTS ═══════════ */
const Card = memo(({ children, className, hover, style }: { children: React.ReactNode; className?: string; hover?: boolean; style?: React.CSSProperties }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={hover ? () => setHov(true) : undefined}
      onMouseLeave={hover ? () => setHov(false) : undefined}
      className={cn(
        "rounded-2xl border transition-all duration-300 overflow-hidden bg-white",
        hov ? "shadow-2xl -translate-y-1" : "shadow-sm",
        className
      )}
      style={{
        borderColor: C.border,
        ...style
      }}
    >
      {children}
    </div>
  );
});

const SectionTitle = memo(({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="w-10 h-10 rounded-xl bg-[#4DD9E8]/10 flex items-center justify-center text-[#0e8a96] shrink-0">
      <Icon size={20} strokeWidth={2.2} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
  </div>
));

const FormField = memo(({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[13px] font-bold text-slate-700 ml-1 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
));

const TextInput = memo(({ placeholder, value, onChange, type = "text" }: { placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none transition-all duration-200 focus:border-[#4DD9E8] focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400"
  />
));

const Toggle = memo(({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={cn(
      "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 min-h-0 min-w-0",
      enabled ? "bg-[#4DD9E8]" : "bg-slate-200"
    )}
  >
    <div
      className={cn(
        "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
        enabled ? "translate-x-5" : ""
      )}
    />
  </button>
));

const ContractorSettings = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState({
    emailJobAlerts: true,
    emailInterviews: true,
    pushNotifications: true,
    marketingEmails: false,
  });
  const [visibility, setVisibility] = React.useState({
    employers: true,
    contact: true
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const navigate = useNavigate();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteMyAccount, { isLoading: isDeletingAccount }] = useDeleteMyAccountMutation();
  const [logout] = useLogoutMutation();

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      }).unwrap();
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm account deletion");
      return;
    }

    try {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      await deleteMyAccount({ password: deletePassword }).unwrap();
      toast.success("Account deleted successfully");
      await logout(refreshToken).unwrap();
      localStorage.clear();
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete account. Please check your password.");
      setIsDeleteDialogOpen(false); 
      setDeletePassword(""); 
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <BarLoader />
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading your preferences...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4 sm:px-2 font-sans animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Account Settings</h2>
        <p className="text-muted-foreground mt-2">Manage your account preferences, security, and visibility.</p>
      </div>

      <div className="flex flex-col gap-6 pb-12">
        {/* Account Security */}
        <Card hover className="p-5 sm:p-6 md:p-8">
          <SectionTitle
            icon={Shield}
            title="Account Security"
            subtitle="Secure your account with a strong password"
          />
          <div className="flex flex-col gap-6 max-w-full">
            <FormField label="Current Password">
              <TextInput 
                type="password" 
                placeholder="Enter Current Password" 
                value={passwords.current}
                onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="New Password">
                <TextInput 
                  type="password" 
                  placeholder="Enter New Password" 
                  value={passwords.new}
                  onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                />
              </FormField>
              <FormField label="Confirm New Password">
                <TextInput 
                  type="password" 
                  placeholder="Enter Confirm New Password" 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                />
              </FormField>
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

        {/* Notifications */}
        {/* <Card hover className="p-5 sm:p-6 md:p-8">
          <SectionTitle
            icon={Bell}
            title="Notifications"
            subtitle="Choose how you want to be notified"
          />
          <div className="flex flex-col gap-4">
            {[
              { id: "emailJobAlerts", label: "Job Alert Emails", desc: "Receive updates for new jobs matching your profile", icon: Mail },
              { id: "emailInterviews", label: "Interview Updates", desc: "Get notified when an employer requests an interview", icon: Globe },
              { id: "pushNotifications", label: "Push Notifications", desc: "Real-time updates delivered to your browser", icon: Smartphone }
            ].map((n, i, arr) => (
              <div key={n.id} className={cn(
                "flex items-center justify-between py-4",
                i !== arr.length - 1 ? "border-b border-slate-50" : ""
              )}>
                <div className="flex gap-3 sm:gap-4 items-center flex-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <n.icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-bold text-slate-900 leading-tight truncate-1">{n.label}</h4>
                    <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-2 md:line-clamp-none">{n.desc}</p>
                  </div>
                </div>
                <Toggle
                  enabled={(notifications as any)[n.id]}
                  onToggle={() => setNotifications(p => ({ ...p, [n.id]: !(p as any)[n.id] }))}
                />
              </div>
            ))}
          </div>
        </Card> */}

        {/* Profile Visibility */}
        {/* <Card hover className="p-5 sm:p-6 md:p-8">
          <SectionTitle
            icon={Eye}
            title="Profile Visibility"
            subtitle="Control who can find and view your details"
          />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-4 border-b border-slate-50 gap-4">
              <div className="min-w-0">
                <h4 className="text-[15px] font-bold text-slate-900 leading-tight">Visible to Employers</h4>
                <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">Let employers find you in their search results</p>
              </div>
              <Toggle enabled={visibility.employers} onToggle={() => setVisibility(p => ({ ...p, employers: !p.employers }))} />
            </div>
            <div className="flex items-center justify-between py-4 gap-4">
              <div className="min-w-0">
                <h4 className="text-[15px] font-bold text-slate-900 leading-tight">Show Contact Information</h4>
                <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">Display your email and phone number to matched employers</p>
              </div>
              <Toggle enabled={visibility.contact} onToggle={() => setVisibility(p => ({ ...p, contact: !p.contact }))} />
            </div>
          </div>
        </Card> */}

        {/* Danger Zone */}
        <Card className="p-5 sm:p-6 md:p-8 border-red-100 bg-red-50/90 shadow-red-100/20">
          <SectionTitle
            icon={Trash2}
            title="Danger Zone"
            subtitle="Permanently delete your account and data"
          />
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
      </div>
    </div>
  );
};

export default ContractorSettings;
