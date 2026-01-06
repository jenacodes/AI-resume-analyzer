import { db } from "~/db.server";
import { analyzeResume } from "./gemini.server";
import { extractTextFromPdf } from "./pdf.server";
import { uploadFile } from "./storage.server";
import fs from "fs/promises";

export async function processResumeUpload(
  userId: string,
  file: File,
  title?: string,
  description?: string,
  company?: string
) {
  // 1. Save File
  const filePath = await uploadFile(file);
  try {
    // 2. Extract Text from PDF
    const resumeText = await extractTextFromPdf(filePath);

    // 3. Analyze with Gemini AI
    // Use provided title or filename if not provided
    const jobTitle = title || "Untitled Resume";
    const analysisResult = await analyzeResume(
      resumeText,
      jobTitle,
      description
    );

    // 4. Create DB Record
    const resume = await db.resume.create({
      data: {
        userId,
        title: jobTitle,
        // If the user didn't provide a description, we just omit it from the DB (fields are optional/not distinct in this schema)
        // but the analysis used it.
        filePath,
        analysisJson: JSON.stringify(analysisResult),
        company: company || "AI Analyzed", // Placeholder
      },
    });

    return resume;
  } catch (error) {
    console.error("Processing failed, deleting file:", filePath);
    // If analysis fails, delete the file we just uploaded so it doesn't clutter storage
    await fs
      .unlink(filePath)
      .catch(() => console.log("Failed to delete orphaned file"));

    throw error;
  }
}
