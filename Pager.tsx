"use client";

import { V2Icon } from "@/components/v2/icons";

export function Pager({
  cur,
  pages,
  total,
  from,
  to,
  onPage,
}: {
  cur: number;
  pages: number;
  total: number;
  from: number;
  to: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="ld-pg">
      <span>{total ? `${from}-${to} of ${total}` : "0 results"}</span>
      {pages > 1 && (
        <div className="ld-pgb">
          <button
            type="button"
            aria-label="Previous page"
            disabled={cur === 1}
            onClick={() => onPage(cur - 1)}
          >
            <V2Icon name="chevD" />
          </button>
          {Array.from({ length: pages }, (_, k) => (
            <button
              type="button"
              key={k}
              className={k + 1 === cur ? "on" : ""}
              aria-current={k + 1 === cur ? "page" : undefined}
              onClick={() => onPage(k + 1)}
            >
              {k + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={cur === pages}
            onClick={() => onPage(cur + 1)}
          >
            <V2Icon name="chevD" />
          </button>
        </div>
      )}
    </div>
  );
}
