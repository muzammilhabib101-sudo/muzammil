"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Shows the visitor's current year. The static HTML carries `buildYear`, and
 * the client swaps in the live year after hydration, so the footer stays
 * correct even if the site isn't rebuilt in a new year.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  return <>{year}</>;
}
