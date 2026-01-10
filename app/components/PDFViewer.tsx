import { FileText, Maximize2, Download } from "lucide-react";

interface PDFViewerProps {
  url: string;
}

const PDFViewer = ({ url }: PDFViewerProps) => {
  return (
    <div className="h-full flex flex-col bg-white border-4 border-black shadow-neo">
      <div className="flex items-center justify-between p-4 border-b-4 border-black bg-neo-bg">
        <div className="flex items-center gap-2 text-black">
          <div className="p-1 bg-neo-primary border-2 border-black shadow-neo-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black uppercase tracking-wide">
            Resume Preview
          </span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all text-black">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all text-black">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-100 p-8 overflow-hidden">
        <div className="w-full h-full border-4 border-black shadow-neo relative group bg-white">
          {/* Render PDF directly in an iframe */}
          <iframe src={url} className="w-full h-full" title="Resume PDF" />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
