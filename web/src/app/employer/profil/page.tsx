"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Building2, KeyRound, Bell, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Panel, PanelHeader, PanelBody, Chip } from "@/components/shared/surface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";
import { useCommerceStore } from "@/lib/store/commerce";
import { formatTRY, initials } from "@/lib/format";
import { stockValue } from "@/lib/analytics";

export default function EmployerProfilePage() {
  const { lang } = useT();
  const employer = useSessionStore((s) => s.employer);
  const products = useCommerceStore((s) => s.products);
  const customers = useCommerceStore((s) => s.customers);
  const orders = useCommerceStore((s) => s.orders);

  const [company, setCompany] = useState({
    name: "Optiv Optik Toptan",
    owner: employer.name,
    email: employer.email,
    phone: employer.phone,
    taxNo: "1234567890",
    address: "Bursa, Türkiye",
  });
  const [notify, setNotify] = useState({ newOrder: true, lowStock: true, payment: false });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    toast.success(lang === "tr" ? "İşletme bilgileri kaydedildi." : "Business details saved.");
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.next.length < 6) {
      toast.error(lang === "tr" ? "Şifre en az 6 karakter olmalı." : "Minimum 6 characters.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error(lang === "tr" ? "Şifreler eşleşmiyor." : "Passwords do not match.");
      return;
    }
    setPasswords({ current: "", next: "", confirm: "" });
    toast.success(lang === "tr" ? "Şifre güncellendi." : "Password updated.");
  }

  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow={lang === "tr" ? "Hesap" : "Account"}
        title={lang === "tr" ? "İşletme Profili" : "Business Profile"}
        description={
          lang === "tr"
            ? "İşletme bilgileri, bildirim tercihleri ve giriş güvenliği."
            : "Business details, notification preferences and sign-in security."
        }
      />

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <Panel>
          <PanelBody className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-primary text-2xl font-semibold text-white">
              {initials(company.name)}
            </div>
            <p className="mt-4 text-[15px] font-semibold">{company.name}</p>
            <p className="text-xs text-muted-foreground">{company.owner}</p>
            <Chip tone="gold" className="mt-3">
              {lang === "tr" ? "İşveren Hesabı" : "Employer Account"}
            </Chip>

            <div className="mt-6 grid w-full grid-cols-3 gap-2 border-t border-border pt-4">
              <div>
                <p className="eyebrow">{lang === "tr" ? "Bayi" : "Dealers"}</p>
                <p className="nums mt-1 text-[15px] font-semibold">{customers.length}</p>
              </div>
              <div>
                <p className="eyebrow">{lang === "tr" ? "Ürün" : "Products"}</p>
                <p className="nums mt-1 text-[15px] font-semibold">{products.length}</p>
              </div>
              <div>
                <p className="eyebrow">{lang === "tr" ? "Sipariş" : "Orders"}</p>
                <p className="nums mt-1 text-[15px] font-semibold">{orders.length}</p>
              </div>
            </div>

            <div className="mt-4 w-full rounded-md border border-border bg-muted/50 px-3 py-2.5 text-left">
              <p className="eyebrow">{lang === "tr" ? "Stok Değeri" : "Stock Value"}</p>
              <p className="nums mt-1 text-[15px] font-semibold text-gold-fg">
                {formatTRY(stockValue(products), { compact: true })}
              </p>
            </div>
          </PanelBody>
        </Panel>

        <div className="space-y-3.5 lg:col-span-2">
          <Panel>
            <PanelHeader
              title={lang === "tr" ? "İşletme Bilgileri" : "Business Details"}
              action={<Building2 className="h-4 w-4 text-muted-foreground" />}
            />
            <form onSubmit={saveCompany}>
              <PanelBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "İşletme Adı" : "Business Name"}
                  </Label>
                  <Input
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Yetkili" : "Owner"}
                  </Label>
                  <Input
                    value={company.owner}
                    onChange={(e) => setCompany({ ...company, owner: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "E-posta" : "Email"}
                  </Label>
                  <Input
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Telefon" : "Phone"}
                  </Label>
                  <Input
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Vergi No" : "Tax ID"}
                  </Label>
                  <Input
                    value={company.taxNo}
                    onChange={(e) => setCompany({ ...company, taxNo: e.target.value })}
                    className="nums h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Adres" : "Address"}
                  </Label>
                  <Input
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    className="h-9"
                  />
                </div>
              </PanelBody>
              <div className="flex justify-end border-t border-border px-5 py-4">
                <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                  {lang === "tr" ? "Kaydet" : "Save"}
                </Button>
              </div>
            </form>
          </Panel>

          <Panel>
            <PanelHeader
              title={lang === "tr" ? "Bildirim Tercihleri" : "Notification Preferences"}
              action={<Bell className="h-4 w-4 text-muted-foreground" />}
            />
            <PanelBody className="space-y-4">
              {[
                {
                  key: "newOrder" as const,
                  tr: "Yeni sipariş geldiğinde e-posta gönder",
                  en: "Email me on new orders",
                },
                {
                  key: "lowStock" as const,
                  tr: "Kritik stok seviyesinde uyarı gönder",
                  en: "Alert me at critical stock levels",
                },
                {
                  key: "payment" as const,
                  tr: "Ödeme kaydedildiğinde bildir",
                  en: "Notify when a payment is recorded",
                },
              ].map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-4">
                  <Label className="text-[13px] font-normal text-foreground/85">
                    {lang === "tr" ? row.tr : row.en}
                  </Label>
                  <Switch
                    checked={notify[row.key]}
                    onCheckedChange={(v) => setNotify({ ...notify, [row.key]: v })}
                  />
                </div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader
              title={lang === "tr" ? "Şifre Değiştir" : "Change Password"}
              action={<KeyRound className="h-4 w-4 text-muted-foreground" />}
            />
            <form onSubmit={savePassword}>
              <PanelBody className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Mevcut" : "Current"}
                  </Label>
                  <Input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Yeni" : "New"}
                  </Label>
                  <Input
                    type="password"
                    value={passwords.next}
                    onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Tekrar" : "Confirm"}
                  </Label>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="h-9"
                  />
                </div>
              </PanelBody>
              <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {lang === "tr" ? "Şifreler hash'lenerek saklanır" : "Passwords are stored hashed"}
                </span>
                <Button type="submit" variant="outline">
                  {lang === "tr" ? "Güncelle" : "Update"}
                </Button>
              </div>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  );
}
