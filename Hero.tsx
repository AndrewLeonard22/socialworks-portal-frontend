"use client";

import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { TASKS } from "../data";
import { V2Brand, V2Icon } from "../icons";
import type { V2Task } from "../types";

const HUES = ["blue", "green", "gold"];
const EASE = "cubic-bezier(.2,.8,.2,1)";
const SLIDE_EASE = "cubic-bezier(.65,0,.25,1)";
const SLIDE_MS = 620;

/* the label rolls letter by letter, like the reference's ctaSwap */
const roll = (t: string) => (
  <span className="cxt">
    {[...t].map((c, i) => (
      <span key={i} className="cxl">
        {c === " " ? " " : c}
      </span>
    ))}
  </span>
);

/* the button eases from its old width to the width of the new label */
const ctaGrow = (b: HTMLElement, w0: number) => {
  const w1 = b.getBoundingClientRect().width;
  b.style.transition = "none";
  b.style.width = `${w0}px`;
  void b.offsetWidth;
  b.style.transition = `width .45s ${EASE}, background-color .35s ease, color .35s ease`;
  b.style.width = `${w1}px`;
  window.setTimeout(() => {
    b.style.width = "";
    b.style.transition = "";
  }, 480);
};

/* a small burst of confetti from the button: the step is done */
const heroBurst = (btn: HTMLElement) => {
  const hero = btn.closest<HTMLElement>(".progress");
  if (!hero) return;
  const hr = hero.getBoundingClientRect();
  const br = btn.getBoundingClientRect();
  const cx = br.left - hr.left + br.width / 2;
  const cy = br.top - hr.top + br.height / 2;
  const cols = ["#fff", "#B4D34A", "#E4C04A", "#A6E1FF", "#8EDBA6"];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("i");
    p.className = "hb";
    const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.5;
    const d = 40 + Math.random() * 45;
    const sz = 4 + Math.random() * 3;
    p.style.cssText = `left:${cx}px;top:${cy}px;width:${sz}px;height:${sz * (i % 3 ? 1 : 2.2)}px;background:${cols[i % cols.length]};border-radius:${i % 2 ? "50%" : "2px"}`;
    hero.appendChild(p);
    p.animate(
      [
        { transform: "translate(-50%,-50%) scale(.3)", opacity: 0 },
        {
          transform: "translate(-50%,-50%) scale(.8)",
          opacity: 0.9,
          offset: 0.15,
        },
        {
          transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) rotate(${(Math.random() - 0.5) * 180}deg) scale(1)`,
          opacity: 0,
        },
      ],
      {
        duration: 1100 + Math.random() * 400,
        delay: Math.random() * 120,
        easing: "cubic-bezier(.15,.7,.25,1)",
        fill: "backwards",
      }
    ).onfinish = () => p.remove();
  }
};

export function V2Hero({
  done,
  peek,
  svcState,
  completing,
  onAdvance,
  onCta,
  onStep,
  tasks = TASKS,
}: {
  done: Record<string, boolean>;
  /** a finished task id being previewed in the hero */
  peek?: string | null;
  /** the task id whose completion is animating in the hero */
  completing?: string | null;
  /** fires when the completion beat ends and the hero slides on */
  onAdvance?: () => void;
  /** connected-service state for the "access" task logo stack */
  svcState?: Record<string, boolean>;
  onCta: (task: V2Task) => void;
  onStep: (taskId: string) => void;
  tasks?: V2Task[];
}) {
  const fillRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const advanceRef = useRef(onAdvance);
  const [ghost, setGhost] = useState<{ node: ReactNode; dir: number } | null>(
    null
  );

  const nx = tasks.find((t) => !done[t.id]);
  const mins = tasks
    .filter((t) => !done[t.id])
    .reduce((a, t) => a + t.time, 0);
  const cur = tasks.findIndex((t) => !done[t.id]);
  const peekTask = peek ? tasks.find((t) => t.id === peek) : null;
  const completingTask = completing
    ? tasks.find((t) => t.id === completing) ?? null
    : null;
  const shown = completingTask ?? peekTask ?? nx ?? null;
  const mode = completingTask
    ? "completing"
    : peekTask
      ? "peek"
      : nx
        ? "next"
        : "alldone";
  const shownIdx = shown ? tasks.indexOf(shown) : tasks.length;
  const hueIdx = mode === "peek" ? shownIdx : Math.max(cur, 0);
  const target = cur === -1 ? tasks.length - 1 : Math.max(cur, 0);
  const width = `calc((100% - 100%/6) * ${target / (tasks.length - 1)})`;

  /* the score content is built once per render; the ghost reuses the
     last painted copy (ids stripped, no handlers) while the live one
     shows the next state */
  const scoreContent = (withIds: boolean): ReactNode => (
    <>
      <div className="big num">
        <b className="bn">
          {shown ? shownIdx + 1 : tasks.length}
        </b>
        <span>/{tasks.length}</span>
      </div>
      <div>
        <h2>
          {mode === "peek" ? (
            <>
              Done: <b>{peekTask!.title}</b>
            </>
          ) : shown ? (
            <>
              Next: <b>{shown.title}</b>
            </>
          ) : (
            "All tasks done"
          )}
        </h2>
        <p {...(withIds ? { id: "scoreSub" } : {})}>
          {mode === "peek"
            ? peekTask!.desc
            : shown
              ? `${mins} min left`
              : "Your portal is unlocked"}
        </p>
      </div>
      {(shown?.id === "access" || shown?.id === "share_access") &&
        mode !== "peek" && (
          <button
            type="button"
            className="lstack hero-svc"
            aria-hidden="true"
            tabIndex={-1}
          >
            {shown.logos?.map(([k, n]) => (
              <i key={k} data-tip={n} className={svcState?.[k] ? "on" : ""}>
                <V2Brand name={k} />
              </i>
            ))}
          </button>
        )}
      {mode === "completing" ? (
        <button
          type="button"
          ref={ctaRef}
          {...(withIds ? { id: "v2-curCta" } : {})}
          className="cta cur-cta ok"
          tabIndex={-1}
        >
          <span className="cxs">
            <span className="cxw o">
              {roll(shown!.cta)}
              <i className="cxi">
                <V2Icon name="arrowR" size={16} />
              </i>
            </span>
            <span className="cxw n">
              {roll("Completed")}
              <i className="cxi">
                <V2Icon name="check" size={16} />
              </i>
            </span>
          </span>
        </button>
      ) : mode === "peek" ? (
        <button
          type="button"
          {...(withIds ? { id: "v2-curCta" } : {})}
          className="cta cur-cta ok"
          onClick={() => onCta(peekTask!)}
        >
          Completed{" "}
          <span className="ar">
            <V2Icon name="check" size={16} />
          </span>
        </button>
      ) : nx ? (
        <span className="hero-acts">
          <button
            type="button"
            {...(withIds ? { id: "v2-curCta" } : {})}
            className="cta cur-cta"
            onClick={() => onCta(nx)}
          >
            {nx.cta}{" "}
            <span className="ar">
              <V2Icon name="arrowR" size={16} />
            </span>
          </button>
        </span>
      ) : null}
    </>
  );

  /* render-phase transition detection (same pattern as the ?focus=
     consumer in the page): the snapshot keeps the last painted score
     markup, and when the shown step changes it becomes the ghost that
     slides out while the live score shows the next state */
  const shownId = mode === "alldone" ? "__alldone" : (shown?.id ?? null);
  const snapKey = `${shownId}:${mins}:${mode}`;
  const currentNode = scoreContent(true);
  const [snap, setSnap] = useState<{
    key: string;
    id: string | null;
    node: ReactNode;
  }>(() => ({ key: snapKey, id: shownId, node: currentNode }));
  if (snap.key !== snapKey) {
    const prevIdx =
      snap.id === "__alldone" || snap.id === null
        ? tasks.length
        : tasks.findIndex((t) => t.id === snap.id);
    const nextIdx =
      shownId === "__alldone" || shownId === null ? tasks.length : shownIdx;
    if (snap.node && snap.id !== shownId && prevIdx >= 0 && prevIdx !== nextIdx) {
      setGhost({ node: snap.node, dir: nextIdx > prevIdx ? 1 : -1 });
    }
    setSnap({ key: snapKey, id: shownId, node: scoreContent(false) });
  }

  /* the hero is a vertical slider: the old score slides out on the
     direction side, the new one comes in from the other */
  useLayoutEffect(() => {
    if (!ghost) return;
    const hero = heroRef.current;
    const score = scoreRef.current;
    const g = ghostRef.current;
    if (!hero || !score || !g) return;
    const hr = hero.getBoundingClientRect();
    const r = score.getBoundingClientRect();
    Object.assign(g.style, {
      left: `${r.left - hr.left}px`,
      top: `${r.top - hr.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
    const anim = g.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: `translateY(${-ghost.dir * 100}%)`, opacity: 0 },
      ],
      { duration: SLIDE_MS, easing: SLIDE_EASE, fill: "forwards" }
    );
    anim.onfinish = () => setGhost(null);
    score.animate(
      [
        { transform: `translateY(${ghost.dir * 100}%)`, opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: SLIDE_MS, easing: SLIDE_EASE }
    );
    return () => anim.cancel();
  }, [ghost]);

  /* completing a step, the reference's four beats: the CTA rolls into
     "Completed", a confetti burst, a beat, then the hero slides up */
  const completeId = completingTask?.id ?? null;
  useEffect(() => {
    if (!completeId) return;
    const b = ctaRef.current;
    if (!b) return;
    const o = Array.from(
      b.querySelectorAll<HTMLElement>(".cxw.o .cxl")
    );
    const n = Array.from(
      b.querySelectorAll<HTMLElement>(".cxw.n .cxl")
    );
    const oi = b.querySelector<HTMLElement>(".cxw.o .cxi");
    const ni = b.querySelector<HTMLElement>(".cxw.n .cxi");
    const st = 12;
    const w0 = b.getBoundingClientRect().width;
    b.style.width = `${w0}px`;
    o.forEach((l, i) =>
      l.animate(
        [
          { transform: "none", opacity: 1 },
          { transform: "translateY(-110%)", opacity: 0 },
        ],
        {
          duration: 240,
          delay: i * st,
          easing: "cubic-bezier(.55,0,.75,.3)",
          fill: "forwards",
        }
      )
    );
    oi?.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "translateY(-60%)" },
      ],
      { duration: 220, easing: "ease-in", fill: "forwards" }
    );
    const inAt = 180 + o.length * st;
    n.forEach((l, i) =>
      l.animate(
        [
          { transform: "translateY(110%)", opacity: 0 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 380, delay: inAt + i * st, easing: EASE, fill: "backwards" }
      )
    );
    const grow = window.setTimeout(() => {
      b.style.width = "";
      ctaGrow(b, w0);
    }, inAt - 60);
    const end = inAt + n.length * st + 380;
    ni?.animate(
      [
        { opacity: 0, transform: "scale(.4) rotate(-30deg)" },
        { opacity: 1, transform: "scale(1.15)", offset: 0.6 },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: 420,
        delay: end - 300,
        easing: "cubic-bezier(.3,1.3,.5,1)",
        fill: "backwards",
      }
    );
    const burst = window.setTimeout(() => heroBurst(b), end + 120);
    const adv = window.setTimeout(
      () => advanceRef.current?.(),
      end + 120 + 700
    );
    return () => {
      window.clearTimeout(grow);
      window.clearTimeout(burst);
      window.clearTimeout(adv);
    };
  }, [completeId]);

  useLayoutEffect(() => {
    advanceRef.current = onAdvance;
  });

  useEffect(() => {
    const f = fillRef.current;
    if (!f) return;
    if (first.current) {
      f.style.width = "0";
      const t = setTimeout(() => (f.style.width = width), 350);
      first.current = false;
      return () => clearTimeout(t);
    }
    f.style.width = width;
  }, [width]);

  return (
    <div
      className="progress hero"
      id="v2-hero"
      ref={heroRef}
      data-hue={HUES[hueIdx % 3]}
    >
      <i className="hue green" aria-hidden="true" />
      <i className="hue gold" aria-hidden="true" />
      <div className="score" ref={scoreRef}>
        {currentNode}
      </div>
      {ghost && (
        <div className="score ghost" ref={ghostRef} aria-hidden="true">
          {ghost.node}
        </div>
      )}
      <div className="steps">
        <i className="fill" ref={fillRef} />
        {tasks.map((t, i) => {
          const dn = done[t.id];
          return (
            <button
              key={t.id}
              className={`step${dn ? " done" : ""}${i === cur ? " cur" : ""}`}
              aria-label={`${t.short}: ${dn ? "done" : i === cur ? "current" : "to do"}`}
              onClick={() => onStep(t.id)}
            >
              <span className="d">
                {dn ? <V2Icon name="check" size={14} /> : i === cur ? "" : i + 1}
              </span>
              <span>{t.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
