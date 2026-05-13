import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, TrendingDown, Users, ExternalLink } from "lucide-react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Nav ────────────────────────────────────────── */}
      <nav className="nav">
        <div className="container nav-inner">
          <a href="/" className="logo">
            <span className="logo-dot" />
            SpendScan AI
          </a>
          <Link to="/audit" className="btn btn-primary btn-sm">
            Run Free Audit →
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="lp-hero">
        {/* Glow orb — decorative, hidden on tiny screens */}
        <div className="lp-hero-orb" aria-hidden="true" />

        <div className="container lp-hero-inner">
          <div className="badge badge-green lp-hero-badge">
            <Zap size={12} /> Free AI Spend Audit
          </div>

          <h1 className="lp-hero-title">
            Are you{" "}
            <span style={{ color: "var(--accent)" }}>overpaying</span>
            {" "}for AI tools?
          </h1>

          <p className="lp-hero-sub">
            Most startups waste 30–60% of their AI budget on wrong plans,
            redundant tools, and retail pricing. Find out in 2 minutes — free.
          </p>

          <div className="lp-hero-ctas">
            <Link to="/audit" className="btn btn-primary btn-lg lp-cta-primary">
              Audit My AI Spend <ArrowRight size={18} />
            </Link>
            <a href="#how" className="btn btn-secondary btn-lg lp-cta-secondary">
              See How It Works
            </a>
          </div>

          <p className="lp-hero-proof">
            No login required · Results in seconds · 100% free
          </p>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section className="lp-stats">
        <div className="container">
          <div className="lp-stats-grid">
            {[
              { value: "$340", label: "Avg monthly savings found", sub: "per 5-person team" },
              { value: "8", label: "AI tools analyzed", sub: "Cursor, Copilot, Claude & more" },
              { value: "2 min", label: "Time to complete", sub: "No account needed" },
            ].map((s) => (
              <div key={s.label} className="lp-stat-item">
                <div className="lp-stat-value">{s.value}</div>
                <div className="lp-stat-label">{s.label}</div>
                <div className="lp-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section id="how" className="lp-how">
        <div className="container">
          <div className="lp-section-header">
            <h2 className="lp-section-title">How it works</h2>
            <p className="lp-section-sub">Three steps to clarity on your AI spend</p>
          </div>

          <div className="lp-steps-grid">
            {[
              {
                num: "01",
                icon: <Users size={24} />,
                title: "Enter your tools",
                desc: "Tell us which AI tools your team uses, which plan, how many seats, and what you're paying.",
              },
              {
                num: "02",
                icon: <TrendingDown size={24} />,
                title: "Get instant audit",
                desc: "Our engine checks plan fit, flags redundant tools, and finds cheaper alternatives with real reasoning.",
              },
              {
                num: "03",
                icon: <Shield size={24} />,
                title: "Save & share",
                desc: "Get a personalized savings report. Share the link. Book a Credex consultation if savings are significant.",
              },
            ].map((step) => (
              <div key={step.num} className="card lp-step-card">
                <div className="lp-step-num" aria-hidden="true">{step.num}</div>
                <div className="lp-step-icon">{step.icon}</div>
                <h3 className="lp-step-title">{step.title}</h3>
                <p className="lp-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools Supported ────────────────────────────── */}
      <section className="lp-tools">
        <div className="container lp-tools-inner">
          <p className="lp-tools-label">Tools we analyze</p>
          <div className="lp-tools-badges">
            {["Cursor", "GitHub Copilot", "Claude", "ChatGPT", "Anthropic API", "OpenAI API", "Gemini", "Windsurf"].map((t) => (
              <span key={t} className="badge badge-blue">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────── */}
      <section className="lp-cta">
        <div className="container lp-cta-inner">
          <h2 className="lp-cta-title">Stop leaving money on the table</h2>
          <p className="lp-cta-sub">Free audit. No account. Takes 2 minutes.</p>
          <Link to="/audit" className="btn btn-primary btn-lg">
            Run My Free Audit <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="container">

          {/* Top row — columns */}
          <div className="lp-footer-cols">

            {/* Brand column */}
            <div className="lp-footer-brand">
              <a href="/" className="logo lp-footer-logo">
                <span className="logo-dot" />
                SpendScan AI
              </a>
              <p className="lp-footer-tagline">
                Find out if your team is overpaying for AI tools.
                Free audit, no login, results in seconds.
              </p>
              
            </div>

            {/* Product links */}
            <div className="lp-footer-col">
              <p className="lp-footer-col-title">Product</p>
              <ul className="lp-footer-links">
                <li><Link to="/audit">Run Free Audit</Link></li>
                <li><a href="#how">How It Works</a></li>
                <li><a href="#">Tools We Analyze</a></li>
              </ul>
            </div>

            {/* Company links */}
            <div className="lp-footer-col">
              <p className="lp-footer-col-title">Company</p>
              <ul className="lp-footer-links">
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    SpendScan
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="lp-footer-bottom">
            <p className="lp-footer-legal">
              © {new Date().getFullYear()} SpendScan AI . All rights reserved.
            </p>
            <p className="lp-footer-legal">
              Pricing data sourced from official vendor pages. Results are estimates.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
