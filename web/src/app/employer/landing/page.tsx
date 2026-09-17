"use client";

import { useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ExternalLink, ImagePlus, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Panel, PanelHeader, PanelBody, Chip } from "@/components/shared/surface";
import { Segmented } from "@/components/shared/segmented";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n/use-translation";
import { useLandingStore } from "@/lib/store/landing";
import { useState } from "react";

export default function LandingEditorPage() {
  const { lang } = useT();
  const [editLang, setEditLang] = useState<"tr" | "en">("tr");
  const copy = useLandingStore((s) => s[editLang]);
  const update = useLandingStore((s) => s.update);
  const bannerDataUrl = useLandingStore((s) => s.bannerDataUrl);
  const setBanner = useLandingStore((s) => s.setBanner);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBanner(reader.result as string);
      toast.success(lang === "tr" ? "Banner görseli güncellendi." : "Banner image updated.");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "İçerik" : "Content"}
        title={lang === "tr" ? "Landing Page Düzenleme" : "Landing Page Editor"}
        description={
          lang === "tr"
            ? "Ana sayfa metinlerini ve banner görselini düzenle; değişiklikler anında yayına alınır."
            : "Edit homepage copy and the banner image; changes go live instantly."
        }
        action={
          <Button
            variant="outline"
            render={<Link href="/" target="_blank" />}
            nativeButton={false}
          >
            <ExternalLink className="h-4 w-4" />
            {lang === "tr" ? "Siteyi Gör" : "View Site"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-5">
        <div className="space-y-3.5 xl:col-span-3">
          <Panel>
            <PanelHeader
              title={lang === "tr" ? "Hero Metinleri" : "Hero Copy"}
              description={lang === "tr" ? "Dil bazlı düzenleme" : "Per-language editing"}
              action={
                <Segmented
                  value={editLang}
                  onChange={setEditLang}
                  options={[
                    { value: "tr", label: "TR" },
                    { value: "en", label: "EN" },
                  ]}
                />
              }
            />
            <PanelBody className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {lang === "tr" ? "Üst Etiket (Badge)" : "Badge"}
                </Label>
                <Input
                  value={copy.badge}
                  onChange={(e) => update(editLang, { badge: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Başlık 1. Satır" : "Headline Line 1"}
                  </Label>
                  <Input
                    value={copy.title1}
                    onChange={(e) => update(editLang, { title1: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Başlık 2. Satır (vurgulu)" : "Headline Line 2 (accent)"}
                  </Label>
                  <Input
                    value={copy.title2}
                    onChange={(e) => update(editLang, { title2: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {lang === "tr" ? "Alt Başlık" : "Subheadline"}
                </Label>
                <Textarea
                  rows={3}
                  value={copy.subtitle}
                  onChange={(e) => update(editLang, { subtitle: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">
                  {copy.subtitle.length} {lang === "tr" ? "karakter" : "characters"}
                </p>
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader
              title={lang === "tr" ? "Banner Görseli" : "Banner Image"}
              description={
                lang === "tr"
                  ? "Hero bölümünün arka planında düşük opaklıkla kullanılır."
                  : "Used behind the hero section at low opacity."
              }
            />
            <PanelBody>
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="flex h-24 w-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/50"
                  style={
                    bannerDataUrl
                      ? {
                          backgroundImage: `url(${bannerDataUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  {!bannerDataUrl && <ImagePlus className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    {lang === "tr" ? "Görsel Yükle" : "Upload Image"}
                  </Button>
                  {bannerDataUrl && (
                    <Button variant="outline" className="text-[color:var(--danger-fg)]" onClick={() => setBanner(null)}>
                      <Trash2 className="h-4 w-4" />
                      {lang === "tr" ? "Kaldır" : "Remove"}
                    </Button>
                  )}
                </div>
              </div>
            </PanelBody>
          </Panel>
        </div>

        {/* Live preview */}
        <div className="xl:col-span-2">
          <Panel className="xl:sticky xl:top-[88px]">
            <PanelHeader
              title={lang === "tr" ? "Canlı Önizleme" : "Live Preview"}
              action={<Eye className="h-4 w-4 text-muted-foreground" />}
            />
            <PanelBody>
              <div className="relative overflow-hidden rounded-lg border border-border bg-background p-5">
                {bannerDataUrl && (
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.18]"
                    style={{
                      backgroundImage: `url(${bannerDataUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}
                <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
                <div className="relative">
                  <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-gold-fg">
                    {copy.badge || "—"}
                  </span>
                  <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-tight text-foreground">
                    {copy.title1 || "—"}
                    <br />
                    <span className="gold-text">{copy.title2 || "—"}</span>
                  </h3>
                  <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
                    {copy.subtitle || "—"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-md bg-white px-3 py-1.5 text-[10px] font-semibold text-background">
                      {editLang === "tr" ? "Panele Giriş Yap" : "Sign In to Panel"}
                    </span>
                    <span className="rounded-md border border-border px-3 py-1.5 text-[10px] font-medium text-foreground/80">
                      {editLang === "tr" ? "Nasıl Çalışır" : "How it works"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Chip tone="neutral">{editLang === "tr" ? "Türkçe içerik" : "English content"}</Chip>
                <Chip tone="success">{lang === "tr" ? "Yayında" : "Live"}</Chip>
              </div>
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  );
}
