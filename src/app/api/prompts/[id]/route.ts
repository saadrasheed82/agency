import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "UNAUTHORIZED: admin session required." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await db.prompt.delete({ where: { id } });
  } catch {
    return NextResponse.json(
      { error: "Prompt not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
