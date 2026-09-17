"use client";

import { useState } from "react";
import { BarChart3, Boxes, Coins, Users2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, PanelHeader, PanelBody } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { Segmented } from "@/components/shared/segmented";
import { LensSwatch } from "@/components/shared/lens-swatch";
import { EmptyState } from "@/components/shared/empty-state";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import {
  customerSalesRanking,
  monthlySeries,
  productSalesRanking,
  stockValue,
  typeDistribution,
} from "@/lib/analytics";
import { formatNumber, formatTRY } from "@/lib/format";
import { chartColors, chartTooltip } from "@/lib/chart-theme";

type Range = "6" | "12" | "24";

export default function ReportsPage() {
  const { lang } = useT();
  const products = useCommerceStore((s) => s.products);
  const customers = useCommerceStore((s) => s.customers);
  const orders = useCommerceStore((s) => s.orders);
  const payments = useCommerceStore((s) => s.payments);
  const [range, setRange] = useState<Range>("12");

  const series = monthlySeries({ payments, orders }, { months: Number(range), lang });
  const productRanking = productSalesRanking(orders, products);
  const customerRanking = customerSalesRanking(orders, customers);
  const distribution = typeDistribution(products);

  const totalRevenue = orders.filter((o) => o.status === "APPROVED").reduce((s, o) => s + o.total, 0);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const thisMonth = series[series.length - 1];
  const prevMonth = series[series.length - 2];
  const collectedDelta =
    prevMonth && prevMonth.payments > 0
      ? Math.round(((thisMonth.payments - prevMonth.payments) / prevMonth.payments) * 100)
      : null;
  const unitsSold = orders
    .filter((o) => o.status === "APPROVED")
    .reduce((s, o) => s + o.items.reduce((x, i) => x + i.quantity, 0), 0);

  const customerChartData = customerRanking.slice(0, 7).map((r) => ({
    name: r.customer.name.length > 10 ? `${r.customer.name.slice(0, 9)}…` : r.customer.name,
    revenue: r.revenue,
    balance: r.customer.balance,
  }));

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Analiz" : "Analytics"}
        title={lang === "tr" ? "Raporlar" : "Reports"}
        description={
          lang === "tr"
            ? "Ciro, tahsilat, ürün ve bayi performansına dair detaylı analiz."
            : "Detailed analysis of revenue, collections, products and dealers."
        }
        action={
          <Segmented
            value={range}
            onChange={setRange}
            options={[
              { value: "6", label: lang === "tr" ? "6 ay" : "6m" },
              { value: "12", label: lang === "tr" ? "12 ay" : "12m" },
              { value: "24", label: lang === "tr" ? "24 ay" : "24m" },
            ]}
          />
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label={lang === "tr" ? "Toplam Ciro" : "Total Revenue"}
          value={formatTRY(totalRevenue, { compact: true })}
          icon={Coins}
          accent="gold"
          spark={series.map((s) => s.orders)}
          hint={`${orders.filter((o) => o.status === "APPROVED").length} ${
            lang === "tr" ? "onaylı sipariş" : "approved orders"
          }`}
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Toplam Tahsilat" : "Total Collected"}
          value={formatTRY(totalCollected, { compact: true })}
          icon={BarChart3}
          accent="success"
          delta={collectedDelta !== null ? `${Math.abs(collectedDelta)}%` : undefined}
          deltaTone={collectedDelta === null ? "neutral" : collectedDelta >= 0 ? "up" : "down"}
          hint={`${payments.length} ${lang === "tr" ? "ödeme kaydı" : "payment records"}`}
          spark={series.map((s) => s.payments)}
          sparkColor={chartColors.emerald}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Satılan Adet" : "Units Sold"}
          value={formatNumber(unitsSold)}
          icon={Boxes}
          accent="accent"
          hint={`${productRanking.length} ${lang === "tr" ? "farklı cam" : "distinct lenses"}`}
        />
        <StatCard
          index={3}
          label={lang === "tr" ? "Stok Değeri" : "Stock Value"}
          value={formatTRY(stockValue(products), { compact: true })}
          icon={Users2}
          hint={`${customers.length} ${lang === "tr" ? "aktif bayi" : "active dealers"}`}
        />
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader
            title={lang === "tr" ? "Aylık Ciro ve Tahsilat" : "Monthly Revenue & Collections"}
            description={
              lang === "tr"
                ? "Hareketsiz aylar 0 ₺ olarak takvimde yerini korur."
                : "Idle months keep their place as 0 ₺."
            }
          />
          <PanelBody>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={chartColors.grid} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: chartColors.axis }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={Number(range) > 12 ? -35 : 0}
                    textAnchor={Number(range) > 12 ? "end" : "middle"}
                    height={Number(range) > 12 ? 44 : 24}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: chartColors.axis }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                    tickFormatter={(v: number) => `${Math.round(v / 1000)}B`}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    {...chartTooltip}
                    formatter={(v) => formatTRY(Number(v))}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: chartColors.axis, paddingTop: 8 }}
                    iconType="circle"
                    iconSize={7}
                  />
                  <Bar
                    dataKey="orders"
                    name={lang === "tr" ? "Ciro" : "Revenue"}
                    fill={chartColors.gold}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={22}
                  />
                  <Bar
                    dataKey="payments"
                    name={lang === "tr" ? "Tahsilat" : "Collected"}
                    fill={chartColors.blue}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader
            title={lang === "tr" ? "Tür Dağılımı" : "Type Distribution"}
            description={lang === "tr" ? "Kalan stok adedine göre" : "By remaining stock"}
          />
          <PanelBody>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {distribution.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltip} formatter={(v) => `${formatNumber(Number(v))} adet`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {distribution.map((d) => {
                const total = distribution.reduce((s, x) => s + x.value, 0) || 1;
                return (
                  <div key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[12px] text-foreground/80">
                      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: d.fill }} />
                      {d.name}
                    </span>
                    <span className="nums text-[12px] font-semibold">
                      {Math.round((d.value / total) * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </PanelBody>
        </Panel>
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <Panel>
          <PanelHeader
            title={lang === "tr" ? "Bayi Performansı" : "Dealer Performance"}
            description={lang === "tr" ? "Ciro ve güncel bakiye" : "Revenue and current balance"}
          />
          <PanelBody>
            {customerChartData.length === 0 ? (
              <EmptyState icon={Users2} title={lang === "tr" ? "Veri yok" : "No data"} />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={customerChartData}
                    layout="vertical"
                    margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} stroke={chartColors.grid} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: chartColors.axis }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${Math.round(v / 1000)}B`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: chartColors.axis }}
                      axisLine={false}
                      tickLine={false}
                      width={72}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--muted)" }}
                      {...chartTooltip}
                      formatter={(v) => formatTRY(Number(v))}
                    />
                    <Bar
                      dataKey="revenue"
                      name={lang === "tr" ? "Ciro" : "Revenue"}
                      fill={chartColors.gold}
                      radius={[0, 3, 3, 0]}
                      maxBarSize={14}
                    />
                    <Bar
                      dataKey="balance"
                      name={lang === "tr" ? "Bakiye" : "Balance"}
                      fill="var(--chart-4)"
                      radius={[0, 3, 3, 0]}
                      maxBarSize={14}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader
            title={lang === "tr" ? "En Çok Satan Camlar" : "Best Selling Lenses"}
            description={lang === "tr" ? "Onaylı siparişlere göre ciro" : "Revenue from approved orders"}
          />
          {productRanking.length === 0 ? (
            <EmptyState icon={Boxes} title={lang === "tr" ? "Satış verisi yok" : "No sales data"} />
          ) : (
            <DataTable>
              <THead>
                <Th>{lang === "tr" ? "Ürün" : "Product"}</Th>
                <Th align="right">{lang === "tr" ? "Adet" : "Units"}</Th>
                <Th align="right">{lang === "tr" ? "Ciro" : "Revenue"}</Th>
                <Th align="right">{lang === "tr" ? "Kalan" : "Left"}</Th>
              </THead>
              <TBody>
                {productRanking.slice(0, 8).map((r) => (
                  <Tr key={r.product.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <LensSwatch
                          colorFrom={r.product.colorFrom}
                          colorTo={r.product.colorTo}
                          className="h-7 w-7 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-medium">{r.product.name}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {r.product.code}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td align="right" className="nums text-xs">
                      {r.quantity}
                    </Td>
                    <Td align="right" className="nums font-semibold text-gold-fg">
                      {formatTRY(r.revenue)}
                    </Td>
                    <Td align="right" className="nums text-xs text-muted-foreground">
                      {r.product.remaining}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </DataTable>
          )}
        </Panel>
      </div>
    </div>
  );
}
