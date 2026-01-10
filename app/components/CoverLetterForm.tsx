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
        <label className="text-sm font-bold text-black uppercase flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Select Resume
        </label>
        <div className="relative">
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="w-full bg-white border-4 border-black p-3 text-black font-bold appearance-none focus:outline-none focus:shadow-neo transition-all"
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
          <div className="absolute right-4 top-4 pointer-events-none text-black">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-black uppercase flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={10}
          className="w-full bg-white border-4 border-black p-3 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all resize-none"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !selectedResumeId || !jobDescription}
        className="w-full py-4 bg-neo-primary border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo transition-all text-white font-black uppercase text-lg flex items-center justify-center gap-3 group"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-6 h-6 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            Generate Cover Letter
          </>
        )}
      </button>
    </div>
  );
}
