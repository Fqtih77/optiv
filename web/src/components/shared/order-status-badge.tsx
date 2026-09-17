import type { OrderStatus } from "@/lib/types";
import { Chip } from "./surface";

const meta: Record<
  OrderStatus,
  { tr: string; en: string; tone: "warning" | "success" | "neutral" }
> = {
  PENDING: { tr: "Beklemede", en: "Pending", tone: "warning" },
  APPROVED: { tr: "Onaylandı", en: "Approved", tone: "success" },
  CANCELLED: { tr: "İptal", en: "Cancelled", tone: "neutral" },
};

export function OrderStatusBadge({
  status,
  lang = "tr",
  className,
}: {
  status: OrderStatus;
  lang?: "tr" | "en";
  className?: string;
}) {
  const m = meta[status];
  return (
    <Chip tone={m.tone} dot className={className}>
      {lang === "tr" ? m.tr : m.en}
    </Chip>
  );
}
