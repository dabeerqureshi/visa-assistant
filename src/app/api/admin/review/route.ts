import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminReviewSchema } from "@/types";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (!adminToken || !verifyAdminToken(adminToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = adminReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { caseId, comment, suggestions, severity, status, readyToSubmit } = validation.data;

    const review = await prisma.adminReview.upsert({
      where: { caseId },
      update: {
        comment,
        suggestions: suggestions || null,
        severity,
        status,
        readyToSubmit: readyToSubmit ?? false,
      },
      create: {
        caseId,
        comment,
        suggestions: suggestions || null,
        severity,
        status,
        readyToSubmit: readyToSubmit ?? false,
      },
    });

    // Update case status based on review
    let caseStatus = "in_progress";

    if (readyToSubmit) {
      caseStatus = "ready_to_submit";
    } else if (status === "approved") {
      caseStatus = "completed";
    } else if (status === "flagged" || status === "needs_changes") {
      caseStatus = "needs_changes";
    } else {
      caseStatus = "in_progress";
    }

    await prisma.visaCase.update({
      where: { id: caseId },
      data: { status: caseStatus },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}