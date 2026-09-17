"use client";

import { useState } from "react";
import { Laptop, Smartphone, ShieldCheck, LogOut, Globe, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Panel, PanelHeader, PanelBody, Chip } from "@/components/shared/surface";
import { DataTable, THead, Th, TBody, Tr, Td } from "@/components/shared/data-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/use-translation";
import { useCommerceStore } from "@/lib/store/commerce";
import { relativeTime } from "@/lib/format";

/** Static mock data — no Date.now() so SSR and client render identically. */
const sessions = [
  {
    id: "s1",
    user: "Fatih Öztürk",
    role: "Süperadmin",
    device: "Windows 11 · Edge 153",
    ip: "88.230.14.22",
    location: "İstanbul, TR",
    icon: Laptop,
    current: true,
    minutesAgo: 0,
  },
  {
    id: "s2",
    user: "Mehmet Derya",
    role: "İşveren",
    device: "macOS · Safari 18",
    ip: "31.142.77.9",
    location: "Bursa, TR",
    icon: Laptop,
    current: false,
    minutesAgo: 42,
  },
  {
    id: "s3",
    user: "İmran",
    role: "Müşteri",
    device: "iPhone 15 · Safari",
    ip: "176.55.201.4",
    location: "İzmir, TR",
    icon: Smartphone,
    current: false,
    minutesAgo: 240,
  },
];

const attempts = [
  { id: "a1", email: "imran@optik.com", status: "ok", ip: "176.55.201.4", at: "14:32" },
  { id: "a2", email: "mehmet@optiv.com", status: "ok", ip: "31.142.77.9", at: "13:08" },
  { id: "a3", email: "admin@optiv.com", status: "fail", ip: "45.9.148.61", at: "11:54" },
  { id: "a4", email: "test@optiv.com", status: "fail", ip: "45.9.148.61", at: "11:51" },
];

function agoLabel(minutes: number, lang: "tr" | "en") {
  if (minutes < 1) return lang === "tr" ? "şimdi" : "now";
  if (minutes < 60) return lang === "tr" ? `${minutes} dk önce` : `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return lang === "tr" ? `${hours} sa önce` : `${hours}h ago`;
}

export default function SuperadminSecurityPage() {
  const { lang } = useT();
  const logs = useCommerceStore((s) => s.logs);
  const authLogs = logs.filter((l) => l.type === "AUTH");

  const [policies, setPolicies] = useState({
    twoFactor: false,
    idleTimeout: true,
    ipAllowlist: false,
    forcePasswordRotation: true,
  });

  const failedCount = attempts.filter((a) => a.status === "fail").length;

  return (
    <div>
      <PageHeader
        eyebrow={lang === "tr" ? "Güvenlik" : "Security"}
        title={lang === "tr" ? "Erişim ve Güvenlik" : "Access & Security"}
        description={
          lang === "tr"
            ? "Aktif oturumlar, giriş denemeleri ve platform güvenlik politikaları."
            : "Active sessions, login attempts and platform security policies."
        }
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <StatCard
          index={0}
          label={lang === "tr" ? "Aktif Oturum" : "Active Sessions"}
          value={String(sessions.length)}
          icon={ShieldCheck}
          accent="success"
        />
        <StatCard
          index={1}
          label={lang === "tr" ? "Başarısız Giriş (24s)" : "Failed Logins (24h)"}
          value={String(failedCount)}
          icon={AlertTriangle}
          accent={failedCount > 0 ? "danger" : "success"}
          hint={failedCount > 0 ? "45.9.148.61" : undefined}
        />
        <StatCard
          index={2}
          label={lang === "tr" ? "Kimlik Olayı" : "Auth Events"}
          value={String(authLogs.length)}
          icon={Globe}
          accent="gold"
        />
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-3">
        <div className="space-y-3.5 xl:col-span-2">
          <Panel>
            <PanelHeader
              title={lang === "tr" ? "Aktif Oturumlar" : "Active Sessions"}
              description={lang === "tr" ? "Cihaz, IP ve konum bilgisi" : "Device, IP and location"}
            />
            <DataTable>
              <THead>
                <Th>{lang === "tr" ? "Kullanıcı" : "User"}</Th>
                <Th>{lang === "tr" ? "Cihaz" : "Device"}</Th>
                <Th>IP</Th>
                <Th align="right">{lang === "tr" ? "Son Hareket" : "Last Active"}</Th>
                <Th align="right" />
              </THead>
              <TBody>
                {sessions.map((s) => (
                  <Tr key={s.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                          <s.icon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-[13px] font-medium">{s.user}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {s.role}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-[12px] text-muted-foreground">
                      {s.device}
                      <span className="block text-[11px]">{s.location}</span>
                    </Td>
                    <Td className="nums font-mono text-[11px] text-muted-foreground">{s.ip}</Td>
                    <Td align="right" className="text-[11px] text-muted-foreground">
                      {agoLabel(s.minutesAgo, lang)}
                    </Td>
                    <Td align="right">
                      {s.current ? (
                        <Chip tone="success">{lang === "tr" ? "Bu cihaz" : "This device"}</Chip>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-[color:var(--danger-fg)]">
                          <LogOut className="h-3.5 w-3.5" />
                          {lang === "tr" ? "Kapat" : "Revoke"}
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </DataTable>
          </Panel>

          <Panel>
            <PanelHeader
              title={lang === "tr" ? "Giriş Denemeleri" : "Login Attempts"}
              description={lang === "tr" ? "Son 24 saat" : "Last 24 hours"}
            />
            <DataTable>
              <THead>
                <Th>{lang === "tr" ? "E-posta" : "Email"}</Th>
                <Th>IP</Th>
                <Th>{lang === "tr" ? "Zaman" : "Time"}</Th>
                <Th align="center">{lang === "tr" ? "Sonuç" : "Result"}</Th>
              </THead>
              <TBody>
                {attempts.map((a) => (
                  <Tr key={a.id}>
                    <Td className="text-[12px]">{a.email}</Td>
                    <Td className="nums font-mono text-[11px] text-muted-foreground">{a.ip}</Td>
                    <Td className="nums text-[11px] text-muted-foreground">{a.at}</Td>
                    <Td align="center">
                      <Chip tone={a.status === "ok" ? "success" : "danger"}>
                        {a.status === "ok"
                          ? lang === "tr"
                            ? "Başarılı"
                            : "Success"
                          : lang === "tr"
                            ? "Başarısız"
                            : "Failed"}
                      </Chip>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </DataTable>
          </Panel>
        </div>

        <Panel>
          <PanelHeader
            title={lang === "tr" ? "Güvenlik Politikaları" : "Security Policies"}
            action={<ShieldCheck className="h-4 w-4 text-gold-fg" />}
          />
          <PanelBody className="space-y-4">
            {[
              {
                key: "twoFactor" as const,
                tr: "Süperadmin için 2FA zorunlu",
                en: "Enforce 2FA for superadmin",
              },
              {
                key: "idleTimeout" as const,
                tr: "30 dk hareketsizlikte oturumu kapat",
                en: "Sign out after 30 min idle",
              },
              {
                key: "ipAllowlist" as const,
                tr: "Süperadmin için IP kısıtlaması",
                en: "IP allowlist for superadmin",
              },
              {
                key: "forcePasswordRotation" as const,
                tr: "İlk girişte şifre değişimi zorunlu",
                en: "Force password change on first login",
              },
            ].map((row) => (
              <div key={row.key} className="flex items-start justify-between gap-4">
                <Label className="max-w-[72%] text-[12px] font-normal leading-relaxed text-foreground/85">
                  {lang === "tr" ? row.tr : row.en}
                </Label>
                <Switch
                  checked={policies[row.key]}
                  onCheckedChange={(v) => setPolicies({ ...policies, [row.key]: v })}
                />
              </div>
            ))}

            <div className="border-t border-border pt-4">
              <p className="eyebrow mb-2">{lang === "tr" ? "Son Kimlik Olayları" : "Recent Auth Events"}</p>
              {authLogs.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">—</p>
              ) : (
                <ul className="space-y-2">
                  {authLogs.slice(0, 4).map((l) => (
                    <li key={l.id} className="text-[11px] leading-relaxed text-muted-foreground">
                      <span className="text-foreground/85">{l.message}</span>
                      <br />
                      {relativeTime(l.date, lang)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}
