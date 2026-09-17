"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Trash2, KeyRound, Users2, Search, Copy, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { formatDate, formatTRY, initials } from "@/lib/format";

function tempPassword() {
  return Math.random().toString(36).slice(-4) + Math.random().toString(36).slice(-4).toUpperCase();
}

export default function CustomerUsersPage() {
  const { t, lang } = useT();
  const customers = useCommerceStore((s) => s.customers);
  const addCustomer = useCommerceStore((s) => s.addCustomer);
  const removeCustomer = useCommerceStore((s) => s.removeCustomer);
  const resetPassword = useCommerceStore((s) => s.resetCustomerPassword);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [query, setQuery] = useState("");

  const visible = customers.filter((c) =>
    query.trim()
      ? c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      : true
  );

  const pendingFirstLogin = customers.filter((c) => c.mustChangePassword).length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error(lang === "tr" ? "Ad ve e-posta zorunludur." : "Name and email are required.");
      return;
    }
    addCustomer({
      name: form.name,
      email: form.email,
      phone: form.phone,
      avatarColor: "#163e6b",
      openingBalance: 0,
    });
    const password = tempPassword();
    setCreated({ email: form.email, password });
    setForm({ name: "", email: "", phone: "" });
    setOpen(false);
    toast.success(
      lang === "tr" ? "Hesap oluşturuldu, geçici şifre e-postayla gönderildi." : "Account created."
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Erişim" : "Access"}
        title={lang === "tr" ? "Kullanıcılar" : "Users"}
        description={
          lang === "tr"
            ? "Müşteri hesabı tanımla; geçici şifre e-postaya gider ve ilk girişte değiştirilmesi zorunlu tutulur."
            : "Create dealer accounts; a temporary password is emailed and must be changed on first login."
        }
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:opacity-90" />}>
              <UserPlus className="h-4 w-4" />
              {lang === "tr" ? "Yeni Müşteri" : "New Customer"}
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{lang === "tr" ? "Yeni Müşteri Hesabı" : "New Customer Account"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Bayi / Ad Soyad" : "Dealer / Full Name"}
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "E-posta" : "Email"}
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Telefon" : "Phone"}
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="h-9"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                    {t("common.add")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {created && (
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color:var(--gold-border)] bg-[var(--gold-bg)] px-5 py-4">
          <div>
            <p className="text-[13px] font-medium text-gold-fg">
              {lang === "tr" ? "Geçici şifre oluşturuldu" : "Temporary password generated"}
            </p>
            <p className="mt-0.5 text-[11px] text-gold-fg/70">
              {created.email} —{" "}
              {lang === "tr"
                ? "kullanıcı ilk girişte şifresini değiştirmek zorunda."
                : "the user must change it on first login."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="rounded-md border border-[color:var(--gold-border)] bg-background/60 px-3 py-1.5 font-mono text-[13px] text-gold-fg">
              {created.password}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(created.password);
                toast.success(lang === "tr" ? "Kopyalandı." : "Copied.");
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCreated(null)}>
              {lang === "tr" ? "Kapat" : "Dismiss"}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <StatCard
          index={0}
          label={lang === "tr" ? "Toplam Müşteri" : "Total Customers"}
          value={String(customers.length)}
          icon={Users2}
          accent="accent"
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "İlk Giriş Bekleyen" : "Pending First Login"}
          value={String(pendingFirstLogin)}
          icon={KeyRound}
          accent={pendingFirstLogin > 0 ? "gold" : "success"}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Borçlu Bayi" : "Dealers in Debt"}
          value={String(customers.filter((c) => c.balance > 0).length)}
          icon={Users2}
          accent="danger"
          hint={formatTRY(
            customers.reduce((s, c) => s + c.balance, 0),
            { compact: true }
          )}
        />
      </div>

      <div className="mt-3.5 mb-3.5 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === "tr" ? "İsim veya e-posta ara" : "Search name or email"}
          className="h-9 pl-9"
        />
      </div>

      <Panel>
        {visible.length === 0 ? (
          <EmptyState icon={Users2} title={lang === "tr" ? "Kullanıcı bulunamadı" : "No users found"} />
        ) : (
          <DataTable>
            <THead>
              <Th>{lang === "tr" ? "Müşteri" : "Customer"}</Th>
              <Th>{lang === "tr" ? "Telefon" : "Phone"}</Th>
              <Th>{lang === "tr" ? "Kayıt" : "Created"}</Th>
              <Th align="right">{lang === "tr" ? "Bakiye" : "Balance"}</Th>
              <Th align="center">{lang === "tr" ? "Şifre Durumu" : "Password"}</Th>
              <Th align="right">{t("common.actions")}</Th>
            </THead>
            <TBody>
              {visible.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold text-white"
                        style={{ backgroundColor: c.avatarColor }}
                      >
                        {initials(c.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">{c.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="nums text-xs text-muted-foreground">{c.phone || "—"}</Td>
                  <Td className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</Td>
                  <Td align="right">
                    <span
                      className={`nums text-[13px] font-semibold ${
                        c.balance > 0 ? "text-[color:var(--danger-fg)]" : "text-[color:var(--success-fg)]"
                      }`}
                    >
                      {formatTRY(c.balance)}
                    </span>
                  </Td>
                  <Td align="center">
                    <Chip tone={c.mustChangePassword ? "warning" : "success"}>
                      {c.mustChangePassword
                        ? lang === "tr"
                          ? "İlk giriş bekleniyor"
                          : "First login pending"
                        : lang === "tr"
                          ? "Aktif"
                          : "Active"}
                    </Chip>
                  </Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          resetPassword(c.id, "Mehmet (İşveren)");
                          setCreated({ email: c.email, password: tempPassword() });
                          toast.success(
                            lang === "tr" ? "Şifre sıfırlandı, yeni şifre gönderildi." : "Password reset."
                          );
                        }}
                        title={lang === "tr" ? "Şifreyi sıfırla" : "Reset password"}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-[color:var(--gold-border)] hover:text-gold-fg"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-[color:var(--danger-border)] hover:text-[color:var(--danger-fg)]" />
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {lang === "tr" ? `${c.name} hesabını sil?` : `Delete ${c.name}?`}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {lang === "tr"
                                ? "Bu işlem geri alınamaz. Müşteri artık panele giriş yapamayacak."
                                : "This cannot be undone. The customer will lose panel access."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel render={<Button variant="outline" />}>
                              {t("common.cancel")}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              render={<Button className="bg-[color:var(--danger-fg)] text-white hover:opacity-90" />}
                              onClick={() => {
                                removeCustomer(c.id);
                                toast.success(lang === "tr" ? "Hesap silindi." : "Account deleted.");
                              }}
                            >
                              {t("common.delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
