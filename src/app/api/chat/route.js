import { NextResponse } from "next/server";
import { generateChatReply } from "../../../lib/chatbot/respond";
import { checkRateLimit, getClientIp } from "../../../lib/chatbot/rateLimit";
import { isValidIndianMobile, normalizeIndianMobile } from "../../../lib/chatbot/session";

const MAX_MESSAGE_LEN = 500;
const MAX_HISTORY = 12;

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`chat:${ip}`, { limit: 40, windowMs: 60_000 });
    if (!limit.ok) {
      return NextResponse.json({ error: "Too many messages. Please wait a moment." }, { status: 429 });
    }

    const body = await request.json();
    const message = String(body.message || "").trim().slice(0, MAX_MESSAGE_LEN);
    const name = String(body.name || "Guest").trim().slice(0, 80);
    const mobile = normalizeIndianMobile(body.mobile);

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (mobile && !isValidIndianMobile(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });
    }

    const history = Array.isArray(body.history)
      ? body.history.slice(-MAX_HISTORY).map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: String(m.content || m.reply || "").slice(0, MAX_MESSAGE_LEN)
        }))
      : [];

    const result = generateChatReply(message, { name, history });

    return NextResponse.json({
      reply: result.reply,
      suggestions: result.suggestions || []
    });
  } catch (err) {
    console.error("[chat]", err);
    return NextResponse.json({ error: "Unable to process your message." }, { status: 500 });
  }
}
