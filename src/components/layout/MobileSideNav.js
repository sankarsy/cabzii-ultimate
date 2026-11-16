"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import WhatsAppIcon from "../WhatsAppIcon";
import HeaderSearchBar from "../mmt/HeaderSearchBar";
import { whatsappBookingUrl } from "../../lib/conversion";
import { useSiteSettings } from "../SiteSettingsProvider";
import {
  BookOpen,
  CarFront,
  ChevronRight,
  FileText,
  HelpCircle,
  LogIn,
  LogOut,
  MapPin,
  MessageCircle,
  Plane,
  Route,
  Star,
  UserRound,
  Wallet,
  X
} from "../icons/rscIcons";
import { EARN_NAV } from "../../lib/brand";
import { isSiteNavActive, SITE_NAV, siteNavHref } from "../../lib/siteNav";

const SITE_NAV_ICONS = {
  cabs: CarFront,
  airport: Plane,
  driver: UserRound
};

const EXPLORE_LINKS = [
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/about", label: "About us", icon: FileText },
  { href: "/contact", label: "Contact", icon: MessageCircle },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/blogs", label: "Blog", icon: BookOpen },
  { href: "/track-booking", label: "Track booking", icon: Route },
  { href: "/testimonials", label: "Reviews", icon: Star }
];

function SiteNavLinks({ pathname, onNavigate }) {
  return (
    <div role="navigation" aria-label="Cabzii">
      {SITE_NAV.map((item) => {
        const Icon = SITE_NAV_ICONS[item.id] || CarFront;
        const href = siteNavHref(item);
        return (
          <DrawerLink
            key={item.id}
            href={href}
            label={item.label}
            icon={Icon}
            active={isSiteNavActive(item, pathname)}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}

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
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ${
          active ? "bg-white text-[var(--cabzii-brand)]" : "bg-slate-50 text-slate-500"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
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
      <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ${iconBg}`}>
        {Icon ? <Icon className="h-4 w-4" strokeWidth={2} aria-hidden /> : null}
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
  loggedIn,
  onLogout,
  onLoginPage
}) {
  const [mounted, setMounted] = useState(false);
  const settings = useSiteSettings();
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
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  };

  return createPortal(
    <>
      <button
        type="button"
        className="mmt-mobile-nav-backdrop fixed inset-0 z-[200] bg-slate-900/50 lg:hidden"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav
        id="mmt-mobile-nav"
        className="mmt-mobile-nav-drawer fixed inset-y-0 left-0 z-[210] flex w-[min(100vw,360px)] flex-col overflow-hidden bg-white shadow-2xl lg:hidden"
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
            {loggedIn ? (
              <Link
                href="/account"
                onClick={onClose}
                className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[var(--cabzii-brand)]">
                  <UserRound className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-slate-900">My account</span>
                  <span className="text-xs font-normal text-slate-500">Trips, profile and settings</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} aria-hidden />
              </Link>
            ) : onLoginPage ? null : (
              <Link
                href="/login"
                onClick={onClose}
                className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--cabzii-brand)] text-[15px] font-bold text-white"
              >
                <LogIn className="h-4 w-4" strokeWidth={2} aria-hidden />
                Login
              </Link>
            )}
          </div>

          <SectionLabel>Book</SectionLabel>
          <SiteNavLinks pathname={pathname} onNavigate={onClose} />
          <DrawerLink
            href={EARN_NAV.href}
            label={EARN_NAV.label}
            icon={Wallet}
            active={pathname === EARN_NAV.href || pathname.startsWith(`${EARN_NAV.href}/`)}
            onNavigate={onClose}
          />

          <SectionLabel>Quick actions</SectionLabel>

          <DrawerActionRow
            icon={WhatsAppIcon}
            label="WhatsApp"
            sublabel="Get a quote on chat"
            href={waHref}
            external
            accent="green"
            onNavigate={onClose}
          />
          <DrawerActionRow icon={CarFront} label="Book now" sublabel="Search & book cabs" href="/cabs" accent="cta" onNavigate={onClose} />

          {loggedIn ? (
            <>
              <SectionLabel>Account</SectionLabel>
              <DrawerActionRow icon={Route} label="My trips" href="/my-bookings" onNavigate={onClose} />
              <DrawerActionRow
                icon={LogOut}
                label="Logout"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              />
            </>
          ) : null}

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
