// File: client/src/components/AISummary.jsx
import { Zap } from "lucide-react";

export default function AISummary({ aiSummary, summaryLoading }) {
  return (
    <div className="card animate-fade-up" style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Zap size={16} color="var(--accent)" />
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          AI-Generated Summary
        </span>
      </div>
      {summaryLoading ? (
        <div style={{ display: "flex", gap: "12px", alignItems: "center", color: "var(--text2)" }}>
          <div style={{ width: 16, height: 16, border: "2px solid var(--border2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          Generating personalized summary...
        </div>
      ) : (
        <p style={{ color: "var(--text2)", lineHeight: "1.8", fontSize: "16px" }}>{aiSummary}</p>
      )}
    </div>
  );
}