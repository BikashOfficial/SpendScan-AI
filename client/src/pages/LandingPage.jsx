import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, TrendingDown, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
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

      {/* Hero */}
      <section style={{ padding: "100px 0 80px", position: "relative", overflow: "hidden" }}>
        {/* Glow orb */}
        <div style={{
          position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(0,229,160,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div className="container" style={{ textAlign: "center", position: "relative" }}>
          <div className="badge badge-green" style={{ marginBottom: "24px" }}>
            <Zap size={12} /> Free AI Spend Audit
          </div>

          <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", marginBottom: "24px", maxWidth: "800px", margin: "0 auto 24px" }}>
            Are you{" "}
            <span style={{ color: "var(--accent)" }}>overpaying</span>
            {" "}for AI tools?
          </h1>

          <p style={{ fontSize: "18px", color: "var(--text2)", maxWidth: "560px", margin: "0 auto 40px", lineHeight: "1.7" }}>
            Most startups waste 30–60% of their AI budget on wrong plans, redundant tools, and retail pricing. Find out in 2 minutes — free.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/audit" className="btn btn-primary btn-lg">
              Audit My AI Spend <ArrowRight size={18} />
            </Link>
            <a href="#how" className="btn btn-secondary btn-lg">
              See How It Works
            </a>
          </div>

          {/* Social proof */}
          <p style={{ marginTop: "40px", color: "var(--text3)", fontSize: "14px" }}>
            No login required · Results in seconds · 100% free
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "40px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", textAlign: "center" }}>
            {[
              { value: "$340", label: "Avg monthly savings found", sub: "per 5-person team" },
              { value: "8", label: "AI tools analyzed", sub: "Cursor, Copilot, Claude & more" },
              { value: "2 min", label: "Time to complete", sub: "No account needed" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "36px", fontFamily: "Syne", fontWeight: 800, color: "var(--accent)" }}>{s.value}</div>
                <div style={{ fontWeight: 600, marginTop: "4px" }}>{s.label}</div>
                <div style={{ fontSize: "13px", color: "var(--text3)", marginTop: "2px" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: "100px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", marginBottom: "16px" }}>How it works</h2>
            <p style={{ color: "var(--text2)", fontSize: "18px" }}>Three steps to clarity on your AI spend</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { num: "01", icon: <Users size={24} />, title: "Enter your tools", desc: "Tell us which AI tools your team uses, which plan, how many seats, and what you're paying." },
              { num: "02", icon: <TrendingDown size={24} />, title: "Get instant audit", desc: "Our engine checks plan fit, flags redundant tools, and finds cheaper alternatives with real reasoning." },
              { num: "03", icon: <Shield size={24} />, title: "Save & share", desc: "Get a personalized savings report. Share the link. Book a Credex consultation if savings are significant." },
            ].map((step) => (
              <div key={step.num} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "48px", fontFamily: "Syne", fontWeight: 800, color: "var(--border)", lineHeight: 1 }}>
                  {step.num}
                </div>
                <div style={{ color: "var(--accent)", marginBottom: "16px" }}>{step.icon}</div>
                <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>{step.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: "15px" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools supported */}
      <section style={{ padding: "60px 0", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text3)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px" }}>
            Tools we analyze
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {["Cursor", "GitHub Copilot", "Claude", "ChatGPT", "Anthropic API", "OpenAI API", "Gemini", "Windsurf"].map((t) => (
              <span key={t} className="badge badge-blue">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", marginBottom: "20px" }}>
            Stop leaving money on the table
          </h2>
          <p style={{ color: "var(--text2)", fontSize: "18px", marginBottom: "40px" }}>
            Free audit. No account. Takes 2 minutes.
          </p>
          <Link to="/audit" className="btn btn-primary btn-lg">
            Run My Free Audit <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <a href="/" className="logo" style={{ fontSize: "16px" }}>
            <span className="logo-dot" />
            SpendScan AI
          </a>
          <p style={{ color: "var(--text3)", fontSize: "13px" }}>
            A free tool by <a href="https://credex.rocks" style={{ color: "var(--accent)", textDecoration: "none" }}>Credex</a> · Discounted AI infrastructure credits
          </p>
        </div>
      </footer>
    </div>
  );
}
