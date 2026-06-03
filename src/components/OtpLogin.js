"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  isValidOtp,
  normalizeMobileInput,
  sanitizeMobileInput,
  sanitizeOtpInput,
  setSession
} from "../lib/auth";
import { PhoneIcon } from "./icons";

const RESEND_SECONDS = 30;

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export default function OtpLogin({ nextUrl: nextUrlProp, onBack }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = nextUrlProp || searchParams.get("next") || "/";

  const [mobile, setMobile] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("mobile");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const otpValue = otpDigits.join("");

  const sendOtp = async () => {
    setError("");
    setMessage("");
    const mobileNumber = normalizeMobileInput(mobile);
    if (mobileNumber.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber })
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to send OTP");
      }
      setStep("otp");
      setResendIn(RESEND_SECONDS);
      setOtpDigits(["", "", "", "", "", ""]);
      if (data?.debugOtp) {
        setMessage(`Development OTP: ${data.debugOtp}`);
      } else {
        setMessage(data?.message || "OTP sent to your mobile.");
      }
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setMessage("");
    const mobileNumber = normalizeMobileInput(mobile);
    const otp = sanitizeOtpInput(otpValue);
    if (!mobileNumber) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!isValidOtp(otp)) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, otp })
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || !data?.data?.token) {
        throw new Error(data?.message || "Invalid OTP");
      }
      setSession(data.data.token, data.data.user);
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.data.token })
      });
      if (!sessionRes.ok) {
        console.warn("Session cookie could not be set");
      }

      router.replace(nextUrl.startsWith("/") ? nextUrl : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = sanitizeOtpInput(value).slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && isValidOtp(otpDigits.join(""))) {
      verifyOtp();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = sanitizeOtpInput(e.clipboardData.getData("text"));
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtpDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const displayMobile = normalizeMobileInput(mobile) || sanitizeMobileInput(mobile);

  return (
    <div className="mx-auto w-full max-w-md px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 text-sm font-medium text-[#0056D2] hover:underline"
          >
            ← Back to login options
          </button>
        ) : null}
        <div className="mb-6 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0056D2]/10 text-[#0056D2]">
            <PhoneIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Customer Login</h1>
          <p className="mt-1 text-sm text-slate-600">Book cabs, tours &amp; drivers with your 6-digit mobile OTP.</p>
        </div>

        {step === "mobile" ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="login-mobile" className="mb-1.5 block text-xs font-semibold text-slate-600">
                Mobile number
              </label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100">
                <span className="flex items-center bg-slate-50 px-3 text-sm font-medium text-slate-600">+91</span>
                <input
                  id="login-mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(sanitizeMobileInput(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                  placeholder="10-digit number"
                  disabled={loading}
                  className="h-12 flex-1 px-3 text-sm text-slate-900 outline-none disabled:opacity-60"
                />
              </div>
            </div>
            <button
              type="button"
              disabled={loading || sanitizeMobileInput(mobile).length !== 10}
              onClick={sendOtp}
              className="h-12 w-full rounded-xl bg-[#0056D2] text-sm font-bold text-white transition hover:bg-[#0047b3] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-slate-600">
              OTP sent to <span className="font-semibold text-slate-900">+91 {displayMobile}</span>
            </p>
            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  disabled={loading}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="h-12 w-10 rounded-xl border border-slate-200 text-center text-lg font-bold text-slate-900 outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 disabled:opacity-60 sm:w-11"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              disabled={loading || !isValidOtp(otpValue)}
              onClick={verifyOtp}
              className="h-12 w-full rounded-xl bg-[#0056D2] text-sm font-bold text-white transition hover:bg-[#0047b3] disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify & Login"}
            </button>
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                className="font-medium text-slate-600 hover:text-[#0056D2]"
                onClick={() => {
                  setStep("mobile");
                  setOtpDigits(["", "", "", "", "", ""]);
                  setError("");
                  setMessage("");
                }}
              >
                Change number
              </button>
              <button
                type="button"
                disabled={resendIn > 0 || loading}
                onClick={sendOtp}
                className="font-semibold text-[#0056D2] disabled:text-slate-400"
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}

        {error ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p> : null}
        {message && !error ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
