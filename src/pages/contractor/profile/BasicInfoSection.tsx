import React, { memo, ChangeEvent } from "react";
import { User, Briefcase, AlignLeft, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getCurrencySymbol, currencySymbols } from "@/lib/currency";
import { DashCard, SectionTitle } from "./UIHelpers";

export const BasicInfoSection = memo(
  (props: any) => {
    const {
      formData,
      fieldErrors,
      handleInputChange,
      locationInput,
      handleLocationInputChange,
      addLocation,
      removeLocation,
      candidateTypeOptions,
      availableToJoinOptions,
      englishProficiencyOptions,
    } = props;
    return (
      <>
        <DashCard>
          <SectionTitle
            icon={<User className="w-5 h-5" />}
            title="Basic Information"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                First Name <span className="text-rose-500">*</span>
              </Label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                maxLength={50}
                required
                placeholder="Enter your first name"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${
                  fieldErrors.firstName
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.firstName} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Last Name <span className="text-rose-500">*</span>
              </Label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                maxLength={50}
                required
                placeholder="Enter your last name"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${
                  fieldErrors.lastName
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.lastName} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Email <span className="text-rose-500">*</span>
              </Label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                maxLength={254}
                required
                placeholder="Enter your email address"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${
                  fieldErrors.email
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.email} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Primary Job Role
              </Label>
              <input
                type="text"
                name="primaryJobRole"
                value={formData.primaryJobRole}
                onChange={handleInputChange}
                maxLength={100}
                placeholder="e.g., Senior Full Stack Developer"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${
                  fieldErrors.primaryJobRole
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.primaryJobRole} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Mobile Number <span className="text-rose-500">*</span>
              </Label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                maxLength={20}
                placeholder="Enter your mobile number"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${
                  fieldErrors.mobileNumber
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.mobileNumber} />
            </div>
          </div>
        </DashCard>

        <DashCard>
          <SectionTitle
            icon={<Briefcase className="w-5 h-5" />}
            title="Professional Details"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Location
              </Label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, London"
                className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Contractor Type <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={formData.candidateType}
                onValueChange={(val) =>
                  handleInputChange({
                    target: { name: "candidateType", value: val },
                  })
                }
              >
                <SelectTrigger
                  className={`w-full px-4 py-3 bg-gray-50 border-0 ring-1 outline-none ring-inset ${
                    fieldErrors.candidateType
                      ? "ring-rose-500 dark:ring-rose-500 focus:border-rose-500"
                      : "ring-gray-200 focus:border-[#0ea5e9] dark:ring-slate-700"
                  } focus:ring-0 focus:ring-offset-0 dark:bg-slate-900 rounded-xl capitalize shadow-none`}
                >
                  <SelectValue placeholder="Select contractor type" />
                </SelectTrigger>
                <SelectContent>
                  {candidateTypeOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage error={fieldErrors.candidateType} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Country
              </Label>
              <input
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleInputChange}
                placeholder="e.g., United States, India, UK"
                maxLength={100}
                className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                City
              </Label>
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
                placeholder="e.g., New York, Mumbai, London"
                maxLength={100}
                className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Available To Join
              </Label>
              <Select
                value={formData.availableToJoin}
                onValueChange={(val) =>
                  handleInputChange({
                    target: { name: "availableToJoin", value: val },
                  } as any)
                }
              >
                <SelectTrigger className="w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-0 focus:border-[#0ea5e9] focus:ring-offset-0 outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl capitalize shadow-none">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {availableToJoinOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                English Proficiency
              </Label>
              <Select
                value={formData.englishProficiency}
                onValueChange={(val) =>
                  handleInputChange({
                    target: { name: "englishProficiency", value: val },
                  } as any)
                }
              >
                <SelectTrigger className="w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-0 focus:border-[#0ea5e9] focus:ring-offset-0 outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl capitalize shadow-none">
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  {englishProficiencyOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Years of Experience
              </Label>
              <input
                type="number"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                min="0"
                max="70"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 outline-none ring-1 ring-inset ${
                  fieldErrors.yearsExperience
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.yearsExperience} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Preferred Job Locations{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={handleLocationInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLocation();
                    }
                  }}
                  placeholder="e.g., New York"
                  maxLength={100}
                  className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset focus:ring-2 focus:ring-inset outline-none dark:bg-slate-900 rounded-xl ${
                    fieldErrors.preferredJobLocations
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                  }`}
                />
                <Button
                  type="button"
                  onClick={addLocation}
                  variant="outline"
                  className="shrink-0 h-[44px] w-[44px] rounded-xl border-gray-200 bg-[#4DD9E8] text-white hover:bg-[#4DD9E8]/90 hover:text-white"
                  aria-label="Add preferred job location"
                  title="Add preferred job location"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ErrorMessage error={fieldErrors.preferredJobLocations} />
              {formData.preferredJobLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.preferredJobLocations.map((location, index) => (
                    <div
                      key={`${location}-${index}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4DD9E8]/10 text-[#288e99] rounded-full text-sm font-medium"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="hover:text-red-500 transition-colors bg-white/50 rounded-full p-0.5 min-w-0 min-h-0"
                        aria-label={`Remove ${location}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(val) =>
                  handleInputChange({
                    target: { name: "currency", value: val },
                  } as any)
                }
              >
                <SelectTrigger className="w-full md:w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-0 focus:border-[#0ea5e9] focus:ring-offset-0 outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl shadow-none">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(currencySymbols).map((curr) => (
                    <SelectItem
                      key={curr}
                      value={curr}
                      className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                    >
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Expected Salary (Min) <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  name="expectedSalaryMin"
                  value={formData.expectedSalaryMin}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter your expected salary (min)"
                  className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${
                    fieldErrors.expectedSalaryMin
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                />
              </div>
              <ErrorMessage error={fieldErrors.expectedSalaryMin} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Expected Salary (Max) <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  name="expectedSalaryMax"
                  value={formData.expectedSalaryMax}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter your expected salary (max)"
                  className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border-0 outline-none ring-1 ring-inset ${
                    fieldErrors.expectedSalaryMax
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                />
              </div>
              <ErrorMessage error={fieldErrors.expectedSalaryMax} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Hourly Rate (Min)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  name="hourlyRateMin"
                  value={formData.hourlyRateMin}
                  onChange={handleInputChange}
                  placeholder="Enter your hourly rate (min)"
                  min="0"
                  max="10000"
                  className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${
                    fieldErrors.hourlyRate
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Hourly Rate (Max)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  name="hourlyRateMax"
                  value={formData.hourlyRateMax}
                  onChange={handleInputChange}
                  min="0"
                  max="10000"
                  placeholder="Enter your hourly rate (max)"
                  className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${
                    fieldErrors.hourlyRate
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Weekly Working Hours
                <span className="font-normal ml-1">
                  (current hours committed to existing job)
                </span>
              </Label>
              <input
                type="number"
                name="weeklyWorkingHours"
                value={formData.weeklyWorkingHours}
                onChange={handleInputChange}
                min="0"
                max="40"
                placeholder="Enter current hours committed to existing jobs"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${
                  fieldErrors.weeklyWorkingHours
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.weeklyWorkingHours} />
            </div>
            {fieldErrors.hourlyRate && (
              <div className="sm:col-span-2">
                <ErrorMessage error={fieldErrors.hourlyRate} />
              </div>
            )}
          </div>
        </DashCard>

        <DashCard>
          <SectionTitle
            icon={<AlignLeft className="w-5 h-5" />}
            title="Short Bio"
          />
          <div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={1000}
              rows={5}
              className={`w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ${
                fieldErrors.bio
                  ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                  : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
              } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl text-base leading-relaxed resize-y`}
              placeholder="Tell us about yourself, your background, and what you're looking for..."
            />
            <div className="flex justify-between items-center mt-2.5">
              <ErrorMessage error={fieldErrors.bio} />
              <span className="text-xs font-medium text-gray-400">
                {formData.bio.length} / 1000
              </span>
            </div>
          </div>
        </DashCard>
      </>
    );
  },
  (prev, next) => {
    return (
      prev.formData.firstName === next.formData.firstName &&
      prev.formData.lastName === next.formData.lastName &&
      prev.formData.email === next.formData.email &&
      prev.formData.mobileNumber === next.formData.mobileNumber &&
      prev.formData.primaryJobRole === next.formData.primaryJobRole &&
      prev.formData.location === next.formData.location &&
      prev.formData.candidateType === next.formData.candidateType &&
      prev.formData.country === next.formData.country &&
      prev.formData.city === next.formData.city &&
      prev.formData.availableToJoin === next.formData.availableToJoin &&
      prev.formData.englishProficiency === next.formData.englishProficiency &&
      prev.formData.yearsExperience === next.formData.yearsExperience &&
      prev.formData.weeklyWorkingHours === next.formData.weeklyWorkingHours &&
      prev.formData.preferredJobLocations ===
        next.formData.preferredJobLocations &&
      prev.formData.currency === next.formData.currency &&
      prev.formData.expectedSalaryMin === next.formData.expectedSalaryMin &&
      prev.formData.expectedSalaryMax === next.formData.expectedSalaryMax &&
      prev.formData.hourlyRateMin === next.formData.hourlyRateMin &&
      prev.formData.hourlyRateMax === next.formData.hourlyRateMax &&
      prev.formData.bio === next.formData.bio &&
      prev.fieldErrors === next.fieldErrors &&
      prev.locationInput === next.locationInput
    );
  },
);
