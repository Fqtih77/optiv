"use client";

import { Database, HardDrive, Timer, CloudUpload } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, PanelHeader, PanelBody, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { formatNumber } from "@/lib/format";
import { chartColors, chartTooltip } from "@/lib/chart-theme";

export default function DatabasePage() {
  const { lang } = useT();
  const products = useCommerceStore((s) => s.products);
  const customers = useCommerceStore((s) => s.customers);
  const orders = useCommerceStore((s) => s.orders);
  const payments = useCommerceStore((s) => s.payments);
  const logs = useCommerceStore((s) => s.logs);

  const tables = [
    { name: "products", rows: products.length, size: "128 kB", index: "24 kB" },
    { name: "customers", rows: customers.length, size: "96 kB", index: "32 kB" },
    { name: "orders", rows: orders.length, size: "412 kB", index: "88 kB" },
    {
      name: "order_items",
      rows: orders.reduce((s, o) => s + o.items.length, 0),
      size: "664 kB",
      index: "156 kB",
    },
    { name: "payments", rows: payments.length, size: "72 kB", index: "18 kB" },
    { name: "activity_logs", rows: logs.length, size: "1.2 MB", index: "244 kB" },
  ];

  const totalRows = tables.reduce((s, t) => s + t.rows, 0);

  const queries = [
    { name: "SELECT orders JOIN order_items", ms: 18 },
    { name: "SELECT monthly_payment_summary()", ms: 34 },
    { name: "UPDATE products SET remaining", ms: 6 },
    { name: "INSERT activity_logs", ms: 3 },
    { name: "SELECT customers WITH balance", ms: 12 },
  ];

  // Static labels so SSR and client render identically.
  const backups = [
    { id: "b1", at: "17 Eyl 2026 · 03:00", size: "3.4 MB" },
    { id: "b2", at: "16 Eyl 2026 · 03:00", size: "3.3 MB" },
    { id: "b3", at: "15 Eyl 2026 · 03:00", size: "3.2 MB" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="PostgreSQL"
        title={lang === "tr" ? "Veritabanı" : "Database"}
        description={
          lang === "tr"
            ? "Tablo boyutları, satır sayıları, sorgu performansı ve yedekleme geçmişi."
            : "Table sizes, row counts, query performance and backup history."
        }
        action={
          <Chip tone="success">
            <span className="h-1.5 w-1.5 rounded-full dot-success" />
            {lang === "tr" ? "Bağlantı sağlıklı" : "Connection healthy"}
          </Chip>
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label={lang === "tr" ? "Toplam Satır" : "Total Rows"}
          value={formatNumber(totalRows)}
          icon={Database}
          accent="accent"
          hint={`${tables.length} ${lang === "tr" ? "tablo" : "tables"}`}
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Disk Kullanımı" : "Disk Usage"}
          value="2.6 MB"
          icon={HardDrive}
          hint={lang === "tr" ? "indeksler dahil" : "indexes included"}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Ort. Sorgu Süresi" : "Avg. Query Time"}
          value="14 ms"
          icon={Timer}
          accent="success"
          delta="12%"
          deltaTone="up"
        />
        <StatCard
          index={3}
          label={lang === "tr" ? "Son Yedek" : "Last Backup"}
          value={lang === "tr" ? "6 saat önce" : "6h ago"}
          icon={CloudUpload}
          accent="gold"
          hint={lang === "tr" ? "günlük otomatik" : "daily automated"}
        />
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-5">
        <Panel className="xl:col-span-3">
          <PanelHeader
            title={lang === "tr" ? "Tablolar" : "Tables"}
            description={lang === "tr" ? "Canlı satır sayıları" : "Live row counts"}
          />
          <DataTable>
            <THead>
              <Th>{lang === "tr" ? "Tablo" : "Table"}</Th>
              <Th align="right">{lang === "tr" ? "Satır" : "Rows"}</Th>
              <Th align="right">{lang === "tr" ? "Boyut" : "Size"}</Th>
              <Th align="right">{lang === "tr" ? "İndeks" : "Index"}</Th>
            </THead>
            <TBody>
              {tables.map((t) => (
                <Tr key={t.name}>
                  <Td className="font-mono text-[12px] text-foreground/90">{t.name}</Td>
                  <Td align="right" className="nums font-semibold">
                    {formatNumber(t.rows)}
                  </Td>
                  <Td align="right" className="nums text-xs text-muted-foreground">
                    {t.size}
                  </Td>
                  <Td align="right" className="nums text-xs text-muted-foreground">
                    {t.index}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </DataTable>
        </Panel>

        <Panel className="xl:col-span-2">
          <PanelHeader
            title={lang === "tr" ? "Sorgu Performansı" : "Query Performance"}
            description={lang === "tr" ? "En sık çalışan sorgular (ms)" : "Most frequent queries (ms)"}
          />
          <PanelBody>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queries} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke={chartColors.grid} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: chartColors.axis }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    {...chartTooltip}
                    formatter={(v) => [`${v} ms`, ""]}
                  />
                  <Bar dataKey="ms" radius={[0, 3, 3, 0]} maxBarSize={16}>
                    {queries.map((q) => (
                      <Cell key={q.name} fill={q.ms > 30 ? chartColors.red : chartColors.gold} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
              {queries.map((q) => (
                <li key={q.name} className="flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-[10px] text-muted-foreground">{q.name}</span>
                  <span
                    className={`nums shrink-0 text-[11px] font-semibold ${
                      q.ms > 30 ? "text-[color:var(--danger-fg)]" : "text-gold-fg"
                    }`}
                  >
                    {q.ms} ms
                  </span>
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>
      </div>

      <Panel className="mt-3.5">
        <PanelHeader
          title={lang === "tr" ? "Yedekleme Geçmişi" : "Backup History"}
          description={lang === "tr" ? "Günlük otomatik yedek" : "Daily automated snapshots"}
        />
        <DataTable>
          <THead>
            <Th>{lang === "tr" ? "Zaman" : "Timestamp"}</Th>
            <Th align="right">{lang === "tr" ? "Boyut" : "Size"}</Th>
            <Th align="center">{lang === "tr" ? "Durum" : "Status"}</Th>
          </THead>
          <TBody>
            {backups.map((b) => (
              <Tr key={b.id}>
                <Td className="nums text-[12px] text-muted-foreground">{b.at}</Td>
                <Td align="right" className="nums text-[12px]">
                  {b.size}
                </Td>
                <Td align="center">
                  <Chip tone="success">{lang === "tr" ? "Tamamlandı" : "Completed"}</Chip>
                </Td>
              </Tr>
            ))}
          </TBody>
        </DataTable>
      </Panel>
    </div>
  );
}
