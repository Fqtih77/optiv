import type { Customer, Order, Payment, Product } from "./types";

const monthLabelsTr = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const monthLabelsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthBucket {
  key: string;
  label: string;
  payments: number;
  orders: number;
}

/**
 * Calendar-driven month window: a month with no records still comes back
 * with 0 instead of disappearing (the spreadsheet's SEQUENCE/LET behaviour).
 */
export function monthlySeries(
  { payments, orders }: { payments: Payment[]; orders: Order[] },
  opts: { customerId?: string; months?: number; lang?: "tr" | "en" } = {}
): MonthBucket[] {
  const { customerId, months = 6, lang = "tr" } = opts;
  const labels = lang === "tr" ? monthLabelsTr : monthLabelsEn;
  const scopedPayments = customerId ? payments.filter((p) => p.customerId === customerId) : payments;
  const scopedOrders = customerId ? orders.filter((o) => o.customerId === customerId) : orders;
  const now = new Date();
  const buckets: MonthBucket[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const inMonth = (value: string) => {
      const x = new Date(value);
      return x.getFullYear() === year && x.getMonth() === month;
    };

    buckets.push({
      key: `${year}-${month}`,
      label: `${labels[month]} ${String(year).slice(2)}`,
      payments: scopedPayments.filter((p) => inMonth(p.date)).reduce((s, p) => s + p.amount, 0),
      orders: scopedOrders
        .filter((o) => o.status !== "CANCELLED" && inMonth(o.createdAt))
        .reduce((s, o) => s + o.total, 0),
    });
  }

  return buckets;
}

export function productSalesRanking(orders: Order[], products: Product[]) {
  const approved = orders.filter((o) => o.status === "APPROVED");
  const map = new Map<string, { product: Product; quantity: number; revenue: number }>();

  for (const order of approved) {
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      const current = map.get(product.id) ?? { product, quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue += item.quantity * item.unitPrice;
      map.set(product.id, current);
    }
  }

  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

export function customerSalesRanking(orders: Order[], customers: Customer[]) {
  const approved = orders.filter((o) => o.status === "APPROVED");
  return customers
    .map((customer) => ({
      customer,
      revenue: approved.filter((o) => o.customerId === customer.id).reduce((s, o) => s + o.total, 0),
      orderCount: approved.filter((o) => o.customerId === customer.id).length,
    }))
    .filter((r) => r.revenue > 0 || r.customer.balance > 0)
    .sort((a, b) => b.revenue - a.revenue);
}

export function typeDistribution(products: Product[]) {
  const fashion = products.filter((p) => p.type === "FASHION");
  const klasik = products.filter((p) => p.type === "KLASIK");
  return [
    { name: "FASHION", value: fashion.reduce((s, p) => s + p.remaining, 0), fill: "var(--accent-fg)" },
    { name: "KLASİK", value: klasik.reduce((s, p) => s + p.remaining, 0), fill: "var(--gold-fg)" },
  ];
}

export function stockValue(products: Product[]) {
  return products.reduce((s, p) => s + p.remaining * p.unitPrice, 0);
}
