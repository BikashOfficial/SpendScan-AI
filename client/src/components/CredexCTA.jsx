// File: client/src/components/CredexCTA.jsx
import { ExternalLink } from "lucide-react";

export default function CredexCTA({ isHighSavings, totalMonthlySavings }) {
  if (!isHighSavings) return null;

  return (
    <div className="card animate-fade-up" style={{
      marginBottom: "32px",
      background: "linear-gradient(135deg, rgba(60,143,255,0.08) 0%, rgba(155,89,182,0.05) 100%)",
      border: "1px solid rgba(60,143,255,0.25)",
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div style={{ fontSize: "32px" }}>💡</div>
        <div>
          <h3 style={{ marginBottom: "8px" }}>You qualify for Credex credits</h3>
          <p style={{ color: "var(--text2)", fontSize: "15px", marginBottom: "16px" }}>
            At ${totalMonthlySavings.toFixed(0)}/mo in identified savings, you could save even more with discounted AI infrastructure credits.
            Credex sources credits from companies that overforecast — real discounts on Cursor, Claude, ChatGPT Enterprise, and more.
          </p>
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Book a Credex Consultation <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}