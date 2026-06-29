import React, { memo } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/button';
import SpinnerLoader from '@/components/loader/SpinnerLoader';
import { DashCard, SectionTitle } from './UIHelpers';

export const CertificationsSection = memo((props: any) => {
  const { formData, fieldErrors, addCertification, updateCertification, removeCertification, removingCertificateId } = props;
  
  return (
    <>
      <DashCard>
          <SectionTitle
            icon={<Award className="w-5 h-5" />}
            title="Certifications"
            action={
              <Button
                type="button"
                onClick={addCertification}
                className="flex items-center gap-2 px-4 py-2 bg-[#4DD9E8]/10 text-[#288e99] hover:bg-[#4DD9E8]/20 hover:text-[#288e99] rounded-xl transition text-[10px] sm:text-sm shadow-none"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </Button>
            }
          />

          <div className="space-y-4">
            {formData.certifications.map((cert, index) => (
              <div
                key={cert.localId ?? cert.id ?? index}
                className="p-5 border border-gray-100 dark:border-slate-700/50 rounded-xl space-y-4 bg-gray-50/50 dark:bg-slate-800/50 transition-all hover:border-gray-200 dark:hover:border-slate-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Certification #{index + 1}
                  </h3>
                  {(() => {
                    const localKey = cert?.localId ?? `local-cert-${index}`;
                    const isRemoving =
                      cert.id != null
                        ? removingCertificateId === cert.id
                        : removingCertificateId === localKey;
                    return isRemoving ? (
                      <div className="flex items-center justify-center p-2">
                        <SpinnerLoader className="text-red-500 w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeCertification(cert.id, index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Remove certification"
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
                      placeholder="Certification Name *"
                      value={cert.name}
                      onChange={(e) =>
                        updateCertification(index, "name", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_name`]
                          ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                          : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl`}
                    />
                    <ErrorMessage error={fieldErrors[`cert_${index}_name`]} />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Issued By *"
                      value={cert.issuedBy}
                      onChange={(e) =>
                        updateCertification(index, "issuedBy", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_issuer`]
                          ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                          : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl`}
                    />
                    <ErrorMessage error={fieldErrors[`cert_${index}_issuer`]} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-gray-500 mb-1.5 dark:text-gray-400">
                      Issue Date *
                    </Label>
                    <input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) =>
                        updateCertification(index, "issueDate", e.target.value)
                      }
                      className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_issueDate`]
                          ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                          : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl text-gray-700 dark:text-white`}
                    />
                    <ErrorMessage
                      error={fieldErrors[`cert_${index}_issueDate`]}
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-gray-500 mb-1.5 dark:text-gray-400">
                      Expiry Date (Optional)
                    </Label>
                    <input
                      type="date"
                      value={cert.expiryDate ?? ""}
                      onChange={(e) =>
                        updateCertification(
                          index,
                          "expiryDate",
                          e.target.value || null,
                        )
                      }
                      className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_expiryDate`]
                          ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                          : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl text-gray-700 dark:text-white`}
                    />
                    <ErrorMessage
                      error={fieldErrors[`cert_${index}_expiryDate`]}
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="url"
                    placeholder="Credential URL (e.g., https://coursera.org/verify/...)"
                    value={cert.credentialUrl}
                    onChange={(e) =>
                      updateCertification(
                        index,
                        "credentialUrl",
                        e.target.value,
                      )
                    }
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_url`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                      } focus:ring-2 focus:ring-inset rounded-xl`}
                  />
                  <ErrorMessage error={fieldErrors[`cert_${index}_url`]} />
                </div>
              </div>
            ))}

            {formData.certifications.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                No certifications added yet. Click "Add Certification" to
                highlight your credentials.
              </p>
            )}
          </div>
        </DashCard>

    </>
  );
}, (prev, next) => {
   return prev.formData.certifications === next.formData.certifications &&
          prev.fieldErrors === next.fieldErrors &&
          prev.removingCertificateId === next.removingCertificateId;
});
