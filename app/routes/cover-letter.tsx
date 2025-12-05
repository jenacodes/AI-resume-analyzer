import type { Route } from "./+types/cover-letter";
import { Sidebar } from "../components/Sidebar";
import { CoverLetterForm } from "../components/CoverLetterForm";
import { CoverLetterPreview } from "../components/CoverLetterPreview";
import { useState } from "react";
import Navbar from "~/components/Navbar";

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
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex">
        <Sidebar />

        <main className="flex-1 md:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          {/* Ambient Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[30%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">
                  Cover Letter Generator
                </h1>
                <p className="text-slate-400 mt-1">
                  Create tailored cover letters in seconds with AI
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
                {/* Left Column - Input */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm h-fit">
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
