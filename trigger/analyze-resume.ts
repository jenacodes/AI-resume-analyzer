// trigger/analyze-resume.ts
import { task, logger } from "@trigger.dev/sdk/v3"; // <--- v3 Import
import { PrismaClient } from "@prisma/client";
import { extractTextFromBuffer } from "../app/services/pdf.server"; // <--- Static import
import { analyzeResume } from "../app/services/gemini.server"; // <--- Static import

// Instantiate Prisma for the worker
const prisma = new PrismaClient();

export const analyzeResumeTask = task({
  id: "analyze-resume",
  retry: {
    maxAttempts: 2,
  },
  run: async (payload: { resumeId: string }) => {
    const { resumeId } = payload;
    logger.info("Starting resume analysis", { resumeId });

    // 1. Fetch the resume record
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      // It's often better to return logic here than throw,
      // unless you want to retry (which we don't for missing IDs)
      logger.error(`Resume not found: ${resumeId}`);
      return;
    }

    try {
      // 2. Mark as PROCESSING
      await prisma.resume.update({
        where: { id: resumeId },
        data: { status: "PROCESSING" },
      });

      // 3. Download the PDF
      logger.info("Downloading PDF", { url: resume.fileUrl });
      const response = await fetch(resume.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      console.timeEnd("Fetch File");

      // 4. Extract text
      logger.info("Extracting text from PDF");
      const resumeText = await extractTextFromBuffer(fileBuffer);

      // 5. Analyze with Gemini AI
      logger.info("Sending to Gemini for analysis");
      const analysisResult = await analyzeResume(
        resumeText,
        resume.title,
        resume.description || undefined,
      );

      // 6. Save results to DB
      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          status: "COMPLETED",
          analysisJson: analysisResult,
        },
      });

      logger.info("Analysis complete", { resumeId });
      return { success: true, resumeId };
    } catch (error: any) {
      logger.error("Analysis failed", { resumeId, error: error.message });

      await prisma.resume.update({
        where: { id: resumeId },
        data: { status: "FAILED" },
      });

      throw error; // Re-throw to trigger the retry mechanism
    }
  },
});
