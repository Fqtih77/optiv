import type { StockStatus } from "./types";

export function getStockStatus(remaining: number): StockStatus {
  if (remaining >= 100) return "STOKTA";
  if (remaining >= 50) return "AZALIYOR";
  if (remaining >= 1) return "KRITIK";
  return "TUKENDI";
}

export const stockStatusMeta: Record<
  StockStatus,
  { label: string; labelEn: string; className: string }
> = {
  STOKTA: {
    label: "Stokta",
    labelEn: "In Stock",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  AZALIYOR: {
    label: "Yeniden Alım Gerekli",
    labelEn: "Reorder Suggested",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  KRITIK: {
    label: "Kritik Seviye",
    labelEn: "Critical Level",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  TUKENDI: {
    label: "Tükendi",
    labelEn: "Out of Stock",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};
