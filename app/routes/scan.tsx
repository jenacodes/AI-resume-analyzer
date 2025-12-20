import type { Route } from "./+types/scan";
import { Sidebar } from "../components/Sidebar";
import { UploadZone } from "../components/UploadZone";
import { ArrowLeft, Sparkles, Briefcase, FileText } from "lucide-react";
import {
  Link,
  redirect,
  Form,
  useNavigation,
  useActionData,
} from "react-router";
import Navbar from "~/components/Navbar";
import AmbientBackground from "~/components/AmbientBackground";
import { getSession } from "~/sessions";
import { db } from "~/db.server";
import { uploadFile } from "~/services/storage.server";
import { extractTextFromPdf } from "~/services/pdf.server";
import { analyzeResume } from "~/services/gemini.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  // 1. Authenticate
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) throw redirect("/login");

  // 2. Get Data
  const formData = await request.formData();
  const file = formData.get("resume") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // 3. Validate
  if (!file || file.size === 0) {
    return { error: "Please upload a resume PDF." };
  }

  try {
    // 4. Save File
    const filePath = await uploadFile(file);

    // 5. Extract Text from PDF
    const resumeText = await extractTextFromPdf(filePath);

    // 6. Analyze with Gemini AI
    const analysisResult = await analyzeResume(resumeText, title, description);

    // 7. Create DB Record
    const resume = await db.resume.create({
      data: {
        userId,
        title: title || "Untitled Resume",
        filePath,
        analysisJson: JSON.stringify(analysisResult),
        company: "AI Analyzed", // We could extract this too, but for now static
      },
    });

    // 8. Redirect to the results page
    return redirect(`/resume/${resume.id}`);
  } catch (error: any) {
    console.error("Scan failed:", error.message);
    return { error: error.message || "Something went wrong during analysis." };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New Scan - ResumeAI" },
    { name: "description", content: "Upload your resume for AI analysis" },
  ];
}

export default function NewScan() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex">
        <Sidebar />

        <main className="flex-1 md:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          <AmbientBackground />

          <header className="h-20 md:border border-white/10 md:bg-slate-900/50 backdrop-blur-md flex items-center px-8 shrink-0 z-10 mt-7">
            <Link
              to="/"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition mr-4 hidden lg:block"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="p-2">
              <h1 className="text-xl font-bold text-white">New Resume Scan</h1>
              <p className="text-sm text-slate-400">
                Upload a resume and job details for personalized AI feedback
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* We wrap everything in a Form to send it to the server */}
              <Form
                method="post"
                encType="multipart/form-data"
                className="space-y-8"
              >
                {/* Error Message Display */}
                {actionData?.error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {actionData.error}
                  </div>
                )}

                <section className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-300">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                      1
                    </span>
                    Upload Resume
                  </h2>
                  <div className="h-64">
                    {/* IMPORTANT: We give it a name so the server can find it! */}
                    <UploadZone name="resume" />
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-purple-300">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      2
                    </span>
                    Job Details
                  </h2>

                  <div className="grid gap-6 p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-sm">
                    <div className="space-y-2">
                      <label
                        htmlFor="jobTitle"
                        className="text-sm font-medium text-slate-300 flex items-center gap-2"
                      >
                        <Briefcase className="w-4 h-4" />
                        Target Job Title
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="title" // Added name
                        placeholder="e.g. Senior Frontend Developer"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="jobDesc"
                        className="text-sm font-medium text-slate-300 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Job Description (Optional)
                      </label>
                      <div className="relative">
                        <textarea
                          id="jobDesc"
                          name="description" // Added name
                          rows={6}
                          placeholder="Paste the job description here to get tailored feedback..."
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition resize-none"
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-600">
                          0/5000
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Analyzing..."
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        Analyze Resume
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4">
                    Powered by Gemini 1.5 Pro • Takes ~30 seconds
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
