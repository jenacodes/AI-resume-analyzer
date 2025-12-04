import { FileText, Star, Zap, TrendingUp } from "lucide-react";

export function StatsOverview() {
  const stats = [
    {
      label: "Total Scans",
      value: "24",
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Average Score",
      value: "78",
      icon: Star,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Interviews",
      value: "12",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Improvement",
      value: "+15%",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-900/50 border border-white/10 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition group"
        >
          <div
            className={`p-3 rounded-xl ${stat.bg} mb-3 group-hover:scale-110 transition-transform duration-300`}
          >
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <span className="text-2xl font-bold text-white mb-1">
            {stat.value}
          </span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
