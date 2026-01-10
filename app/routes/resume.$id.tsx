import type { Route } from "./+types/resume.$id";
import { Sidebar } from "../components/Sidebar";
import { AnalysisPanel } from "../components/AnalysisPanel";
import { ArrowLeft } from "lucide-react";
import { Link, redirect } from "react-router";
import Navbar from "../components/Navbar";

import { getSession } from "~/sessions";
import { db } from "~/db.server";
import type { AnalysisResult } from "~/services/gemini.server";
import PDFViewer from "../components/PDFViewer";

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
  const feedback = JSON.parse(resume.analysisJson) as AnalysisResult;

  return { resume, feedback };
}

export default function ResumeDetail({ loaderData }: Route.ComponentProps) {
  const { resume, feedback } = loaderData;

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
                <h1 className="font-black text-2xl uppercase tracking-tight text-black">
                  {resume.title}
                </h1>
                <p className="text-sm font-bold text-gray-600 uppercase">
                  {resume.company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-neo-accent border-2 border-black shadow-neo-sm text-black text-xs font-black uppercase tracking-wide transform -rotate-2">
                AI Analysis Complete
              </span>
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
              <AnalysisPanel feedback={feedback} />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
