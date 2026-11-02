"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// False during SSR and every boundary's hydration render, true after.
// First render is always false on server and client, so markup that
// depends on it cannot mismatch during hydration.
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
}
