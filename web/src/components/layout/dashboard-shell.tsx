"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, LogOut, User as UserIcon, ChevronDown, Bell, Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BlobField } from "@/components/visual/blob-field";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { initials, relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NavGroup, NavItem } from "@/lib/nav-config";

interface DashboardShellProps {
  navGroups: NavGroup[];
  roleLabel: string;
  user: { name: string; subtitle: string; avatarColor: string };
  profileHref?: string;
  children: React.ReactNode;
}

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function TopNav({ navGroups }: { navGroups: NavGroup[] }) {
  const pathname = usePathname();
  const { lang } = useT();

  const primary = navGroups.filter((g) => !g.overflow).flatMap((g) => g.items);
  const overflowGroups = navGroups.filter((g) => g.overflow);
  const overflowItems = overflowGroups.flatMap((g) => g.items);
  const overflowActive = overflowItems.some((i) => isActive(pathname, i));

  return (
    <nav className="hidden items-center gap-0.5 lg:flex">
      {primary.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative rounded-full px-4 py-2 text-[13px] transition-colors duration-200",
              active
                ? "font-medium text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="top-nav-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{lang === "tr" ? item.labelTr : item.labelEn}</span>
          </Link>
        );
      })}

      {overflowItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] transition-colors duration-200",
                  overflowActive
                    ? "font-medium text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              />
            }
          >
            {overflowActive && (
              <motion.span
                layoutId="top-nav-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">
              {lang === "tr" ? overflowGroups[0].labelTr : overflowGroups[0].labelEn}
            </span>
            <ChevronDown className="relative z-10 h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl">
            {overflowItems.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={item.href}
                  render={<Link href={item.href} />}
                  className="cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  {lang === "tr" ? item.labelTr : item.labelEn}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
}

function MobileNav({
  navGroups,
  roleLabel,
  onNavigate,
}: {
  navGroups: NavGroup[];
  roleLabel: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const { lang } = useT();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Logo />
        <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {roleLabel}
        </span>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.labelTr}>
            <p className="eyebrow px-3 pb-2">{lang === "tr" ? group.labelTr : group.labelEn}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] transition-colors",
                      active
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.9} />
                    {lang === "tr" ? item.labelTr : item.labelEn}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationBell() {
  const logs = useCommerceStore((s) => s.logs);
  const { lang } = useT();
  const recent = logs.slice(0, 6);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground" />
        }
      >
        <Bell className="h-4 w-4" strokeWidth={1.9} />
        {recent.length > 0 && (
          <span className="dot-gold absolute right-2 top-2 h-1.5 w-1.5 rounded-full ring-2 ring-card" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 overflow-hidden rounded-2xl p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="display text-[15px]">{lang === "tr" ? "Bildirimler" : "Notifications"}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {lang === "tr" ? "Son sistem hareketleri" : "Latest activity"}
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {recent.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-muted-foreground">
              {lang === "tr" ? "Bildirim yok." : "No notifications."}
            </p>
          ) : (
            recent.map((l) => (
              <div
                key={l.id}
                className="border-b border-border/70 px-4 py-3 last:border-0 transition-colors hover:bg-muted/60"
              >
                <p className="text-xs leading-relaxed text-foreground">{l.message}</p>
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  {l.actor} · {relativeTime(l.date, lang)}
                </p>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardShell({
  navGroups,
  roleLabel,
  user,
  profileHref,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, lang } = useT();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      <BlobField variant="quiet" className="fixed inset-0 opacity-70" />

      <header className="glass sticky top-0 z-40 border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4 lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground lg:hidden" />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[290px] p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <MobileNav
                navGroups={navGroups}
                roleLabel={roleLabel}
                onNavigate={() => setOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <Logo className="mr-2 shrink-0" />

          <TopNav navGroups={navGroups} />

          <div className="flex-1" />

          <button className="hidden h-9 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground xl:flex">
            <Search className="h-3.5 w-3.5" />
            <span>{lang === "tr" ? "Ara veya Optiv'e sor…" : "Search or ask Optiv…"}</span>
          </button>

          <LanguageSwitcher className="hidden sm:inline-flex" />
          <ThemeToggle />
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-left transition-colors hover:bg-muted/70" />
              }
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback
                  style={{ backgroundColor: user.avatarColor }}
                  className="text-[10px] font-semibold text-white"
                >
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-[12.5px] font-medium leading-tight text-foreground">
                  {user.name}
                </span>
                <span className="block truncate text-[10px] leading-tight text-muted-foreground">
                  {roleLabel}
                </span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium">{user.name}</span>
                  <span className="text-[11px] text-muted-foreground">{user.subtitle}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profileHref && (
                <DropdownMenuItem render={<Link href={profileHref} />} className="cursor-pointer">
                  <UserIcon className="h-4 w-4" />
                  {t("common.profile")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => router.push("/login")}
                className="cursor-pointer text-[color:var(--danger-fg)]"
              >
                <LogOut className="h-4 w-4" />
                {t("common.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-[1500px] px-4 py-8 lg:px-8 lg:py-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
