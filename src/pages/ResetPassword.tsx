import { useResetPasswordMutation } from "@/app/queries/loginApi";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
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
import { VALIDATION } from "@/services/utils/signUpValidation";
import { Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Password = {
  password: string;
};
type FieldErrorKey = keyof Password;

const ResetPassword = () => {
  const navigation = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldErrorKey, string>>
  >({});
  const [resetNewPassword] = useResetPasswordMutation();
  const [resetPassword, setResetPassword] = useState({
    // token: "", not yet implemented
    password: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setResetPassword((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const trimmedPassword = resetPassword.password.trim();

    if (trimmedPassword === "") {
      setFieldErrors({ password: "Password is required" });
      return;
    }

    const passwordError = VALIDATION.password.validate(trimmedPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }
    setFieldErrors({});

    // Handle password reset logic here
    try {
      const result = await resetNewPassword(trimmedPassword).unwrap();

      if (result?.success) {
        toast.success("Password reset successfully.");
        navigation("/");
      }
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        (error instanceof Error ? error.message : "Failed to reset password.");
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
                  Reset Password
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                  Enter your New Password to reset your password
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div className="flex sm:ml-5 justify-center flex-col">
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            value={resetPassword.password}
                            className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                              fieldErrors.password
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : ""
                            }`}
                            placeholder="Enter your New Password"
                            type="password"
                            name="password"
                            onChange={handlePasswordChange}
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.password} />
                      </div>
                      <div className="my-8">
                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] shadow-lg"
                        >
                          Reset Password
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

export default ResetPassword;
