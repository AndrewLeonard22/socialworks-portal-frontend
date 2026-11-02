"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearAuth } from "@/store/auth/reducer";
import {
  setOnboardingLoading,
  setOnboardingState,
} from "@/store/onboarding/reducer";
import { auth_apis } from "@/api/auth";
import { onboarding_apis } from "@/api/onboarding";
import { Icon } from "@/components/icons";
import type { IconName } from "@/components/icons";
import { navSections } from "@/components/layout/nav";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  doneMapFor,
  toV2Tasks,
} from "@/app/(private_route)/onboarding/components/v2/adapter";
import "@/components/swa/swa.css";

export function PrivateSidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const sections = navSections(user);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const hasClientContext = user?.role === "client" || user?.client_id != null;
  const obTasks = useAppSelector((state) => state.onboarding.tasks);
  const obLoading = useAppSelector((state) => state.onboarding.isLoading);

  useEffect(() => {
    if (!hasClientContext || !obLoading || obTasks.length) return;
    onboarding_apis
      .state()
      .then((state) => dispatch(setOnboardingState(state)))
      .catch(() => dispatch(setOnboardingLoading(false)));
  }, [hasClientContext, obLoading, obTasks.length, dispatch]);

  const v2tasks = useMemo(() => toV2Tasks(obTasks), [obTasks]);
  const doneMap = useMemo(() => doneMapFor(obTasks), [obTasks]);
  const current = v2tasks.findIndex((t) => !doneMap[t.id]);
  const showSteps = hasClientContext && v2tasks.length > 0 && current !== -1;
  const obAllResolved =
    hasClientContext && v2tasks.length > 0 && current === -1;

  const stepNonce = useRef(0);
  const handleStep = (key: string, isDone: boolean) => {
    stepNonce.current += 1;
    router.push(
      `/onboarding?focus=${key}&mode=${isDone ? "peek" : "open"}&r=${stepNonce.current}`
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await auth_apis.logout();
    } catch {
      // session may already be gone; local state still clears
    }
    dispatch(clearAuth());
    router.replace("/login");
  };

  return (
    <aside className="relative z-30 hidden w-16 shrink-0 self-stretch overflow-visible lg:block">
      {/* Absolute fill = guaranteed full height for proto space-between centering
          (step 1 tip lands on the progress row, not on “Hey…”). */}
      <div className="swa-rail absolute inset-0 overflow-visible">
        <Link
          href="/dashboard"
          className="swa-rail-logo"
          aria-label="SocialWorks home"
        >
          {user?.brand?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.brand.logo_url} alt={user.brand.name} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/assets/auth/logo.svg"
              alt="SocialWorks"
              className="swa-rail-logo-mark"
            />
          )}
        </Link>

        <nav className="swa-rail-nav" aria-label={showSteps ? "Setup steps" : "Main"}>
          {showSteps ? (
            <div className="swa-rsi">
              {v2tasks.map((task, i) => {
                const isDone = doneMap[task.id];
                const isCurrent = i === current;
                const isLocked = !isDone && !isCurrent;
                return (
                  <button
                    key={task.id}
                    type="button"
                    className={`swa-icbtn swa-icbtn-rail swa-rstep${
                      isDone ? " is-done" : isCurrent ? " is-active" : " is-locked"
                    }`}
                    style={{ "--i": i } as CSSProperties}
                    aria-label={`Step ${i + 1}: ${task.short}, ${
                      isDone ? "done" : isCurrent ? "in progress" : "locked"
                    }`}
                    aria-current={isCurrent ? "step" : undefined}
                    onClick={() => !isLocked && handleStep(task.id, isDone)}
                  >
                    {isDone ? (
                      <Icon name="checkThin" size={22} />
                    ) : isLocked ? (
                      <Icon name="lock" size={20} />
                    ) : (
                      <>
                        <span className="swa-rsi-si">
                          <Icon name={task.icon as IconName} size={21} />
                        </span>
                        <span className="swa-rsi-sp">
                          <Icon name="play" size={20} />
                        </span>
                      </>
                    )}
                    {/* Proto tip is label-only; play lives on the step button
                        (.swa-rsi-sp) when hovered / tour `.demo` — no trailing .tp chip. */}
                    <span className="swa-tip">
                      {i + 1}. {task.short}{" "}
                      <span>
                        ·{" "}
                        {isDone
                          ? "done"
                          : isLocked
                            ? "Locked"
                            : "Watch instructions"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            sections.map((section, i) => (
            <div key={i} className="swa-rail-nav">
              {section.items.map(({ label, href, icon, locked }) => {
                /* Once onboarding is done (all steps resolved or the client
                   phase flipped to active) the rail drops the item instead
                   of pinning a green check. */
                if (
                  href === "/onboarding" &&
                  (obAllResolved || user?.client_phase === "active")
                ) {
                  return null;
                }
                const isActive = href !== "#" && pathname.startsWith(href);
                const isLocked =
                  (locked === true && user?.client_phase !== "active") ||
                  href === "#";
                const tip = (
                  <span className="swa-tip">
                    {label}
                    {isLocked && locked ? (
                      <span> · Unlocks after kickoff</span>
                    ) : null}
                    {href === "#" ? <span> · Coming soon</span> : null}
                  </span>
                );
                const glyph = isLocked && locked ? "lock" : icon;
                const railClass = `swa-icbtn swa-icbtn-rail${
                  isActive ? " is-active" : ""
                }${isLocked ? " is-locked" : ""}`;
                if (isLocked) {
                  return (
                    <span
                      key={label}
                      className={`${railClass} swa-rail-item`}
                      aria-label={`${label} (locked)`}
                    >
                      <Icon name={glyph} size={21} />
                      {tip}
                    </span>
                  );
                }
                return (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    aria-current={isActive ? "page" : undefined}
                    className={railClass}
                  >
                    <Icon name={glyph} size={21} />
                    {tip}
                  </Link>
                );
              })}
            </div>
          ))
          )}
        </nav>

        <div className="swa-rail-bottom">
          <button
            type="button"
            aria-label="Log out"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="swa-icbtn swa-icbtn-rail swa-out"
          >
            <Icon name="logout" size={21} />
            <span className="swa-tip">Sign Out</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={isLogoutConfirmOpen}
        title="Log out?"
        body="You will need to sign in again to access the portal."
        confirmLabel="Log out"
        isLoading={isLoggingOut}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </aside>
  );
}
