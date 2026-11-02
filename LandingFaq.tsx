"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

const FAQS = [
  {
    q: "What type of contractors do you work with?",
    a: "Outdoor living contractors: patios, pools, pergolas, pavers, decks, hardscapes, turf, outdoor kitchens, and landscape design-build firms.",
  },
  {
    q: "How do you qualify leads?",
    a: "Every inquiry is screened against your ideal customer profile, service area, budget range, and project timeline before it reaches your calendar.",
  },
  {
    q: "Do you book appointments directly?",
    a: "Yes. Qualified prospects are booked straight into your calendar, so your sales team only talks to homeowners who are ready to buy.",
  },
  {
    q: "How soon can results start?",
    a: "Most contractors see qualified inquiries within the first few weeks of launch, with booked appointments following as campaigns ramp up.",
  },
  {
    q: "Do you work in my area?",
    a: "Campaigns are built around your service area, so every lead comes from homeowners you can actually serve.",
  },
  {
    q: "What makes this different from traditional marketing agencies?",
    a: "We don't stop at generating clicks. The system covers qualification, follow-up, booking, and sales coaching end to end, so leads turn into revenue.",
  },
  {
    q: "Do you help with follow-up and sales coaching?",
    a: "Yes. Automated follow-up keeps every quote alive, and our coaching works alongside your team to improve consultations and close rates.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto max-w-container px-6 py-24 lg:px-[100px]">
      <p className="font-sans text-xl font-medium text-brand">FAQs</p>
      <h2 className="mt-4 max-w-[1036px] font-display text-4xl font-bold leading-[1.05] tracking-tighter text-heading md:text-6xl">
        Questions outdoor contractors usually ask before getting started.
      </h2>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <p className="max-w-[800px] text-lg leading-[1.7] text-muted">
          Still curious? Book a 20-minute call and we&rsquo;ll walk through your
          specific situation.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-3 rounded-btn bg-brand px-9 py-5 text-lg font-bold text-white"
        >
          <Calendar className="size-5" />
          Book a Demo
        </Link>
      </div>
      <div className="mt-12">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.q} className="border-b border-border">
              <button
                className="flex w-full items-center justify-between gap-6 py-8 text-left"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
              >
                <span className="font-display text-xl font-medium text-black md:text-[28px]">
                  {faq.q}
                </span>
                <span
                  className={`flex size-14 flex-none items-center justify-center rounded-full bg-navy-2 text-white transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <Plus className="size-5" strokeWidth={2.5} />
                </span>
              </button>
              {isOpen && (
                <p className="max-w-[1183px] pb-8 text-md leading-[1.7] text-muted">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
