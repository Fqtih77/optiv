"use client";

import { useMemo, useState } from "react";
import { Search, Users2, LogIn } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { Segmented } from "@/components/shared/segmented";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { useSessionStore } from "@/lib/store/session";
import { formatDate, formatTRY, initials } from "@/lib/format";
import type { UserRole } from "@/lib/types";

type Filter = "ALL" | UserRole;

export default function SuperadminUsersPage() {
  const { lang } = useT();
  const customers = useCommerceStore((s) => s.customers);
  const employer = useSessionStore((s) => s.employer);
  const superadmin = useSessionStore((s) => s.superadmin);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const roleLabels: Record<UserRole, string> = {
    customer: lang === "tr" ? "Müşteri" : "Customer",
    employer: lang === "tr" ? "İşveren" : "Employer",
    superadmin: lang === "tr" ? "Süperadmin" : "Superadmin",
  };

  const rows = useMemo(() => {
    const all = [
      {
        id: "sa1",
        name: superadmin.name,
        email: superadmin.email,
        role: "superadmin" as UserRole,
        color: "#cc9d4a",
        createdAt: "2025-01-02",
        balance: null as number | null,
        pending: false,
      },
      {
        id: "emp1",
        name: employer.name,
        email: employer.email,
        role: "employer" as UserRole,
        color: "#092040",
        createdAt: "2025-01-05",
        balance: null as number | null,
        pending: false,
      },
      ...customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        role: "customer" as UserRole,
        color: c.avatarColor,
        createdAt: c.createdAt,
        balance: c.balance as number | null,
        pending: c.mustChangePassword,
      })),
    ];

    return all
      .filter((u) => filter === "ALL" || u.role === filter)
      .filter((u) =>
        query.trim()
          ? u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
          : true
      );
  }, [customers, employer, superadmin, filter, query]);

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Kimlik" : "Identity"}
        title={lang === "tr" ? "Kullanıcılar" : "Users"}
        description={
          lang === "tr"
            ? "Tüm rollerdeki hesapların birleşik listesi, durum ve bakiye bilgisiyle."
            : "Unified list of accounts across every role, with status and balance."
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <StatCard
          index={0}
          label={lang === "tr" ? "Toplam Hesap" : "Total Accounts"}
          value={String(customers.length + 2)}
          icon={Users2}
          accent="accent"
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Müşteri Hesabı" : "Customer Accounts"}
          value={String(customers.length)}
          icon={Users2}
          accent="gold"
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "İlk Giriş Bekleyen" : "Pending First Login"}
          value={String(customers.filter((c) => c.mustChangePassword).length)}
          icon={LogIn}
          accent="success"
        />
      </div>

      <div className="mt-3.5 mb-3.5 flex flex-wrap items-center gap-2.5">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "ALL", label: lang === "tr" ? "Tümü" : "All", count: customers.length + 2 },
            { value: "customer", label: roleLabels.customer, count: customers.length },
            { value: "employer", label: roleLabels.employer, count: 1 },
            { value: "superadmin", label: roleLabels.superadmin, count: 1 },
          ]}
        />
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "tr" ? "İsim veya e-posta ara" : "Search name or email"}
            className="h-9 pl-9"
          />
        </div>
      </div>

      <Panel>
        {rows.length === 0 ? (
          <EmptyState icon={Users2} title={lang === "tr" ? "Kullanıcı bulunamadı" : "No users found"} />
        ) : (
          <DataTable>
            <THead>
              <Th>{lang === "tr" ? "Kullanıcı" : "User"}</Th>
              <Th>{lang === "tr" ? "Rol" : "Role"}</Th>
              <Th>{lang === "tr" ? "Kayıt" : "Created"}</Th>
              <Th align="right">{lang === "tr" ? "Bakiye" : "Balance"}</Th>
              <Th align="center">{lang === "tr" ? "Durum" : "Status"}</Th>
            </THead>
            <TBody>
              {rows.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold text-white"
                        style={{ backgroundColor: u.color }}
                      >
                        {initials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">{u.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Chip
                      tone={
                        u.role === "superadmin" ? "gold" : u.role === "employer" ? "warning" : "neutral"
                      }
                    >
                      {roleLabels[u.role]}
                    </Chip>
                  </Td>
                  <Td className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</Td>
                  <Td align="right" className="nums text-[13px]">
                    {u.balance === null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className={u.balance > 0 ? "text-[color:var(--danger-fg)]" : "text-[color:var(--success-fg)]"}>
                        {formatTRY(u.balance)}
                      </span>
                    )}
                  </Td>
                  <Td align="center">
                    <Chip tone={u.pending ? "warning" : "success"}>
                      {u.pending
                        ? lang === "tr"
                          ? "İlk giriş bekleniyor"
                          : "First login pending"
                        : lang === "tr"
                          ? "Aktif"
                          : "Active"}
                    </Chip>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </DataTable>
        )}
      </Panel>
    </div>
  );
}
