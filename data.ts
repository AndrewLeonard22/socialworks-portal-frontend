import type { V2Note, V2Task } from "./types";

export const TASKS: V2Task[] = [
  { id: "agreement", short: "Agreement", title: "Sign your agreement", desc: "DocuSign opens right here", time: 2, prio: 1, icon: "doc", cta: "Sign agreement" },
  { id: "access", short: "Access", title: "Give us access", desc: "Meta, Google, your calendar and website", time: 5, prio: 2, icon: "shield", cta: "Give access",
    parts: ["Facebook, Instagram & ad account", "Google Calendar", "Google Business Profile"],
    logos: [["meta", "Meta: Facebook, Instagram & ad account"], ["gcal", "Google Calendar"], ["gbp", "Google Business Profile"]] },
  { id: "business", short: "Business", title: "Tell us about your business", desc: "One short form, the same questions for everyone", time: 8, prio: 3, icon: "building", cta: "Start the form" },
  { id: "content", short: "Content", title: "Upload your content and logo", desc: "Job photos, videos and your logo", time: 5, prio: 4, icon: "image", cta: "Upload now" },
  { id: "meeting", short: "Launch call", title: "Book your launch call with TJ", desc: "30 minutes with TJ, then join your WhatsApp group", time: 2, prio: 5, icon: "calendar", cta: "Book call" },
];

export const MODULES: [string, string][] = [
  ["Home", "grid"], ["Leads", "user"], ["Assets", "image"], ["Reports", "chart"], ["Billing", "receipt"],
];

export const NOTES: V2Note[] = [
  { id: 1, type: "mention", icon: "user", title: "TJ mentioned you", sub: "Kickoff agenda is ready to review", t: "2m" },
  { id: 2, type: "system", icon: "sparkle", title: "Welcome to SocialWorks", sub: "Finish setup to unlock your portal", t: "1h" },
];

export const SOC: [string, string, string][] = [
  ["instagram", "Instagram", "instagram.com/yourbrand"],
  ["facebook", "Facebook", "facebook.com/yourbrand"],
  ["linkedin", "LinkedIn", "linkedin.com/company/yourbrand"],
  ["google", "Google Business", "g.page/yourbrand"],
];

export const UNLOCKS: [string, string][] = [
  ["Home", "oGrid"], ["Leads", "oUser"], ["Reports", "oChart"],
];

export const ACC = [
  { k: "meta", ic: "meta", t: "Meta", sub: "(Facebook, Instagram)", d: "Sign in and pick your page" },
  { k: "gbp", ic: "gbp", t: "Google Business Profile", sub: "", d: "Your listing on Search and Maps" },
  { k: "gcal", ic: "gcal", t: "Google Calendar", sub: "", d: "So we only book when you're free" },
  { k: "site", ic: "globe", t: "Website", sub: "", d: "Paste your site link", site: true },
];

export const EXT: Record<string, string> = {
  business: "https://tally.so/r/jeDgLQ",
  meeting: "https://link.socialworkspro.com/widget/bookings/launch-call-socialworks",
};

export const CHAPTERS: [string, string][] = [
  ["0:00", "Finish your setup tasks"],
  ["1:10", "Meet your strategist at kickoff"],
  ["2:15", "What happens in week one"],
];

export const CK_STEPS: [string, string][] = [
  ["Signing your agreement", "Agreement signed"],
  ["Reading your questionnaire", "Questionnaire received"],
  ["Getting website access", "Website access shared"],
  ["Connecting analytics", "Analytics connected"],
  ["Adding ads partner", "Ads partner added"],
  ["Booking your kickoff", "Kickoff booked"],
  ["Building your dashboard", "Dashboard ready"],
];

export const DP_PRESETS: [string, string, number][] = [
  ["7", "Last 7 days", 7],
  ["30", "Last 30 days", 30],
  ["90", "Last 3 months", 90],
];

export interface V2TourStep {
  sel: string;
  place: "right" | "left" | "top" | "bottom" | "auto";
  demo?: boolean;
  t: string;
  d: string;
}

export const TOUR: V2TourStep[] = [
  { sel: ".swa-rsi", place: "right", t: "Your setup, in 5 steps", d: "Your progress lives here. Steps open one at a time, done steps get a check." },
  { sel: ".swa-rstep.is-active", place: "right", demo: true, t: "Not sure how? Watch a video", d: "Hover your current step and press play to watch a short video guide on how to complete it." },
  { sel: "#v2-curCta", place: "bottom", t: "Start here", d: "This is your current step. It only takes a couple of minutes." },
  { sel: ".v2-root .cards", place: "auto", t: "What's coming next", d: "Your next steps, in order. Each one unlocks when you finish the one before it." },
  { sel: "#profileCard", place: "left", t: "Your brand assets", d: "Add your logo, job photos and videos here. They are shared across your whole business." },
  { sel: "#v2-tutorialBtn", place: "bottom", t: "See these tips again", d: "Click How to onboard anytime to replay this tour." },
];

export const ATYPES = [
  { k: "images", label: "Images", icon: "image", accept: "image/*" },
  { k: "video", label: "Video", icon: "video", accept: "video/*" },
  { k: "fonts", label: "Fonts", icon: "font", accept: ".ttf,.otf,.woff,.woff2" },
  { k: "colors", label: "Colors", icon: "palette" },
];

export const CROLES: [string, string, string][] = [
  ["primary", "Primary", "Main brand color"],
  ["secondary", "Secondary", "Supporting color"],
  ["accent", "Accent", "Buttons & highlights"],
];

export const DEF_COLORS: Record<string, string> = {
  primary: "#111111",
  secondary: "#3FA6E6",
  accent: "#B4D34A",
};

export const DEMO_CO = {
  name: "Acme Studio",
  site: "acmestudio.com",
  logo: null as string | null,
  social: {
    instagram: "instagram.com/acmestudio",
    facebook: "facebook.com/acmestudio",
    linkedin: "linkedin.com/company/acme-studio",
    google: "g.page/acmestudio",
  } as Record<string, string>,
};

export const CO_NETS: [string, string][] = [
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["linkedin", "LinkedIn"],
  ["google", "Google Business"],
];

export const TEAM_EMAIL = "team@socialworkspro.com";

/* fake provider flows for the task walkthrough modal */
/** Proto demo walkthrough steps; keyed by onboarding task key (+ legacy aliases). */
export const DEMO_STEPS: Record<
  string,
  { t: string; app: string; url: string; h: string; l: string; v: string; b: string }[]
> = {
  share_access: [
    { t: "Meta: add partner", app: "Meta Business Suite", url: "business.facebook.com/settings/partners", h: "Add a partner", l: "Partner Business ID", v: "1234 5678 9012", b: "Share access" },
    { t: "Share Google Calendar", app: "Google Calendar", url: "calendar.google.com/settings/sharing", h: "Share with people", l: "Email", v: TEAM_EMAIL, b: "Send" },
    { t: "Add Business Profile manager", app: "Google Business Profile", url: "business.google.com/managers", h: "Add manager", l: "Email", v: TEAM_EMAIL, b: "Invite" },
  ],
  book_kickoff: [
    { t: "Pick a day", app: "Google Calendar", url: "calendar.google.com/appointments", h: "Launch call · 30 min", l: "Day", v: "Thu, Oct 23", b: "Next" },
    { t: "Pick a time", app: "Google Calendar", url: "calendar.google.com/appointments", h: "Launch call · 30 min", l: "Time", v: "11:00 AM", b: "Book" },
    { t: "Send the invite", app: "Google Calendar", url: "calendar.google.com/appointments", h: "Add guests", l: "Guests", v: "you@company.example", b: "Confirm" },
  ],
  esign_agreement: [
    { t: "Review the agreement", app: "DocuSign", url: "app.docusign.com/sign", h: "Service agreement", l: "Full name", v: "Your name", b: "Sign" },
  ],
  questionnaire: [
    { t: "Answer the questions", app: "Tally", url: "tally.so/r/socialworks", h: "Tell us about your business", l: "Main service", v: "Kitchen and bath remodeling", b: "Submit" },
  ],
  upload_logo: [
    { t: "Upload job photos and logo", app: "SocialWorks", url: "portal.socialworkspro.com/assets", h: "Brand assets", l: "Files", v: "12 job photos · logo.png", b: "Upload" },
  ],
  /* legacy demo-kit ids */
  access: [
    { t: "Meta: add partner", app: "Meta Business Suite", url: "business.facebook.com/settings/partners", h: "Add a partner", l: "Partner Business ID", v: "1234 5678 9012", b: "Share access" },
    { t: "Share Google Calendar", app: "Google Calendar", url: "calendar.google.com/settings/sharing", h: "Share with people", l: "Email", v: TEAM_EMAIL, b: "Send" },
    { t: "Add Business Profile manager", app: "Google Business Profile", url: "business.google.com/managers", h: "Add manager", l: "Email", v: TEAM_EMAIL, b: "Invite" },
  ],
  meeting: [
    { t: "Pick a day", app: "Google Calendar", url: "calendar.google.com/appointments", h: "Launch call · 30 min", l: "Day", v: "Thu, Oct 23", b: "Next" },
    { t: "Pick a time", app: "Google Calendar", url: "calendar.google.com/appointments", h: "Launch call · 30 min", l: "Time", v: "11:00 AM", b: "Book" },
    { t: "Send the invite", app: "Google Calendar", url: "calendar.google.com/appointments", h: "Add guests", l: "Guests", v: "you@company.example", b: "Confirm" },
  ],
  agreement: [
    { t: "Review the agreement", app: "DocuSign", url: "app.docusign.com/sign", h: "Service agreement", l: "Full name", v: "Your name", b: "Sign" },
  ],
  business: [
    { t: "Answer the questions", app: "Tally", url: "tally.so/r/socialworks", h: "Tell us about your business", l: "Main service", v: "Kitchen and bath remodeling", b: "Submit" },
  ],
  content: [
    { t: "Upload job photos and logo", app: "SocialWorks", url: "portal.socialworkspro.com/assets", h: "Brand assets", l: "Files", v: "12 job photos · logo.png", b: "Upload" },
  ],
};

export const fmtD = (d: Date | null) =>
  d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

export const fmtSize = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`;

export const fmtNum = (n: number) => Math.round(n).toLocaleString("en-US");

export const nextDays = (count = 5) =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

export const NETS = [
  ["instagram", "Instagram", 1520, 5.6, 0.52, "Top source"],
  ["facebook", "Facebook", 640, 2.3, 0.25, "Below your average"],
  ["linkedin", "LinkedIn", 180, 3.9, 0.16, "Growing fast"],
  ["google", "Google Business", 0, 0, 0.07, "Underused"],
] as const;

export const TOP_POSTS = [
  ["Studio tour in 30 seconds", "instagram", "Reel", "Sep 12", 9.8, 0, "2.4x your average"],
  ["Meet the team behind the work", "instagram", "Reel", "Aug 28", 7.6, 1, "1.9x your average"],
  ["Before and after: Lakeside project", "facebook", "Photo", "Sep 3", 5.2, 2, "1.3x your average"],
  ["Autumn offer: 15% off", "facebook", "Graphic", "Oct 2", 0.6, 0, "Weakest post"],
] as const;

