/** Chart palette bound to the theme tokens, so charts flip with the theme. */
export const chartColors = {
  accent: "var(--accent-fg)",
  gold: "var(--gold-fg)",
  goldSoft: "var(--gold-fg)",
  blue: "var(--accent-fg)",
  blueSoft: "var(--chart-4)",
  white: "var(--foreground)",
  emerald: "var(--success-fg)",
  red: "var(--danger-fg)",
  grid: "var(--border)",
  axis: "var(--muted-foreground)",
  dim: "var(--muted)",
};

export const chartTooltip = {
  contentStyle: {
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--popover)",
    fontSize: 12,
    color: "var(--popover-foreground)",
    boxShadow: "var(--shadow-3)",
    padding: "10px 12px",
  },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11, marginBottom: 4 },
  itemStyle: { color: "var(--popover-foreground)" },
} as const;
