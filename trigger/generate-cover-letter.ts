// trigger/generate-cover-letter.ts
import { task, logger } from "@trigger.dev/sdk/v3";
import { PrismaClient } from "@prisma/client";
import { extractTextFromBuffer } from "../app/services/pdf.server";
import { generateCoverLetter } from "../app/services/gemini.server";

const prisma = new PrismaClient();

export const generateCoverLetterTask = task({
  id: "generate-cover-letter",
  retry: {
    maxAttempts: 2,
  },
  run: async (payload: { coverLetterId: string }) => {
    const { coverLetterId } = payload;
    logger.info("Starting cover letter generation", { coverLetterId });

    // 1. Fetch the cover letter record
    const coverLetter = await prisma.coverLetter.findUnique({
      where: { id: coverLetterId },
      include: {
        resume: true,
        user: true,
      },
    });

    if (!coverLetter) {
      logger.error(`Cover letter not found: ${coverLetterId}`);
      return;
    }

    if (!coverLetter.resume) {
      logger.error(`No resume linked to cover letter: ${coverLetterId}`);
      await prisma.coverLetter.update({
        where: { id: coverLetterId },
        data: { status: "FAILED" },
      });
      return;
    }

    try {
      // 2. Mark as PROCESSING
      await prisma.coverLetter.update({
        where: { id: coverLetterId },
        data: { status: "PROCESSING" },
      });

      // 3. Download the resume PDF
      logger.info("Downloading resume PDF", {
        url: coverLetter.resume.fileUrl,
      });
      const response = await fetch(coverLetter.resume.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      // 4. Extract text from resume
      logger.info("Extracting text from PDF");
      const resumeText = await extractTextFromBuffer(fileBuffer);

      // 5. Generate cover letter with Gemini AI
      logger.info("Generating cover letter with Gemini");
      const generatedContent = await generateCoverLetter(
        resumeText,
        coverLetter.jobDescription,
        coverLetter.user.name || undefined,
      );

      // 6. Save result to DB
      await prisma.coverLetter.update({
        where: { id: coverLetterId },
        data: {
          status: "COMPLETED",
          content: generatedContent,
        },
      });

      logger.info("Cover letter generation complete", { coverLetterId });
      return { success: true, coverLetterId };
    } catch (error: any) {
      logger.error("Cover letter generation failed", {
        coverLetterId,
        error: error.message,
      });

      await prisma.coverLetter.update({
        where: { id: coverLetterId },
        data: { status: "FAILED" },
      });

      throw error; // Re-throw to trigger retry
    }
  },
});
