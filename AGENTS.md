# SocialWorks Pro Frontend - Agent Guide

Next.js 16 (App Router) + React 19 + Tailwind v4 + Redux Toolkit. The root
`../AGENTS.md` holds the shared conventions; this file is the
frontend-specific contract.

## Layout

```
src/
├── api/                          # all HTTP calls live here
│   ├── index.tsx                 # axios instance + interceptors + `api` wrapper
│   ├── auth.tsx                  # auth_apis (endpoints + payload types)
│   └── feature_name.tsx          # template: copy as <feature>.tsx
│
├── store/                        # Redux Toolkit
│   ├── index.tsx                 # store + StoreProvider + typed hooks
│   ├── auth/reducer.tsx          # credentials, hydration, clearAuth
│   └── notifications/reducer.tsx # toast queue + notification items
│
├── components/
│   ├── landing/                  # marketing site (LandingHeader, LandingHero,
│   │                             #   LandingSections, LandingSocial, LandingFaq,
│   │                             #   LandingFooter) - rendered by app/page.tsx
│   ├── global/                   # app-wide utilities
│   │   ├── AuthGuard.tsx         # auth + needs_onboarding gate
│   │   ├── NotificationsBridge.tsx  # ONLY file allowed to import sonner
│   │   ├── NotificationsSocket.tsx  # global ws, mounted in private layout
│   │   └── Providers.tsx         # StoreProvider + bridge mount
│   └── layout/                   # UI primitives (PascalCase.tsx files)
│       ├── Button.tsx Input.tsx Card.tsx
│       ├── PrivateHeader.tsx     # PAGE_META owns page titles
│       ├── NotificationBell.tsx
│       └── ThemeToggle.tsx
│
├── lib/                          # non-react helpers (useMounted, etc.)
├── types/                        # shared TS types (api.ts, auth.ts)
├── config/                       # env/config constants
└── app/                          # App Router
    ├── (public_route)/           # login, signup, forgot/reset-password
    └── (private_route)/          # guarded: dashboard, onboarding
```

## Hard rules

- **One axios instance**: `src/api/index.tsx` only. Endpoint URLs in
  `src/api/<feature>.tsx` exported as a `<feature>_apis` object (copy
  `feature_name.tsx`). Raw axios/fetch of the API anywhere else is a bug.
  `baseURL` is `NEXT_PUBLIC_API_URL + /api/v1` - endpoint paths are short
  (`/auth/login/` style).
- **Request options**: `{ public: true }` skips auth-session handling
  (login/signup/refresh); `{ silentError: true }` suppresses the error toast
  (cold loads, polling like `me()`); `{ showSuccess: true }` toasts
  `data.message` on mutations; `{ noDebounce }`/`{ noDedupe }` opt out of
  the 300ms POST debounce / in-flight GET dedupe.
- **Error toasts are automatic**: the interceptor dispatches `showError`
  into the notifications slice on every failure. Never dispatch an error
  toast in a `catch` for an API call (double toast). Pages dispatch
  `showSuccess` after success and `showError` only for client-side
  validation (not an API error).
- **Sonner has one entry point**: `NotificationsBridge.tsx`. Nothing else
  imports sonner. The Redux notifications slice is the only way to toast.
- **State**: read via `useAppSelector((s) => s.<feature>)`, actions are
  pre-bound exports from `store/<feature>/reducer.tsx`. Auth persists in
  localStorage via the reducer; the access token is a Bearer header, the
  refresh token is an httpOnly cookie (never touch it in JS).
- **Naming**: component files `PascalCase.tsx`, camelCase everything else,
  types/interfaces PascalCase, route folders kebab-case, route groups in
  parentheses.
- **Primitives**: use `components/ui/` (Button, Input, Card, Textarea,
  ConfirmDialog). Don't reinvent; missing primitive -> create it there first.
- **Confirm before harm**: every destructive, dangerous, or irreversible
  action (deletes, disconnects, revocations, deactivations, clearing
  assignments, logout) MUST gate on `components/ui/ConfirmDialog` first, with
  `danger` for destructive actions. Never fire a mutating call straight from
  a click that destroys or severs state.
- **Page titles**: `PAGE_META` in `PrivateHeader.tsx`, never an inline
  page-level h1. Detail pages may keep entity headers.
- **Route protection**: private pages sit under `(private_route)/`; the
  layout's `AuthGuard` handles redirect to `/login` and the
  `needs_onboarding` gate. Never `window.location` for internal redirects.
- **SSR hydration**: components rendering auth-derived markup must gate on
  the `useMounted()` lifecycle flag (`lib/useMounted.ts`), not store state.
  `cookies()`/`localStorage` never run during render of a server component.
- **Next 16**: `params`/`searchParams` are Promises - await them.
  `"use client"` only where a Server Component genuinely can't work.
- **Icons/animation**: `lucide-react` and `framer-motion` only - no other
  icon lib, no raw CSS keyframes (`animate-marquee` is the authored token
  exception for the logo strip). EXCEPTION when porting proto screens:
  the prototype's own inline SVG glyphs (the `I`/`B` icon maps in app.js,
  e.g. the filled chart/doc/mail/check paths) and its `@keyframes` are part
  of the design - copy them verbatim; a lucide approximation is a visual bug.
- **Proto cloning**: when porting markup from `SocialWorks-App/index.html`
  (or strings generated in `app.js`), copy the markup VERBATIM - same tag,
  same class names, same `style="grid-area:t5"`-style inline styles, same
  `data-*` attributes. Do not translate them into Tailwind utilities: the
  ported stylesheets (`v2.css`, `v2proto.css`, `swa*.css`) already carry
  every rule under `.v2-root`, so the real class names are the API. Inline
  styles in the proto are part of the design spec (grid areas, CSS-var
  positions like `--y`/`--s`/`--o`, gradient stops) - keep them inline in
  the React port too. Only port the behavior (state, events) to React;
  never re-author proto structure with utilities or prefixed classes.
- **No new wrappers in proto ports**: flex/grid `gap` spaces only DIRECT
  children. Adding a wrapper the proto does not have (a `<form>` around
  siblings, a component root element) demotes those siblings out of the
  gapped context and silently collapses their spacing. This already bit
  once: `verifyBtn` is `type="button"` in the proto (JS click handler), the
  port wrapped it in `<form>` and lost `.auth-step`'s gap, which is why the
  OTP-to-button spacing mismatched. If behavior genuinely needs a wrapper,
  give the wrapper the parent's `display` + `gap` in the CSS layer, or wire
  the submit in JS like the proto does. Before shipping a ported screen,
  diff the DOM tree level-by-level against the proto: same parent-child
  structure, same sibling order, same `hidden`/`display:none` candidates.
  Matching class names is not enough; the element hierarchy is the spec.
- **Copy text verbatim**: button labels, headings, helper text,
  punctuation and capitalization are part of the spec. Never paraphrase or
  "fix" them. Before writing a string, grep `app.js` for the element's id:
  the proto rewrites labels at runtime (`sendBtn` is "Send my code" in
  markup but app.js re-sets it to "Send code" after submit, `.cta`'s
  `text-transform:capitalize` then renders "Send Code"), so the text the
  user sees can differ from the markup. Port the string the proto actually
  renders, including `&apos;`/punctuation inside `.auth-lead`, `.af-help`,
  `.af-resend`, `.af-foot`.
- **Document-level selectors land on `.v2-root`**: the scoped build maps
  `body`, `html` and `:root` onto `.v2-root`, so proto document surfaces
  (`body{background:var(--frame)}` = black) paint the embedded page root,
  not the document. Inside `PrivateShell` the shell already paints
  `bg-swa-shell` and the layout paints `bg-swa-frame`, so keep the
  `.swa-shell .v2-root{background:transparent}` override in `v2proto.css`
  and check every scoped document-level rule before shipping a port.
- **Tokens**: two palettes in `globals.css` - the landing tokens
  (`brand/navy/ink/muted/heading/band/hot` + `font-display` Montserrat etc.)
  and the portal tokens (`accent`, `app-ink`, `app-navy` sidebar,
  `app-muted`, `app-faint`, `app-line*`, `app-band*`, `app-dash` + jakarta/
  inter/manrope/sora/geist/manjari). Marketing pages use landing tokens,
  private portal pages use `app-*` tokens. Light theme is the default;
  `.dark` overrides live beside each token.
- **Tokens are the source of truth** (for NEW frontend code; proto ports
  follow the verbatim rule above instead): for spacing, padding, radius,
  heights, colors, and type sizes, reach for the token first. Never
  approximate a token value with a Tailwind scale step (`p-4`, `mt-6`,
  `h-10`, `rounded-3xl` are guesses). If the proto HTML/CSS uses a CSS
  var, use the same var here: the `--swa-*` vars are the proto vars
  verbatim and `@theme` maps them to utilities (`p-swa-app-pad`,
  `px-swa-btn-px`, `rounded-swa-card`, `shadow-swa`, `text-swa`,
  `tracking-swa`, `bg-swa-shell`). For tokens not yet mapped, bind the
  var with arbitrary syntax: `h-[var(--swa-btn-h)]`,
  `pt-[var(--swa-shell-pt)]`. Only hand-write a literal when no token
  exists for that property.
- **Proto stylesheet**: `src/components/v2/swa.css` is a verbatim copy of
  `SocialWorks-App/styles.css`, imported RAW into `globals.css` in a
  `proto` cascade layer between `base` and `components` - proto classes
  (`.cta`, `.card`, `.rail`, `.otp`...) apply globally with no scoping
  wrapper, and Tailwind utilities still win where both set a property.
  `:root` vars and `body` resets apply document-wide; the layout owns the
  actual body surface via utility classes so `body{background:var(--frame)}`
  stays inert. To update the design, re-copy `styles.css` over `swa.css` -
  nothing else needs to run. `.v2-root` survives only as a typography
  marker (Urbanist + proto tracking, same rule as `.swa-proto-type`).
  App-authored additions and ordering patches live unlayered at the bottom
  of `globals.css` under "APP PATCHES + PROTO EXTENSIONS".
- **Shell**: private routes render inside `PrivateSidebar` (navy, role-driven
  nav) + `PrivateHeader` (`Portal / <page>` breadcrumb). Static assets live
  in `public/assets/landing` and `public/assets/portal`.
- **Roles**: `user.role` is `superadmin` | `agency_owner` | `agency_staff` |
  `client`. `/dashboard` picks Superadmin/Agency/Client components by role;
  `agency_owner` is the agency "admin". Client sidebar marks post-kickoff
  items locked.
- **Env**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL` in `.env.local`
  (never committed; `.env.example` documents keys).

## Realtime

`NotificationsSocket` mounts once in `(private_route)/layout.tsx` and
connects to `ws/notifications/?token=<access>` for the whole private app.
Incoming events dispatch `pushNotification` + a toast action - the bell
badge and popup update on every page with zero per-page wiring.
Backend events push via `utils/realtime.py::publish_to_org` (requires
`REDIS_URL` shared across processes; the in-memory layer is process-local).

## PR gate (run all, from `frontend/`)

```bash
npx tsc --noEmit
npx eslint src
npm run build
```

Reviewer checklist: single axios instance untouched, `<feature>_apis`
convention followed, no sonner import outside the bridge, no error toast
in API catches, PascalCase components, PAGE_META updated for new private
routes, primitives reused, tokens used instead of Tailwind-scale approximations
(`var(--swa-*)` / `@theme` utilities wherever the proto uses a CSS var),
hydration-safe (`useMounted` where store-derived
markup renders), no `localStorage` auth access outside the auth reducer +
`api/index.tsx`.

Commit messages explain why, not what. Agents never run git push.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
