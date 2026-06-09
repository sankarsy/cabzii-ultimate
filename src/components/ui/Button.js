import Link from "next/link";

const VARIANTS = {
  primary: "cabzii-btn cabzii-btn-primary",
  secondary: "cabzii-btn cabzii-btn-secondary",
  ghost: "cabzii-btn cabzii-btn-ghost",
  whatsapp: "cabzii-btn cabzii-btn-whatsapp"
};

const SIZES = {
  sm: "cabzii-btn-sm",
  md: "",
  lg: "cabzii-btn-lg"
};

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const cls = `${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || ""} ${className}`.trim();
  const isDisabled = disabled || loading;

  const content = (
    <>
      {loading ? <Spinner /> : null}
      <span>{children}</span>
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={cls} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={isDisabled} className={cls} {...props}>
      {content}
    </button>
  );
}
