"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  CalendarClock,
  ClipboardList,
  TrendingUp,
  ShoppingBag,
  Package,
  Filter,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Panel, PanelHeader, PanelBody, Chip, ArrowAction, MiniBar } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { LensSwatch } from "@/components/shared/lens-swatch";
import { LensOrb } from "@/components/visual/lens-orb";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";
import { useCommerceStore, useCustomer } from "@/lib/store/commerce";
import { monthlySeries, productSalesRanking } from "@/lib/analytics";
import { formatDate, formatTRY, formatNumber } from "@/lib/format";
import { chartColors, chartTooltip } from "@/lib/chart-theme";

export default function CustomerHomePage() {
  const { t, lang } = useT();
  const customerId = useSessionStore((s) => s.customerId);
  const customer = useCustomer(customerId);
  const allOrders = useCommerceStore((s) => s.orders);
  const allPayments = useCommerceStore((s) => s.payments);
  const products = useCommerceStore((s) => s.products);

  const orders = allOrders.filter((o) => o.customerId === customerId);
  const payments = allPayments.filter((p) => p.customerId === customerId);

  const pending = orders.filter((o) => o.status === "PENDING");
  const approved = orders.filter((o) => o.status === "APPROVED");
  const lastPayment = [...payments].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  const series = monthlySeries({ payments, orders }, { customerId, months: 6, lang });
  const thisMonth = series[series.length - 1];
  const prevMonth = series[series.length - 2];
  const paymentDelta =
    prevMonth && prevMonth.payments > 0
      ? Math.round(((thisMonth.payments - prevMonth.payments) / prevMonth.payments) * 100)
      : null;

  const totalSpend = approved.reduce((s, o) => s + o.total, 0);
  const recentOrders = [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);
  const favourites = productSalesRanking(orders, products).slice(0, 4);
  const maxFav = favourites[0]?.quantity ?? 1;
  const criticalPicks = products.filter((p) => p.remaining > 0 && p.remaining < 80).slice(0, 3);

  const greeting = (() => {
    const h = new Date().getHours();
    if (lang === "tr") return h < 12 ? "Günaydın" : h < 18 ? "İyi günler" : "İyi akşamlar";
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  })();

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Bayi paneli" : "Dealer panel"}
        title={`${greeting}, ${customer?.name ?? ""}`}
        description={
          lang === "tr"
            ? "Bugün dikkatini bekleyenler ve hesap özetin."
            : "Here's what needs your attention today."
        }
        action={
          <>
            <button className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">
              <Filter className="h-3.5 w-3.5" />
              {lang === "tr" ? "Filtre" : "Filter"}
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date().toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </button>
            <Link
              href="/customer/orders/new"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-[12.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {lang === "tr" ? "Sipariş Oluştur" : "New Order"}
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel index={0} className="lg:col-span-4">
          <PanelHeader
            title={lang === "tr" ? "Cari durumum" : "My balance"}
            description={lang === "tr" ? "Güncel borç ve son ödeme" : "Current debt and last payment"}
            action={<ArrowAction href="/customer/cari" />}
          />
          <PanelBody>
            <div className="surface-2 rounded-2xl p-5">
              <p className="eyebrow">{lang === "tr" ? "Güncel bakiye" : "Current balance"}</p>
              <p className="display nums mt-3 text-[34px] text-foreground">
                {formatTRY(customer?.balance ?? 0)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Chip tone={customer && customer.balance > 0 ? "danger" : "success"} dot>
                  {customer && customer.balance > 0
                    ? lang === "tr"
                      ? "Ödeme bekliyor"
                      : "Payment due"
                    : lang === "tr"
                      ? "Hesap kapalı"
                      : "Settled"}
                </Chip>
                {customer && customer.openingBalance > 0 && (
                  <Chip tone="neutral">
                    {lang === "tr" ? "Eski hesap" : "Opening"} {formatTRY(customer.openingBalance)}
                  </Chip>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="surface-quiet rounded-2xl p-4">
                <p className="eyebrow">{lang === "tr" ? "Son ödeme" : "Last payment"}</p>
                <p className="nums mt-2 text-[15px] font-medium text-foreground">
                  {lastPayment ? formatTRY(lastPayment.amount) : "—"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {lastPayment
                    ? formatDate(lastPayment.date)
                    : lang === "tr"
                      ? "kayıt yok"
                      : "no record"}
                </p>
              </div>
              <div className="surface-quiet rounded-2xl p-4">
                <p className="eyebrow">{lang === "tr" ? "Bu ay" : "This month"}</p>
                <p className="nums mt-2 text-[15px] font-medium text-[color:var(--success-fg)]">
                  {formatTRY(thisMonth?.payments ?? 0)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {paymentDelta !== null
                    ? `${paymentDelta >= 0 ? "+" : "−"}${Math.abs(paymentDelta)}% ${
                        lang === "tr" ? "geçen aya göre" : "vs last month"
                      }`
                    : lang === "tr"
                      ? "karşılaştırma yok"
                      : "no comparison"}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="eyebrow mb-3">
                {lang === "tr" ? "Son 6 ay ödeme" : "Payments · last 6 months"}
              </p>
              <div className="space-y-2.5">
                {series.map((m) => (
                  <div key={m.key} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 text-[11px] text-muted-foreground">{m.label}</span>
                    <MiniBar
                      value={m.payments}
                      max={Math.max(...series.map((x) => x.payments), 1)}
                      tone={m.payments > 0 ? "success" : "accent"}
                      className="flex-1"
                    />
                    <span
                      className={`nums w-16 shrink-0 text-right text-[11px] ${
                        m.payments > 0 ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {formatTRY(m.payments, { compact: true })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PanelBody>
        </Panel>

        <Panel index={1} className="lg:col-span-4">
          <div aria-hidden className="absolute inset-0 bg-dots opacity-50" />
          <PanelHeader
            title={lang === "tr" ? "Stok içgörüleri" : "Stock insights"}
            description={
              lang === "tr"
                ? `${criticalPicks.length} cam azalıyor, sipariş için uygun zaman.`
                : `${criticalPicks.length} lenses running low — a good time to order.`
            }
            action={<ArrowAction href="/customer/orders/new" />}
          />
          <PanelBody className="relative">
            <div className="flex justify-center py-1">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <LensOrb size={146} />
              </motion.div>
            </div>
            <div className="mt-3 space-y-2">
              {criticalPicks.map((p) => (
                <div key={p.id} className="surface-quiet flex items-center gap-3 rounded-2xl px-3 py-2.5">
                  <LensSwatch colorFrom={p.colorFrom} colorTo={p.colorTo} className="h-7 w-7 shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">{p.name}</span>
                  <span className="nums text-[11px] text-muted-foreground">{p.remaining}</span>
                </div>
              ))}
            </div>
            <Link
              href="/customer/orders/new"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[12.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {lang === "tr" ? "Katalogdan seç" : "Browse catalog"}
            </Link>
          </PanelBody>
        </Panel>

        <Panel index={2} className="lg:col-span-4">
          <PanelHeader
            title={lang === "tr" ? "Aylık ödeme akışı" : "Monthly payment flow"}
            description={
              lang === "tr" ? "Ödeme yapılmayan aylar 0 ₺ olarak görünür." : "Idle months show as 0 ₺."
            }
            action={<ArrowAction href="/customer/cari" />}
          />
          <PanelBody>
            <div className="flex items-baseline gap-8">
              <div>
                <p className="eyebrow">{lang === "tr" ? "Toplam ödeme" : "Total paid"}</p>
                <p className="display nums mt-1.5 text-[24px] text-foreground">
                  {formatTRY(
                    payments.reduce((s, p) => s + p.amount, 0),
                    { compact: true }
                  )}
                </p>
              </div>
              <div>
                <p className="eyebrow">{lang === "tr" ? "Sipariş" : "Orders"}</p>
                <p className="display nums mt-1.5 text-[24px] text-foreground">{orders.length}</p>
              </div>
            </div>
            <div className="mt-5 h-[168px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={chartColors.grid} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: chartColors.axis }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    {...chartTooltip}
                    formatter={(v) => [formatTRY(Number(v)), lang === "tr" ? "Ödeme" : "Payment"]}
                  />
                  <Bar dataKey="payments" radius={[6, 6, 0, 0]} maxBarSize={30}>
                    {series.map((s) => (
                      <Cell key={s.key} fill={s.payments > 0 ? "var(--accent-fg)" : "var(--muted)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PanelBody>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label={lang === "tr" ? "Aktif sipariş" : "Active orders"}
          value={formatNumber(pending.length)}
          icon={ClipboardList}
          accent="gold"
          hint={
            pending.length > 0
              ? `${formatTRY(pending.reduce((s, o) => s + o.total, 0))} ${
                  lang === "tr" ? "onay bekliyor" : "pending"
                }`
              : lang === "tr"
                ? "bekleyen yok"
                : "nothing pending"
          }
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Toplam alışveriş" : "Total purchases"}
          value={formatTRY(totalSpend, { compact: true })}
          icon={TrendingUp}
          accent="accent"
          hint={`${approved.length} ${lang === "tr" ? "onaylı sipariş" : "approved"}`}
          spark={series.map((s) => s.orders)}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Bu ay ödeme" : "Paid this month"}
          value={formatTRY(thisMonth?.payments ?? 0)}
          icon={CalendarClock}
          accent="success"
          delta={paymentDelta !== null ? `${Math.abs(paymentDelta)}%` : undefined}
          deltaTone={paymentDelta === null ? "neutral" : paymentDelta >= 0 ? "up" : "down"}
          spark={series.map((s) => s.payments)}
          sparkColor={chartColors.emerald}
        />
        <StatCard
          index={3}
          label={lang === "tr" ? "Eski hesap devri" : "Opening balance"}
          value={formatTRY(customer?.openingBalance ?? 0)}
          icon={Wallet}
          hint={lang === "tr" ? "Excel'den devreden" : "carried over"}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel index={0} className="lg:col-span-7">
          <PanelHeader
            title={lang === "tr" ? "Son siparişlerim" : "Recent orders"}
            description={lang === "tr" ? "Durum ve tutar özeti" : "Status and totals"}
            action={<ArrowAction href="/customer/orders" label={t("common.viewAll")} />}
          />
          {recentOrders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title={lang === "tr" ? "Henüz sipariş yok" : "No orders yet"}
              action={
                <Link
                  href="/customer/orders/new"
                  className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-[12.5px] font-medium text-primary-foreground"
                >
                  {lang === "tr" ? "İlk siparişini oluştur" : "Create first order"}
                </Link>
              }
            />
          ) : (
            <DataTable>
              <THead>
                <Th>{lang === "tr" ? "Tarih" : "Date"}</Th>
                <Th>{lang === "tr" ? "Ürünler" : "Items"}</Th>
                <Th align="right">{t("common.total")}</Th>
                <Th align="right">{t("common.status")}</Th>
              </THead>
              <TBody>
                {recentOrders.map((o) => (
                  <Tr key={o.id}>
                    <Td className="whitespace-nowrap text-[12px] text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </Td>
                    <Td className="max-w-[260px]">
                      <span className="block truncate text-[12.5px] text-foreground/85">
                        {o.items
                          .map(
                            (i) =>
                              `${products.find((p) => p.id === i.productId)?.name ?? ""} ×${i.quantity}`
                          )
                          .join(", ")}
                      </span>
                    </Td>
                    <Td align="right" className="nums font-medium">
                      {formatTRY(o.total)}
                    </Td>
                    <Td align="right">
                      <OrderStatusBadge status={o.status} lang={lang} />
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </DataTable>
          )}
        </Panel>

        <Panel index={1} className="lg:col-span-5">
          <PanelHeader
            title={lang === "tr" ? "En çok aldığın camlar" : "Your top lenses"}
            description={lang === "tr" ? "Onaylanmış siparişlere göre" : "Based on approved orders"}
            action={<ArrowAction href="/customer/cari" />}
          />
          {favourites.length === 0 ? (
            <EmptyState
              icon={Package}
              title={lang === "tr" ? "Henüz veri yok" : "No data yet"}
              description={
                lang === "tr"
                  ? "İlk siparişin onaylandığında burada görünecek."
                  : "Shows up once your first order is approved."
              }
            />
          ) : (
            <PanelBody className="space-y-4">
              {favourites.map((f) => (
                <div key={f.product.id} className="flex items-center gap-3.5">
                  <LensSwatch
                    colorFrom={f.product.colorFrom}
                    colorTo={f.product.colorTo}
                    className="h-10 w-10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-[13px] text-foreground">{f.product.name}</p>
                      <p className="nums shrink-0 text-[11.5px] text-muted-foreground">
                        {f.quantity} {lang === "tr" ? "ad" : "pcs"}
                      </p>
                    </div>
                    <MiniBar value={f.quantity} max={maxFav} className="mt-2" />
                  </div>
                </div>
              ))}
            </PanelBody>
          )}
        </Panel>
      </div>
    </div>
  );
}
