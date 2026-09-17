import { getStockStatus } from "@/lib/stock-status";
import { Chip } from "./surface";

const meta = {
  STOKTA: { tr: "Stokta", en: "In stock", tone: "success" },
  AZALIYOR: { tr: "Azalıyor", en: "Low", tone: "warning" },
  KRITIK: { tr: "Kritik", en: "Critical", tone: "danger" },
  TUKENDI: { tr: "Tükendi", en: "Out of stock", tone: "danger" },
} as const;

export function StockBadge({
  remaining,
  lang = "tr",
  className,
}: {
  remaining: number;
  lang?: "tr" | "en";
  className?: string;
}) {
  const m = meta[getStockStatus(remaining)];
  return (
    <Chip tone={m.tone} dot className={className}>
      {lang === "tr" ? m.tr : m.en}
    </Chip>
  );
}
