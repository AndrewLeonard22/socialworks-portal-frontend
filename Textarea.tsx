"use client";

import { forwardRef, TextareaHTMLAttributes, useId } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, hint, error, id, className = "", ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={hasError || undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={`min-h-28 rounded-btn border bg-surface px-4 py-2.5 text-base text-text-primary outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-text-tertiary focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60 ${
            hasError
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border-input hover:border-border-strong focus:border-brand focus:ring-brand/20"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p
            id={messageId}
            role="alert"
            className="text-sm text-danger-foreground"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="text-sm text-text-tertiary">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
