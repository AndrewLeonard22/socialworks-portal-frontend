"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useMounted } from "@/lib/useMounted";

interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Dialog({ open, title, onClose, children }: DialogProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  /* Portal outside .v2-root so proto `button { background:none }` does not
     wipe ui Button CTAs. Scrim and panel are siblings so backdrop-blur
     does not ghost a second card behind the dialog. */
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="ui-dialog"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
        >
          <div
            className="absolute inset-0 bg-app-navy/50 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={onClose}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="pointer-events-auto w-full max-w-lg rounded-xl border border-app-line bg-surface p-6 shadow-lg"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: 4 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-jakarta text-lg font-semibold text-app-ink">
                  {title}
                </h2>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="flex size-8 items-center justify-center rounded-lg text-text-secondary hover:bg-app-band-2 hover:text-text-heading"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-5">{children}</div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
