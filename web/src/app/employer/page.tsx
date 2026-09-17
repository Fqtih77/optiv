"use client";

import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Boxes,
  Landmark,
  Wallet,
  ClipboardList,
  AlertTriangle,
  Check,
  X,
  Layers,
  Filter,
  CalendarDays,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, PanelHeader, PanelBody, Chip, ArrowAction, MiniBar } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { LensSwatch } from "@/components/shared/lens-swatch";
import { LensOrb } from "@/components/visual/lens-orb";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { getStockStatus } from "@/lib/stock-status";
import { customerSalesRanking, monthlySeries, stockValue } from "@/lib/analytics";
import { formatDateTime, formatNumber, formatTRY, initials } from "@/lib/format";
import { chartColors, chartTooltip } from "@/lib/chart-theme";

export default function EmployerHomePage() {
  const { lang } = useT();
  const products = useCommerceStore((s) => s.products);
  const customers = useCommerceStore((s) => s.customers);
  const payments = useCommerceStore((s) => s.payments);
  const orders = useCommerceStore((s) => s.orders);
  const approveOrder = useCommerceStore((s) => s.approveOrder);
  const cancelOrder = useCommerceStore((s) => s.cancelOrder);

  const totalRemaining = products.reduce((s, p) => s + p.remaining, 0);
  const totalIn = products.reduce((s, p) => s + p.totalIn, 0);
  const totalReceivable = customers.reduce((s, c) => s + c.balance, 0);
  const series = monthlySeries({ payments, orders }, { months: 8, lang });
  const thisMonth = series[series.length - 1];
  const prevMonth = series[series.length - 2];
  const collectedDelta =
    prevMonth && prevMonth.payments > 0
      ? Math.round(((thisMonth.payments - prevMonth.payments) / prevMonth.payments) * 100)
      : null;

  const pending = orders
    .filter((o) => o.status === "PENDING")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const critical = products
    .filter((p) => ["KRITIK", "TUKENDI"].includes(getStockStatus(p.remaining)))
    .sort((a, b) => a.remaining - b.remaining);
  const topCustomers = customerSalesRanking(orders, customers).slice(0, 5);
  const maxBalance = Math.max(...customers.map((c) => c.balance), 1);
  const capacityPct = Math.round((totalRemaining / (totalIn || 1)) * 100);

  const greeting = (() => {
    const h = new Date().getHours();
    if (lang === "tr") return h < 12 ? "Günaydın" : h < 18 ? "İyi günler" : "İyi akşamlar";
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  })();

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? id;
  const customerColor = (id: string) => customers.find((c) => c.id === id)?.avatarColor ?? "#092040";

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "İşveren paneli" : "Employer panel"}
        title={`${greeting}, Mehmet`}
        description={
          lang === "tr"
            ? "Bugün onay bekleyenler, kritik stoklar ve tahsilat durumu."
            : "Approvals, critical stock and collections at a glance."
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
              href="/employer/urunler"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-[12.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Layers className="h-3.5 w-3.5" />
              {lang === "tr" ? "Stok Girişi" : "Add Stock"}
            </Link>
          </>
        }
      />

      {/* Bento row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Pending approvals */}
        <Panel index={0} className="lg:col-span-5">
          <PanelHeader
            title={lang === "tr" ? "Onay bekleyen siparişler" : "Awaiting approval"}
            description={
              lang === "tr"
                ? "Onayla; stok düşer, cari hesaba borç işlenir."
                : "Approve to deduct stock and charge the dealer."
            }
            action={<ArrowAction href="/employer/siparisler" />}
          />
          {pending.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title={lang === "tr" ? "Bekleyen sipariş yok" : "Nothing pending"}
              description={lang === "tr" ? "Tüm siparişler işlendi." : "All caught up."}
            />
          ) : (
            <PanelBody className="space-y-3">
              {pending.slice(0, 4).map((o) => (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="surface-2 flex items-center gap-3 rounded-2xl p-3.5"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: customerColor(o.customerId) }}
                  >
                    {initials(customerName(o.customerId))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {customerName(o.customerId)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {o.items.reduce((s, i) => s + i.quantity, 0)} {lang === "tr" ? "adet" : "pcs"} ·{" "}
                      {formatDateTime(o.createdAt)}
                    </p>
                  </div>
                  <span className="nums shrink-0 text-[13px] font-medium text-foreground">
                    {formatTRY(o.total)}
                  </span>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => {
                        approveOrder(o.id, "Mehmet (İşveren)");
                        toast.success(
                          lang === "tr" ? "Sipariş onaylandı, stok güncellendi." : "Approved."
                        );
                      }}
                      className="tone-success flex h-8 w-8 items-center justify-center rounded-full border transition-opacity hover:opacity-80"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        cancelOrder(o.id, "Mehmet (İşveren)");
                        toast.success(lang === "tr" ? "Sipariş iptal edildi." : "Cancelled.");
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-[color:var(--danger-fg)]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
              {pending.length > 4 && (
                <Link
                  href="/employer/siparisler"
                  className="block pt-1 text-center text-[12px] text-accent-fg transition-opacity hover:opacity-80"
                >
                  +{pending.length - 4} {lang === "tr" ? "sipariş daha" : "more orders"}
                </Link>
              )}
            </PanelBody>
          )}
        </Panel>

        {/* Stock capacity orb */}
        <Panel index={1} className="lg:col-span-3">
          <div aria-hidden className="absolute inset-0 bg-dots opacity-50" />
          <PanelHeader
            title={lang === "tr" ? "Stok kapasitesi" : "Stock capacity"}
            action={<ArrowAction href="/employer/urunler" />}
          />
          <PanelBody className="relative flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <LensOrb size={132} />
            </motion.div>
            <p className="display nums mt-5 text-[32px] text-foreground">{capacityPct}%</p>
            <p className="mt-1 text-center text-[12px] text-muted-foreground">
              {formatNumber(totalRemaining)} / {formatNumber(totalIn)}{" "}
              {lang === "tr" ? "adet kalan" : "units left"}
            </p>
            <div className="mt-5 grid w-full grid-cols-2 gap-2 border-t border-border pt-4">
              <div>
                <p className="eyebrow">{lang === "tr" ? "Ürün" : "Products"}</p>
                <p className="nums mt-1 text-[15px] font-medium text-foreground">{products.length}</p>
              </div>
              <div>
                <p className="eyebrow">{lang === "tr" ? "Kritik" : "Critical"}</p>
                <p className="nums mt-1 text-[15px] font-medium text-[color:var(--danger-fg)]">
                  {critical.length}
                </p>
              </div>
            </div>
          </PanelBody>
        </Panel>

        {/* Collections trend */}
        <Panel index={2} className="lg:col-span-4">
          <PanelHeader
            title={lang === "tr" ? "Tahsilat trendi" : "Collections trend"}
            description={lang === "tr" ? "Son 8 ay · sipariş vs tahsilat" : "Last 8 months"}
            action={<ArrowAction href="/employer/raporlar" />}
          />
          <PanelBody>
            <div className="flex items-baseline gap-8">
              <div>
                <p className="eyebrow">{lang === "tr" ? "Bu ay" : "This month"}</p>
                <p className="display nums mt-1.5 text-[24px] text-foreground">
                  {formatTRY(thisMonth?.payments ?? 0, { compact: true })}
                </p>
              </div>
              <div>
                <p className="eyebrow">{lang === "tr" ? "Alacak" : "Receivable"}</p>
                <p className="display nums mt-1.5 text-[24px] text-[color:var(--danger-fg)]">
                  {formatTRY(totalReceivable, { compact: true })}
                </p>
              </div>
            </div>
            <div className="mt-4 h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="empOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--gold-fg)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--gold-fg)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="empPayments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-fg)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--accent-fg)" stopOpacity={0} />
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
                    width={40}
                    tickFormatter={(v: number) => `${Math.round(v / 1000)}B`}
                  />
                  <Tooltip {...chartTooltip} formatter={(v) => formatTRY(Number(v))} />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    name={lang === "tr" ? "Sipariş" : "Orders"}
                    stroke="var(--gold-fg)"
                    strokeWidth={1.75}
                    fill="url(#empOrders)"
                  />
                  <Area
                    type="monotone"
                    dataKey="payments"
                    name={lang === "tr" ? "Tahsilat" : "Collected"}
                    stroke="var(--accent-fg)"
                    strokeWidth={1.75}
                    fill="url(#empPayments)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PanelBody>
        </Panel>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label={lang === "tr" ? "Toplam kalan stok" : "Remaining stock"}
          value={formatNumber(totalRemaining)}
          icon={Boxes}
          accent="accent"
          hint={`${lang === "tr" ? "toplam giren" : "total in"} ${formatNumber(totalIn)}`}
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Bu ayki tahsilat" : "Collected this month"}
          value={formatTRY(thisMonth?.payments ?? 0, { compact: true })}
          icon={Landmark}
          accent="success"
          delta={collectedDelta !== null ? `${Math.abs(collectedDelta)}%` : undefined}
          deltaTone={collectedDelta === null ? "neutral" : collectedDelta >= 0 ? "up" : "down"}
          spark={series.map((s) => s.payments)}
          sparkColor={chartColors.emerald}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Toplam alacak" : "Total receivable"}
          value={formatTRY(totalReceivable, { compact: true })}
          icon={Wallet}
          accent={totalReceivable > 0 ? "danger" : "success"}
          hint={`${customers.filter((c) => c.balance > 0).length} ${
            lang === "tr" ? "bayide borç" : "dealers in debt"
          }`}
        />
        <StatCard
          index={3}
          label={lang === "tr" ? "Stok değeri" : "Stock value"}
          value={formatTRY(stockValue(products), { compact: true })}
          icon={ClipboardList}
          accent="gold"
          hint={`${pending.length} ${lang === "tr" ? "bekleyen sipariş" : "pending orders"}`}
          spark={series.map((s) => s.orders)}
        />
      </div>

      {/* Bento row 3 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel index={0} className="lg:col-span-5">
          <PanelHeader
            title={lang === "tr" ? "Kritik stoklar" : "Critical stock"}
            description={lang === "tr" ? "50 adedin altındaki camlar" : "Lenses below 50 units"}
            action={
              <span className="tone-danger flex h-9 w-9 items-center justify-center rounded-full border">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
            }
          />
          {critical.length === 0 ? (
            <EmptyState icon={Boxes} title={lang === "tr" ? "Kritik ürün yok" : "Nothing critical"} />
          ) : (
            <PanelBody className="space-y-3.5">
              {critical.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3.5">
                  <LensSwatch colorFrom={p.colorFrom} colorTo={p.colorTo} className="h-9 w-9 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-[13px] text-foreground">{p.name}</p>
                      <p
                        className={`nums shrink-0 text-[12px] font-medium ${
                          p.remaining === 0
                            ? "text-[color:var(--danger-fg)]"
                            : "text-[color:var(--warning-fg)]"
                        }`}
                      >
                        {p.remaining}
                      </p>
                    </div>
                    <MiniBar
                      value={p.remaining}
                      max={p.totalIn || 1}
                      tone={p.remaining === 0 ? "danger" : "warning"}
                      className="mt-2"
                    />
                  </div>
                </div>
              ))}
              <Link
                href="/employer/urunler"
                className="block pt-1 text-[12px] text-accent-fg transition-opacity hover:opacity-80"
              >
                {lang === "tr" ? "Stok girişi yap →" : "Add stock →"}
              </Link>
            </PanelBody>
          )}
        </Panel>

        <Panel index={1} className="lg:col-span-7">
          <PanelHeader
            title={lang === "tr" ? "Bayi bakiyeleri" : "Dealer balances"}
            description={lang === "tr" ? "En yüksek cirolu bayiler" : "Highest revenue dealers"}
            action={<ArrowAction href="/employer/cari" label={lang === "tr" ? "Cari" : "Ledger"} />}
          />
          <DataTable>
            <THead>
              <Th>{lang === "tr" ? "Bayi" : "Dealer"}</Th>
              <Th align="right">{lang === "tr" ? "Ciro" : "Revenue"}</Th>
              <Th className="w-[160px]">{lang === "tr" ? "Borç payı" : "Debt share"}</Th>
              <Th align="right">{lang === "tr" ? "Bakiye" : "Balance"}</Th>
            </THead>
            <TBody>
              {topCustomers.map((r) => (
                <Tr key={r.customer.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: r.customer.avatarColor }}
                      >
                        {initials(r.customer.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">{r.customer.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {r.orderCount} {lang === "tr" ? "sipariş" : "orders"}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td align="right" className="nums text-[13px] text-gold-fg">
                    {formatTRY(r.revenue, { compact: true })}
                  </Td>
                  <Td>
                    <MiniBar
                      value={r.customer.balance}
                      max={maxBalance}
                      tone={r.customer.balance > 0 ? "danger" : "success"}
                    />
                  </Td>
                  <Td align="right">
                    <Chip tone={r.customer.balance > 0 ? "danger" : "success"}>
                      {formatTRY(r.customer.balance, { compact: true })}
                    </Chip>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </DataTable>
        </Panel>
      </div>
    </div>
  );
}
