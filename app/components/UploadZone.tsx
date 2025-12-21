import { Upload, FileText, Sparkles } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function UploadZone({ name }: { name?: string }) {
  // 1. Track the selected file
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    // 1. Handling the Rejections First
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
    }
  }, []);

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
      {/* Animated glowing border effect */}
      <div
        className={`absolute -inset-0.5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-gradient-xy ${
          isDragActive ? "opacity-100" : ""
        }`}
      ></div>

      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full h-64 rounded-2xl bg-slate-900/90 backdrop-blur-xl border transition-all p-8 text-center overflow-hidden outline-none ${
          isDragReject
            ? "border-red-500 bg-red-500/10"
            : isDragActive
              ? "border-blue-500 bg-slate-900/95"
              : "border-white/10 hover:bg-slate-900/80"
        }`}
      >
        <input {...getInputProps({ name })} />

        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          {file ? (
            // State: File Selected
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <FileText className="w-8 h-8 text-green-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-white">
                  {file.name}
                </h3>
                <p className="text-slate-400 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <p className="text-blue-400 text-sm hover:underline mt-2">
                Click or drag to replace
              </p>
            </>
          ) : (
            // State: No File (Default)
            <>
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Upload
                  className={`w-8 h-8 text-blue-400 transition-colors ${
                    isDragActive
                      ? "text-white scale-110"
                      : "group-hover:text-white"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">
                  {isDragActive ? "Drop it here!" : "Upload your Resume"}
                </h3>
                {error ? (
                  <p className="text-red-400 text-sm font-medium animate-pulse">
                    {error}
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Drag & drop your PDF here, or click to browse.
                    <br />
                    <span className="text-blue-400/80 text-xs mt-1 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Analysis Ready
                    </span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Floating particles/icons decoration */}
        {!file && (
          <>
            <FileText className="absolute top-10 left-10 w-6 h-6 text-white/5 -rotate-12 group-hover:text-white/10 transition-all duration-500" />
            <FileText className="absolute bottom-10 right-10 w-8 h-8 text-white/5 rotate-12 group-hover:text-white/10 transition-all duration-500" />
          </>
        )}
      </div>
    </div>
  );
}
