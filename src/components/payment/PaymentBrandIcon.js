export default function PaymentBrandIcon({ type, className = "h-9 w-9" }) {
  const base = `${className} shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold`;

  if (type === "paytm") {
    return (
      <span className={`${base} bg-[#00BAF2] text-white`} aria-hidden>
        Paytm
      </span>
    );
  }
  if (type === "gpay") {
    return (
      <span className={`${base} bg-white border border-slate-200 text-slate-700`} aria-hidden>
        GPay
      </span>
    );
  }
  if (type === "phonepe") {
    return (
      <span className={`${base} bg-[#5F259F] text-white`} aria-hidden>
        Pe
      </span>
    );
  }
  if (type === "upi") {
    return (
      <span className={`${base} bg-[#097939] text-white`} aria-hidden>
        UPI
      </span>
    );
  }
  if (type === "amazonpay") {
    return (
      <span className={`${base} bg-[#232F3E] text-[#FF9900]`} aria-hidden>
        amz
      </span>
    );
  }
  if (type === "wallet") {
    return (
      <span className={`${base} bg-amber-100 text-amber-800`} aria-hidden>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </span>
    );
  }
  if (type === "cash") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`} aria-hidden>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </span>
    );
  }
  if (type === "qr") {
    return (
      <span className={`${base} bg-sky-50 text-sky-700`} aria-hidden>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </span>
    );
  }
  if (type === "card") {
    return (
      <span className={`${base} bg-slate-100 text-slate-600`} aria-hidden>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </span>
    );
  }
  return (
    <span className={`${base} bg-slate-100 text-slate-500`} aria-hidden>
      •
    </span>
  );
}
