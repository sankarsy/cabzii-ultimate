import { AI_SEO_TASKS, runAiSeoTask } from "../../../../lib/aiSeo";

export const runtime = "nodejs";
export const maxDuration = 120;

async function assertAdmin(req) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ") || auth.length < 20) {
    return { ok: false, status: 401, message: "Admin authentication required" };
  }
  // Lightweight check — full role validation happens on backend for catalog writes
  return { ok: true };
}

export async function POST(req, { params }) {
  try {
    const auth = await assertAdmin(req);
    if (!auth.ok) {
      return Response.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const task = String(params?.task || "").trim();
    if (!AI_SEO_TASKS.includes(task)) {
      return Response.json(
        { success: false, message: `Unknown task. Allowed: ${AI_SEO_TASKS.join(", ")}` },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const data = await runAiSeoTask(task, body || {});

    return Response.json({
      success: true,
      task,
      data,
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim())
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error?.message || "AI SEO generation failed",
        openaiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim())
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    success: true,
    tasks: AI_SEO_TASKS,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
    model: process.env.OPENAI_SEO_MODEL || "gpt-4o-mini"
  });
}
