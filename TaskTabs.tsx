"use client";

import { useEffect, useRef, useState } from "react";
import { V2Icon } from "../icons";

export function V2TaskTabs({
  tab,
  todoCount,
  doneCount,
  sort,
  onTab,
  onSort,
}: {
  tab: "todo" | "done";
  todoCount: number;
  doneCount: number;
  sort: "priority" | "time";
  onTab: (tab: "todo" | "done") => void;
  onSort: (sort: "priority" | "time") => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const todoRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const indRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const active = tab === "done" ? doneRef.current : todoRef.current;
    const ind = indRef.current;
    if (active && ind) {
      ind.style.width = active.offsetWidth + "px";
      ind.style.transform = `translateX(${active.offsetLeft}px)`;
    }
  }, [tab]);

  return (
    <div className="tabwrap">
      <div className="tabs" role="tablist">
        <i className="tab-ind" ref={indRef} aria-hidden="true" />
        <button
          className="tab"
          role="tab"
          ref={todoRef}
          aria-selected={tab === "todo"}
          onClick={() => onTab("todo")}
        >
          Up next <span className="count num">{todoCount}</span>
        </button>
        <button
          className="tab"
          role="tab"
          ref={doneRef}
          aria-selected={tab === "done"}
          onClick={() => onTab("done")}
        >
          Completed <span className="count num">{doneCount}</span>
        </button>
        <div className="sort">
          <button
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
          >
            <span>{sort === "time" ? "Shortest first" : "Sorted by priority"}</span>
            <V2Icon name="chevD" size={16} />
          </button>
          <div className="menu" role="menu" hidden={!menuOpen}>
            <button
              role="menuitemradio"
              aria-checked={sort === "priority"}
              onClick={() => {
                onSort("priority");
                setMenuOpen(false);
              }}
            >
              By priority{" "}
              <span>{sort === "priority" && <V2Icon name="check" size={14} />}</span>
            </button>
            <button
              role="menuitemradio"
              aria-checked={sort === "time"}
              onClick={() => {
                onSort("time");
                setMenuOpen(false);
              }}
            >
              Shortest first{" "}
              <span>{sort === "time" && <V2Icon name="check" size={14} />}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
