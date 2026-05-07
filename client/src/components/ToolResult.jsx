// File: client/src/components/ToolResult.jsx
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ToolResult({ result, expanded, onToggle }) {
  const { toolName, planName, currentMonthlySpend, seats, recommendations, potentialMonthlySaving } = result;
  const isOptimal = potentialMonthlySaving === 0;
  const hasHighSaving = potentialMonthlySaving >= 50;

  const typeColor = {
    optimal: "var(--accent)",
    downgrade: "var(--yellow)",
    switch: "var(--blue)",
    redundancy: "var(--red)",
    credits: "var(--accent)",
    upgrade: "var(--text2)",
    info: "var(--text3)",
  };

  return (
    <div className="card" style={{ cursor: "pointer" }} onClick={onToggle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>{toolName}</div>
            <div style={{ color: "var(--text3)", fontSize: "13px", fontFamily: "DM Mono" }}>
              {planName} · {seats} seat{seats > 1 ? "s" : ""} · ${currentMonthlySpend}/mo
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isOptimal ? (
            <span className="badge badge-green">Optimal</span>
          ) : (
            <span style={{ fontFamily: "DM Mono", fontWeight: 600, color: hasHighSaving ? "var(--accent)" : "var(--yellow)", fontSize: "14px" }}>
              Save ${potentialMonthlySaving.toFixed(0)}/mo
            </span>
          )}
          {expanded ? <ChevronUp size={16} color="var(--text3)" /> : <ChevronDown size={16} color="var(--text3)" />}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: "20px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
          {recommendations.map((rec, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", padding: "12px", background: "var(--bg2)", borderRadius: "var(--radius)" }}>
              <div style={{ width: "4px", background: typeColor[rec.type] || "var(--text3)", borderRadius: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px", color: typeColor[rec.type] }}>
                  {rec.action}
                </div>
                <div style={{ color: "var(--text2)", fontSize: "13px", lineHeight: "1.6" }}>{rec.reason}</div>
                {rec.saving > 0 && (
                  <div style={{ marginTop: "6px", fontFamily: "DM Mono", fontSize: "12px", color: "var(--accent)" }}>
                    → ${rec.saving.toFixed(0)}/mo · ${(rec.saving * 12).toFixed(0)}/yr
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}