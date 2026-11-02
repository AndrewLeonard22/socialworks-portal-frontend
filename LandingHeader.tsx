"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, LayoutDashboard, Menu } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useAppSelector } from "@/store";
import { useMounted } from "@/lib/useMounted";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#who" },
  { label: "Services", href: "#services" },
  { label: "Lead Generation", href: "#leadgen" },
  { label: "Sales Coaching", href: "#coaching" },
  { label: "Case Studies", href: "#cases" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#contact" },
];

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mounted = useMounted();
  const { accessToken } = useAppSelector((state) => state.auth);
  const isLoggedIn = mounted && Boolean(accessToken);

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-[90px] max-w-container items-center justify-between px-6 lg:px-[100px]">
        <Link href="/" className="flex items-center">
          <Logo className="h-[62px] w-auto" priority />
        </Link>
        <nav className="hidden items-center gap-9 text-lg xl:flex">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={
                i === 0
                  ? "font-semibold text-brand"
                  : "text-navtext transition-colors hover:text-brand"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="hidden items-center gap-2.5 rounded-btn bg-brand px-7 py-4 font-sans text-lg font-bold text-white sm:inline-flex"
            >
              <LayoutDashboard className="h-[18px] w-[17px]" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-lg font-semibold text-navtext transition-colors hover:text-brand sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2.5 rounded-btn bg-brand px-7 py-4 font-sans text-lg font-bold text-white sm:inline-flex"
              >
                <Calendar className="h-[18px] w-[17px]" />
                Book a Demo
              </Link>
            </>
          )}
          <button
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border-input xl:hidden"
            aria-label="Menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Menu className="size-[22px] text-navtext" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="border-t border-border-soft bg-surface px-6 py-4 xl:hidden">
          <div className="flex flex-col gap-4 text-lg">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={i === 0 ? "font-semibold text-brand" : "text-navtext"}
              >
                {link.label}
              </a>
            ))}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="mt-2 inline-flex w-fit items-center gap-2.5 rounded-btn bg-brand px-6 py-3.5 font-bold text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-[18px] w-[17px]" /> Dashboard
              </Link>
            ) : (
              <Link
                href="/signup"
                className="mt-2 inline-flex w-fit items-center gap-2.5 rounded-btn bg-brand px-6 py-3.5 font-bold text-white"
              >
                <Calendar className="h-[18px] w-[17px]" /> Book a Demo
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
