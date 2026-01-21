import { FileText, Star, Zap, TrendingUp } from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border-4 border-black shadow-neo p-5 flex flex-col items-center text-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 group"
        >
          <div
            className={`p-3 border-2 border-black shadow-neo-sm ${stat.bg} mb-3 group-hover:scale-110 transition-transform duration-300`}
          >
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <span className="text-3xl font-black text-black mb-1">
            {stat.value}
          </span>
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
