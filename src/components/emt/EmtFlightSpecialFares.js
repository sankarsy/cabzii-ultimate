"use client";

const FARES = [
  { id: "defence", label: "Defence Forces", sub: "Up to ₹600 Off" },
  { id: "students", label: "Students", sub: "Extra baggage, discount" },
  { id: "seniors", label: "Senior Citizens", sub: "Up to ₹600 Off" },
  { id: "doctors", label: "Doctors & Nurses", sub: "Up to ₹600 Off" }
];

export default function EmtFlightSpecialFares() {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-2.5 text-[0.6875rem] font-bold uppercase tracking-wide text-white/95 sm:text-xs">
        Special Fares (Optional):
      </p>
      <div className="flex flex-wrap gap-2">
        {FARES.map((fare) => (
          <label
            key={fare.id}
            className="emt-special-fare cabzii-tap flex cursor-pointer items-start gap-2 px-3 py-2.5 backdrop-blur-sm"
          >
            <input type="radio" name="specialFare" className="mt-0.5 accent-[#2196f3]" />
            <span>
              <span className="block text-xs font-bold leading-tight text-white">{fare.label}</span>
              <span className="mt-0.5 block text-[10px] leading-snug text-white/80">{fare.sub}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
