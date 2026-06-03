import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequirements, getMissingFlags, getSupportingSuggestions } from "@/lib/requirements";
import { getCostBreakdown } from "@/lib/cost-calculator";
import { VisaCountry, JobType } from "@/types";

export async function GET(request: NextRequest, { params }: { params: Promise<{ caseId: string }> }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { caseId } = await params;
  const visaCase = await prisma.visaCase.findFirst({
    where: { id: caseId, userId: user.id },
    include: {
      user: { select: { name: true, email: true, country: true } },
      documents: true,
      adminReview: true,
    },
  });

  if (!visaCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const reqs = getRequirements(visaCase.country as VisaCountry, visaCase.jobType as JobType, visaCase.visaType || undefined);
  const uploadedDocKeys = visaCase.documents.map((d) => d.type);
  const missingDocs = reqs.required.filter((r) => !uploadedDocKeys.includes(r.documentKey));
  const uploadedDocs = reqs.required.filter((r) => uploadedDocKeys.includes(r.documentKey));
  const flags = getMissingFlags(
    visaCase.country as VisaCountry,
    visaCase.jobType as JobType,
    visaCase.bankBalance ?? 0,
    visaCase.income ?? 0
  );
  const suggestions = getSupportingSuggestions(
    visaCase.country as VisaCountry,
    visaCase.jobType as JobType,
    visaCase.travelHistory ?? "none",
    visaCase.income ?? 0,
    visaCase.bankBalance ?? 0
  );
  const costs = getCostBreakdown(visaCase.country as VisaCountry, visaCase.visaType || undefined);

  const report = {
    generatedAt: new Date().toISOString(),
    user: visaCase.user,
    case: {
      id: visaCase.id,
      country: visaCase.country,
      visaType: visaCase.visaType,
      jobType: visaCase.jobType,
      status: visaCase.status,
      income: visaCase.income,
      bankBalance: visaCase.bankBalance,
      travelHistory: visaCase.travelHistory,
      purpose: visaCase.purpose,
      durationDays: visaCase.durationDays,
    },
    adminReview: visaCase.adminReview,
    checklist: reqs,
    uploadedDocuments: visaCase.documents,
    missingDocuments: missingDocs,
    riskFlags: flags,
    improvementSuggestions: suggestions,
    costBreakdown: costs,
  };

  return NextResponse.json({ report });
}