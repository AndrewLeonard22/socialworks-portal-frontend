import Image from "next/image";
import Link from "next/link";
import { Calendar, Play } from "lucide-react";

const CAL_ROWS = [
  { time: "9:30 AM", label: "Pool Consult - Hender...", badge: "Qualified", hot: false },
  { time: "11:00 AM", label: "Pergola estimate - Ortiz", badge: "Hot", hot: true },
  { time: "2:15 PM", label: "Paver patio - Whitake", badge: "Qualified", hot: false },
];

export function LandingHero() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-container grid-cols-1 items-center gap-14 px-6 pb-20 pt-14 lg:grid-cols-2 lg:px-[100px]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-brand" />
            <p className="text-lg font-bold tracking-label text-brand">
              Growth System for Outdoor Living Contractors
            </p>
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold capitalize leading-[1.2] tracking-tight text-ink md:text-6xl xl:text-7xl xl:leading-[84px]">
            Book more qualified outdoor living projects without chasing leads
          </h1>
          <p className="mt-8 max-w-[802px] text-justify text-lg leading-[36px] tracking-body text-muted">
            SocialWorks Pro helps outdoor living contractors generate, qualify,
            follow up with, and book high-intent appointments, so your calendar
            stays full and your sales team only talks to ready buyers.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 rounded-btn bg-brand px-9 py-4 font-card text-lg font-bold text-white"
            >
              <Calendar className="h-[18px] w-[17px]" />
              Book a Demo
            </Link>
            <a
              href="#process"
              className="inline-flex items-center gap-3 rounded-btn border border-border-strong bg-ghost-bg px-9 py-4 font-display text-lg font-bold text-ink backdrop-blur-[5px]"
            >
              <Play className="size-[22px]" />
              See How It Works
            </a>
          </div>
          <div className="mt-12 flex items-center gap-5">
            <div className="flex -space-x-4">
              {["sean", "mart", "danilo", "itay"].map((name) => (
                <Image
                  key={name}
                  src={`/assets/landing/avatar-${name}.jpg`}
                  alt=""
                  width={61}
                  height={61}
                  className="size-[61px] rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <Image
                src="/assets/landing/stars.svg"
                alt="5 stars"
                width={120}
                height={24}
                className="h-6 w-auto"
              />
              <p className="mt-1.5 text-lg font-bold text-black">
                Trusted by 70+ Outdoor Living Contractors
              </p>
            </div>
          </div>
          <p className="mt-10 text-lg capitalize leading-[1.7] text-muted">
            Built for patios · pools · pergolas · pavers · decks · hardscapes ·
            turf · outdoor kitchens
          </p>
        </div>

        <div className="relative">
          <Image
            src="/assets/landing/hero.jpg"
            alt="Outdoor living project"
            width={800}
            height={700}
            className="h-[560px] w-full rounded-image object-cover lg:h-[700px]"
            priority
          />
          {/* calendar card */}
          <div className="absolute -left-4 top-6 w-[340px] rounded-card border border-border-soft bg-white p-5 shadow-card sm:w-[380px] lg:-left-10 lg:top-10">
            <div className="flex items-center justify-between">
              <p className="font-card text-sm font-semibold text-subtle">
                TODAY - CALENDAR
              </p>
              <Calendar className="h-[18px] w-[17px] text-subtle" />
            </div>
            <div className="mt-5 space-y-2.5">
              {CAL_ROWS.map((row) => (
                <div
                  key={row.time}
                  className="flex items-center justify-between rounded-row border border-border-input bg-row px-5 py-3"
                >
                  <div>
                    <p className="font-card text-sm font-light text-subtle">
                      {row.time}
                    </p>
                    <p className="font-card text-base font-medium text-navtext">
                      {row.label}
                    </p>
                  </div>
                  <span
                    className={`rounded-badge px-4 py-1 font-card text-xs font-medium text-navtext ${
                      row.hot ? "bg-hot text-ink" : "bg-brand-soft"
                    }`}
                  >
                    {row.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* ROI card */}
          <div className="absolute -bottom-8 right-4 w-[300px] rounded-btn border border-border-soft bg-white p-5 shadow-card lg:right-6">
            <div className="flex items-center gap-2">
              <span className="h-[11px] w-[19px] rounded-sm bg-brand" />
              <p className="font-card text-sm tracking-card text-subtle">
                30 - DAY ROI
              </p>
            </div>
            <p className="mt-2 font-card text-[46px] font-bold tracking-[-3px] text-ink">
              7.4x
            </p>
            <div className="mt-3 h-2.5 w-full rounded-badge bg-border-soft">
              <div className="h-2.5 w-[79%] rounded-badge bg-brand" />
            </div>
            <p className="mt-3 font-card text-sm tracking-card text-subtle">
              42 booked appointments · $186k pipeline
            </p>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden">
        <Image
          src="/assets/landing/stats-bg.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto max-w-container px-6 py-24 text-center lg:px-[100px]">
          <p className="font-sans text-2xl font-medium tracking-widest text-white">
            By The Numbers
          </p>
          <h2 className="mx-auto mt-4 max-w-[1068px] font-display text-4xl font-bold leading-[1.2] text-white md:text-6xl">
            A growth system built for outdoor living contractors.
          </h2>
          <div className="mx-auto mt-16 grid max-w-[1200px] grid-cols-1 gap-10 sm:grid-cols-3 sm:divide-x sm:divide-white/30">
            {[
              ["70+", "Contractors Partnered With"],
              ["7x", "Average ROI"],
              ["3,000+", "Appointments Booked"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-7xl font-bold leading-none text-white">
                  {value}
                </p>
                <p className="mt-4 text-lg font-medium text-white/90">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
