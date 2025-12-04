import { Link } from "react-router";
import { ArrowRight, Building2, Calendar } from "lucide-react";

interface ResumeGridCardProps {
  resume: Resume;
}

export function ResumeGridCard({ resume }: ResumeGridCardProps) {
  return (
    <Link
      to={`/resume/${resume.id}`}
      className="group relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col"
    >
      {/* Image Preview Section */}
      <div className="relative h-48 overflow-hidden bg-slate-800">
        <img
          src={resume.imagePath}
          alt={`${resume.jobTitle} Resume`}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent" />

        {/* Score Badge */}
        <div className="absolute top-3 right-3">
          <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={
                  125.6 - (125.6 * resume.feedback.overallScore) / 100
                }
                className={`text-blue-500 transition-all duration-1000 ease-out ${
                  resume.feedback.overallScore >= 80
                    ? "text-green-500"
                    : resume.feedback.overallScore >= 60
                      ? "text-blue-500"
                      : "text-yellow-500"
                }`}
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">
              {resume.feedback.overallScore}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {resume.jobTitle}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>{resume.companyName}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(resume.dateUploaded).toLocaleDateString()}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
            View Analysis <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
