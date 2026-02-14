import type { Route } from "./+types/cover-letter";
import { Sidebar } from "../components/Sidebar";
import { CoverLetterForm } from "../components/CoverLetterForm";
import { CoverLetterPreview } from "../components/CoverLetterPreview";
import { useState, useEffect } from "react";
import Navbar from "~/components/Navbar";
import { redirect, useFetcher, useRevalidator } from "react-router";
import { getSession } from "~/sessions";
import { db } from "~/db.server";
import { tasks } from "@trigger.dev/sdk";
import type { generateCoverLetterTask } from "../../trigger/generate-cover-letter";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw redirect("/login");
  }

  // Fetch user's completed resumes for the dropdown
  const resumes = await db.resume.findMany({
    where: { userId, status: "COMPLETED" },
    select: { id: true, title: true, company: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch the most recent cover letter (if any is still generating)
  const activeCoverLetter = await db.coverLetter.findFirst({
    where: {
      userId,
      status: { in: ["PENDING", "PROCESSING"] },
    },
    orderBy: { createdAt: "desc" },
  });

  // Also fetch the latest completed one if no active one
  const latestCompleted = !activeCoverLetter
    ? await db.coverLetter.findFirst({
        where: {
          userId,
          status: "COMPLETED",
        },
        orderBy: { createdAt: "desc" },
      })
    : null;

  const coverLetter = activeCoverLetter || latestCompleted;

  return { resumes, coverLetter };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) throw redirect("/login");

  const formData = await request.formData();
  const resumeId = formData.get("resumeId") as string;
  const jobDescription = formData.get("jobDescription") as string;

  if (!resumeId || !jobDescription) {
    return { error: "Please select a resume and provide a job description." };
  }

  // Verify the resume belongs to the user
  const resume = await db.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume) {
    return { error: "Resume not found." };
  }

  try {
    // Create a pending cover letter record
    const coverLetter = await db.coverLetter.create({
      data: {
        userId,
        resumeId,
        jobDescription,
        status: "PENDING",
      },
    });

    // Trigger the background task
    await tasks.trigger<typeof generateCoverLetterTask>(
      "generate-cover-letter",
      {
        coverLetterId: coverLetter.id,
      },
    );

    return { success: true, coverLetterId: coverLetter.id };
  } catch (error: any) {
    console.error("Cover letter generation failed:", error.message);
    return { error: "Failed to start cover letter generation." };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cover Letter Generator - ResumeAI" },
    {
      name: "description",
      content: "Generate personalized cover letters with AI",
    },
  ];
}

export default function CoverLetter({ loaderData }: Route.ComponentProps) {
  const { resumes, coverLetter } = loaderData;
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState(
    coverLetter?.content || "",
  );

  const isGenerating =
    fetcher.state !== "idle" ||
    coverLetter?.status === "PENDING" ||
    coverLetter?.status === "PROCESSING";

  const hasFailed = coverLetter?.status === "FAILED";

  // Update content when loader data changes (polling brings new data)
  useEffect(() => {
    if (coverLetter?.content) {
      setGeneratedContent(coverLetter.content);
    }
  }, [coverLetter?.content]);

  // Poll while generation is in progress
  useEffect(() => {
    if (
      !coverLetter ||
      coverLetter.status === "COMPLETED" ||
      coverLetter.status === "FAILED"
    ) {
      return;
    }

    const interval = setInterval(() => {
      if (revalidator.state === "idle") {
        revalidator.revalidate();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [coverLetter?.status, revalidator]);

  const handleGenerate = () => {
    if (!selectedResumeId || !jobDescription) return;

    setGeneratedContent("");
    fetcher.submit(
      { resumeId: selectedResumeId, jobDescription },
      { method: "post" },
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
        <Sidebar />

        <main className="flex-1 lg:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              <div className="mb-8">
                <h1 className="text-4xl font-black uppercase text-black">
                  Cover Letter Generator
                </h1>
                <p className="text-black font-medium mt-1 border-l-4 border-neo-primary pl-4">
                  Create tailored cover letters in seconds with AI
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
                {/* Left Column - Input */}
                <div className="bg-white border-4 border-black shadow-neo p-6 h-fit">
                  <CoverLetterForm
                    resumes={resumes}
                    selectedResumeId={selectedResumeId}
                    setSelectedResumeId={setSelectedResumeId}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    isGenerating={isGenerating}
                    onGenerate={handleGenerate}
                  />

                  {fetcher.data?.error && (
                    <div className="mt-4 bg-red-500 text-white p-3 border-4 border-black shadow-neo font-bold text-center">
                      {fetcher.data.error}
                    </div>
                  )}

                  {hasFailed && (
                    <div className="mt-4 bg-red-500 text-white p-3 border-4 border-black shadow-neo font-bold text-center">
                      Generation failed. Please try again.
                    </div>
                  )}
                </div>

                {/* Right Column - Output */}
                <div className="h-[600px] lg:h-auto">
                  <CoverLetterPreview
                    content={generatedContent}
                    setContent={setGeneratedContent}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
