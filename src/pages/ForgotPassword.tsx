import { useForgotPasswordMutation } from "@/app/queries/loginApi";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { VALIDATION } from "@/services/utils/signUpValidation";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Email = {
  email: string;
};
type FieldErrorKey = keyof Email;

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [forgotEmail, setForgotEmail] = useState({
    email: "",
  });
  // Field-level errors for better UX
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldErrorKey, string>>
  >({});

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldErrors.email) {
      setFieldErrors((prev) => {
        const { email: _email, ...rest } = prev;
        return rest;
      });
    }
    setForgotEmail((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const trimmedEmail = forgotEmail.email.trim();

    const emailError = VALIDATION.email.validate(trimmedEmail);
    if (emailError) errors.email = emailError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }
    setFieldErrors({});

    setForgotEmail((prev) => ({ ...prev, email: trimmedEmail }));
    // Handle password reset logic here
    try {
      const result = await forgotPassword({ email: trimmedEmail }).unwrap();

      if (result?.success) {
        toast.success("If the email exists, a reset link will be sent");
      } else {
        toast.error(result?.message || "Failed to send password reset email.");
      }
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to send password reset email.");
      toast.error(message);
    }
  };

  return (
    <>
      <LandingHeader />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-neutral-50">
        <main className="flex-1 pt-24 pb-12 px-4 sm:pt-32 sm:pb-20 flex items-center justify-center">
          <div className="container mx-auto max-w-3xl ">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="space-y-2 text-center bg-gradient-to-br from-primary  to-primary/80 text-primary-foreground p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  Forgot Password
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                  Enter your email address to reset your password
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div className="flex sm:ml-5 justify-center flex-col">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            value={forgotEmail.email}
                            className={cn(
                              "h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium",
                              fieldErrors.email &&
                                "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                            )}
                            placeholder="Enter your email"
                            type="email"
                            name="email"
                            onChange={handleEmailChange}
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.email} />
                      </div>
                      <div className="my-8">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] shadow-lg"
                        >
                          {isLoading ? (
                            <>
                              <SpinnerLoader />
                              <span className="ml-2">Sending...</span>
                            </>
                          ) : (
                            <>Send Reset Link</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <div className="mb-6">
                <p className="text-center text-[16px] text-muted-foreground">
                  <Link className="text-primary font-semibold" to="/">
                    Go Back To Home{" "}
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <LandingFooter />
    </>
  );
};

export default ForgotPassword;
