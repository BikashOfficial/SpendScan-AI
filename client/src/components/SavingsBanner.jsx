// File: client/src/components/SavingsBanner.jsx
import { CheckCircle, TrendingDown } from "lucide-react";

export default function SavingsBanner({ verdict, totalMonthlySavings, totalAnnualSavings, savingsPercent, totalCurrentSpend }) {
  const isOptimal = verdict === "optimal";

  return (
    <div className="card animate-fade-up" style={{
      marginBottom: "32px",
      background: isOptimal ? "var(--card)" : "linear-gradient(135deg, rgba(0,229,160,0.05) 0%, rgba(0,184,122,0.02) 100%)",
      border: isOptimal ? "1px solid var(--card-border)" : "1px solid rgba(0,229,160,0.2)",
      padding: "40px",
    }}>
      {isOptimal ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <CheckCircle size={28} color="var(--accent)" />
            <h2 style={{ fontSize: "24px" }}>You're spending well 👍</h2>
          </div>
          <p style={{ color: "var(--text2)" }}>
            Your current AI spend of <strong style={{ color: "var(--text)" }}>${totalCurrentSpend}/mo</strong> looks optimized.
            No major savings found — you're on the right plans.
          </p>
        </>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", alignItems: "center" }}>
          <div>
            <div className="badge badge-green" style={{ marginBottom: "16px" }}>
              <TrendingDown size={12} /> Savings Found
            </div>
            <div className="saving-hero">${totalMonthlySavings.toFixed(0)}<span style={{ fontSize: "0.4em", color: "var(--text2)" }}>/mo</span></div>
            <p style={{ color: "var(--text2)", marginTop: "8px", fontSize: "16px" }}>
              That's <strong style={{ color: "var(--accent)" }}>${totalAnnualSavings.toFixed(0)}/year</strong> — {savingsPercent}% of your current ${totalCurrentSpend}/mo spend
            </p>
          </div>
        </div>
      )}
    </div>
  );
}