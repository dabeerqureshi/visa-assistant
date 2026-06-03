import { z } from "zod";

// Enums
export type VisaCountry = "UK" | "Netherlands" | "USA";
export type VisaType = "visit" | "student" | "work";
export type CaseStatus = "draft" | "in_progress" | "ready_for_review" | "needs_changes" | "ready_to_submit" | "completed";
export type JobType = "salaried" | "business" | "student" | "unemployed" | "retired";
export type TravelHistory = "none" | "limited" | "moderate" | "extensive";
export type Purpose = "tourism" | "business" | "family_visit" | "medical" | "education";
export type DocumentCategory = "identity" | "financial" | "employment" | "travel" | "sponsorship" | "academic" | "medical" | "other";
export type DocumentStatus = "uploaded" | "missing" | "weak";
export type Severity = "info" | "warning" | "critical";
export type ReviewStatus = "pending" | "reviewed" | "approved" | "flagged" | "needs_changes";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type CourseLevel = "bachelors" | "masters" | "phd" | "diploma" | "foundation";
export type Qualification = "high_school" | "bachelors" | "masters" | "phd";
export type ChecklistAdminStatus = "pending" | "verified" | "needs_clarification" | "missing";

// Zod Schemas

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
  country: z.string().default("Pakistan"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

// ====== COMMON FIELDS ======
const commonFields = {
  country: z.enum(["UK", "Netherlands", "USA"]),
  visaType: z.enum(["visit", "student", "work"]),
  age: z.number().int().min(16).max(100).optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
  city: z.string().optional(),
  ownHouse: z.boolean().optional(),
  hasRentalProperties: z.boolean().optional(),
  hasBusinesses: z.boolean().optional(),
  jobType: z.enum(["salaried", "business", "student", "unemployed", "retired"]),
  income: z.number().optional(),
  bankBalance: z.number().optional(),
  bankStatementStatus: z.enum(["6_months", "3_months", "not_available"]).optional(),
  monthlyExpenses: z.number().optional(),
  travelHistory: z.enum(["none", "limited", "moderate", "extensive"]).optional(),
  purpose: z.enum(["tourism", "business", "family_visit", "medical", "education"]).optional(),
  previousVisaRejection: z.boolean().optional(),
  previousVisaRejectionReason: z.string().optional(),
  previousVisaRejectionCountry: z.string().optional(),
};

// ====== VISIT VISA SCHEMA ======
export const createVisitCaseSchema = z.object({
  ...commonFields,
  sponsorName: z.string().optional(),
  sponsorRelation: z.string().optional(),
  durationDays: z.number().int().min(1).max(90).optional(),
  travelInsurance: z.boolean().optional(),
  accommodationBooked: z.boolean().optional(),
  returnTicketBooked: z.boolean().optional(),
});

// ====== STUDENT VISA SCHEMA ======
export const createStudentCaseSchema = z.object({
  ...commonFields,
  universityName: z.string().min(1, "University name is required"),
  universityCountry: z.string().optional(),
  courseName: z.string().min(1, "Course name is required"),
  courseLevel: z.enum(["bachelors", "masters", "phd", "diploma", "foundation"]).optional(),
  previousEducation: z.string().optional(), // JSON string
  ieltsScore: z.number().min(0).max(9).optional(),
  toeflScore: z.number().min(0).max(120).optional(),
  hasAcceptanceLetter: z.boolean().optional(),
  tuitionFee: z.number().optional(),
  scholarshipAmount: z.number().optional(),
  financialSponsor: z.string().optional(),
  gapYears: z.number().int().min(0).optional(),
  hasStudentLoan: z.boolean().optional(),
  accommodationPlan: z.enum(["university_halls", "private_rental", "with_family"]).optional(),
});

// ====== WORK VISA SCHEMA ======
export const createWorkCaseSchema = z.object({
  ...commonFields,
  jobOfferCompany: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  contractDurationMonths: z.number().int().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  highestQualification: z.enum(["high_school", "bachelors", "masters", "phd"]).optional(),
  professionalCertifications: z.string().optional(),
  salaryOffered: z.number().optional(),
  hasWorkPermitSponsor: z.boolean().optional(),
  currentEmployer: z.string().optional(),
  noticePeriodDays: z.number().int().optional(),
});

// ====== UPDATE CASE SCHEMA ======
export const updateCaseSchema = z.object({
  status: z.enum(["draft", "in_progress", "ready_for_review", "needs_changes", "ready_to_submit", "completed"]).optional(),
  age: z.number().int().min(16).max(100).optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
  city: z.string().optional(),
  ownHouse: z.boolean().optional(),
  hasRentalProperties: z.boolean().optional(),
  hasBusinesses: z.boolean().optional(),
  jobType: z.enum(["salaried", "business", "student", "unemployed", "retired"]).optional(),
  income: z.number().optional(),
  bankBalance: z.number().optional(),
  bankStatementStatus: z.enum(["6_months", "3_months", "not_available"]).optional(),
  monthlyExpenses: z.number().optional(),
  travelHistory: z.enum(["none", "limited", "moderate", "extensive"]).optional(),
  purpose: z.enum(["tourism", "business", "family_visit", "medical", "education"]).optional(),
  previousVisaRejection: z.boolean().optional(),
  previousVisaRejectionReason: z.string().optional(),
  previousVisaRejectionCountry: z.string().optional(),
  // Visit
  sponsorName: z.string().optional(),
  sponsorRelation: z.string().optional(),
  durationDays: z.number().int().min(1).max(90).optional(),
  travelInsurance: z.boolean().optional(),
  accommodationBooked: z.boolean().optional(),
  returnTicketBooked: z.boolean().optional(),
  // Student
  universityName: z.string().optional(),
  universityCountry: z.string().optional(),
  courseName: z.string().optional(),
  courseLevel: z.enum(["bachelors", "masters", "phd", "diploma", "foundation"]).optional(),
  previousEducation: z.string().optional(),
  ieltsScore: z.number().min(0).max(9).optional(),
  toeflScore: z.number().min(0).max(120).optional(),
  hasAcceptanceLetter: z.boolean().optional(),
  tuitionFee: z.number().optional(),
  scholarshipAmount: z.number().optional(),
  financialSponsor: z.string().optional(),
  gapYears: z.number().int().min(0).optional(),
  hasStudentLoan: z.boolean().optional(),
  accommodationPlan: z.enum(["university_halls", "private_rental", "with_family"]).optional(),
  // Work
  jobOfferCompany: z.string().optional(),
  jobTitle: z.string().optional(),
  contractDurationMonths: z.number().int().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  highestQualification: z.enum(["high_school", "bachelors", "masters", "phd"]).optional(),
  professionalCertifications: z.string().optional(),
  salaryOffered: z.number().optional(),
  hasWorkPermitSponsor: z.boolean().optional(),
  currentEmployer: z.string().optional(),
  noticePeriodDays: z.number().int().optional(),
});

// ====== DOCUMENT CHECKLIST SCHEMA ======
export const createChecklistItemSchema = z.object({
  caseId: z.string(),
  documentKey: z.string(),
  documentName: z.string(),
  category: z.string(),
  hasDocument: z.boolean(),
  notes: z.string().optional(),
});

export const updateChecklistItemSchema = z.object({
  id: z.string(),
  hasDocument: z.boolean().optional(),
  notes: z.string().optional(),
});

export const adminChecklistReviewSchema = z.object({
  id: z.string(),
  adminStatus: z.enum(["pending", "verified", "needs_clarification", "missing"]),
  adminNotes: z.string().optional(),
});

// ====== ADMIN REVIEW ======
export const adminReviewSchema = z.object({
  caseId: z.string(),
  comment: z.string().min(1, "Comment is required"),
  suggestions: z.string().optional(),
  severity: z.enum(["info", "warning", "critical"]),
  status: z.enum(["pending", "reviewed", "approved", "flagged", "needs_changes"]),
  readyToSubmit: z.boolean().optional(),
});

// Types
export interface RequirementItem {
  documentKey: string;
  documentName: string;
  category: DocumentCategory;
  required: boolean;
  description?: string;
}

export interface RequirementsResult {
  required: RequirementItem[];
  optional: RequirementItem[];
}

export interface CostBreakdown {
  visaFee: number;
  insuranceCost: number;
  appointmentFee: number;
  documentPrepCost: number;
  totalMin: number;
  totalMax: number;
  currency: string;
}

export interface SupportingSuggestion {
  category: string;
  suggestion: string;
  reason: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  marks: string;
  grade: string;
}