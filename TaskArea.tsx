"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { TASKS } from "../data";
import { V2Icon } from "../icons";
import { isTaskLocked, V2TaskCard, V2TaskRow } from "./TaskItems";
import type { V2Task } from "../types";

const SLIDE_EASE = "cubic-bezier(.65,0,.25,1)";
const SLIDE_MS = 620;
const EASE = "cubic-bezier(.2,.8,.2,1)";

const CONF = ["#3FA6E6", "#B4D34A", "#FF6A2B", "#635BFF", "#F2C94C", "#0E5189"];

const DEFAULT_GRID: [string, string, string][] = [
  ["check", "Setup", "Done today"],
  ["calendar", "Launch call with TJ", ""],
  ["sparkle", "Ads being built", "Right after kickoff"],
  ["megaphone", "Ads live", "Thu, Oct 22"],
];
const GRID_HUES = ["blue", "green", "gold", "violet"];

export function V2EmptyArt({ done }: { done?: boolean }) {
  return (
    <div className="ec-art" aria-hidden="true">
      <div className="ec-card c1">
        <i />
        <span>
          <b />
          <em />
        </span>
      </div>
      <div className="ec-card c2">
        <i />
        <span>
          <b />
          <em />
        </span>
      </div>
      <div className="ec-card c3">
        <i className={done ? "ec-ok" : "ec-wip"}>
          {done && <V2Icon name="check" size={16} />}
        </i>
        <span>
          <b />
          <em />
        </span>
      </div>
    </div>
  );
}

export function V2HappyState({
  userName,
  slot,
  doneNote,
  onGoDashboard,
  onOpen,
  tasks = TASKS,
  ctaLabel = "Go to home",
  secondaryLabel = "Add kickoff to calendar",
  onSecondary,
  gridItems = DEFAULT_GRID,
}: {
  userName: string;
  slot?: string | null;
  doneNote: (id: string) => string;
  onGoDashboard: () => void;
  onOpen?: (id: string) => void;
  tasks?: V2Task[];
  ctaLabel?: string;
  secondaryLabel?: string | null;
  onSecondary?: () => void;
  /** [icon, label, value][] */
  gridItems?: [string, string, string][];
}) {
  const bits = Array.from({ length: 26 }, (_, i) => ({
    "--x": `${4 + i * 3.7}%`,
    "--c": CONF[i % CONF.length],
    "--d": `${(i % 7) * 90}ms`,
    "--dx": `${(i % 2 ? 1 : -1) * (20 + (i % 5) * 12)}px`,
    "--r": `${(i % 2 ? 1 : -1) * (200 + i * 17)}deg`,
  }));
  return (
    <div className="happy">
      <div className="confetti" aria-hidden="true">
        {bits.map((s, i) => (
          <i key={i} style={s as React.CSSProperties} />
        ))}
      </div>
      <div className="hp-score">
        <span className="hp-num num">
          {tasks.length}
          <span>/{tasks.length}</span>
        </span>
        <span className="hp-chip">
          <i>
            <V2Icon name="check" size={14} />
          </i>
          All tasks done
        </span>
      </div>
      <h3>You&apos;re all set, {userName}!</h3>
      <p>
        Everything we need is in. Your portal is unlocked and your strategist is
        getting ready for kickoff.
      </p>
      <div className="hp-cta">
        <button type="button" className="cta" onClick={onGoDashboard}>
          {ctaLabel} <V2Icon name="arrowR" size={16} />
        </button>
        {secondaryLabel && (
          <button type="button" className="obtn" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        )}
      </div>
      <div className="hp-grid">
        {gridItems.map(([ic, label, val], i) => (
          <div key={label} className={`hp-item g ${GRID_HUES[i % 4]}`}>
            <span className="ic">
              <V2Icon name={ic} />
            </span>
            <span>{label}</span>
            <b>{val || slot || "Booked"}</b>
          </div>
        ))}
      </div>
      <div className="hp-list">
        <h4>Completed tasks</h4>
        {tasks.map((t, i) => (
          <div
            key={t.id}
            className="hp-li rise"
            style={{ "--d": i + 2 } as React.CSSProperties}
            onClick={onOpen ? () => onOpen(t.id) : undefined}
            role={onOpen ? "button" : undefined}
            tabIndex={onOpen ? 0 : undefined}
            onKeyDown={
              onOpen
                ? (e) => e.key === "Enter" && onOpen(t.id)
                : undefined
            }
          >
            <span className="hk">
              <V2Icon name="check" size={14} />
            </span>
            <span className="tx">
              <b>{t.title}</b>
              <span>{doneNote(t.id)}</span>
            </span>
            <em className="num">{t.time} min</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export function V2TaskArea({
  tab,
  done,
  sort,
  flash,
  slot,
  userName,
  doneNote,
  onOpen,
  onPeek,
  onGoTodo,
  onGoDashboard,
  onSkip,
  tasks = TASKS,
  happyProps,
}: {
  tab: "todo" | "done";
  done: Record<string, boolean>;
  sort: "priority" | "time";
  flash?: string | null;
  slot?: string | null;
  userName: string;
  doneNote: (id: string) => string;
  onOpen: (id: string) => void;
  onPeek: (id: string) => void;
  onGoTodo: () => void;
  onGoDashboard: () => void;
  onSkip?: (t: V2Task) => void;
  tasks?: V2Task[];
  happyProps?: Partial<
    Pick<
      React.ComponentProps<typeof V2HappyState>,
      "ctaLabel" | "secondaryLabel" | "onSecondary" | "gridItems"
    >
  >;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const meta = useRef<{ ids: string[]; rects: Record<string, DOMRect> }>({
    ids: [],
    rects: {},
  });
  const [ghostCard, setGhostCard] = useState<V2Task | null>(null);

  /* [].every(...) is true in JS — don't treat a cold/empty load as done. */
  const allDone = tasks.length > 0 && tasks.every((t) => done[t.id]);
  const pending = tasks.filter((t) => !done[t.id]);
  const sorted =
    sort === "time" ? [...pending].sort((a, b) => a.time - b.time) : pending;
  const curId = pending[0]?.id;
  const up = sorted.filter((t) => t.id !== curId);
  const top = up.slice(0, 2);
  const rest = up.slice(2);
  const topKey = top.map((t) => t.id).join(",");

  /* the cards move like a carousel when the current step completes:
     "Next up" slides out left, "Then" takes its place, the step after
     it slides in from the right, and the rows rise in below */
  const [cardsSnap, setCardsSnap] = useState(topKey);
  if (cardsSnap !== topKey) {
    const prevIds = cardsSnap ? cardsSnap.split(",") : [];
    if (prevIds[0] && !top.some((t) => t.id === prevIds[0])) {
      const left = tasks.find((x) => x.id === prevIds[0]);
      if (left) setGhostCard(left);
    }
    setCardsSnap(topKey);
  }

  /* run the carousel once per leaving card, using the rects captured
     by the effect below on the previous commit */
  useLayoutEffect(() => {
    if (!ghostCard) return;
    const cardsEl = areaRef.current?.querySelector<HTMLElement>(".cards");
    const g = ghostRef.current;
    const prev = meta.current;
    const r0 = prev.rects[ghostCard.id];
    if (!cardsEl || !g || !r0) {
      const id = window.requestAnimationFrame(() => setGhostCard(null));
      return () => window.cancelAnimationFrame(id);
    }
    const r1 = top[0] ? prev.rects[top[0].id] : undefined;
    const gap = r1 ? r1.left - r0.left : r0.width;
    const br = cardsEl.getBoundingClientRect();
    Object.assign(g.style, {
      left: `${r0.left - br.left}px`,
      top: `${r0.top - br.top}px`,
      width: `${r0.width}px`,
      height: `${r0.height}px`,
    });
    g.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: `translateX(${-gap * 0.6}px)`, opacity: 0 },
      ],
      { duration: SLIDE_MS * 0.8, easing: SLIDE_EASE, fill: "forwards" }
    ).onfinish = () => setGhostCard(null);
    const els = Array.from(
      cardsEl.querySelectorAll<HTMLElement>(":scope > .tcard")
    );
    if (els[0] && r1) {
      const r = els[0].getBoundingClientRect();
      els[0].animate(
        [
          {
            transform: `translate(${r1.left - r.left}px,${r1.top - r.top}px)`,
          },
          { transform: "none" },
        ],
        { duration: SLIDE_MS, easing: SLIDE_EASE }
      );
    }
    if (els[1] && gap) {
      els[1].animate(
        [
          { transform: `translateX(${gap * 0.6}px)`, opacity: 0 },
          { transform: "none", opacity: 1 },
        ],
        { duration: SLIDE_MS, delay: 60, easing: SLIDE_EASE, fill: "backwards" }
      );
    }
    areaRef.current
      ?.querySelectorAll<HTMLElement>(".row,.empty-c")
      .forEach((el, i) =>
        el.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 420,
            delay: 200 + i * 50,
            easing: EASE,
            fill: "backwards",
          }
        )
      );
  }, [ghostCard]); // eslint-disable-line react-hooks/exhaustive-deps

  /* capture the rendered card rects on every commit so the ghost can
     replay the leaving card's last position */
  useLayoutEffect(() => {
    const cardsEl = areaRef.current?.querySelector<HTMLElement>(".cards");
    if (!cardsEl) {
      meta.current = { ids: [], rects: {} };
      return;
    }
    const rects: Record<string, DOMRect> = {};
    Array.from(
      cardsEl.querySelectorAll<HTMLElement>(":scope > .tcard")
    ).forEach((el, i) => {
      const id = top[i]?.id;
      if (id) rects[id] = el.getBoundingClientRect();
    });
    meta.current = { ids: top.map((t) => t.id), rects };
  });

  if (allDone) {
    return (
      <div id="taskArea">
        <V2HappyState
          userName={userName}
          slot={slot}
          doneNote={doneNote}
          onGoDashboard={onGoDashboard}
          onOpen={onOpen}
          tasks={tasks}
          {...happyProps}
        />
      </div>
    );
  }

  if (tab === "done") {
    const doneTasks = tasks.filter((t) => done[t.id]);
    const ord = flash
      ? [tasks.find((t) => t.id === flash)!, ...doneTasks.filter((t) => t.id !== flash)]
      : doneTasks;
    return (
      <div id="taskArea">
        {doneTasks.length ? (
          <div className="rows">
            {ord.map((t) => (
              <V2TaskRow
                key={t.id}
                t={t}
                done
                doneMap={done}
                flash={t.id === flash}
                onOpen={onOpen}
                onPeek={onPeek}
                onSkip={onSkip}
                tasks={tasks}
              />
            ))}
          </div>
        ) : (
          <div className="empty-c">
            <V2EmptyArt done />
            <h3>No completed tasks yet</h3>
            <p>
              Finished tasks will show up here.
              {pending[0] &&
                ` Your next one, ${pending[0].short.toLowerCase()}, takes about ${pending[0].time} minutes.`}
            </p>
            <button type="button" className="obtn" onClick={onGoTodo}>
              See what&apos;s next
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!up.length) {
    return (
      <div id="taskArea">
        <div className="empty-c">
          <V2EmptyArt done />
          <h3>This is your last step</h3>
          <p>Finish it above and your portal unlocks right away.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="taskArea" ref={areaRef}>
      <div className="cards">
        {top.map((t, i) => (
          <V2TaskCard
            key={t.id}
            t={t}
            kind={i === 0 ? "green" : "violet"}
            eyebrow={i === 0 ? "Next up" : "Then"}
            done={done}
            onOpen={onOpen}
            onSkip={onSkip}
            tasks={tasks}
          />
        ))}
        {ghostCard && (
          <div className="tcard-ghost" ref={ghostRef} aria-hidden="true">
            <V2TaskCard
              t={ghostCard}
              kind="green"
              eyebrow="Next up"
              done={done}
              onOpen={() => {}}
              tasks={tasks}
            />
          </div>
        )}
      </div>
      {rest.length > 0 && (
        <div className="rows">
          {rest.map((t) => (
            <V2TaskRow
              key={t.id}
              t={t}
              done={false}
              doneMap={done}
              onOpen={(id) => !isTaskLocked(id, done, tasks) && onOpen(id)}
              onPeek={onPeek}
              onSkip={onSkip}
              tasks={tasks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
