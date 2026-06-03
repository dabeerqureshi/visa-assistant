import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateCaseSchema } from "@/types";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const visaCase = await prisma.visaCase.findFirst({
    where: { id, userId: user.id },
    include: {
      documents: true,
      checklist: true,
      adminReview: true,
    },
  });

  if (!visaCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  return NextResponse.json({ case: visaCase });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.visaCase.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = await prisma.visaCase.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ case: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update case" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.visaCase.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const validation = updateCaseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const updated = await prisma.visaCase.update({
      where: { id },
      data: {
        ...validation.data,
        status: existing.status === "draft" ? "in_progress" : existing.status,
      },
    });

    return NextResponse.json({ case: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update case" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.visaCase.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  await prisma.visaCase.delete({ where: { id } });
  return NextResponse.json({ success: true });
}