import Link from "next/link";

const PATH_RE = /(\/(?:cabs|drivers|holidays|testimonials|locations|blogs|flights|hotels|trains|buses|cancellation-policy|terms-and-conditions)(?:\/[^\s]*)?)/gi;

/** Render assistant text with clickable internal paths. */
export default function ChatMessageContent({ content, isUser = false }) {
  const text = String(content || "");
  const parts = text.split(PATH_RE);

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(/^\/(?:cabs|drivers|holidays|testimonials|locations|blogs|flights|hotels|trains|buses|cancellation-policy|terms-and-conditions)/i)) {
          const href = part.split(/[\s\n]/)[0];
          return (
            <Link
              key={`${href}-${i}`}
              href={href}
              className={`font-semibold underline ${isUser ? "text-white" : "text-[var(--cabzii-brand)]"}`}
            >
              {href}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
