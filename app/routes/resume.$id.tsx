import type { Route } from "./+types/resume.$id";
import { resumes } from "../../constants";
import { PDFViewer } from "../components/PDFViewer";
import { AnalysisPanel } from "../components/AnalysisPanel";
import { Sidebar } from "../components/Sidebar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";

export function meta({ params }: Route.MetaArgs) {
  const resume = resumes.find((r) => r.id === params.id);
  return [
    { title: resume ? `${resume.jobTitle} - Analysis` : "Resume Analysis" },
    { name: "description", content: "Detailed AI analysis of your resume" },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const resume = resumes.find((r) => r.id === params.id);
  if (!resume) {
    throw new Response("Not Found", { status: 404 });
  }
  return { resume };
}

export default function ResumeDetail({ loaderData }: Route.ComponentProps) {
  const { resume } = loaderData;

  return (
    <section>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex">
        <Sidebar />

        <main className="flex-1 lg:ml-64 h-screen flex flex-col relative overflow-hidden">
          {/* Ambient Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-[-20%] left-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
          </div>

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
                <h1 className="font-semibold text-white">{resume.jobTitle}</h1>
                <p className="text-xs text-slate-400">{resume.companyName}</p>
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
              <PDFViewer url={resume.imagePath} />
            </div>

            {/* Right Panel: Analysis */}
            <div className="w-full md:w-1/2 h-auto md:h-full bg-slate-950/50">
              <AnalysisPanel feedback={resume.feedback} />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
