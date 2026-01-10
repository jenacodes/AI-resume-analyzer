import type { Route } from "./+types/profile";
import { Sidebar } from "../components/Sidebar";
import { ProfileHeader } from "../components/ProfileHeader";
import { StatsOverview } from "../components/StatsOverview";
import { SettingsSection } from "../components/SettingsSection";
import Navbar from "~/components/Navbar";

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
      <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
        <Sidebar />

        <main className="flex-1 lg:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
              <ProfileHeader />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-2xl font-black uppercase text-black">
                    Overview
                  </h2>
                  <StatsOverview />

                  {/* Recent Activity */}
                  <div className="bg-white border-4 border-black shadow-neo p-6">
                    <h3 className="text-xl font-black uppercase text-black mb-6">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 border-2 border-black bg-gray-50 hover:bg-neo-bg transition-colors"
                        >
                          <div className="w-12 h-12 border-2 border-black bg-neo-secondary flex items-center justify-center text-white font-black shadow-neo-sm">
                            AI
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-black uppercase">
                              Analyzed "Frontend Developer" Resume
                            </p>
                            <p className="text-xs text-gray-600 font-bold">
                              2 hours ago
                            </p>
                          </div>
                          <span className="text-xs font-black text-black bg-neo-accent px-2 py-1 border-2 border-black">
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
