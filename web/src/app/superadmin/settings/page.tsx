"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Flag, Server, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Panel, PanelHeader, PanelBody, Chip } from "@/components/shared/surface";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";

export default function SuperadminSettingsPage() {
  const { lang } = useT();
  const resetToSeed = useCommerceStore((s) => s.resetToSeed);

  const [flags, setFlags] = useState({
    maintenance: false,
    newOrderEmail: true,
    lowStockAlerts: true,
    publicLanding: true,
    betaReports: false,
  });

  const flagRows = [
    {
      key: "maintenance" as const,
      tr: "Bakım modu — siteyi geçici olarak kapat",
      en: "Maintenance mode — temporarily close the site",
      critical: true,
    },
    {
      key: "publicLanding" as const,
      tr: "Tanıtım sayfası herkese açık",
      en: "Landing page publicly accessible",
    },
    {
      key: "newOrderEmail" as const,
      tr: "Yeni siparişte işverene e-posta gönder",
      en: "Email employer on new orders",
    },
    {
      key: "lowStockAlerts" as const,
      tr: "Kritik stok seviyesinde otomatik uyarı",
      en: "Automatic alerts at critical stock levels",
    },
    {
      key: "betaReports" as const,
      tr: "Gelişmiş raporlar (beta)",
      en: "Advanced reports (beta)",
    },
  ];

  const env = [
    { label: lang === "tr" ? "Uygulama" : "Application", value: "Optiv Web" },
    { label: "Frontend", value: "Next.js 16 · React 19" },
    { label: "Backend", value: "FastAPI (planlanıyor)" },
    { label: "Database", value: "PostgreSQL 16" },
    { label: lang === "tr" ? "Ortam" : "Environment", value: "development · mock data" },
    { label: lang === "tr" ? "Sürüm" : "Version", value: "0.2.0" },
  ];

  return (
    <div className="max-w-4xl">
      <PageHeader
        eyebrow={lang === "tr" ? "Sistem" : "System"}
        title={lang === "tr" ? "Ayarlar" : "Settings"}
        description={
          lang === "tr"
            ? "Platform geneli özellik bayrakları, ortam bilgisi ve bakım işlemleri."
            : "Platform-wide feature flags, environment info and maintenance actions."
        }
      />

      <div className="space-y-3.5">
        <Panel>
          <PanelHeader
            title={lang === "tr" ? "Özellik Bayrakları" : "Feature Flags"}
            description={lang === "tr" ? "Anında yürürlüğe girer" : "Applied immediately"}
            action={<Flag className="h-4 w-4 text-muted-foreground" />}
          />
          <PanelBody className="divide-y divide-border py-0">
            {flagRows.map((row) => (
              <div key={row.key} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <Label className="text-[13px] font-normal text-foreground/90">
                    {lang === "tr" ? row.tr : row.en}
                  </Label>
                  {row.critical && (
                    <Chip tone="danger" className="ml-2">
                      {lang === "tr" ? "kritik" : "critical"}
                    </Chip>
                  )}
                </div>
                <Switch
                  checked={flags[row.key]}
                  onCheckedChange={(v) => {
                    setFlags({ ...flags, [row.key]: v });
                    toast.success(
                      lang === "tr" ? "Ayar güncellendi." : "Setting updated."
                    );
                  }}
                />
              </div>
            ))}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader
            title={lang === "tr" ? "Ortam Bilgisi" : "Environment"}
            action={<Server className="h-4 w-4 text-muted-foreground" />}
          />
          <PanelBody>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {env.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 border-b border-border pb-2">
                  <dt className="text-[12px] text-muted-foreground">{row.label}</dt>
                  <dd className="font-mono text-[12px] text-foreground/90">{row.value}</dd>
                </div>
              ))}
            </dl>
          </PanelBody>
        </Panel>

        <div className="rounded-xl border border-[color:var(--danger-border)] bg-[var(--danger-bg)] p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[color:var(--danger-fg)]" />
            <h3 className="text-[13px] font-semibold text-[color:var(--danger-fg)]">
              {lang === "tr" ? "Tehlikeli Bölge" : "Danger Zone"}
            </h3>
          </div>
          <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-[color:var(--danger-fg)]/70">
            {lang === "tr"
              ? "Bu işlem tüm demo verisini (ürün, sipariş, müşteri, ödeme, log) başlangıç durumuna döndürür. Geri alınamaz."
              : "This resets all demo data (products, orders, customers, payments, logs) to its initial state. It cannot be undone."}
          </p>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="outline"
                  className="mt-4 border-[color:var(--danger-border)] text-[color:var(--danger-fg)] hover:bg-[var(--danger-bg)]"
                />
              }
            >
              <RotateCcw className="h-4 w-4" />
              {lang === "tr" ? "Demo Verisini Sıfırla" : "Reset Demo Data"}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {lang === "tr" ? "Demo verisi sıfırlansın mı?" : "Reset demo data?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {lang === "tr"
                    ? "Tüm test değişiklikleri (yeni sipariş, ödeme, ürün, kullanıcı) silinecek."
                    : "All test changes (orders, payments, products, users) will be lost."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel render={<Button variant="outline" />}>
                  {lang === "tr" ? "İptal" : "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction
                  render={<Button className="bg-[color:var(--danger-fg)] text-white hover:opacity-90" />}
                  onClick={() => {
                    resetToSeed();
                    toast.success(lang === "tr" ? "Demo verisi sıfırlandı." : "Demo data reset.");
                  }}
                >
                  {lang === "tr" ? "Sıfırla" : "Reset"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
