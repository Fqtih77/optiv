import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  className,
  stroke = "var(--accent-fg)",
  fill = true,
}: {
  data: number[];
  className?: string;
  stroke?: string;
  fill?: boolean;
}) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const id = `spark-${Math.abs(
    data.reduce((acc, v, i) => acc + v * (i + 1), 0) % 99991
  )}-${stroke.replace(/[^a-z0-9]/gi, "")}`;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 30 - ((v - min) / range) * 24 - 3,
  }));

  const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area = `0,30 ${line} 100,30`;

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn("h-9 w-full", className)}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <polygon points={area} fill={`url(#${id})`} />}
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
