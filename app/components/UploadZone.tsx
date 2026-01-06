import { Upload, FileText, Sparkles } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function UploadZone({
  name,
  onFileAccepted,
}: {
  name?: string;
  onFileAccepted?: (file: File) => void;
}) {
  // 1. Track the selected file

  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      // . Handling the Rejections First
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const code = rejection.errors[0].code;

        if (code === "file-invalid-type") {
          setError("Only PDF files are allowed.");
        } else {
          setError("Something went wrong with that file.");
        }
        return;
      }

      // 2. Handling Success
      // Check if any files were dropped
      if (acceptedFiles.length > 0) {
        // I only want the first file (set maxFiles: 1)
        const selectedFile = acceptedFiles[0];
        console.log(selectedFile); // <-
        // Do something with the file
        setFile(selectedFile);
        // Clear any previous errors
        setError(null);
        console.log("File dropped:", selectedFile.name);

        // Trigger callback if provided
        if (onFileAccepted) {
          onFileAccepted(selectedFile);
        }
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"], // Only accept PDFs
      },
      maxFiles: 1, // Only allow one file at a time
    });

  return (
    <div className="relative group cursor-pointer">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full h-64 bg-white border-4 border-black shadow-neo transition-all duration-200 p-8 text-center overflow-hidden outline-none ${
          isDragReject
            ? "bg-red-100"
            : isDragActive
              ? "bg-blue-100 translate-x-[4px] translate-y-[4px] shadow-none"
              : "hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
        }`}
      >
        <input {...getInputProps({ name })} />

        <div className="relative z-10 flex flex-col items-center gap-4">
          {file ? (
            // State: File Selected
            <>
              <div className="w-16 h-16 bg-green-400 flex items-center justify-center border-4 border-black shadow-neo-sm">
                <FileText className="w-8 h-8 text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-black uppercase">
                  {file.name}
                </h3>
                <p className="text-black font-mono text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <p className="text-blue-600 font-bold text-sm hover:underline mt-2 uppercase">
                Click to replace
              </p>
            </>
          ) : (
            // State: No File (Default)
            <>
              <div className="w-16 h-16 bg-neo-primary flex items-center justify-center border-4 border-black shadow-neo-sm group-hover:scale-110 transition-transform duration-200">
                <Upload className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                  {isDragActive ? "Drop it!" : "Upload Resume"}
                </h3>
                {error ? (
                  <div className="inline-block bg-red-500 text-white px-3 py-1 font-bold border-2 border-black shadow-neo-sm">
                    {error}
                  </div>
                ) : (
                  <div className="text-black font-medium text-sm max-w-xs mx-auto space-y-1">
                    <p>Drag & drop PDF or click to browse.</p>
                    <div className="flex items-center justify-center gap-1 text-xs font-bold bg-neo-accent text-black px-2 py-0.5 border-2 border-black transform -rotate-2">
                      <Sparkles className="w-3 h-3" /> AI READY
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
