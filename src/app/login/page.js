 "use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setMessage("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "Failed to send OTP");
      return;
    }
    setOtpSent(true);
    setMessage(data?.debugOtp ? `OTP sent. Debug OTP: ${data.debugOtp}` : "OTP sent successfully.");
  };

  const verifyOtp = async () => {
    setMessage("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, name })
    });
    const data = await res.json();
    if (!res.ok || !data?.data?.token) {
      setMessage(data?.message || "Invalid OTP");
      return;
    }
    localStorage.setItem("cabzii_token", data.data.token);
    localStorage.setItem("cabzii_user", JSON.stringify(data.data.user));
    if (["super_admin", "vendor_admin"].includes(data.data.user.role)) {
      localStorage.setItem("cabzii_admin_token", data.data.token);
      router.push("/admin");
      return;
    }
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-12">
        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-md">
          <h1 className="text-2xl font-bold text-slate-900">Login with OTP</h1>
          <p className="mt-2 text-sm text-slate-600">Secure OTP login for customers, vendor admins, and super admins.</p>
          <div className="mt-5 space-y-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-600"
              placeholder="Name (optional)"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-600"
              placeholder="Phone number"
            />
            <button type="button" onClick={sendOtp} className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
              Send OTP
            </button>
            {otpSent ? (
              <>
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-600"
                  placeholder="Enter OTP"
                />
                <button type="button" onClick={verifyOtp} className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  Verify OTP
                </button>
              </>
            ) : null}
            {message ? <p className="text-sm text-slate-700">{message}</p> : null}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
