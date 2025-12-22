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

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}: StatsCardProps) {
  const colorStyles = {
    blue: "bg-neo-primary text-white",
    purple: "bg-neo-secondary text-white",
    green: "bg-green-500 text-black",
    pink: "bg-neo-accent text-black",
  };

  return (
    <div className="relative overflow-hidden bg-white border-4 border-black shadow-neo p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 border-2 border-black shadow-neo-sm ${colorStyles[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 border-2 border-black ${
              trend === "up"
                ? "bg-green-400 text-black"
                : trend === "down"
                  ? "bg-red-400 text-black"
                  : "bg-gray-200 text-black"
            }`}
          >
            <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
            {trendValue}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-black font-bold uppercase text-sm mb-1 tracking-wide">
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-black">{value}</span>
          {subtitle && (
            <span className="text-sm font-bold text-gray-600">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
