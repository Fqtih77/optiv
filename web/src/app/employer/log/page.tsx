"use client";

import { useState } from "react";
import { ClipboardList, Package, Wallet, ScrollText, Search, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Panel, PanelBody, Chip } from "@/components/shared/surface";
import { Segmented } from "@/components/shared/segmented";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { formatDateTime, relativeTime } from "@/lib/format";
import type { LogType } from "@/lib/types";

type Filter = "ALL" | LogType;

const iconFor: Record<LogType, typeof ClipboardList> = {
  ORDER: ClipboardList,
  PRODUCT: Package,
  PAYMENT: Wallet,
  AUTH: ShieldCheck,
  SYSTEM: ScrollText,
};

const toneFor: Record<LogType, "gold" | "success" | "neutral" | "warning"> = {
  ORDER: "gold",
  PRODUCT: "neutral",
  PAYMENT: "success",
  AUTH: "warning",
  SYSTEM: "neutral",
};

export default function EmployerLogPage() {
  const { lang } = useT();
  const logs = useCommerceStore((s) => s.logs);
  const [filter, setFilter] = useState<Filter>("ORDER");
  const [query, setQuery] = useState("");

  const labels: Record<LogType, string> = {
    ORDER: lang === "tr" ? "Sipariş" : "Order",
    PRODUCT: lang === "tr" ? "Ürün" : "Product",
    PAYMENT: lang === "tr" ? "Ödeme" : "Payment",
    AUTH: lang === "tr" ? "Kimlik" : "Auth",
    SYSTEM: lang === "tr" ? "Sistem" : "System",
  };

  const counts = {
    ALL: logs.length,
    ORDER: logs.filter((l) => l.type === "ORDER").length,
    PRODUCT: logs.filter((l) => l.type === "PRODUCT").length,
    PAYMENT: logs.filter((l) => l.type === "PAYMENT").length,
  };

  const visible = logs
    .filter((l) => filter === "ALL" || l.type === filter)
    .filter((l) =>
      query.trim()
        ? l.message.toLowerCase().includes(query.toLowerCase()) ||
          l.actor.toLowerCase().includes(query.toLowerCase())
        : true
    );

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Kayıtlar" : "Records"}
        title={lang === "tr" ? "Log Sayfası" : "Logs"}
        description={
          lang === "tr"
            ? "Sipariş, ürün ve ödeme hareketleri ayrı ayrı izlenebilir; her kayıt kullanıcı ve zaman damgasıyla saklanır."
            : "Order, product and payment activity tracked separately, each stamped with user and time."
        }
      />

      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "ORDER", label: `${labels.ORDER} ${lang === "tr" ? "Logları" : "Logs"}`, count: counts.ORDER },
            { value: "PRODUCT", label: `${labels.PRODUCT} ${lang === "tr" ? "Logları" : "Logs"}`, count: counts.PRODUCT },
            { value: "PAYMENT", label: `${labels.PAYMENT} ${lang === "tr" ? "Logları" : "Logs"}`, count: counts.PAYMENT },
            { value: "ALL", label: lang === "tr" ? "Tümü" : "All", count: counts.ALL },
          ]}
        />
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "tr" ? "Log ara" : "Search logs"}
            className="h-9 pl-9"
          />
        </div>
      </div>

      <Panel>
        {visible.length === 0 ? (
          <EmptyState icon={ScrollText} title={lang === "tr" ? "Kayıt bulunamadı" : "No records found"} />
        ) : (
          <PanelBody>
            <ol className="relative space-y-0">
              <span
                aria-hidden
                className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-white/[0.12] via-white/[0.07] to-transparent"
              />
              {visible.map((l) => {
                const Icon = iconFor[l.type];
                return (
                  <li key={l.id} className="relative flex gap-4 py-3.5">
                    <span className="relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip tone={toneFor[l.type]}>{labels[l.type]}</Chip>
                        <span className="text-[11px] text-muted-foreground">
                          {relativeTime(l.date, lang)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/90">{l.message}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {l.actor} · {formatDateTime(l.date)}
                        {l.meta && ` · ${l.meta}`}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </PanelBody>
        )}
      </Panel>
    </div>
  );
}
