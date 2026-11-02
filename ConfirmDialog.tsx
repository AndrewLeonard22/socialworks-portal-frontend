"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useMounted } from "@/lib/useMounted";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
      if (
        event.key === "Enter" &&
        !danger &&
        !isLoading &&
        !(event.target instanceof HTMLElement && event.target.closest("button"))
      ) {
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTarget = danger ? cancelRef.current : confirmRef.current;
    focusTarget?.focus();
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, danger, isLoading, onCancel, onConfirm]);

  if (!mounted) return null;

  /* Scrim and panel are siblings so backdrop-blur on the scrim does not
     paint a soft second copy of the card. */
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="confirm-dialog"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
        >
          <div
            className="absolute inset-0 bg-app-navy/50 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={onCancel}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
            <motion.div
              role={danger ? "alertdialog" : "dialog"}
              aria-modal="true"
              aria-label={title}
              className="pointer-events-auto w-full max-w-sm rounded-xl border border-app-line bg-surface p-6 shadow-lg"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: 4 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                    danger ? "bg-danger-soft" : "bg-brand/10"
                  }`}
                >
                  {danger ? (
                    <AlertTriangle className="size-5 text-danger-foreground" />
                  ) : (
                    <Info className="size-5 text-brand" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-jakarta text-lg font-semibold text-app-ink">
                    {title}
                  </h2>
                  {body ? (
                    <p className="font-inter text-sm text-app-muted">{body}</p>
                  ) : null}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  ref={cancelRef}
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
                <Button
                  ref={confirmRef}
                  type="button"
                  variant={danger ? "danger" : "primary"}
                  isLoading={isLoading}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
