# Mock onboarding flow - progress notes

Goal (from client review):
1. Sign-in lands on /onboarding (client role).
2. Clicking an undone onboarding task completes it instantly (proto runDemo
   behavior: click -> done, no forms/popups).
3. Proto-style bottom toolbar: page switcher, flows, Empty/Filled toggle.
4. Sidebar locks until client_phase flips to active (already in nav.ts).

Changes:
- mock db.ts: syncPhase() derives client_phase/onboarding.phase/dashboard.phase
  from task completion; applyDemoState() backs Empty/Filled + flows; updateTask
  calls syncPhase. Seed client user starts as "onboarding".
- mock index.tsx: GET /onboarding/ and GET /dashboard/ heal phase via syncPhase.
- login/page.tsx: client sign-in -> /onboarding.
- V2OnboardingMain: openTask / ?focus&mode=open complete the current undone
  step via submitTask instead of opening drawers/modals; done tasks still open
  the review drawer (V2TaskModal only, esign special-case removed).
- components/global/ProtoBar.tsx: fixed bottom bar reusing proto .proto/.pt-dd
  styles; pages dropdown, flows, Empty/Filled toggle. Mounted in private layout.

Status: implemented, `npx tsc --noEmit`, `npx eslint` on touched files, and
`npm run build` all pass. V2SignModal.tsx is now unreferenced (kept on disk).
Verify in browser: sign in -> /onboarding, click each step (instant done),
sidebar unlocks after last step, ProtoBar switches pages/flows.
