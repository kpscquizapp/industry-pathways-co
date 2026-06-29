import React, { memo } from 'react';
import { Code, CheckSquare, PencilLine, Check, X, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashCard, SectionTitle } from './UIHelpers';
import SpinnerLoader from '@/components/loader/SpinnerLoader';
import { toast } from 'sonner';

export const SkillsSection = memo((props: any) => {
  const { formData, fieldErrors, extractedSkills, showPrimarySkillsDisplay, isEditingPrimarySkills, setIsEditingPrimarySkills, editingExtractedSkillId, editingExtractedSkillName, setEditingExtractedSkillName, saveExtractedSkillEdit, setEditingExtractedSkillId, deleteExtractedSkill, handleToggleExtractedSkill, handleUpdateSkillExtraction, isUpdating, removeSecondarySkill, setFormData, createLocalId, setExtractedSkills, removeSkills, skillInput, setSkillInput, addSecondarySkill, normalizeSkill, data, handleSaveSkillsOnly } = props;
  
  return (
    <>
      <DashCard>
          <div id="main-skills-section" className="scroll-mt-24"></div>
          <SectionTitle
            icon={<Code className="w-5 h-5" />}
            title="Skills"
            action={
              <Button
                type="button"
                onClick={() => {
                  setIsEditingPrimarySkills((prev) => {
                    // Always reset any in-progress skill edit when toggling sections
                    setEditingExtractedSkillId(null);
                    setEditingExtractedSkillName("");
                    return !prev;
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#4DD9E8]/10 text-[#288e99] hover:bg-[#4DD9E8]/20 hover:text-[#288e99] rounded-xl transition text-sm shadow-none"
              >
                <PencilLine className="w-4 h-4" />
                {isEditingPrimarySkills ? "Done Editing" : "Edit Primary"}
              </Button>
            }
          />

          {/* Primary Skills Subsection - Only shown when editing */}
          {isEditingPrimarySkills && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  Edit Skills (Select up to 5 as Primary)
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Show all primary skills */}
                {formData.primarySkills.map((skillName, idx) => {
                  const extractedSkill = extractedSkills.find(
                    (s) => normalizeSkill(s.name) === normalizeSkill(skillName),
                  );
                  return (
                    <div
                      key={`primary-${skillName}-${idx}`}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl"
                    >
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            if (formData.primarySkills.length <= 1) {
                              toast.warning(
                                "You must have at least one primary skill overall",
                              );
                              return;
                            }
                            // Move from primary to secondary
                            setFormData((prev) => ({
                              ...prev,
                              primarySkills: prev.primarySkills.filter(
                                (s) =>
                                  s.toLowerCase() !== skillName.toLowerCase(),
                              ),
                              secondarySkills: [
                                ...prev.secondarySkills,
                                skillName,
                              ].filter(
                                (skill, idx, self) =>
                                  self.findIndex(
                                    (s) =>
                                      s.toLowerCase() === skill.toLowerCase(),
                                  ) === idx,
                              ),
                            }));
                            if (extractedSkill) {
                              setExtractedSkills((prev) =>
                                prev.map((s) =>
                                  s.id === extractedSkill.id
                                    ? { ...s, isPrimary: false }
                                    : s,
                                ),
                              );
                            }
                          }
                        }}
                        className="w-4 h-4 text-[#4DD9E8] rounded border-gray-300 focus:ring-[#4DD9E8] accent-[#4DD9E8] min-h-0 min-w-0"
                      />
                      {extractedSkill &&
                        editingExtractedSkillId === extractedSkill.id ? (
                        <div className="flex-1 flex gap-2 items-center">
                          <input
                            type="text"
                            value={editingExtractedSkillName}
                            onChange={(e) =>
                              setEditingExtractedSkillName(
                                e.target.value.toLowerCase(),
                              )
                            }
                            className="flex-1 px-2 py-1 text-sm bg-white border border-gray-200 rounded dark:bg-slate-800 dark:border-slate-600 outline-none focus:border-[#4DD9E8]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() =>
                              saveExtractedSkillEdit(extractedSkill.id)
                            }
                            className="text-green-500 hover:text-green-600 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingExtractedSkillId(null);
                              setEditingExtractedSkillName("");
                            }}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {skillName}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (extractedSkill) {
                                  setEditingExtractedSkillId(extractedSkill.id);
                                  setEditingExtractedSkillName(
                                    extractedSkill.name,
                                  );
                                } else {
                                  const newId = createLocalId("ext");
                                  setExtractedSkills((prev) => [
                                    ...prev,
                                    {
                                      id: newId,
                                      name: skillName,
                                      isPrimary: true,
                                    },
                                  ]);
                                  setEditingExtractedSkillId(newId);
                                  setEditingExtractedSkillName(skillName);
                                }
                              }}
                              className="text-gray-400 hover:text-[#4DD9E8] transition-colors"
                            >
                              <PencilLine className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (extractedSkill) {
                                  deleteExtractedSkill(extractedSkill.id);
                                } else {
                                  if (formData.primarySkills.length <= 1) {
                                    toast.warning(
                                      "You must have at least one primary skill overall",
                                    );
                                    return;
                                  }
                                  setFormData((prev) => ({
                                    ...prev,
                                    primarySkills: prev.primarySkills.filter(
                                      (s) =>
                                        s.toLowerCase() !==
                                        skillName.toLowerCase(),
                                    ),
                                  }));
                                }
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Show all secondary skills */}
                {formData.secondarySkills.map((skillName, idx) => {
                  const extractedSkill = extractedSkills.find(
                    (s) => normalizeSkill(s.name) === normalizeSkill(skillName),
                  );
                  return (
                    <div
                      key={`secondary-${skillName}-${idx}`}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl"
                    >
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (formData.primarySkills.length >= 5) {
                              toast.error(
                                "You can only select up to 5 primary skills. Please uncheck one first.",
                              );
                              return;
                            }
                            // Move from secondary to primary
                            setFormData((prev) => ({
                              ...prev,
                              primarySkills: [...prev.primarySkills, skillName],
                              secondarySkills: prev.secondarySkills.filter(
                                (s) =>
                                  s.toLowerCase() !== skillName.toLowerCase(),
                              ),
                            }));
                            if (extractedSkill) {
                              setExtractedSkills((prev) =>
                                prev.map((s) =>
                                  s.id === extractedSkill.id
                                    ? { ...s, isPrimary: true }
                                    : s,
                                ),
                              );
                            } else {
                              setExtractedSkills((prev) => [
                                ...prev,
                                {
                                  id: createLocalId("ext"),
                                  name: skillName,
                                  isPrimary: true,
                                },
                              ]);
                            }
                          }
                        }}
                        className="w-4 h-4 text-[#4DD9E8] rounded border-gray-300 focus:ring-[#4DD9E8] accent-[#4DD9E8] min-h-0 min-w-0"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {skillName}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Check if this would leave the user with zero skills
                              const totalSkills =
                                formData.primarySkills.length +
                                formData.secondarySkills.length;

                              if (totalSkills <= 1) {
                                toast.warning(
                                  "You must keep at least one skill.",
                                );
                                return;
                              }

                              // If there's an extracted skill, delete it from extractedSkills
                              if (extractedSkill) {
                                deleteExtractedSkill(extractedSkill.id);
                              } else {
                                // Otherwise just remove from secondary skills
                                removeSecondarySkill(skillName);
                              }
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {formData.primarySkills.length > 0 && (
                <p className="text-xs font-medium text-blue-600 dark:text-blue-300 mt-3">
                  {formData.primarySkills.length} / 5 primary skills selected
                </p>
              )}
            </div>
          )}

          {/* Primary Skills Display - Always shown when skills exist and not editing */}
          {!isEditingPrimarySkills && formData.primarySkills.length > 0 && (
            <div className="mb-6 p-4 bg-[#4DD9E8]/10 dark:bg-[#4DD9E8]/20 border border-[#4DD9E8] dark:border-[#4DD9E8] rounded-xl">
              <h4 className="text-sm font-semibold text-inherit dark:text-white mb-3">
                Primary Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.primarySkills.map((skill, index) => (
                  <div
                    key={`${skill}-${index}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD9E8]/20 dark:bg-green-900/50 text-[#288e99] dark:text-green-200 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Skills Subsection */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Secondary Skills
            </h4>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value.toLowerCase())}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSecondarySkill())
                }
                maxLength={50}
                placeholder="Add a secondary skill (e.g., TypeScript)"
                className={`flex-1 px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${fieldErrors.secondarySkills
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <Button
                type="button"
                onClick={addSecondarySkill}
                className="px-5 py-2.5 bg-[#4DD9E8] text-white rounded-xl hover:bg-[#4DD9E8]/90 transition shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <ErrorMessage error={fieldErrors.secondarySkills} />

            <div className="flex flex-wrap gap-2.5">
              {formData.secondarySkills.map((name, index) => {
                const skillObj = data?.candidateProfile?.secondarySkills?.find(
                  (s) =>
                    typeof s === "string"
                      ? false
                      : s.name.toLowerCase() === name.toLowerCase(),
                );
                const skillId = skillObj?.id ?? null;

                return (
                  <div
                    key={`${skillId ?? name.toLowerCase()}-${index}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD9E8]/10 text-[#288e99] rounded-xl text-sm font-medium"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => {
                        const ext = extractedSkills.find(
                          (s) =>
                            normalizeSkill(s.name) === normalizeSkill(name),
                        );

                        const totalSkills =
                          formData.primarySkills.length +
                          formData.secondarySkills.length;

                        if (totalSkills <= 1) {
                          toast.warning("You must keep at least one skill.");
                          return;
                        }

                        if (ext) {
                          deleteExtractedSkill(ext.id);
                        } else {
                          removeSecondarySkill(name);
                        }
                      }}
                      className="hover:text-red-500 transition-colors bg-white/50 dark:bg-black/20 rounded-full p-0.5 min-w-0 min-h-0"
                      aria-label={`Remove ${name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
              {formData.secondarySkills.length === 0 && (
                <p className="text-sm text-gray-400 italic">
                  No secondary skills added yet.
                </p>
              )}
            </div>
            {formData.secondarySkills.length > 0 && (
              <p className="text-xs font-medium text-gray-400 mt-3">
                {formData.secondarySkills.length} secondary skills added
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-end border-t border-gray-100 dark:border-slate-800 pt-5">
            <button
              type="button"
              onClick={() => handleSaveSkillsOnly()}
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] dark:bg-[#4DD9E8]/10 hover:bg-[#1a1a2e]/90 dark:hover:bg-[#4DD9E8]/20 text-white dark:text-[#4DD9E8] font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm"
            >
              {isUpdating ? (
                <>
                  <SpinnerLoader className="w-4 h-4" />
                  Saving...
                </>
              ) : (
                "Update Skills"
              )}
            </button>
          </div>
        </DashCard>

    </>
  );
}, (prev, next) => {
   return prev.formData.primarySkills === next.formData.primarySkills &&
          prev.formData.secondarySkills === next.formData.secondarySkills &&
          prev.fieldErrors === next.fieldErrors &&
          prev.extractedSkills === next.extractedSkills &&
          prev.showPrimarySkillsDisplay === next.showPrimarySkillsDisplay &&
          prev.isEditingPrimarySkills === next.isEditingPrimarySkills &&
          prev.editingExtractedSkillId === next.editingExtractedSkillId &&
          prev.editingExtractedSkillName === next.editingExtractedSkillName &&
          prev.isUpdating === next.isUpdating &&
          prev.skillInput === next.skillInput;
});
