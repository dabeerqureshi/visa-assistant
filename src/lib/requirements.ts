import { JobType, VisaCountry, RequirementItem, RequirementsResult } from "@/types"; 

// Comprehensive requirements mapping for all countries, visa types, and job types
const REQUIREMENTS_MAP: Record<string, Record<string, { required: Omit<RequirementItem, "required">[]; optional: Omit<RequirementItem, "required">[] }>> = {
  UK: {
    // ─── UK Standard Visitor Visa (Salaried) ───
    salaried: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (current + old passports)", category: "identity" },
        { documentKey: "online_visa_application", documentName: "Online Visa Application (completed + printed)", category: "travel" },
        { documentKey: "bank_statement", documentName: "Bank Statement (last 6 months — no sudden deposits)", category: "financial" },
        { documentKey: "salary_slips", documentName: "Salary Slips (last 3-6 months)", category: "employment" },
        { documentKey: "employment_letter", documentName: "Employment Letter (job title, salary, leave dates)", category: "employment" },
        { documentKey: "leave_approval", documentName: "Leave Approval / NOC Letter", category: "employment" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose, dates, funding, return plans)", category: "other" },
        { documentKey: "travel_insurance", documentName: "Travel Insurance (mandatory for Schengen/UK)", category: "travel" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation (not paid ticket)", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof (hotel booking or invitation)", category: "travel" },
      ],
      optional: [
        { documentKey: "tax_returns", documentName: "Tax Returns (last 2 years)", category: "financial" },
        { documentKey: "property_docs", documentName: "Property Documents (house/land)", category: "financial" },
        { documentKey: "sponsor_letter", documentName: "Sponsor Letter (if applicable)", category: "sponsorship" },
        { documentKey: "invitation_letter", documentName: "Invitation Letter (if visiting relatives)", category: "sponsorship" },
        { documentKey: "itinerary", documentName: "Day-by-Day Travel Itinerary", category: "travel" },
        { documentKey: "frc", documentName: "Family Registration Certificate", category: "identity" },
        { documentKey: "travel_history", documentName: "Old Passports with Travel History", category: "identity" },
      ],
    },
    // ─── UK Standard Visitor Visa (Business) ───
    business: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (current + old passports)", category: "identity" },
        { documentKey: "online_visa_application", documentName: "Online Visa Application (completed + printed)", category: "travel" },
        { documentKey: "bank_statement", documentName: "Bank Statement (last 6 months — no sudden deposits)", category: "financial" },
        { documentKey: "business_registration", documentName: "Business Registration Certificate (NTN/FBR)", category: "employment" },
        { documentKey: "tax_returns", documentName: "Tax Returns / Tax Filings", category: "financial" },
        { documentKey: "business_bank_statement", documentName: "Business Bank Statement (last 6 months)", category: "financial" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose, dates, funding, return plans)", category: "other" },
        { documentKey: "travel_insurance", documentName: "Travel Insurance", category: "travel" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof", category: "travel" },
      ],
      optional: [
        { documentKey: "client_reference_letters", documentName: "Client Reference Letters / Invoices", category: "employment" },
        { documentKey: "property_docs", documentName: "Property Documents", category: "financial" },
        { documentKey: "invitation_letter", documentName: "Invitation Letter from UK Business Partner", category: "sponsorship" },
        { documentKey: "company_id", documentName: "Company ID Card", category: "employment" },
        { documentKey: "frc", documentName: "Family Registration Certificate", category: "identity" },
      ],
    },
    // ─── UK Standard Visitor Visa (Student) ───
    student: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (current + old passports)", category: "identity" },
        { documentKey: "online_visa_application", documentName: "Online Visa Application (completed + printed)", category: "travel" },
        { documentKey: "bank_statement", documentName: "Sponsor/Parent Bank Statement (last 6 months)", category: "financial" },
        { documentKey: "enrollment_letter", documentName: "University/College Enrollment Letter", category: "academic" },
        { documentKey: "student_id", documentName: "Student ID Card", category: "academic" },
        { documentKey: "leave_letter", documentName: "University Leave Letter (if classes ongoing)", category: "academic" },
        { documentKey: "parent_consent", documentName: "Parent/Guardian Consent Letter", category: "sponsorship" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose, dates, funding, return plans)", category: "other" },
        { documentKey: "travel_insurance", documentName: "Travel Insurance", category: "travel" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof", category: "travel" },
      ],
      optional: [
        { documentKey: "parent_income_proof", documentName: "Parent Income Proof (salary/business)", category: "financial" },
        { documentKey: "property_docs", documentName: "Property Documents", category: "financial" },
        { documentKey: "sponsor_letter", documentName: "Sponsor Letter", category: "sponsorship" },
        { documentKey: "tax_returns", documentName: "Tax Returns (if available)", category: "financial" },
        { documentKey: "frc", documentName: "Family Registration Certificate", category: "identity" },
      ],
    },
  },
  Netherlands: {
    // ─── Netherlands Visit Visa (Schengen) — Salaried ───
    salaried: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (issued within 10 years, valid 3+ months after return, 2 blank pages)", category: "identity" },
        { documentKey: "old_passports", documentName: "Old Passports (travel history — strongly recommended)", category: "identity" },
        { documentKey: "visa_application_form", documentName: "Schengen Visa Application Form (printed + signed every page)", category: "travel" },
        { documentKey: "bank_statement", documentName: "Bank Statement (last 3-6 months — no sudden deposits, €55-70/day minimum)", category: "financial" },
        { documentKey: "salary_slips", documentName: "Salary Slips (last 3-6 months)", category: "employment" },
        { documentKey: "employment_letter", documentName: "Employment Letter (with salary, position, leave approval)", category: "employment" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose, dates, sponsor, accommodation, return reasons)", category: "other" },
        { documentKey: "travel_insurance", documentName: "Travel Insurance (minimum €30,000 coverage — mandatory Schengen)", category: "travel" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation (entry/exit dates, not paid ticket)", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof (hotel bookings OR invitation letter with host docs)", category: "travel" },
        { documentKey: "biometrics Appointment", documentName: "Biometrics / VFS Appointment Confirmation", category: "travel" },
      ],
      optional: [
        { documentKey: "tax_returns", documentName: "Tax Returns (if available)", category: "financial" },
        { documentKey: "property_docs", documentName: "Property Documents (house/land — proves return ties)", category: "financial" },
        { documentKey: "sponsor_letter", documentName: "Sponsor Letter (if applicable)", category: "sponsorship" },
        { documentKey: "invitation_letter", documentName: "Invitation Letter from Host in NL (with host passport, residence permit, address proof)", category: "sponsorship" },
        { documentKey: "itinerary", documentName: "Day-by-Day Travel Itinerary (7-21 days recommended for first-timers)", category: "travel" },
        { documentKey: "company_id", documentName: "Company ID Card", category: "employment" },
        { documentKey: "frc", documentName: "Family Registration Certificate (proves return ties)", category: "identity" },
        { documentKey: "marriage_cert", documentName: "Marriage Certificate / Children's Birth Certificate (return ties)", category: "identity" },
      ],
    },
    // ─── Netherlands Visit Visa (Schengen) — Business ───
    business: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (issued within 10 years, valid 3+ months after return, 2 blank pages)", category: "identity" },
        { documentKey: "old_passports", documentName: "Old Passports (travel history — strongly recommended)", category: "identity" },
        { documentKey: "visa_application_form", documentName: "Schengen Visa Application Form (printed + signed every page)", category: "travel" },
        { documentKey: "bank_statement", documentName: "Bank Statement (last 3-6 months — no sudden deposits, €55-70/day minimum)", category: "financial" },
        { documentKey: "business_registration", documentName: "Business Registration Certificate (NTN/FBR)", category: "employment" },
        { documentKey: "business_bank_statement", documentName: "Business Bank Statement (last 3-6 months)", category: "financial" },
        { documentKey: "tax_returns", documentName: "Tax Returns / Tax Filings", category: "financial" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose, dates, sponsor, accommodation, return reasons)", category: "other" },
        { documentKey: "travel_insurance", documentName: "Travel Insurance (minimum €30,000 coverage — mandatory Schengen)", category: "travel" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation (entry/exit dates)", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof (hotel bookings OR invitation letter)", category: "travel" },
        { documentKey: "biometrics Appointment", documentName: "Biometrics / VFS Appointment Confirmation", category: "travel" },
      ],
      optional: [
        { documentKey: "client_reference_letters", documentName: "Client Reference Letters / Contracts", category: "employment" },
        { documentKey: "property_docs", documentName: "Property Documents", category: "financial" },
        { documentKey: "invitation_letter", documentName: "Invitation Letter from EU Business Partner", category: "sponsorship" },
        { documentKey: "itinerary", documentName: "Day-by-Day Travel Itinerary", category: "travel" },
        { documentKey: "frc", documentName: "Family Registration Certificate", category: "identity" },
      ],
    },
    // ─── Netherlands Visit Visa (Schengen) — Student ───
    student: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (issued within 10 years, valid 3+ months after return, 2 blank pages)", category: "identity" },
        { documentKey: "old_passports", documentName: "Old Passports (travel history — strongly recommended)", category: "identity" },
        { documentKey: "visa_application_form", documentName: "Schengen Visa Application Form (printed + signed every page)", category: "travel" },
        { documentKey: "bank_statement", documentName: "Sponsor/Parent Bank Statement (last 3-6 months)", category: "financial" },
        { documentKey: "enrollment_letter", documentName: "University Enrollment Letter / Student ID", category: "academic" },
        { documentKey: "parent_consent", documentName: "Parent/Guardian Consent Letter", category: "sponsorship" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose, dates, funding, return plans)", category: "other" },
        { documentKey: "travel_insurance", documentName: "Travel Insurance (minimum €30,000 coverage — mandatory Schengen)", category: "travel" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof", category: "travel" },
        { documentKey: "biometrics Appointment", documentName: "Biometrics / VFS Appointment Confirmation", category: "travel" },
      ],
      optional: [
        { documentKey: "parent_income_proof", documentName: "Parent Income Proof (salary/business)", category: "financial" },
        { documentKey: "property_docs", documentName: "Property Documents", category: "financial" },
        { documentKey: "sponsor_letter", documentName: "Sponsor Letter", category: "sponsorship" },
        { documentKey: "tax_returns", documentName: "Tax Returns (if available)", category: "financial" },
        { documentKey: "frc", documentName: "Family Registration Certificate", category: "identity" },
        { documentKey: "travel_insurance", documentName: "Travel Insurance", category: "travel" },
      ],
    },
    // ─── Netherlands Student Visa (MVV + Residence Permit) — Long Stay ───
    "student-long": {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (full study duration recommended, 2 blank pages)", category: "identity" },
        { documentKey: "old_passports", documentName: "Old Passports (travel history — very strong if stamps exist)", category: "identity" },
        { documentKey: "admission_letter", documentName: "Unconditional Admission Letter from IND-recognized University", category: "academic" },
        { documentKey: "bank_statement", documentName: "Personal Bank Statement (last 3-6 months, stable balance, no sudden deposits)", category: "financial" },
        { documentKey: "tuition_proof", documentName: "Tuition Payment Proof / University Invoice", category: "financial" },
        { documentKey: "academic_transcripts", documentName: "Academic Documents (matric, intermediate, bachelor, transcripts)", category: "academic" },
        { documentKey: "english_test", documentName: "English Proficiency Test (IELTS Academic 6.0-6.5+ / PTE Academic)", category: "academic" },
        { documentKey: "sop", documentName: "Study Plan / Motivation Letter (SOP) — why NL, why course, career plan, return intention", category: "other" },
        { documentKey: "accommodation", documentName: "Accommodation Proof (university housing strongest, or rental agreement)", category: "travel" },
        { documentKey: "travel_insurance", documentName: "Travel Insurance (minimum €30,000 coverage)", category: "travel" },
        { documentKey: "antecedents_cert", documentName: "Antecedents Certificate (no criminal record declaration)", category: "other" },
      ],
      optional: [
        { documentKey: "sponsor_bank_statement", documentName: "Sponsor (Parent) Bank Statements (if funded by parents)", category: "financial" },
        { documentKey: "sponsor_income_proof", documentName: "Sponsor Income Proof (salary/business docs)", category: "financial" },
        { documentKey: "sponsorship_letter", documentName: "Sponsorship Letter from Parent", category: "sponsorship" },
        { documentKey: "sponsor_id", documentName: "Sponsor CNIC / ID Copies", category: "identity" },
        { documentKey: "relationship_proof", documentName: "Relationship Proof (FRC if possible)", category: "identity" },
        { documentKey: "tax_returns", documentName: "Tax Returns (if available)", category: "financial" },
        { documentKey: "property_docs", documentName: "Property Documents", category: "financial" },
        { documentKey: "tb_test", documentName: "TB Test Certificate (if required by university/country)", category: "medical" },
      ],
    },
  },
  USA: {
    // ─── USA Visit Visa (B1/B2) — Salaried ───
    salaried: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (valid 6+ months beyond intended stay)", category: "identity" },
        { documentKey: "old_passports", documentName: "Old Passports with Travel History", category: "identity" },
        { documentKey: "ds160_confirmation", documentName: "DS-160 Confirmation Page (with barcode)", category: "travel" },
        { documentKey: "visa_fee_receipt", documentName: "Visa Application Fee (MRV Fee) Receipt", category: "financial" },
        { documentKey: "visa_appointment", documentName: "Visa Interview Appointment Confirmation", category: "travel" },
        { documentKey: "passport_photo", documentName: "Passport-Size Photograph (2x2 inch, white background)", category: "identity" },
        { documentKey: "bank_statement", documentName: "Bank Statement (last 3-6 months — consistent balance, no sudden deposits)", category: "financial" },
        { documentKey: "salary_slips", documentName: "Salary Slips (last 3-6 months)", category: "employment" },
        { documentKey: "employment_letter", documentName: "Employment Letter / Employment Verification", category: "employment" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose of visit, duration, funding, return plans)", category: "other" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation (optional but recommended)", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof / Hotel Booking / Invitation", category: "travel" },
      ],
      optional: [
        { documentKey: "tax_returns", documentName: "Tax Returns (last 2 years)", category: "financial" },
        { documentKey: "property_docs", documentName: "Property Documents (strong ties to home country)", category: "financial" },
        { documentKey: "social_media", documentName: "Social Media Handles (DS-160 requirement)", category: "travel" },
        { documentKey: "invitation_letter", documentName: "Invitation Letter (if visiting family/friends)", category: "sponsorship" },
        { documentKey: "travel_history", documentName: "Proof of Previous International Travel (stamps/visas)", category: "identity" },
        { documentKey: "company_id", documentName: "Company ID Card", category: "employment" },
        { documentKey: "frc", documentName: "Family Registration Certificate (return ties)", category: "identity" },
      ],
    },
    // ─── USA Visit Visa (B1/B2) — Business ───
    business: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (valid 6+ months beyond intended stay)", category: "identity" },
        { documentKey: "old_passports", documentName: "Old Passports with Travel History", category: "identity" },
        { documentKey: "ds160_confirmation", documentName: "DS-160 Confirmation Page (with barcode)", category: "travel" },
        { documentKey: "visa_fee_receipt", documentName: "Visa Application Fee (MRV Fee) Receipt", category: "financial" },
        { documentKey: "visa_appointment", documentName: "Visa Interview Appointment Confirmation", category: "travel" },
        { documentKey: "passport_photo", documentName: "Passport-Size Photograph (2x2 inch, white background)", category: "identity" },
        { documentKey: "bank_statement", documentName: "Bank Statement (last 3-6 months)", category: "financial" },
        { documentKey: "business_registration", documentName: "Business Registration Certificate (NTN/FBR)", category: "employment" },
        { documentKey: "tax_returns", documentName: "Tax Returns (last 2 years)", category: "financial" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose, duration, funding, return plans)", category: "other" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof", category: "travel" },
      ],
      optional: [
        { documentKey: "client_contracts", documentName: "Client Contracts / Business Proof", category: "employment" },
        { documentKey: "property_docs", documentName: "Property Documents", category: "financial" },
        { documentKey: "invitation_letter", documentName: "Invitation Letter (if applicable)", category: "sponsorship" },
        { documentKey: "social_media", documentName: "Social Media Handles", category: "travel" },
        { documentKey: "frc", documentName: "Family Registration Certificate", category: "identity" },
      ],
    },
    // ─── USA Visit Visa (B1/B2) — Student ───
    student: {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (valid 6+ months beyond intended stay)", category: "identity" },
        { documentKey: "old_passports", documentName: "Old Passports with Travel History", category: "identity" },
        { documentKey: "ds160_confirmation", documentName: "DS-160 Confirmation Page (with barcode)", category: "travel" },
        { documentKey: "visa_fee_receipt", documentName: "Visa Application Fee (MRV Fee) Receipt", category: "financial" },
        { documentKey: "visa_appointment", documentName: "Visa Interview Appointment Confirmation", category: "travel" },
        { documentKey: "passport_photo", documentName: "Passport-Size Photograph (2x2 inch, white background)", category: "identity" },
        { documentKey: "bank_statement", documentName: "Sponsor/Parent Bank Statement (last 3-6 months)", category: "financial" },
        { documentKey: "enrollment_letter", documentName: "University Enrollment Letter / Student ID", category: "academic" },
        { documentKey: "parent_consent", documentName: "Parental Consent Letter", category: "sponsorship" },
        { documentKey: "cover_letter", documentName: "Cover Letter (purpose, duration, funding, return plans)", category: "other" },
        { documentKey: "flight_reservation", documentName: "Flight Reservation", category: "travel" },
        { documentKey: "accommodation", documentName: "Accommodation Proof", category: "travel" },
      ],
      optional: [
        { documentKey: "parent_income_proof", documentName: "Parent Income Proof", category: "financial" },
        { documentKey: "property_docs", documentName: "Property Documents", category: "financial" },
        { documentKey: "invitation_letter", documentName: "Invitation Letter (if applicable)", category: "sponsorship" },
        { documentKey: "tax_returns", documentName: "Tax Returns (if available)", category: "financial" },
        { documentKey: "frc", documentName: "Family Registration Certificate", category: "identity" },
      ],
    },
    // ─── USA Student Visa (F-1) — Long Stay ───
    "student-long": {
      required: [
        { documentKey: "passport", documentName: "Valid Passport (valid for at least 6 months beyond program end)", category: "identity" },
        { documentKey: "old_passports", documentName: "Old Passports with Travel History", category: "identity" },
        { documentKey: "form_i20", documentName: "Form I-20 (Certificate of Eligibility — issued by SEVP-certified school)", category: "academic" },
        { documentKey: "sevis_fee_receipt", documentName: "SEVIS I-901 Fee Payment Receipt ($350)", category: "financial" },
        { documentKey: "ds160_confirmation", documentName: "DS-160 Confirmation Page (with barcode)", category: "travel" },
        { documentKey: "visa_fee_receipt", documentName: "Visa Application Fee (MRV Fee) Receipt ($185)", category: "financial" },
        { documentKey: "visa_appointment", documentName: "Visa Interview Appointment Confirmation", category: "travel" },
        { documentKey: "passport_photo", documentName: "Passport-Size Photograph (2x2 inch, white background)", category: "identity" },
        { documentKey: "academic_transcripts", documentName: "Academic Documents (transcripts, diplomas, test scores)", category: "academic" },
        { documentKey: "english_test", documentName: "English Proficiency Test (IELTS/PTE/TOEFL)", category: "academic" },
        { documentKey: "bank_statement", documentName: "Financial Evidence (bank statements, sponsor letters, scholarship letters)", category: "financial" },
        { documentKey: "admission_letter", documentName: "School Admission / Acceptance Letter", category: "academic" },
        { documentKey: "cover_letter", documentName: "Cover Letter / Statement of Purpose (why US, why course, career plans, return intention)", category: "other" },
      ],
      optional: [
        { documentKey: "sponsor_bank_statement", documentName: "Sponsor (Parent) Bank Statements", category: "financial" },
        { documentKey: "sponsor_income_proof", documentName: "Sponsor Income Proof (salary/business)", category: "financial" },
        { documentKey: "scholarship_letter", documentName: "Scholarship Letter (if applicable)", category: "financial" },
        { documentKey: "tax_returns", documentName: "Tax Returns (if available)", category: "financial" },
        { documentKey: "property_docs", documentName: "Property Documents (ties to home country)", category: "financial" },
        { documentKey: "frc", documentName: "Family Registration Certificate", category: "identity" },
        { documentKey: "travel_history", documentName: "Proof of Previous International Travel", category: "identity" },
        { documentKey: "social_media", documentName: "Social Media Handles (DS-160 requirement)", category: "travel" },
      ],
    },
  },
};

export function getRequirements(country: VisaCountry, jobType: JobType, visaType?: string): RequirementsResult {
  const countryData = REQUIREMENTS_MAP[country];
  if (!countryData) {
    return { required: [], optional: [] };
  }

  // For student visa type, use the "student-long" key if available (for long-stay student visas)
  let lookupKey: string = jobType;
  if (jobType === "student" && visaType === "student" && countryData["student-long"]) {
    lookupKey = "student-long";
  }

  const jobData = countryData[lookupKey as keyof typeof countryData];
  if (!jobData) {
    // Fallback to salaried if job type not found
    const fallback = countryData["salaried"];
    if (fallback) {
      return {
        required: fallback.required.map((r) => ({ ...r, required: true })),
        optional: fallback.optional.map((r) => ({ ...r, required: false })),
      };
    }
    return { required: [], optional: [] };
  }

  return {
    required: jobData.required.map((r) => ({ ...r, required: true })),
    optional: jobData.optional.map((r) => ({ ...r, required: false })),
  };
}

export function getAllRequirements(country: VisaCountry, jobType: JobType, visaType?: string): RequirementItem[] {
  const result = getRequirements(country, jobType, visaType);
  return [...result.required, ...result.optional];
}

export function getMissingFlags(
  country: VisaCountry,
  jobType: JobType,
  balance: number,
  income: number
): string[] {
  const flags: string[] = [];

  // Financial flags
  if (country === "UK" && balance < 1000) {
    flags.push("Low bank balance for UK visa. Recommended minimum: £1,000+");
  }
  if (country === "Netherlands" && balance < 2000) {
    flags.push("Low bank balance for Netherlands/Schengen visa. Recommended minimum: €2,000+ (€55-70/day of trip)");
  }
  if (country === "USA" && balance < 3000) {
    flags.push("Low bank balance for US visa. Recommended minimum: $3,000+");
  }

  // Income flags
  if (income < 1000 && jobType === "salaried") {
    flags.push("Low monthly income may affect visa decision. Consider showing additional financial proof.");
  }

  // Netherlands-specific flags
  if (country === "Netherlands" && jobType === "business") {
    flags.push("Netherlands requires strong business documentation: NTN/FBR registration, business bank statements, tax filings.");
  }

  // USA-specific flags
  if (country === "USA") {
    flags.push("USA visa requires an in-person interview. Prepare for questions about ties to home country.");
  }

  // UK-specific flags
  if (country === "UK") {
    flags.push("UK visa officers look for strong ties to home country and clear return intent.");
  }

  return flags;
}

// ====== DYNAMIC CHECKLIST GENERATION ======

export interface ProfileContext {
  jobType?: string;
  income?: number;
  bankBalance?: number;
  travelHistory?: string;
  previousVisaRejection?: boolean;
  ownHouse?: boolean;
  hasRentalProperties?: boolean;
  hasBusinesses?: boolean;
  hasAcceptanceLetter?: boolean;
  courseLevel?: string;
  ieltsScore?: number;
  universityName?: string;
  jobOfferCompany?: string;
}

export interface ChecklistItem {
  documentKey: string;
  documentName: string;
  category: string;
}

export function generateChecklist(country: string, visaType: string, profile: ProfileContext): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // ====== BASE DOCUMENTS (ALL TYPES) ======
  items.push(
    { documentKey: "passport", documentName: "Valid Passport", category: "identity" },
    { documentKey: "passport_photo", documentName: "Passport-Size Photograph", category: "identity" },
    { documentKey: "bank_statement", documentName: "Bank Statement (last 6 months)", category: "financial" },
  );

  // ====== JOB TYPE SPECIFIC ======
  if (profile.jobType === "salaried") {
    items.push(
      { documentKey: "salary_slips", documentName: "Salary Slips (last 3-6 months)", category: "employment" },
      { documentKey: "employment_letter", documentName: "Employment Letter/Verification", category: "employment" },
      { documentKey: "leave_approval", documentName: "Leave Approval / NOC Letter", category: "employment" },
    );
    if (profile.income && profile.income < 1500) {
      items.push({ documentKey: "tax_returns", documentName: "Tax Returns (last 2 years)", category: "financial" });
    }
  } else if (profile.jobType === "business") {
    items.push(
      { documentKey: "business_registration", documentName: "Business Registration Certificate", category: "employment" },
      { documentKey: "business_bank_statement", documentName: "Business Bank Statement", category: "financial" },
      { documentKey: "tax_returns", documentName: "Tax Returns / Filings", category: "financial" },
    );
  } else if (profile.jobType === "student" && visaType === "visit") {
    items.push(
      { documentKey: "enrollment_letter", documentName: "University Enrollment Letter", category: "academic" },
      { documentKey: "student_id", documentName: "Student ID Card", category: "academic" },
    );
  }

  // ====== PROPERTY & ASSETS ======
  if (profile.ownHouse) {
    items.push({ documentKey: "property_deed", documentName: "Property Deed / House Documents", category: "financial" });
  }
  if (profile.hasRentalProperties) {
    items.push({ documentKey: "rental_income_proof", documentName: "Rental Income Proof / Agreements", category: "financial" });
  }
  if (profile.hasBusinesses) {
    items.push({ documentKey: "business_registration_docs", documentName: "Business Registration Documents", category: "employment" });
  }

  // ====== TRAVEL ======
  items.push(
    { documentKey: "flight_reservation", documentName: "Flight Reservation", category: "travel" },
    { documentKey: "accommodation", documentName: "Accommodation Proof", category: "travel" },
    { documentKey: "travel_insurance", documentName: "Travel Insurance", category: "travel" },
  );

  // ====== PREVIOUS VISA REJECTION ======
  if (profile.previousVisaRejection) {
    items.push({
      documentKey: "rejection_explanation",
      documentName: "Visa Rejection Explanation Letter / Cover Letter",
      category: "other",
    });
  }

  // ====== VISA TYPE SPECIFIC ======

  // Visit Visa
  if (visaType === "visit") {
    items.push(
      { documentKey: "cover_letter", documentName: "Cover Letter (purpose, dates, return plans)", category: "other" },
      { documentKey: "travel_itinerary", documentName: "Travel Itinerary / Day-by-Day Plan", category: "travel" },
    );
  }

  // Student Visa (long stay / academic)
  if (visaType === "student") {
    items.push(
      { documentKey: "admission_letter", documentName: "University Admission/Acceptance Letter", category: "academic" },
      { documentKey: "academic_transcripts", documentName: "Academic Transcripts & Certificates", category: "academic" },
      { documentKey: "study_plan_sop", documentName: "Study Plan / Statement of Purpose", category: "other" },
      { documentKey: "english_test", documentName: "English Proficiency Test (IELTS/TOEFL)", category: "academic" },
      { documentKey: "tuition_fee_proof", documentName: "Tuition Fee Payment Proof", category: "financial" },
    );

    if (profile.courseLevel === "phd" || profile.courseLevel === "masters") {
      items.push(
        { documentKey: "research_proposal", documentName: "Research Proposal / Thesis Outline", category: "academic" },
        { documentKey: "supervisor_letter", documentName: "Supervisor Acceptance Letter", category: "academic" },
      );
    }

    items.push({ documentKey: "gap_explanation", documentName: "Gap Year Explanation (if applicable)", category: "other" });
    items.push({ documentKey: "financial_sponsorship", documentName: "Financial Sponsorship Proof", category: "financial" });
    items.push({ documentKey: "accommodation_plan", documentName: "Accommodation Plan (halls/rental/family)", category: "travel" });
  }

  // Work Visa
  if (visaType === "work") {
    items.push(
      { documentKey: "job_offer_letter", documentName: "Job Offer Letter / Contract", category: "employment" },
      { documentKey: "experience_certificates", documentName: "Work Experience Certificates", category: "employment" },
      { documentKey: "professional_certifications", documentName: "Professional Certifications", category: "employment" },
      { documentKey: "qualification_docs", documentName: "Highest Qualification Documents", category: "academic" },
      { documentKey: "cv_resume", documentName: "CV / Resume", category: "other" },
    );
    if (profile.jobOfferCompany) {
      items.push({ documentKey: "work_permit_sponsorship", documentName: "Work Permit Sponsorship Documents", category: "employment" });
    }
  }

  return items;
}

export function getSupportingSuggestions(
  country: VisaCountry,
  jobType: JobType,
  travelHistory: string,
  income: number,
  balance: number
): { category: string; suggestion: string; reason: string }[] {
  const suggestions: { category: string; suggestion: string; reason: string }[] = [];

  // Low travel history
  if (travelHistory === "none" || travelHistory === "limited") {
    suggestions.push({
      category: "Travel History",
      suggestion: "Invitation Letter & Strong Itinerary",
      reason: "Limited travel history can raise doubts. An invitation letter from a host or a detailed day-by-day itinerary can strengthen your application.",
    });
    suggestions.push({
      category: "Travel History",
      suggestion: "Property Documents & Family Ties",
      reason: "Showing strong ties to home country (property, family, business) can compensate for lack of travel history.",
    });
  }

  // Low income for salaried
  if (jobType === "salaried" && income < 1500) {
    suggestions.push({
      category: "Financial",
      suggestion: "Additional Salary Slips & Tax Returns",
      reason: "Low salary can be offset by showing consistent income history and tax compliance.",
    });
    suggestions.push({
      category: "Financial",
      suggestion: "Strong Employer Letter",
      reason: "A detailed employer letter confirming your position, salary, and approved leave can help.",
    });
  }

  // Low balance
  if (balance < 3000) {
    suggestions.push({
      category: "Financial",
      suggestion: "Sponsor Letter + Sponsor Documents",
      reason: "If your own funds are limited, a sponsor (family member) can cover your expenses. Include their bank statements and relationship proof.",
    });
  }

  // Business-specific
  if (jobType === "business") {
    suggestions.push({
      category: "Business",
      suggestion: "Business Tax Returns & Bank Statements",
      reason: "Self-employed applicants benefit from showing 2+ years of tax returns and business bank statements.",
    });
  }

  // Country-specific suggestions
  if (country === "Netherlands") {
    suggestions.push({
      category: "Cover Letter",
      suggestion: "Detailed Cover Letter",
      reason: "For Schengen visas, a strong cover letter explaining purpose, dates, accommodation, and return reasons is critical for approval.",
    });
  }

  if (country === "USA") {
    suggestions.push({
      category: "Ties to Home",
      suggestion: "Proof of Strong Ties to Home Country",
      reason: "US visa officers focus heavily on whether you will return. Show property, job, family, and ongoing education.",
    });
  }

  if (country === "UK") {
    suggestions.push({
      category: "Financial",
      suggestion: "6 Months of Clean Bank Statements",
      reason: "UKVI specifically states financial documents should demonstrate the source and availability of funds. Avoid unexplained large deposits.",
    });
  }

  return suggestions;
}