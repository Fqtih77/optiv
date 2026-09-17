import type { Payment } from "./types";

const monthLabelsTr = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const monthLabelsEn = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export interface MonthlyBucket {
  year: number;
  month: number;
  label: string;
  total: number;
}

/**
 * Fills every month in the window with 0 when no payment exists —
 * mirrors the SEQUENCE/LET calendar-fill logic from the original
 * spreadsheet so a skipped month never disappears from the report.
 */
export function getMonthlySummary(
  payments: Payment[],
  opts: { customerId?: string; monthsBack?: number; lang?: "tr" | "en" } = {}
): MonthlyBucket[] {
  const { customerId, monthsBack = 8, lang = "tr" } = opts;
  const labels = lang === "tr" ? monthLabelsTr : monthLabelsEn;
  const scoped = customerId ? payments.filter((p) => p.customerId === customerId) : payments;

  const now = new Date();
  const buckets: MonthlyBucket[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const total = scoped
      .filter((p) => {
        const pd = new Date(p.date);
        return pd.getFullYear() === year && pd.getMonth() === month;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    buckets.push({ year, month, label: `${labels[month]} ${year}`, total });
  }

  return buckets;
}
