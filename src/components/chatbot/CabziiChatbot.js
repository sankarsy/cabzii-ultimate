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
  ONBOARDING,
  parseNameInput,
  parsePhoneInput
} from "../../lib/chatbot/onboarding";
import {
  clearChatSession,
  loadChatSession,
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

function botMessage(content) {
  return { id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, role: "assistant", content, time: Date.now() };
}

function userMessage(content) {
  return { id: `user-${Date.now()}`, role: "user", content, time: Date.now() };
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
  const pendingQuickMessageRef = useRef("");
  const sendChatMessageRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  /** null | "name" | "phone" | "done" */
  const [onboardingPhase, setOnboardingPhase] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [submittingLead, setSubmittingLead] = useState(false);

  useEffect(() => {
    const session = loadChatSession();
    if (session) {
      setName(session.name);
      setMobile(session.mobile);
      setMessages(session.messages);
      setOnboardingPhase("done");
      setStep("chat");
    }
  }, []);

  useEffect(() => {
    if (open && step === "chat") {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typing, open, step]);

  useEffect(() => {
    if (open && step === "chat" && onboardingPhase === "done") {
      inputRef.current?.focus();
    }
  }, [open, step, onboardingPhase]);

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
    (nextMessages, userName = name, userMobile = mobile) => {
      if (userName && userMobile) {
        saveChatSession({ name: userName, mobile: userMobile, messages: nextMessages });
      }
    },
    [name, mobile]
  );

  const showTypingThen = useCallback((replyFn, delayMs = 700) => {
    setTyping(true);
    return new Promise((resolve) => {
      window.setTimeout(() => {
        setTyping(false);
        resolve(replyFn());
      }, delayMs);
    });
  }, []);

  const startConversationalOnboarding = useCallback(() => {
    setStep("chat");
    setOnboardingPhase("name");
    setMessages([]);
    setSuggestions([]);
    setInput("");
    showTypingThen(() => {
      const greeting = botMessage(ONBOARDING.askName);
      setMessages([greeting]);
    }, 500);
  }, [showTypingThen]);

  const completeOnboarding = useCallback(
    async (userName, userMobile, currentMessages) => {
      setSubmittingLead(true);
      try {
        const res = await fetch("/api/chat/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: userName, mobile: userMobile })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          await showTypingThen(() => {
            const err = botMessage(data.error || "Sorry, I couldn't save your details. Please try your mobile number again.");
            setMessages((prev) => [...prev, err]);
          });
          setOnboardingPhase("phone");
          setSubmittingLead(false);
          return;
        }
      } catch {
        await showTypingThen(() => {
          const err = botMessage("Network error — please check your connection and share your mobile again.");
          setMessages((prev) => [...prev, err]);
        });
        setOnboardingPhase("phone");
        setSubmittingLead(false);
        return;
      }

      setName(userName);
      setMobile(userMobile);
      setOnboardingPhase("done");
      setSubmittingLead(false);

      const withReady = [...currentMessages];
      await showTypingThen(() => {
        const ready = botMessage(ONBOARDING.ready(userName));
        withReady.push(ready);
        setMessages(withReady);
        setSuggestions(["Book a cab", "Airport taxi fare", "Chennai to Bangalore", "24/7 support"]);
        persist(withReady, userName, userMobile);
      }, 600);

      const queued = pendingQuickMessageRef.current;
      pendingQuickMessageRef.current = "";
      if (queued) {
        window.setTimeout(() => {
          sendChatMessageRef.current?.(queued, userName, userMobile, withReady);
        }, 400);
      }
    },
    [persist, showTypingThen]
  );

  const handleOnboardingReply = useCallback(
    async (trimmed, currentMessages) => {
      if (onboardingPhase === "name") {
        const parsedName = parseNameInput(trimmed);
        if (!parsedName) {
          await showTypingThen(() => {
            setMessages((prev) => [...prev, botMessage(ONBOARDING.invalidName)]);
          });
          return;
        }
        setName(parsedName);
        setOnboardingPhase("phone");
        await showTypingThen(() => {
          setMessages((prev) => [...prev, botMessage(ONBOARDING.thankName(parsedName))]);
        });
        return;
      }

      if (onboardingPhase === "phone") {
        const parsedMobile = parsePhoneInput(trimmed);
        if (!parsedMobile) {
          await showTypingThen(() => {
            setMessages((prev) => [...prev, botMessage(ONBOARDING.invalidPhone)]);
          });
          return;
        }
        const savingMsg = botMessage(ONBOARDING.saving);
        const msgsWithSaving = [...currentMessages, savingMsg];
        setMessages(msgsWithSaving);
        await completeOnboarding(name, parsedMobile, msgsWithSaving);
      }
    },
    [completeOnboarding, name, onboardingPhase, showTypingThen]
  );

  const sendChatMessage = async (text, userName = name, userMobile = mobile, baseMessages = messages) => {
    const trimmed = String(text || "").trim();
    if (!trimmed || typing || submittingLead) return;

    const userMsg = userMessage(trimmed);
    const nextMessages = [...baseMessages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setSuggestions([]);
    persist(nextMessages, userName, userMobile);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          name: userName,
          mobile: userMobile,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");

      await showTypingThen(() => {
        const botMsg = botMessage(data.reply || "Sorry, I couldn't process that. Try asking about cab booking or fares.");
        const withBot = [...nextMessages, botMsg];
        setMessages(withBot);
        setSuggestions(data.suggestions || []);
        persist(withBot, userName, userMobile);
      }, 500);
    } catch (err) {
      await showTypingThen(() => {
        const errMsg = botMessage(err.message || "Something went wrong. Please try again or use WhatsApp for live support.");
        const withErr = [...nextMessages, errMsg];
        setMessages(withErr);
        persist(withErr, userName, userMobile);
      });
    } finally {
      setTyping(false);
    }
  };

  sendChatMessageRef.current = sendChatMessage;

  const sendMessage = async (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed || typing || submittingLead) return;

    const userMsg = userMessage(trimmed);
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setSuggestions([]);

    if (onboardingPhase && onboardingPhase !== "done") {
      await handleOnboardingReply(trimmed, nextMessages);
      return;
    }

    await sendChatMessage(trimmed, name, mobile, nextMessages);
  };

  const handleOpen = () => {
    setOpen(true);
    const session = loadChatSession();
    if (session?.onboarded) {
      setStep("chat");
      setOnboardingPhase("done");
    } else {
      setStep("welcome");
      setOnboardingPhase(null);
    }
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
    setOnboardingPhase(null);
    setStep("welcome");
    pendingQuickMessageRef.current = "";
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
      if (onboardingPhase !== "done") {
        if (step !== "chat") startConversationalOnboarding();
        pendingQuickMessageRef.current = action.text;
      } else {
        sendMessage(action.text);
      }
    }
  };

  const inputPlaceholder =
    onboardingPhase === "name"
      ? "Type your name…"
      : onboardingPhase === "phone"
        ? "Enter 10-digit mobile…"
        : "Ask about cabs, fares, routes…";

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
                onClick={startConversationalOnboarding}
                className="cabzii-tap mt-6 w-full max-w-[14rem] rounded-full py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,86,210,0.35)] transition hover:brightness-105"
                style={{ background: "var(--cabzii-gradient-brand)" }}
              >
                Get instant quote
              </button>
              <QuickActionsBar compact />
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
                    {onboardingPhase === "done" ? "Online · Cabzii AI" : "Getting to know you…"}
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
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
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

              {suggestions.length > 0 && onboardingPhase === "done" && (
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
                  type={onboardingPhase === "phone" ? "tel" : "text"}
                  inputMode={onboardingPhase === "phone" ? "numeric" : "text"}
                  value={input}
                  onChange={(e) => {
                    if (onboardingPhase === "phone") {
                      setInput(e.target.value.replace(/\D/g, "").slice(0, 10));
                    } else {
                      setInput(e.target.value);
                    }
                  }}
                  placeholder={inputPlaceholder}
                  maxLength={onboardingPhase === "phone" ? 10 : 500}
                  disabled={submittingLead}
                  className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[var(--cabzii-brand)] focus:bg-white focus:ring-2 focus:ring-[var(--cabzii-brand)]/10 disabled:opacity-60"
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing || submittingLead}
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
