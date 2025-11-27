import { useState } from "react";
import { ChevronDown, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

const FeedbackSection = ({
  title,
  data,
}: {
  title: string;
  data: FeedbackItem;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-8 rounded-full ${
              data.score >= 80
                ? "bg-emerald-500"
                : data.score >= 60
                  ? "bg-yellow-500"
                  : "bg-rose-500"
            }`}
          />
          <span className="font-semibold text-white text-lg">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`font-bold ${
              data.score >= 80
                ? "text-emerald-400"
                : data.score >= 60
                  ? "text-yellow-400"
                  : "text-rose-400"
            }`}
          >
            {data.score}/100
          </span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {data.tips.length === 0 ? (
            <div className="p-4 text-center text-slate-500 italic">
              No specific feedback available.
            </div>
          ) : (
            data.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/5">
                {tip.type === "good" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-slate-200 font-medium">{tip.tip}</p>
                  {tip.explanation && (
                    <p className="text-sm text-slate-400 mt-1">
                      {tip.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;
