"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronDown, ClipboardList, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Panel, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { Segmented } from "@/components/shared/segmented";
import { EmptyState } from "@/components/shared/empty-state";
import { LensSwatch } from "@/components/shared/lens-swatch";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";
import { useCommerceStore } from "@/lib/store/commerce";
import { formatDateTime, formatTRY } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

type Filter = "ALL" | OrderStatus;

export default function CustomerOrdersPage() {
  const { t, lang } = useT();
  const customerId = useSessionStore((s) => s.customerId);
  const products = useCommerceStore((s) => s.products);
  const allOrders = useCommerceStore((s) => s.orders);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const orders = allOrders
    .filter((o) => o.customerId === customerId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const counts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    APPROVED: orders.filter((o) => o.status === "APPROVED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const visible = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  const visibleTotal = visible.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Geçmiş" : "History"}
        title={lang === "tr" ? "Siparişlerim" : "My Orders"}
        description={
          lang === "tr"
            ? "Tüm siparişlerin durumu ve kalem detayları. Satıra tıklayarak detayı açabilirsin."
            : "Status and line details of every order. Click a row to expand."
        }
        action={
          <Button
            render={<Link href="/customer/orders/new" />}
            nativeButton={false}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            {lang === "tr" ? "Sipariş Oluştur" : "New Order"}
          </Button>
        }
      />

      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
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
        <Chip tone="neutral">
          {lang === "tr" ? "Listelenen toplam" : "Listed total"}:{" "}
          <span className="nums font-semibold text-foreground">{formatTRY(visibleTotal)}</span>
        </Chip>
      </div>

      <Panel>
        {visible.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={lang === "tr" ? "Bu filtrede sipariş yok" : "No orders in this filter"}
          />
        ) : (
          <DataTable>
            <THead>
              <Th className="w-10" />
              <Th>{lang === "tr" ? "Tarih" : "Date"}</Th>
              <Th>{lang === "tr" ? "Sipariş No" : "Order ID"}</Th>
              <Th align="right">{lang === "tr" ? "Kalem" : "Lines"}</Th>
              <Th align="right">{lang === "tr" ? "Adet" : "Units"}</Th>
              <Th align="right">{t("common.total")}</Th>
              <Th align="right">{t("common.status")}</Th>
            </THead>
            <TBody>
              {visible.map((o) => {
                const isOpen = expanded === o.id;
                const units = o.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <Fragment key={o.id}>
                    <Tr onClick={() => setExpanded(isOpen ? null : o.id)}>
                      <Td>
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Td>
                      <Td className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(o.createdAt)}
                      </Td>
                      <Td className="font-mono text-[11px] uppercase text-foreground/70">
                        #{o.id.slice(-6)}
                      </Td>
                      <Td align="right" className="nums text-xs text-muted-foreground">
                        {o.items.length}
                      </Td>
                      <Td align="right" className="nums text-xs text-muted-foreground">
                        {units}
                      </Td>
                      <Td align="right" className="nums font-semibold">
                        {formatTRY(o.total)}
                      </Td>
                      <Td align="right">
                        <OrderStatusBadge status={o.status} lang={lang} />
                      </Td>
                    </Tr>
                    {isOpen && (
                      <tr className="bg-muted/50">
                        <Td colSpan={7} className="px-5 py-4">
                          <p className="eyebrow mb-3">{lang === "tr" ? "Sipariş Kalemleri" : "Order Lines"}</p>
                          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
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
                                    </p>
                                  </div>
                                  <span className="nums text-[12px] font-semibold">
                                    {formatTRY(i.quantity * i.unitPrice)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          {o.decidedAt && (
                            <p className="mt-3 text-[11px] text-muted-foreground">
                              {o.status === "APPROVED"
                                ? lang === "tr"
                                  ? "Onay tarihi"
                                  : "Approved at"
                                : lang === "tr"
                                  ? "İptal tarihi"
                                  : "Cancelled at"}
                              : {formatDateTime(o.decidedAt)}
                            </p>
                          )}
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
