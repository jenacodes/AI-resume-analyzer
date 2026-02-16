import { db } from "~/db.server";
// import { analyzeResume } from "./gemini.server";
// import { extractTextFromBuffer } from "./pdf.server";

export async function createPendingResume(
  userId: string,
  fileUrl: string,
  fileName: string,
  title?: string,
  company?: string,
  description?: string,
) {
  if (!fileUrl.startsWith("https://utfs.io/")) {
    throw new Error("Invalid file source");
  }
  // FAST PATH: Just create the DB record
  return db.resume.create({
    data: {
      userId,
      name: fileName,
      title: title || fileName,
      company: company || "AI Analyzed",
      description: description, // Save description
      fileUrl: fileUrl,
      status: "PENDING", // Start as PENDING
    },
  });
}

/**
 * @deprecated This function's logic has been moved to the Trigger.dev background task
 * at `trigger/analyze-resume.ts`. It is kept here for reference and test compatibility.
 * Use `tasks.trigger("analyze-resume", { resumeId })` instead.
 */
// export async function performResumeAnalysis(resumeId: string) {
//   console.time(`Analysis for ${resumeId}`);

//   // 1. Fetch record
//   const resume = await db.resume.findUnique({ where: { id: resumeId } });
//   if (!resume) throw new Error("Resume not found");

//   try {
//     // Update status to PROCESSING
//     await db.resume.update({
//       where: { id: resumeId },
//       data: { status: "PROCESSING" },
//     });

//     // 2. Fetch File
//     console.time("Fetch File");
//     const response = await fetch(resume.fileUrl);
//     if (!response.ok) throw new Error("Failed to download file");
//     const arrayBuffer = await response.arrayBuffer();
//     const fileBuffer = Buffer.from(arrayBuffer);
//     console.timeEnd("Fetch File");

//     // 3. Extract Text
//     console.time("PDF Extraction");
//     const resumeText = await extractTextFromBuffer(fileBuffer);
//     console.timeEnd("PDF Extraction");

//     // 4. Analyze
//     console.time("Gemini Analysis");
//     // Use the saved description from the DB!
//     const analysisResult = await analyzeResume(
//       resumeText,
//       resume.title,
//       resume.description || undefined,
//     );
//     console.timeEnd("Gemini Analysis");

//     // 5. Update DB
//     await db.resume.update({
//       where: { id: resumeId },
//       data: {
//         status: "COMPLETED",
//         analysisJson: analysisResult,
//       },
//     });

//     console.timeEnd(`Analysis for ${resumeId}`);
//     return { success: true };
//   } catch (error: any) {
//     console.error("Analysis Failed:", error);
//     await db.resume.update({
//       where: { id: resumeId },
//       data: { status: "FAILED" },
//     });
//     throw error;
//   }
// }
