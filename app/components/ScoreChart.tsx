import { useEffect, useState } from "react";

interface ScoreChartProps {
  score: number;
  label: string;
  color?: "blue" | "purple" | "green" | "pink";
  size?: "sm" | "md" | "lg";
}

export function ScoreChart({
  score,
  label,
  color = "blue",
  size = "md",
}: ScoreChartProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 500);
    return () => clearTimeout(timer);
  }, [score]);

  const colors = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    green: "text-emerald-500",
    pink: "text-pink-500",
  };

  const sizes = {
    sm: 80,
    md: 120,
    lg: 160,
  };

  const strokeWidth = size === "sm" ? 6 : 8;
  const radius = (sizes[size] - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        {/* Glowing background effect */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-20 ${colors[color].replace("text-", "bg-")}`}
        />

        <svg
          width={sizes[size]}
          height={sizes[size]}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" /> {/* Tailwind blue-500 */}
              <stop offset="100%" stopColor="#9333ea" />{" "}
              {/* Tailwind purple-500 */}
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={radius}
            className="stroke-white/10 fill-none"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle with gradient */}
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-2xl font-bold text-white`}>{progress}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-400">{label}</span>
    </div>
  );
}
