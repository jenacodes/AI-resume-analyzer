import { FileText, Star, Zap, TrendingUp } from "lucide-react";

export function StatsOverview() {
  const stats = [
    {
      label: "Total Scans",
      value: "24",
      icon: FileText,
      color: "text-white",
      bg: "bg-neo-primary",
    },
    {
      label: "Average Score",
      value: "78",
      icon: Star,
      color: "text-white",
      bg: "bg-neo-secondary",
    },
    {
      label: "Interviews",
      value: "12",
      icon: Zap,
      color: "text-black",
      bg: "bg-neo-accent",
    },
    {
      label: "Improvement",
      value: "+15%",
      icon: TrendingUp,
      color: "text-black",
      bg: "bg-green-400",
    },
  ];

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
