import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Lock,
  Building2,
  FileText,
  Upload,
  X,
  CheckCircle2,
  Sparkles,
  Users,
  TrendingUp,
  BarChart3,
  Loader,
  EyeOff,
  Eye,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
// import { useCreateHRMutation } from "@/app/queries/loginApi";

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  companyDetails: string;
  companyDocument: File | null;
}

// Validation regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const BenchRegistration = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    companyName: "",
    companyDetails: "",
    companyDocument: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [createHR, { isLoading: isLoadingHR }] = useCreateHRMutation();
  const navigate = useNavigate();

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and DOCX files are allowed");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    updateFormData("companyDocument", file);
    toast.success("Document uploaded successfully");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    updateFormData("companyDocument", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (isLoadingHR) return;

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.companyName ||
      !formData.companyDocument
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    if (!EMAIL_REGEX.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation
    if (!PASSWORD_REGEX.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, and a number",
      );
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("companyName", formData.companyName);
      submitData.append("companyDetails", formData.companyDetails);
      if (formData.companyDocument) {
        submitData.append("companyDocument", formData.companyDocument);
      }

      // await createHR(submitData).unwrap();
      toast.success("Registration successful! Welcome aboard!");
      navigate("/hr-login");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  const features = [
    {
      icon: Users,
      label: "Bench Talent Pool",
      description: "Manage and showcase your idle resources",
      highlight: true,
    },
    {
      icon: Sparkles,
      label: "AI Job Matching",
      description: "Get matched with relevant opportunities",
      highlight: false,
    },
    {
      icon: BarChart3,
      label: "Revenue Analytics",
      description: "Track placements and earnings",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-8">
            {/* Left Column - Features */}
            <div className="space-y-6 order-2 lg:order-1">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-foreground">
                      HIRION
                    </span>
                    <p className="text-xs text-muted-foreground">
                      AI Talent & Bench Marketplace
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                  <Sparkles className="h-4 w-4" />
                  For HR & Staffing Companies
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Monetize Your Bench Talent
                </h1>
                <p className="text-muted-foreground text-lg">
                  Join the leading platform for staffing companies to list idle
                  resources and connect with hiring companies instantly.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      feature.highlight
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                        : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        feature.highlight
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10"
                      }`}
                    >
                      <feature.icon
                        className={`h-5 w-5 ${feature.highlight ? "" : "text-primary"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{feature.label}</h3>
                      <p
                        className={`text-sm ${
                          feature.highlight
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      ACTIVE CLIENTS
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    hiring companies on platform
                  </p>
                </Card>
                <Card className="bg-card border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      AVG. PLACEMENT TIME
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-primary">48hrs</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    from listing to placement
                  </p>
                </Card>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <Card className="shadow-xl border-border rounded-2xl overflow-hidden bg-card order-1 lg:order-2">
              <CardContent className="p-8 sm:p-10">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Create HR Account
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Register your staffing company to start monetizing your
                      bench
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={(e) =>
                              updateFormData("firstName", e.target.value)
                            }
                            className="pl-12 h-12 rounded-xl border-border bg-background"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={(e) =>
                              updateFormData("lastName", e.target.value)
                            }
                            className="pl-12 h-12 rounded-xl border-border bg-background"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter company email"
                          value={formData.email}
                          onChange={(e) =>
                            updateFormData("email", e.target.value)
                          }
                          className="pl-12 h-12 rounded-xl border-border bg-background"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) =>
                            updateFormData("password", e.target.value)
                          }
                          className="pl-12 h-12 rounded-xl border-border bg-background"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors min-h-0 min-w-0"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          aria-pressed={showPassword}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be 8+ characters with uppercase, lowercase, and
                        number
                      </p>
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="companyName"
                        className="text-sm font-medium"
                      >
                        Company Name <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Enter your company name"
                          value={formData.companyName}
                          onChange={(e) =>
                            updateFormData("companyName", e.target.value)
                          }
                          className="pl-12 h-12 rounded-xl border-border bg-background"
                          required
                        />
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="companyDetails"
                        className="text-sm font-medium"
                      >
                        Company Details{" "}
                        <span className="text-muted-foreground text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Textarea
                          id="companyDetails"
                          placeholder="Tell us about your company, services, and expertise..."
                          value={formData.companyDetails}
                          onChange={(e) =>
                            updateFormData("companyDetails", e.target.value)
                          }
                          className="pl-12 min-h-[100px] rounded-xl border-border bg-background resize-none"
                        />
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Company Document{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div
                        className={`relative border-2 border-dashed rounded-xl transition-all ${
                          dragActive
                            ? "border-primary bg-primary/5"
                            : "border-border bg-background"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          id="companyDocument"
                        />

                        {!formData.companyDocument ? (
                          <label
                            htmlFor="companyDocument"
                            className="flex flex-col items-center justify-center p-6 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                              <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF or DOCX (max. 10MB)
                            </p>
                          </label>
                        ) : (
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {formData.companyDocument.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(
                                    formData.companyDocument.size /
                                    (1024 * 1024)
                                  ).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-2 mt-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          Upload company registration certificate, business
                          license, or similar verification document
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all text-base shadow-lg mt-6"
                      // disabled={isLoadingHR}
                    >
                      {/* {isLoadingHR ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <CheckCircle2 className="ml-2 h-5 w-5" />
                        </>
                      )} */}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to="/hr-login"
                      className="text-primary hover:underline font-medium"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default BenchRegistration;
