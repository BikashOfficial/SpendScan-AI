import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash2, ArrowRight, Info } from "lucide-react";
import { useAuditStore } from "../store/auditStore";
import { TOOLS, USE_CASES, runAudit } from "../utils/auditEngine";
import axios from "axios";
import ToolEntry from "../components/ToolEntry";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AuditPage() {
  const navigate = useNavigate();
  const {
    entries, teamSize, addEntry, removeEntry, updateEntry, setTeamSize, setAuditResult
  } = useAuditStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = entries.filter(en => en.toolId && en.planId);
    if (valid.length === 0) {
      setError("Please add at least one AI tool.");
      return;
    }
    setError("");
    setLoading(true);

    // Ensure monthlySpend is number
    const normalized = valid.map(en => ({
      ...en,
      monthlySpend: parseFloat(en.monthlySpend) || 0,
      seats: parseInt(en.seats) || 1,
    }));

    const result = runAudit(normalized, parseInt(teamSize) || 1);

    try {
      // Save to backend and get audit ID
      const res = await axios.post(`${API_BASE}/api/audits`, {
        entries: normalized,
        teamSize: parseInt(teamSize) || 1,
        result,
      });
      setAuditResult(result, res.data.auditId);
    } catch {
      // If backend unavailable, still show results with local ID
      const localId = Math.random().toString(36).slice(2, 10);
      setAuditResult(result, localId);
    }

    setLoading(false);
    navigate("/results");
  };

  return (
    <div>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="logo">
            <span className="logo-dot" />
            SpendScan AI
          </Link>
          <span style={{ color: "var(--text2)", fontSize: "14px" }}>Step 1 of 2 — Enter your tools</span>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: "760px", padding: "60px 24px" }}>
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", marginBottom: "12px" }}>
            What AI tools does your team pay for?
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "16px" }}>
            Add each tool, plan, and monthly spend. We'll find where you're overpaying.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Team size */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <label>Team Size (total engineers / AI users)</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={teamSize}
              onChange={e => setTeamSize(e.target.value)}
              style={{ maxWidth: "200px" }}
              placeholder="e.g. 5"
            />
          </div>

          {/* Tool entries */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
            {entries.map((entry, idx) => (
              <ToolEntry
                key={entry.id}
                entry={entry}
                idx={idx}
                canRemove={entries.length > 1}
                onUpdate={(field, val) => updateEntry(entry.id, field, val)}
                onRemove={() => removeEntry(entry.id)}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={addEntry}
            style={{ width: "100%", marginBottom: "32px" }}
          >
            <Plus size={16} /> Add Another Tool
          </button>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.25)", borderRadius: "var(--radius)", color: "var(--red)", marginBottom: "20px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Analyzing...</> : <>Run My Audit <ArrowRight size={18} /></>}
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "16px", color: "var(--text3)", fontSize: "13px" }}>
            <Info size={14} style={{ marginTop: "2px", flexShrink: 0 }} />
            <span>Your data is stored privately. Only anonymized tool/savings data is shown on shared links.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
