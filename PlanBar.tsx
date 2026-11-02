"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { useAppSelector } from "@/store";
import { billing_apis } from "@/api/billing";
import "@/components/swa/swa.css";

type PlanBarState =
  | { kind: "hidden" }
  | {
      kind: "fail";
      last4: string | null;
      brand: string | null;
    }
  | {
      kind: "ending";
      daysLeft: number;
      endLabel: string;
    };

function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const end = new Date(iso).getTime();
  if (Number.isNaN(end)) return null;
  return Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Proto `#planBar`: amber “plan ending” or red “payment failed” strip above the shell.
 * Client offer drives visibility; hidden when billing is healthy / unknown.
 */
export function PlanBar() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [state, setState] = useState<PlanBarState>({ kind: "hidden" });

  const isClient = user?.role === "client" || user?.client_id != null;

  const [prevIsClient, setPrevIsClient] = useState(isClient);
  if (prevIsClient !== isClient) {
    setPrevIsClient(isClient);
    if (!isClient) setState({ kind: "hidden" });
  }

  useEffect(() => {
    if (!isClient) return;
    let cancelled = false;
    billing_apis
      .offer()
      .then((offer) => {
        if (cancelled) return;
        const status = offer.subscription?.status ?? "";
        const fail = ["past_due", "unpaid", "incomplete"].includes(status);
        if (fail) {
          setState({
            kind: "fail",
            last4: offer.payment_method?.last4 ?? null,
            brand: offer.payment_method?.brand ?? null,
          });
          return;
        }
        /* proto: the strip shows while the plan (or ad budget) is inside
           its last 14 days, regardless of renewal status */
        const ends: (string | null | undefined)[] = [
          offer.subscription?.current_period_end,
          offer.ad_budget?.charged_at
            ? new Date(
                new Date(offer.ad_budget.charged_at).getTime() +
                  30 * 86400000
              ).toISOString()
            : null,
        ];
        for (const iso of ends) {
          const left = daysUntil(iso);
          if (left != null && left >= 0 && left <= 14) {
            setState({
              kind: "ending",
              daysLeft: left,
              endLabel: fmtDate(iso),
            });
            return;
          }
        }
        setState({ kind: "hidden" });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "hidden" });
      });
    return () => {
      cancelled = true;
    };
  }, [isClient, user?.client_id]);

  if (state.kind === "hidden") return null;

  if (state.kind === "fail") {
    const card =
      state.last4 != null
        ? `${(state.brand || "card").toUpperCase()} •••• ${state.last4}`
        : "your card on file";
    return (
      <div className="swa-plan-bar bad" role="status">
        <span className="swa-plan-bar-ic" aria-hidden>
          <TriangleAlert size={18} />
        </span>
        <div>
          <b>Payment failed</b>
          <small>
            We couldn’t charge{" "}
            {state.last4 ? (
              <>
                <i className="swa-plan-bar-visa">
                  {(state.brand || "CARD").slice(0, 4).toUpperCase()}
                </i>{" "}
                •••• {state.last4}
              </>
            ) : (
              card
            )}
            . Home, Leads and Reports are locked until it’s updated.
          </small>
        </div>
        <button
          type="button"
          className="swa-plan-bar-cta"
          onClick={() => router.push("/billing")}
        >
          Update Payment
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="swa-plan-bar" role="status">
      <span className="swa-plan-bar-ic" aria-hidden>
        <TriangleAlert size={18} />
      </span>
      <div>
        <b>
          Your plan ends in {state.daysLeft} day
          {state.daysLeft === 1 ? "" : "s"}
        </b>
        <small>
          {state.endLabel ? `On ${state.endLabel}. ` : ""}
          Message TJ to renew or change your plan
        </small>
      </div>
      <a
        className="swa-plan-bar-cta"
        href="https://book.socialworkspro.com/request"
        target="_blank"
        rel="noreferrer"
      >
        Message TJ
        <ArrowRight size={14} />
      </a>
    </div>
  );
}
