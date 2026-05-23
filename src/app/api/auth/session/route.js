import { NextResponse } from "next/server";

const COOKIE_NAME = "cabzii_token";
const MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(req) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ success: false, message: "Token required" }, { status: 400 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
