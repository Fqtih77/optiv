import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Package,
  Wallet,
  LayoutTemplate,
  Users,
  ScrollText,
  ShieldCheck,
  Settings,
  ChartPie,
  Database,
  Building2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  labelTr: string;
  labelEn: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface NavGroup {
  labelTr: string;
  labelEn: string;
  /** Rendered inside the "more" dropdown instead of the primary top nav. */
  overflow?: boolean;
  items: NavItem[];
}

export const customerNav: NavGroup[] = [
  {
    labelTr: "Genel",
    labelEn: "General",
    items: [
      { href: "/customer", labelTr: "Anasayfa", labelEn: "Home", icon: LayoutDashboard, exact: true },
      { href: "/customer/orders/new", labelTr: "Sipariş Oluştur", labelEn: "New Order", icon: ShoppingBag },
      { href: "/customer/orders", labelTr: "Siparişlerim", labelEn: "My Orders", icon: ClipboardList, exact: true },
      { href: "/customer/cari", labelTr: "Cari Hesabım", labelEn: "My Account", icon: Wallet },
    ],
  },
];

export const employerNav: NavGroup[] = [
  {
    labelTr: "Operasyon",
    labelEn: "Operations",
    items: [
      { href: "/employer", labelTr: "Anasayfa", labelEn: "Home", icon: LayoutDashboard, exact: true },
      { href: "/employer/siparisler", labelTr: "Siparişler", labelEn: "Orders", icon: ClipboardList },
      { href: "/employer/urunler", labelTr: "Ürünler", labelEn: "Products", icon: Package },
      { href: "/employer/cari", labelTr: "Sevkiyat & Cari", labelEn: "Shipments", icon: Wallet },
      { href: "/employer/raporlar", labelTr: "Raporlar", labelEn: "Reports", icon: ChartPie },
    ],
  },
  {
    labelTr: "Yönetim",
    labelEn: "Management",
    overflow: true,
    items: [
      { href: "/employer/kullanicilar", labelTr: "Kullanıcılar", labelEn: "Users", icon: Users },
      { href: "/employer/landing", labelTr: "Landing Page", labelEn: "Landing Page", icon: LayoutTemplate },
      { href: "/employer/log", labelTr: "Loglar", labelEn: "Logs", icon: ScrollText },
      { href: "/employer/profil", labelTr: "İşletme Profili", labelEn: "Business Profile", icon: Building2 },
    ],
  },
];

export const superadminNav: NavGroup[] = [
  {
    labelTr: "İzleme",
    labelEn: "Monitoring",
    items: [
      { href: "/superadmin", labelTr: "Genel Bakış", labelEn: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/superadmin/logs", labelTr: "Aktivite", labelEn: "Activity", icon: ScrollText },
      { href: "/superadmin/users", labelTr: "Kullanıcılar", labelEn: "Users", icon: Users },
      { href: "/superadmin/security", labelTr: "Güvenlik", labelEn: "Security", icon: ShieldCheck },
    ],
  },
  {
    labelTr: "Sistem",
    labelEn: "System",
    overflow: true,
    items: [
      { href: "/superadmin/veritabani", labelTr: "Veritabanı", labelEn: "Database", icon: Database },
      { href: "/superadmin/settings", labelTr: "Ayarlar", labelEn: "Settings", icon: Settings },
    ],
  },
];
