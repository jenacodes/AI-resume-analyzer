import type { Route } from "./+types/cover-letter";
import { Sidebar } from "../components/Sidebar";
import { CoverLetterForm } from "../components/CoverLetterForm";
import { CoverLetterPreview } from "../components/CoverLetterPreview";
import { use, useState } from "react";
import Navbar from "~/components/Navbar";
import { redirect } from "react-router";
import { getSession } from "~/sessions";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  return null;
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

export default function CoverLetter() {
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedContent(`Dear Hiring Manager,

I am writing to express my strong interest in the open position at your company. With my background in software development and my passion for building innovative solutions, I believe I would be a valuable asset to your team.

[This is a simulated AI response based on the job description you provided.]

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experience align with your needs.

Sincerely,
[Your Name]`);
      setIsGenerating(false);
    }, 2000);
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
                    selectedResumeId={selectedResumeId}
                    setSelectedResumeId={setSelectedResumeId}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    isGenerating={isGenerating}
                    onGenerate={handleGenerate}
                  />
                </div>

                {/* Right Column - Output */}
                <div className="h-[600px] lg:h-auto">
                  <CoverLetterPreview
                    content={generatedContent}
                    setContent={setGeneratedContent}
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
