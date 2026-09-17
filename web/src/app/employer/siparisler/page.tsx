"use client";

import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, ChevronDown, ClipboardList, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Panel, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { Segmented } from "@/components/shared/segmented";
import { EmptyState } from "@/components/shared/empty-state";
import { LensSwatch } from "@/components/shared/lens-swatch";
import { StatCard } from "@/components/shared/stat-card";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { formatDateTime, formatTRY, initials } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

type Filter = "ALL" | OrderStatus;

export default function EmployerOrdersPage() {
  const { t, lang } = useT();
  const orders = useCommerceStore((s) => s.orders);
  const customers = useCommerceStore((s) => s.customers);
  const products = useCommerceStore((s) => s.products);
  const approveOrder = useCommerceStore((s) => s.approveOrder);
  const cancelOrder = useCommerceStore((s) => s.cancelOrder);

  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? id;
  const customerColor = (id: string) => customers.find((c) => c.id === id)?.avatarColor ?? "#092040";

  const sorted = useMemo(
    () => [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [orders]
  );

  const counts = {
    ALL: sorted.length,
    PENDING: sorted.filter((o) => o.status === "PENDING").length,
    APPROVED: sorted.filter((o) => o.status === "APPROVED").length,
    CANCELLED: sorted.filter((o) => o.status === "CANCELLED").length,
  };

  const visible = sorted
    .filter((o) => filter === "ALL" || o.status === filter)
    .filter((o) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        customerName(o.customerId).toLowerCase().includes(q) ||
        o.items.some((i) =>
          (products.find((p) => p.id === i.productId)?.name ?? "").toLowerCase().includes(q)
        )
      );
    });

  const pendingTotal = sorted
    .filter((o) => o.status === "PENDING")
    .reduce((s, o) => s + o.total, 0);
  const approvedTotal = sorted
    .filter((o) => o.status === "APPROVED")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Operasyon" : "Operations"}
        title={lang === "tr" ? "Siparişler" : "Orders"}
        description={
          lang === "tr"
            ? "Onayladığın anda ilgili camlar kalan stoktan düşülür ve tutar bayinin cari hesabına borç yazılır."
            : "On approval, lenses are deducted from remaining stock and the amount is charged to the dealer."
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <StatCard
          index={0}
          label={lang === "tr" ? "Bekleyen Sipariş" : "Pending Orders"}
          value={String(counts.PENDING)}
          icon={ClipboardList}
          accent="gold"
          hint={`${formatTRY(pendingTotal)} ${lang === "tr" ? "toplam" : "total"}`}
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Onaylanan Sipariş" : "Approved Orders"}
          value={String(counts.APPROVED)}
          icon={Check}
          accent="success"
          hint={`${formatTRY(approvedTotal, { compact: true })} ${lang === "tr" ? "ciro" : "revenue"}`}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "İptal Edilen" : "Cancelled"}
          value={String(counts.CANCELLED)}
          icon={X}
          hint={lang === "tr" ? "stok etkilenmedi" : "stock untouched"}
        />
      </div>

      <div className="mt-3.5 mb-3.5 flex flex-wrap items-center gap-2.5">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "ALL", label: lang === "tr" ? "Tümü" : "All", count: counts.ALL },
            { value: "PENDING", label: t("common.pending"), count: counts.PENDING },
            { value: "APPROVED", label: t("common.approved"), count: counts.APPROVED },
            { value: "CANCELLED", label: t("common.cancelled"), count: counts.CANCELLED },
          ]}
        />
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "tr" ? "Bayi veya ürün ara" : "Search dealer or product"}
            className="h-9 pl-9"
          />
        </div>
      </div>

      <Panel>
        {visible.length === 0 ? (
          <EmptyState icon={ClipboardList} title={lang === "tr" ? "Sipariş bulunamadı" : "No orders found"} />
        ) : (
          <DataTable>
            <THead>
              <Th className="w-10" />
              <Th>{lang === "tr" ? "Bayi" : "Dealer"}</Th>
              <Th>{lang === "tr" ? "Tarih" : "Date"}</Th>
              <Th>{lang === "tr" ? "Ürünler" : "Items"}</Th>
              <Th align="right">{lang === "tr" ? "Adet" : "Units"}</Th>
              <Th align="right">{t("common.total")}</Th>
              <Th align="center">{t("common.status")}</Th>
              <Th align="right">{t("common.actions")}</Th>
            </THead>
            <TBody>
              {visible.map((o) => {
                const isOpen = expanded === o.id;
                return (
                  <Fragment key={o.id}>
                    <Tr onClick={() => setExpanded(isOpen ? null : o.id)}>
                      <Td>
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold text-white"
                            style={{ backgroundColor: customerColor(o.customerId) }}
                          >
                            {initials(customerName(o.customerId))}
                          </div>
                          <span className="text-[13px] font-medium">{customerName(o.customerId)}</span>
                        </div>
                      </Td>
                      <Td className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(o.createdAt)}
                      </Td>
                      <Td className="max-w-[240px]">
                        <span className="block truncate text-[12px] text-foreground/75">
                          {o.items
                            .map(
                              (i) =>
                                `${products.find((p) => p.id === i.productId)?.name ?? ""} ×${i.quantity}`
                            )
                            .join(", ")}
                        </span>
                      </Td>
                      <Td align="right" className="nums text-xs text-muted-foreground">
                        {o.items.reduce((s, i) => s + i.quantity, 0)}
                      </Td>
                      <Td align="right" className="nums font-semibold">
                        {formatTRY(o.total)}
                      </Td>
                      <Td align="center">
                        <OrderStatusBadge status={o.status} lang={lang} />
                      </Td>
                      <Td align="right">
                        {o.status === "PENDING" ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                approveOrder(o.id, "Mehmet (İşveren)");
                                toast.success(
                                  lang === "tr"
                                    ? "Sipariş onaylandı, stok güncellendi."
                                    : "Approved, stock updated."
                                );
                              }}
                              className="flex h-7 items-center gap-1 rounded-md border border-[color:var(--success-border)] bg-[var(--success-bg)] px-2 text-[11px] font-medium text-[color:var(--success-fg)] transition-colors hover:bg-[var(--success-bg)]"
                            >
                              <Check className="h-3 w-3" />
                              {t("common.approve")}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelOrder(o.id, "Mehmet (İşveren)");
                                toast.success(lang === "tr" ? "Sipariş iptal edildi." : "Order cancelled.");
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-[color:var(--danger-border)] hover:text-[color:var(--danger-fg)]"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/60">
                            {o.decidedAt ? formatDateTime(o.decidedAt) : "—"}
                          </span>
                        )}
                      </Td>
                    </Tr>
                    {isOpen && (
                      <tr className="bg-muted/50">
                        <Td colSpan={8} className="px-5 py-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="eyebrow">{lang === "tr" ? "Sipariş Kalemleri" : "Order Lines"}</p>
                            <Chip tone="neutral">
                              {lang === "tr" ? "Sipariş no" : "Order ID"}:{" "}
                              <span className="font-mono">#{o.id.slice(-6).toUpperCase()}</span>
                            </Chip>
                          </div>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {o.items.map((i) => {
                              const p = products.find((pp) => pp.id === i.productId);
                              return (
                                <div
                                  key={i.productId}
                                  className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5"
                                >
                                  {p && (
                                    <LensSwatch
                                      colorFrom={p.colorFrom}
                                      colorTo={p.colorTo}
                                      className="h-8 w-8 shrink-0"
                                    />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[12px] font-medium">{p?.name ?? i.productId}</p>
                                    <p className="nums text-[10px] uppercase tracking-wider text-muted-foreground">
                                      {formatTRY(i.unitPrice)} × {i.quantity}
                                      {p && ` · ${lang === "tr" ? "kalan" : "left"} ${p.remaining}`}
                                    </p>
                                  </div>
                                  <span className="nums text-[12px] font-semibold">
                                    {formatTRY(i.quantity * i.unitPrice)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </Td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </TBody>
          </DataTable>
        )}
      </Panel>
    </div>
  );
}
