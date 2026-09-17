"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { customerNav } from "@/lib/nav-config";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";
import { useCustomer } from "@/lib/store/commerce";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const customerId = useSessionStore((s) => s.customerId);
  const customer = useCustomer(customerId);

  return (
    <DashboardShell
      navGroups={customerNav}
      roleLabel={t("common.customer")}
      profileHref="/customer/profile"
      user={{
        name: customer?.name ?? "Müşteri",
        subtitle: customer?.email ?? "",
        avatarColor: customer?.avatarColor ?? "#092040",
      }}
    >
      {children}
    </DashboardShell>
  );
}
