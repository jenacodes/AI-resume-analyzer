import { useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
}

const PDFViewer = ({ url }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      containerRef.current = node;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      observer.observe(node);
      // Set initial width
      setContainerWidth(node.clientWidth);
      return () => observer.disconnect();
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  };

  const onDocumentLoadError = () => {
    setLoading(false);
    setError(true);
  };

  const goToPrevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));

  // Calculate page width with padding
  const pageWidth = containerWidth ? containerWidth - 32 : undefined;

  return (
    <div className="h-full flex flex-col bg-white border-4 border-black shadow-neo">
      {/* Header */}
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
          <a
            href={url}
            download
            className="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all text-black"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* PDF Content */}
      <div
        ref={onContainerRef}
        className="flex-1 relative bg-gray-100 overflow-auto"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-neo-primary" />
              <span className="text-sm font-black uppercase tracking-wide text-gray-600">
                Loading PDF...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center p-6">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="font-black text-sm uppercase mb-2">
                Failed to load PDF
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-black text-white font-bold text-xs uppercase border-2 border-black hover:bg-white hover:text-black transition-all"
              >
                Open PDF instead
              </a>
            </div>
          </div>
        )}

        <div className="flex justify-center p-4">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
          >
            {pageWidth && (
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                loading=""
                className="border-4 border-black shadow-neo"
              />
            )}
          </Document>
        </div>
      </div>

      {/* Page Navigation Footer */}
      {numPages > 0 && (
        <div className="flex items-center justify-center gap-3 p-3 border-t-4 border-black bg-white">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-1.5 bg-white border-2 border-black shadow-neo-sm hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all text-black disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-black uppercase tracking-wide min-w-[80px] text-center">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-1.5 bg-white border-2 border-black shadow-neo-sm hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all text-black disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
