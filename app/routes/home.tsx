import type { Route } from "./+types/home";
import { Sidebar } from "../components/Sidebar";

import { StatsCard } from "../components/StatsCard";
import { UploadZone } from "../components/UploadZone";
import { Award, Briefcase, TrendingUp, Zap } from "lucide-react";
import { resumes } from "../../constants";
import { Link, redirect } from "react-router";
import ResumeCard from "~/components/ResumeCard";
import Navbar from "~/components/Navbar";

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
    <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white">
      <Sidebar />

      <main className="lg:pl-64 pl-0 min-h-screen relative overflow-hidden">
        <Navbar />
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-black">
                Dashboard Overview
              </h2>
              <p className="text-black font-medium mt-1 mb-3 border-l-4 border-neo-primary pl-4">
                Welcome back! Here's how your resumes are performing.
              </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="px-6 py-3 bg-white border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-black font-bold uppercase text-sm">
                Export Report
              </button>
              <Link
                to="/scan"
                className="px-6 py-3 bg-neo-primary border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-white font-bold uppercase text-sm"
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
                <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                  <span className="w-4 h-8 bg-neo-primary border-2 border-black" />
                  Quick Analysis
                </h3>
                <UploadZone />
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                    <span className="w-4 h-8 bg-neo-secondary border-2 border-black" />
                    Recent Scans
                  </h3>
                  <a
                    href="/resumes"
                    className="text-sm font-bold text-black uppercase hover:underline border-b-2 border-black"
                  >
                    View All
                  </a>
                </div>

                <div className="bg-white border-4 border-black shadow-neo overflow-hidden">
                  {resumes.length > 0 &&
                    resumes.map((resume) => (
                      <ResumeCard key={resume.id} resume={resume} />
                    ))}
                </div>
              </section>
            </div>

            {/* Right Column - Insights */}
            <div className="space-y-6">
              <div className="bg-white border-4 border-black shadow-neo p-6">
                <h3 className="text-xl font-black uppercase mb-4">
                  Improvement Tips
                </h3>
                <div className="space-y-4">
                  {[
                    "Add more quantifiable results to your work experience.",
                    "Include 'React' and 'TypeScript' in your skills section.",
                    "Shorten your summary to 3-4 sentences.",
                  ].map((tip, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 bg-neo-bg border-2 border-black"
                    >
                      <div className="w-3 h-3 bg-neo-accent border-2 border-black mt-1.5 shrink-0" />
                      <p className="text-sm text-black font-bold leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black hover:shadow-neo-sm transition-all text-sm font-bold uppercase">
                  View Full Report
                </button>
              </div>

              <div className="bg-neo-accent border-4 border-black shadow-neo p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase mb-2">
                    Pro Feature
                  </h3>
                  <p className="text-sm text-black font-bold mb-4">
                    Unlock AI Cover Letter generation based on your resume.
                  </p>
                  <button className="w-full py-3 bg-white border-4 border-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm font-black uppercase cursor-pointer">
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
