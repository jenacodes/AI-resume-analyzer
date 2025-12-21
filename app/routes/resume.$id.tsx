import type { Route } from "./+types/resume.$id";
import { Sidebar } from "../components/Sidebar";
import { AnalysisPanel } from "../components/AnalysisPanel";
import { ArrowLeft } from "lucide-react";
import { Link, redirect } from "react-router";
import Navbar from "../components/Navbar";
import AmbientBackground from "~/components/AmbientBackground";
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
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex">
        <Sidebar />

        <main className="flex-1 lg:ml-64 h-screen flex flex-col relative overflow-hidden">
          {/* Ambient Background Effects */}
          <AmbientBackground />

          {/* Header */}
          <header className="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-semibold text-white">{resume.title}</h1>
                <p className="text-xs text-slate-400">{resume.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                AI Analysis Complete
              </span>
            </div>
          </header>

          {/* Split View Content */}
          <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
            {/* Left Panel: PDF Viewer */}
            <div className="w-full md:w-1/2 h-96 md:h-full border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/30 shrink-0">
              <PDFViewer url={resume.filePath} />
            </div>

            {/* Right Panel: Analysis */}
            <div className="w-full md:w-1/2 h-auto md:h-full bg-slate-950/50">
              <AnalysisPanel feedback={feedback} />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
