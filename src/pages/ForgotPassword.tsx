import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle password reset logic here
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-neutral-50">
        <Header />

        <main className="flex-1 pt-24 pb-12 px-4 sm:pt-32 sm:pb-20">
          <div className="container mx-auto max-w-6xl ">
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
                  <div className="space-y-5 grid-cols-1 grid sm:grid-cols-2">
                    <div className="">
                      <img
                        src="https://placehold.co/600x400"
                        alt="Images"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex sm:ml-5 justify-center flex-col">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            value={email}
                            className="pl-11 h-12 text-base"
                            placeholder="Enter your email"
                            type="email"
                            onChange={handleEmailChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] shadow-lg"
                        >
                          Get OTP
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <div className="my-6">
                <p className="text-center text-[16px] text-muted-foreground">
                  Go back to{" "}
                  <Link className="text-primary font-semibold" to="/login">
                    Login
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ForgotPassword;
