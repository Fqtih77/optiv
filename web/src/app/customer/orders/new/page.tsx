"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus, Trash2, Send, Search, ShoppingBag, PackageX } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LensSwatch } from "@/components/shared/lens-swatch";
import { StockBadge } from "@/components/shared/stock-badge";
import { Panel, PanelHeader, PanelBody, Chip } from "@/components/shared/surface";
import { Segmented } from "@/components/shared/segmented";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";
import { useCommerceStore } from "@/lib/store/commerce";
import { useCartStore } from "@/lib/store/cart";
import { formatTRY } from "@/lib/format";
import type { ProductType } from "@/lib/types";

type TypeFilter = "ALL" | ProductType;

export default function NewOrderPage() {
  const router = useRouter();
  const { lang } = useT();
  const customerId = useSessionStore((s) => s.customerId);
  const products = useCommerceStore((s) => s.products);
  const createOrder = useCommerceStore((s) => s.createOrder);
  const { lines, setQuantity, removeLine, clear } = useCartStore();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (typeFilter !== "ALL" && p.type !== typeFilter) return false;
        if (onlyInStock && p.remaining <= 0) return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      }),
    [products, typeFilter, onlyInStock, query]
  );

  const cartRows = lines
    .map((l) => {
      const product = products.find((p) => p.id === l.productId);
      return product ? { ...l, product } : null;
    })
    .filter((r): r is { productId: string; quantity: number; product: (typeof products)[number] } => !!r);

  const total = cartRows.reduce((sum, r) => sum + r.quantity * r.product.unitPrice, 0);
  const totalUnits = cartRows.reduce((sum, r) => sum + r.quantity, 0);

  function handleQty(productId: string, remaining: number, raw: string | number) {
    const value = Math.max(0, Math.min(remaining, Number(raw) || 0));
    setQuantity(productId, value);
  }

  function submitOrder() {
    if (cartRows.length === 0) return;
    createOrder(
      customerId,
      cartRows.map((r) => ({
        productId: r.productId,
        quantity: r.quantity,
        unitPrice: r.product.unitPrice,
      }))
    );
    clear();
    toast.success(
      lang === "tr" ? "Siparişin gönderildi, onay bekliyor." : "Order submitted, awaiting approval."
    );
    router.push("/customer/orders");
  }

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Katalog" : "Catalog"}
        title={lang === "tr" ? "Sipariş Oluştur" : "Create Order"}
        description={
          lang === "tr"
            ? "Stoktaki camları seç, adet gir ve sağdaki sepetten siparişini tamamla."
            : "Pick lenses from stock, set quantities and complete the order from the cart."
        }
        action={
          <Chip tone={totalUnits > 0 ? "gold" : "neutral"}>
            <ShoppingBag className="h-3 w-3" />
            {totalUnits} {lang === "tr" ? "adet" : "pcs"}
          </Chip>
        }
      />

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "tr" ? "Cam adı veya kodu ara" : "Search lens name or code"}
                className="h-9 pl-9"
              />
            </div>
            <Segmented
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: "ALL", label: lang === "tr" ? "Tümü" : "All", count: products.length },
                {
                  value: "FASHION",
                  label: "Fashion",
                  count: products.filter((p) => p.type === "FASHION").length,
                },
                {
                  value: "KLASIK",
                  label: "Klasik",
                  count: products.filter((p) => p.type === "KLASIK").length,
                },
              ]}
            />
            <button
              onClick={() => setOnlyInStock((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                onlyInStock
                  ? "border-[color:var(--gold-border)] bg-[var(--gold-bg)] text-gold-fg"
                  : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang === "tr" ? "Sadece stokta" : "In stock only"}
            </button>
          </div>

          {filtered.length === 0 ? (
            <Panel>
              <EmptyState
                icon={PackageX}
                title={lang === "tr" ? "Sonuç bulunamadı" : "No results"}
                description={
                  lang === "tr" ? "Filtreleri değiştirmeyi dene." : "Try adjusting your filters."
                }
              />
            </Panel>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {filtered.map((p) => {
                const qty = lines.find((l) => l.productId === p.id)?.quantity ?? 0;
                const out = p.remaining <= 0;
                return (
                  <div
                    key={p.id}
                    className={`group rounded-xl border bg-card p-3 shadow-lift transition-all duration-300 ${
                      qty > 0
                        ? "border-[color:var(--gold-border)]"
                        : "border-border hover:border-border"
                    } ${out ? "opacity-55" : ""}`}
                  >
                    <div className="relative">
                      <LensSwatch
                        colorFrom={p.colorFrom}
                        colorTo={p.colorTo}
                        className="aspect-square w-full"
                      />
                      <div className="absolute left-2 top-2">
                        <StockBadge remaining={p.remaining} lang={lang} />
                      </div>
                      {qty > 0 && (
                        <span className="nums absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-md border border-[color:var(--gold-border)] bg-background/90 px-1.5 text-[11px] font-semibold text-gold-fg backdrop-blur">
                          {qty}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-0.5">
                      <p className="truncate text-[13px] font-medium text-foreground">{p.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {p.code} · {p.type} · {p.thicknessMm}mm
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-baseline justify-between">
                      <span className="nums text-[15px] font-semibold text-foreground">
                        {formatTRY(p.unitPrice)}
                      </span>
                      <span className="nums text-[11px] text-muted-foreground">
                        {p.remaining} {lang === "tr" ? "ad" : "pcs"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5">
                      <button
                        disabled={out || qty <= 0}
                        onClick={() => handleQty(p.id, p.remaining, qty - 1)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <Input
                        type="number"
                        min={0}
                        max={p.remaining}
                        value={qty}
                        disabled={out}
                        onChange={(e) => handleQty(p.id, p.remaining, e.target.value)}
                        className="nums h-8 text-center"
                      />
                      <button
                        disabled={out || qty >= p.remaining}
                        onClick={() => handleQty(p.id, p.remaining, qty + 1)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="xl:sticky xl:top-[88px] xl:self-start">
          <Panel>
            <PanelHeader
              title={lang === "tr" ? "Sepetim" : "My Cart"}
              description={`${cartRows.length} ${lang === "tr" ? "kalem" : "lines"} · ${totalUnits} ${
                lang === "tr" ? "adet" : "pcs"
              }`}
              action={
                cartRows.length > 0 ? (
                  <button
                    onClick={clear}
                    className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-[color:var(--danger-fg)]"
                  >
                    {lang === "tr" ? "Temizle" : "Clear"}
                  </button>
                ) : undefined
              }
            />

            {cartRows.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title={lang === "tr" ? "Sepetin boş" : "Your cart is empty"}
                description={
                  lang === "tr"
                    ? "Soldaki katalogdan cam seçerek başla."
                    : "Start by picking lenses from the catalog."
                }
              />
            ) : (
              <>
                <div className="max-h-[420px] divide-y divide-border overflow-y-auto scrollbar-thin">
                  {cartRows.map((r) => (
                    <div key={r.productId} className="flex items-start gap-3 px-5 py-3.5">
                      <LensSwatch
                        colorFrom={r.product.colorFrom}
                        colorTo={r.product.colorTo}
                        className="h-9 w-9 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium text-foreground">
                              {r.product.name}
                            </p>
                            <p className="nums text-[10px] uppercase tracking-wider text-muted-foreground">
                              {formatTRY(r.product.unitPrice)} × {r.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeLine(r.productId)}
                            className="shrink-0 text-muted-foreground/70 transition-colors hover:text-[color:var(--danger-fg)]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQty(r.productId, r.product.remaining, r.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <Input
                              type="number"
                              value={r.quantity}
                              min={0}
                              max={r.product.remaining}
                              onChange={(e) => handleQty(r.productId, r.product.remaining, e.target.value)}
                              className="nums h-6 w-12 px-1 text-center text-[11px]"
                            />
                            <button
                              onClick={() => handleQty(r.productId, r.product.remaining, r.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="nums text-[13px] font-semibold text-foreground">
                            {formatTRY(r.quantity * r.product.unitPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <PanelBody className="border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">{lang === "tr" ? "Genel Toplam" : "Order Total"}</span>
                    <span className="nums text-[20px] font-semibold tracking-tight text-foreground">
                      {formatTRY(total)}
                    </span>
                  </div>
                  <Button
                    onClick={submitOrder}
                    className="mt-4 w-full bg-primary text-primary-foreground hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                    {lang === "tr" ? "Siparişi Gönder" : "Submit Order"}
                  </Button>
                  <p className="mt-2.5 text-center text-[10px] leading-relaxed text-muted-foreground">
                    {lang === "tr"
                      ? "Sipariş işveren onayından sonra stoktan düşülür."
                      : "Stock is deducted after the employer approves."}
                  </p>
                </PanelBody>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
