// File: client/src/components/RedundancyWarnings.jsx
import { AlertTriangle } from "lucide-react";

export default function RedundancyWarnings({ redundancyWarnings }) {
  if (!redundancyWarnings || redundancyWarnings.length === 0) return null;

  return (
    <div style={{ marginBottom: "24px" }}>
      <h3 style={{ fontSize: "18px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <AlertTriangle size={18} color="var(--yellow)" /> Redundant Tools Detected
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {redundancyWarnings.map((w, i) => (
          <div key={i} className="card" style={{ border: "1px solid rgba(255,211,42,0.2)", background: "rgba(255,211,42,0.03)" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span className="badge badge-yellow">{w.tools.join(" + ")}</span>
              <div>
                <p style={{ color: "var(--text)", fontSize: "14px", marginBottom: "4px" }}>{w.reason}</p>
                {w.saving > 0 && (
                  <span style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: "13px" }}>
                    Save ${w.saving}/mo
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}