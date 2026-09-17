export type Lang = "tr" | "en";

type Dict = Record<string, string>;

export const tr: Dict = {
  // Navbar
  "nav.features": "Özellikler",
  "nav.products": "Ürünler",
  "nav.howItWorks": "Nasıl Çalışır",
  "nav.contact": "İletişim",
  "nav.login": "Giriş Yap",

  // Hero
  "hero.badge": "B2B Optik Ticaret Platformu",
  "hero.title1": "Görüşü",
  "hero.title2": "yeniden tasarlıyoruz.",
  "hero.subtitle":
    "Optiv, toptan optik cam tedarikçileri ile bayileri aynı çizgide buluşturan; stok, sipariş ve cari hesabı tek ekranda yöneten yeni nesil ticaret platformu.",
  "hero.ctaPrimary": "Panele Giriş Yap",
  "hero.ctaSecondary": "Nasıl Çalışır",
  "hero.scroll": "Kaydır",

  // Stats
  "stats.title": "Rakamlarla Optiv",
  "stats.stock": "Anlık Takip Edilen Cam Modeli",
  "stats.dealers": "Aktif Bayi Hesabı",
  "stats.orders": "Aylık İşlenen Sipariş",
  "stats.uptime": "Sistem Erişilebilirliği",

  // Features
  "features.title": "Tek panelde tüm ticaret akışı",
  "features.subtitle":
    "Excel tablolarından, e-posta zincirlerinden ve elle tutulan defterlerden kurtulun. Optiv; stok, sipariş ve finansı otomatikleştirir.",
  "features.stock.title": "Gerçek Zamanlı Stok",
  "features.stock.desc":
    "Toplam giren stok ve kalan stok ayrı takip edilir; kritik seviyedeki camlar otomatik olarak uyarı verir.",
  "features.orders.title": "Onaya Bağlı Sipariş Akışı",
  "features.orders.desc":
    "Bayiler sipariş oluşturur, onay verildiği an stok düşer ve cari hesaba otomatik borç işlenir.",
  "features.finance.title": "Akıllı Cari Hesap",
  "features.finance.desc":
    "Aylık ödeme özetleri, ödeme yapılmayan aylarda dahi '0 ₺' olarak takvimsel şekilde gösterilir.",
  "features.security.title": "Rol Bazlı Erişim",
  "features.security.desc":
    "Müşteri, işveren ve süperadmin panelleri; yetkilerine göre sınırlandırılmış, uçtan uca güvenli erişim sağlar.",

  // Product showcase
  "showcase.title": "Koleksiyonun her tonu, tek katalogda",
  "showcase.subtitle":
    "CR-39, 2mm kalınlık, Fashion ve Klasik renk serileri — canlı stok durumuyla birlikte.",
  "showcase.inStock": "Stokta",
  "showcase.low": "Azalıyor",

  // How it works
  "how.title": "Nasıl çalışır?",
  "how.subtitle": "Üç adımda sipariş, onay ve tahsilat.",
  "how.step1.title": "Sipariş Oluştur",
  "how.step1.desc": "Bayi, güncel stok kataloğundan camları seçip sepetine ekler ve siparişi gönderir.",
  "how.step2.title": "Onaylanır, Stok Düşer",
  "how.step2.desc": "İşveren siparişi onayladığı anda ilgili camlar kalan stoktan otomatik düşülür.",
  "how.step3.title": "Cari Hesap Güncellenir",
  "how.step3.desc": "Sipariş tutarı bayinin cari hesabına işlenir, aylık özet raporlarda anında görünür.",

  // CTA
  "cta.title": "İşletmenizi dijitale taşıyın",
  "cta.subtitle": "Ekibiniz için özel hesap tanımlamasını işveren panelinden birkaç dakikada yapın.",
  "cta.button": "Panele Giriş Yap",

  // Footer
  "footer.tagline": "Optik ticaretinde yeni nesil B2B deneyimi.",
  "footer.rights": "Tüm hakları saklıdır.",
  "footer.product": "Ürün",
  "footer.company": "Şirket",
  "footer.legal": "Yasal",

  // Login
  "login.title": "Panele Giriş Yap",
  "login.subtitle": "E-posta adresin ile giriş yap.",
  "login.email": "E-posta",
  "login.password": "Şifre",
  "login.submit": "Giriş Yap",
  "login.forgot": "Şifreni mi unuttun?",
  "login.roleHint": "Demo ortamında rol seçerek ilgili panele geçebilirsin.",
  "login.firstLogin.title": "İlk giriş — şifreni belirle",
  "login.firstLogin.desc":
    "Hesabın işvereniniz tarafından oluşturuldu. Güvenliğin için lütfen yeni bir şifre belirle.",
  "login.newPassword": "Yeni Şifre",
  "login.confirmPassword": "Yeni Şifre (Tekrar)",
  "login.savePassword": "Şifreyi Kaydet ve Devam Et",
  "login.back": "Ana sayfaya dön",

  // Common
  "common.customer": "Müşteri",
  "common.employer": "İşveren",
  "common.superadmin": "Süperadmin",
  "common.logout": "Çıkış Yap",
  "common.profile": "Profilim",
  "common.save": "Kaydet",
  "common.cancel": "İptal",
  "common.add": "Ekle",
  "common.delete": "Sil",
  "common.edit": "Düzenle",
  "common.search": "Ara...",
  "common.status": "Durum",
  "common.date": "Tarih",
  "common.amount": "Tutar",
  "common.total": "Toplam",
  "common.actions": "İşlemler",
  "common.approve": "Onayla",
  "common.reject": "İptal Et",
  "common.pending": "Beklemede",
  "common.approved": "Onaylandı",
  "common.cancelled": "İptal Edildi",
  "common.viewAll": "Tümünü Gör",
};

export const en: Dict = {
  "nav.features": "Features",
  "nav.products": "Products",
  "nav.howItWorks": "How it works",
  "nav.contact": "Contact",
  "nav.login": "Sign In",

  "hero.badge": "B2B Optical Trade Platform",
  "hero.title1": "Reimagining",
  "hero.title2": "how vision moves.",
  "hero.subtitle":
    "Optiv connects wholesale optical lens suppliers with their dealers on a single screen for stock, orders and running accounts.",
  "hero.ctaPrimary": "Sign In to Panel",
  "hero.ctaSecondary": "How it works",
  "hero.scroll": "Scroll",

  "stats.title": "Optiv in numbers",
  "stats.stock": "Lens Models Tracked Live",
  "stats.dealers": "Active Dealer Accounts",
  "stats.orders": "Orders Processed Monthly",
  "stats.uptime": "System Uptime",

  "features.title": "Your entire trade flow, one panel",
  "features.subtitle":
    "Leave spreadsheets, email chains and paper ledgers behind. Optiv automates stock, orders and finance.",
  "features.stock.title": "Real-Time Stock",
  "features.stock.desc":
    "Total inbound stock and remaining stock are tracked separately; critical levels trigger automatic alerts.",
  "features.orders.title": "Approval-Based Orders",
  "features.orders.desc":
    "Dealers place orders; the moment they're approved, stock is deducted and the balance is charged automatically.",
  "features.finance.title": "Smart Running Account",
  "features.finance.desc":
    "Monthly payment summaries show '0 ₺' for skipped months too — never a gap in the calendar.",
  "features.security.title": "Role-Based Access",
  "features.security.desc":
    "Customer, employer and superadmin panels are scoped end-to-end by role and permission.",

  "showcase.title": "Every shade of the collection, one catalog",
  "showcase.subtitle": "CR-39, 2mm thickness, Fashion and Classic color lines — with live stock status.",
  "showcase.inStock": "In Stock",
  "showcase.low": "Low Stock",

  "how.title": "How it works",
  "how.subtitle": "Order, approval and collection in three steps.",
  "how.step1.title": "Place an Order",
  "how.step1.desc": "Dealers pick lenses from the live catalog, add to cart and submit the order.",
  "how.step2.title": "Approved, Stock Deducted",
  "how.step2.desc": "The moment the employer approves, matching lenses are deducted from remaining stock.",
  "how.step3.title": "Running Account Updates",
  "how.step3.desc": "The order total is posted to the dealer's account and reflected instantly in monthly reports.",

  "cta.title": "Bring your business online",
  "cta.subtitle": "Create dedicated accounts for your team from the employer panel in minutes.",
  "cta.button": "Sign In to Panel",

  "footer.tagline": "The next-generation B2B experience for optical trade.",
  "footer.rights": "All rights reserved.",
  "footer.product": "Product",
  "footer.company": "Company",
  "footer.legal": "Legal",

  "login.title": "Sign In to Panel",
  "login.subtitle": "Sign in with your email address.",
  "login.email": "Email",
  "login.password": "Password",
  "login.submit": "Sign In",
  "login.forgot": "Forgot your password?",
  "login.roleHint": "In this demo, pick a role to open the matching panel.",
  "login.firstLogin.title": "First login — set your password",
  "login.firstLogin.desc":
    "Your account was created by your employer. For security, please set a new password.",
  "login.newPassword": "New Password",
  "login.confirmPassword": "Confirm New Password",
  "login.savePassword": "Save Password and Continue",
  "login.back": "Back to homepage",

  "common.customer": "Customer",
  "common.employer": "Employer",
  "common.superadmin": "Superadmin",
  "common.logout": "Log Out",
  "common.profile": "My Profile",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.add": "Add",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.search": "Search...",
  "common.status": "Status",
  "common.date": "Date",
  "common.amount": "Amount",
  "common.total": "Total",
  "common.actions": "Actions",
  "common.approve": "Approve",
  "common.reject": "Cancel",
  "common.pending": "Pending",
  "common.approved": "Approved",
  "common.cancelled": "Cancelled",
  "common.viewAll": "View All",
};

export const dictionaries: Record<Lang, Dict> = { tr, en };
