"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          router.push("/dashboard");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"></div>
          <p className="text-[var(--text-secondary)] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] bg-grid">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
              V
            </div>
            <span className="font-semibold text-[var(--text)]">VisaAssistant</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="btn btn-ghost">Sign In</a>
            <a href="/register" className="btn btn-primary">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
              <span className="text-sm text-[var(--text-secondary)]">Visa Preparation Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Your Visa Application
              <br />
              <span className="gradient-text">Done Right</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
              Stop guessing what documents you need. Get a structured, complete, and review-ready visa application in minutes.
            </p>

            <div className="flex items-center justify-center gap-4">
              <a href="/register" className="btn btn-primary text-base px-8 py-4">
                Start Free →
              </a>
              <a href="/login" className="btn btn-secondary text-base px-8 py-4">
                Sign In
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16">
            {[
              { value: "UK", label: "United Kingdom" },
              { value: "NL", label: "Netherlands" },
              { value: "US", label: "United States" },
            ].map((item, i) => (
              <div key={i} className="card p-4 text-center animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-2xl font-bold gradient-text">{item.value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              From document checklists to expert review, we cover your entire visa journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📋",
                title: "Smart Checklists",
                desc: "Country-specific requirement lists for UK, Netherlands, and USA visit visas. Know exactly what you need.",
                delay: 0,
              },
              {
                icon: "📊",
                title: "Readiness Score",
                desc: "AI-powered scoring system that evaluates your financial strength, document completeness, and application quality.",
                delay: 0.1,
              },
              {
                icon: "📁",
                title: "Document Management",
                desc: "Upload, organize, and track your visa documents in one place. Never lose track of a required document.",
                delay: 0.2,
              },
              {
                icon: "💰",
                title: "Cost Calculator",
                desc: "Know exactly what your visa will cost - fees, insurance, appointments. No hidden surprises.",
                delay: 0.3,
              },
              {
                icon: "👨‍💼",
                title: "Expert Review",
                desc: "Get professional feedback on your application. Our admin team reviews and suggests improvements.",
                delay: 0.4,
              },
              {
                icon: "📄",
                title: "Complete Report",
                desc: "Download a comprehensive PDF report with all documents, scores, and admin feedback for submission.",
                delay: 0.5,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card p-8 animate-slideUp"
                style={{ animationDelay: `${feature.delay}s` }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card card-glow p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Apply with Confidence?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Join hundreds of successful visa applicants who prepared with VisaAssistant.
            </p>
            <a href="/register" className="btn btn-primary text-base px-10 py-4">
              Create Free Account →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-[var(--text-muted)]">
          <p>VisaAssistant — Structured visa preparation for UK, Netherlands & USA</p>
        </div>
      </footer>
    </div>
  );
}