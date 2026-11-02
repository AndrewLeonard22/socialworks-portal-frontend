import { PlanBar } from "@/components/layout/PlanBar";

export function PrivateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="swa-shell swa-shell-glow relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[clamp(28px,3.6vh,44px)] bg-swa-shell">
      <PlanBar />
      {children}
    </div>
  );
}
