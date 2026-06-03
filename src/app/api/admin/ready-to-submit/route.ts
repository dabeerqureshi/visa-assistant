import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
    const { caseId, readyToSubmit } = body;

    if (!caseId || typeof readyToSubmit !== "boolean") {
      return NextResponse.json(
        { error: "caseId and readyToSubmit (boolean) are required" },
        { status: 400 }
      );
    }

    // Update the admin review with readyToSubmit status
    const review = await prisma.adminReview.upsert({
      where: { caseId },
      update: { readyToSubmit },
      create: {
        caseId,
        comment: readyToSubmit
          ? "Application reviewed and approved. Ready to submit."
          : "Application review updated.",
        status: readyToSubmit ? "approved" : "reviewed",
        readyToSubmit,
      },
    });

    // Update case status based on readyToSubmit
    if (readyToSubmit) {
      await prisma.visaCase.update({
        where: { id: caseId },
        data: { status: "ready_to_submit" },
      });
    } else {
      await prisma.visaCase.update({
        where: { id: caseId },
        data: { status: "needs_changes" },
      });
    }

    return NextResponse.json({ review, readyToSubmit });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update ready-to-submit status" },
      { status: 500 }
    );
  }
}