"use client";

import { TASKS, UNLOCKS } from "../data";
import { V2Icon } from "../icons";

export function V2UnlockCard({
  done,
  items = UNLOCKS,
  allDone,
}: {
  done: Record<string, boolean>;
  /** [label, icon][] - real app passes Home/Leads/Reports */
  items?: [string, string][];
  /** override the derived all-done check (demo derives from `done`+TASKS) */
  allDone?: boolean;
}) {
  const ok = allDone ?? TASKS.every((t) => done[t.id]);
  return (
    <div className="card">
      <div className="ul-hd">
        <h3 className="ul-t">{ok ? "Portal unlocked" : "What unlocks next"}</h3>
      </div>
      <ul className={`ul-list${ok ? " open" : ""}`}>
        {items.map(([n, ic], i) => (
          <li key={n} style={{ "--i": i } as React.CSSProperties}>
            <V2Icon name={ic} />
            <span>{n}</span>
            <em aria-label={ok ? "Unlocked" : "Locked"}>
              <V2Icon name={ok ? "check" : "oLock"} size={16} />
            </em>
          </li>
        ))}
      </ul>
    </div>
  );
}
