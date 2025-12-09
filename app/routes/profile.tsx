import type { Route } from "./+types/profile";
import { Sidebar } from "../components/Sidebar";
import { ProfileHeader } from "../components/ProfileHeader";
import { StatsOverview } from "../components/StatsOverview";
import { SettingsSection } from "../components/SettingsSection";
import Navbar from "~/components/Navbar";
import AmbientBackground from "~/components/AmbientBackground";
import { getSession } from "~/sessions";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  return null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile - ResumeAI" },
    { name: "description", content: "Manage your profile and settings" },
  ];
}

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex">
        <Sidebar />

        <main className="flex-1 md:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          {/* Ambient Background Effects */}
          <AmbientBackground />

          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
              <ProfileHeader />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-xl font-bold text-white">Overview</h2>
                  <StatsOverview />

                  {/* Recent Activity Placeholder - Could be another component */}
                  <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                            AI
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              Analyzed "Frontend Developer" Resume
                            </p>
                            <p className="text-xs text-slate-500">
                              2 hours ago
                            </p>
                          </div>
                          <span className="text-xs font-bold text-green-400">
                            +5 Score
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <SettingsSection />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
