import { db } from "~/db.server";
import { analyzeResume } from "./gemini.server";
import { extractTextFromBuffer } from "./pdf.server";
// import { uploadFile } from "./storage.server"; // No longer needed
import fs from "fs/promises";

export async function processResumeUpload(
  userId: string,
  fileUrl: string, // Changed from File to string
  title?: string,
  description?: string,
  company?: string
) {
  console.time("Total Processing Time");

  // 1. Fetch the file from UploadThing/S3
  console.time("Fetch File");
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${fileUrl}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);
  console.timeEnd("Fetch File");

  try {
    // 2. Extract Text from Buffer
    console.time("PDF Extraction");
    const resumeText = await extractTextFromBuffer(fileBuffer);
    console.timeEnd("PDF Extraction");

    // 3. Analyze with Gemini AI
    // Use provided title or filename if not provided
    const jobTitle = title || "Untitled Resume";
    console.time("Gemini Analysis");
    const analysisResult = await analyzeResume(
      resumeText,
      jobTitle,
      description
    );
    console.timeEnd("Gemini Analysis");

    // 4. Create DB Record
    const resume = await db.resume.create({
      data: {
        userId,
        title: jobTitle,
        // We now store the full URL instead of a relative local path
        filePath: fileUrl,
        analysisJson: JSON.stringify(analysisResult),
        company: company || "AI Analyzed", // Placeholder
      },
    });

    console.timeEnd("Total Processing Time");
    return resume;
  } catch (error) {
    console.error("Processing failed:", error);
    // We don't need to delete the local file anymore because we never saved it locally!
    // However, technically the file still exists on UploadThing.
    // Ideally we would trigger a delete via UT API if analysis fails, but that requires an API key secret.
    // For now, let's just log the error.
    throw error;
  }
}
