"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "country" | "visaType" | "personal" | "financial" | "travel" | "visitDetails" | "studentDetails" | "workDetails" | "review";

const EXCHANGE_RATES: Record<string, number> = {
  UK: 370,        // 1 GBP = 370 PKR
  Netherlands: 330, // 1 EUR = 330 PKR
  USA: 280,       // 1 USD = 280 PKR
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  UK: "£",
  Netherlands: "€",
  USA: "$",
};

const CURRENCY_CODES: Record<string, string> = {
  UK: "GBP",
  Netherlands: "EUR",
  USA: "USD",
};

function convertToForeign(pkr: number, country: string): string {
  const rate = EXCHANGE_RATES[country];
  if (!rate || !pkr) return "";
  const converted = pkr / rate;
  const sym = CURRENCY_SYMBOLS[country] || "$";
  return `${sym}${converted.toFixed(2)} ${CURRENCY_CODES[country] || ""}`;
}

export default function NewCasePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<Step>("country");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Record<string, any>>({
    country: "",
    visaType: "visit",
    age: "",
    maritalStatus: "",
    city: "",
    ownHouse: false,
    hasRentalProperties: false,
    hasBusinesses: false,
    previousVisaRejection: false,
    previousVisaRejectionReason: "",
    previousVisaRejectionCountry: "",
    jobType: "",
    income: "",        // PKR
    bankBalance: "",   // PKR
    bankStatementStatus: "",
    monthlyExpenses: "",
    travelHistory: "none",
    purpose: "tourism",
    durationDays: "",
    travelInsurance: false,
    accommodationBooked: false,
    returnTicketBooked: false,
    sponsorName: "",
    sponsorRelation: "",
    universityName: "",
    universityCountry: "",
    courseName: "",
    courseLevel: "",
    ieltsScore: "",
    toeflScore: "",
    hasAcceptanceLetter: false,
    tuitionFee: "",
    scholarshipAmount: "",
    financialSponsor: "",
    gapYears: "",
    hasStudentLoan: false,
    accommodationPlan: "",
    jobOfferCompany: "",
    jobTitle: "",
    contractDurationMonths: "",
    yearsOfExperience: "",
    highestQualification: "",
    professionalCertifications: "",
    salaryOffered: "",
    hasWorkPermitSponsor: false,
    currentEmployer: "",
    noticePeriodDays: "",
    educationEntries: [] as { degree: string; institution: string; year: string; marks: string }[],
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/login"));
  }, [router]);

  const totalSteps = (): Step[] => {
    const base: Step[] = ["country", "visaType", "personal", "financial", "travel"];
    if (form.visaType === "visit") base.push("visitDetails");
    if (form.visaType === "student") base.push("studentDetails");
    if (form.visaType === "work") base.push("workDetails");
    base.push("review");
    return base;
  };

  const currentStepIndex = () => totalSteps().indexOf(step);
  const totalStepsCount = () => totalSteps().length;

  const canProceed = (): boolean => {
    switch (step) {
      case "country": return !!form.country;
      case "visaType": return !!form.visaType;
      case "personal": return !!form.age && !!form.maritalStatus && !!form.city;
      case "financial": return !!form.jobType;
      case "travel": return !!form.travelHistory;
      case "visitDetails": return true;
      case "studentDetails": return !!form.universityName && !!form.courseName;
      case "workDetails": return !!form.jobOfferCompany && !!form.jobTitle;
      default: return true;
    }
  };

  const nextStep = () => {
    const steps = totalSteps();
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) { setStep(steps[idx + 1]); setError(""); }
  };

  const prevStep = () => {
    const steps = totalSteps();
    const idx = steps.indexOf(step);
    if (idx > 0) { setStep(steps[idx - 1]); setError(""); }
  };

  const update = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

  const addEducation = () => {
    setForm((prev: any) => ({
      ...prev,
      educationEntries: [...prev.educationEntries, { degree: "", institution: "", year: "", marks: "" }],
    }));
  };

  const updEdu = (i: number, f: string, v: string) => {
    const entries = [...form.educationEntries];
    entries[i] = { ...entries[i], [f]: v };
    setForm((prev: any) => ({ ...prev, educationEntries: entries }));
  };

  const remEdu = (i: number) => {
    setForm((prev: any) => ({ ...prev, educationEntries: prev.educationEntries.filter((_: any, idx: number) => idx !== i) }));
  };

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    const country = form.country;
    const rate = EXCHANGE_RATES[country] || 280;
    const incomePKR = parseFloat(form.income) || 0;
    const balancePKR = parseFloat(form.bankBalance) || 0;
    const incomeUSD = incomePKR / rate;
    const balanceUSD = balancePKR / rate;

    try {
      const body: Record<string, any> = {
        country: form.country, visaType: form.visaType, jobType: form.jobType,
        age: form.age ? parseInt(form.age) : undefined,
        maritalStatus: form.maritalStatus || undefined,
        city: form.city || undefined,
        ownHouse: form.ownHouse, hasRentalProperties: form.hasRentalProperties, hasBusinesses: form.hasBusinesses,
        income: incomeUSD || undefined,
        bankBalance: balanceUSD || undefined,
        bankStatementStatus: form.bankStatementStatus || undefined,
        monthlyExpenses: form.monthlyExpenses ? parseFloat(form.monthlyExpenses) : undefined,
        travelHistory: form.travelHistory, purpose: form.purpose,
        previousVisaRejection: form.previousVisaRejection,
        previousVisaRejectionReason: form.previousVisaRejectionReason || undefined,
        previousVisaRejectionCountry: form.previousVisaRejectionCountry || undefined,
        sponsorName: form.sponsorName || undefined, sponsorRelation: form.sponsorRelation || undefined,
        durationDays: form.durationDays ? parseInt(form.durationDays) : undefined,
        travelInsurance: form.travelInsurance, accommodationBooked: form.accommodationBooked, returnTicketBooked: form.returnTicketBooked,
        universityName: form.universityName || undefined, universityCountry: form.universityCountry || undefined,
        courseName: form.courseName || undefined, courseLevel: form.courseLevel || undefined,
        previousEducation: form.educationEntries.length > 0 ? JSON.stringify(form.educationEntries) : undefined,
        ieltsScore: form.ieltsScore ? parseFloat(form.ieltsScore) : undefined,
        toeflScore: form.toeflScore ? parseFloat(form.toeflScore) : undefined,
        hasAcceptanceLetter: form.hasAcceptanceLetter,
        tuitionFee: form.tuitionFee ? parseFloat(form.tuitionFee) : undefined,
        scholarshipAmount: form.scholarshipAmount ? parseFloat(form.scholarshipAmount) : undefined,
        financialSponsor: form.financialSponsor || undefined,
        gapYears: form.gapYears ? parseInt(form.gapYears) : undefined,
        hasStudentLoan: form.hasStudentLoan, accommodationPlan: form.accommodationPlan || undefined,
        jobOfferCompany: form.jobOfferCompany || undefined, jobTitle: form.jobTitle || undefined,
        contractDurationMonths: form.contractDurationMonths ? parseInt(form.contractDurationMonths) : undefined,
        yearsOfExperience: form.yearsOfExperience ? parseInt(form.yearsOfExperience) : undefined,
        highestQualification: form.highestQualification || undefined,
        professionalCertifications: form.professionalCertifications || undefined,
        salaryOffered: form.salaryOffered ? parseFloat(form.salaryOffered) : undefined,
        hasWorkPermitSponsor: form.hasWorkPermitSponsor, currentEmployer: form.currentEmployer || undefined,
        noticePeriodDays: form.noticePeriodDays ? parseInt(form.noticePeriodDays) : undefined,
      };

      const res = await fetch("/api/cases", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      router.push(`/cases/${data.case.id}`);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const ProgressBar = () => (
    <div className="flex items-center gap-2 mb-8">
      {totalSteps().map((s, i) => (
        <div key={s} className="flex items-center gap-2 flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i <= currentStepIndex() ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-light)] text-[var(--text-muted)]"
          }`}>
            {i < currentStepIndex() ? "✓" : i + 1}
          </div>
          {i < totalStepsCount() - 1 && (
            <div className={`flex-1 h-0.5 rounded ${i < currentStepIndex() ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const radioGroup = (label: string, field: string, options: { value: string; label: string; icon?: string; desc?: string }[], cols: number = 3) => (
    <div>
      <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">{label}</p>
      <div className={`grid grid-cols-${cols} gap-3`}>
        {options.map((o) => (
          <button key={o.value} type="button" onClick={() => update(field, o.value)}
            className={`p-4 rounded-[var(--radius)] border-2 text-center transition-all ${
              form[field] === o.value ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)] hover:border-[var(--text-muted)]"
            }`}>
            {o.icon && <span className="text-2xl block mb-1">{o.icon}</span>}
            <span className="font-medium text-sm">{o.label}</span>
            {o.desc && <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{o.desc}</p>}
          </button>
        ))}
      </div>
    </div>
  );

  const inputField = (label: string, field: string, placeholder: string = "", type: string = "text", extra?: any) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      <input type={type} value={form[field] || ""} onChange={(e) => update(field, e.target.value)} className="input" placeholder={placeholder} {...extra} />
    </div>
  );

  const pkrField = (label: string, field: string, placeholder: string = "") => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-secondary)]">{label} (PKR)</label>
      <input type="number" value={form[field] || ""} onChange={(e) => update(field, e.target.value)} className="input" placeholder={placeholder} />
      {form[field] && form.country && (
        <p className="text-xs text-[var(--primary-light)]">
          ≈ {convertToForeign(parseFloat(form[field] || "0"), form.country)}
        </p>
      )}
    </div>
  );

  const selectField = (label: string, field: string, options: { value: string; label: string }[]) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      <select value={form[field] || ""} onChange={(e) => update(field, e.target.value)} className="select">
        <option value="">Select...</option>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );

  const toggleField = (label: string, field: string) => (
    <label className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] border border-[var(--border)] cursor-pointer hover:border-[var(--text-muted)] transition-all">
      <input type="checkbox" checked={form[field] || false} onChange={(e) => update(field, e.target.checked)} className="w-5 h-5 rounded border-[var(--border)]" />
      <span className="text-sm">{label}</span>
    </label>
  );

  const renderStep = () => {
    switch (step) {
      case "country":
        return (
          <div className="card p-8">
            <h2 className="text-xl font-semibold mb-2">Where are you going?</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">Select your destination country</p>
            <div className="grid grid-cols-3 gap-4">
              {[{ value: "UK", label: "United Kingdom", flag: "🇬🇧", rate: "1 £ = 370 PKR" },
                { value: "Netherlands", label: "Netherlands", flag: "🇳🇱", rate: "1 € = 330 PKR" },
                { value: "USA", label: "United States", flag: "🇺🇸", rate: "1 $ = 280 PKR" },
              ].map((c) => (
                <button key={c.value} type="button" onClick={() => update("country", c.value)}
                  className={`p-6 rounded-[var(--radius)] border-2 text-center transition-all ${
                    form.country === c.value ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)] hover:border-[var(--text-muted)]"
                  }`}>
                  <span className="text-4xl block mb-2">{c.flag}</span>
                  <span className="font-medium text-sm">{c.label}</span>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{c.rate}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case "visaType":
        return (
          <div className="card p-8">
            <h2 className="text-xl font-semibold mb-2">What type of visa?</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">Select the visa category</p>
            {radioGroup("", "visaType", [
              { value: "visit", label: "Visit / Tourism", icon: "✈️", desc: "Tourism, family visit, business meetings" },
              { value: "student", label: "Student", icon: "🎓", desc: "Study abroad, university programs" },
              { value: "work", label: "Work", icon: "💼", desc: "Employment, job transfer, work permit" },
            ], 3)}
          </div>
        );

      case "personal":
        return (
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Tell us about yourself</p>
            <div className="grid grid-cols-3 gap-4">
              {inputField("Age", "age", "e.g. 25", "number", { min: 16, max: 100 })}
              {selectField("Marital Status", "maritalStatus", [
                { value: "single", label: "Single" }, { value: "married", label: "Married" },
                { value: "divorced", label: "Divorced" }, { value: "widowed", label: "Widowed" },
              ])}
              {inputField("City", "city", "e.g. Lahore")}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Assets & Properties</p>
              <div className="grid grid-cols-3 gap-3">
                {toggleField("🏠 Own House / Property", "ownHouse")}
                {toggleField("🏢 Rental Properties", "hasRentalProperties")}
                {toggleField("🏭 Own Businesses", "hasBusinesses")}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Previous Visa Rejection</p>
              {toggleField("Have you ever had a visa rejected?", "previousVisaRejection")}
              {form.previousVisaRejection && (
                <div className="grid grid-cols-2 gap-4 p-4 rounded-[var(--radius-sm)] bg-[var(--warning)]/5 border border-[var(--warning)]/20">
                  {selectField("Reason for Rejection", "previousVisaRejectionReason", [
                    { value: "insufficient_funds", label: "Insufficient Funds" },
                    { value: "weak_ties", label: "Weak Ties to Home Country" },
                    { value: "incomplete_docs", label: "Incomplete Documents" },
                    { value: "travel_history", label: "Poor Travel History" },
                    { value: "employment_concerns", label: "Employment Concerns" },
                    { value: "previous_overstay", label: "Previous Overstay" },
                    { value: "dont_know", label: "I Don't Know" },
                    { value: "other", label: "Other" },
                  ])}
                  {inputField("Country that rejected", "previousVisaRejectionCountry", "e.g. UK")}
                </div>
              )}
            </div>
          </div>
        );

      case "financial":
        return (
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Financial & Employment</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Your financial profile and employment status</p>
            {radioGroup("Employment Type", "jobType", [
              { value: "salaried", label: "Salaried", icon: "💼", desc: "Employed at a company" },
              { value: "business", label: "Business Owner", icon: "🏢", desc: "Self-employed" },
              { value: "student", label: "Student", icon: "🎓", desc: "Currently studying" },
              { value: "unemployed", label: "Unemployed", icon: "🔍", desc: "Not currently employed" },
              { value: "retired", label: "Retired", icon: "🧓", desc: "Retired" },
            ], 5)}
            <div className="grid grid-cols-2 gap-4">
              {pkrField("Monthly Income", "income", "e.g. 100000")}
              {pkrField("Bank Balance", "bankBalance", "e.g. 500000")}
              {selectField("Bank Statement Status", "bankStatementStatus", [
                { value: "6_months", label: "6 Months Available" },
                { value: "3_months", label: "3 Months Available" },
                { value: "not_available", label: "Not Available" },
              ])}
              {inputField("Monthly Expenses (USD)", "monthlyExpenses", "e.g. 800", "number")}
            </div>
          </div>
        );

      case "travel":
        return (
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Travel Details</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Your travel history and purpose</p>
            <div className="grid grid-cols-2 gap-6">
              {selectField("Travel History", "travelHistory", [
                { value: "none", label: "No travel history" },
                { value: "limited", label: "Limited (1-2 trips)" },
                { value: "moderate", label: "Moderate (3-5 trips)" },
                { value: "extensive", label: "Extensive (5+ trips)" },
              ])}
              {selectField("Purpose of Visit", "purpose", [
                { value: "tourism", label: "Tourism" }, { value: "business", label: "Business" },
                { value: "family_visit", label: "Family Visit" }, { value: "medical", label: "Medical" },
                { value: "education", label: "Education" },
              ])}
            </div>
          </div>
        );

      case "visitDetails":
        return (
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Visit Visa Details ✈️</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Additional information for your visit visa</p>
            <div className="grid grid-cols-2 gap-4">
              {inputField("Duration (days)", "durationDays", "e.g. 15", "number", { min: 1, max: 90 })}
              {inputField("Sponsor Name (optional)", "sponsorName", "e.g. John Smith")}
              {inputField("Sponsor Relation", "sponsorRelation", "e.g. Brother")}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Travel Arrangements</p>
              <div className="grid grid-cols-3 gap-3">
                {toggleField("✈️ Return Ticket Booked", "returnTicketBooked")}
                {toggleField("🏨 Accommodation Booked", "accommodationBooked")}
                {toggleField("🛡️ Travel Insurance", "travelInsurance")}
              </div>
            </div>
          </div>
        );

      case "studentDetails":
        return (
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Student Visa Details 🎓</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">University, course, and academic background</p>
            <div className="grid grid-cols-2 gap-4">
              {inputField("University Name *", "universityName", "e.g. University of Toronto")}
              {inputField("University Country", "universityCountry", "e.g. Canada")}
              {inputField("Course Name *", "courseName", "e.g. BSc Computer Science")}
              {selectField("Course Level", "courseLevel", [
                { value: "foundation", label: "Foundation" }, { value: "diploma", label: "Diploma" },
                { value: "bachelors", label: "Bachelor's" }, { value: "masters", label: "Master's" },
                { value: "phd", label: "PhD / Doctorate" },
              ])}
              {inputField("IELTS Score", "ieltsScore", "e.g. 6.5", "number", { step: 0.5, min: 0, max: 9 })}
              {inputField("TOEFL Score", "toeflScore", "e.g. 90", "number", { min: 0, max: 120 })}
              {inputField("Tuition Fee (USD)", "tuitionFee", "e.g. 20000", "number")}
              {inputField("Scholarship Amount", "scholarshipAmount", "e.g. 5000", "number")}
              {inputField("Financial Sponsor", "financialSponsor", "e.g. Parents")}
              {inputField("Gap Years (if any)", "gapYears", "e.g. 1", "number")}
              {selectField("Accommodation Plan", "accommodationPlan", [
                { value: "university_halls", label: "University Halls" },
                { value: "private_rental", label: "Private Rental" },
                { value: "with_family", label: "Living with Family" },
              ])}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {toggleField("📩 Acceptance Letter Received", "hasAcceptanceLetter")}
                {toggleField("💰 Student Loan", "hasStudentLoan")}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--text-secondary)]">Previous Education</p>
                <button type="button" onClick={addEducation} className="btn btn-primary text-xs py-2">+ Add Degree</button>
              </div>
              {form.educationEntries.length === 0 && <p className="text-sm text-[var(--text-muted)]">No education entries added yet</p>}
              {form.educationEntries.map((entry: any, i: number) => (
                <div key={i} className="p-4 rounded-[var(--radius-sm)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-muted)]">Entry #{i + 1}</span>
                    <button type="button" onClick={() => remEdu(i)} className="text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10 px-2 py-1 rounded">Remove</button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <input className="input" placeholder="Degree" value={entry.degree} onChange={(e) => updEdu(i, "degree", e.target.value)} />
                    <input className="input" placeholder="Institution" value={entry.institution} onChange={(e) => updEdu(i, "institution", e.target.value)} />
                    <input className="input" placeholder="Year" value={entry.year} onChange={(e) => updEdu(i, "year", e.target.value)} />
                    <input className="input" placeholder="Marks/Grade" value={entry.marks} onChange={(e) => updEdu(i, "marks", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "workDetails":
        return (
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Work Visa Details 💼</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Job offer, experience, and qualifications</p>
            <div className="grid grid-cols-2 gap-4">
              {inputField("Company Name *", "jobOfferCompany", "e.g. Google")}
              {inputField("Job Title *", "jobTitle", "e.g. Software Engineer")}
              {inputField("Contract Duration (months)", "contractDurationMonths", "e.g. 24", "number")}
              {inputField("Years of Experience", "yearsOfExperience", "e.g. 5", "number")}
              {pkrField("Salary Offered", "salaryOffered", "e.g. 3000000")}
              {inputField("Current Employer", "currentEmployer", "e.g. Current Company")}
              {inputField("Notice Period (days)", "noticePeriodDays", "e.g. 30", "number")}
              {selectField("Highest Qualification", "highestQualification", [
                { value: "high_school", label: "High School" }, { value: "bachelors", label: "Bachelor's" },
                { value: "masters", label: "Master's" }, { value: "phd", label: "PhD" },
              ])}
              {inputField("Professional Certifications", "professionalCertifications", "e.g. AWS, PMP")}
            </div>
            <div className="flex items-center gap-3">
              {toggleField("📄 Company Sponsors Work Permit", "hasWorkPermitSponsor")}
            </div>
          </div>
        );

      case "review":
        return (
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Review Your Application 📋</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Please review all your details before submitting</p>
            {error && (
              <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-sm text-[var(--danger)]">⚠️ {error}</div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <Section title="🌍 Destination" data={[
                { l: "Country", v: form.country }, { l: "Visa Type", v: form.visaType },
              ]} />
              <Section title="👤 Personal" data={[
                { l: "Age", v: form.age }, { l: "Marital Status", v: form.maritalStatus },
                { l: "City", v: form.city }, { l: "Own House", v: form.ownHouse ? "Yes" : "No" },
                { l: "Rental Properties", v: form.hasRentalProperties ? "Yes" : "No" },
                { l: "Businesses", v: form.hasBusinesses ? "Yes" : "No" },
                { l: "Prev. Rejection", v: form.previousVisaRejection ? `Yes - ${form.previousVisaRejectionReason || ""}` : "No" },
              ].filter(x => x.v)} />
              <Section title="💰 Financial" data={[
                { l: "Job Type", v: form.jobType },
                { l: "Income (PKR)", v: form.income ? `PKR ${form.income}` : null },
                { l: "Bank Balance (PKR)", v: form.bankBalance ? `PKR ${form.bankBalance}` : null },
                { l: "Bank Statement", v: form.bankStatementStatus },
              ].filter(x => x.v)} />
              <Section title="✈️ Travel" data={[
                { l: "Travel History", v: form.travelHistory }, { l: "Purpose", v: form.purpose },
              ]} />
              {form.visaType === "visit" && (
                <Section title="🏖️ Visit Visa" data={[
                  { l: "Duration", v: form.durationDays ? `${form.durationDays} days` : null },
                  { l: "Sponsor", v: form.sponsorName || null },
                  { l: "Travel Insurance", v: form.travelInsurance ? "Yes" : "No" },
                  { l: "Accommodation", v: form.accommodationBooked ? "Booked" : "Not Booked" },
                ].filter(x => x.v)} />
              )}
              {form.visaType === "student" && (
                <Section title="🎓 Student Visa" data={[
                  { l: "University", v: form.universityName },
                  { l: "Course", v: form.courseName }, { l: "Level", v: form.courseLevel },
                  { l: "IELTS", v: form.ieltsScore || null }, { l: "TOEFL", v: form.toeflScore || null },
                  { l: "Acceptance Letter", v: form.hasAcceptanceLetter ? "Yes" : "No" },
                  { l: "Tuition Fee", v: form.tuitionFee ? `$${form.tuitionFee}` : null },
                  { l: "Gap Years", v: form.gapYears || null },
                ].filter(x => x.v)} />
              )}
              {form.visaType === "work" && (
                <Section title="💼 Work Visa" data={[
                  { l: "Company", v: form.jobOfferCompany }, { l: "Job Title", v: form.jobTitle },
                  { l: "Contract", v: form.contractDurationMonths ? `${form.contractDurationMonths} months` : null },
                  { l: "Experience", v: form.yearsOfExperience ? `${form.yearsOfExperience} years` : null },
                  { l: "Salary", v: form.salaryOffered ? `PKR ${form.salaryOffered}` : null },
                  { l: "Work Permit Sponsor", v: form.hasWorkPermitSponsor ? "Yes" : "No" },
                ].filter(x => x.v)} />
              )}
            </div>
            {form.educationEntries.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-secondary)]">📚 Education History</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-[var(--border)]">
                      <th className="text-left py-2 px-3 text-[var(--text-muted)] font-medium">Degree</th>
                      <th className="text-left py-2 px-3 text-[var(--text-muted)] font-medium">Institution</th>
                      <th className="text-left py-2 px-3 text-[var(--text-muted)] font-medium">Year</th>
                      <th className="text-left py-2 px-3 text-[var(--text-muted)] font-medium">Marks</th>
                    </tr></thead>
                    <tbody>
                      {form.educationEntries.map((e: any, i: number) => (
                        <tr key={i} className="border-b border-[var(--border)]/50">
                          <td className="py-2 px-3">{e.degree}</td>
                          <td className="py-2 px-3">{e.institution}</td>
                          <td className="py-2 px-3">{e.year}</td>
                          <td className="py-2 px-3">{e.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="btn btn-ghost text-sm">← Dashboard</Link>
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">V</div>
            <span className="font-semibold">New Visa Case</span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">Step {currentStepIndex() + 1} of {totalStepsCount()}</span>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <ProgressBar />
        <div className="animate-fadeIn">{renderStep()}</div>
        <div className="flex items-center justify-between mt-8">
          <button type="button" onClick={prevStep} disabled={currentStepIndex() === 0} className="btn btn-ghost text-sm disabled:opacity-30">← Back</button>
          <div className="flex items-center gap-3">
            {step !== "review" ? (
              <button type="button" onClick={nextStep} disabled={!canProceed()} className="btn btn-primary">Continue →</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="btn btn-primary py-4 px-8 text-base">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span> Creating...</span> : "Create Case →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, data }: { title: string; data: { l: string; v: any }[] }) {
  return (
    <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-light)]">
      <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.l} className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">{d.l}</span>
            <span className="font-medium capitalize">{String(d.v).replace(/_/g, " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}