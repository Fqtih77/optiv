"use client";

import { useMemo, useState } from "react";
import { Search, ScrollText, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Panel, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { Segmented } from "@/components/shared/segmented";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { formatDateTime, relativeTime } from "@/lib/format";
import type { LogType } from "@/lib/types";

type Filter = "ALL" | LogType;

const toneFor: Record<LogType, "gold" | "success" | "neutral" | "warning" | "danger"> = {
  ORDER: "gold",
  PRODUCT: "neutral",
  PAYMENT: "success",
  AUTH: "warning",
  SYSTEM: "neutral",
};

export default function SuperadminLogsPage() {
  const { lang } = useT();
  const logs = useCommerceStore((s) => s.logs);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const labels: Record<LogType, string> = {
    ORDER: lang === "tr" ? "Sipariş" : "Order",
    PRODUCT: lang === "tr" ? "Ürün" : "Product",
    PAYMENT: lang === "tr" ? "Ödeme" : "Payment",
    AUTH: lang === "tr" ? "Kimlik" : "Auth",
    SYSTEM: lang === "tr" ? "Sistem" : "System",
  };

  const filtered = useMemo(
    () =>
      logs
        .filter((l) => filter === "ALL" || l.type === filter)
        .filter((l) =>
          query.trim()
            ? l.message.toLowerCase().includes(query.toLowerCase()) ||
              l.actor.toLowerCase().includes(query.toLowerCase())
            : true
        )
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [logs, filter, query]
  );

  const counts = (type: LogType) => logs.filter((l) => l.type === type).length;

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Denetim" : "Audit"}
        title={lang === "tr" ? "Aktivite Logları" : "Activity Logs"}
        description={
          lang === "tr"
            ? "Sipariş, ürün, ödeme, kimlik ve sistem olaylarının tamamı tek akışta, kullanıcı ve zaman damgasıyla."
            : "Every order, product, payment, auth and system event in one stream with user and timestamp."
        }
        action={
          <Button variant="outline">
            <Download className="h-4 w-4" />
            {lang === "tr" ? "CSV İndir" : "Export CSV"}
          </Button>
        }
      />

      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "ALL", label: lang === "tr" ? "Tümü" : "All", count: logs.length },
            { value: "ORDER", label: labels.ORDER, count: counts("ORDER") },
            { value: "PRODUCT", label: labels.PRODUCT, count: counts("PRODUCT") },
            { value: "PAYMENT", label: labels.PAYMENT, count: counts("PAYMENT") },
            { value: "AUTH", label: labels.AUTH, count: counts("AUTH") },
            { value: "SYSTEM", label: labels.SYSTEM, count: counts("SYSTEM") },
          ]}
        />
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "tr" ? "Mesaj veya kullanıcı ara" : "Search message or actor"}
            className="h-9 pl-9"
          />
        </div>
      </div>

      <Panel>
        {filtered.length === 0 ? (
          <EmptyState icon={ScrollText} title={lang === "tr" ? "Kayıt bulunamadı" : "No records found"} />
        ) : (
          <DataTable>
            <THead>
              <Th className="w-[170px]">{lang === "tr" ? "Zaman" : "Timestamp"}</Th>
              <Th className="w-[110px]">{lang === "tr" ? "Tür" : "Type"}</Th>
              <Th>{lang === "tr" ? "Olay" : "Event"}</Th>
              <Th className="w-[160px]">{lang === "tr" ? "Kullanıcı" : "Actor"}</Th>
              <Th align="right" className="w-[110px]">
                {lang === "tr" ? "Geçen süre" : "Age"}
              </Th>
            </THead>
            <TBody>
              {filtered.map((l) => (
                <Tr key={l.id}>
                  <Td className="nums whitespace-nowrap text-[11px] text-muted-foreground">
                    {formatDateTime(l.date)}
                  </Td>
                  <Td>
                    <Chip tone={toneFor[l.type]}>{labels[l.type]}</Chip>
                  </Td>
                  <Td>
                    <span className="text-[13px] text-foreground/90">{l.message}</span>
                    {l.meta && (
                      <span className="ml-2 text-[11px] text-muted-foreground">({l.meta})</span>
                    )}
                  </Td>
                  <Td className="text-[12px] text-muted-foreground">{l.actor}</Td>
                  <Td align="right" className="text-[11px] text-muted-foreground">
                    {relativeTime(l.date, lang)}
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
