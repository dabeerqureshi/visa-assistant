"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminCase {
  id: string;
  country: string;
  visaType: string;
  status: string;
  jobType: string;
  user: { name: string; email: string; country: string };
  adminReview?: { status: string; readyToSubmit: boolean } | null;
  documents: any[];
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cases")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setCases(data.cases || []))
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const stats = {
    total: cases.length,
    pending: cases.filter((c) => !c.adminReview || c.adminReview.status === "pending").length,
    reviewed: cases.filter((c) => c.adminReview?.status === "reviewed").length,
    flagged: cases.filter((c) => c.adminReview?.status === "flagged" || c.adminReview?.status === "needs_changes").length,
    readyToSubmit: cases.filter((c) => c.adminReview?.readyToSubmit).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"></div>
          <p className="text-[var(--text-secondary)] text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Admin Nav */}
      <nav className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="btn btn-ghost text-sm">← Back to App</Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--danger)] to-[var(--warning)] flex items-center justify-center text-white font-bold text-xs">A</div>
            <div>
              <span className="font-semibold text-sm">Admin Panel</span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20">Protected</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost text-sm text-[var(--danger)]">Sign Out</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Cases", value: stats.total, color: "from-[var(--primary)] to-[var(--accent)]" },
            { label: "Pending Review", value: stats.pending, color: "from-[var(--warning)] to-[var(--accent)]" },
            { label: "Reviewed", value: stats.reviewed, color: "from-[var(--info)] to-[var(--primary)]" },
            { label: "Needs Changes", value: stats.flagged, color: "from-[var(--danger)] to-[var(--warning)]" },
            { label: "Ready to Submit", value: stats.readyToSubmit, color: "from-[var(--success)] to-[var(--accent)]" },
          ].map((stat, i) => (
            <div key={i} className="card p-5 animate-slideUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Cases Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="font-semibold">All Visa Cases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Country</th>
                  <th className="text-left p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Review</th>
                  <th className="text-left p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Ready</th>
                  <th className="text-right p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c, i) => (
                  <tr key={c.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-light)]/50 transition-colors animate-fadeIn" style={{ animationDelay: `${i * 0.03}s` }}>
                    <td className="p-4">
                      <p className="font-medium text-sm">{c.user.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{c.user.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-lg">{c.country === "UK" ? "🇬🇧" : c.country === "Netherlands" ? "🇳🇱" : "🇺🇸"}</span>
                      <span className="ml-2 text-sm">{c.country}</span>
                    </td>
                    <td className="p-4">
                      <span className="badge badge-neutral capitalize">{c.visaType?.replace(/_/g, " ") || "Visit"}</span>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${
                        c.status === "ready_to_submit" ? "badge-success" :
                        c.status === "completed" ? "badge-success" :
                        c.status === "needs_changes" ? "badge-warning" :
                        c.status === "ready_for_review" ? "badge-warning" :
                        c.status === "in_progress" ? "badge-info" : "badge-neutral"
                      }`}>
                        {c.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      {c.adminReview ? (
                        <span className={`badge ${
                          c.adminReview.status === "approved" ? "badge-success" :
                          c.adminReview.status === "flagged" ? "badge-danger" :
                          c.adminReview.status === "needs_changes" ? "badge-warning" :
                          c.adminReview.status === "reviewed" ? "badge-info" : "badge-neutral"
                        }`}>
                          {c.adminReview.status?.replace(/_/g, " ")}
                        </span>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      {c.adminReview?.readyToSubmit ? (
                        <span className="text-lg">🟢</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/cases/${c.id}`}
                        className="btn btn-ghost text-xs"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
                {cases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-[var(--text-muted)] text-sm">
                      No cases found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}