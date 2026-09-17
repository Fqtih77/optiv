"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Building2, User, ShieldCheck, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BlobField } from "@/components/visual/blob-field";
import { LensOrb } from "@/components/visual/lens-orb";
import { Chip } from "@/components/shared/surface";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { useSessionStore } from "@/lib/store/session";

type Step = "login" | "first-password";

export default function LoginPage() {
  const router = useRouter();
  const { t, lang } = useT();
  const customers = useCommerceStore((s) => s.customers);
  const completeFirstLogin = useCommerceStore((s) => s.completeFirstLogin);
  const setRole = useSessionStore((s) => s.setRole);
  const setCustomerId = useSessionStore((s) => s.setCustomerId);

  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingCustomerId, setPendingCustomerId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function loginAsCustomer(customerId: string) {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    setRole("customer");
    setCustomerId(customerId);
    if (customer.mustChangePassword) {
      setPendingCustomerId(customerId);
      setStep("first-password");
      return;
    }
    router.push("/customer");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const match = customers.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
    if (match) return loginAsCustomer(match.id);
    if (email.trim().toLowerCase().includes("mehmet")) {
      setRole("employer");
      return router.push("/employer");
    }
    if (email.trim().toLowerCase().includes("fatih")) {
      setRole("superadmin");
      return router.push("/superadmin");
    }
    toast.error(
      lang === "tr"
        ? "Kullanıcı bulunamadı. Demo hesaplarını kullanabilirsin."
        : "User not found. Try a demo account."
    );
  }

  function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(lang === "tr" ? "Şifre en az 6 karakter olmalı." : "Minimum 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(lang === "tr" ? "Şifreler eşleşmiyor." : "Passwords do not match.");
      return;
    }
    if (pendingCustomerId) completeFirstLogin(pendingCustomerId);
    toast.success(lang === "tr" ? "Şifren güncellendi." : "Password updated.");
    router.push("/customer");
  }

  const demoAccounts = [
    {
      icon: User,
      label: `${t("common.customer")} — İmran`,
      hint: lang === "tr" ? "standart bayi" : "standard dealer",
      onClick: () => loginAsCustomer("c1"),
    },
    {
      icon: User,
      label: `${t("common.customer")} — Emre`,
      hint: lang === "tr" ? "ilk giriş akışı" : "first-login flow",
      onClick: () => loginAsCustomer("c3"),
    },
    {
      icon: Building2,
      label: `${t("common.employer")} — Mehmet`,
      hint: lang === "tr" ? "tam yetki" : "full access",
      onClick: () => {
        setRole("employer");
        router.push("/employer");
      },
    },
    {
      icon: ShieldCheck,
      label: `${t("common.superadmin")} — Fatih`,
      hint: lang === "tr" ? "platform yönetimi" : "platform admin",
      onClick: () => {
        setRole("superadmin");
        router.push("/superadmin");
      },
    },
  ];

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Brand side */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden border-r border-border p-12 lg:flex">
        <BlobField variant="hero" />
        <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative z-10">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <LensOrb size={150} />
          </motion.div>
          <p className="display mt-10 max-w-md text-[clamp(1.9rem,2.8vw,2.6rem)] text-foreground">
            {t("hero.title1")} <span className="display-italic text-accent-fg">{t("hero.title2")}</span>
          </p>
          <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <div className="mt-12 flex gap-10 border-t border-border pt-7">
            {[
              { k: "1.240+", v: lang === "tr" ? "Cam modeli" : "Lens models" },
              { k: "180+", v: lang === "tr" ? "Aktif bayi" : "Active dealers" },
              { k: "99.9%", v: lang === "tr" ? "Erişilebilirlik" : "Uptime" },
            ].map((s) => (
              <div key={s.k}>
                <p className="display nums text-[18px] text-foreground">{s.k}</p>
                <p className="eyebrow mt-1">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          © {new Date().getFullYear()} Optiv
        </p>
      </div>

      {/* Form side */}
      <div className="relative flex w-full flex-1 flex-col">
        <BlobField variant="quiet" className="opacity-60 lg:hidden" />
        <div className="relative flex items-center justify-between p-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("login.back")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-[390px]">
            <div className="mb-10 lg:hidden">
              <Logo />
            </div>

            <AnimatePresence mode="wait">
              {step === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="display text-[30px] text-foreground">{t("login.title")}</h1>
                  <p className="mt-2.5 text-[13.5px] text-muted-foreground">{t("login.subtitle")}</p>

                  <form onSubmit={handleSubmit} className="mt-9 space-y-4">
                    <div className="space-y-2">
                      <Label className="eyebrow">{t("login.email")}</Label>
                      <Input
                        type="email"
                        placeholder="ornek@optik.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-full px-4"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="eyebrow">{t("login.password")}</Label>
                        <button type="button" className="text-[11px] text-accent-fg hover:underline">
                          {t("login.forgot")}
                        </button>
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 rounded-full px-4"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-11 w-full rounded-full bg-primary text-primary-foreground hover:opacity-90"
                    >
                      {t("login.submit")}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </form>

                  <div className="mt-10">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="eyebrow">Demo</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="mt-5 space-y-2">
                      {demoAccounts.map((a) => (
                        <button
                          key={a.label}
                          onClick={a.onClick}
                          className="surface group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors group-hover:text-accent-fg">
                            <a.icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12.5px] font-medium text-foreground">
                              {a.label}
                            </span>
                            <span className="eyebrow block">{a.hint}</span>
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-fg" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="first-password"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <Chip tone="gold">{lang === "tr" ? "İlk giriş" : "First login"}</Chip>
                  <h1 className="display mt-5 text-[28px] text-foreground">
                    {t("login.firstLogin.title")}
                  </h1>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                    {t("login.firstLogin.desc")}
                  </p>

                  <form onSubmit={handleSetPassword} className="mt-9 space-y-4">
                    <div className="space-y-2">
                      <Label className="eyebrow">{t("login.newPassword")}</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-11 rounded-full px-4"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="eyebrow">{t("login.confirmPassword")}</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-11 rounded-full px-4"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-11 w-full rounded-full bg-primary text-primary-foreground hover:opacity-90"
                    >
                      {t("login.savePassword")}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
