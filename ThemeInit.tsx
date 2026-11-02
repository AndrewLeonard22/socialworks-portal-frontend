import Script from "next/script";

const THEME_INIT = `try{document.documentElement.classList.remove("dark");document.cookie="theme=light; path=/; max-age=31536000; samesite=lax"}catch(e){}`;

export function ThemeInit() {
  return (
    <Script id="theme-init" strategy="beforeInteractive">
      {THEME_INIT}
    </Script>
  );
}
