"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  markAllRead,
  markRead,
  setItems,
} from "@/store/notifications/reducer";
import { notifications_apis } from "@/api/notifications";
import { Icon } from "@/components/icons";
import type { NotificationPreferences } from "@/types/notification";

type Filter = "all" | "unread";

/** Proto `#notif` / `.pop` shell; wired to live notification APIs. */
export function NotificationBell({ rail = false }: { rail?: boolean }) {
  const { items, unreadCount } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [placement, setPlacement] = useState({ up: rail, max: 320 });
  const rootRef = useRef<HTMLDivElement>(null);

  // Anchor to whichever side of the trigger has more viewport room and
  // fit the popover to it; `max` is applied as the pop's max-height.
  const computePlacement = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const margin = 12;
    const gap = rail ? 0 : 8;
    const above = rail ? rect.bottom : rect.top - gap;
    const below = rail
      ? window.innerHeight - rect.top
      : window.innerHeight - rect.bottom - gap;
    const up = above >= below;
    setPlacement({ up, max: Math.max(160, (up ? above : below) - margin) });
  };

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", computePlacement);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", computePlacement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    notifications_apis.list().then((data) => {
      dispatch(
        setItems({ items: data.results, unreadCount: data.unread_count })
      );
    });
    notifications_apis.getPrefs().then(setPrefs);
  }, [isOpen, dispatch]);

  const handleRead = (itemId: string, serverId?: number) => {
    if (serverId !== undefined) {
      notifications_apis.markRead(serverId);
    }
    dispatch(markRead(itemId));
  };

  const handleReadAll = () => {
    notifications_apis.markAllRead();
    dispatch(markAllRead());
  };

  const handleToggleEmail = () => {
    if (!prefs) return;
    const next = !prefs.email_enabled;
    setPrefs({ ...prefs, email_enabled: next });
    notifications_apis.updatePrefs({ email_enabled: next });
  };

  const hasQuietHours = Boolean(prefs?.quiet_start && prefs?.quiet_end);
  const list =
    filter === "unread" ? items.filter((item) => !item.read) : items;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => {
          if (!isOpen) computePlacement();
          setIsOpen((open) => !open);
        }}
        className={
          rail
            ? "swa-icbtn swa-icbtn-rail"
            : "relative rounded-full p-2 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-heading"
        }
      >
        {rail ? <Icon name="bell" size={18} /> : <Bell className="size-5" />}
        {unreadCount > 0 &&
          (rail ? (
            <span className="swa-dot" aria-hidden="true" />
          ) : (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ))}
        {rail && (
          <span className="swa-tip">
            Notifications
            {unreadCount > 0 ? <span> · {unreadCount} unread</span> : null}
          </span>
        )}
      </button>

      {isOpen ? (
        <div
          className={`v2-root v2-float absolute z-[100] ${
            rail
              ? `left-full ml-3.5 ${placement.up ? "bottom-0" : "top-0"}`
              : `right-0 ${placement.up ? "bottom-full mb-2" : "top-full mt-2"}`
          }`}
        >
          <div
            className="pop on"
            role="dialog"
            aria-label="Notifications"
            style={{
              position: "relative",
              width: "min(440px, calc(100vw - 32px))",
              maxHeight: placement.max,
            }}
          >
            <div className="ntabs" role="tablist">
              <button
                type="button"
                className="ntab"
                role="tab"
                aria-selected={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className="ntab"
                role="tab"
                aria-selected={filter === "unread"}
                onClick={() => setFilter("unread")}
              >
                Unread
              </button>
            </div>
            <div className="nlist">
              {list.length === 0 ? (
                <p className="note" style={{ padding: "24px 0", margin: 0 }}>
                  {filter === "unread"
                    ? "You’re all caught up."
                    : "No notifications yet."}
                </p>
              ) : (
                list.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`nitem${item.read ? "" : " unread"}`}
                    onClick={() => {
                      if (!item.read) handleRead(item.id, item.serverId);
                    }}
                  >
                    <span className="ic">
                      <Icon name="bell" size={18} />
                    </span>
                    <span className="tx">
                      <b>
                        {item.title}
                        {item.count > 1 ? ` ×${item.count}` : ""}
                      </b>
                      {item.body ? <span>{item.body}</span> : null}
                    </span>
                    <span className="m">
                      {!item.read ? <i /> : null}
                    </span>
                  </button>
                ))
              )}
            </div>
            {prefs ? (
              <div
                className="nfoot"
                style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.email_enabled}
                  onClick={handleToggleEmail}
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    fontWeight: 400,
                    color: "var(--ink-2)",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Mail size={14} />
                    Email me important notifications
                  </span>
                  <span
                    className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
                      prefs.email_enabled ? "bg-[var(--ink)]" : "bg-[#D5D7DB]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${
                        prefs.email_enabled ? "left-3.5" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>
                <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>
                  {hasQuietHours
                    ? `Quiet hours ${prefs.quiet_start} to ${prefs.quiet_end} (${prefs.timezone}) pause email.`
                    : "Set quiet hours to pause email during off hours."}
                </p>
              </div>
            ) : null}
            <div className="nfoot">
              <button type="button" onClick={handleReadAll}>
                Mark all as read
              </button>
              <button type="button" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
