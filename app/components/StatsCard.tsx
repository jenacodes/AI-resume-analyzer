import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "purple" | "green" | "pink";
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = "blue" }: StatsCardProps) {
  const colorStyles = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400",
    green: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    pink: "from-pink-500/20 to-pink-600/5 border-pink-500/20 text-pink-400",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-linear-to-br backdrop-blur-md p-6 ${colorStyles[color]}`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorStyles[color].split(" ").pop()}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/5 ${
            trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400"
          }`}>
            <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
            {trendValue}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {subtitle && <span className="text-sm text-slate-500">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
