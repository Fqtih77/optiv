"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  hover = false,
  index = 0,
  animate = true,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  index?: number;
  animate?: boolean;
}) {
  const base = cn(
    "surface relative overflow-hidden rounded-3xl",
    hover && "transition-transform duration-500 hover:-translate-y-0.5",
    className
  );

  if (!animate) return <div className={base}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={base}
    >
      {children}
    </motion.div>
  );
}

export function PanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-6 pt-6 pb-4", className)}>
      <div className="min-w-0">
        <h3 className="display text-[19px] text-foreground">{title}</h3>
        {description && (
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PanelBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

/** Circular ↗ affordance from the reference dashboard. */
export function ArrowAction({
  href,
  onClick,
  label,
  dark = false,
  className,
}: {
  href?: string;
  onClick?: () => void;
  label?: string;
  dark?: boolean;
  className?: string;
}) {
  const cls = cn(
    "group inline-flex h-9 items-center gap-2 rounded-full border transition-all duration-300",
    label ? "px-3.5" : "w-9 justify-center",
    dark
      ? "border-transparent bg-primary text-primary-foreground hover:opacity-90"
      : "border-border bg-card text-muted-foreground hover:border-accent-soft hover:text-accent-fg",
    className
  );

  const inner = (
    <>
      {label && <span className="text-[12px] font-medium">{label}</span>}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={label ?? "Aç"}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls} aria-label={label ?? "Aç"}>
      {inner}
    </button>
  );
}

export function Chip({
  children,
  tone = "neutral",
  className,
  dot = false,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "gold" | "success" | "warning" | "danger";
  className?: string;
  dot?: boolean;
}) {
  const dotCls = {
    neutral: "bg-muted-foreground",
    accent: "dot-accent",
    gold: "dot-gold",
    success: "dot-success",
    warning: "dot-warning",
    danger: "dot-danger",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        `tone-${tone}`,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotCls)} />}
      {children}
    </span>
  );
}

export function MiniBar({
  value,
  max,
  tone = "accent",
  className,
}: {
  value: number;
  max: number;
  tone?: "accent" | "gold" | "success" | "warning" | "danger";
  className?: string;
}) {
  const pct = Math.max(2, Math.min(100, (value / (max || 1)) * 100));
  const fill = {
    accent: "dot-accent",
    gold: "dot-gold",
    success: "dot-success",
    warning: "dot-warning",
    danger: "dot-danger",
  }[tone];

  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn("h-full rounded-full", fill)}
      />
    </div>
  );
}
