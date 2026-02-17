import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFThumbnailProps {
  url: string;
}

/**
 * A lightweight, non-interactive PDF preview that renders just the first page.
 * Designed for use in cards/grids — no controls, no navigation.
 */
const PDFThumbnail = ({ url }: PDFThumbnailProps) => {
  return (
    <div className="w-full h-full overflow-hidden pointer-events-none">
      <Document file={url} loading="">
        <Page
          pageNumber={1}
          width={300}
          loading=""
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
    </div>
  );
};

export default PDFThumbnail;
