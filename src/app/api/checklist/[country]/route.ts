import { NextRequest, NextResponse } from "next/server";
import { getRequirements, getMissingFlags, getSupportingSuggestions } from "@/lib/requirements";
import { getCostBreakdown } from "@/lib/cost-calculator";
import { JobType, VisaCountry } from "@/types";

export async function GET(request: NextRequest, { params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const searchParams = request.nextUrl.searchParams;
  const jobType = searchParams.get("jobType") as JobType | null;
  const visaType = searchParams.get("visaType") || "visit";
  const balance = parseFloat(searchParams.get("balance") || "0");
  const income = parseFloat(searchParams.get("income") || "0");
  const travelHistory = searchParams.get("travelHistory") || "none";

  const countryUpper = country.toUpperCase() as VisaCountry;

  if (!["UK", "Netherlands", "USA"].includes(countryUpper)) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }

  if (!jobType || !["salaried", "business", "student"].includes(jobType)) {
    return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
  }

  const requirements = getRequirements(countryUpper, jobType, visaType);
  const flags = getMissingFlags(countryUpper, jobType, balance, income);
  const suggestions = getSupportingSuggestions(countryUpper, jobType, travelHistory, income, balance);
  const costs = getCostBreakdown(countryUpper, visaType);

  return NextResponse.json({
    country: countryUpper,
    jobType,
    visaType,
    requirements,
    flags,
    suggestions,
    costs,
  });
}
