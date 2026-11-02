"use client";

import { TASKS } from "../data";
import { V2Brand, V2Icon } from "../icons";
import type { V2Task } from "../types";

export function isTaskLocked(
  id: string,
  done: Record<string, boolean>,
  tasks: V2Task[] = TASKS
) {
  const i = tasks.findIndex((t) => t.id === id);
  const cur = tasks.findIndex((t) => !done[t.id]);
  return !done[id] && cur > -1 && i > cur;
}

function LockMark({
  t,
  cls,
  tasks,
}: {
  t: V2Task;
  cls: string;
  tasks: V2Task[];
}) {
  const prev = tasks[tasks.findIndex((x) => x.id === t.id) - 1];
  return (
    <span
      className={`${cls} lk`}
      tabIndex={0}
      data-tip={`Available after you finish "${prev ? prev.title : "the previous step"}"`}
      aria-label="Locked"
    >
      <V2Icon name="lock" />
    </span>
  );
}

function Logos({ t }: { t: V2Task }) {
  return (
    <span className="lstack">
      {t.logos?.map(([k, n]) => (
        <i key={k} data-tip={n}>
          <V2Brand name={k} />
        </i>
      ))}
    </span>
  );
}

function SkipBtn({ t, onSkip }: { t: V2Task; onSkip?: (t: V2Task) => void }) {
  if (!onSkip || !t.skippable) return null;
  return (
    <button
      type="button"
      className="obtn"
      onClick={(e) => {
        e.stopPropagation();
        onSkip(t);
      }}
    >
      Skip
    </button>
  );
}

/* the big "Next up"/"Then" gradient cards */
export function V2TaskCard({
  t,
  kind,
  eyebrow,
  done,
  onOpen,
  onSkip,
  tasks = TASKS,
}: {
  t: V2Task;
  kind: string;
  eyebrow: string;
  done: Record<string, boolean>;
  onOpen: (id: string) => void;
  onSkip?: (t: V2Task) => void;
  tasks?: V2Task[];
}) {
  const locked = isTaskLocked(t.id, done, tasks);
  const actionable = !locked && t.actionReady !== false;
  return (
    <div
      className={`tcard ${kind}`}
      onClick={() => !locked && onOpen(t.id)}
    >
      <div className="hd">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h3>{t.title}</h3>
        </div>
        {locked ? (
          <LockMark t={t} cls="go" tasks={tasks} />
        ) : t.logos ? (
          <Logos t={t} />
        ) : (
          <span className="go" aria-hidden="true">
            <span className="gi">
              <V2Icon name={t.icon} />
            </span>
            <span className="ga">
              <V2Icon name="arrowUR" />
            </span>
          </span>
        )}
      </div>
      <div className="vals">
        <div>
          <small>Estimated time</small>
          <strong className="num">{t.time} min</strong>
        </div>
        {t.kv && (
          <div className="r">
            <small>{t.kv[0]}</small>
            <strong>{t.kv[1]}</strong>
          </div>
        )}
      </div>
      <div className="pattern" />
      <div className="ft">
        <span>{t.desc}</span>
        {!locked && (
          <>
            <SkipBtn t={t} onSkip={onSkip} />
            <button
              type="button"
              className="tbtn"
              title={
                actionable
                  ? undefined
                  : "Available once the integration is enabled"
              }
              onClick={(e) => {
                e.stopPropagation();
                onOpen(t.id);
              }}
            >
              {t.cta}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* the compact rows below the cards, and completed rows in the Done tab */
export function V2TaskRow({
  t,
  done,
  doneMap,
  flash,
  onOpen,
  onPeek,
  onSkip,
  tasks = TASKS,
}: {
  t: V2Task;
  done: boolean;
  doneMap: Record<string, boolean>;
  flash?: boolean;
  onOpen: (id: string) => void;
  onPeek: (id: string) => void;
  onSkip?: (t: V2Task) => void;
  tasks?: V2Task[];
}) {
  const locked = !done && isTaskLocked(t.id, doneMap, tasks);
  const isSkipped = t.status === "skipped";
  const isSubmitted = t.status === "submitted";
  // skipped/submitted still carry an actionable surface (resubmit/redo),
  // so they open the drawer instead of just peeking the hero
  const canPeek = done && !isSkipped && !isSubmitted;
  return (
    <div
      className={`row${done ? " done" : ""}${flash ? " flash" : ""}`}
      data-peek={canPeek ? t.id : undefined}
      onClick={() =>
        canPeek ? onPeek(t.id) : !locked && onOpen(t.id)
      }
    >
      {!done && locked ? (
        <LockMark t={t} cls="ic" tasks={tasks} />
      ) : !done && t.logos ? (
        <Logos t={t} />
      ) : (
        <span className="ic">
          <V2Icon name={done && !isSkipped ? "check" : t.icon} />
        </span>
      )}
      <div className="tx">
        <b>{t.title}</b>
        <span>{t.desc}</span>
      </div>
      <span className="time num">
        <V2Icon name="clock" size={14} />
        {t.time} min
      </span>
      {isSkipped && <span className="status">Skipped</span>}
      {isSubmitted && <span className="status">Under review</span>}
      {/* Proto hides Skip/Open on locked rows — only the lock affordance shows */}
      {!done && !locked && <SkipBtn t={t} onSkip={onSkip} />}
      {(done || !locked) && (
        <button
          className="obtn"
          onClick={(e) => {
            e.stopPropagation();
            if (canPeek) onPeek(t.id);
            else onOpen(t.id);
          }}
        >
          {done && !isSkipped ? "View" : "Open"}
        </button>
      )}
    </div>
  );
}
