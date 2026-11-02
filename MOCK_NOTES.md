# SocialWorks - Design-Only Mock Frontend

This is a copy of `socialworks/frontend` with the backend fully removed.
Same folder structure, same components, same design tokens, same routing.
Every screen works offline - click through anything.

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

No env vars, no backend, no database.

## What was changed vs the real app

- `src/api/index.tsx` - REWRITTEN. Was the axios layer; now it routes every
  endpoint to the fixture store in `src/api/mock/db.ts`. All
  `src/api/<feature>.tsx` modules are untouched (they just unwrap envelopes).
- `src/api/mock/db.ts` - NEW. All fake data lives here (user, clients,
  leads, campaigns, notifications, onboarding tasks, billing, admin).
  State persists to `localStorage` under key `sw_mock_db_v1`.
- `src/app/mock-sign/page.tsx` - NEW. Fake DocuSign document (fills the
  signing iframe + the "Open DocuSign" tab).
- `src/app/mock-connect/page.tsx` - NEW. Fake provider connect/booking
  landing page; marks providers connected and self-closes.
- `src/components/global/NotificationsSocket.tsx` - stubbed to a no-op
  (no websocket server exists).
- `src/components/auth/GoogleSignIn.tsx` - "Continue with Google" mints a
  mock credential when no Google client id is configured.
- `src/components/billing/PaymentElementCard.tsx` - renders a mock card
  form when no Stripe key exists; `isStripeConfigured()` returns true so
  the plan picker is never locked.
- `package.json` - renamed to `socialworks-mock`.

Everything else (pages, components, styles, tokens, store) is identical
to the real frontend.

## Mock behavior

- Login: any email + any 6-digit code signs you in and lands on
  `/dashboard`.
- Personas by email: an email containing `admin` signs in as superadmin,
  `agency` or `staff` as agency owner, anything else as the client
  (Maya Reed / Summerhouse Studio).
- Onboarding: tasks start pending; submit/sign/skip all work instantly
  and persist. Esign shows the mock document; "I've signed" completes it.
- Connect buttons (Meta/Google/GHL/DocuSign): the OAuth popup points at
  the app's own callback routes, so the full connect flow runs and the
  provider flips to connected.
- Uploads return bundled images from `public/assets/landing/`.
- Payment: plan picker works; checkout shows the mock card form; Pay now
  completes and unlocks the portal.
- Reports PDF downloads a tiny generated PDF.

## Reset the demo

In DevTools console:

```js
localStorage.removeItem('sw_mock_db_v1');
localStorage.removeItem('sw_user');
localStorage.removeItem('sw_access_token');
location.reload();
```

## For the mobile port

Translate components as-is. The only files that are mock machinery (and
should NOT be ported 1:1) are `src/api/index.tsx`, `src/api/mock/db.ts`,
and `src/app/mock-*`. Everything under `src/app`, `src/components`,
`src/store`, `src/types`, and `globals.css` is the real structure.
