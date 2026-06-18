"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, Send, X } from "lucide-react";
import ChatMessageContent from "./ChatMessageContent";
import ZiiAvatar from "./ZiiAvatar";
import WhatsAppIcon from "../WhatsAppIcon";
import { useSiteSettings } from "../SiteSettingsProvider";
import { CHATBOT_QUICK_ACTIONS } from "../../lib/domesticFocus";
import { telUrl, whatsappBookingUrl } from "../../lib/conversion";
import {
  clearChatSession,
  isValidIndianMobile,
  loadChatSession,
  normalizeIndianMobile,
  saveChatSession
} from "../../lib/chatbot/session";
import { shouldHideFloatingUi } from "../../lib/floatingUi";

function TypingDots() {
  return (
    <span className="cabzii-chat-typing" aria-label="Zii is typing">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function CabziiChatbot() {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const phone = settings.contact?.phone || "+91-9944197416";
  const whatsappNumber = String(settings.contact?.whatsapp || settings.whatsappFab?.number || "9944197416").replace(/\D/g, "");
  const waHref = whatsappBookingUrl({
    phone: whatsappNumber,
    message: "Hi Cabzii, I need a taxi quote or tour package enquiry."
  });
  const callHref = telUrl(phone);
  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const session = loadChatSession();
    if (session) {
      setName(session.name);
      setMobile(session.mobile);
      setMessages(session.messages);
      setStep("chat");
    }
  }, []);

  useEffect(() => {
    if (open && step === "chat") {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typing, open, step]);

  useEffect(() => {
    if (open && step === "chat") {
      inputRef.current?.focus();
    }
  }, [open, step]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const persist = useCallback(
    (nextMessages) => {
      saveChatSession({ name, mobile, messages: nextMessages });
    },
    [name, mobile]
  );

  const greetUser = useCallback((userName, userMobile) => {
    const greeting = {
      id: `bot-${Date.now()}`,
      role: "assistant",
      content: `Hi ${userName.split(/\s+/)[0]}! 🎉 I'm Zii, your Cabzii travel assistant. Ask me about cabs, airport taxis, outstation routes, acting drivers, or holiday packages.`,
      time: Date.now()
    };
    setMessages([greeting]);
    setSuggestions(["Book a cab", "Airport taxi fare", "Chennai to Bangalore", "24/7 support"]);
    saveChatSession({ name: userName, mobile: userMobile, messages: [greeting] });
  }, []);

  const handleOpen = () => {
    setOpen(true);
    const session = loadChatSession();
    setStep(session?.onboarded ? "chat" : "welcome");
  };

  const handleClose = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  const handleReset = () => {
    clearChatSession();
    setName("");
    setMobile("");
    setMessages([]);
    setSuggestions([]);
    setStep("welcome");
  };

  const handleLetsChat = () => setStep("onboarding");

  const handleOnboarding = async (e) => {
    e.preventDefault();
    setFormError("");
    const trimmedName = name.trim();
    const normalizedMobile = normalizeIndianMobile(mobile);

    if (trimmedName.length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!isValidIndianMobile(normalizedMobile)) {
      setFormError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, mobile: normalizedMobile })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || "Could not verify your details. Please try again.");
        setSubmitting(false);
        return;
      }
    } catch {
      setFormError("Network error. Check your connection and try again.");
      setSubmitting(false);
      return;
    }

    setName(trimmedName);
    setMobile(normalizedMobile);
    setStep("chat");
    greetUser(trimmedName, normalizedMobile);
    setSubmitting(false);
  };

  const sendMessage = async (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed || typing) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      time: Date.now()
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setSuggestions([]);
    setTyping(true);
    persist(nextMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          name,
          mobile,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that. Try asking about cab booking or fares.",
        time: Date.now()
      };
      const withBot = [...nextMessages, botMsg];
      setMessages(withBot);
      setSuggestions(data.suggestions || []);
      persist(withBot);
    } catch (err) {
      const errMsg = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: err.message || "Something went wrong. Please try again or use WhatsApp for live support.",
        time: Date.now()
      };
      const withErr = [...nextMessages, errMsg];
      setMessages(withErr);
      persist(withErr);
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (action) => {
    if (action.type === "whatsapp") {
      window.open(waHref, "_blank", "noopener,noreferrer");
      return;
    }
    if (action.type === "call") {
      window.location.href = callHref;
      return;
    }
    if (action.type === "message" && action.text) {
      if (step !== "chat") {
        handleLetsChat();
        setTimeout(() => sendMessage(action.text), 300);
      } else {
        sendMessage(action.text);
      }
    }
  };

  const QuickActionsBar = ({ compact = false }) => (
    <div className={`flex gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2.5 scrollbar-hide ${compact ? "" : "bg-gradient-to-r from-slate-50 to-white"}`}>
      {CHATBOT_QUICK_ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => handleQuickAction(action)}
          className="cabzii-tap inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[var(--cabzii-brand)]/30 hover:text-[var(--cabzii-brand)]"
        >
          {action.icon === "whatsapp" ? <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" /> : null}
          {action.icon === "phone" ? <Phone className="h-3.5 w-3.5 text-[var(--cabzii-brand)]" strokeWidth={2} /> : null}
          {action.label}
        </button>
      ))}
    </div>
  );

  if (shouldHideFloatingUi(pathname)) return null;

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={handleOpen}
          className="cabzii-chat-launcher cabzii-tap fixed z-[60] bottom-[4.75rem] right-4 flex h-14 w-14 items-center justify-center rounded-full border-0 bg-transparent p-0 shadow-[0_8px_28px_rgba(0,86,210,0.35)] transition hover:scale-[1.05] sm:bottom-6 sm:right-5 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3 sm:text-white sm:shadow-[0_8px_32px_rgba(0,86,210,0.4)] sm:[background:var(--cabzii-gradient-brand)]"
          aria-label="Chat with Zii, Cabzii AI assistant"
        >
          <ZiiAvatar className="h-14 w-14 sm:hidden" />
          <span className="hidden sm:inline-flex sm:items-center sm:gap-2">
            <ZiiAvatar className="h-8 w-8" />
            <span className="text-sm font-bold">Chat with Zii</span>
          </span>
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          className="cabzii-chat-panel fixed z-[70] flex max-h-[min(640px,calc(100dvh-6rem))] w-[min(100%,24rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:bottom-6 sm:right-5 bottom-[4.75rem] right-4 left-4 sm:left-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Cabzii AI chat with Zii"
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>

          {step === "welcome" && (
            <div className="cabzii-chat-welcome flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
              <ZiiAvatar className="h-16 w-16 shadow-[0_8px_24px_rgba(0,86,210,0.25)]" />
              <p className="mt-5 text-sm font-medium text-slate-600">Hi, I am</p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-wide text-[var(--cabzii-brand)]">ZII</h2>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-slate-600">
                Your travel assistant for cabs, airport taxis, temple tours &amp; outstation routes across South India.
              </p>
              <button
                type="button"
                onClick={handleLetsChat}
                className="cabzii-tap mt-6 w-full max-w-[14rem] rounded-full py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,86,210,0.35)] transition hover:brightness-105"
                style={{ background: "var(--cabzii-gradient-brand)" }}
              >
                Get instant quote
              </button>
              <QuickActionsBar compact />
            </div>
          )}

          {step === "onboarding" && (
            <div className="cabzii-chat-welcome flex flex-1 flex-col px-6 py-8">
              <div className="flex flex-col items-center text-center">
                <ZiiAvatar className="h-14 w-14" />
                <h2 className="mt-4 text-lg font-bold text-slate-900">Before we start</h2>
                <p className="mt-1 text-sm text-slate-600">Share your name &amp; mobile so we can assist you better.</p>
              </div>
              <form onSubmit={handleOnboarding} className="mt-6 flex flex-1 flex-col gap-4">
                <label className="block text-left">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--cabzii-brand)] focus:ring-2 focus:ring-[var(--cabzii-brand)]/15"
                  />
                </label>
                <label className="block text-left">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile number</span>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile"
                      autoComplete="tel"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[var(--cabzii-brand)] focus:ring-2 focus:ring-[var(--cabzii-brand)]/15"
                    />
                  </div>
                </label>
                {formError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-left text-xs font-medium text-red-600">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="cabzii-tap mt-auto w-full rounded-full py-3 text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: "var(--cabzii-gradient-brand)" }}
                >
                  {submitting ? "Starting chat…" : "Continue to chat"}
                </button>
              </form>
            </div>
          )}

          {step === "chat" && (
            <>
              <header className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-4 py-3 pr-12">
                <ZiiAvatar className="h-10 w-10 shrink-0" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-bold text-slate-900">Zii</p>
                  <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                    Online · Cabzii AI
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mr-8 shrink-0 text-[11px] font-semibold text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
                >
                  Reset
                </button>
              </header>

              <div
                ref={listRef}
                className="cabzii-chat-messages flex-1 space-y-3 overflow-y-auto px-4 py-4"
                aria-live="polite"
                aria-relevant="additions"
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-md bg-[var(--cabzii-brand)] text-white"
                          : "rounded-bl-md bg-slate-100 text-slate-800"
                      }`}
                    >
                      <ChatMessageContent content={msg.content} isUser={msg.role === "user"} />
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
                      <TypingDots />
                    </div>
                  </div>
                )}
              </div>

              {suggestions.length > 0 && (
                <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2 scrollbar-hide">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="cabzii-tap shrink-0 rounded-full border border-[var(--cabzii-brand)]/20 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[var(--cabzii-brand)] transition hover:bg-blue-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-slate-100 p-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about cabs, fares, routes…"
                  maxLength={500}
                  className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[var(--cabzii-brand)] focus:bg-white focus:ring-2 focus:ring-[var(--cabzii-brand)]/10"
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="cabzii-tap flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white disabled:opacity-40"
                  style={{ background: "var(--cabzii-gradient-brand)" }}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                </button>
              </form>
              <QuickActionsBar compact />
            </>
          )}
        </div>
      )}
    </>
  );
}
