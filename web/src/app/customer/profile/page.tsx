"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, KeyRound, ShieldCheck, User } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Panel, PanelHeader, PanelBody, Chip } from "@/components/shared/surface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";
import { useCommerceStore, useCustomer } from "@/lib/store/commerce";
import { formatDate, initials } from "@/lib/format";

const avatarPresets = [
  "#092040",
  "#163e6b",
  "#2c5a8c",
  "#4f7cae",
  "#cc9d4a",
  "#946623",
  "#1f2937",
  "#374151",
];

export default function CustomerProfilePage() {
  const { lang } = useT();
  const customerId = useSessionStore((s) => s.customerId);
  const customer = useCustomer(customerId);
  const updateProfile = useCommerceStore((s) => s.updateCustomerProfile);

  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!customer) return;
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
  }, [customer?.id]);

  if (!customer) return null;

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    updateProfile(customerId, { name, email, phone });
    toast.success(lang === "tr" ? "Profil bilgilerin güncellendi." : "Profile updated.");
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      toast.error(lang === "tr" ? "Mevcut şifreni girmelisin." : "Enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error(lang === "tr" ? "Yeni şifre en az 6 karakter olmalı." : "Minimum 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(lang === "tr" ? "Şifreler eşleşmiyor." : "Passwords do not match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success(lang === "tr" ? "Şifren değiştirildi." : "Password changed.");
  }

  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow={lang === "tr" ? "Hesap" : "Account"}
        title={lang === "tr" ? "Profilim" : "My Profile"}
        description={
          lang === "tr"
            ? "İletişim bilgilerini, avatarını ve şifreni buradan yönet."
            : "Manage your contact details, avatar and password."
        }
      />

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <Panel className="lg:col-span-1">
          <PanelBody className="flex flex-col items-center text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-xl border border-border text-2xl font-semibold text-white"
              style={{ backgroundColor: customer.avatarColor }}
            >
              {initials(name || customer.name)}
            </div>
            <p className="mt-4 text-[15px] font-semibold text-foreground">{customer.name}</p>
            <p className="text-xs text-muted-foreground">{customer.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Chip tone="gold">{lang === "tr" ? "Bayi Hesabı" : "Dealer Account"}</Chip>
              <Chip tone={customer.mustChangePassword ? "warning" : "success"}>
                {customer.mustChangePassword
                  ? lang === "tr"
                    ? "İlk giriş bekleniyor"
                    : "First login pending"
                  : lang === "tr"
                    ? "Doğrulanmış"
                    : "Verified"}
              </Chip>
            </div>

            <div className="mt-6 w-full border-t border-border pt-4">
              <p className="eyebrow mb-2.5">{lang === "tr" ? "Profil İkonu" : "Profile Icon"}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {avatarPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProfile(customerId, { avatarColor: color })}
                    className="relative h-7 w-7 rounded-md border border-border transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                  >
                    {customer.avatarColor === color && (
                      <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 w-full space-y-2 border-t border-border pt-4 text-left">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{lang === "tr" ? "Kayıt tarihi" : "Member since"}</span>
                <span className="nums text-foreground/80">{formatDate(customer.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{lang === "tr" ? "Hesap no" : "Account ID"}</span>
                <span className="font-mono text-foreground/80">#{customer.id.toUpperCase()}</span>
              </div>
            </div>
          </PanelBody>
        </Panel>

        <div className="space-y-3.5 lg:col-span-2">
          <Panel>
            <PanelHeader
              title={lang === "tr" ? "İletişim Bilgileri" : "Contact Details"}
              description={
                lang === "tr" ? "Siparişler bu bilgilerle işlenir." : "Orders are processed with these details."
              }
              action={<User className="h-4 w-4 text-muted-foreground" />}
            />
            <form onSubmit={saveProfile}>
              <PanelBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Ad Soyad" : "Full Name"}
                  </Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Telefon" : "Phone"}
                  </Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "E-posta" : "Email"}
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9"
                  />
                </div>
              </PanelBody>
              <div className="flex justify-end border-t border-border px-5 py-4">
                <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                  {lang === "tr" ? "Bilgileri Kaydet" : "Save Details"}
                </Button>
              </div>
            </form>
          </Panel>

          <Panel>
            <PanelHeader
              title={lang === "tr" ? "Şifre Değiştir" : "Change Password"}
              description={
                lang === "tr"
                  ? "En az 6 karakter, harf ve rakam içermesi önerilir."
                  : "At least 6 characters; letters and numbers recommended."
              }
              action={<KeyRound className="h-4 w-4 text-muted-foreground" />}
            />
            <form onSubmit={changePassword}>
              <PanelBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Mevcut Şifre" : "Current Password"}
                  </Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Yeni Şifre" : "New Password"}
                  </Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {lang === "tr" ? "Yeni Şifre (Tekrar)" : "Confirm Password"}
                  </Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-9"
                  />
                </div>
              </PanelBody>
              <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {lang === "tr" ? "Şifreler şifrelenerek saklanır" : "Passwords are stored hashed"}
                </span>
                <Button type="submit" variant="outline">
                  {lang === "tr" ? "Şifreyi Güncelle" : "Update Password"}
                </Button>
              </div>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  );
}
