import { useEffect, useId, useState } from "react";

interface ScoreChartProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreChart({ score, label, size = "md" }: ScoreChartProps) {
  const [progress, setProgress] = useState(0);
  const uid = useId();
  const gradientId = `score-gradient-${uid.replace(/:/g, "")}`;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 500);
    return () => clearTimeout(timer);
  }, [score]);

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
        <div className="absolute inset-0 rounded-full blur-xl opacity-20 bg-neo-primary" />

        <svg
          width={sizes[size]}
          height={sizes[size]}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />{" "}
              {/* neo-primary: Electric Blue */}
              <stop offset="100%" stopColor="#db2777" />{" "}
              {/* neo-secondary: Hot Pink */}
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
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-neo-dark">{progress}%</span>
        </div>
      </div>
      <span className="text-sm font-bold text-neo-dark uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
