import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (!adminToken || !verifyAdminToken(adminToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cases = await prisma.visaCase.findMany({
    include: {
      user: { select: { id: true, email: true, name: true, country: true } },
      documents: true,
      adminReview: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ cases });
}