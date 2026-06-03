import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateChecklist } from "@/lib/requirements";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const cases = await prisma.visaCase.findMany({
    where: { userId: user.id },
    include: {
      documents: true,
      checklist: true,
      adminReview: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ cases });
}

function toFloat(v: any): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = parseFloat(String(v));
  return isNaN(n) ? null : n;
}

function toInt(v: any): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = parseInt(String(v), 10);
  return isNaN(n) ? null : n;
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Basic validation
    if (!body.country || !body.visaType || !body.jobType) {
      return NextResponse.json({ error: "Missing required fields: country, visaType, jobType" }, { status: 400 });
    }

    const d: Record<string, any> = { ...body };

    const visaCase = await prisma.visaCase.create({
      data: {
        userId: user.id,
        country: d.country,
        visaType: d.visaType,
        jobType: d.jobType ?? null,
        age: toInt(d.age),
        maritalStatus: d.maritalStatus ?? null,
        city: d.city ?? null,
        ownHouse: d.ownHouse ?? null,
        hasRentalProperties: d.hasRentalProperties ?? null,
        hasBusinesses: d.hasBusinesses ?? null,
        income: toFloat(d.income),
        bankBalance: toFloat(d.bankBalance),
        bankStatementStatus: d.bankStatementStatus ?? null,
        monthlyExpenses: toFloat(d.monthlyExpenses),
        travelHistory: d.travelHistory ?? null,
        purpose: d.purpose ?? null,
        previousVisaRejection: d.previousVisaRejection ?? null,
        previousVisaRejectionReason: d.previousVisaRejectionReason ?? null,
        previousVisaRejectionCountry: d.previousVisaRejectionCountry ?? null,
        // Visit specific
        sponsorName: d.sponsorName ?? null,
        sponsorRelation: d.sponsorRelation ?? null,
        durationDays: toInt(d.durationDays),
        travelInsurance: d.travelInsurance ?? null,
        accommodationBooked: d.accommodationBooked ?? null,
        returnTicketBooked: d.returnTicketBooked ?? null,
        // Student specific
        universityName: d.universityName ?? null,
        universityCountry: d.universityCountry ?? null,
        courseName: d.courseName ?? null,
        courseLevel: d.courseLevel ?? null,
        previousEducation: d.previousEducation ?? null,
        ieltsScore: toFloat(d.ieltsScore),
        toeflScore: toInt(d.toeflScore),
        hasAcceptanceLetter: d.hasAcceptanceLetter ?? null,
        tuitionFee: toFloat(d.tuitionFee),
        scholarshipAmount: toFloat(d.scholarshipAmount),
        financialSponsor: d.financialSponsor ?? null,
        gapYears: toInt(d.gapYears),
        hasStudentLoan: d.hasStudentLoan ?? null,
        accommodationPlan: d.accommodationPlan ?? null,
        // Work specific
        jobOfferCompany: d.jobOfferCompany ?? null,
        jobTitle: d.jobTitle ?? null,
        contractDurationMonths: toInt(d.contractDurationMonths),
        yearsOfExperience: toInt(d.yearsOfExperience),
        highestQualification: d.highestQualification ?? null,
        professionalCertifications: d.professionalCertifications ?? null,
        salaryOffered: toFloat(d.salaryOffered),
        hasWorkPermitSponsor: d.hasWorkPermitSponsor ?? null,
        currentEmployer: d.currentEmployer ?? null,
        noticePeriodDays: toInt(d.noticePeriodDays),
        status: "draft",
      },
    });

    // Generate and create checklist items based on profile
    const checklistItems = generateChecklist(d.country, d.visaType, {
      jobType: d.jobType,
      income: toFloat(d.income) ?? undefined,
      bankBalance: toFloat(d.bankBalance) ?? undefined,
      travelHistory: d.travelHistory,
      previousVisaRejection: d.previousVisaRejection,
      ownHouse: d.ownHouse,
      hasRentalProperties: d.hasRentalProperties,
      hasBusinesses: d.hasBusinesses,
      hasAcceptanceLetter: d.hasAcceptanceLetter,
      courseLevel: d.courseLevel,
      ieltsScore: toFloat(d.ieltsScore) ?? undefined,
      universityName: d.universityName,
      jobOfferCompany: d.jobOfferCompany,
    });

    if (checklistItems.length > 0) {
      await prisma.documentChecklist.createMany({
        data: checklistItems.map((item: { documentKey: string; documentName: string; category: string }) => ({
          caseId: visaCase.id,
          documentKey: item.documentKey,
          documentName: item.documentName,
          category: item.category,
          hasDocument: false,
        })),
      });
    }

    return NextResponse.json({ case: visaCase }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create case" }, { status: 500 });
  }
}