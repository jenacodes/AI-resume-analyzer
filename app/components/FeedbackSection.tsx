import { useState } from "react";
import { ChevronDown, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import type { FeedbackItem } from "~/services/gemini.server";

const FeedbackSection = ({
  title,
  data,
}: {
  title: string;
  data: FeedbackItem;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-4 border-black bg-white shadow-neo transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-neo-accent transition-colors border-b-2 border-transparent hover:border-black"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-8 border-2 border-black ${
              data.score >= 80
                ? "bg-green-500"
                : data.score >= 60
                  ? "bg-yellow-400"
                  : "bg-red-500"
            }`}
          />
          <span className="font-black text-black text-lg uppercase tracking-tight">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`font-black text-xl ${
              data.score >= 80
                ? "text-green-600"
                : data.score >= 60
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {data.score}/100
          </span>
          <div
            className={`border-2 border-black p-1 bg-white transition-transform duration-200 ${isOpen ? "rotate-180 bg-black text-white" : ""}`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t-4 border-black space-y-3 bg-white animate-in slide-in-from-top-2">
          {data.tips.length === 0 ? (
            <div className="p-4 text-center text-gray-500 italic font-mono border-2 border-dashed border-gray-300">
              No specific feedback available.
            </div>
          ) : (
            data.tips.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 p-4 border-2 border-black bg-neo-bg shadow-neo-sm"
              >
                {tip.type === "good" ? (
                  <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5 fill-green-100" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5 fill-red-100" />
                )}
                <div>
                  <p className="text-black font-bold text-lg">{tip.tip}</p>
                  {tip.explanation && (
                    <p className="text-sm text-gray-700 mt-1 font-medium border-l-2 border-black pl-2">
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
