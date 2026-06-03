"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CaseData {
  id: string;
  country: string;
  visaType: string;
  status: string;
  jobType: string;
  createdAt: string;
  documents: any[];
  adminReview?: { readyToSubmit: boolean; status: string } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => setCases(data.cases || []))
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: "badge-neutral",
      in_progress: "badge-info",
      ready_for_review: "badge-warning",
      needs_changes: "badge-warning",
      ready_to_submit: "badge-success",
      completed: "badge-success",
    };
    return badges[status] || "badge-neutral";
  };

  const totalCases = cases.length;
  const inProgressCases = cases.filter((c) => c.status === "in_progress" || c.status === "draft").length;
  const readyToSubmitCases = cases.filter((c) => c.adminReview?.readyToSubmit).length;
  const needsChangesCases = cases.filter((c) => c.status === "needs_changes").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"></div>
          <p className="text-[var(--text-secondary)] text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">V</div>
              <span className="font-semibold">VisaAssistant</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-light)]/50">
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="text-sm">
                <p className="font-medium leading-tight">{user?.name}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost text-sm">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome & Header */}
          <div className="flex items-end justify-between mb-10 animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs text-[var(--text-secondary)] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
                {totalCases} active case{totalCases !== 1 ? "s" : ""}
              </div>
              <h1 className="text-3xl font-bold">
                Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">Manage your visa applications</p>
            </div>
            <Link
              href="/cases/new"
              className="btn btn-primary px-6 py-3"
            >
              + New Case
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Cases", value: totalCases, icon: "📋", color: "from-[var(--primary)] to-[var(--accent)]" },
              { label: "In Progress", value: inProgressCases, icon: "🔄", color: "from-[var(--info)] to-[var(--primary)]" },
              { label: "Ready to Submit", value: readyToSubmitCases, icon: "🟢", color: "from-[var(--success)] to-[var(--accent)]" },
              { label: "Needs Changes", value: needsChangesCases, icon: "⚠️", color: "from-[var(--warning)] to-[var(--primary)]" },
            ].map((stat, i) => (
              <div key={i} className="card p-5 animate-slideUp flex items-center gap-4" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-light)] flex items-center justify-center text-xl">{stat.icon}</div>
                <div>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Cases */}
          {cases.length === 0 ? (
            <div className="card p-16 text-center animate-scaleIn">
              <div className="text-5xl mb-4 animate-float">🛂</div>
              <h3 className="text-xl font-semibold mb-2">No visa cases yet</h3>
              <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Create your first visa case to get started with a structured, review-ready application.
              </p>
              <Link href="/cases/new" className="btn btn-primary px-8 py-3">Create Your First Case →</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {cases.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="card p-6 animate-slideUp hover:border-[var(--primary)]/30"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[var(--surface-light)] flex items-center justify-center text-3xl">
                        {c.country === "UK" ? "🇬🇧" : c.country === "Netherlands" ? "🇳🇱" : "🇺🇸"}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{c.country} — {c.visaType?.replace(/_/g, " ") || "Visit"} Visa</h3>
                          <span className={`badge ${getStatusBadge(c.status)}`}>
                            {c.status.replace(/_/g, " ")}
                          </span>
                          {c.adminReview?.readyToSubmit && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20">
                              🟢 Ready
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                          <span className="capitalize">{c.jobType?.replace("_", " ")}</span>
                          <span>•</span>
                          <span>Created {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span>•</span>
                          <span>{c.documents?.length || 0} document{c.documents?.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {c.adminReview?.readyToSubmit && (
                        <div className="text-right">
                          <div className="text-3xl">🟢</div>
                          <p className="text-[10px] text-[var(--success)] font-medium">Ready to Submit</p>
                        </div>
                      )}
                      <div className="text-[var(--text-muted)]">→</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}