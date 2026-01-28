import React, { useEffect, useRef, useState } from "react";
import { Upload, Eye, Trash2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useLazyViewResumeQuery,
  useRemoveResumeMutation,
  useUploadResumeMutation,
} from "@/app/queries/profileApi";
import { toast } from "sonner";

type Resume = {
  id: number;
  originalName: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
};

type ResumeManagerProps = {
  resumes: Resume[];
};

const ResumeManager: React.FC<ResumeManagerProps> = ({ resumes }) => {
  // API calls
  const [uploadResume] = useUploadResumeMutation();
  const [viewResume] = useLazyViewResumeQuery();
  const [removeResume] = useRemoveResumeMutation();

  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const latestRequestIdRef = useRef<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const revokePreviewUrl = (url?: string | null) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  const clearPreview = () => {
    latestRequestIdRef.current = null;
    revokePreviewUrl(previewUrl);
    setPreviewUrl(null);
    setSelectedResume(null);
    setIsModalOpen(false);
  };

  const handleView = async (resume: Resume) => {
    const requestId = resume.id;
    latestRequestIdRef.current = requestId;
    setSelectedResume(resume);
    setIsModalOpen(true);

    // Clean up previous blob URL
    revokePreviewUrl(previewUrl);
    setPreviewUrl(null);

    try {
      const { data, error } = await viewResume({ resumeId: resume.id });

      if (error) {
        throw new Error("Failed to fetch resume");
      }

      if (data && latestRequestIdRef.current === requestId) {
        setPreviewUrl(data); // data is already a blob URL string
      } else if (data) {
        // Stale response - revoke the unused blob URL
        revokePreviewUrl(data);
      }
    } catch (error) {
      if (latestRequestIdRef.current !== requestId) {
        return; // stale error, ignore
      }
      console.error("Error loading resume:", error);
      toast.error("Failed to load resume preview");
      setSelectedResume(null);
      setIsModalOpen(false);
    }
  };

  // Cleanup blob URLs
  useEffect(() => {
    return () => revokePreviewUrl(previewUrl);
  }, [previewUrl]);

  const handleDelete = async (resumeId: number) => {
    const wasSelected = selectedResume?.id === resumeId;
    try {
      await removeResume(resumeId).unwrap();
      if (wasSelected) {
        clearPreview();
      }
      toast.success("Resume deleted successfully!");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    const maxBytes = 5 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file.size > maxBytes || !allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file up to 5MB.");
      input.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await uploadResume(formData).unwrap();
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume.");
    } finally {
      input.value = "";
    }
  };

  return (
    <>
      <div className="h-screen">
        <div className="max-w-4xl mx-auto sm:p-[2rem]">
          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-8 md:p-12 mb-6 bg-white transition-all duration-200 dark:bg-slate-800">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full p-4 mb-4">
                <Upload className="w-6 h-6 md:w-8 md:h-8 text-slate-600 dark:text-slate-300" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-2 dark:text-white">
                Upload Your Resume
              </h3>
              <p className="text-xs md:text-sm text-slate-500 mb-6 dark:text-slate-400">
                Supported formats: PDF, DOCX <br /> Maximum size: 5MB
              </p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm md:text-base">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Resume List */}
          <div className="rounded-lg py-4 md:py-6 shadow-sm text-left dark:bg-slate-800 h-[350px] overflow-auto">
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4 dark:text-white">
              Your Resumes ({resumes.length})
            </h2>

            <div className="space-y-3">
              {resumes.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8 dark:text-slate-400">
                  No resumes uploaded yet. Upload your first resume above.
                </p>
              )}
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="p-3 md:p-4 border border-slate-200 hover:border-slate-300 transition-colors duration-200 dark:border-slate-700 dark:hover:border-slate-600"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate text-sm md:text-base dark:text-white">
                        {resume.originalName}
                      </p>
                      <p className="text-xs md:text-sm text-slate-500 mt-1 dark:text-slate-400">
                        {(resume.fileSize / (1024 * 1024)).toFixed(1)} MB •
                        Uploaded{" "}
                        {new Intl.DateTimeFormat("default", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(resume.uploadedAt))}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(resume)}
                      className="flex-1 text-xs md:text-sm"
                    >
                      <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(resume.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4"
          onClick={clearPreview}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal Content */}
          <div
            className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-[95vw] h-[95vh] md:w-[90vw] md:h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-slate-600 flex-shrink-0 dark:text-slate-400" />
                <span
                  className="font-medium text-slate-800 truncate text-sm md:text-base dark:text-white"
                  id="modal-title"
                >
                  {selectedResume?.originalName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close preview"
                onClick={clearPreview}
                className="flex-shrink-0 ml-2"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>

            {/* Modal Body - PDF Preview */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {previewUrl && selectedResume?.mimeType === "application/pdf" ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title={selectedResume.originalName}
                />
              ) : previewUrl ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div className="text-center text-slate-600 dark:text-slate-300">
                    <FileText className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                    <p className="text-sm md:text-base mb-2">
                      Preview not available for this file type
                    </p>
                    <a
                      href={previewUrl}
                      download={selectedResume?.originalName}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm md:text-base inline-block"
                    >
                      Download to view
                    </a>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
                      Loading preview...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeManager;
