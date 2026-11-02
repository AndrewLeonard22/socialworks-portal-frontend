"use client";

import { useEffect, useRef, useState } from "react";
import { TASKS } from "./data";
import { V2AssetsView } from "./dashboard/AssetsView";
import { V2WeekOne } from "./dashboard/WeekOne";
import { V2Icon } from "./icons";
import { V2EmptyArt, V2TaskArea } from "./onboarding/TaskArea";
import { V2ProfileCard } from "./onboarding/ProfileCard";
import { V2UnlockCard } from "./onboarding/UnlockCard";
import { V2Hero } from "./onboarding/Hero";
import { V2TaskTabs } from "./onboarding/TaskTabs";
import { V2AccessModal } from "./overlays/AccessModal";
import { V2CompanyModal } from "./overlays/CompanyModal";
import { V2DemoModal } from "./overlays/DemoModal";
import { V2Drawer } from "./overlays/Drawer";
import { V2SignPage } from "./overlays/SignPage";
import { V2Tour } from "./overlays/Tour";
import { V2TutorialModal } from "./overlays/TutorialModal";
import { V2DatePop, V2Range } from "./pops/DatePop";
import { V2NotificationsPop } from "./pops/NotificationsPop";
import { V2SocialPop } from "./pops/SocialPop";
import { V2Rail } from "./Rail";
import { V2Toast, v2toast } from "./Toast";
import { V2Tooltip } from "./Tooltip";
import type { V2Profile, V2Task } from "./types";

const DAY = 86400000;
const initialRange = (): V2Range => {
  const end = new Date();
  return { key: "30", end, start: new Date(+end - 29 * DAY) };
};

export interface V2AppState {
  done: Record<string, boolean>;
  profile: V2Profile;
  social: Record<string, string>;
  acc: Record<string, boolean>;
  slot: string | null;
}

export const V2_EMPTY_PROFILE: V2Profile = {
  name: "",
  site: "",
  logo: null,
  assets: { images: [], video: [], fonts: [], colors: {} },
};

/* full v2 assembly: rail + onboarding/dashboard/assets views + every overlay.
   All state lives here or in the parent; every action is a callback so this
   can sit on top of the real API layer without changes. */
export function V2App({
  userName,
  state,
  onState,
  onTaskStart,
  onTaskDone,
  onTaskUndo,
  onHelp,
}: {
  userName: string;
  state: V2AppState;
  onState: (s: Partial<V2AppState>) => void;
  /** override what "start a task" does (e.g. real OAuth/esign/questionnaire);
      default opens the guided demo */
  onTaskStart?: (t: V2Task, helpers: { demo: () => void; sign: () => void; access: () => void }) => void;
  onTaskDone?: (id: string, slot?: string) => void;
  onTaskUndo?: (id: string) => void;
  onHelp?: () => void;
}) {
  const { done, profile, social, acc, slot } = state;
  const allDone = TASKS.every((t) => done[t.id]);

  const [view, setView] = useState("onboarding");
  const [tab, setTab] = useState<"todo" | "done">("todo");
  const [sort, setSort] = useState<"priority" | "time">("priority");
  const [peek, setPeek] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [drawerTask, setDrawerTask] = useState<V2Task | null>(null);
  const [demoTask, setDemoTask] = useState<V2Task | null>(null);
  const [accOpen, setAccOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);
  const [coOpen, setCoOpen] = useState(false);
  const [tutOpen, setTutOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [bellAnchor, setBellAnchor] = useState<HTMLElement | null>(null);
  const [socOpen, setSocOpen] = useState<string | null>(null);
  const [socAnchor, setSocAnchor] = useState<HTMLElement | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null);
  const [range, setRange] = useState<V2Range | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => setRange(initialRange()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);

  const doneNote = (id: string) =>
    id === "meeting" && slot ? `Booked ${slot}` : "Completed";

  const complete = (id: string, slotVal?: string) => {
    onState({
      done: { ...done, [id]: true },
      slot: slotVal ?? slot,
    });
    setDrawerTask(null);
    setDemoTask(null);
    setAccOpen(false);
    setSignOpen(false);
    setPeek(null);
    setFlash(id);
    setTab("done");
    onTaskDone?.(id, slotVal);
    v2toast(
      TASKS.every((t) => t.id === id || done[t.id])
        ? "Setup complete · portal unlocked"
        : `${TASKS.find((t) => t.id === id)?.short} moved to Completed`,
      TASKS.every((t) => t.id === id || done[t.id]) ? "sparkle" : "check"
    );
  };

  const startTask = (t: V2Task) => {
    if (onTaskStart) {
      onTaskStart(t, {
        demo: () => setDemoTask(t),
        sign: () => setSignOpen(true),
        access: () => setAccOpen(true),
      });
      return;
    }
    setDemoTask(t);
  };

  const openTask = (id: string) => {
    const t = TASKS.find((x) => x.id === id);
    if (!t) return;
    if (done[id]) {
      setPeek(null);
      setDrawerTask(t);
    } else startTask(t);
  };

  const scrimOn = !!drawerTask;

  return (
    <div className="v2-root" ref={rootRef}>
      <div className="app">
        <V2Rail
          allDone={allDone}
          done={done}
          view={view}
          unread={0}
          userName={userName}
          onStep={(id) => {
            if (view !== "onboarding") setView("onboarding");
            if (done[id]) setPeek(id);
            else startTask(TASKS.find((t) => t.id === id)!);
          }}
          onNav={(v) => {
            if ((v === "dashboard" || v === "assets") && !allDone) return;
            setView(v);
          }}
          onBell={() => {
            setBellAnchor(
              (rootRef.current?.querySelector(".rail-bottom .rbtn") as HTMLElement) ??
                null
            );
            setNotifOpen((o) => !o);
          }}
        />
        <main className={`shell${allDone ? " done" : ""}`}>
          {view === "onboarding" && (
            <>
              <section className="col">
                <div className="greet">
                  <h1>
                    Hey, {userName.split(" ")[0]}!
                    <span>{allDone ? "Welcome aboard." : "Let's get you set up."}</span>
                  </h1>
                  <button
                    className="pill"
                    id="v2-tutorialBtn"
                    onClick={() => setTourOpen(true)}
                  >
                    <V2Icon name="play" size={14} />
                    How to onboard
                  </button>
                </div>
                <V2Hero
                  done={done}
                  peek={peek}
                  svcState={acc}
                  onCta={(t) => {
                    if (peek) setPeek(null);
                    else if (t.id === "agreement") setSignOpen(true);
                    else if (t.id === "access") setAccOpen(true);
                    else startTask(t);
                  }}
                  onStep={openTask}
                />
                <V2TaskTabs
                  tab={tab}
                  todoCount={Math.max(
                    0,
                    TASKS.filter((t) => !done[t.id]).length -
                      (TASKS.some((t) => !done[t.id]) ? 1 : 0)
                  )}
                  doneCount={TASKS.filter((t) => done[t.id]).length}
                  sort={sort}
                  onTab={setTab}
                  onSort={setSort}
                />
                <V2TaskArea
                  tab={tab}
                  done={done}
                  sort={sort}
                  flash={flash}
                  slot={slot}
                  userName={userName.split(" ")[0]}
                  doneNote={doneNote}
                  onOpen={openTask}
                  onPeek={(id) => setPeek(id)}
                  onGoTodo={() => setTab("todo")}
                  onGoDashboard={() => setView("dashboard")}
                />
                <div className="foot col-foot">
                  <span>© 2026 SocialWorks</span>
                  <span>
                    <a href="#privacy">Privacy</a>
                    <a href="#terms">Terms</a>
                  </span>
                </div>
              </section>
              <aside className="side">
                <V2ProfileCard
                  profile={profile}
                  social={social}
                  socOpen={socOpen}
                  onProfileChange={(p) => onState({ profile: { ...profile, ...p } })}
                  onSocialChange={(k, v) => onState({ social: { ...social, [k]: v ?? "" } })}
                  onSocOpen={(k) => {
                    setSocOpen(k);
                    setSocAnchor(
                      k
                        ? (rootRef.current?.querySelectorAll(".soc-row .soc")[
                            ["instagram", "facebook", "linkedin", "google"].indexOf(k)
                          ] as HTMLElement) ?? null
                        : null
                    );
                  }}
                  onSeeAllMedia={() => setView("assets")}
                />
                <V2UnlockCard done={done} />
              </aside>
            </>
          )}
          {view === "dashboard" && allDone && (
            <section className="dash is-empty" id="dashView">
              <div className="d-ip">
                <div className="empty-c">
                  <V2EmptyArt />
                  <h3>In progress</h3>
                </div>
              </div>
              <V2WeekOne
                userName={userName}
                company={{
                  name: profile.name || "Your company",
                  site: profile.site,
                  logo: profile.logo?.url ?? null,
                  social,
                }}
                slot={slot}
                range={range}
                onPeriodClick={(el) => {
                  setDateAnchor(el);
                  setDateOpen(true);
                }}
                onAction={(a) => v2toast(`Action: ${a}`)}
                onEditCompany={() => setCoOpen(true)}
              />
            </section>
          )}
          {view === "assets" && allDone && (
            <V2AssetsView
              profile={profile}
              onProfileChange={(p) => onState({ profile: { ...profile, ...p } })}
              onToast={v2toast}
            />
          )}
        </main>
      </div>

      {/* overlays */}
      <div className={`scrim${scrimOn ? " on" : ""}`} onClick={() => setDrawerTask(null)} />
      <V2Drawer
        task={drawerTask}
        done={drawerTask ? !!done[drawerTask.id] : false}
        slot={slot}
        onClose={() => setDrawerTask(null)}
        onComplete={complete}
        onUndo={(id) => {
          const nd = { ...done };
          delete nd[id];
          onState({ done: nd, slot: id === "meeting" ? null : slot });
          setDrawerTask(null);
          onTaskUndo?.(id);
          v2toast("Moved back to Up next", "x");
        }}
      />
      <V2DemoModal
        task={demoTask}
        open={!!demoTask}
        onClose={() => setDemoTask(null)}
        onComplete={complete}
      />
      <V2AccessModal
        open={accOpen}
        state={acc}
        url={profile.site}
        onToggle={(k, on) => onState({ acc: { ...acc, [k]: on } })}
        onUrl={(v) => onState({ profile: { ...profile, site: v } })}
        onDone={() => complete("access")}
        onClose={() => setAccOpen(false)}
        onHelp={() => onHelp?.()}
      />
      <V2SignPage
        open={signOpen}
        onClose={() => setSignOpen(false)}
        onDone={() => complete("agreement")}
        onHelp={() => onHelp?.()}
        onOpen={() => {}}
      />
      <V2CompanyModal
        open={coOpen}
        company={{
          name: profile.name,
          site: profile.site,
          logo: profile.logo?.url ?? null,
          social,
        }}
        onSave={(c) => {
          onState({
            profile: {
              ...profile,
              name: c.name,
              site: c.site,
              logo: c.logo ? { name: "logo.png", size: 0, url: c.logo } : profile.logo,
            },
            social: c.social,
          });
          setCoOpen(false);
          v2toast("Company details saved");
        }}
        onClose={() => setCoOpen(false)}
      />
      <V2TutorialModal open={tutOpen} onClose={() => setTutOpen(false)} />
      <V2Tour
        open={tourOpen}
        resolveEl={(sel) => rootRef.current?.querySelector(sel) ?? null}
        onFinish={() => {
          setTourOpen(false);
          v2toast("You're ready. Start with your first step", "sparkle");
        }}
      />
      <V2NotificationsPop
        open={notifOpen}
        anchor={bellAnchor}
        onClose={() => setNotifOpen(false)}
      />
      <V2SocialPop
        k={socOpen}
        anchor={socAnchor}
        value={socOpen ? social[socOpen] || "" : ""}
        onSave={(k, v) => {
          onState({ social: { ...social, [k]: v } });
          setSocOpen(null);
          if (v) v2toast("Profile saved");
        }}
        onRemove={(k) => {
          onState({ social: { ...social, [k]: "" } });
          setSocOpen(null);
          v2toast("Disconnected", "trash");
        }}
        onClose={() => setSocOpen(null)}
      />
      <V2DatePop
        open={dateOpen}
        anchor={dateAnchor}
        value={range ?? { key: "30", start: null, end: null }}
        onApply={(r) => {
          setRange(r);
          setDateOpen(false);
        }}
        onClose={() => setDateOpen(false)}
      />
      <V2Toast />
      <V2Tooltip />
    </div>
  );
}
