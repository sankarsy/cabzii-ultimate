import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "../../../../lib/chatbot/rateLimit";
import { isValidIndianMobile, normalizeIndianMobile } from "../../../../lib/chatbot/session";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`lead:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
    if (!limit.ok) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim().slice(0, 80);
    const mobile = normalizeIndianMobile(body.mobile);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!isValidIndianMobile(mobile)) {
      return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
    }

    const backendRes = await fetch(`${BACKEND_URL.replace(/\/$/, "")}/api/v1/chat-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobile, source: "zii-chatbot" })
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text().catch(() => "");
      console.error("[chat/lead] backend error", backendRes.status, errText.slice(0, 200));
      return NextResponse.json({ error: "Could not save your details. Please try again." }, { status: 502 });
    }

    const json = await backendRes.json();
    return NextResponse.json({ ok: true, name, mobile, id: json?.data?.id });
  } catch (err) {
    console.error("[chat/lead]", err);
    return NextResponse.json({ error: "Unable to save details." }, { status: 500 });
  }
}
