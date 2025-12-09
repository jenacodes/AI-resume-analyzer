import type { Route } from "./+types/home";
import { Sidebar } from "../components/Sidebar";

import { StatsCard } from "../components/StatsCard";
import { UploadZone } from "../components/UploadZone";
import { Award, Briefcase, TrendingUp, Zap } from "lucide-react";
import { resumes } from "../../constants";
import { Link, redirect } from "react-router";
import ResumeCard from "~/components/ResumeCard";
import Navbar from "~/components/Navbar";
import AmbientBackground from "~/components/AmbientBackground";
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
    { title: "ResumeAI - Smart Resume Analyzer" },
    {
      name: "description",
      content: "Analyze and optimize your resume with AI",
    },
  ];
}
export default function Home() {
  // Calculate average score
  const averageScore = Math.round(
    resumes.reduce((acc, resume) => acc + resume.feedback.overallScore, 0) /
      resumes.length
  );
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      <Sidebar />

      <main className="lg:pl-64 pl-0 min-h-screen relative overflow-hidden">
        {/* Ambient Background Effects */}
        <AmbientBackground />

        <Navbar />
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                Dashboard Overview
              </h2>
              <p className="text-slate-400 mt-1 mb-3">
                Welcome back! Here's how your resumes are performing.
              </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium">
                Export Report
              </button>
              <Link
                to="/scan"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-sm font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                + New Scan
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Average Score"
              value={`${averageScore}/100`}
              icon={Award}
              color="blue"
              trend="up"
              trendValue="+5%"
            />
            <StatsCard
              title="Job Matches"
              value="12"
              subtitle="High fit"
              icon={Briefcase}
              color="purple"
              trend="neutral"
              trendValue="Same"
            />
            <StatsCard
              title="Skills Found"
              value="24"
              icon={Zap}
              color="pink"
              trend="up"
              trendValue="+2"
            />
            <StatsCard
              title="Market Value"
              value="$120k"
              subtitle="Est. Salary"
              icon={TrendingUp}
              color="green"
              trend="up"
              trendValue="+$5k"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload & Recent */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full" />
                  Quick Analysis
                </h3>
                <UploadZone />
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full" />
                    Recent Scans
                  </h3>
                  <a
                    href="/resumes"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    View All
                  </a>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                  {resumes.length > 0 &&
                    resumes.map((resume) => (
                      <ResumeCard key={resume.id} resume={resume} />
                    ))}
                </div>
              </section>
            </div>

            {/* Right Column - Insights */}
            <div className="space-y-6">
              <div className="bg-linear-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4">Improvement Tips</h3>
                <div className="space-y-4">
                  {[
                    "Add more quantifiable results to your work experience.",
                    "Include 'React' and 'TypeScript' in your skills section.",
                    "Shorten your summary to 3-4 sentences.",
                  ].map((tip, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition">
                  View Full Report
                </button>
              </div>

              <div className="bg-linear-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-2">Pro Feature</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Unlock AI Cover Letter generation based on your resume.
                  </p>
                  <button className="w-full py-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition cursor-pointer">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
