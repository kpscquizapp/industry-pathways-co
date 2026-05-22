import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export interface ParsedResume {
  resourceName: string;
  technicalSkills: string[];
  totalExperience: number;
  professionalSummary: string;
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
};
const parseResumeWithClaude = async (
  resumeText: string,
  token?: string,
): Promise<ParsedResume> => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(
    `${backendUrl}/employers/claude/extract-resume`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ resumeText }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Backend Claude API error ${response.status}: ${errorBody}`,
    );
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Claude extraction failed on backend");
  }

  return {
    resourceName: data.data.resourceName ?? "",
    technicalSkills: Array.isArray(data.data.technicalSkills)
      ? data.data.technicalSkills
      : [],
    totalExperience:
      typeof data.data.totalExperience === "number"
        ? data.data.totalExperience
        : 0,
    professionalSummary: data.data.professionalSummary ?? "",
  };
};

export const parseResume = async (
  file: File,
  token?: string,
): Promise<ParsedResume> => {
  const text = await extractTextFromPDF(file);
  return await parseResumeWithClaude(text, token);
};
