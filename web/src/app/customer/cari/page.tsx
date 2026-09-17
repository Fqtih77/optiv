"use client";

import { Wallet, History, TrendingDown, Receipt } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, PanelHeader, PanelBody, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";
import { useCommerceStore, useCustomer } from "@/lib/store/commerce";
import { monthlySeries } from "@/lib/analytics";
import { formatDate, formatTRY } from "@/lib/format";
import { chartColors, chartTooltip } from "@/lib/chart-theme";

export default function CustomerLedgerPage() {
  const { lang } = useT();
  const customerId = useSessionStore((s) => s.customerId);
  const customer = useCustomer(customerId);
  const allPayments = useCommerceStore((s) => s.payments);
  const allOrders = useCommerceStore((s) => s.orders);

  const payments = allPayments.filter((p) => p.customerId === customerId);
  const orders = allOrders.filter((o) => o.customerId === customerId && o.status === "APPROVED");
  const series = monthlySeries({ payments, orders: allOrders }, { customerId, months: 12, lang });

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const totalCharged = orders.reduce((s, o) => s + o.total, 0);
  const paymentHistory = [...payments].sort((a, b) => (a.date < b.date ? 1 : -1));

  // Statement: newest first, running balance computed forward then displayed reversed
  const statement = [
    ...orders.map((o) => ({
      id: o.id,
      date: o.decidedAt ?? o.createdAt,
      type: "ORDER" as const,
      label: lang === "tr" ? "Sipariş (borç)" : "Order (debit)",
      debit: o.total,
      credit: 0,
    })),
    ...payments.map((p) => ({
      id: p.id,
      date: p.date,
      type: "PAYMENT" as const,
      label: p.note ? p.note : lang === "tr" ? "Ödeme (alacak)" : "Payment (credit)",
      debit: 0,
      credit: p.amount,
    })),
  ].sort((a, b) => (a.date < b.date ? -1 : 1));

  let running = customer?.openingBalance ?? 0;
  const statementWithBalance = statement.map((row) => {
    running = running + row.debit - row.credit;
    return { ...row, balance: running };
  });
  statementWithBalance.reverse();

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Finans" : "Finance"}
        title={lang === "tr" ? "Cari Hesabım" : "My Account"}
        description={
          lang === "tr"
            ? "Borç, ödeme ve aylık hareket dökümün. Ödeme yapılmayan aylar 0 ₺ olarak listelenir."
            : "Your debit, credit and monthly breakdown. Months without payments are listed as 0 ₺."
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label={lang === "tr" ? "Güncel Bakiye" : "Current Balance"}
          value={formatTRY(customer?.balance ?? 0)}
          icon={Wallet}
          accent={customer && customer.balance > 0 ? "danger" : "success"}
          hint={
            customer && customer.balance > 0
              ? lang === "tr"
                ? "Ödenmesi gereken tutar"
                : "Amount due"
              : lang === "tr"
                ? "Hesabın kapalı"
                : "Account settled"
          }
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Toplam Ödeme" : "Total Paid"}
          value={formatTRY(totalPaid, { compact: true })}
          icon={TrendingDown}
          accent="success"
          hint={`${payments.length} ${lang === "tr" ? "ödeme kaydı" : "payment records"}`}
          spark={series.map((s) => s.payments)}
          sparkColor={chartColors.emerald}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Toplam Borçlanma" : "Total Charged"}
          value={formatTRY(totalCharged, { compact: true })}
          icon={Receipt}
          accent="gold"
          hint={`${orders.length} ${lang === "tr" ? "onaylı sipariş" : "approved orders"}`}
          spark={series.map((s) => s.orders)}
        />
        <StatCard
          index={3}
          label={lang === "tr" ? "Eski Hesap Devri" : "Opening Balance"}
          value={formatTRY(customer?.openingBalance ?? 0)}
          icon={History}
          hint={lang === "tr" ? "Excel'den devreden bakiye" : "Carried over from spreadsheet"}
        />
      </div>

      <Panel className="mt-3.5">
        <PanelHeader
          title={lang === "tr" ? "12 Aylık Hareket" : "12-Month Activity"}
          description={lang === "tr" ? "Borçlanma ve ödeme karşılaştırması" : "Charges versus payments"}
          action={
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full dot-gold" />
                {lang === "tr" ? "Sipariş" : "Orders"}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full dot-success" />
                {lang === "tr" ? "Ödeme" : "Payments"}
              </span>
            </div>
          }
        />
        <PanelBody>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.gold} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={chartColors.gold} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="paymentsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.emerald} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={chartColors.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={chartColors.grid} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: chartColors.axis }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: chartColors.axis }}
                  axisLine={false}
                  tickLine={false}
                  width={46}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}B`}
                />
                <Tooltip {...chartTooltip} formatter={(v) => formatTRY(Number(v))} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke={chartColors.gold}
                  strokeWidth={1.75}
                  fill="url(#ordersFill)"
                  name={lang === "tr" ? "Sipariş" : "Orders"}
                />
                <Area
                  type="monotone"
                  dataKey="payments"
                  stroke={chartColors.emerald}
                  strokeWidth={1.75}
                  fill="url(#paymentsFill)"
                  name={lang === "tr" ? "Ödeme" : "Payments"}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PanelBody>
      </Panel>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-5">
        <Panel className="xl:col-span-3">
          <PanelHeader
            title={lang === "tr" ? "Hesap Ekstresi" : "Account Statement"}
            description={lang === "tr" ? "Borç / alacak hareketleri" : "Debit and credit movements"}
          />
          {statementWithBalance.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title={lang === "tr" ? "Hareket bulunmuyor" : "No activity"}
              description={lang === "tr" ? "Onaylanan siparişler burada görünür." : "Approved orders appear here."}
            />
          ) : (
            <DataTable>
              <THead>
                <Th>{lang === "tr" ? "Tarih" : "Date"}</Th>
                <Th>{lang === "tr" ? "Açıklama" : "Description"}</Th>
                <Th align="right">{lang === "tr" ? "Borç" : "Debit"}</Th>
                <Th align="right">{lang === "tr" ? "Alacak" : "Credit"}</Th>
                <Th align="right">{lang === "tr" ? "Bakiye" : "Balance"}</Th>
              </THead>
              <TBody>
                {statementWithBalance.map((row) => (
                  <Tr key={`${row.type}-${row.id}`}>
                    <Td className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(row.date)}</Td>
                    <Td>
                      <Chip tone={row.type === "PAYMENT" ? "success" : "gold"}>{row.label}</Chip>
                    </Td>
                    <Td align="right" className="nums text-gold-fg">
                      {row.debit > 0 ? formatTRY(row.debit) : "—"}
                    </Td>
                    <Td align="right" className="nums text-[color:var(--success-fg)]">
                      {row.credit > 0 ? formatTRY(row.credit) : "—"}
                    </Td>
                    <Td align="right" className="nums font-semibold">
                      {formatTRY(row.balance)}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </DataTable>
          )}
        </Panel>

        <Panel className="xl:col-span-2">
          <PanelHeader
            title={lang === "tr" ? "Aylık Ödeme Özeti" : "Monthly Payment Summary"}
            description={lang === "tr" ? "Son 12 ay" : "Last 12 months"}
          />
          <PanelBody className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {series.map((m) => (
              <div
                key={m.key}
                className={`rounded-md border px-3 py-2.5 ${
                  m.payments > 0
                    ? "border-[color:var(--success-border)] bg-[var(--success-bg)]"
                    : "border-border bg-muted/50"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                <p
                  className={`nums mt-1 text-[13px] font-semibold ${
                    m.payments > 0 ? "text-[color:var(--success-fg)]" : "text-muted-foreground/50"
                  }`}
                >
                  {formatTRY(m.payments, { compact: true })}
                </p>
              </div>
            ))}
          </PanelBody>
        </Panel>
      </div>

      <Panel className="mt-3.5">
        <PanelHeader title={lang === "tr" ? "Ödeme Geçmişi" : "Payment History"} />
        {paymentHistory.length === 0 ? (
          <EmptyState icon={Wallet} title={lang === "tr" ? "Ödeme kaydı yok" : "No payments"} />
        ) : (
          <DataTable>
            <THead>
              <Th>{lang === "tr" ? "Tarih" : "Date"}</Th>
              <Th>{lang === "tr" ? "Not" : "Note"}</Th>
              <Th align="right">{lang === "tr" ? "Tutar" : "Amount"}</Th>
            </THead>
            <TBody>
              {paymentHistory.map((p) => (
                <Tr key={p.id}>
                  <Td className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(p.date)}</Td>
                  <Td>{p.note ? <Chip tone="gold">{p.note}</Chip> : <span className="text-muted-foreground">—</span>}</Td>
                  <Td align="right" className="nums font-semibold text-[color:var(--success-fg)]">
                    {formatTRY(p.amount)}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </DataTable>
        )}
      </Panel>
    </div>
  );
}
