"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Image from "next/image";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
            }
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInProps {
  onCredential: (credential: string) => void;
}

function GooglePill() {
  return (
    <>
      <Image
        src="/assets/portal/google.svg"
        alt=""
        width={22}
        height={22}
        className="size-[22px]"
      />
      Continue with Google
    </>
  );
}

const pillClass =
  "flex h-[60px] w-full items-center justify-center gap-3 rounded-full bg-white text-[17px] font-medium text-swa-ink shadow-[inset_0_0_0_1.5px_rgb(14_15_17/0.12)] transition-shadow";

export function GoogleSignIn({ onCredential }: GoogleSignInProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isScriptReady || !GOOGLE_CLIENT_ID || !buttonRef.current) {
      return;
    }
    window.google?.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => onCredential(response.credential),
    });
    buttonRef.current.replaceChildren();
    window.google?.accounts.id.renderButton(buttonRef.current, {
      theme: isDark ? "filled_black" : "outline",
      size: "large",
      width: buttonRef.current.offsetWidth || 384,
      text: "continue_with",
      shape: "rectangular",
    });
  }, [isScriptReady, isDark, onCredential]);

  // Mock build: no Google client id is configured - the button mints a
  // mock credential so the Google sign-in design flow works end to end.
  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        className={pillClass}
        onClick={() => onCredential("mock-google-id-token")}
      >
        <GooglePill />
      </button>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setIsScriptReady(true)}
      />
      <div className="group relative w-full">
        <div
          aria-hidden
          className={`${pillClass} group-hover:shadow-[inset_0_0_0_2px_var(--swa-ink)]`}
        >
          <GooglePill />
        </div>
        <div
          ref={buttonRef}
          className="absolute inset-0 overflow-hidden rounded-full opacity-[0.01] [&>div]:!h-full [&>div]:!w-full [&_iframe]:!h-full [&_iframe]:!w-full"
        />
      </div>
    </>
  );
}
