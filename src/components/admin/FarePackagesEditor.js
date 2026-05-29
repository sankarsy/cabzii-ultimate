"use client";

function Field({ label, children, hint }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

export default function FarePackagesEditor({
  title = "Fare packages",
  hint,
  packageFields,
  farePackages,
  farePackageLabels,
  onUpdateFare,
  onUpdateLabel
}) {
  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {hint ? <p className="mt-1 text-xs text-slate-600">{hint}</p> : null}
      <div className="mt-3 space-y-4">
        {packageFields.map(({ key, defaultLabel }) => {
          const pkg = farePackages?.[key] || {};
          const displayLabel = farePackageLabels?.[key] || defaultLabel;
          return (
            <div key={key} className="rounded-lg border border-slate-200 bg-white p-3">
              <Field label="Package name (shown on website)">
                <input
                  className={inputCls()}
                  value={displayLabel}
                  onChange={(e) => onUpdateLabel(key, e.target.value)}
                  placeholder={defaultLabel}
                />
              </Field>
              <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                <Field label="Original ₹">
                  <input
                    type="number"
                    min={0}
                    className={inputCls()}
                    value={pkg.originalPrice ?? 0}
                    onChange={(e) => onUpdateFare(key, "originalPrice", Number(e.target.value))}
                  />
                </Field>
                <Field label="Price ₹">
                  <input
                    type="number"
                    min={0}
                    className={inputCls()}
                    value={pkg.price ?? 0}
                    onChange={(e) => onUpdateFare(key, "price", Number(e.target.value))}
                  />
                </Field>
                <Field label="Discount %">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    className={inputCls()}
                    value={pkg.discountPercentage ?? 0}
                    onChange={(e) => onUpdateFare(key, "discountPercentage", Number(e.target.value))}
                  />
                </Field>
                <Field label="Extra km ₹">
                  <input
                    type="number"
                    min={0}
                    className={inputCls()}
                    value={pkg.extraKmRate ?? 0}
                    onChange={(e) => onUpdateFare(key, "extraKmRate", Number(e.target.value))}
                  />
                </Field>
                <Field label="Extra hr ₹">
                  <input
                    type="number"
                    min={0}
                    className={inputCls()}
                    value={pkg.extraHourRate ?? 0}
                    onChange={(e) => onUpdateFare(key, "extraHourRate", Number(e.target.value))}
                  />
                </Field>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
