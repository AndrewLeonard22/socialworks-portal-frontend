import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CASES = [
  {
    tag: "Pool Builder · Arizona",
    challenge: "Estimators overbooked with low-quality inquiries.",
    solution: "Installed qualification + booking system, refined ad creative.",
    stats: [["184", "Booked"], ["8.2×", "ROI"], ["+41%", "Close rate"]],
  },
  {
    tag: "Pergola Builder · Texas",
    challenge: "Quotes going cold; no follow-up sequence.",
    solution: "Automated nurture + weekly sales coaching.",
    stats: [["127", "Booked"], ["6.5×", "ROI"], ["+33%", "Close rate"]],
  },
  {
    tag: "Outdoor Kitchen · Florida",
    challenge: "Strong leads, weak consultations, lost deals.",
    solution: "Consultation playbook + price anchoring training.",
    stats: [["96", "Booked"], ["9.1×", "ROI"], ["+48%", "Close rate"]],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Their follow-up system finally fixed our biggest leak. We're closing quotes that would have ghosted us.",
    avatar: "avatar-danilo.jpg",
    name: "Jenna Ortiz",
    meta: "Ortiz Hardscape Co. · Hardscape Contractor",
  },
  {
    quote:
      "Sales coaching alone paid for the partnership. Our close rate jumped almost 40% in one quarter.",
    avatar: "avatar-mart.jpg",
    name: "Derrick Whitaker",
    meta: "Whitaker Outdoor Living · Outdoor Kitchen",
  },
];

export function LandingSocial() {
  return (
    <>
      {/* Case studies */}
      <section id="cases" className="bg-band">
        <div className="mx-auto max-w-container px-6 py-24 lg:px-[100px]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[900px]">
              <p className="font-sans text-2xl font-medium tracking-kicker text-brand">
                Case studies
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.15] text-heading md:text-6xl">
                Real growth for outdoor living contractors.
              </h2>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-4 rounded-btn bg-navy px-9 py-5 text-lg font-bold text-white"
            >
              View All <ArrowRight className="h-[14px] w-[18px]" />
            </a>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {CASES.map((item) => (
              <div
                key={item.tag}
                className="overflow-hidden rounded-xl border border-border-strong bg-white shadow-card-lg"
              >
                <div className="relative">
                  <Image
                    src="/assets/landing/case-study.jpg"
                    alt={item.tag}
                    width={520}
                    height={280}
                    className="h-[280px] w-full object-cover"
                  />
                  <span className="absolute left-8 top-8 rounded-badge bg-white/80 px-5 py-1.5 text-base font-bold text-ink">
                    {item.tag}
                  </span>
                </div>
                <div className="p-9">
                  <p className="text-lg font-bold uppercase tracking-wider">
                    Challenge
                  </p>
                  <p className="mt-1 text-lg tracking-wider text-ink">
                    {item.challenge}
                  </p>
                  <p className="mt-5 text-lg font-bold uppercase tracking-wider">
                    Solution
                  </p>
                  <p className="mt-1 text-lg tracking-wider text-ink">
                    {item.solution}
                  </p>
                  <div className="mt-8 flex justify-between border-t border-border pt-6 uppercase tracking-wider">
                    {item.stats.map(([value, label]) => (
                      <div key={label}>
                        <p
                          className={`text-[30px] font-bold ${
                            label === "Close rate"
                              ? "text-brand"
                              : "text-black"
                          }`}
                        >
                          {value}
                        </p>
                        <p className="text-sm text-faint">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="mt-7 inline-flex items-center gap-3 text-md font-bold text-ink"
                  >
                    View Case Study <ArrowRight className="h-[14px] w-[18px]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-container px-6 py-24 lg:px-[100px]">
        <p className="font-sans text-2xl font-medium tracking-kicker text-brand">
          Testimonials
        </p>
        <h2 className="mt-4 max-w-[1236px] font-display text-4xl font-bold leading-[1.15] text-heading md:text-6xl">
          What contractors say about working with SocialWorks Pro.
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <div className="rounded-panel border border-border-card bg-white p-10 shadow-card md:p-14">
              <Image
                src="/assets/landing/stars-lg.svg"
                alt="5 stars"
                width={260}
                height={52}
                className="h-[52px] w-auto"
              />
              <p className="mt-8 text-3xl font-medium leading-[1.6] text-ink md:text-[30px]">
                &ldquo;Our calendar went from gaps to back-to-back qualified
                consults in 90 days. The lead quality is unreal.&rdquo;
              </p>
              <div className="mt-10 flex items-center gap-6 border-t border-border pt-8">
                <Image
                  src="/assets/landing/avatar-itay.jpg"
                  alt="Mark Sullivan"
                  width={90}
                  height={90}
                  className="size-[90px] rounded-full object-cover"
                />
                <div>
                  <p className="font-display text-2xl font-bold text-ink">
                    Mark Sullivan
                  </p>
                  <p className="mt-1 text-lg text-muted">
                    Sullivan Pools &amp; Patio · Pool Builder
                  </p>
                </div>
              </div>
            </div>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-4 rounded-btn bg-navy px-9 py-5 text-lg font-bold text-white"
            >
              View All <ArrowRight className="h-[14px] w-[18px]" />
            </a>
          </div>
          <div className="flex flex-col gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-panel border border-border-card bg-white p-9 shadow-card"
              >
                <Image
                  src="/assets/landing/stars-lg.svg"
                  alt="5 stars"
                  width={140}
                  height={28}
                  className="h-7 w-auto"
                />
                <p className="mt-5 text-md font-medium leading-[1.6] text-ink">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-5 border-t border-border pt-6">
                  <Image
                    src={`/assets/landing/${t.avatar}`}
                    alt={t.name}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-display text-lg font-bold text-ink">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {t.meta}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
