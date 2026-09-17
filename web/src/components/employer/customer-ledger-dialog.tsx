"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Chip } from "@/components/shared/surface";
import { useCommerceStore } from "@/lib/store/commerce";
import { monthlySeries } from "@/lib/analytics";
import { formatDate, formatTRY, initials } from "@/lib/format";
import type { Customer } from "@/lib/types";

export function CustomerLedgerDialog({ customer, lang }: { customer: Customer; lang: "tr" | "en" }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const allPayments = useCommerceStore((s) => s.payments);
  const allOrders = useCommerceStore((s) => s.orders);
  const addPayment = useCommerceStore((s) => s.addPayment);

  const payments = allPayments.filter((p) => p.customerId === customer.id);
  const orders = allOrders.filter((o) => o.customerId === customer.id && o.status === "APPROVED");
  const series = monthlySeries({ payments, orders: allOrders }, { customerId: customer.id, months: 6, lang });
  const recent = [...payments].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);

  function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    addPayment(customer.id, value, date, "Mehmet (İşveren)");
    setAmount("");
    toast.success(lang === "tr" ? "Ödeme kaydedildi." : "Payment recorded.");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Wallet className="h-3.5 w-3.5" />
        {lang === "tr" ? "Cari Detay" : "Ledger"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-semibold text-white"
              style={{ backgroundColor: customer.avatarColor }}
            >
              {initials(customer.name)}
            </span>
            {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2.5">
            <p className="eyebrow">{lang === "tr" ? "Bakiye" : "Balance"}</p>
            <p
              className={`nums mt-1 text-[14px] font-semibold ${
                customer.balance > 0 ? "text-[color:var(--danger-fg)]" : "text-[color:var(--success-fg)]"
              }`}
            >
              {formatTRY(customer.balance)}
            </p>
          </div>
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2.5">
            <p className="eyebrow">{lang === "tr" ? "Ödeme" : "Paid"}</p>
            <p className="nums mt-1 text-[14px] font-semibold text-[color:var(--success-fg)]">
              {formatTRY(
                payments.reduce((s, p) => s + p.amount, 0),
                { compact: true }
              )}
            </p>
          </div>
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2.5">
            <p className="eyebrow">{lang === "tr" ? "Sipariş" : "Orders"}</p>
            <p className="nums mt-1 text-[14px] font-semibold text-gold-fg">
              {formatTRY(
                orders.reduce((s, o) => s + o.total, 0),
                { compact: true }
              )}
            </p>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-2">{lang === "tr" ? "Aylık Ödeme Özeti" : "Monthly Payments"}</p>
          <div className="grid grid-cols-3 gap-2">
            {series.map((m) => (
              <div
                key={m.key}
                className={`rounded-md border px-2.5 py-2 text-center ${
                  m.payments > 0
                    ? "border-[color:var(--success-border)] bg-[var(--success-bg)]"
                    : "border-border bg-muted/50"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                <p
                  className={`nums text-[12px] font-semibold ${
                    m.payments > 0 ? "text-[color:var(--success-fg)]" : "text-muted-foreground/50"
                  }`}
                >
                  {formatTRY(m.payments, { compact: true })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-2">{lang === "tr" ? "Son Ödemeler" : "Recent Payments"}</p>
          {recent.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {lang === "tr" ? "Ödeme kaydı yok." : "No payments yet."}
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-md border border-border">
              {recent.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-3 py-2">
                  <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    {formatDate(p.date)}
                    {p.note && <Chip tone="gold">{p.note}</Chip>}
                  </span>
                  <span className="nums text-[12px] font-semibold text-[color:var(--success-fg)]">
                    {formatTRY(p.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleAddPayment} className="flex items-end gap-2 border-t border-border pt-4">
          <div className="flex-1 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {lang === "tr" ? "Ödeme Tarihi" : "Date"}
            </Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9" />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {lang === "tr" ? "Tutar (₺)" : "Amount (₺)"}
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="nums h-9"
              placeholder="0"
            />
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" />
            {lang === "tr" ? "Ekle" : "Add"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
