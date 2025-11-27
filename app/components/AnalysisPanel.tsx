import FeedbackSection from "./FeedbackSection";
import { ScoreChart } from "./ScoreChart";

interface FeedbackItem {
  score: number;
  tips: { type: "good" | "improve"; tip: string; explanation?: string }[];
}

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
  return (
    <div className="h-auto md:h-full md:overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-950/50">
      {/* Overall Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Analysis Report
          </h1>
          <p className="text-slate-400">
            AI-generated insights for your resume
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
            {feedback.overallScore}/100
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Overall Score
          </div>
        </div>
      </div>

      {/* Score Charts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
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
      <div className="space-y-4">
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
