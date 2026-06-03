"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Invalid admin credentials");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] bg-grid flex items-center justify-center p-6">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[var(--danger)]/5 to-[var(--warning)]/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm animate-scaleIn">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--danger)]/20 to-[var(--warning)]/20 flex items-center justify-center mx-auto mb-4 border border-[var(--danger)]/20">
            <span className="text-xl">🔐</span>
          </div>
          <h1 className="text-xl font-bold">Admin Access</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Restricted area</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-sm text-[var(--danger)] text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Username</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input"
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-danger w-full">
            {loading ? "Authenticating..." : "Access Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}