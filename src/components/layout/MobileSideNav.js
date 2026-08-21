"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Bus,
  Car,
  ChevronRight,
  CircleUser,
  FileText,
  HelpCircle,
  LogIn,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Umbrella,
  UserRound,
  X
} from "lucide-react";
import WhatsAppIcon from "../WhatsAppIcon";
import HeaderSearchBar from "../mmt/HeaderSearchBar";
import { telUrl, whatsappBookingUrl } from "../../lib/conversion";
import { useSiteSettings } from "../SiteSettingsProvider";

const BOOK_LINKS = [
  { href: "/?tab=cabs", label: "Cabs", icon: Car },
  { href: "/?tab=drivers", label: "Drivers", icon: CircleUser },
  { href: "/?tab=buses", label: "Buses", icon: Bus },
  { href: "/?tab=holidays", label: "Holidays", icon: Umbrella }
];

const EXPLORE_LINKS = [
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/about", label: "About us", icon: FileText },
  { href: "/contact", label: "Contact", icon: MessageCircle },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/blogs", label: "Blog", icon: BookOpen },
  { href: "/track-booking", label: "Track booking", icon: MapPin },
  { href: "/testimonials", label: "Reviews", icon: Star }
];

function SectionLabel({ children }) {
  return (
    <p className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{children}</p>
  );
}

function DrawerLink({ href, label, icon: Icon, active, onNavigate, external }) {
  const className = `mmt-drawer-link flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-[15px] font-semibold transition active:bg-slate-50 ${
    active ? "bg-sky-50 text-[var(--cabzii-brand)]" : "text-slate-800"
  }`;

  const inner = (
    <>
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-white text-[var(--cabzii-brand)]" : "bg-slate-50 text-slate-500"
        }`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} aria-hidden />
    </>
  );

  if (external) {
    return (
      <a href={href} onClick={onNavigate} className={className} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onNavigate} className={className}>
      {inner}
    </Link>
  );
}

function DrawerActionRow({ icon: Icon, label, sublabel, onClick, href, external, accent, onNavigate, trailing }) {
  const className = `mmt-drawer-link flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-left text-[15px] font-semibold transition active:bg-slate-50 ${
    accent === "brand" ? "text-[var(--cabzii-brand)]" : accent === "cta" ? "text-orange-600" : accent === "green" ? "text-emerald-700" : "text-slate-800"
  }`;

  const iconBg =
    accent === "brand"
      ? "bg-sky-50 text-[var(--cabzii-brand)]"
      : accent === "cta"
        ? "bg-orange-50 text-orange-500"
        : accent === "green"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-slate-50 text-slate-500";

  const content = (
    <>
      <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {Icon ? <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block">{label}</span>
        {sublabel ? <span className="mt-0.5 block text-xs font-normal text-slate-500">{sublabel}</span> : null}
      </span>
      {trailing || <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} aria-hidden />}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} className={className} target="_blank" rel="noreferrer" onClick={onNavigate}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={className} onClick={onNavigate}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}

export default function MobileSideNav({
  open,
  onClose,
  pathname,
  activeHeroTab,
  loggedIn,
  onLogout,
  onLoginPage
}) {
  const [mounted, setMounted] = useState(false);
  const settings = useSiteSettings();
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(settings.whatsappFab?.number || settings.contact?.whatsapp || "9944197416").replace(/\D/g, "");
  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    pathname,
    searchParams: typeof window !== "undefined" ? window.location.search : "",
    city: "Chennai"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const isActive = (href) => {
    if (href.startsWith("/?tab=")) {
      const tab = href.replace("/?tab=", "");
      return pathname === "/" && activeHeroTab === tab;
    }
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  };

  return createPortal(
    <>
      <button
        type="button"
        className="mmt-mobile-nav-backdrop fixed inset-0 z-[200] bg-slate-900/50 xl:hidden"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav
        id="mmt-mobile-nav"
        className="mmt-mobile-nav-drawer fixed inset-y-0 left-0 z-[210] flex w-[min(100vw,360px)] flex-col overflow-hidden bg-white shadow-2xl xl:hidden"
        aria-label="Main menu"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
          <p className="text-base font-extrabold tracking-tight text-slate-900">Menu</p>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
          <div className="shrink-0 border-b border-slate-100 px-4 py-3">
            <HeaderSearchBar variant="light" className="w-full" onSubmitted={onClose} />
          </div>

          <SectionLabel>Quick actions</SectionLabel>

          <DrawerActionRow icon={Phone} label="Call" sublabel="Talk to support" href={telUrl(phone)} accent="brand" onNavigate={onClose} />
          <DrawerActionRow
            icon={WhatsAppIcon}
            label="WhatsApp"
            sublabel="Get a quote on chat"
            href={waHref}
            external
            accent="green"
            onNavigate={onClose}
          />
          <DrawerActionRow icon={Car} label="Book now" sublabel="Search & book cabs" href="/cabs" accent="cta" onNavigate={onClose} />

          {loggedIn ? (
            <>
              <DrawerActionRow icon={UserRound} label="My account" href="/account" accent="brand" onNavigate={onClose} />
              <DrawerActionRow icon={MapPin} label="My trips" href="/my-bookings" onNavigate={onClose} />
              <DrawerActionRow
                icon={LogIn}
                label="Logout"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              />
            </>
          ) : onLoginPage ? null : (
            <DrawerActionRow icon={LogIn} label="Login or Signup" sublabel="OTP · Partner · Admin" href="/login" accent="brand" onNavigate={onClose} />
          )}

          <SectionLabel>Book</SectionLabel>
          {BOOK_LINKS.map((item) => (
            <DrawerLink key={item.href} {...item} active={isActive(item.href)} onNavigate={onClose} />
          ))}

          <SectionLabel>Explore</SectionLabel>
          {EXPLORE_LINKS.map((item) => (
            <DrawerLink key={item.href} {...item} active={isActive(item.href)} onNavigate={onClose} />
          ))}
        </div>
      </nav>
    </>,
    document.body
  );
}
