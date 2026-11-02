"use client";

import { useState } from "react";
import { V2App, V2AppState, V2_EMPTY_PROFILE } from "@/components/v2/V2App";

/* design preview for the ported v2 components - no API wiring, local state only */
export default function V2DemoPage() {
  const [state, setState] = useState<V2AppState>({
    done: {},
    profile: V2_EMPTY_PROFILE,
    social: {},
    acc: {},
    slot: null,
  });
  return (
    <V2App
      userName="Andrew Leonard"
      state={state}
      onState={(p) => setState((s) => ({ ...s, ...p }))}
    />
  );
}
