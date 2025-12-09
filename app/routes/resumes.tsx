import type { Route } from "./+types/resumes";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ResumeGridCard } from "../components/ResumeGridCard";
import { FilterBar } from "../components/FilterBar";
import { resumes } from "../../constants";
import { Link, redirect } from "react-router";
import { Plus, Search } from "lucide-react";
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
    { title: "My Resumes - ResumeAI" },
    { name: "description", content: "View and manage your analyzed resumes" },
  ];
}

export default function MyResumes() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex">
        <Sidebar />

        <main className="flex-1 md:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          {/* Ambient Background Effects */}
          <AmbientBackground />

          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">My Resumes</h1>
                  <p className="text-slate-400 mt-1">
                    Manage and track your resume versions
                  </p>
                </div>
                <Link
                  to="/scan"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-sm font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] w-fit"
                >
                  <Plus className="w-4 h-4" />
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
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Search className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No resumes found
                  </h3>
                  <p className="text-slate-400">
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
