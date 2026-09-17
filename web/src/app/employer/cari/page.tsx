"use client";

import { useState } from "react";
import { Truck, Wallet, Search, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { Segmented } from "@/components/shared/segmented";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { CustomerLedgerDialog } from "@/components/employer/customer-ledger-dialog";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { formatDateTime, formatTRY, initials } from "@/lib/format";

type Tab = "ledger" | "shipments";

export default function ShipmentsAndLedgerPage() {
  const { lang } = useT();
  const customers = useCommerceStore((s) => s.customers);
  const products = useCommerceStore((s) => s.products);
  const allOrders = useCommerceStore((s) => s.orders);
  const payments = useCommerceStore((s) => s.payments);

  const [tab, setTab] = useState<Tab>("ledger");
  const [query, setQuery] = useState("");

  const shipments = allOrders
    .filter((o) => o.status === "APPROVED")
    .sort((a, b) => ((a.decidedAt ?? "") < (b.decidedAt ?? "") ? 1 : -1));

  const totalReceivable = customers.reduce((s, c) => s + c.balance, 0);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const debtors = customers.filter((c) => c.balance > 0);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? id;
  const customerColor = (id: string) => customers.find((c) => c.id === id)?.avatarColor ?? "#092040";

  const visibleCustomers = customers.filter((c) =>
    query.trim() ? c.name.toLowerCase().includes(query.toLowerCase()) : true
  );
  const visibleShipments = shipments.filter((o) =>
    query.trim() ? customerName(o.customerId).toLowerCase().includes(query.toLowerCase()) : true
  );
  const maxBalance = Math.max(...customers.map((c) => c.balance), 1);

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Finans" : "Finance"}
        title={lang === "tr" ? "Sevkiyat ve Cari Hesap" : "Shipments & Ledger"}
        description={
          lang === "tr"
            ? "Bayi bakiyeleri, ödeme kayıtları ve onaylanan siparişlerin sevkiyat geçmişi."
            : "Dealer balances, payment records and the shipment history of approved orders."
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <StatCard
          index={0}
          label={lang === "tr" ? "Toplam Alacak" : "Total Receivable"}
          value={formatTRY(totalReceivable, { compact: true })}
          icon={Wallet}
          accent={totalReceivable > 0 ? "danger" : "success"}
          hint={`${debtors.length} / ${customers.length} ${lang === "tr" ? "bayide borç" : "dealers in debt"}`}
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Toplam Tahsilat" : "Total Collected"}
          value={formatTRY(totalCollected, { compact: true })}
          icon={TrendingUp}
          accent="success"
          hint={`${payments.length} ${lang === "tr" ? "ödeme kaydı" : "payments"}`}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Sevk Edilen Sipariş" : "Shipped Orders"}
          value={String(shipments.length)}
          icon={Truck}
          accent="gold"
          hint={formatTRY(
            shipments.reduce((s, o) => s + o.total, 0),
            { compact: true }
          )}
        />
      </div>

      <div className="mt-3.5 mb-3.5 flex flex-wrap items-center gap-2.5">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "ledger", label: lang === "tr" ? "Cari Hesap" : "Ledger", count: customers.length },
            { value: "shipments", label: lang === "tr" ? "Sevkiyatlar" : "Shipments", count: shipments.length },
          ]}
        />
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "tr" ? "Bayi ara" : "Search dealer"}
            className="h-9 pl-9"
          />
        </div>
      </div>

      {tab === "ledger" ? (
        <Panel>
          {visibleCustomers.length === 0 ? (
            <EmptyState icon={Wallet} title={lang === "tr" ? "Bayi bulunamadı" : "No dealers found"} />
          ) : (
            <DataTable>
              <THead>
                <Th>{lang === "tr" ? "Bayi" : "Dealer"}</Th>
                <Th align="right">{lang === "tr" ? "Eski Hesap" : "Opening"}</Th>
                <Th align="right">{lang === "tr" ? "Toplam Ödeme" : "Paid"}</Th>
                <Th align="right">{lang === "tr" ? "Bakiye" : "Balance"}</Th>
                <Th className="w-[140px]">{lang === "tr" ? "Borç Oranı" : "Debt Share"}</Th>
                <Th align="right">{lang === "tr" ? "İşlem" : "Action"}</Th>
              </THead>
              <TBody>
                {visibleCustomers.map((c) => {
                  const paid = payments
                    .filter((p) => p.customerId === c.id)
                    .reduce((s, p) => s + p.amount, 0);
                  return (
                    <Tr key={c.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold text-white"
                            style={{ backgroundColor: c.avatarColor }}
                          >
                            {initials(c.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium">{c.name}</p>
                            <p className="truncate text-[11px] text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      </Td>
                      <Td align="right" className="nums text-xs text-muted-foreground">
                        {c.openingBalance > 0 ? formatTRY(c.openingBalance) : "—"}
                      </Td>
                      <Td align="right" className="nums text-[13px] text-[color:var(--success-fg)]">
                        {formatTRY(paid, { compact: true })}
                      </Td>
                      <Td align="right">
                        <span
                          className={`nums text-[13px] font-semibold ${
                            c.balance > 0 ? "text-[color:var(--danger-fg)]" : "text-[color:var(--success-fg)]"
                          }`}
                        >
                          {formatTRY(c.balance)}
                        </span>
                      </Td>
                      <Td>
                        <div className="h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-[var(--danger-bg)]"
                            style={{ width: `${Math.max(1, (c.balance / maxBalance) * 100)}%` }}
                          />
                        </div>
                      </Td>
                      <Td align="right">
                        <CustomerLedgerDialog customer={c} lang={lang} />
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </DataTable>
          )}
        </Panel>
      ) : (
        <Panel>
          {visibleShipments.length === 0 ? (
            <EmptyState
              icon={Truck}
              title={lang === "tr" ? "Henüz sevkiyat yok" : "No shipments yet"}
              description={
                lang === "tr"
                  ? "Onaylanan siparişler otomatik olarak sevkiyat kaydına dönüşür."
                  : "Approved orders automatically become shipment records."
              }
            />
          ) : (
            <DataTable>
              <THead>
                <Th>{lang === "tr" ? "Sevk Tarihi" : "Shipped At"}</Th>
                <Th>{lang === "tr" ? "Bayi" : "Dealer"}</Th>
                <Th>{lang === "tr" ? "Ürünler" : "Items"}</Th>
                <Th align="right">{lang === "tr" ? "Adet" : "Units"}</Th>
                <Th align="right">{lang === "tr" ? "Tutar" : "Amount"}</Th>
                <Th align="center">{lang === "tr" ? "Durum" : "Status"}</Th>
              </THead>
              <TBody>
                {visibleShipments.map((o) => (
                  <Tr key={o.id}>
                    <Td className="whitespace-nowrap text-xs text-muted-foreground">
                      {o.decidedAt ? formatDateTime(o.decidedAt) : "—"}
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
                    <Td className="max-w-[260px]">
                      <span className="block truncate text-[12px] text-foreground/75">
                        {o.items
                          .map(
                            (i) => `${products.find((p) => p.id === i.productId)?.name ?? ""} ×${i.quantity}`
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
                      <Chip tone="success">{lang === "tr" ? "Sevk edildi" : "Shipped"}</Chip>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </DataTable>
          )}
        </Panel>
      )}
    </div>
  );
}
