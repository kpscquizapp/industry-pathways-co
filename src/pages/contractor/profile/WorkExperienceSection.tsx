import React, { memo } from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import SpinnerLoader from '@/components/loader/SpinnerLoader';
import { DashCard, SectionTitle } from './UIHelpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const WorkExperienceSection = memo((props: any) => {
  const { formData, fieldErrors, addWorkExperience, updateWorkExperience, removeWorkExperiences, removingWorkExperienceId, employmentTypeOptions } = props;
  
  return (
    <>
      <DashCard>
          <SectionTitle
            icon={<Briefcase className="w-5 h-5" />}
            title="Work Experience"
            action={
              <Button
                type="button"
                onClick={addWorkExperience}
                className="flex items-center gap-2 px-4 py-2 bg-[#4DD9E8]/10 text-[#288e99] hover:bg-[#4DD9E8]/20 hover:text-[#288e99] rounded-xl transition text-[10px] sm:text-sm shadow-none"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </Button>
            }
          />

          <div className="space-y-4">
            {formData.workExperiences.map((exp, index) => (
              <div
                key={exp.localId ?? exp.id ?? index}
                className="p-5 border border-gray-100 dark:border-slate-700/50 rounded-xl space-y-4 bg-gray-50/50 dark:bg-slate-800/50 transition-all hover:border-gray-200 dark:hover:border-slate-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Experience #{index + 1}
                  </h3>
                  {(() => {
                    const localKey = exp?.localId ?? `local-we-${index}`;
                    const isRemoving =
                      exp.id != null
                        ? removingWorkExperienceId === exp.id
                        : removingWorkExperienceId === localKey;
                    return isRemoving ? (
                      <div className="flex items-center justify-center p-2">
                        <SpinnerLoader className="text-red-500 w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeWorkExperiences(exp.id, index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Remove work experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Company Name *"
                      value={exp.companyName}
                      onChange={(e) =>
                        updateWorkExperience(
                          index,
                          "companyName",
                          e.target.value,
                        )
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`workExp_${index}_company`]
                          ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                          : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl`}
                    />
                    <ErrorMessage
                      error={fieldErrors[`workExp_${index}_company`]}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Role/Title *"
                      value={exp.role}
                      onChange={(e) =>
                        updateWorkExperience(index, "role", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`workExp_${index}_role`]
                          ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                          : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl`}
                    />
                    <ErrorMessage
                      error={fieldErrors[`workExp_${index}_role`]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    value={exp.employmentType}
                    onValueChange={(val) =>
                      updateWorkExperience(index, "employmentType", val)
                    }
                  >
                    <SelectTrigger className="px-4 py-3 bg-white dark:bg-slate-900 border-0 w-full ring-1 ring-inset ring-gray-200 focus:ring-0 focus:border-[#0ea5e9] focus:ring-offset-0 outline-none dark:ring-slate-700 rounded-xl shadow-none">
                      <SelectValue placeholder="Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypeOptions.map((option) => (
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
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      updateWorkExperience(index, "location", e.target.value)
                    }
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:ring-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-gray-500 mb-1.5 dark:text-gray-400">
                      Start Date *
                    </Label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateWorkExperience(index, "startDate", e.target.value)
                      }
                      className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`workExp_${index}_startDate`]
                          ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                          : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl text-gray-700 dark:text-white`}
                    />
                    <ErrorMessage
                      error={fieldErrors[`workExp_${index}_startDate`]}
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-gray-500 mb-1.5 dark:text-gray-400">
                      End Date (Leave empty if current)
                    </Label>
                    <input
                      type="date"
                      value={exp.endDate ?? ""}
                      onChange={(e) =>
                        updateWorkExperience(
                          index,
                          "endDate",
                          e.target.value === "" ? null : e.target.value,
                        )
                      }
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:ring-slate-700 rounded-xl text-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <ErrorMessage error={fieldErrors[`workExp_${index}_dates`]} />

                <textarea
                  placeholder="Description of your role and achievements..."
                  value={
                    Array.isArray(exp.description)
                      ? exp.description.join("\n")
                      : exp.description
                  }
                  onChange={(e) =>
                    updateWorkExperience(index, "description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:ring-slate-700 rounded-xl resize-y"
                />
              </div>
            ))}

            {formData.workExperiences.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                No work experience added yet. Click "Add Experience" to get
                started.
              </p>
            )}
          </div>
        </DashCard>

    </>
  );
}, (prev, next) => {
   return prev.formData.workExperiences === next.formData.workExperiences &&
          prev.fieldErrors === next.fieldErrors &&
          prev.removingWorkExperienceId === next.removingWorkExperienceId;
});
