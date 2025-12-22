import { Link } from "react-router";
import { ArrowRight, Building2, Calendar } from "lucide-react";

interface ResumeGridCardProps {
  resume: Resume;
}

export function ResumeGridCard({ resume }: ResumeGridCardProps) {
  return (
    <Link
      to={`/resume/${resume.id}`}
      className="group relative bg-white border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 flex flex-col"
    >
      {/* Image Preview Section */}
      <div className="relative h-48 overflow-hidden bg-gray-200 border-b-4 border-black">
        <img
          src={resume.imagePath}
          alt={`${resume.jobTitle} Resume`}
          className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
        />

        {/* Score Badge */}
        <div className="absolute top-0 right-0 p-2 bg-black text-white font-black text-xl border-l-4 border-b-4 border-white">
          {resume.feedback.overallScore}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col bg-white">
        <div className="mb-4">
          <h3 className="text-xl font-black text-black uppercase mb-1 leading-tight group-hover:underline decoration-4 decoration-neo-primary underline-offset-4">
            {resume.jobTitle}
          </h3>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase">
            <Building2 className="w-4 h-4 text-black" />
            <span>{resume.companyName}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t-4 border-black">
          <div className="flex items-center gap-2 text-xs font-bold text-black uppercase">
            <Calendar className="w-4 h-4" />
            <span>{new Date(resume.dateUploaded).toLocaleDateString()}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-black text-white bg-black px-2 py-1 uppercase group-hover:bg-neo-primary transition-colors">
            View <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
