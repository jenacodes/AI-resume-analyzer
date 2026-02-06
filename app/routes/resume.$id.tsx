import type { Route } from "./+types/resume.$id";
import { Sidebar } from "../components/Sidebar";
import { AnalysisPanel } from "../components/AnalysisPanel";
import { ArrowLeft } from "lucide-react";
import { Link, redirect, useFetcher } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

import { getSession } from "~/sessions";
import { db } from "~/db.server";
import type { AnalysisResult } from "~/services/gemini.server";
import PDFViewer from "../components/PDFViewer";
import { performResumeAnalysis } from "~/services/scan.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  //Checked if user is authenticated
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }

  //Fetch the resume by ID
  const resume = await db.resume.findUnique({
    where: { id: params.id },
  });

  //If resume not found, throw 404
  if (!resume) {
    throw new Response("Not Found", { status: 404 });
  }

  // Parse the JSON string back to object
  const feedback = resume.analysisJson
    ? (JSON.parse(resume.analysisJson) as AnalysisResult)
    : null;

  return { resume, feedback };
}

export async function action({ params }: Route.ActionArgs) {
  if (!params.id) throw new Error("Resume ID is required");
  await performResumeAnalysis(params.id);
  return { success: true };
}

export default function ResumeDetail({ loaderData }: Route.ComponentProps) {
  const { resume, feedback } = loaderData;
  const fetcher = useFetcher();

  // Trigger analysis if pending
  useEffect(() => {
    if (
      resume.status === "PENDING" &&
      fetcher.state === "idle" &&
      !fetcher.data
    ) {
      fetcher.submit(null, { method: "post" });
    }
  }, [resume.status, fetcher]);

  const isAnalyzing =
    resume.status === "PENDING" ||
    resume.status === "PROCESSING" ||
    fetcher.state !== "idle";

  return (
    <section>
      <Navbar />
      <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
        <Sidebar />

        <main className="flex-1 lg:ml-64 h-screen flex flex-col relative overflow-hidden">
          {/* Header */}
          <header className="h-20 border-b-4 border-black bg-white flex items-center justify-between px-6 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-black"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-black text-xs uppercase text-black">
                  {resume.title === "Untitled Resume"
                    ? resume.name
                    : resume.title}
                </h1>
                <p className="text-xs font-bold text-gray-600 uppercase">
                  {resume.company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAnalyzing ? (
                <span className="px-4 py-1.5 bg-yellow-300 border-2 border-black shadow-neo-sm text-black text-xs font-black uppercase tracking-wide animate-pulse">
                  Analyzing...
                </span>
              ) : (
                <span className="px-4 py-1.5 bg-neo-accent border-2 border-black shadow-neo-sm text-black text-xs font-black uppercase tracking-wide transform -rotate-2">
                  AI Analysis Complete
                </span>
              )}
            </div>
          </header>

          {/* Split View Content */}
          <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
            {/* Left Panel: PDF Viewer */}
            <div className="w-full md:w-1/2 h-96 md:h-full border-b-4 md:border-b-0 md:border-r-4 border-black bg-gray-100 shrink-0">
              <PDFViewer url={resume.filePath} />
            </div>

            {/* Right Panel: Analysis */}
            <div className="w-full md:w-1/2 h-auto md:h-full bg-neo-bg">
              {feedback ? (
                <AnalysisPanel feedback={feedback} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-12">
                  {resume.status === "FAILED" ? (
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-red-600 uppercase mb-2">
                        Analysis Failed
                      </h3>
                      <p className="font-bold mb-4">
                        Something went wrong while reading your resume.
                      </p>
                      <button
                        onClick={() => fetcher.submit(null, { method: "post" })}
                        className="px-6 py-2 bg-black text-white font-bold uppercase border-2 border-black hover:bg-white hover:text-black hover:shadow-neo-sm transition-all"
                      >
                        Retry Analysis
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 border-8 border-t-neo-primary border-gray-200 rounded-full animate-spin mb-4"></div>
                      <h3 className="text-2xl font-black uppercase animate-pulse">
                        Analyzing Resume...
                      </h3>
                      <p className="font-bold mt-2 text-gray-600">
                        This might take a few seconds.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
