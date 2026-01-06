import type { Route } from "./+types/resumes";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ResumeGridCard } from "../components/ResumeGridCard";
import { FilterBar } from "../components/FilterBar";
import type { AnalysisResult } from "~/services/gemini.server";
import { Link, redirect } from "react-router";
import { Plus, Search } from "lucide-react";
import Navbar from "~/components/Navbar";
import { db } from "~/db.server";

import { getSession } from "~/sessions";

export async function loader({ request, params }: Route.LoaderArgs) {
  // 1. Check Authentication
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!session.has("userId")) {
    throw redirect("/login");
  }

  // 2. Fetch Resumes
  const resumeData = await db.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const resumes = resumeData.map((resume) => ({
    ...resume,
    feedback: JSON.parse(resume.analysisJson) as AnalysisResult,
  }));

  return { resumes };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Resumes - ResumeAI" },
    { name: "description", content: "View and manage your analyzed resumes" },
  ];
}

export default function MyResumes({ loaderData }: Route.ComponentProps) {
  const { resumes } = loaderData;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResumes = resumes.filter(
    (resume) =>
      (resume.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resume.company || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
        <Sidebar />

        <main className="flex-1 md:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
                    My Resumes
                  </h1>
                  <p className="text-black font-medium mt-1 border-l-4 border-neo-primary pl-4">
                    Manage and track your resume versions
                  </p>
                </div>
                <Link
                  to="/scan"
                  className="flex items-center gap-2 px-6 py-3 bg-neo-primary border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-white font-bold uppercase w-fit"
                >
                  <Plus className="w-5 h-5" />
                  New Scan
                </Link>
              </div>

              {/* Filter Bar */}
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              {/* Resume Grid */}
              {filteredResumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredResumes.map((resume) => (
                    <ResumeGridCard key={resume.id} resume={resume} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border-4 border-black shadow-neo">
                  <div className="w-20 h-20 bg-neo-accent border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-neo-sm">
                    <Search className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase mb-2">
                    No resumes found
                  </h3>
                  <p className="text-gray-600 font-bold">
                    Try adjusting your search or upload a new resume.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
