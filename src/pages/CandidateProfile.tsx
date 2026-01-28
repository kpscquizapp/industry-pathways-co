import React, { useId } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Globe, MapPin, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileQuery } from "@/app/queries/profileApi";
import CandidateProfileUpdate from "./CandidateProfileUpdate";
import ResumeManager from "./ResumeManager";

const CandidateProfile = () => {
  const { data: response, isLoading, isError } = useGetProfileQuery();
  const data = response?.data;
  const profile = data?.candidateProfile;
  const candidateId = useId();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Header />

      {isLoading ? (
        <div className="w-full h-screen text-1xl sm:text-3xl flex items-center justify-center dark:text-white">
          Loading...
        </div>
      ) : isError ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-red-600">Error loading profile</div>
        </div>
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-12 mt-16 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-3 space-y-4">
                {/* Profile Card */}
                <Card
                  id={candidateId}
                  className="dark:bg-slate-800 dark:border-slate-700 w-full"
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 shadow-xl ring-4 ring-white/90 dark:ring-slate-700/90">
                      <AvatarImage src={data?.avatar || ""} />
                      <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-1 dark:text-slate-100 break-words">
                      {data?.firstName} {data?.lastName}
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mb-3 font-semibold break-words">
                      {profile?.headline ?? data?.title ?? "—"}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold text-xs">
                        {profile?.profileType === "bench"
                          ? "BENCH RESOURCE"
                          : "CONTRACT RESOURCE"}
                      </Badge>
                    </div>

                    {/* Details Card */}
                    <div className="border-t-2 border-t-gray-200 dark:border-t-slate-700 mt-6 sm:mt-8" />
                    <div className="p-0 my-6 sm:my-8 space-y-3">
                      {profile?.hourlyRateMin != null &&
                        profile?.hourlyRateMax != null && (
                          <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                            <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                              <DollarSign className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">Hourly Rate</span>
                            </span>
                            <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right">
                              ${profile.hourlyRateMin} - $
                              {profile.hourlyRateMax}
                              /hr
                            </span>
                          </div>
                        )}
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Availability</span>
                        </span>
                        <span className="font-semibold text-green-600 whitespace-nowrap text-right capitalize">
                          {profile?.availableIn || "None"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Location</span>
                        </span>
                        <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right max-w-[50%] truncate">
                          {profile?.location || "None"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                          <Briefcase className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Experience</span>
                        </span>
                        <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right">
                          {profile?.yearsExperience + " Years" || "None"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">English</span>
                        </span>
                        <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right">
                          {profile?.englishProficiency || "None"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Card */}
                <Card
                  id={`AiMatchedProfile-${candidateId}-skillsCard`}
                  className="dark:bg-slate-800 dark:border-slate-700 w-full"
                >
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-bold mb-3 text-sm sm:text-base dark:text-slate-100">
                      Skills & Tech
                    </h3>
                    <div
                      id={`AiMatchedProfile-${candidateId}-skills`}
                      className="flex flex-wrap gap-2"
                    >
                      {profile?.skills?.length ? (
                        profile.skills.map((skill, index) => {
                          const name =
                            typeof skill === "string" ? skill : skill.name;
                          const id =
                            typeof skill === "string" ? undefined : skill.id;
                          if (!name) return null;
                          return (
                            <Badge
                              key={id ?? name ?? index}
                              variant="secondary"
                              className="bg-gray-100 text-xs dark:bg-slate-700 dark:text-slate-200"
                            >
                              {name}
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications Card */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-bold mb-3 text-sm sm:text-base dark:text-slate-100">
                      Certifications
                    </h3>
                    <div className="space-y-3">
                      {profile?.certifications?.length ? (
                        profile.certifications.map(
                          ({ name, issueDate }, cIndex) => (
                            <div
                              id={`AiMatchedProfile-${candidateId}-cert-${cIndex}`}
                              className="flex items-start gap-2 sm:gap-3"
                              key={`${name}-${cIndex}`}
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 dark:bg-blue-900/40">
                                <span role="img" aria-label="diploma">
                                  🎓
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-xs sm:text-sm dark:text-slate-200 break-words">
                                  {name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                  {issueDate}
                                </p>
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            🎓
                          </div>
                          <div>
                            <p className="font-semibold text-xs my-auto sm:text-sm text-gray-500">
                              No Certifications
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9 min-w-0">
                <Tabs defaultValue="overview" className="space-y-4 w-full">
                  <TabsList className="w-full justify-start overflow-x-auto dark:bg-slate-800 dark:text-slate-400 flex-nowrap">
                    <TabsTrigger
                      value="overview"
                      className="text-xs sm:text-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="resume"
                      className="text-xs sm:text-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
                    >
                      Resume
                    </TabsTrigger>
                    <TabsTrigger
                      value="assessment"
                      className="text-xs sm:text-sm whitespace-nowrap dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
                    >
                      Edit Profile
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {/* About Candidate */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold mb-3 dark:text-slate-100">
                          About Candidate
                        </h3>
                        <p
                          className="text-sm sm:text-base text-gray-700 dark:text-slate-300 mb-3 break-words"
                          style={{ lineHeight: "1.8" }}
                        >
                          {profile?.bio ?? "No bio"}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Work Experience */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold mb-4 dark:text-slate-100">
                          Work Experience
                        </h3>
                        {(profile?.workExperiences?.length ?? 0) > 0 ? (
                          <div className="space-y-6">
                            {profile?.workExperiences.map((entry, index) => {
                              const {
                                role,
                                companyName,
                                startDate,
                                endDate,
                                location,
                                description,
                              } = entry;
                              const entryId = `${candidateId}-work-${index}`;
                              return (
                                <div
                                  key={entryId}
                                  id={entryId}
                                  className="flex gap-3 sm:gap-4"
                                >
                                  <div
                                    className={`w-1 ${index === 0 ? "bg-blue-500 dark:bg-blue-1" : "bg-gray-300 dark:bg-slate-600"}  rounded-full flex-shrink-0`}
                                  ></div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm sm:text-base dark:text-slate-100 break-words">
                                      {role}
                                    </h4>
                                    <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm mb-1 font-semibold break-words">
                                      {companyName}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mb-2 break-words">
                                      {startDate} - {endDate ?? "Present"} •{" "}
                                      {location}
                                    </p>
                                    <div className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 space-y-1">
                                      {(Array.isArray(description)
                                        ? description
                                        : description
                                          ? description
                                              .split(/\r?\n/)
                                              .filter(Boolean)
                                          : []
                                      ).map((bullet, bIndex) => (
                                        <p
                                          key={`${entryId}-bullet-${bIndex}`}
                                          className="break-words"
                                        >
                                          {bullet}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-slate-300">
                            No work experience
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Featured Projects */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 gap-2">
                          <h3 className="text-base sm:text-lg font-bold dark:text-slate-100">
                            Featured Projects
                          </h3>
                          <Button
                            variant="link"
                            className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm p-0 whitespace-nowrap"
                          >
                            View Portfolio
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {profile?.projects?.length ? (
                            profile.projects.map(
                              (
                                { title, techStack, projectUrl, description },
                                pIndex,
                              ) => (
                                <Card
                                  id={`AiMatchedProfile-${candidateId}-project-${pIndex}`}
                                  className="border dark:border-slate-700 dark:bg-slate-800 w-full"
                                  key={`${title}-${pIndex}`}
                                >
                                  <CardContent className="p-4 sm:p-6">
                                    <div className="w-full h-24 sm:h-32 bg-gray-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                                      <div className="w-10 h-14 sm:w-12 sm:h-16 border-2 border-gray-300 dark:border-slate-500 rounded flex items-center justify-center text-2xl dark:text-slate-300">
                                        {projectUrl ? "🌐" : "📂"}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base dark:text-slate-100 break-words">
                                        {title}
                                      </h4>
                                      {projectUrl && (
                                        <a
                                          href={projectUrl}
                                          rel="noopener noreferrer"
                                          target="_blank"
                                          className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 break-words mb-1 font-semibold hover:underline"
                                        >
                                          Link
                                        </a>
                                      )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 break-words">
                                      {techStack}
                                    </p>

                                    <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-slate-400 break-words">
                                      {description}
                                    </p>
                                  </CardContent>
                                </Card>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-slate-400 col-span-2">
                              No projects yet
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resume" className="space-y-4">
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-6 text-center text-gray-500 dark:text-slate-400">
                        <ResumeManager
                          resumes={
                            profile && profile.resumes ? profile.resumes : []
                          }
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="assessment" className="space-y-4">
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-6">
                        {data ? (
                          <CandidateProfileUpdate data={data} />
                        ) : (
                          <p className="text-center text-gray-500 dark:text-slate-400">
                            Profile data unavailable
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CandidateProfile;
