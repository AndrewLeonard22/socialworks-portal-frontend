import type { Metadata } from "next";
import {
  Urbanist,
  Montserrat,
  Poppins,
  Outfit,
  Plus_Jakarta_Sans,
  Inter,
  Manrope,
  Sora,
  Geist,
  Manjari,
} from "next/font/google";
import { Providers } from "@/components/Providers";
import { ThemeInit } from "@/app/ThemeInit";
import "./globals.css";

/* Proto loads Urbanist 200–600; keep the same axis so light weights match. */
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "600"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "600"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], weight: ["400", "500", "600"] });
const manjari = Manjari({ variable: "--font-manjari", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "SocialWorks Pro",
  description: "Client portal for social media marketing agencies",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${montserrat.variable} ${poppins.variable} ${outfit.variable} ${jakarta.variable} ${inter.variable} ${manrope.variable} ${sora.variable} ${geist.variable} ${manjari.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-white text-text-primary font-sans"
        suppressHydrationWarning
      >
        <ThemeInit />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
