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
import { loadCheckoutDraft } from "../lib/checkoutStorage";
import { PhoneIcon } from "./icons";
import { tripContextFromNextUrl, whatsappBookingUrl, whatsappQuoteMessage } from "../lib/conversion";
import { trackEvent, utmFromSearch } from "../lib/analytics";
import { upsertEnquiry, getSessionEnquiryId, setSessionEnquiryId } from "../lib/enquiryCapture";

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

export default function OtpLogin({
  nextUrl: nextUrlProp,
  onBack,
  loginAs,
  title = "Customer Login",
  subtitle = "Book cabs, tours & drivers with your 6-digit mobile OTP.",
  showWhatsAppQuote = true
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = nextUrlProp || searchParams.get("next") || "/";
  const allowQuote = showWhatsAppQuote && loginAs !== "driver";

  const [mobile, setMobile] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("mobile");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [otpFailed, setOtpFailed] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const saved = loadCheckoutDraft();
    const savedPhone = normalizeMobileInput(saved.phone || saved.mobile || "");
    if (savedPhone) setMobile(savedPhone);
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const otpValue = otpDigits.join("");

  const sendOtp = async () => {
    setError("");
    setMessage("");
    setOtpFailed(false);
    const mobileNumber = normalizeMobileInput(mobile);
    if (mobileNumber.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    const trip = tripForQuote();
    if (trip.pickup || trip.drop) {
      upsertEnquiry({
        phone: mobileNumber,
        name: trip.name || "",
        pickup: trip.pickup,
        drop: trip.drop,
        travelDate: trip.travelDate,
        pickupTime: trip.pickupTime,
        vehicleId: trip.vehicleId,
        vehicleName: trip.vehicleName,
        estimatedFare: Number(trip.estimatedFare) || 0,
        distanceKm: Number(trip.distanceKm) || 0,
        tripType: trip.tripType || "",
        packageLabel: trip.packageLabel,
        service: trip.service === "Call Driver" ? "driver" : trip.service === "Bus" ? "bus" : trip.service === "Holiday package" ? "tour" : "cab",
        sourcePage: nextUrl,
        ctaLocation: "otp_login"
      });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, ...(loginAs ? { loginAs } : {}) })
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || data?.success === false) {
        const unavailable = data?.otpUnavailable || res.status >= 500;
        setOtpFailed(true);
        throw new Error(
          unavailable
            ? data?.message ||
                "SMS OTP could not be sent. Send this package to WhatsApp as PDF and text."
            : data?.message || "Failed to send OTP"
        );
      }
      setStep("otp");
      setResendIn(RESEND_SECONDS);
      setOtpDigits(["", "", "", "", "", ""]);
      trackEvent("otp_requested", { source_page: nextUrl, cta_location: "otp_login" });
      trackEvent("otp_screen_viewed", { source_page: nextUrl });
      if (data?.debugOtp) {
        setMessage(`Development OTP: ${data.debugOtp}`);
      } else {
        setMessage(data?.message || "OTP sent to your mobile.");
      }
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
      trackEvent("otp_failed", { source_page: nextUrl, cta_location: "otp_login" });
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
        body: JSON.stringify({ mobileNumber, otp, ...(loginAs ? { loginAs } : {}) })
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || !data?.data?.token) {
        throw new Error(data?.message || "Invalid OTP");
      }
      if (loginAs === "driver" && data.data.user?.role !== "driver") {
        throw new Error("This mobile is not registered as a driver.");
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

  function tripForQuote() {
    const fromUrl = tripContextFromNextUrl(nextUrl);
    const draft = loadCheckoutDraft();
    return {
      ...fromUrl,
      pickup: fromUrl.pickup || draft.pickup || "",
      drop: fromUrl.drop || draft.drop || "",
      travelDate: fromUrl.travelDate || draft.date || "",
      pickupTime: fromUrl.pickupTime || draft.time || "",
      vehicleName: fromUrl.vehicleName || draft.vehicleName || "",
      vehicleId: fromUrl.vehicleId || draft.cabId || "",
      estimatedFare: fromUrl.estimatedFare || draft.total || "",
      distanceKm: fromUrl.distanceKm || draft.distanceKm || "",
      packageLabel: fromUrl.packageLabel || draft.packageLine || "",
      name: draft.customerName || ""
    };
  }

  const openWhatsAppQuote = async () => {
    const mobileNumber = normalizeMobileInput(mobile);
    if (mobileNumber.length !== 10) {
      setError("Enter a valid 10-digit mobile number so we can send the package on WhatsApp.");
      return;
    }
    const trip = tripForQuote();
    const utm = utmFromSearch(typeof window !== "undefined" ? window.location.search : "");
    setLoading(true);
    setError("");
    try {
      const origin = window.location.origin;
      const res = await fetch("/api/quote-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobileNumber,
          name: trip.name || "",
          service: trip.service === "Call Driver" ? "driver" : trip.service === "Bus" ? "bus" : trip.service === "Holiday package" ? "tour" : "cab",
          vehicleId: trip.vehicleId,
          vehicleName: trip.vehicleName,
          pickup: trip.pickup,
          drop: trip.drop,
          travelDate: trip.travelDate,
          pickupTime: trip.pickupTime,
          passengerCount: trip.passengers,
          estimatedFare: Number(trip.estimatedFare) || 0,
          distanceKm: Number(trip.distanceKm) || 0,
          tripType: trip.tripType || trip.service,
          packageLabel: trip.packageLabel,
          enquiryId: getSessionEnquiryId(),
          sourcePage: nextUrl,
          ctaLocation: "otp_login",
          source: "whatsapp_quote",
          utmSource: utm.utm_source,
          utmMedium: utm.utm_medium,
          utmCampaign: utm.utm_campaign
        })
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) throw new Error(data?.message || "Could not save quote request");
      const savedId = String(data?.data?.enquiryId || data?.data?.id || "");
      if (savedId) setSessionEnquiryId(savedId);
      const quoteRef = data?.data?.quoteRef || "";
      const pdfUrl = `${origin}/api/quote-leads/public/${encodeURIComponent(quoteRef)}/pdf`;
      const viewUrl = `${origin}/quote/${encodeURIComponent(quoteRef)}`;
      const apiTrip = data?.data?.trip || {};
      const message = whatsappQuoteMessage({
        ...trip,
        ...apiTrip,
        quoteRef,
        pdfUrl,
        viewUrl,
        passengers: trip.passengers || apiTrip.passengerCount
      });
      trackEvent("whatsapp_quote_clicked", {
        service_type: trip.service,
        vehicle_name: trip.vehicleName,
        pickup_city: trip.pickup,
        drop_city: trip.drop,
        travel_date: trip.travelDate,
        source_page: nextUrl,
        cta_location: "otp_login"
      });
      trackEvent("quote_request_submitted", { source_page: nextUrl, cta_location: "otp_login" });
      const pdfLink = document.createElement("a");
      pdfLink.href = pdfUrl;
      pdfLink.download = `cabzii-quote-${quoteRef}.pdf`;
      pdfLink.rel = "noopener";
      document.body.appendChild(pdfLink);
      pdfLink.click();
      pdfLink.remove();
      window.open(whatsappBookingUrl({ message, phone: `91${mobileNumber}` }), "_blank", "noopener,noreferrer");
      setMessage("Package PDF downloaded. WhatsApp opened with the text details for +91 " + mobileNumber + ".");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send WhatsApp package");
    } finally {
      setLoading(false);
    }
  };

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
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-400">
            <PhoneIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">{allowQuote ? "Continue Booking" : title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>

        {step === "mobile" ? (
          <div className="mx-auto max-w-sm space-y-4">
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
                  className="h-11 flex-1 px-3 text-sm text-slate-900 outline-none disabled:opacity-60"
                />
              </div>
            </div>
            <button
              type="button"
              disabled={loading || sanitizeMobileInput(mobile).length !== 10}
              onClick={sendOtp}
              className="h-11 w-full rounded-xl bg-[#0056D2] text-sm font-bold text-white transition hover:bg-[#0047b3] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
            {allowQuote ? (
              <div className={`pt-1 ${otpFailed ? "rounded-xl border border-emerald-200 bg-emerald-50/80 p-3" : ""}`}>
                <p className="mb-2 text-center text-xs font-medium text-slate-600">
                  {otpFailed ? "OTP SMS is not available. Send the package on WhatsApp." : "OTP not working?"}
                </p>
                <button
                  type="button"
                  disabled={loading || sanitizeMobileInput(mobile).length !== 10}
                  onClick={openWhatsAppQuote}
                  className="h-11 w-full max-w-xs rounded-xl border border-emerald-400 bg-emerald-50 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60 sm:mx-auto sm:flex sm:items-center sm:justify-center"
                >
                  {loading ? "Preparing PDF…" : "Send package on WhatsApp (PDF + text)"}
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  Downloads a PDF, then opens WhatsApp to this number with the same package details in text. Not a confirmed booking.
                </p>
              </div>
            ) : null}
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
            {allowQuote ? (
              <div className={`pt-1 ${otpFailed ? "rounded-xl border border-emerald-200 bg-emerald-50/80 p-3" : ""}`}>
                <p className="mb-2 text-center text-xs font-medium text-slate-600">
                  {otpFailed ? "OTP SMS is not available. Send the package on WhatsApp." : "OTP not working?"}
                </p>
                <button
                  type="button"
                  disabled={loading || sanitizeMobileInput(mobile).length !== 10}
                  onClick={openWhatsAppQuote}
                  className="h-11 w-full max-w-xs rounded-xl border border-emerald-400 bg-emerald-50 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60 sm:mx-auto sm:flex sm:items-center sm:justify-center"
                >
                  {loading ? "Preparing PDF…" : "Send package on WhatsApp (PDF + text)"}
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  Downloads a PDF, then opens WhatsApp to this number with the same package details in text. Not a confirmed booking.
                </p>
              </div>
            ) : null}
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
