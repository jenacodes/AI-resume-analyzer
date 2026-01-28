import type { Route } from "./+types/profile";
import { Sidebar } from "../components/Sidebar";
import { ProfileHeader } from "../components/ProfileHeader";
import { StatsOverview } from "../components/StatsOverview";
import { SettingsSection } from "../components/SettingsSection";
import Navbar from "~/components/Navbar";

import { getSession } from "~/sessions";
import { redirect, Link } from "react-router";
import { db } from "~/db.server";
import { FileText, Star, Zap, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "~/services/gemini.server";

export async function loader({ request }: Route.LoaderArgs) {
  // Get user session
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  // Check if user is logged in
  if (!userId) {
    throw redirect("/login");
  }

  // Fetch user
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, bio: true, location: true },
  });

  // Check if user exists
  if (!user) {
    throw redirect("/login");
  }

  // Fetch resumes

  const resumes = await db.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Parse resumes
  // const parsedResumes = resumes.map((r) => ({
  //   ...r,
  //   analysis: JSON.parse(r.analysisJson) as AnalysisResult,
  // }));

  const parsedResumes = resumes.map((r) => ({
    ...r,
    analysis: JSON.parse(r.analysisJson || "{}") as AnalysisResult,
  }));

  // Calculate stats
  const totalScans = parsedResumes.length;

  // Calculate total score and average score
  const totalScore = parsedResumes.reduce(
    (acc, r) => acc + (r.analysis.overallScore || 0),
    0,
  );
  const averageScore = totalScans > 0 ? Math.round(totalScore / totalScans) : 0;

  // Calculate improvement (diff between first and last scan if > 1)
  let improvement = 0;
  if (totalScans > 1) {
    const latestScore = parsedResumes[0].analysis.overallScore || 0;
    const oldestScore =
      parsedResumes[parsedResumes.length - 1].analysis.overallScore || 0;
    improvement = latestScore - oldestScore;
  }

  return {
    user,
    statsData: {
      totalScans,
      averageScore,
      improvement,
    },
    recentActivity: parsedResumes.slice(0, 3).map((r) => ({
      id: r.id,
      title: r.title,
      score: r.analysis.overallScore,
      date: r.createdAt.toISOString(),
    })),
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile - ResumeAI" },
    { name: "description", content: "Manage your profile and settings" },
  ];
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  //
  const { user, statsData, recentActivity } = loaderData;

  const stats = [
    {
      label: "Total Scans",
      value: statsData.totalScans.toString(),
      icon: FileText,
      color: "text-white",
      bg: "bg-neo-primary",
    },
    {
      label: "Average Score",
      value: statsData.averageScore.toString(),
      icon: Star,
      color: "text-white",
      bg: "bg-neo-secondary",
    },
    {
      label: "Interviews",
      value: "0",
      icon: Zap,
      color: "text-black",
      bg: "bg-neo-accent",
    },
    {
      label: "Improvement",
      value:
        statsData.improvement > 0
          ? `+${statsData.improvement}`
          : statsData.improvement.toString(),
      icon: TrendingUp,
      color: "text-black",
      bg: "bg-green-400",
    },
  ];

  // Simple relative time formatter
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
        <Sidebar />

        <main className="flex-1 lg:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
              <ProfileHeader user={user} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-2xl font-black uppercase text-black">
                    Overview
                  </h2>
                  <StatsOverview stats={stats} />

                  {/* Recent Activity */}
                  <div className="bg-white border-4 border-black shadow-neo p-6">
                    <h3 className="text-xl font-black uppercase text-black mb-6">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity) => (
                          <Link
                            to={`/resume/${activity.id}`}
                            key={activity.id}
                            className="flex items-center gap-4 p-4 border-2 border-black bg-gray-50 hover:bg-neo-bg transition-colors"
                          >
                            <div className="w-12 h-12 border-2 border-black bg-neo-secondary flex items-center justify-center text-white font-black shadow-neo-sm">
                              {activity.score}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-black uppercase">
                                Analyzed "{activity.title}" Resume
                              </p>
                              <p className="text-xs text-gray-600 font-bold">
                                {formatTimeAgo(activity.date)}
                              </p>
                            </div>
                            <span className="text-xs font-black text-black bg-neo-accent px-2 py-1 border-2 border-black">
                              View
                            </span>
                          </Link>
                        ))
                      ) : (
                        <p className="text-gray-500 font-bold italic">
                          No recent activity found.
                        </p>
                      )}
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
