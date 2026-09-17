"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { employerNav } from "@/lib/nav-config";
import { useT } from "@/lib/i18n/use-translation";
import { useSessionStore } from "@/lib/store/session";

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const employer = useSessionStore((s) => s.employer);

  return (
    <DashboardShell
      navGroups={employerNav}
      roleLabel={t("common.employer")}
      profileHref="/employer/profil"
      user={{ name: employer.name, subtitle: employer.email, avatarColor: "#092040" }}
    >
      {children}
    </DashboardShell>
  );
}
