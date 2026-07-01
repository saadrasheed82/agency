import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";

  if (!verifyCredentials(username, password)) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      { error: "ACCESS_DENIED: invalid credentials." },
      { status: 401 }
    );
  }

  await createSession();
  return NextResponse.json({
    ok: true,
    message: "AUTH_OK: session established.",
  });
}
