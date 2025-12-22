import FeedbackSection from "./FeedbackSection";
import { ScoreChart } from "./ScoreChart";
import type { FeedbackItem } from "~/services/gemini.server";

interface AnalysisPanelProps {
  feedback: {
    overallScore: number;
    ATS: FeedbackItem;
    toneAndStyle: FeedbackItem;
    content: FeedbackItem;
    structure: FeedbackItem;
    skills: FeedbackItem;
  };
}

export function AnalysisPanel({ feedback }: AnalysisPanelProps) {
  if (!feedback || !feedback.overallScore) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <p>Analysis pending or unavailable.</p>
      </div>
    );
  }
  return (
    <div className="h-auto md:h-full md:overflow-y-auto p-4 md:p-8 space-y-8 bg-neo-bg">
      {/* Overall Score Header */}
      <div className="flex items-center justify-between border-b-4 border-black pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-2">
            Analysis Report
          </h1>
          <p className="text-black font-medium border-l-4 border-neo-accent pl-3">
            AI-generated insights for your resume
          </p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black text-black drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
            {feedback.overallScore}
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <div className="text-sm font-bold uppercase tracking-widest mt-2 bg-black text-white inline-block px-2 py-1">
            Overall Score
          </div>
        </div>
      </div>

      {/* Score Charts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border-4 border-black shadow-neo">
        <ScoreChart
          score={feedback.ATS.score}
          label="ATS Check"
          color="blue"
          size="sm"
        />
        <ScoreChart
          score={feedback.content.score}
          label="Content"
          color="purple"
          size="sm"
        />
        <ScoreChart
          score={feedback.structure.score}
          label="Structure"
          color="pink"
          size="sm"
        />
        <ScoreChart
          score={feedback.skills.score}
          label="Skills"
          color="green"
          size="sm"
        />
      </div>

      {/* Detailed Feedback Sections */}
      <div className="space-y-6">
        <FeedbackSection title="ATS Compatibility" data={feedback.ATS} />
        <FeedbackSection title="Content Quality" data={feedback.content} />
        <FeedbackSection
          title="Structure & Formatting"
          data={feedback.structure}
        />
        <FeedbackSection title="Skills Analysis" data={feedback.skills} />
      </div>
    </div>
  );
}
