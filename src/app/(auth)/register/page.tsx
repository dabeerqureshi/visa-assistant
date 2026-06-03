"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "Pakistan" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">V</div>
            <span className="font-semibold text-[var(--text)]">VisaAssistant</span>
          </a>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-[var(--text-secondary)] mt-1">Start preparing your visa application</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-[var(--radius-sm)] bg-[var(--danger)]/10 border border-[var(--danger)]/20">
              <span>⚠️</span>
              <span className="text-sm text-[var(--danger)]">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" placeholder="At least 6 characters" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Your Country</label>
            <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="select">
              <option value="Pakistan">Pakistan</option>
              <option value="India">India</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Nepal">Nepal</option>
              <option value="Philippines">Philippines</option>
              <option value="Nigeria">Nigeria</option>
              <option value="South Africa">South Africa</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <a href="/login" className="text-[var(--primary-light)] hover:underline">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}