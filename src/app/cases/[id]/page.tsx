"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const caseId = params.id as string;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/login"));
  }, [router]);

  const loadCase = useCallback(async () => {
    if (!caseId) return;
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      const data = await res.json();
      if (data.case) setCaseData(data.case);
    } catch {} finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (!user) return;
    loadCase();
  }, [user, loadCase]);

  // Poll every 8 seconds when case is in review state for real-time admin updates
  useEffect(() => {
    if (!caseData) return;
    const shouldPoll = ["ready_for_review", "ready_to_submit", "needs_changes"].includes(caseData.status);
    if (!shouldPoll) return;
    const interval = setInterval(loadCase, 8000);
    return () => clearInterval(interval);
  }, [caseData?.status, loadCase]);

  const toggleChecklistItem = async (item: any) => {
    try {
      const res = await fetch("/api/checklist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, hasDocument: !item.hasDocument }),
      });
      if (res.ok) loadCase();
    } catch {}
  };

  const updateChecklistNote = async (itemId: string, notes: string) => {
    try {
      await fetch("/api/checklist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, notes }),
      });
    } catch {}
  };

  const handleSubmitForReview = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ready_for_review" }),
      });
      if (res.ok) loadCase();
    } catch {} finally { setSubmitting(false); }
  };

  const getStatusBadge = (s: string) => {
    const m: Record<string, string> = {
      draft: "badge-neutral", in_progress: "badge-info", ready_for_review: "badge-warning",
      needs_changes: "badge-warning", ready_to_submit: "badge-success", completed: "badge-success"
    };
    return m[s] || "badge-neutral";
  };

  const catIcon: Record<string, string> = {
    identity: "🪪", financial: "💰", employment: "💼", travel: "✈️",
    sponsorship: "🤝", academic: "📚", medical: "🏥", other: "📄"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center"><h2 className="text-xl font-bold mb-2">Case not found</h2><Link href="/dashboard" className="text-[var(--primary-light)]">Back to Dashboard</Link></div>
      </div>
    );
  }

  const c = caseData;
  const checklistDone = c.checklist?.every((i: any) => i.hasDocument) && c.checklist?.length > 0;
  const checklistCount = c.checklist?.length || 0;
  const checklistChecked = c.checklist?.filter((i: any) => i.hasDocument).length || 0;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="btn btn-ghost text-sm">← Dashboard</Link>
            <div className="w-7 h-7 rounded gradient-primary flex items-center justify-center text-white font-bold text-[10px]">V</div>
            <span className="font-semibold text-sm">{c.country} — {c.visaType} Visa</span>
            <span className={`badge ${getStatusBadge(c.status)}`}>{c.status.replace(/_/g, " ")}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Ready to Submit Banner (REAL-TIME: shows as soon as admin marks it) */}
        {c.adminReview?.readyToSubmit && (
          <div className="mb-6 p-6 rounded-[var(--radius)] bg-[var(--success)]/10 border-2 border-[var(--success)]/30 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🟢</div>
              <div>
                <h2 className="text-lg font-bold text-[var(--success)]">✅ Your Application is Ready to Submit!</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">The admin has reviewed your application. You can now proceed with your visa submission.</p>
              </div>
            </div>
          </div>
        )}

        {/* Needs Changes Banner */}
        {c.status === "needs_changes" && (
          <div className="mb-6 p-6 rounded-[var(--radius)] bg-[var(--warning)]/10 border-2 border-[var(--warning)]/30 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚠️</div>
              <div>
                <h2 className="text-lg font-bold text-[var(--warning)]">Application Needs Changes</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Please review the admin feedback below and update your checklist accordingly.</p>
              </div>
            </div>
          </div>
        )}

        {/* Under Review Banner */}
        {c.status === "ready_for_review" && !c.adminReview?.readyToSubmit && (
          <div className="mb-6 p-6 rounded-[var(--radius)] bg-[var(--primary)]/5 border border-[var(--primary)]/20 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔄</div>
              <div>
                <h2 className="text-lg font-bold text-[var(--primary-light)]">Under Review</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Your application has been submitted for admin review. You will be notified when it's ready.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Admin Review */}
            {c.adminReview && (
              <div className={`card p-6 border-l-4 ${c.adminReview.severity === "critical" ? "border-[var(--danger)]" : c.adminReview.severity === "warning" ? "border-[var(--warning)]" : "border-[var(--primary)]"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">👨‍💼 Admin Review</h2>
                  <div className="flex items-center gap-2">
                    {c.adminReview.readyToSubmit && <span className="badge badge-success text-xs">🟢 Ready</span>}
                    <span className={`badge ${c.adminReview.status === "approved" ? "badge-success" : c.adminReview.status === "flagged" ? "badge-danger" : "badge-neutral"}`}>
                      {c.adminReview.status?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{c.adminReview.comment}</p>
                {c.adminReview.suggestions && (
                  <div className="mt-3 p-3 rounded-[var(--radius-sm)] bg-[var(--primary)]/5 border border-[var(--primary)]/10">
                    <p className="text-xs font-medium text-[var(--primary-light)] mb-1">💡 Suggestions</p>
                    <p className="text-sm text-[var(--text-secondary)]">{c.adminReview.suggestions}</p>
                  </div>
                )}
              </div>
            )}

            {/* Document Checklist */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">📋 Document Checklist</h2>
                {checklistCount > 0 && (
                  <span className="text-xs text-[var(--text-muted)]">{checklistChecked}/{checklistCount} checked</span>
                )}
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Check the documents you have. Add notes about each document. When done, click "Submit for Review".
              </p>

              {(!c.checklist || c.checklist.length === 0) ? (
                <p className="text-sm text-[var(--text-muted)]">No checklist items generated.</p>
              ) : (
                <div className="space-y-2">
                  {c.checklist.map((item: any) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-[var(--radius-sm)] border transition-all ${
                      item.hasDocument ? "border-[var(--success)]/30 bg-[var(--success)]/5" : "border-[var(--border)]"
                    }`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xl shrink-0">{catIcon[item.category] || "📄"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.documentName}</p>
                          <p className="text-[10px] text-[var(--text-muted)] capitalize">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={item.hasDocument} onChange={() => toggleChecklistItem(item)} className="w-5 h-5 rounded border-[var(--border)]" />
                          <span className="text-xs font-medium whitespace-nowrap">{item.hasDocument ? "✅ Have it" : "⬜ Need it"}</span>
                        </label>
                        <input type="text" placeholder="Notes..." value={item.notes || ""}
                          onChange={(e) => updateChecklistNote(item.id, e.target.value)}
                          className="input text-xs py-1.5 px-2 w-28" />
                        {item.adminStatus !== "pending" && (
                          <span className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap ${
                            item.adminStatus === "verified" ? "bg-[var(--success)]/10 text-green-600" :
                            item.adminStatus === "needs_clarification" ? "bg-[var(--warning)]/10 text-yellow-600" :
                            item.adminStatus === "missing" ? "bg-[var(--danger)]/10 text-red-600" : ""
                          }`}>
                            {item.adminStatus.replace(/_/g, " ")}
                          </span>
                        )}
                        {item.adminNotes && (
                          <span className="text-[10px] text-[var(--text-muted)] italic max-w-[100px] truncate" title={item.adminNotes}>
                            Admin: {item.adminNotes}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit for Review Button */}
              {c.status === "draft" && (
                <button onClick={handleSubmitForReview} disabled={submitting}
                  className="mt-6 w-full py-4 px-6 rounded-[var(--radius)] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50">
                  {submitting ? "Submitting..." : "📤 Submit for Admin Review"}
                </button>
              )}
            </div>

            {/* Uploaded Documents */}
            {c.documents?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">📎 Uploaded Documents</h2>
                <div className="space-y-2">
                  {c.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] bg-[var(--surface-light)]">
                      <div className="flex items-center gap-2">
                        <span>{catIcon[doc.category] || "📄"}</span>
                        <div>
                          <p className="text-sm font-medium">{doc.type.replace(/_/g, " ")}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{doc.fileName}</p>
                        </div>
                      </div>
                      <span className={`badge text-[10px] ${doc.status === "uploaded" ? "badge-success" : doc.status === "weak" ? "badge-warning" : "badge-neutral"}`}>{doc.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Profile Summary</h2>
              <div className="space-y-3">
                <Item label="Country" val={c.country} />
                <Item label="Visa Type" val={c.visaType?.replace(/_/g, " ")} />
                <Item label="Age" val={c.age} />
                <Item label="Marital Status" val={c.maritalStatus} />
                <Item label="City" val={c.city} />
                <Item label="Job Type" val={c.jobType?.replace("_", " ")} />
                <Item label="Income" val={c.income ? `$${c.income.toFixed(2)}/mo` : null} />
                <Item label="Bank Balance" val={c.bankBalance ? `$${c.bankBalance.toFixed(2)}` : null} />
                <Item label="Bank Statement" val={c.bankStatementStatus?.replace(/_/g, " ")} />
                <Item label="Travel History" val={c.travelHistory?.replace(/_/g, " ")} />
                <Item label="Purpose" val={c.purpose?.replace(/_/g, " ")} />
                <Item label="Own House" val={c.ownHouse ? "Yes" : "No"} />
                <Item label="Rental Properties" val={c.hasRentalProperties ? "Yes" : "No"} />
                <Item label="Businesses" val={c.hasBusinesses ? "Yes" : "No"} />
              </div>
            </div>

            {c.visaType === "visit" && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">✈️ Visit Details</h2>
                <div className="space-y-3">
                  <Item label="Duration" val={c.durationDays ? `${c.durationDays} days` : null} />
                  <Item label="Sponsor" val={c.sponsorName} />
                  <Item label="Sponsor Relation" val={c.sponsorRelation} />
                  <Item label="Travel Insurance" val={c.travelInsurance ? "Yes" : "No"} />
                  <Item label="Accommodation" val={c.accommodationBooked ? "Booked" : "Not booked"} />
                  <Item label="Return Ticket" val={c.returnTicketBooked ? "Booked" : "Not booked"} />
                </div>
              </div>
            )}

            {c.visaType === "student" && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">🎓 Student Details</h2>
                <div className="space-y-3">
                  <Item label="University" val={c.universityName} />
                  <Item label="Uni. Country" val={c.universityCountry} />
                  <Item label="Course" val={c.courseName} />
                  <Item label="Course Level" val={c.courseLevel} />
                  <Item label="IELTS" val={c.ieltsScore} />
                  <Item label="TOEFL" val={c.toeflScore} />
                  <Item label="Acceptance Letter" val={c.hasAcceptanceLetter ? "Yes" : "No"} />
                  <Item label="Gap Years" val={c.gapYears} />
                  <Item label="Student Loan" val={c.hasStudentLoan ? "Yes" : "No"} />
                </div>
                {c.previousEducation && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">📚 Education</p>
                    {(() => { try { return JSON.parse(c.previousEducation); } catch { return null; } })()?.map((e: any, i: number) => (
                      <div key={i} className="p-2 rounded bg-[var(--surface-light)] mb-2 text-xs">
                        <p className="font-medium">{e.degree} — {e.institution}</p>
                        <p className="text-[var(--text-muted)]">{e.year} · {e.marks}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {c.visaType === "work" && (
              <div className="card p-6">
                <h2 className="font-semibold mb-4">💼 Work Details</h2>
                <div className="space-y-3">
                  <Item label="Company" val={c.jobOfferCompany} />
                  <Item label="Job Title" val={c.jobTitle} />
                  <Item label="Contract" val={c.contractDurationMonths ? `${c.contractDurationMonths} months` : null} />
                  <Item label="Experience" val={c.yearsOfExperience ? `${c.yearsOfExperience} years` : null} />
                  <Item label="Salary" val={c.salaryOffered ? `$${c.salaryOffered.toFixed(2)}` : null} />
                  <Item label="Work Permit Sponsor" val={c.hasWorkPermitSponsor ? "Yes" : "No"} />
                </div>
              </div>
            )}

            {c.previousVisaRejection && (
              <div className="card p-6 border-l-4 border-[var(--danger)]">
                <h2 className="font-semibold mb-4 text-[var(--danger)]">⚠ Previous Rejection</h2>
                <div className="space-y-2 text-sm">
                  <p><span className="text-[var(--text-muted)]">Reason:</span> {c.previousVisaRejectionReason?.replace(/_/g, " ") || "Unknown"}</p>
                  <p><span className="text-[var(--text-muted)]">Country:</span> {c.previousVisaRejectionCountry}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({ label, val }: { label: string; val: any }) {
  if (!val) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-medium capitalize">{String(val).replace(/_/g, " ")}</span>
    </div>
  );
}