/**
 * Uniform page content width — matches header, footer, hero, and all sections.
 * Uses `.section-shell` (max 80rem / 1280px — same as header).
 */
export default function PageShell({ children, className = "", as: Tag = "div", ...rest }) {
  const cls = ["section-shell", className].filter(Boolean).join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
