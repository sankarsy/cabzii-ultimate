"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getToken, validateSession } from "../../lib/auth";
import DriverShell from "./DriverShell";

const DriverUserContext = createContext(null);

export function useDriverUser() {
  return useContext(DriverUserContext);
}

export default function DriverGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/driver/login";
  const [driver, setDriver] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!validateSession()) {
        if (!isLogin) router.replace("/driver/login");
        if (!cancelled) {
          setDriver(null);
          setReady(true);
        }
        return;
      }
      const token = getToken();
      try {
        const res = await fetch("/api/auth/me", {
          headers: { authorization: `Bearer ${token}` },
          cache: "no-store"
        });
        const json = await res.json();
        const user = json?.data;
        if (!res.ok || user?.role !== "driver") {
          if (!isLogin) router.replace("/driver/login");
          if (!cancelled) {
            setDriver(null);
            setReady(true);
          }
          return;
        }
        if (isLogin) {
          router.replace("/driver");
        }
        if (!cancelled) {
          setDriver(user);
          setReady(true);
        }
      } catch {
        if (!isLogin) router.replace("/driver/login");
        if (!cancelled) {
          setDriver(null);
          setReady(true);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [isLogin, pathname, router]);

  const logout = async () => {
    clearSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    setDriver(null);
    router.replace("/driver/login");
  };

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading…
      </div>
    );
  }

  if (isLogin) {
    if (driver) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-slate-50 text-sm text-slate-600">
          Opening dashboard…
        </div>
      );
    }
    return children;
  }

  if (!driver) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 text-sm text-slate-600">
        Opening driver login…
      </div>
    );
  }

  return (
    <DriverUserContext.Provider value={driver}>
      <DriverShell driver={driver} onLogout={logout}>
        {children}
      </DriverShell>
    </DriverUserContext.Provider>
  );
}
