"use client";

import { cn } from "@/lib/utils";

/**
 * Slow-drifting blurred gradient blobs. Sits behind content and keeps
 * both themes from reading as a flat wall of colour.
 */
export function BlobField({
  className,
  variant = "page",
}: {
  className?: string;
  variant?: "page" | "hero" | "quiet";
}) {
  const blobs =
    variant === "hero"
      ? [
          { c: "var(--blob-1)", s: "min(78vw,820px)", top: "-18%", left: "42%", d: "0s", dur: "30s" },
          { c: "var(--blob-2)", s: "min(58vw,620px)", top: "34%", left: "-8%", d: "-8s", dur: "36s" },
          { c: "var(--blob-3)", s: "min(46vw,480px)", top: "58%", left: "68%", d: "-16s", dur: "42s" },
        ]
      : variant === "quiet"
        ? [
            { c: "var(--blob-2)", s: "min(52vw,560px)", top: "-16%", left: "62%", d: "0s", dur: "40s" },
            { c: "var(--blob-1)", s: "min(44vw,460px)", top: "52%", left: "-10%", d: "-14s", dur: "46s" },
          ]
        : [
            { c: "var(--blob-1)", s: "min(52vw,640px)", top: "-22%", left: "-6%", d: "0s", dur: "34s" },
            { c: "var(--blob-2)", s: "min(46vw,560px)", top: "8%", left: "68%", d: "-10s", dur: "40s" },
            { c: "var(--blob-3)", s: "min(38vw,420px)", top: "68%", left: "30%", d: "-20s", dur: "48s" },
          ];

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {blobs.map((b, i) => (
        <span
          key={i}
          className="animate-blob absolute rounded-full blur-[90px]"
          style={{
            width: b.s,
            height: b.s,
            top: b.top,
            left: b.left,
            background: `radial-gradient(closest-side, ${b.c}, transparent 72%)`,
            animationDelay: b.d,
            animationDuration: b.dur,
          }}
        />
      ))}
    </div>
  );
}
