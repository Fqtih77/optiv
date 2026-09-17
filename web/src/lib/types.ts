export type ProductType = "FASHION" | "KLASIK";

export interface Product {
  id: string;
  code: string;
  name: string;
  type: ProductType;
  thicknessMm: number;
  unitPrice: number;
  totalIn: number;
  remaining: number;
  colorFrom: string;
  colorTo: string;
}

export type StockStatus = "STOKTA" | "AZALIYOR" | "KRITIK" | "TUKENDI";

export type OrderStatus = "PENDING" | "APPROVED" | "CANCELLED";

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  decidedAt?: string;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
  balance: number;
  openingBalance: number;
  createdAt: string;
  mustChangePassword: boolean;
}

export interface Payment {
  id: string;
  customerId: string;
  date: string;
  amount: number;
  note?: string;
}

export type LogType = "ORDER" | "PRODUCT" | "PAYMENT" | "AUTH" | "SYSTEM";

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  actor: string;
  date: string;
  meta?: string;
}

export type UserRole = "customer" | "employer" | "superadmin";
