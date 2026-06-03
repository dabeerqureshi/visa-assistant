import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ caseId: string }> }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { caseId } = await params;
  const visaCase = await prisma.visaCase.findFirst({
    where: { id: caseId, userId: user.id },
  });

  if (!visaCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const documents = await prisma.document.findMany({
    where: { caseId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ documents });
}