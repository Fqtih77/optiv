# Optiv — B2B Optik Ticaret Platformu

Toptan optik cam (CR-39, 2 mm, Fashion/Klasik güneş camı) satışı yapan bir işletme için
stok, sipariş ve cari hesap yönetimi platformu. Daha önce Google E-Tablolar + Apps Script
ile yürütülen iş akışının web'e taşınmış hâli.

**Şu anki durum:** sadece frontend. Tüm veri tarayıcıda tutulan mock veriyle çalışıyor
(backend henüz yok). FastAPI + PostgreSQL ve Docker sonraki aşamada eklenecek.

---

## İçerik

- [Teknoloji](#teknoloji)
- [Başka bir bilgisayarda sıfırdan çalıştırma](#başka-bir-bilgisayarda-sıfırdan-çalıştırma)
- [Komutlar](#komutlar)
- [Panel yapısı ve demo girişleri](#panel-yapısı-ve-demo-girişleri)
- [Proje yapısı](#proje-yapısı)
- [Tasarım sistemi](#tasarım-sistemi)
- [İş mantığı](#iş-mantığı)
- [Sık karşılaşılan sorunlar](#sık-karşılaşılan-sorunlar)
- [Yol haritası](#yol-haritası)

---

## Teknoloji

| Katman | Seçim |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + React 19 |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 (CSS-first config) |
| Bileşen | shadcn/ui (Base UI tabanlı `base-nova` stili) |
| Animasyon | Framer Motion |
| 3D | React Three Fiber + Three.js |
| Grafik | Recharts |
| State | Zustand (localStorage'a kalıcı) |
| Font | SF UI Display (sistem) → Inter Tight (fallback) |

---

## Başka bir bilgisayarda sıfırdan çalıştırma

### 1. Gereksinimler

- **Node.js 20 veya üstü** (geliştirme 24.x ile yapıldı) → <https://nodejs.org>
  ```bash
  node -v   # v20+ görmelisin
  npm -v
  ```
- **Git** → <https://git-scm.com>
- Bir editör (VS Code önerilir)

> Backend/Docker henüz yok. Python, PostgreSQL veya Docker kurmana **gerek yok**.

### 2. Repoyu klonla

```bash
git clone https://github.com/Fqtih77/optiv.git
cd optiv
```

Repo private olduğu için klonlarken GitHub kullanıcı adı + **personal access token**
(şifre değil) istenir. Alternatif olarak GitHub CLI ile:

```bash
gh auth login
gh repo clone Fqtih77/optiv
```

### 3. Frontend klasörüne gir ve paketleri kur

```bash
cd web
npm install
```

İlk kurulum internet hızına göre 1–3 dakika sürer (~700 paket).

### 4. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcıda aç: **<http://localhost:3000>**

Bu kadar. `.env` dosyası, veritabanı veya başka bir servis gerekmiyor —
tüm veri mock olarak tarayıcıda üretilir.

### 5. (Opsiyonel) Üretim derlemesini test et

```bash
npm run build
npm run start      # http://localhost:3000
```

---

## Komutlar

`web/` klasöründen çalıştırılır:

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu (hot reload) |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Derlenmiş sürümü çalıştırır |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Tip kontrolü |

---

## Panel yapısı ve demo girişleri

Site beş bölümden oluşur:

| Bölüm | Yol | Açıklama |
| --- | --- | --- |
| Tanıtım sayfası | `/` | Landing page (3D gözlük, koleksiyon, animasyonlar) |
| Giriş | `/login` | E-posta ile giriş + ilk girişte şifre belirleme akışı |
| Müşteri paneli | `/customer` | Bayi: sipariş oluşturma, siparişler, cari hesap |
| İşveren paneli | `/employer` | Stok, sipariş onayı, cari, raporlar, kullanıcılar, log |
| Süperadmin | `/superadmin` | Sistem logları, kullanıcılar, güvenlik, veritabanı, ayarlar |

`/login` sayfasındaki **Demo** bölümünden tek tıkla rol seçebilirsin:

- **Müşteri — İmran** → standart bayi hesabı
- **Müşteri — Emre** → ilk giriş (şifre belirleme) akışını gösterir
- **İşveren — Mehmet** → tam yetki
- **Süperadmin — Fatih** → platform yönetimi

Formdan girmek istersen e-posta alanına `imran@optik.com`, `mehmet@optiv.com` veya
`fatih@optiv.com` yazman yeterli (şifre alanı şimdilik doğrulanmıyor).

### Tema ve dil

- Sağ üstteki **güneş/ay** ikonu → koyu / açık tema (tercih tarayıcıda saklanır)
- **TR / EN** → arayüz dili

### Demo verisini sıfırlama

Mock veri `localStorage`'da saklanır, sayfa yenilemede korunur.
Sıfırlamak için: **Süperadmin → Ayarlar → Tehlikeli Bölge → Demo Verisini Sıfırla**
(veya tarayıcı konsolunda `localStorage.clear()`).

---

## Proje yapısı

```
optiv/
├─ README.md
├─ .gitignore
└─ web/                          # Next.js uygulaması (şu an tek servis)
   ├─ src/
   │  ├─ app/
   │  │  ├─ page.tsx             # Landing page
   │  │  ├─ layout.tsx           # Root layout, font + tema scripti
   │  │  ├─ globals.css          # Tasarım sistemi (tüm tema token'ları)
   │  │  ├─ login/
   │  │  ├─ customer/            # Müşteri paneli
   │  │  ├─ employer/            # İşveren paneli
   │  │  └─ superadmin/          # Süperadmin paneli
   │  ├─ components/
   │  │  ├─ ui/                  # shadcn/ui primitifleri
   │  │  ├─ shared/              # Panel, StatCard, DataTable, Chip…
   │  │  ├─ layout/              # DashboardShell (üst nav), tema/dil switch
   │  │  ├─ marketing/           # Landing bölümleri + 3D sahne
   │  │  ├─ visual/              # Animasyonlu blob'lar, lens orb
   │  │  └─ brand/               # Logo
   │  └─ lib/
   │     ├─ store/               # Zustand store'ları (commerce, cart, tema, dil…)
   │     ├─ mock/seed.ts         # Demo verisi (ürün, bayi, sipariş, ödeme, log)
   │     ├─ i18n/                # TR/EN sözlük
   │     ├─ analytics.ts         # Aylık seri, sıralama, stok değeri hesapları
   │     ├─ stock-status.ts      # Stok eşikleri (Excel mantığının karşılığı)
   │     └─ format.ts            # ₺ / tarih / sayı biçimlendirme
   └─ package.json
```

---

## Tasarım sistemi

Tüm renkler `web/src/app/globals.css` içindeki CSS değişkenlerinden gelir.
Tema değiştirmek için `<html>` üzerindeki `dark` / `light` sınıfı değişir.

- Marka lacivertі: `#092040` (logo rengi) — aksan, grafikler, aktif nav
- İkincil aksan: altın `#cc9d4a`
- Koyu tema zemin `#080a10`, kart `#111726` (kasıtlı ton ayrımı)
- Açık tema zemin `#eceff5`, kart `#ffffff`
- Durum tonları `tone-success` / `tone-warning` / `tone-danger` / `tone-accent` sınıfları

Yeni bir renk eklerken sabit hex yazmak yerine `globals.css`'e token ekle —
aksi hâlde iki temadan birinde bozulur.

---

## İş mantığı

Excel/Apps Script sisteminden taşınan kurallar:

1. **Stok iki kalemde tutulur:** *Toplam Giren* ve *Kalan Stok*.
   - Yeni stok girişi → **her ikisi** artar.
   - Sipariş onayı → **sadece Kalan Stok** düşer (0'ın altına inmez).
2. **Sipariş akışı:** Bayi sipariş oluşturur → işveren onaylar → stok düşer +
   tutar bayinin cari hesabına borç yazılır + log kaydı oluşur.
3. **Stok durumu eşikleri:** ≥100 Stokta · 50–99 Azalıyor · 1–49 Kritik · 0 Tükendi.
4. **Aylık ödeme özeti:** ödeme yapılmayan aylar atlanmaz, takvim mantığıyla
   **0 ₺** olarak listelenir (`lib/analytics.ts` → `monthlySeries`).
5. **Eski hesap devri:** geçmişten devreden bakiye `openingBalance` alanında tutulur.

---

## Sık karşılaşılan sorunlar

**`npm install` hata veriyor / Node sürümü uyarısı**
Node 20+ kurulu olduğundan emin ol: `node -v`. Eski sürümde Next.js 16 çalışmaz.

**Port 3000 dolu**
```bash
npm run dev -- -p 3001
```

**Sayfa boş / stil bozuk geliyor**
`web/node_modules` ve `web/.next` klasörlerini silip tekrar kur:
```bash
rm -rf node_modules .next && npm install && npm run dev
```

**Windows'ta OneDrive klasöründe yavaşlık**
Proje OneDrive altındaysa senkronizasyon derlemeyi yavaşlatabilir; repoyu
`C:\dev\optiv` gibi senkronize edilmeyen bir klasöra klonlamak daha hızlıdır.

**3D gözlük görünmüyor**
WebGL gerektirir; tarayıcıda donanım hızlandırma kapalıysa açman gerekir.

---

## Yol haritası

- [x] Frontend: landing + 4 panel, çift tema, TR/EN, mock veri
- [ ] **Backend:** FastAPI + PostgreSQL (`api/` klasörü olarak monorepo'ya eklenecek)
  - Şema: `products`, `customers`, `orders`, `order_items`, `payments`, `activity_logs`
  - Stok düşme ve aylık 0 ₺ doldurma mantığı DB/servis katmanına taşınacak
- [ ] Gerçek kimlik doğrulama (JWT), e-posta ile geçici şifre gönderimi
- [ ] Ürün görsellerinin yüklenmesi (şu an renk gradyanı placeholder)
- [ ] Docker Compose (`web` + `api` + `postgres`) ile tek komutla ayağa kaldırma

---

## Notlar

- `.mcp.json`, `.env*` ve `*.xlsx` dosyaları `.gitignore` içindedir; API anahtarı
  veya iş verisi **repoya gönderilmez**. Excel referans dosyası yalnızca yerel makinede durur.
- Ürün/bayi isimleri ve fiyatlar şimdilik demo veridir (`lib/mock/seed.ts`).
