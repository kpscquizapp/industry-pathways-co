import React, { memo } from 'react';
import { FolderGit2, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import SpinnerLoader from '@/components/loader/SpinnerLoader';
import { DashCard, SectionTitle } from './UIHelpers';

export const ProjectsSection = memo((props: any) => {
  const { formData, fieldErrors, addProject, updateProject, removeProjects, removingProjectId } = props;
  
  return (
    <>
      <DashCard>
          <SectionTitle
            icon={<FolderGit2 className="w-5 h-5" />}
            title="Projects"
            action={
              <Button
                type="button"
                onClick={addProject}
                className="flex items-center gap-2 px-4 py-2 bg-[#4DD9E8]/10 text-[#288e99] hover:bg-[#4DD9E8]/20 hover:text-[#288e99] rounded-xl transition text-[10px] sm:text-sm shadow-none"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            }
          />

          <div className="space-y-4">
            {formData.projects.map((project, index) => (
              <div
                key={project.localId ?? project.id ?? index}
                className="p-5 border border-gray-100 dark:border-slate-700/50 rounded-xl space-y-4 bg-gray-50/50 dark:bg-slate-800/50 transition-all hover:border-gray-200 dark:hover:border-slate-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Project #{index + 1}
                  </h3>
                  {(() => {
                    const localKey =
                      project?.localId ?? `local-project-${index}`;
                    const isRemoving =
                      project.id != null
                        ? removingProjectId === project.id
                        : removingProjectId === localKey;
                    return isRemoving ? (
                      <div className="flex items-center justify-center p-2">
                        <SpinnerLoader className="text-red-500 w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeProjects(project.id, index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    );
                  })()}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Project Title *"
                    value={project.title}
                    onChange={(e) =>
                      updateProject(index, "title", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`project_${index}_title`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                      } focus:ring-2 focus:ring-inset rounded-xl`}
                  />
                  <ErrorMessage error={fieldErrors[`project_${index}_title`]} />
                </div>

                <div>
                  <textarea
                    placeholder="Project Description *"
                    value={project.description}
                    onChange={(e) =>
                      updateProject(index, "description", e.target.value)
                    }
                    rows={3}
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`project_${index}_description`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                      } focus:ring-2 focus:ring-inset rounded-xl resize-y`}
                  />
                  <ErrorMessage
                    error={fieldErrors[`project_${index}_description`]}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Tech Stack (comma separated, e.g., Node.js, PostgreSQL)"
                  value={
                    Array.isArray(project.techStack)
                      ? project.techStack.join(", ")
                      : (project.techStack ?? "")
                  }
                  onChange={(e) =>
                    updateProject(index, "techStack", e.target.value)
                  }
                  onBlur={(e) =>
                    updateProject(
                      index,
                      "techStack",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:ring-slate-700 rounded-xl"
                />

                <div>
                  <input
                    type="url"
                    placeholder="Project URL (e.g., https://github.com/username/project)"
                    value={project.projectUrl}
                    onChange={(e) =>
                      updateProject(index, "projectUrl", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`project_${index}_url`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                      } focus:ring-2 focus:ring-inset rounded-xl`}
                  />
                  <ErrorMessage error={fieldErrors[`project_${index}_url`]} />
                </div>

                <Label className="flex items-center gap-3 dark:text-gray-300 w-max cursor-pointer">
                  <input
                    type="checkbox"
                    checked={project.isFeatured}
                    onChange={(e) =>
                      updateProject(index, "isFeatured", e.target.checked)
                    }
                    className="min-h-0 min-w-0 w-5 h-5 rounded border-gray-300 text-primary focus:ring-[#4DD9E8] outline-none dark:border-slate-600 dark:bg-slate-800 accent-[#4DD9E8]"
                  />
                  <span className="text-sm font-medium">
                    Featured Project <span className="text-destructive">*</span>
                  </span>
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Check this box for the project you want highlighted on your
                  profile.
                </span>
              </div>
            ))}

            {formData.projects.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                No projects added yet. Click "Add Project" to showcase your
                work.
              </p>
            )}
          </div>
        </DashCard>

    </>
  );
}, (prev, next) => {
   return prev.formData.projects === next.formData.projects &&
          prev.fieldErrors === next.fieldErrors &&
          prev.removingProjectId === next.removingProjectId;
});
