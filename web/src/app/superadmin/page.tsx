"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  Server,
  ShieldAlert,
  Users2,
  Database,
  Cpu,
  HardDrive,
  Mail,
  Filter,
  CalendarDays,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, PanelHeader, PanelBody, Chip, ArrowAction } from "@/components/shared/surface";
import { EmptyState } from "@/components/shared/empty-state";
import { LensOrb } from "@/components/visual/lens-orb";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { formatNumber, relativeTime } from "@/lib/format";
import { chartColors, chartTooltip } from "@/lib/chart-theme";

function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const services = [
  { name: "API Gateway", icon: Cpu, status: "ok", detail: "142 ms" },
  { name: "PostgreSQL", icon: Database, status: "ok", detail: "18 conn" },
  { name: "Object Storage", icon: HardDrive, status: "ok", detail: "2.4 GB" },
  { name: "SMTP / E-posta", icon: Mail, status: "warn", detail: "queue 3" },
] as const;

export default function SuperadminOverviewPage() {
  const { lang } = useT();
  const logs = useCommerceStore((s) => s.logs);
  const customers = useCommerceStore((s) => s.customers);
  const orders = useCommerceStore((s) => s.orders);
  const products = useCommerceStore((s) => s.products);

  const traffic = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        label: `${String(i).padStart(2, "0")}:00`,
        requests: Math.round(220 + seeded(i + 1) * 780),
        errors: Math.round(seeded(i + 50) * 6),
      })),
    []
  );

  const totalRequests = traffic.reduce((s, t) => s + t.requests, 0);
  const totalErrors = traffic.reduce((s, t) => s + t.errors, 0);
  const errorRate = ((totalErrors / totalRequests) * 100).toFixed(2);
  const recentEvents = logs.slice(0, 7);

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Platform" : "Platform"}
        title={lang === "tr" ? "Genel Bakış" : "Overview"}
        description={
          lang === "tr"
            ? "Sistem sağlığı, trafik, servis durumu ve tüm rollerdeki aktivite akışı."
            : "System health, traffic, services and activity across all roles."
        }
        action={
          <>
            <button className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">
              <Filter className="h-3.5 w-3.5" />
              {lang === "tr" ? "Filtre" : "Filter"}
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {lang === "tr" ? "Son 24 saat" : "Last 24h"}
            </button>
            <Chip tone="success" dot className="h-10 rounded-full px-4 text-[12.5px]">
              {lang === "tr" ? "Tüm sistemler çalışıyor" : "All systems operational"}
            </Chip>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel index={0} className="lg:col-span-8">
          <PanelHeader
            title={lang === "tr" ? "24 saatlik istek trafiği" : "24h request traffic"}
            description={lang === "tr" ? "Saatlik istek ve hata dağılımı" : "Hourly requests and errors"}
            action={
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="dot-accent h-1.5 w-1.5 rounded-full" />
                  {lang === "tr" ? "İstek" : "Requests"}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="dot-danger h-1.5 w-1.5 rounded-full" />
                  {lang === "tr" ? "Hata" : "Errors"}
                </span>
              </div>
            }
          />
          <PanelBody>
            <div className="flex flex-wrap items-baseline gap-8">
              <div>
                <p className="eyebrow">{lang === "tr" ? "Toplam istek" : "Total requests"}</p>
                <p className="display nums mt-1.5 text-[26px] text-foreground">
                  {formatNumber(totalRequests)}
                </p>
              </div>
              <div>
                <p className="eyebrow">{lang === "tr" ? "Hata oranı" : "Error rate"}</p>
                <p className="display nums mt-1.5 text-[26px] text-foreground">{errorRate}%</p>
              </div>
              <div>
                <p className="eyebrow">{lang === "tr" ? "Ortalama yanıt" : "Avg. response"}</p>
                <p className="display nums mt-1.5 text-[26px] text-foreground">142 ms</p>
              </div>
            </div>
            <div className="mt-5 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={traffic} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reqFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-fg)" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="var(--accent-fg)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={chartColors.grid} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 9.5, fill: chartColors.axis }}
                    axisLine={false}
                    tickLine={false}
                    interval={3}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: chartColors.axis }}
                    axisLine={false}
                    tickLine={false}
                    width={38}
                  />
                  <Tooltip {...chartTooltip} />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    name={lang === "tr" ? "İstek" : "Requests"}
                    stroke="var(--accent-fg)"
                    strokeWidth={1.75}
                    fill="url(#reqFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="errors"
                    name={lang === "tr" ? "Hata" : "Errors"}
                    stroke="var(--danger-fg)"
                    strokeWidth={1.5}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PanelBody>
        </Panel>

        <Panel index={1} className="lg:col-span-4">
          <div aria-hidden className="absolute inset-0 bg-dots opacity-50" />
          <PanelHeader
            title={lang === "tr" ? "Servis durumu" : "Service status"}
            description={lang === "tr" ? "Canlı sağlık kontrolü" : "Live health checks"}
            action={<ArrowAction href="/superadmin/veritabani" />}
          />
          <PanelBody className="relative">
            <div className="flex justify-center py-1">
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <LensOrb size={118} />
              </motion.div>
            </div>
            <div className="mt-4 space-y-2">
              {services.map((s) => (
                <div
                  key={s.name}
                  className="surface-quiet flex items-center justify-between rounded-2xl px-3.5 py-2.5"
                >
                  <span className="flex items-center gap-2.5">
                    <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[12.5px] text-foreground">{s.name}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="nums text-[11px] text-muted-foreground">{s.detail}</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        s.status === "ok" ? "dot-success" : "dot-warning"
                      }`}
                    />
                  </span>
                </div>
              ))}
            </div>
          </PanelBody>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label={lang === "tr" ? "Çalışma süresi" : "Uptime"}
          value="99.98%"
          icon={Server}
          accent="success"
          hint={lang === "tr" ? "son 30 gün" : "last 30 days"}
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "24s istek" : "Requests (24h)"}
          value={formatNumber(totalRequests)}
          icon={Activity}
          accent="accent"
          spark={traffic.map((t) => t.requests)}
          delta="8%"
          deltaTone="up"
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Hata oranı" : "Error rate"}
          value={`${errorRate}%`}
          icon={ShieldAlert}
          accent={Number(errorRate) > 1 ? "danger" : "success"}
          hint={`${totalErrors} ${lang === "tr" ? "hata / 24s" : "errors / 24h"}`}
          spark={traffic.map((t) => t.errors)}
          sparkColor={chartColors.red}
        />
        <StatCard
          index={3}
          label={lang === "tr" ? "Kayıtlı kullanıcı" : "Registered users"}
          value={String(customers.length + 2)}
          icon={Users2}
          accent="gold"
          hint={`${orders.length} ${lang === "tr" ? "sipariş · " : "orders · "}${products.length} ${
            lang === "tr" ? "ürün" : "products"
          }`}
        />
      </div>

      <Panel index={0} className="mt-4">
        <PanelHeader
          title={lang === "tr" ? "Son aktivite" : "Recent activity"}
          description={lang === "tr" ? "Tüm rollerdeki hareketler" : "Activity across every role"}
          action={<ArrowAction href="/superadmin/logs" label={lang === "tr" ? "Tüm loglar" : "All logs"} />}
        />
        {recentEvents.length === 0 ? (
          <EmptyState icon={Activity} title={lang === "tr" ? "Aktivite yok" : "No activity"} />
        ) : (
          <PanelBody className="divide-y divide-border pt-0">
            {recentEvents.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-[13px] text-foreground">{e.message}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{e.actor}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {relativeTime(e.date, lang)}
                </span>
              </div>
            ))}
          </PanelBody>
        )}
      </Panel>
    </div>
  );
}
