
import { Trash2 } from "lucide-react";
import { TOOLS, USE_CASES } from "../utils/auditEngine";

export default function ToolEntry({ entry, idx, canRemove, onUpdate, onRemove }) {
  const tool = TOOLS[entry.toolId];
  const plans = tool ? Object.entries(tool.plans) : [];

  return (
    <div className="card" style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "13px", fontFamily: "DM Mono", color: "var(--text3)" }}>
          TOOL #{idx + 1}
        </span>
        {canRemove && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onRemove} style={{ color: "var(--red)", padding: "4px 8px" }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Tool selector */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label>AI Tool</label>
          <select
            value={entry.toolId}
            onChange={e => { onUpdate("toolId", e.target.value); onUpdate("planId", ""); }}
            required
          >
            <option value="">Select a tool...</option>
            {Object.entries(TOOLS).map(([id, t]) => (
              <option key={id} value={id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Plan */}
        <div>
          <label>Plan</label>
          <select
            value={entry.planId}
            onChange={e => {
              onUpdate("planId", e.target.value);
              const plan = tool?.plans[e.target.value];
              if (plan?.price != null) onUpdate("monthlySpend", plan.price * (parseInt(entry.seats) || 1));
            }}
            disabled={!entry.toolId}
            required
          >
            <option value="">Select plan...</option>
            {plans.map(([id, p]) => (
              <option key={id} value={id}>
                {p.name}{p.price != null ? ` — $${p.price}/seat` : " — custom"}
              </option>
            ))}
          </select>
        </div>

        {/* Seats */}
        <div>
          <label>Seats / Users</label>
          <input
            type="number"
            min={1}
            value={entry.seats}
            onChange={e => {
              onUpdate("seats", e.target.value);
              const plan = tool?.plans[entry.planId];
              if (plan?.price != null) onUpdate("monthlySpend", plan.price * parseInt(e.target.value || 1));
            }}
            placeholder="1"
          />
        </div>

        {/* Monthly spend */}
        <div>
          <label>Monthly Spend ($)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={entry.monthlySpend}
            onChange={e => onUpdate("monthlySpend", e.target.value)}
            placeholder="e.g. 40"
            required
          />
        </div>

        {/* Use case */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Primary Use Case</label>
          <select value={entry.useCase} onChange={e => onUpdate("useCase", e.target.value)}>
            {USE_CASES.map(uc => (
              <option key={uc.value} value={uc.value}>{uc.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}