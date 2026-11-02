"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "dark" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-sm hover:bg-brand/90 hover:shadow-md focus-visible:ring-brand/50",
  dark: "bg-btn-dark text-text-inverse hover:opacity-90 focus-visible:ring-btn-dark/40",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-heading focus-visible:ring-brand/40",
  danger:
    "bg-danger text-white shadow-sm hover:bg-danger-hover hover:shadow-md focus-visible:ring-danger/50",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "gap-1.5 px-3.5 py-1.5 text-sm",
  md: "gap-2 px-5 py-2.5 text-base",
  lg: "gap-2.5 px-6 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) {
    const reduceMotion = useReducedMotion();
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileHover={reduceMotion || isDisabled ? undefined : { y: -1 }}
        whileTap={reduceMotion || isDisabled ? undefined : { scale: 0.98 }}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={`inline-flex items-center justify-center rounded-btn font-medium outline-none transition-[color,background-color,border-color,box-shadow,opacity] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
