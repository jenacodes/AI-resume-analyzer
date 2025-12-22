import type { Route } from "./+types/scan";
import { Sidebar } from "../components/Sidebar";
import { UploadZone } from "../components/UploadZone";
import { ArrowLeft } from "lucide-react";
import {
  Link,
  redirect,
  Form,
  useNavigation,
  useActionData,
} from "react-router";
import Navbar from "~/components/Navbar";
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
        company: "AI Analyzed",
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
    <div className="flex h-screen bg-neo-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">
                Scan Resume
              </h1>
              <p className="text-lg text-black font-medium border-l-4 border-neo-primary pl-4">
                Upload your resume to get instant, brutal feedback.
              </p>
            </div>

            <Form
              method="post"
              encType="multipart/form-data"
              className="space-y-8"
            >
              <div className="bg-white border-4 border-black shadow-neo p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="block text-lg font-bold text-black uppercase"
                  >
                    Resume Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full bg-white border-4 border-black p-4 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-lg font-bold text-black uppercase"
                  >
                    Job Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    placeholder="Paste the job description here for targeted analysis..."
                    className="w-full bg-white border-4 border-black p-4 text-black font-medium placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-lg font-bold text-black uppercase">
                    Upload PDF
                  </label>
                  <UploadZone name="resume" />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-neo-primary text-white text-xl font-black uppercase py-4 border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Analyzing..." : "Start Analysis"}
                  </button>
                </div>
              </div>
            </Form>

            {actionData?.error && (
              <div className="bg-red-500 text-white p-4 border-4 border-black shadow-neo font-bold text-center animate-bounce">
                {actionData.error}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
