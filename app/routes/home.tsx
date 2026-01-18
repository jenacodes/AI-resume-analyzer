import type { Route } from "./+types/home";
import { Sidebar } from "../components/Sidebar";

import { StatsCard } from "../components/StatsCard";
import { UploadZone } from "../components/UploadZone";
import { Award, Briefcase, TrendingUp, Zap } from "lucide-react";
import {
  Link,
  redirect,
  useSubmit,
  useNavigation,
  useActionData,
} from "react-router";
import ResumeCard from "~/components/ResumeCard";
import Navbar from "~/components/Navbar";

import { getSession } from "~/sessions";
import { db } from "~/db.server";
import type { AnalysisResult } from "~/services/gemini.server";
import { createPendingResume } from "~/services/scan.server";

export async function loader({ request }: Route.LoaderArgs) {
  //1. Authenticate the user
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  //check if no user, kick them out
  if (!userId) {
    throw redirect("/login");
  }

  //2. Query the database
  const resumes = await db.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Transform Prisma data to include parsed feedback matching our UI expectations
  const resumesWithFeedback = resumes.map((resume) => ({
    ...resume,
    feedback: resume.analysisJson
      ? (JSON.parse(resume.analysisJson) as AnalysisResult)
      : null, // Handle pending analysis
  }));

  //3. Return to component
  return { resumes: resumesWithFeedback };
}

export async function action({ request }: Route.ActionArgs) {
  //Authenticate
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) throw redirect("/login");

  //Process File
  const formData = await request.formData();
  const fileUrl = formData.get("fileUrl") as string;
  const fileName = (formData.get("fileName") as string) || "My Resume";

  console.log("Home Action received fileUrl:", fileUrl);

  //Validate file
  if (!fileUrl || fileUrl === "undefined") {
    console.error("File URL is missing or undefined");
    return { error: "Please upload a resume PDF." };
  }

  try {
    //Process file and send to the server
    // Note: processResumeUpload was renamed to createPendingResume
    const resume = await createPendingResume(userId, fileUrl, fileName);
    return redirect(`/resume/${resume.id}`);
  } catch (error: any) {
    console.error("Home Action Error:", error);
    return { error: error.message || "Something went wrong." };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - ResumeAI" },
    {
      name: "description",
      content: "Analyze and optimize your resume with AI",
    },
  ];
}
export default function Home({ loaderData }: Route.ComponentProps) {
  //1. Access the data from the loader
  const { resumes } = loaderData;
  const latestResume = resumes[0];
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>(); // Add this
  const isAnalyzing = navigation.state === "submitting";

  //2. Submit the form data
  const handleFileAccepted = (fileUrl: string, fileName: string) => {
    const formData = new FormData();
    formData.append("fileUrl", fileUrl);
    formData.append("fileName", fileName);
    submit(formData, { method: "post" });
  };

  // Calculate real average score
  const averageScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce((acc, r) => acc + (r.feedback?.overallScore || 0), 0) /
            (resumes.filter((r) => r.feedback).length || 1), // Avoid divide by zero
        )
      : 0;

  // Mock data for other stats (could be improved later with more complex analysis)
  const jobMatches = resumes.length > 0 ? Math.floor(resumes.length * 1.5) : 0;

  // Safe access for new fields (older scans might not have them)
  const skillsFound =
    latestResume?.feedback?.extractedSkills?.length ??
    latestResume?.feedback?.skills?.tips?.length ??
    0;

  const marketValue = latestResume?.feedback?.estimatedSalary || "-";

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
                className="px-6 py-3 bg-neo-primary border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-white font-bold uppercase text-sm text-center"
              >
                + New Scan
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Average Score"
              value={resumes.length > 0 ? `${averageScore}/100` : "-"}
              icon={Award}
              color="blue"
              trend={resumes.length > 0 ? "up" : "neutral"}
              trendValue={resumes.length > 0 ? "Latest" : ""}
            />
            <StatsCard
              title="Total Scans"
              value={resumes.length.toString()}
              subtitle="Resumes Analyzed"
              icon={Briefcase}
              color="purple"
              trend="neutral"
              trendValue="Lifetime"
            />
            <StatsCard
              title="Skills Found"
              value={skillsFound.toString()}
              icon={Zap}
              color="pink"
              trend="neutral"
              trendValue="Latest Scan"
            />
            <StatsCard
              title="Market Value"
              value={marketValue}
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

                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-white border-4 border-black shadow-neo">
                    <div className="w-16 h-16 border-8 border-t-neo-primary border-gray-200 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-2xl font-black uppercase animate-pulse">
                      Analyzing Resume...
                    </h3>
                    <p>Prepare for brutal feedback.</p>
                  </div>
                ) : (
                  <>
                    <UploadZone onFileAccepted={handleFileAccepted} />
                    {actionData?.error && (
                      <div className="mt-4 bg-red-500 text-white p-4 border-4 border-black shadow-neo font-bold text-center animate-bounce">
                        {actionData.error}
                      </div>
                    )}
                  </>
                )}
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                    <span className="w-4 h-8 bg-neo-secondary border-2 border-black" />
                    Recent Scans
                  </h3>
                  <Link
                    to="/resumes"
                    className="text-sm font-bold text-black uppercase hover:underline border-b-2 border-black"
                  >
                    View All
                  </Link>
                </div>

                <div className="bg-white border-4 border-black shadow-neo overflow-hidden">
                  {resumes.length > 0 ? (
                    resumes
                      .slice(0, 3)
                      .map((resume) => (
                        <ResumeCard key={resume.id} resume={resume} />
                      ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 font-bold">
                      No resumes scanned yet. Start your first scan!
                    </div>
                  )}
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
                  {latestResume && latestResume.feedback?.content?.tips ? (
                    latestResume.feedback.content.tips
                      .filter((t) => t.type === "improve")
                      .slice(0, 3)
                      .map((tipItem, i) => (
                        <div
                          key={i}
                          className="flex gap-3 p-3 bg-neo-bg border-2 border-black"
                        >
                          <div className="w-3 h-3 bg-neo-accent border-2 border-black mt-1.5 shrink-0" />
                          <p className="text-sm text-black font-bold leading-relaxed">
                            {tipItem.tip}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500 font-bold">
                      Scan a resume to get personalized tips.
                    </p>
                  )}
                </div>
                {latestResume ? (
                  <Link
                    to={`/resume/${latestResume.id}`}
                    className="w-full mt-6 py-3 block text-center bg-black text-white border-2 border-black hover:bg-white hover:text-black hover:shadow-neo-sm transition-all text-sm font-bold uppercase"
                  >
                    View Full Report
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full mt-6 py-3 bg-gray-300 text-gray-500 border-2 border-gray-400 cursor-not-allowed text-sm font-bold uppercase"
                  >
                    View Full Report
                  </button>
                )}
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
