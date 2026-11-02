import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const PAGE_LINKS = [
  ["Home", "#"],
  ["About", "#who"],
  ["Services", "#services"],
  ["Lead Generation", "#leadgen"],
  ["Sales Coaching", "#coaching"],
  ["Case Studies", "#cases"],
  ["Contact", "#contact"],
];

const SERVICE_LINKS = [
  ["Lead Generation", "#leadgen"],
  ["Lead Qualification", "#leadgen"],
  ["Follow-Up Automation", "#services"],
  ["Appointment Booking", "#process"],
  ["Coaching", "#coaching"],
  ["Reporting", "#process"],
  ["Optimization", "#process"],
];

export function LandingFooter() {
  return (
    <>
      {/* CTA */}
      <section id="demo" className="relative overflow-hidden">
        <Image
          src="/assets/landing/cta-bg.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto max-w-[1300px] px-6 py-28 text-center">
          <span className="inline-block rounded-panel border-2 border-pill-border bg-pill-bg px-12 py-4 text-lg font-bold uppercase text-white">
            Limited onboarding spots this quarter
          </span>
          <h2 className="mx-auto mt-10 font-display text-4xl font-bold capitalize leading-[1.1] tracking-tighter text-white md:text-[56px]">
            Ready to fill your calendar with qualified outdoor living
            appointments?
          </h2>
          <p className="mx-auto mt-8 max-w-[1057px] text-lg font-bold capitalize text-white">
            Book a demo and see how SocialWorks Pro can help your business
            attract, qualify, and convert better project opportunities.
          </p>
          <p className="mx-auto mt-4 max-w-[1057px] text-lg font-bold capitalize text-border-soft">
            No pressure. We&rsquo;ll review your current lead flow and show where
            opportunities are being missed.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 rounded-btn bg-brand px-9 py-5 text-lg font-bold text-white"
            >
              <Calendar className="size-5" />
              Book a Demo
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-btn border border-border-strong bg-white/30 px-9 py-5 text-lg font-medium text-white backdrop-blur-[5px]"
            >
              Contact Now <ArrowRight className="h-[14px] w-[18px]" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-navy">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.4fr] lg:px-[100px]">
          <div>
            <Logo variant="dark" className="h-[48px] w-auto" />
            <p className="mt-6 max-w-[390px] text-justify text-lg leading-[30px] text-white">
              The growth partner for outdoor living contractors. Lead
              generation, qualification, booking, and sales coaching, built
              around the way you sell.
            </p>
            <Image
              src="/assets/landing/social.svg"
              alt="Social links"
              width={140}
              height={21}
              className="mt-8 h-[21px] w-auto"
            />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white/90">
              Pages
            </p>
            <ul className="mt-7 space-y-5 text-lg text-white">
              {PAGE_LINKS.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-brand">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white/90">
              Services
            </p>
            <ul className="mt-7 space-y-5 text-lg text-white">
              {SERVICE_LINKS.map(([label, href]) => (
                <li key={label + href}>
                  <a href={href} className="hover:text-brand">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white/90">
              Contact
            </p>
            <ul className="mt-7 space-y-5 text-lg text-white">
              <li className="flex items-center gap-4">
                <Mail className="h-[15px] w-[22px]" />
                <a
                  href="mailto:andrew@socialworkspro.com"
                  className="hover:text-brand"
                >
                  andrew@socialworkspro.com
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="size-5" />
                <a href="tel:+18479176528" className="hover:text-brand">
                  + 1 847 917 6528
                </a>
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-3 rounded-btn bg-brand px-8 py-5 text-lg font-bold text-white"
            >
              <Calendar className="size-5" />
              Book a Demo
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-container px-6 lg:px-[100px]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 py-8">
            <p className="font-fine text-base font-light text-white">
              © 2026 SocialWorks Pro. All rights reserved.
            </p>
            <div className="flex gap-8 font-fine text-base font-light text-white">
              <a href="#" className="hover:text-brand">
                Privacy
              </a>
              <a href="#" className="hover:text-brand">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
