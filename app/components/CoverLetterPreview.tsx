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
    <div className="h-full flex flex-col bg-white border-4 border-black shadow-neo overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        {content ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none outline-none text-base leading-relaxed font-serif bg-transparent text-black"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 italic font-bold">
            Your generated cover letter will appear here...
          </div>
        )}
      </div>

      <div className="bg-neo-bg p-4 border-t-4 border-black flex justify-end gap-3">
        <button
          onClick={handleCopy}
          disabled={!content}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo-sm transition-all text-black font-bold uppercase text-sm"
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
          className="flex items-center gap-2 px-4 py-2 bg-black border-2 border-black text-white hover:bg-neo-primary hover:text-white hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase text-sm shadow-neo-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}
