"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Sparkline } from "./sparkline";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  delta,
  deltaTone = "neutral",
  spark,
  sparkColor,
  accent = "neutral",
  index = 0,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  spark?: number[];
  sparkColor?: string;
  accent?: "neutral" | "accent" | "gold" | "success" | "danger";
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "surface group relative overflow-hidden rounded-3xl px-6 pt-5 pb-5 transition-transform duration-500 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{label}</p>
        {Icon && (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
              `tone-${accent}`
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
          </span>
        )}
      </div>

      <p className="display nums mt-4 text-[30px] text-foreground">{value}</p>

      <div className="mt-2 flex items-center gap-2">
        {delta && (
          <span
            className={cn(
              "nums inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10.5px] font-medium",
              deltaTone === "up" && "tone-success",
              deltaTone === "down" && "tone-danger",
              deltaTone === "neutral" && "tone-neutral"
            )}
          >
            {deltaTone === "up" && <ArrowUpRight className="h-2.5 w-2.5" />}
            {deltaTone === "down" && <ArrowDownRight className="h-2.5 w-2.5" />}
            {delta}
          </span>
        )}
        {hint && <span className="truncate text-[11.5px] text-muted-foreground">{hint}</span>}
      </div>

      {spark && (
        <div className="-mx-1 mt-4 opacity-80 transition-opacity duration-500 group-hover:opacity-100">
          <Sparkline data={spark} stroke={sparkColor} />
        </div>
      )}
    </motion.div>
  );
}
