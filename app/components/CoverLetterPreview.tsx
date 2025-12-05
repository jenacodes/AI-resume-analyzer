import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";

interface CoverLetterPreviewProps {
  content: string;
  setContent: (content: string) => void;
}

export function CoverLetterPreview({
  content,
  setContent,
}: CoverLetterPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex-1 p-8 overflow-y-auto">
        {content ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none outline-none text-base leading-relaxed font-serif bg-transparent"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 italic">
            Your generated cover letter will appear here...
          </div>
        )}
      </div>

      <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end gap-3">
        <button
          onClick={handleCopy}
          disabled={!content}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Text
            </>
          )}
        </button>
        <button
          disabled={!content}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}
