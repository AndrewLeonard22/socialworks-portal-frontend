import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundContent } from "@/components/global/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found - SocialWorks Pro",
};

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[60] bg-swa-frame p-4">
      <div className="relative flex h-full flex-col overflow-auto rounded-[clamp(28px,3.6vh,44px)] bg-swa-shell px-6 py-10">
        <Link
          href="/"
          aria-label="SocialWorks home"
          className="absolute left-6 top-7 flex items-center gap-3 sm:left-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/auth/logo.svg" alt="" className="h-auto w-[52px]" />
          <b className="text-[18px] font-medium tracking-[-0.01em] text-swa-ink">
            SocialWorks
          </b>
        </Link>
        <div className="m-auto py-20">
          <NotFoundContent />
        </div>
      </div>
    </div>
  );
}
