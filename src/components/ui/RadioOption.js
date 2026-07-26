"use client";

/** Styled radio row — filter sidebars, forms. */
export function RadioOption({ name, value, checked, onChange, label, className = "" }) {
  return (
    <label
      className={`cabzii-radio-option ${checked ? "cabzii-radio-option-active" : ""} ${className}`.trim()}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="cabzii-radio-dot" aria-hidden />
      {typeof label === "string" ? <span className="min-w-0 flex-1">{label}</span> : label}
    </label>
  );
}

/** Styled checkbox row — filter sidebars. */
export function CheckboxOption({ checked, onChange, label, className = "" }) {
  return (
    <label
      className={`cabzii-checkbox-option ${checked ? "cabzii-checkbox-option-active" : ""} ${className}`.trim()}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="cabzii-checkbox-box" aria-hidden />
      <span className="min-w-0 flex-1">{label}</span>
    </label>
  );
}

/** Pill-style segmented radio — search widgets, trip options. */
export function SegmentedOption({ name, checked, onChange, label, className = "" }) {
  return (
    <label
      className={`cabzii-segmented-option ${checked ? "cabzii-segmented-option-active" : ""} ${className}`.trim()}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}
