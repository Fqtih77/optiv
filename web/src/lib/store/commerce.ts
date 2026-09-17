"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Customer, LogEntry, Order, OrderItem, Payment, Product } from "../types";
import { seedCustomers, seedLogs, seedOrders, seedPayments, seedProducts } from "../mock/seed";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

interface CommerceState {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  payments: Payment[];
  logs: LogEntry[];

  addLog: (entry: Omit<LogEntry, "id" | "date">) => void;

  addProduct: (input: Omit<Product, "id" | "remaining" | "totalIn"> & { quantity: number }) => void;
  restockProduct: (productId: string, quantity: number, actor: string) => void;
  updateProduct: (
    productId: string,
    patch: Partial<Pick<Product, "unitPrice" | "name" | "code">>,
    actor: string
  ) => void;

  createOrder: (customerId: string, items: OrderItem[]) => void;
  approveOrder: (orderId: string, actor: string) => void;
  cancelOrder: (orderId: string, actor: string) => void;

  addPayment: (customerId: string, amount: number, date: string, actor: string, note?: string) => void;

  addCustomer: (input: Omit<Customer, "id" | "createdAt" | "mustChangePassword" | "balance">) => void;
  removeCustomer: (customerId: string) => void;
  completeFirstLogin: (customerId: string) => void;
  resetCustomerPassword: (customerId: string, actor: string) => void;
  updateCustomerProfile: (
    customerId: string,
    patch: Partial<Pick<Customer, "name" | "email" | "phone" | "avatarColor">>
  ) => void;
  resetToSeed: () => void;
}

export const useCommerceStore = create<CommerceState>()(
  persist<CommerceState>(
    (set, get) => ({
  products: seedProducts,
  customers: seedCustomers,
  orders: seedOrders,
  payments: seedPayments,
  logs: seedLogs,

  addLog: (entry) =>
    set((state) => ({
      logs: [
        { ...entry, id: uid("log"), date: new Date().toISOString() },
        ...state.logs,
      ],
    })),

  addProduct: (input) =>
    set((state) => {
      const product: Product = {
        id: uid("p"),
        code: input.code,
        name: input.name,
        type: input.type,
        thicknessMm: input.thicknessMm,
        unitPrice: input.unitPrice,
        totalIn: input.quantity,
        remaining: input.quantity,
        colorFrom: input.colorFrom,
        colorTo: input.colorTo,
      };
      return {
        products: [product, ...state.products],
        logs: [
          {
            id: uid("log"),
            type: "PRODUCT",
            message: `${product.name} yeni ürün olarak eklendi (${input.quantity} adet)`,
            actor: "Mehmet (İşveren)",
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  restockProduct: (productId, quantity, actor) =>
    set((state) => {
      const product = state.products.find((p) => p.id === productId);
      if (!product) return state;
      return {
        products: state.products.map((p) =>
          p.id === productId
            ? { ...p, totalIn: p.totalIn + quantity, remaining: p.remaining + quantity }
            : p
        ),
        logs: [
          {
            id: uid("log"),
            type: "PRODUCT",
            message: `${product.name} için ${quantity} adet stok girişi yapıldı`,
            actor,
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  updateProduct: (productId, patch, actor) =>
    set((state) => {
      const product = state.products.find((p) => p.id === productId);
      if (!product) return state;
      const details = patch.unitPrice
        ? `${product.name}: ${product.unitPrice} ₺ → ${patch.unitPrice} ₺`
        : product.name;
      return {
        products: state.products.map((p) => (p.id === productId ? { ...p, ...patch } : p)),
        logs: [
          {
            id: uid("log"),
            type: "PRODUCT",
            message: `Ürün güncellendi — ${details}`,
            actor,
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  createOrder: (customerId, items) =>
    set((state) => {
      const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
      const order: Order = {
        id: uid("o"),
        customerId,
        items,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        total,
      };
      const customer = state.customers.find((c) => c.id === customerId);
      return {
        orders: [order, ...state.orders],
        logs: [
          {
            id: uid("log"),
            type: "ORDER",
            message: `${customer?.name ?? "Müşteri"} yeni bir sipariş oluşturdu (${items.length} kalem)`,
            actor: customer?.name ?? "Müşteri",
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  approveOrder: (orderId, actor) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order || order.status !== "PENDING") return state;

      const products = state.products.map((p) => {
        const item = order.items.find((i) => i.productId === p.id);
        if (!item) return p;
        const nextRemaining = Math.max(0, p.remaining - item.quantity);
        return { ...p, remaining: nextRemaining };
      });

      const customers = state.customers.map((c) =>
        c.id === order.customerId ? { ...c, balance: c.balance + order.total } : c
      );

      const customer = customers.find((c) => c.id === order.customerId);
      const itemLines = order.items
        .map((i) => {
          const p = state.products.find((pp) => pp.id === i.productId);
          return `${p?.name ?? i.productId} x${i.quantity}`;
        })
        .join(", ");

      return {
        products,
        customers,
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: "APPROVED", decidedAt: new Date().toISOString() } : o
        ),
        logs: [
          {
            id: uid("log"),
            type: "ORDER",
            message: `${customer?.name ?? "Müşteri"} siparişi onaylandı: ${itemLines}`,
            actor,
            date: new Date().toISOString(),
            meta: `Tutar: ${order.total.toLocaleString("tr-TR")} ₺`,
          },
          ...state.logs,
        ],
      };
    }),

  cancelOrder: (orderId, actor) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order || order.status !== "PENDING") return state;
      const customer = state.customers.find((c) => c.id === order.customerId);
      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: "CANCELLED", decidedAt: new Date().toISOString() } : o
        ),
        logs: [
          {
            id: uid("log"),
            type: "ORDER",
            message: `${customer?.name ?? "Müşteri"} siparişi iptal edildi`,
            actor,
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  addPayment: (customerId, amount, date, actor, note) =>
    set((state) => {
      const customer = state.customers.find((c) => c.id === customerId);
      const payment: Payment = { id: uid("pay"), customerId, date, amount, note };
      return {
        payments: [payment, ...state.payments],
        customers: state.customers.map((c) =>
          c.id === customerId ? { ...c, balance: c.balance - amount } : c
        ),
        logs: [
          {
            id: uid("log"),
            type: "PAYMENT",
            message: `${customer?.name ?? "Müşteri"} için ${amount.toLocaleString("tr-TR")} ₺ ödeme kaydedildi`,
            actor,
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  addCustomer: (input) =>
    set((state) => {
      const customer: Customer = {
        ...input,
        id: uid("c"),
        balance: 0,
        createdAt: new Date().toISOString(),
        mustChangePassword: true,
      };
      return {
        customers: [customer, ...state.customers],
        logs: [
          {
            id: uid("log"),
            type: "SYSTEM",
            message: `${customer.name} için yeni müşteri hesabı oluşturuldu`,
            actor: "Mehmet (İşveren)",
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  removeCustomer: (customerId) =>
    set((state) => {
      const customer = state.customers.find((c) => c.id === customerId);
      return {
        customers: state.customers.filter((c) => c.id !== customerId),
        logs: [
          {
            id: uid("log"),
            type: "SYSTEM",
            message: `${customer?.name ?? "Müşteri"} hesabı silindi`,
            actor: "Mehmet (İşveren)",
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  completeFirstLogin: (customerId) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId ? { ...c, mustChangePassword: false } : c
      ),
    })),

  resetCustomerPassword: (customerId, actor) =>
    set((state) => {
      const customer = state.customers.find((c) => c.id === customerId);
      return {
        customers: state.customers.map((c) =>
          c.id === customerId ? { ...c, mustChangePassword: true } : c
        ),
        logs: [
          {
            id: uid("log"),
            type: "AUTH",
            message: `${customer?.name ?? "Müşteri"} için şifre sıfırlandı, geçici şifre gönderildi`,
            actor,
            date: new Date().toISOString(),
          },
          ...state.logs,
        ],
      };
    }),

  updateCustomerProfile: (customerId, patch) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === customerId ? { ...c, ...patch } : c)),
    })),

  resetToSeed: () =>
    set({
      products: seedProducts,
      customers: seedCustomers,
      orders: seedOrders,
      payments: seedPayments,
      logs: seedLogs,
    }),
    }),
    {
      name: "optiv-commerce",
      storage: createJSONStorage(() => localStorage),
      // SSR and the first client render both use the seed data; the stored
      // snapshot is applied after mount so hydration can never mismatch.
      skipHydration: true,
    }
  )
);

export function useCustomer(customerId: string | undefined) {
  return useCommerceStore((s) => s.customers.find((c) => c.id === customerId));
}

export function useProduct(productId: string | undefined) {
  return useCommerceStore((s) => s.products.find((p) => p.id === productId));
}
