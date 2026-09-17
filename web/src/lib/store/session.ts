"use client";

import { create } from "zustand";
import type { UserRole } from "../types";

interface SessionState {
  role: UserRole;
  customerId: string;
  employer: { name: string; email: string; phone: string };
  superadmin: { name: string; email: string };
  setRole: (role: UserRole) => void;
  setCustomerId: (id: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  role: "customer",
  customerId: "c1",
  employer: { name: "Mehmet Derya", email: "mehmet@optiv.com", phone: "0532 111 22 33" },
  superadmin: { name: "Fatih Öztürk", email: "fatihozturk0631@gmail.com" },
  setRole: (role) => set({ role }),
  setCustomerId: (customerId) => set({ customerId }),
}));
