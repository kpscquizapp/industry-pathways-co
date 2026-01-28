import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { jobListings } from "@/data/jobListings";
import { JobListing } from "@/types/job";
import { useSelector } from "react-redux";

const JobRecommendations = () => {
  // const { user } = useAuth();
  const user = useSelector((state: any) => state.user.userDetails);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<JobListing[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // AI-based recommendation algorithm
    const getRecommendations = () => {
      let scored = jobListings.map((job) => {
        let score = 0;

        // Prefer contract jobs if user selected that preference
        if (user.lookingForContract) {
          if (
            job.type.en.toLowerCase().includes("contract") ||
            job.type.en.toLowerCase().includes("temporary") ||
            job.type.en.toLowerCase().includes("freelance")
          ) {
            score += 50;
          }
        } else {
          if (job.type.en.toLowerCase().includes("full-time")) {
            score += 30;
          }
        }

        // Match skills if available - give extra weight to validated skills
        if (user.skills && job.skills) {
          const matchingSkills = job.skills.filter((skill) =>
            user.skills?.some(
              (userSkill) => userSkill.toLowerCase() === skill.toLowerCase()
            )
          );

          // Regular skill match
          score += matchingSkills.length * 20;

          // Bonus for validated skills
          if (user.validatedSkills) {
            const validatedMatches = matchingSkills.filter((skill) =>
              user.validatedSkills?.some(
                (validated) => validated.toLowerCase() === skill.toLowerCase()
              )
            );
            score += validatedMatches.length * 30; // Extra 30 points per validated skill match
          }
        }

        // Match experience level
        if (user.experience && job.experience) {
          const userYears = parseInt(user.experience);
          const jobYears = parseInt(job.experience);
          if (!isNaN(userYears) && !isNaN(jobYears)) {
            const diff = Math.abs(userYears - jobYears);
            if (diff <= 2) score += 15;
          }
        }

        // Boost featured jobs
        if (job.featured) score += 10;

        // Location match
        if (
          user.location &&
          job.location.toLowerCase().includes(user.location.toLowerCase())
        ) {
          score += 25;
        }

        return { ...job, score };
      });

      // Sort by score and return top 10
      return scored.sort((a, b) => b.score - a.score).slice(0, 10);
    };

    setRecommendations(getRecommendations());
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-white to-neutral-50">
      <Header />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-full mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">
                  AI-Powered Recommendations
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                Jobs Perfect For You
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Based on your preferences
                {user.lookingForContract ? " for contract work" : ""}, skills,
                and experience, we've found these opportunities
              </p>
            </div>

            {/* Recommendations Grid */}
            <div className="grid gap-6">
              {recommendations.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-teal-500 cursor-pointer group"
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 group-hover:text-teal-600 transition-colors">
                          {job.title.en}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {job.company}
                        </CardDescription>
                      </div>
                      {job.featured && (
                        <Badge className="bg-gradient-to-r from-teal-500 to-teal-600">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {job.description.en}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-teal-600" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-teal-600" />
                        <span>{job.type.en}</span>
                      </div>
                      {job.experience && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-teal-600" />
                          <span>{job.experience}</span>
                        </div>
                      )}
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 5).map((skill, idx) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 5 && (
                          <Badge variant="outline">
                            +{job.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Browse All Jobs */}
            <div className="text-center mt-12">
              <Button
                size="lg"
                onClick={() => navigate("/jobs")}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              >
                Browse All Jobs
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobRecommendations;
