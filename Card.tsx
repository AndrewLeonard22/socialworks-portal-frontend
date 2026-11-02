"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  interactive?: boolean;
}

export function Card({
  children,
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive && !reduceMotion ? { y: -2 } : undefined}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`rounded-card border border-border-card bg-surface p-8 shadow-card transition-[border-color,box-shadow] duration-200 ${
        interactive
          ? "cursor-pointer hover:border-border-strong hover:shadow-card-lg"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
