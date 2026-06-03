import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
import { cookies } from "next/headers";

// User updates their checklist (hasDocument, notes)
export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, hasDocument, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing checklist item id" }, { status: 400 });
    }

    // Verify the checklist item belongs to this user's case
    const item = await prisma.documentChecklist.findUnique({
      where: { id },
      include: { case: { select: { userId: true } } },
    });

    if (!item || item.case.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (hasDocument !== undefined) updateData.hasDocument = hasDocument;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.documentChecklist.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update" }, { status: 500 });
  }
}

// Admin reviews checklist items
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (!adminToken || !verifyAdminToken(adminToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, adminStatus, adminNotes } = body;

    if (!id || !adminStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await prisma.documentChecklist.update({
      where: { id },
      data: { adminStatus, adminNotes: adminNotes || null },
    });

    return NextResponse.json({ item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update" }, { status: 500 });
  }
}