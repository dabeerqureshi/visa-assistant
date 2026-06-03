"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] bg-grid flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md animate-scaleIn">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
              V
            </div>
            <span className="font-semibold text-[var(--text)]">VisaAssistant</span>
          </a>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-[var(--text-secondary)] mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-[var(--radius-sm)] bg-[var(--danger)]/10 border border-[var(--danger)]/20">
              <span>⚠️</span>
              <span className="text-sm text-[var(--danger)]">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Don't have an account?{" "}
            <a href="/register" className="text-[var(--primary-light)] hover:underline">
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}