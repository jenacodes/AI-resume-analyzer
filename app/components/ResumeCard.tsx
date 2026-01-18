import { Link } from "react-router";
import type { Resume } from "@prisma/client";
import type { AnalysisResult } from "~/services/gemini.server";

// Define the type expected by the component (Prisma Resume + parsed feedback)
interface ResumeWithFeedback extends Resume {
  feedback: AnalysisResult | null;
}

const ResumeCard = ({ resume }: { resume: ResumeWithFeedback }) => {
  return (
    <Link to={`/resume/${resume.id}`}>
      <div
        key={resume.id}
        className="flex items-center justify-between p-4 border-b-4 border-black last:border-0 hover:bg-neo-accent transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-2 border-black bg-neo-primary flex items-center justify-center shadow-neo-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2
              className="text-black font-black uppercase text-lg leading-tight truncate max-w-[200px]"
              title={resume.name}
            >
              {resume.name}
            </h2>
            <h4 className="font-bold text-gray-700 group-hover:text-black transition text-sm">
              {resume.title} {resume.company ? `@ ${resume.company}` : ""}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            {resume.feedback ? (
              <>
                <span className="block text-xl font-black text-black">
                  {resume.feedback.overallScore}%
                </span>
                <span className="text-xs font-bold text-gray-600 uppercase">
                  Match Score
                </span>
              </>
            ) : (
              <>
                <span className="block text-sm font-black text-black animate-pulse">
                  {resume.status === "FAILED" ? "FAILED" : "ANALYZING..."}
                </span>
                <span className="text-xs font-bold text-gray-600 uppercase">
                  Status
                </span>
              </>
            )}
          </div>
          <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shadow-neo-sm">
            →
          </div>
        </div>
      </div>
    </Link>
  );
};

// Helper component for the recent scans list
function FileText({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

export default ResumeCard;
