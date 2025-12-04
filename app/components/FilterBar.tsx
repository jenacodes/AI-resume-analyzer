import { Search, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FilterBar({ searchQuery, setSearchQuery }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search resumes by job title or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition">
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-medium">Filters</span>
      </button>
    </div>
  );
}
