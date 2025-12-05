import { FileText, Briefcase, Sparkles } from "lucide-react";
import { resumes } from "../../constants";

interface CoverLetterFormProps {
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function CoverLetterForm({
  selectedResumeId,
  setSelectedResumeId,
  jobDescription,
  setJobDescription,
  isGenerating,
  onGenerate,
}: CoverLetterFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Select Resume
        </label>
        <div className="relative">
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
          >
            <option value="" disabled>
              Choose a resume...
            </option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.jobTitle} - {resume.companyName}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={10}
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition resize-none"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !selectedResumeId || !jobDescription}
        className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 group"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Cover Letter
          </>
        )}
      </button>
    </div>
  );
}
