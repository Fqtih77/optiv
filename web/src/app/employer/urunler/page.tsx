"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, PackagePlus, Search, Boxes, AlertTriangle, Coins, Pencil } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StockBadge } from "@/components/shared/stock-badge";
import { LensSwatch } from "@/components/shared/lens-swatch";
import { Panel, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { Segmented } from "@/components/shared/segmented";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { getStockStatus } from "@/lib/stock-status";
import { stockValue } from "@/lib/analytics";
import { formatNumber, formatTRY } from "@/lib/format";
import type { Product, ProductType } from "@/lib/types";

const barColor: Record<string, string> = {
  STOKTA: "dot-success",
  AZALIYOR: "dot-warning",
  KRITIK: "dot-warning",
  TUKENDI: "dot-danger",
};

type TypeFilter = "ALL" | ProductType;

const emptyForm = {
  code: "",
  name: "",
  type: "FASHION" as ProductType,
  thicknessMm: 2,
  unitPrice: "",
  quantity: "",
  colorFrom: "#092040",
  colorTo: "#cc9d4a",
};

export default function ProductsPage() {
  const { t, lang } = useT();
  const products = useCommerceStore((s) => s.products);
  const addProduct = useCommerceStore((s) => s.addProduct);
  const restockProduct = useCommerceStore((s) => s.restockProduct);
  const updateProduct = useCommerceStore((s) => s.updateProduct);
  const actor = "Mehmet (İşveren)";

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [restockValues, setRestockValues] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [editing, setEditing] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (typeFilter !== "ALL" && p.type !== typeFilter) return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      }),
    [products, typeFilter, query]
  );

  const criticalCount = products.filter((p) =>
    ["KRITIK", "TUKENDI"].includes(getStockStatus(p.remaining))
  ).length;

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.name || !form.unitPrice || !form.quantity) {
      toast.error(lang === "tr" ? "Lütfen tüm alanları doldur." : "Please fill in all fields.");
      return;
    }
    addProduct({
      code: form.code,
      name: form.name,
      type: form.type,
      thicknessMm: Number(form.thicknessMm),
      unitPrice: Number(form.unitPrice),
      quantity: Number(form.quantity),
      colorFrom: form.colorFrom,
      colorTo: form.colorTo,
    });
    toast.success(lang === "tr" ? "Ürün eklendi ve stoğa işlendi." : "Product added to stock.");
    setForm(emptyForm);
    setOpen(false);
  }

  function handleRestock(productId: string) {
    const qty = Number(restockValues[productId]);
    if (!qty || qty <= 0) return;
    restockProduct(productId, qty, actor);
    setRestockValues((s) => ({ ...s, [productId]: "" }));
    toast.success(
      lang === "tr" ? `${qty} adet stok girişi yapıldı.` : `${qty} units added to stock.`
    );
  }

  function savePrice(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const price = Number(editPrice);
    if (!price || price <= 0) return;
    updateProduct(editing.id, { unitPrice: price }, actor);
    toast.success(lang === "tr" ? "Birim fiyat güncellendi." : "Unit price updated.");
    setEditing(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Envanter" : "Inventory"}
        title={lang === "tr" ? "Ürünlerim" : "My Products"}
        description={
          lang === "tr"
            ? "Toplam giren ve kalan stok ayrı takip edilir; stok girişi her iki kaleme birlikte işlenir."
            : "Total inbound and remaining stock are tracked separately; new entries hit both."
        }
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={<Button className="bg-primary text-primary-foreground hover:opacity-90" />}
            >
              <PackagePlus className="h-4 w-4" />
              {lang === "tr" ? "Yeni Ürün" : "New Product"}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{lang === "tr" ? "Yeni Ürün Ekle" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {lang === "tr" ? "Cam Numarası" : "Lens Code"}
                    </Label>
                    <Input
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="TRK-TRN-2"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {lang === "tr" ? "Kalınlık (mm)" : "Thickness (mm)"}
                    </Label>
                    <Input
                      type="number"
                      value={form.thicknessMm}
                      onChange={(e) => setForm({ ...form, thicknessMm: Number(e.target.value) })}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Cam Adı (Renk)" : "Lens Name (Color)"}
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="TURKUAZ - TURUNCU"
                    className="h-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {lang === "tr" ? "Tür" : "Type"}
                    </Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm({ ...form, type: v as ProductType })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FASHION">FASHION</SelectItem>
                        <SelectItem value="KLASIK">KLASİK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {lang === "tr" ? "Birim Fiyat (₺)" : "Unit Price (₺)"}
                    </Label>
                    <Input
                      type="number"
                      value={form.unitPrice}
                      onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Başlangıç Stok Adedi" : "Initial Stock"}
                  </Label>
                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {lang === "tr" ? "Renk 1" : "Color 1"}
                    </Label>
                    <Input
                      type="color"
                      value={form.colorFrom}
                      onChange={(e) => setForm({ ...form, colorFrom: e.target.value })}
                      className="h-9 p-1"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {lang === "tr" ? "Renk 2" : "Color 2"}
                    </Label>
                    <Input
                      type="color"
                      value={form.colorTo}
                      onChange={(e) => setForm({ ...form, colorTo: e.target.value })}
                      className="h-9 p-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-md border border-border bg-muted/50 p-3">
                  <LensSwatch colorFrom={form.colorFrom} colorTo={form.colorTo} className="h-12 w-12" />
                  <div>
                    <p className="text-[12px] font-medium">{form.name || "—"}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {form.code || "—"} · {form.type} · {form.thicknessMm}mm
                    </p>
                  </div>
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

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label={lang === "tr" ? "Ürün Çeşidi" : "Product Count"}
          value={String(products.length)}
          icon={Boxes}
          accent="accent"
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Kalan Stok" : "Remaining Stock"}
          value={formatNumber(products.reduce((s, p) => s + p.remaining, 0))}
          icon={Boxes}
          hint={`${lang === "tr" ? "Toplam giren" : "Total in"}: ${formatNumber(
            products.reduce((s, p) => s + p.totalIn, 0)
          )}`}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Kritik / Tükenen" : "Critical / Out"}
          value={String(criticalCount)}
          icon={AlertTriangle}
          accent={criticalCount > 0 ? "danger" : "success"}
          hint={lang === "tr" ? "yeniden alım gerekli" : "reorder needed"}
        />
        <StatCard
          index={3}
          label={lang === "tr" ? "Stok Değeri" : "Stock Value"}
          value={formatTRY(stockValue(products), { compact: true })}
          icon={Coins}
          accent="gold"
        />
      </div>

      <div className="mt-3.5 mb-3.5 flex flex-wrap items-center gap-2.5">
        <Segmented
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "ALL", label: lang === "tr" ? "Tümü" : "All", count: products.length },
            { value: "FASHION", label: "Fashion", count: products.filter((p) => p.type === "FASHION").length },
            { value: "KLASIK", label: "Klasik", count: products.filter((p) => p.type === "KLASIK").length },
          ]}
        />
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "tr" ? "Ürün adı veya kodu ara" : "Search name or code"}
            className="h-9 pl-9"
          />
        </div>
      </div>

      <Panel>
        {filtered.length === 0 ? (
          <EmptyState icon={Boxes} title={lang === "tr" ? "Ürün bulunamadı" : "No products found"} />
        ) : (
          <DataTable>
            <THead>
              <Th>{lang === "tr" ? "Ürün" : "Product"}</Th>
              <Th align="right">{lang === "tr" ? "Fiyat" : "Price"}</Th>
              <Th align="right">{lang === "tr" ? "Giren" : "In"}</Th>
              <Th align="right">{lang === "tr" ? "Kalan" : "Left"}</Th>
              <Th className="w-[150px]">{lang === "tr" ? "Kapasite" : "Capacity"}</Th>
              <Th align="center">{t("common.status")}</Th>
              <Th align="right" className="w-[170px]">
                {lang === "tr" ? "Stok Girişi" : "Stock In"}
              </Th>
            </THead>
            <TBody>
              {filtered.map((p) => {
                const pct = p.totalIn > 0 ? Math.round((p.remaining / p.totalIn) * 100) : 0;
                const status = getStockStatus(p.remaining);
                return (
                  <Tr key={p.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <LensSwatch
                          colorFrom={p.colorFrom}
                          colorTo={p.colorTo}
                          className="h-9 w-9 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium">{p.name}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {p.code} · {p.type} · {p.thicknessMm}mm
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td align="right">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setEditPrice(String(p.unitPrice));
                        }}
                        className="nums group inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:text-gold-fg"
                      >
                        {formatTRY(p.unitPrice)}
                        <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    </Td>
                    <Td align="right" className="nums text-xs text-muted-foreground">
                      {formatNumber(p.totalIn)}
                    </Td>
                    <Td align="right" className="nums font-semibold">
                      {formatNumber(p.remaining)}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${barColor[status]}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="nums w-8 text-right text-[11px] text-muted-foreground">{pct}%</span>
                      </div>
                    </Td>
                    <Td align="center">
                      <StockBadge remaining={p.remaining} lang={lang} />
                    </Td>
                    <Td align="right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Input
                          type="number"
                          min={1}
                          placeholder="0"
                          value={restockValues[p.id] ?? ""}
                          onChange={(e) =>
                            setRestockValues((s) => ({ ...s, [p.id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleRestock(p.id)}
                          className="nums h-8 w-20 text-center"
                        />
                        <button
                          onClick={() => handleRestock(p.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-foreground transition-colors hover:border-[color:var(--gold-border)] hover:text-gold-fg"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </TBody>
          </DataTable>
        )}
      </Panel>

      {/* Price edit dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{lang === "tr" ? "Birim Fiyat Güncelle" : "Update Unit Price"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={savePrice} className="space-y-4">
              <div className="flex items-center gap-3 rounded-md border border-border bg-muted/50 p-3">
                <LensSwatch
                  colorFrom={editing.colorFrom}
                  colorTo={editing.colorTo}
                  className="h-10 w-10"
                />
                <div>
                  <p className="text-[12px] font-medium">{editing.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {editing.code}
                  </p>
                </div>
                <Chip tone="neutral" className="ml-auto">
                  {lang === "tr" ? "Mevcut" : "Current"}: {formatTRY(editing.unitPrice)}
                </Chip>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {lang === "tr" ? "Yeni Birim Fiyat (₺)" : "New Unit Price (₺)"}
                </Label>
                <Input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="h-9"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                  {t("common.save")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
