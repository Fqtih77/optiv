"use client";

import { useEffect } from "react";
import { useCommerceStore } from "@/lib/store/commerce";
import { useLandingStore } from "@/lib/store/landing";

/**
 * Applies the persisted snapshots after mount. Both stores use
 * `skipHydration`, so server and first client render stay identical.
 */
export function StoreHydrator() {
  useEffect(() => {
    useCommerceStore.persist.rehydrate();
    useLandingStore.persist.rehydrate();
  }, []);

  return null;
}
