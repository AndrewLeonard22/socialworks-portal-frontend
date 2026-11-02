"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MODULES, TASKS } from "./data";
import { V2Icon } from "./icons";
import { auth_apis } from "@/api/auth";
import { useAppDispatch } from "@/store";
import { clearAuth } from "@/store/auth/reducer";

export function V2Rail({
  allDone,
  done,
  view,
  unread,
  userName,
  onStep,
  onNav,
  onBell,
}: {
  allDone: boolean;
  done: Record<string, boolean>;
  view: string;
  unread: number;
  userName: string;
  onStep: (taskId: string) => void;
  onNav: (view: string) => void;
  onBell: () => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cur = TASKS.findIndex((t) => !done[t.id]);
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isAct = (n: string) =>
    (n === "Onboarding" && view === "onboarding") ||
    (n === "Home" && view === "dashboard") ||
    (n === "Assets" && view === "assets");

  return (
    <nav className="rail" aria-label="Main">
      <Image
        className="rail-logo"
        alt="SocialWorks"
        src="/assets/auth/logo.svg"
        width={40}
        height={28}
      />
      <div className="rail-nav">
        {!allDone ? (
          <nav
            className="rsi"
            aria-label="Setup steps"
            style={{ "--p": cur / (TASKS.length - 1) } as React.CSSProperties}
          >
            {TASKS.map((t, i) => {
              const dn = done[t.id];
              const c = i === cur;
              const lk = !dn && !c;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`rbtn ${dn ? "done" : c ? "active" : "todo locked"}`}
                  style={{ "--i": i } as React.CSSProperties}
                  aria-label={`Step ${i + 1}: ${t.short}, ${
                    dn ? "done" : c ? "in progress. Watch how" : "locked"
                  }`}
                  aria-current={c ? "step" : undefined}
                  onClick={() => onStep(t.id)}
                >
                  {dn ? (
                    <V2Icon name="checkThin" />
                  ) : lk ? (
                    <span className="si">
                      <V2Icon name="lock" />
                    </span>
                  ) : (
                    <>
                      <span className="si">
                        <V2Icon name={t.icon} />
                      </span>
                      <span className="sp">
                        <V2Icon name="play" />
                      </span>
                    </>
                  )}
                  <span className="tip">
                    {i + 1}. {t.short}{" "}
                    <span>
                      · {dn ? "done" : lk ? "Locked" : "Watch instructions"}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        ) : (
          MODULES.concat([["Onboarding", "clipboard"]]).map(([n, ic]) => {
            const ob = n === "Onboarding";
            const act = isAct(n);
            return (
              <button
                key={n}
                className={`rbtn${ob ? " ob" : ""}${act ? " active" : ""}`}
                aria-label={`${n}${ob ? ", complete" : ""}`}
                aria-current={act ? "page" : undefined}
                onClick={() =>
                  onNav(ob ? "onboarding" : n === "Home" ? "dashboard" : n.toLowerCase())
                }
              >
                <V2Icon name={ob ? "checkThin" : ic} />
                <span className="tip">
                  {n}
                  {ob ? " · complete" : ""}
                </span>
              </button>
            );
          })
        )}
      </div>
      <div className="rail-bottom">
        <button
          className="rbtn"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-label="Notifications"
          onClick={onBell}
        >
          <V2Icon name="bell" />
          <i className="dot" hidden={unread === 0} />
          <span className="tip">Notifications</span>
        </button>
        <button
          type="button"
          className="rbtn"
          id="railOut"
          aria-label="Sign Out"
          onClick={async () => {
            try {
              await auth_apis.logout();
            } catch {
              // session may already be gone; local state still clears
            }
            dispatch(clearAuth());
            router.replace("/login");
          }}
        >
          <V2Icon name="logout" />
          <span className="tip">Sign Out</span>
        </button>
        <div className="avatar" title={userName}>
          {initials}
        </div>
      </div>
    </nav>
  );
}
