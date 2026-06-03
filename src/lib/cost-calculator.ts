import { CostBreakdown, VisaCountry } from "@/types";

const COST_MAP: Record<VisaCountry, CostBreakdown> = {
  UK: {
    visaFee: 148,
    insuranceCost: 25,
    appointmentFee: 0,
    documentPrepCost: 0,
    totalMin: 148,
    totalMax: 200,
    currency: "USD",
  },
  Netherlands: {
    visaFee: 87,
    insuranceCost: 30,
    appointmentFee: 0,
    documentPrepCost: 0,
    totalMin: 87,
    totalMax: 150,
    currency: "USD",
  },
  USA: {
    visaFee: 185,
    insuranceCost: 30,
    appointmentFee: 0,
    documentPrepCost: 0,
    totalMin: 185,
    totalMax: 250,
    currency: "USD",
  },
};

const STUDENT_COST_MAP: Record<VisaCountry, CostBreakdown> = {
  UK: {
    visaFee: 714,
    insuranceCost: 992,
    appointmentFee: 0,
    documentPrepCost: 0,
    totalMin: 1706,
    totalMax: 2700,
    currency: "USD",
  },
  Netherlands: {
    visaFee: 220,
    insuranceCost: 150,
    appointmentFee: 0,
    documentPrepCost: 0,
    totalMin: 370,
    totalMax: 500,
    currency: "USD",
  },
  USA: {
    visaFee: 535,
    insuranceCost: 30,
    appointmentFee: 0,
    documentPrepCost: 0,
    totalMin: 565,
    totalMax: 650,
    currency: "USD",
  },
};

export function getCostBreakdown(country: VisaCountry, visaType?: string): CostBreakdown {
  if (visaType === "student") {
    const studentBase = STUDENT_COST_MAP[country];
    if (studentBase) return studentBase;
  }
  const base = COST_MAP[country];
  if (!base) {
    return { visaFee: 0, insuranceCost: 0, appointmentFee: 0, documentPrepCost: 0, totalMin: 0, totalMax: 0, currency: "USD" };
  }
  return base;
}