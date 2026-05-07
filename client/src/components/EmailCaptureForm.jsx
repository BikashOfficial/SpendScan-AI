// File: client/src/components/EmailCaptureForm.jsx
import { Mail, CheckCircle } from "lucide-react";

export default function EmailCaptureForm({ emailSent, emailLoading, emailCapture, onEmailChange, onSubmit, isOptimal }) {
  if (emailSent) {
    return (
      <div className="card" style={{ marginBottom: "32px", border: "1px solid rgba(0,229,160,0.2)", background: "rgba(0,229,160,0.03)", textAlign: "center" }}>
        <CheckCircle size={32} color="var(--accent)" style={{ marginBottom: "12px" }} />
        <h3 style={{ marginBottom: "8px" }}>Report sent!</h3>
        <p style={{ color: "var(--text2)" }}>Check your inbox. We'll follow up if you qualify for Credex credits.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: "32px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>
          {isOptimal ? "Get notified when optimizations apply to your stack" : "Get your full report by email"}
        </h3>
        <p style={{ color: "var(--text2)", fontSize: "14px" }}>
          {isOptimal
            ? "AI tool pricing changes often. We'll alert you when better options emerge."
            : "We'll send a detailed PDF breakdown and follow up if you qualify for Credex credits."}
        </p>
      </div>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label>Work Email *</label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={emailCapture.email}
              onChange={e => onEmailChange({ ...emailCapture, email: e.target.value })}
            />
          </div>
          <div>
            <label>Company (optional)</label>
            <input
              type="text"
              placeholder="Acme Inc"
              value={emailCapture.company}
              onChange={e => onEmailChange({ ...emailCapture, company: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Your Role (optional)</label>
            <select value={emailCapture.role} onChange={e => onEmailChange({ ...emailCapture, role: e.target.value })}>
              <option value="">Select...</option>
              {["Founder / CEO", "CTO / VP Engineering", "Engineering Manager", "Senior Engineer", "Finance / Ops"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={emailLoading} style={{ alignSelf: "flex-start" }}>
          {emailLoading ? <><span className="spinner" style={{ borderTopColor: "#000" }} /> Sending...</> : <><Mail size={16} /> Send My Report</>}
        </button>
      </form>
    </div>
  );
}