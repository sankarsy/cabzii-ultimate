"use client";

import OtpLogin from "../../../components/OtpLogin";

export default function DriverLoginPage() {
  return (
    <div className="flex min-h-dvh items-center bg-slate-50 py-8">
      <OtpLogin
        loginAs="driver"
        showWhatsAppQuote={false}
        nextUrl="/driver"
        title="Driver Login"
        subtitle="Enter the mobile number registered for you by your travel partner."
      />
    </div>
  );
}
