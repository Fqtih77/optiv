import type { Customer, LogEntry, Order, Payment, Product } from "../types";

export const seedProducts: Product[] = [
  {
    id: "p1",
    code: "TRK-TRN-2",
    name: "TURKUAZ - TURUNCU",
    type: "FASHION",
    thicknessMm: 2,
    unitPrice: 42,
    totalIn: 480,
    remaining: 312,
    colorFrom: "#14b8b0",
    colorTo: "#f97316",
  },
  {
    id: "p2",
    code: "SYH-GRI-2",
    name: "SİYAH - GRİ",
    type: "KLASIK",
    thicknessMm: 2,
    unitPrice: 36,
    totalIn: 600,
    remaining: 128,
    colorFrom: "#111827",
    colorTo: "#9ca3af",
  },
  {
    id: "p3",
    code: "YSL-SRI-2",
    name: "YEŞİL - SARI",
    type: "FASHION",
    thicknessMm: 2,
    unitPrice: 44,
    totalIn: 300,
    remaining: 76,
    colorFrom: "#16a34a",
    colorTo: "#facc15",
  },
  {
    id: "p4",
    code: "LCV-BYZ-2",
    name: "LACİVERT - BEYAZ",
    type: "KLASIK",
    thicknessMm: 2,
    unitPrice: 38,
    totalIn: 260,
    remaining: 41,
    colorFrom: "#0b2549",
    colorTo: "#f3f4f6",
  },
  {
    id: "p5",
    code: "KRZ-SYH-2",
    name: "KIRMIZI - SİYAH",
    type: "FASHION",
    thicknessMm: 2,
    unitPrice: 46,
    totalIn: 220,
    remaining: 18,
    colorFrom: "#dc2626",
    colorTo: "#111827",
  },
  {
    id: "p6",
    code: "MOR-PMB-2",
    name: "MOR - PEMBE",
    type: "FASHION",
    thicknessMm: 2,
    unitPrice: 45,
    totalIn: 180,
    remaining: 0,
    colorFrom: "#7c3aed",
    colorTo: "#ec4899",
  },
  {
    id: "p7",
    code: "KHV-BEJ-2",
    name: "KAHVERENGİ - BEJ",
    type: "KLASIK",
    thicknessMm: 2,
    unitPrice: 34,
    totalIn: 400,
    remaining: 205,
    colorFrom: "#78350f",
    colorTo: "#e7d7b1",
  },
  {
    id: "p8",
    code: "TRN-SRI-2",
    name: "TURUNCU - SARI",
    type: "FASHION",
    thicknessMm: 2,
    unitPrice: 41,
    totalIn: 240,
    remaining: 133,
    colorFrom: "#ea580c",
    colorTo: "#fde047",
  },
];

const dealerNames = [
  "İmran",
  "İsmail",
  "Emre",
  "Levent",
  "Gökhan",
  "Yahya",
  "Yasin",
  "Fikret",
  "Engin",
  "Hakan",
  "Faruk",
  "Origami Optik",
  "Erkan",
  "Cem",
  "Hantes",
];

const avatarColors = [
  "#092040",
  "#163e6b",
  "#b6842f",
  "#0b2549",
  "#946623",
  "#2c5a8c",
];

export const seedCustomers: Customer[] = dealerNames.map((name, i) => ({
  id: `c${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(/\s+/g, "").replace(/[İı]/g, "i")}@optik.com`,
  phone: `0532 4${(100 + i * 7).toString().padStart(3, "0")} ${(10 + i).toString().padStart(2, "0")} ${(20 + i).toString().padStart(2, "0")}`,
  avatarColor: avatarColors[i % avatarColors.length],
  balance: [4200, 0, 12500, 980, 25400, 0, 3100, 760, 0, 18900, 5400, 32100, 0, 2200, 900][i] ?? 0,
  openingBalance: i % 4 === 0 ? 1500 : 0,
  createdAt: "2025-01-14",
  mustChangePassword: i === 2,
}));

function order(
  id: string,
  customerId: string,
  items: { productId: string; quantity: number; unitPrice: number }[],
  status: Order["status"],
  createdAt: string,
  decidedAt?: string
): Order {
  return {
    id,
    customerId,
    items,
    status,
    createdAt,
    decidedAt,
    total: items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
  };
}

export const seedOrders: Order[] = [
  // Pending
  order(
    "o1",
    "c1",
    [
      { productId: "p1", quantity: 20, unitPrice: 42 },
      { productId: "p3", quantity: 10, unitPrice: 44 },
    ],
    "PENDING",
    "2026-09-15T10:24:00"
  ),
  order("o4", "c1", [{ productId: "p7", quantity: 25, unitPrice: 34 }], "PENDING", "2026-09-16T08:10:00"),
  order("o5", "c10", [{ productId: "p8", quantity: 40, unitPrice: 41 }], "PENDING", "2026-09-16T15:42:00"),

  // Cancelled
  order(
    "o3",
    "c5",
    [{ productId: "p5", quantity: 15, unitPrice: 46 }],
    "CANCELLED",
    "2026-09-05T14:40:00",
    "2026-09-05T16:00:00"
  ),

  // Approved history
  order(
    "o2",
    "c3",
    [{ productId: "p2", quantity: 30, unitPrice: 36 }],
    "APPROVED",
    "2026-09-10T09:02:00",
    "2026-09-10T11:15:00"
  ),
  order(
    "o6",
    "c5",
    [
      { productId: "p1", quantity: 60, unitPrice: 42 },
      { productId: "p7", quantity: 45, unitPrice: 34 },
    ],
    "APPROVED",
    "2026-08-22T09:15:00",
    "2026-08-22T12:05:00"
  ),
  order(
    "o7",
    "c10",
    [{ productId: "p2", quantity: 120, unitPrice: 36 }],
    "APPROVED",
    "2026-08-08T11:30:00",
    "2026-08-08T13:10:00"
  ),
  order(
    "o8",
    "c12",
    [
      { productId: "p3", quantity: 80, unitPrice: 44 },
      { productId: "p8", quantity: 35, unitPrice: 41 },
    ],
    "APPROVED",
    "2026-07-19T10:05:00",
    "2026-07-19T14:20:00"
  ),
  order(
    "o9",
    "c1",
    [{ productId: "p6", quantity: 90, unitPrice: 45 }],
    "APPROVED",
    "2026-07-03T08:40:00",
    "2026-07-03T09:55:00"
  ),
  order(
    "o10",
    "c11",
    [
      { productId: "p4", quantity: 70, unitPrice: 38 },
      { productId: "p5", quantity: 50, unitPrice: 46 },
    ],
    "APPROVED",
    "2026-06-14T13:20:00",
    "2026-06-14T16:45:00"
  ),
  order(
    "o11",
    "c3",
    [{ productId: "p1", quantity: 88, unitPrice: 42 }],
    "APPROVED",
    "2026-06-02T09:10:00",
    "2026-06-02T10:30:00"
  ),
  order(
    "o12",
    "c14",
    [{ productId: "p7", quantity: 65, unitPrice: 34 }],
    "APPROVED",
    "2026-05-21T15:00:00",
    "2026-05-21T17:15:00"
  ),
  order(
    "o13",
    "c5",
    [
      { productId: "p8", quantity: 55, unitPrice: 41 },
      { productId: "p2", quantity: 40, unitPrice: 36 },
    ],
    "APPROVED",
    "2026-05-06T10:45:00",
    "2026-05-06T11:50:00"
  ),
  order(
    "o14",
    "c12",
    [{ productId: "p6", quantity: 45, unitPrice: 45 }],
    "APPROVED",
    "2026-04-17T14:10:00",
    "2026-04-17T15:40:00"
  ),
];

export const seedPayments: Payment[] = [
  { id: "pay1", customerId: "c1", date: "2025-12-04", amount: 8200 },
  { id: "pay2", customerId: "c1", date: "2026-01-11", amount: 5400 },
  { id: "pay3", customerId: "c1", date: "2026-03-02", amount: 3100 },
  { id: "pay4", customerId: "c3", date: "2025-11-20", amount: 15000, note: "ESKİ HESAP" },
  { id: "pay5", customerId: "c3", date: "2026-02-15", amount: 6200 },
  { id: "pay6", customerId: "c5", date: "2026-01-28", amount: 9800 },
  { id: "pay7", customerId: "c5", date: "2026-04-09", amount: 4100 },
  // Recent months
  { id: "pay8", customerId: "c1", date: "2026-05-12", amount: 3600 },
  { id: "pay9", customerId: "c5", date: "2026-05-27", amount: 5200 },
  { id: "pay10", customerId: "c12", date: "2026-06-09", amount: 7400 },
  { id: "pay11", customerId: "c11", date: "2026-06-24", amount: 4800 },
  { id: "pay12", customerId: "c3", date: "2026-07-07", amount: 6100 },
  { id: "pay13", customerId: "c10", date: "2026-07-22", amount: 8900 },
  { id: "pay14", customerId: "c1", date: "2026-08-05", amount: 2400 },
  { id: "pay15", customerId: "c12", date: "2026-08-19", amount: 9300 },
  { id: "pay16", customerId: "c5", date: "2026-09-04", amount: 6700 },
  { id: "pay17", customerId: "c14", date: "2026-09-11", amount: 3200 },
];

export const seedLogs: LogEntry[] = [
  {
    id: "l1",
    type: "PRODUCT",
    message: "TURKUAZ - TURUNCU için 200 adet stok girişi yapıldı",
    actor: "Mehmet (İşveren)",
    date: "2026-09-01T09:00:00",
  },
  {
    id: "l2",
    type: "ORDER",
    message: "Emre siparişi onaylandı: SİYAH - GRİ x30",
    actor: "Mehmet (İşveren)",
    date: "2026-09-10T11:15:00",
  },
  {
    id: "l3",
    type: "AUTH",
    message: "Yasin ilk girişte şifresini güncelledi",
    actor: "Yasin",
    date: "2026-09-12T18:22:00",
  },
  {
    id: "l4",
    type: "ORDER",
    message: "Erkan siparişi iptal edildi: KIRMIZI - SİYAH x15",
    actor: "Mehmet (İşveren)",
    date: "2026-09-05T16:00:00",
  },
  {
    id: "l5",
    type: "SYSTEM",
    message: "Sistem yedeklemesi tamamlandı",
    actor: "Sistem",
    date: "2026-09-16T03:00:00",
  },
  {
    id: "l6",
    type: "PAYMENT",
    message: "Gökhan için 6.700 ₺ ödeme kaydedildi",
    actor: "Mehmet (İşveren)",
    date: "2026-09-04T10:12:00",
  },
  {
    id: "l7",
    type: "PAYMENT",
    message: "Cem için 3.200 ₺ ödeme kaydedildi",
    actor: "Mehmet (İşveren)",
    date: "2026-09-11T16:40:00",
  },
  {
    id: "l8",
    type: "PAYMENT",
    message: "Origami Optik için 9.300 ₺ ödeme kaydedildi",
    actor: "Mehmet (İşveren)",
    date: "2026-08-19T11:05:00",
  },
  {
    id: "l9",
    type: "PRODUCT",
    message: "KAHVERENGİ - BEJ için 150 adet stok girişi yapıldı",
    actor: "Mehmet (İşveren)",
    date: "2026-08-12T09:20:00",
  },
  {
    id: "l10",
    type: "AUTH",
    message: "Fatih Öztürk süperadmin paneline giriş yaptı",
    actor: "Fatih Öztürk",
    date: "2026-09-17T08:05:00",
  },
];
