"use client";

import { useEffect } from "react";

export default function BottomSheet({ open, onClose, title, children, tall = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    root.classList.add("menu-scroll-lock");
    return () => root.classList.remove("menu-scroll-lock");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex w-full flex-col rounded-t-[1.25rem] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)] sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl ${
          tall ? "max-h-[92vh] sm:max-h-[85vh]" : "max-h-[85vh]"
        }`}
      >
        <div className="flex shrink-0 items-center justify-center pt-2.5 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-slate-300" aria-hidden />
        </div>
        {title ? (
          <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
              aria-label="Back"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
