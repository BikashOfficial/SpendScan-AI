import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TrendingDown, CheckCircle, ExternalLink } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function SharedResultPage() {
  const { auditId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchAudit();
    // Update page meta for OG
    document.title = "AI Spend Audit Results — SpendScan AI";
  }, [auditId]);

  const fetchAudit = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/audits/${auditId}/public`);
      setData(res.data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "var(--text2)" }}>Loading audit...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center" }}>
      <div>
        <h2 style={{ marginBottom: "12px" }}>Audit not found</h2>
        <p style={{ color: "var(--text2)", marginBottom: "24px" }}>This link may have expired or never existed.</p>
        <Link to="/audit" className="btn btn-primary">Run Your Own Audit</Link>
      </div>
    </div>
  );

  const { result, toolCount } = data;
  const { totalMonthlySavings, totalAnnualSavings, totalCurrentSpend, verdict, toolResults, redundancyWarnings } = result;
  const isOptimal = verdict === "optimal";

  return (
    <div>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="logo"><span className="logo-dot" />SpendScan AI</Link>
          <Link to="/audit" className="btn btn-primary btn-sm">Run My Audit →</Link>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: "860px", padding: "60px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "var(--text3)", fontSize: "13px", fontFamily: "DM Mono", marginBottom: "12px" }}>
            SHARED AUDIT RESULT
          </p>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", marginBottom: "12px" }}>
            AI Spend Audit — {toolCount} tool{toolCount !== 1 ? "s" : ""} analyzed
          </h1>
        </div>

        {/* Hero */}
        <div className="card" style={{
          marginBottom: "32px",
          border: isOptimal ? "1px solid var(--card-border)" : "1px solid rgba(0,229,160,0.2)",
          padding: "40px",
        }}>
          {isOptimal ? (
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <CheckCircle size={32} color="var(--accent)" />
              <div>
                <h2>Optimized Spend</h2>
                <p style={{ color: "var(--text2)", marginTop: "4px" }}>
                  ${totalCurrentSpend}/mo · No major savings found
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="badge badge-green" style={{ marginBottom: "16px" }}>
                <TrendingDown size={12} /> Potential Savings Found
              </div>
              <div className="saving-hero">${totalMonthlySavings.toFixed(0)}<span style={{ fontSize: "0.4em", color: "var(--text2)" }}>/mo</span></div>
              <p style={{ color: "var(--text2)", marginTop: "12px", fontSize: "16px" }}>
                ${totalAnnualSavings.toFixed(0)}/year from ${totalCurrentSpend}/mo current spend
              </p>
            </>
          )}
        </div>

        {/* Tool summary (anonymized) */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Tools in this audit</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {toolResults.map((r, i) => (
              <div key={i} style={{ display: "flex", align: "center", gap: "8px", padding: "8px 16px", background: "var(--bg2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{r.toolName}</span>
                {r.potentialMonthlySaving > 0 && (
                  <span style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: "12px" }}>
                    −${r.potentialMonthlySaving.toFixed(0)}/mo
                  </span>
                )}
              </div>
            ))}
          </div>
          {redundancyWarnings.length > 0 && (
            <p style={{ marginTop: "12px", color: "var(--yellow)", fontSize: "14px" }}>
              ⚠️ {redundancyWarnings.length} redundant tool overlap{redundancyWarnings.length > 1 ? "s" : ""} detected
            </p>
          )}
        </div>

        <div className="divider" />

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "16px" }}>
            How much is your team spending on AI?
          </h2>
          <p style={{ color: "var(--text2)", marginBottom: "32px", fontSize: "16px" }}>
            Run your own free audit in 2 minutes. No login required.
          </p>
          <Link to="/audit" className="btn btn-primary btn-lg">
            Run My Free Audit <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
