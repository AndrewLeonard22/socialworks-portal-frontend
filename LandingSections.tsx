import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  Check,
  Clock,
  Filter,
  HelpCircle,
  Mail,
  MessageSquare,
  PhoneOff,
  TrendingDown,
  UserCheck,
  Zap,
  Magnet,
} from "lucide-react";

const PARTNER_LOGOS = [
  { src: "logo-buddha.png", alt: "Buddha Builders", h: "max-h-[68px]" },
  { src: "logo-backyard.png", alt: "Backyard Paradiso", h: "max-h-[62px]" },
  { src: "logo-turf.png", alt: "Artificial Turf Factory Outlet", h: "max-h-[67px]" },
  { src: "logo-trueclean.png", alt: "Trueclean", h: "max-h-[84px]" },
  { src: "logo-summerhouse.png", alt: "Summerhouse Outdoor Structures", h: "max-h-[40px]" },
];

const PROBLEMS = [
  { icon: Clock, title: "Slow response times", body: "Leads grow cold within the first hour." },
  { icon: Filter, title: "Low-quality inquiries", body: "Tire-kickers, wrong service area, no budget." },
  { icon: Mail, title: "Inconsistent follow-up", body: "Quotes sit unread; nothing nudges the buyer." },
  { icon: PhoneOff, title: "Missed calls", body: "Crews can't answer in the field, opportunities vanish." },
  { icon: TrendingDown, title: "Low close rates", body: "Strong leads, weak consultations, lost deals." },
  { icon: HelpCircle, title: "Wasted estimates", body: "Estimators waste hours on jobs that never close." },
];

const SOLUTION_STEPS = [
  { icon: Magnet, title: "Generate qualified inquiries", body: "Attract high-intent prospects who are genuinely interested in your products or services." },
  { icon: UserCheck, title: "Qualify every lead", body: "Evaluate each lead to ensure they match your ideal customer profile and buying potential." },
  { icon: Zap, title: "Follow up quickly", body: "Respond promptly to inquiries to increase engagement and conversion opportunities." },
  { icon: CalendarCheck2, title: "Book appointments directly", body: "Schedule meetings efficiently with qualified prospects without unnecessary delays." },
  { icon: MessageSquare, title: "Improve sales conversations", body: "Use effective communication strategies to build trust and move prospects through the sales process." },
  { icon: BarChart3, title: "Track and optimize results", body: "Monitor performance metrics and continuously refine strategies for better outcomes." },
];

const SERVICES = [
  {
    img: "service-1.jpg",
    title: "Lead Generation",
    body: "Campaigns and funnels built for outdoor living buyers",
    href: "#leadgen",
  },
  {
    img: "service-2.jpg",
    title: "Lead Qualification",
    body: "We filter inquiries before they waste your time.",
    href: "#leadgen",
  },
  {
    img: "service-3.jpg",
    title: "Follow-Up Automation",
    body: "Support to improve consultations and close rates.",
    href: "#coaching",
  },
];

const LEADGEN_POINTS = [
  "Targeted ad campaigns",
  "Service-area targeting",
  "Landing pages",
  "Funnel optimization",
  "Lead tracking",
  "Qualified inquiries",
];

const COACHING_POINTS = [
  "Call scripts",
  "Consultation structure",
  "Objection handling",
  "Follow-up systems",
  "Quote follow-up",
  "Close-rate improvement",
];

const PROCESS_TOP = ["", "Capture Inquiries", "", "Follow Up Fast", "", "Coach the sales process", ""];
const PROCESS_BOTTOM = ["Attract Homeowners", "", "Qualify Leads", "", "Book Appointments", "", "Optimize Results"];
const PROCESS_ALL = [
  "Capture Inquiries",
  "Attract Homeowners",
  "Qualify Leads",
  "Follow Up Fast",
  "Book Appointments",
  "Coach the sales process",
  "Optimize Results",
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-sans text-2xl font-medium tracking-kicker text-brand">
      {children}
    </p>
  );
}

function CheckItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-[27px] items-center justify-center rounded-full bg-brand">
        <Check className="size-4 text-white" strokeWidth={3} />
      </span>
      <span className="text-md font-medium tracking-wide text-ink">
        {label}
      </span>
    </div>
  );
}

export function LandingSections() {
  return (
    <>
      {/* Who we help */}
      <section id="who" className="mx-auto max-w-container px-6 py-24 text-center lg:px-[100px]">
        <SectionLabel>Who we help</SectionLabel>
        <h2 className="mx-auto mt-4 max-w-[1318px] font-display text-4xl font-bold leading-[1.2] text-heading md:text-6xl">
          Trusted by outdoor living businesses that build high-value projects.
        </h2>
        <p className="mx-auto mt-6 max-w-[900px] text-lg leading-[1.7] text-muted">
          From patios and pools to pergolas and outdoor kitchens, our system is
          designed around the way outdoor contractors actually sell.
        </p>
        <div className="relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent" />
          <div className="flex w-max animate-marquee gap-7">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="flex h-[130px] w-[321px] flex-none items-center justify-center rounded-logo bg-white p-6"
              >
                <Image
                  src={`/assets/landing/${logo.src}`}
                  alt={logo.alt}
                  width={321}
                  height={130}
                  className={`${logo.h} w-auto object-contain`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The real problem */}
      <section className="bg-band">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-14 px-6 py-24 lg:grid-cols-[1fr_1.35fr] lg:px-[100px]">
          <div>
            <SectionLabel>The real problem</SectionLabel>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.25] text-heading md:text-6xl">
              Most contractors don&rsquo;t have a lead problem. They have a
              follow-up and booking problem.
            </h2>
            <p className="mt-8 max-w-[675px] text-lg leading-[1.7] text-muted">
              Leads get missed, prospects go cold, and contractors lose
              profitable jobs because there&rsquo;s no consistent system after the
              inquiry comes in.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PROBLEMS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-panel border border-border-strong bg-white p-8 text-center"
              >
                <div className="mx-auto flex size-[78px] items-center justify-center rounded-full bg-brand/10">
                  <Icon className="size-[34px] text-brand" />
                </div>
                <h3 className="mt-6 font-display text-3xl font-bold text-heading">
                  {title}
                </h3>
                <p className="mt-3 text-md tracking-wide text-brand">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our solution */}
      <section className="mx-auto max-w-container px-6 py-24 text-center lg:px-[100px]">
        <SectionLabel>Our solution</SectionLabel>
        <h2 className="mx-auto mt-4 max-w-[1298px] font-display text-4xl font-bold leading-[1.2] text-heading md:text-6xl">
          We do more than generate leads. We turn them into booked appointments.
        </h2>
        <p className="mx-auto mt-6 max-w-[1172px] text-lg leading-[1.7] text-muted">
          Our process combines targeted campaigns, lead qualification, fast
          follow-up, direct appointment booking, and sales coaching.
        </p>
        <div className="mx-auto mt-16 grid max-w-[1600px] grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:divide-x lg:divide-border">
          {SOLUTION_STEPS.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className={`px-8 ${i >= 3 ? "border-t border-border pt-12 lg:border-t-0 lg:pt-0" : ""}`}
            >
              <div className="mx-auto flex size-[72px] items-center justify-center rounded-full bg-brand">
                <Icon className="size-8 text-white" />
              </div>
              <h3 className="mt-6 font-display text-3xl font-bold text-heading">
                {title}
              </h3>
              <p className="mt-3 text-lg leading-[1.7] text-muted">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core services */}
      <section id="services" className="bg-band">
        <div className="mx-auto max-w-container px-6 py-24 lg:px-[100px]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[900px]">
              <SectionLabel>Core services</SectionLabel>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.15] text-heading md:text-6xl">
                Everything your outdoor living business needs to fill the
                calendar.
              </h2>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 rounded-btn bg-navy px-9 py-5 text-lg font-bold text-white"
            >
              <CalendarCheck2 className="size-5" />
              Book a Demo
            </Link>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className={`group relative h-[439px] overflow-hidden rounded-image ${
                  i === 2 ? "md:col-span-2 xl:col-span-1" : ""
                }`}
              >
                <Image
                  src={`/assets/landing/${service.img}`}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-overlay-end mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-9">
                  <h3 className="font-display text-[30px] font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-md font-medium tracking-wide text-white">
                    {service.body}
                  </p>
                  <a
                    href={service.href}
                    className="mt-6 inline-flex items-center gap-3 rounded-btn border border-white bg-white/10 px-7 py-2 text-lg font-bold text-white backdrop-blur-[10px]"
                  >
                    Learn More <ArrowRight className="h-[14px] w-[18px]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead generation */}
      <section id="leadgen" className="mx-auto grid max-w-container grid-cols-1 items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-[100px]">
        <div>
          <SectionLabel>Lead generation</SectionLabel>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.15] text-heading md:text-6xl">
            Lead generation built for high-intent outdoor living projects.
          </h2>
          <p className="mt-8 max-w-[700px] text-lg leading-[1.7] text-muted">
            We don&rsquo;t chase clicks. We build campaigns engineered to attract
            homeowners ready to invest in patios, pools, pergolas, and outdoor
            kitchens.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
            {LEADGEN_POINTS.map((point) => (
              <CheckItem key={point} label={point} />
            ))}
          </div>
          <a
            href="#demo"
            className="mt-12 inline-flex items-center gap-4 rounded-btn bg-navy px-9 py-5 text-lg font-bold text-white"
          >
            Explore Lead Generation <ArrowRight className="h-[14px] w-[18px]" />
          </a>
        </div>
        <div className="relative mx-auto w-full max-w-[640px]">
          <Image
            src="/assets/landing/leadgen-1.png"
            alt="Outdoor living space at dusk"
            width={640}
            height={640}
            className="h-[560px] w-full rounded-image object-cover lg:h-[640px]"
          />
          <Image
            src="/assets/landing/leadgen-2.jpg"
            alt="Pool and patio"
            width={360}
            height={300}
            className="absolute -bottom-10 -right-4 hidden w-[300px] rounded-image border-[6px] border-white object-cover sm:block lg:-right-10 lg:w-[360px]"
          />
        </div>
      </section>

      {/* Sales coaching */}
      <section id="coaching" className="bg-band">
        <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-[100px]">
          <div className="relative order-2 mx-auto w-full max-w-[640px] lg:order-1">
            <Image
              src="/assets/landing/coaching-1.jpg"
              alt="Sales team coaching session"
              width={640}
              height={559}
              className="h-[480px] w-full rounded-image object-cover lg:h-[559px]"
            />
            <Image
              src="/assets/landing/coaching-2.jpg"
              alt="Reviewing sales metrics"
              width={360}
              height={300}
              className="absolute -bottom-10 -left-4 hidden w-[300px] rounded-image border-[6px] border-band object-cover sm:block lg:-left-10 lg:w-[360px]"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionLabel>Sales coaching</SectionLabel>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tighter text-heading md:text-6xl">
              Better leads are only valuable when your team knows how to close
              them.
            </h2>
            <p className="mt-8 max-w-[700px] text-lg leading-[1.7] tracking-wider text-ink">
              We sit alongside your sales team, sharpen the consultation, and
              install a follow-up system that protects every quote you put out.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
              {COACHING_POINTS.map((point) => (
                <CheckItem key={point} label={point} />
              ))}
            </div>
            <a
              href="#demo"
              className="mt-12 inline-flex items-center gap-4 rounded-btn bg-navy px-9 py-5 text-lg font-bold text-white"
            >
              Learn About Sales Coaching <ArrowRight className="h-[14px] w-[18px]" />
            </a>
          </div>
        </div>
      </section>

      {/* The process */}
      <section id="process" className="mx-auto max-w-container px-6 py-24 text-center lg:px-[100px]">
        <SectionLabel>The process</SectionLabel>
        <h2 className="mx-auto mt-4 max-w-[1094px] font-display text-4xl font-bold leading-[1.2] text-heading md:text-5xl">
          A simple growth process, from lead to booked appointment.
        </h2>
        <div className="mt-16 hidden lg:block">
          <div className="mx-auto grid max-w-[1604px] grid-cols-7 px-2">
            {PROCESS_TOP.map((label, i) =>
              label ? (
                <p key={i} className="text-lg font-semibold text-ink">
                  {label}
                </p>
              ) : (
                <div key={i} />
              )
            )}
          </div>
          <Image
            src="/assets/landing/process.svg"
            alt=""
            width={1604}
            height={120}
            className="mx-auto mt-4 w-full max-w-[1604px]"
          />
          <div className="mx-auto grid max-w-[1604px] grid-cols-7 px-2">
            {PROCESS_BOTTOM.map((label, i) =>
              label ? (
                <p key={i} className="text-lg font-semibold text-ink">
                  {label}
                </p>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </div>
        <ol className="mx-auto mt-10 max-w-[560px] space-y-4 text-left lg:hidden">
          {PROCESS_ALL.map((label, i) => (
            <li
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-border p-5"
            >
              <span className="flex size-10 flex-none items-center justify-center rounded-full bg-brand font-display font-bold text-white">
                {i + 1}
              </span>
              <span className="text-md font-semibold">{label}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
