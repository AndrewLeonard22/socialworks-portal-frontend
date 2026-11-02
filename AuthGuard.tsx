"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { auth_apis } from "@/api/auth";
import { setUser } from "@/store/auth/reducer";
import { useMounted } from "@/lib/useMounted";

const ONBOARDING_PATH = "/onboarding/basic-details";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const dispatch = useAppDispatch();
  const { isHydrated, accessToken, user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();
  const scopeSynced = useRef(false);

  const isOnboardingPage = pathname === ONBOARDING_PATH;
  const shouldRedirect =
    mounted &&
    isHydrated &&
    (!accessToken ||
      !user ||
      (user.needs_onboarding && !isOnboardingPage) ||
      (!user.needs_onboarding && isOnboardingPage));

  useEffect(() => {
    if (!mounted || !isHydrated) {
      return;
    }
    if (!accessToken || !user) {
      router.replace("/login");
    } else if (user.needs_onboarding && !isOnboardingPage) {
      router.replace(ONBOARDING_PATH);
    } else if (!user.needs_onboarding && isOnboardingPage) {
      router.replace("/dashboard");
    }
  }, [mounted, isHydrated, accessToken, user, isOnboardingPage, router]);

  /* The persisted user snapshot can lag the server (client_phase flips,
     brand changes, impersonation context). One silent me() per session
     keeps the stored scope fresh so locked nav items unlock without a
     re-login. */
  useEffect(() => {
    if (!mounted || !isHydrated || !accessToken || scopeSynced.current) {
      return;
    }
    scopeSynced.current = true;
    auth_apis
      .me()
      .then((fresh) => dispatch(setUser(fresh)))
      .catch(() => {});
  }, [mounted, isHydrated, accessToken, dispatch]);

  if (!mounted || !isHydrated || shouldRedirect) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  return <>{children}</>;
}
