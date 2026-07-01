import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { isPromptCategory, PROMPT_CATEGORIES } from "@/lib/prompts";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.prompt.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "UNAUTHORIZED: admin session required." },
      { status: 401 }
    );
  }

  let body: {
    title?: string;
    description?: string;
    payload?: string;
    category?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const payload = body.payload ?? "";
  const category = (body.category ?? "").trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 422 });
  }
  if (!description) {
    return NextResponse.json(
      { error: "Short description is required." },
      { status: 422 }
    );
  }
  if (!payload.trim()) {
    return NextResponse.json(
      { error: "Raw prompt payload is required." },
      { status: 422 }
    );
  }
  if (!isPromptCategory(category)) {
    return NextResponse.json(
      { error: `Category must be one of: ${PROMPT_CATEGORIES.join(", ")}.` },
      { status: 422 }
    );
  }

  const created = await db.prompt.create({
    data: { title, description, payload, category },
  });

  return NextResponse.json(created, { status: 201 });
}
