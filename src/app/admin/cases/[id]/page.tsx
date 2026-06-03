"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function AdminCaseReviewPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<any>(null);
  const [review, setReview] = useState({ comment: "", severity: "info", status: "pending", suggestions: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadCase(); }, [caseId]);

  const loadCase = async () => {
    try {
      const res = await fetch(`/api/admin/cases/${caseId}`);
      const data = await res.json();
      setCaseData(data.case);
      if (data.case?.adminReview) {
        setReview({
          comment: data.case.adminReview.comment || "",
          severity: data.case.adminReview.severity || "info",
          status: data.case.adminReview.status || "pending",
          suggestions: data.case.adminReview.suggestions || "",
        });
        setReadyToSubmit(data.case.adminReview.readyToSubmit || false);
      }
    } catch (err) {} finally { setLoading(false); }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, ...review, readyToSubmit }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      loadCase();
    } catch { setError("An error occurred"); } finally { setSubmitting(false); }
  };

  const handleReadyToSubmit = async () => {
    setSubmitting(true); setError("");
    const newReadyState = !readyToSubmit;
    try {
      const res = await fetch("/api/admin/ready-to-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, readyToSubmit: newReadyState }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setReadyToSubmit(newReadyState);
      loadCase();
    } catch { setError("An error occurred"); } finally { setSubmitting(false); }
  };

  const updateChecklistAdmin = async (itemId: string, adminStatus: string, adminNotes?: string) => {
    try {
      await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, adminStatus, adminNotes }),
      });
      loadCase();
    } catch {}
  };

  const catIcon: Record<string, string> = { 
    identity: "🪪", financial: "💰", employment: "💼", travel: "✈️", 
    sponsorship: "🤝", academic: "📚", medical: "🏥", other: "📄" 
  };

  if (loading) return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"></div></div>;
  if (!caseData) return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center"><div className="text-center"><h2 className="text-xl font-bold mb-2">Case not found</h2><Link href="/admin/dashboard" className="text-[var(--primary-light)]">Back to Admin</Link></div></div>;

  const c = caseData;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="btn btn-ghost text-sm">← Admin</Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--danger)] to-[var(--warning)] flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="font-semibold text-sm">Review: {c.country} {c.visaType} Visa — {c.user?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {readyToSubmit && <span className="text-sm font-medium text-[var(--success)]">🟢 Ready to Submit</span>}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && <div className="mb-6 p-4 rounded-[var(--radius-sm)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-sm text-[var(--danger)]">{error}</div>}

        <div className="grid grid-cols-3 gap-6">
          {/* Left - All case details */}
          <div className="col-span-2 space-y-6">
            {/* Applicant Profile */}
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Applicant Profile</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {[
                  { l: "Name", v: c.user?.name }, { l: "Email", v: c.user?.email }, { l: "From", v: c.user?.country },
                  { l: "Country", v: c.country }, { l: "Visa Type", v: c.visaType }, { l: "Job Type", v: c.jobType },
                  { l: "Age", v: c.age }, { l: "Marital Status", v: c.maritalStatus }, { l: "City", v: c.city },
                  { l: "Income", v: c.income ? `$${c.income.toLocaleString()}/mo` : "N/A" },
                  { l: "Bank Balance", v: c.bankBalance ? `$${c.bankBalance.toLocaleString()}` : "N/A" },
                  { l: "Bank Statement", v: c.bankStatementStatus?.replace(/_/g, " ") || "N/A" },
                  { l: "Travel History", v: c.travelHistory || "N/A" }, { l: "Purpose", v: c.purpose || "N/A" },
                  { l: "Own House", v: c.ownHouse ? "Yes" : "No" },
                  { l: "Rental Properties", v: c.hasRentalProperties ? "Yes" : "No" },
                  { l: "Businesses", v: c.hasBusinesses ? "Yes" : "No" },
                ].filter(x => x.v !== undefined && x.v !== null).map((r) => (
                  <div key={r.l} className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-light)]">
                    <p className="text-[var(--text-muted)] text-xs">{r.l}</p>
                    <p className="font-medium capitalize">{String(r.v).replace(/_/g, " ")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Rejection */}
            {c.previousVisaRejection && (
              <div className="card p-6 border-l-4 border-[var(--danger)]">
                <h2 className="font-semibold mb-3 text-[var(--danger)]">⚠ Previous Visa Rejection</h2>
                <p className="text-sm">Reason: {c.previousVisaRejectionReason?.replace(/_/g, " ") || "Unknown"}</p>
                <p className="text-sm">Country: {c.previousVisaRejectionCountry || "Unknown"}</p>
              </div>
            )}

            {/* Visa-type specific details */}
            {c.visaType === "visit" && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">✈️ Visit Visa Details</h2>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <InfoBox l="Duration" v={c.durationDays ? `${c.durationDays} days` : null} />
                  <InfoBox l="Sponsor" v={c.sponsorName} />
                  <InfoBox l="Sponsor Relation" v={c.sponsorRelation} />
                  <InfoBox l="Travel Insurance" v={c.travelInsurance ? "Yes" : "No"} />
                  <InfoBox l="Accommodation" v={c.accommodationBooked ? "Booked" : "Not booked"} />
                  <InfoBox l="Return Ticket" v={c.returnTicketBooked ? "Booked" : "Not booked"} />
                </div>
              </div>
            )}

            {c.visaType === "student" && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">🎓 Student Visa Details</h2>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <InfoBox l="University" v={c.universityName} />
                  <InfoBox l="Uni. Country" v={c.universityCountry} />
                  <InfoBox l="Course" v={c.courseName} />
                  <InfoBox l="Course Level" v={c.courseLevel} />
                  <InfoBox l="IELTS" v={c.ieltsScore} />
                  <InfoBox l="TOEFL" v={c.toeflScore} />
                  <InfoBox l="Acceptance Letter" v={c.hasAcceptanceLetter ? "Yes" : "No"} />
                  <InfoBox l="Tuition Fee" v={c.tuitionFee ? `$${c.tuitionFee.toLocaleString()}` : null} />
                  <InfoBox l="Scholarship" v={c.scholarshipAmount ? `$${c.scholarshipAmount.toLocaleString()}` : null} />
                  <InfoBox l="Financial Sponsor" v={c.financialSponsor} />
                  <InfoBox l="Gap Years" v={c.gapYears} />
                  <InfoBox l="Loan" v={c.hasStudentLoan ? "Yes" : "No"} />
                </div>
                {c.previousEducation && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-[var(--text-secondary)] mb-3">📚 Education History</p>
                    {(() => {
                      try { return JSON.parse(c.previousEducation); } catch { return []; }
                    })().map((e: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded bg-[var(--surface-light)] mb-2 text-sm">
                        <span className="font-medium">{e.degree}</span>
                        <span className="text-[var(--text-muted)]">{e.institution}</span>
                        <span className="text-[var(--text-muted)]">{e.year}</span>
                        <span className="font-semibold">{e.marks}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {c.visaType === "work" && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">💼 Work Visa Details</h2>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <InfoBox l="Company" v={c.jobOfferCompany} />
                  <InfoBox l="Job Title" v={c.jobTitle} />
                  <InfoBox l="Contract" v={c.contractDurationMonths ? `${c.contractDurationMonths}m` : null} />
                  <InfoBox l="Experience" v={c.yearsOfExperience ? `${c.yearsOfExperience}yrs` : null} />
                  <InfoBox l="Qualification" v={c.highestQualification?.replace(/_/g, " ")} />
                  <InfoBox l="Certifications" v={c.professionalCertifications} />
                  <InfoBox l="Salary Offered" v={c.salaryOffered ? `$${c.salaryOffered.toLocaleString()}` : null} />
                  <InfoBox l="Work Permit Sponsor" v={c.hasWorkPermitSponsor ? "Yes" : "No"} />
                  <InfoBox l="Current Employer" v={c.currentEmployer} />
                  <InfoBox l="Notice Period" v={c.noticePeriodDays ? `${c.noticePeriodDays}d` : null} />
                </div>
              </div>
            )}

            {/* Document Checklist - Admin Review */}
            <div className="card p-6">
              <h2 className="font-semibold mb-6">📋 Document Checklist — Admin Review</h2>
              {!c.checklist || c.checklist.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No checklist items generated.</p>
              ) : (
                <div className="space-y-2">
                  {c.checklist.map((item: any) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-[var(--radius-sm)] border ${
                      item.hasDocument ? "border-[var(--success)]/30 bg-[var(--success)]/5" : "border-[var(--border)]"
                    }`}>
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{catIcon[item.category] || "📄"}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.documentName}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            User: {item.hasDocument ? "✅ Has it" : "❌ Needs it"}
                            {item.notes && ` — Notes: ${item.notes}`}
                          </p>
                        </div>
                      </div>
                      <select
                        value={item.adminStatus || "pending"}
                        onChange={(e) => updateChecklistAdmin(item.id, e.target.value)}
                        className="select text-xs py-1 px-2 w-36"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">✅ Verified</option>
                        <option value="needs_clarification">⚠️ Needs Clarification</option>
                        <option value="missing">❌ Missing</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Uploaded documents */}
            {c.documents?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">Uploaded Documents ({c.documents.length})</h2>
                <div className="grid grid-cols-2 gap-2">
                  {c.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--surface-light)]">
                      <span>{catIcon[doc.category] || "📄"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.type.replace(/_/g, " ")}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{doc.fileName}</p>
                      </div>
                      <a href={doc.fileUrl} target="_blank" className="btn btn-ghost text-xs py-1 px-2">View</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Review Form */}
          <div className="space-y-6">
            <div className={`card p-6 border-l-4 ${readyToSubmit ? "border-[var(--success)]" : "border-[var(--border)]"}`}>
              <h2 className="font-semibold mb-3">Submission Status</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {readyToSubmit ? "This application is ready to submit." : "Mark as ready when perfect."}
              </p>
              <button onClick={handleReadyToSubmit} disabled={submitting}
                className={`w-full py-3 px-4 rounded-[var(--radius-sm)] font-semibold text-sm transition-all ${
                  readyToSubmit ? "bg-[var(--success)] text-white" : "bg-[var(--success)]/10 text-[var(--success)] border-2 border-dashed border-[var(--success)]/30"
                }`}>
                {submitting ? "..." : readyToSubmit ? "🟢 Ready ✓" : "Mark as Ready"}
              </button>
              {readyToSubmit && (
                <button onClick={handleReadyToSubmit} disabled={submitting}
                  className="w-full mt-2 py-2 px-4 rounded-[var(--radius-sm)] text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10">
                  Revoke
                </button>
              )}
            </div>

            <div className="card p-6">
              <h2 className="font-semibold mb-4">Admin Review</h2>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Status</label>
                  <select value={review.status} onChange={(e) => setReview({ ...review, status: e.target.value })} className="select">
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="needs_changes">Needs Changes ⚠</option>
                    <option value="flagged">Flagged ⚠</option>
                    <option value="approved">Approved ✓</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Severity</label>
                  <select value={review.severity} onChange={(e) => setReview({ ...review, severity: e.target.value })} className="select">
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Review Notes</label>
                  <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} rows={5} required className="input resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Suggestions</label>
                  <textarea value={review.suggestions} onChange={(e) => setReview({ ...review, suggestions: e.target.value })} rows={3} className="input resize-none" />
                </div>
                <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>

            {c.adminReview && (
              <div className={`card p-6 border-l-4 ${c.adminReview.severity === "critical" ? "border-[var(--danger)]" : c.adminReview.severity === "warning" ? "border-[var(--warning)]" : "border-[var(--primary)]"}`}>
                <h3 className="font-semibold mb-2">Previous Review</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{c.adminReview.comment}</p>
                {c.adminReview.suggestions && (
                  <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--primary)]/5 border mb-3">
                    <p className="text-xs font-medium text-[var(--primary-light)] mb-1">Suggestions</p>
                    <p className="text-sm text-[var(--text-secondary)]">{c.adminReview.suggestions}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <span className={`badge ${c.adminReview.status === "approved" ? "badge-success" : c.adminReview.status === "flagged" ? "badge-danger" : "badge-neutral"}`}>
                    {c.adminReview.status}
                  </span>
                  <span className="text-[var(--text-muted)]">Severity: {c.adminReview.severity}</span>
                  {c.adminReview.readyToSubmit && <span className="badge badge-success">🟢 Ready</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ l, v }: { l: string; v: any }) {
  if (!v) return null;
  return (
    <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-light)]">
      <p className="text-[var(--text-muted)] text-xs">{l}</p>
      <p className="font-medium capitalize">{String(v).replace(/_/g, " ")}</p>
    </div>
  );
}