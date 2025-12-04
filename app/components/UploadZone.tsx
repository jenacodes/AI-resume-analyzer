import { Upload, FileText, Sparkles } from "lucide-react";

export function UploadZone() {
  return (
    <div className="relative group cursor-pointer">
      {/* Animated glowing border effect */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
      
      <div className="relative flex flex-col items-center justify-center w-full h-64 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:bg-slate-900/80 transition-all p-8 text-center overflow-hidden">
        
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Upload className="w-8 h-8 text-blue-400 group-hover:text-white transition-colors" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">
              Upload your Resume
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Drag & drop your PDF here, or click to browse.
              <br />
              <span className="text-blue-400/80 text-xs mt-1 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Analysis Ready
              </span>
            </p>
          </div>
        </div>

        {/* Floating particles/icons decoration */}
        <FileText className="absolute top-10 left-10 w-6 h-6 text-white/5 -rotate-12 group-hover:text-white/10 transition-all duration-500" />
        <FileText className="absolute bottom-10 right-10 w-8 h-8 text-white/5 rotate-12 group-hover:text-white/10 transition-all duration-500" />
      </div>
    </div>
  );
}
