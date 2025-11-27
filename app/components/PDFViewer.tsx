import { FileText, Maximize2, Download } from "lucide-react";

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  return (
    <div className="h-full flex flex-col bg-slate-900/50 backdrop-blur-xl border-r border-white/10">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-slate-300">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Resume Preview</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-950/50 p-8 overflow-hidden">
        <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl border border-white/10 relative group">
          {/* Render PDF directly in an iframe */}
          <iframe
            src={url}
            className="w-full h-full rounded-lg"
            title="Resume PDF"
          />

          {/* Overlay for "Futuristic" feel when loading or empty */}
          <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-blue-500/5 to-purple-500/5 mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
}
