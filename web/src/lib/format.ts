export function formatTRY(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact && Math.abs(n) >= 1000) {
    return `${(n / 1000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}B ₺`;
  }
  return `${n.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺`;
}

export function formatNumber(n: number) {
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function relativeTime(value: string, lang: "tr" | "en" = "tr") {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return lang === "tr" ? "şimdi" : "now";
  if (mins < 60) return lang === "tr" ? `${mins} dk önce` : `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return lang === "tr" ? `${hours} sa önce` : `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return lang === "tr" ? `${days} gün önce` : `${days}d ago`;
  return formatDate(value);
}
