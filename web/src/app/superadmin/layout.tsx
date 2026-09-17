"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { superadminNav } from "@/lib/nav-config";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const superadmin = useSessionStore((s) => s.superadmin);

  return (
    <DashboardShell
      navGroups={superadminNav}
      roleLabel={t("common.superadmin")}
      user={{ name: superadmin.name, subtitle: superadmin.email, avatarColor: "#092040" }}
    >
      {children}
    </DashboardShell>
  );
}
