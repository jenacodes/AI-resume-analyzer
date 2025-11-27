import { resume } from "react-dom/server";
import { Link } from "react-router";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  return (
    <Link to={`/resume/${resume.id}`}>
      <div
        key={resume.id}
        className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white font-bold wrap-break-word">
              {resume.companyName}
            </h2>
            <h4 className="font-light text-white group-hover:text-blue-300 transition">
              {resume.jobTitle}
            </h4>
            <p className="text-xs text-slate-500"></p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-sm font-bold text-emerald-400">
              {resume.feedback.overallScore}%
            </span>
            <span className="text-xs text-slate-500">Match Score</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
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
