"use client";

import { useMemo, useSyncExternalStore } from "react";
import { HISTORY, type Consultation } from "@/lib/consultations";

const KEY = "fc_history";
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const read = () => {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

/** Mock history plus anything finished in this browser, newest first. */
export function useHistory(): Consultation[] {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  return useMemo(() => {
    let local: Consultation[] = [];
    try {
      local = JSON.parse(raw) as Consultation[];
    } catch {
      local = [];
    }
    const ids = new Set(local.map((c) => c.id));
    return [...local, ...HISTORY.filter((c) => !ids.has(c.id))].sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start));
  }, [raw]);
}
