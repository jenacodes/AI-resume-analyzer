import { Search, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FilterBar({ searchQuery, setSearchQuery }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
        <input
          type="text"
          placeholder="Search resumes by job title or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-4 border-black p-3 pl-10 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
        />
      </div>
      <button className="flex items-center gap-2 px-6 py-3 bg-white border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-black font-bold uppercase">
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-bold">Filters</span>
      </button>
    </div>
  );
}
