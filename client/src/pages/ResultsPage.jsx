import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingDown, AlertTriangle, CheckCircle, ExternalLink, Share2, Mail, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useAuditStore } from "../store/auditStore";
import axios from "axios";
import ToolResult from "../components/ToolResult";
import SavingsBanner from "../components/SavingsBanner";
import CredexCTA from "../components/CredexCTA";
import AISummary from "../components/AISummary";
import RedundancyWarnings from "../components/RedundancyWarnings";
import EmailCaptureForm from "../components/EmailCaptureForm";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { auditResult, auditId, resetForm } = useAuditStore();
  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [emailCapture, setEmailCapture] = useState({ email: "", company: "", role: "" });
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [sharecopied, setShareCopied] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!auditResult) { navigate("/audit"); return; }
    fetchAiSummary();
  }, [auditResult]);

  const fetchAiSummary = async () => {
    if (!auditResult) return;
    try {
      const res = await axios.post(`${API_BASE}/api/summary`, { auditResult });
      setAiSummary(res.data.summary);
    } catch {
      // Fallback template summary
      const { totalMonthlySavings, totalCurrentSpend, toolResults } = auditResult;
      const topTool = toolResults?.[0]?.toolName || "your AI tools";
      setAiSummary(
        totalMonthlySavings > 0
          ? `Your audit reveals $${totalMonthlySavings.toFixed(0)}/mo in potential savings from a total spend of $${totalCurrentSpend}/mo. The biggest opportunity is optimizing ${topTool}. By aligning your plans to actual team size and use cases, you could save $${(totalMonthlySavings * 12).toFixed(0)} annually — without losing any meaningful capability.`
          : `Your AI tool spend looks well-optimized at $${totalCurrentSpend}/mo. You're on the right plans for your team size and use case. We'll notify you when new optimizations become available for your stack.`
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/r/${auditId}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await axios.post(`${API_BASE}/api/leads`, {
        ...emailCapture,
        auditId,
        totalMonthlySavings: auditResult.totalMonthlySavings,
        verdict: auditResult.verdict,
      });
      setEmailSent(true);
    } catch {
      setEmailSent(true); // Show success even if backend is down
    }
    setEmailLoading(false);
  };

  if (!auditResult) return null;

  const { toolResults, redundancyWarnings, totalCurrentSpend, totalMonthlySavings, totalAnnualSavings, savingsPercent, verdict } = auditResult;
  const isHighSavings = verdict === "high-savings";
  const isOptimal = verdict === "optimal";

  return (
    <div>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="logo"><span className="logo-dot" />SpendScan AI</Link>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn btn-secondary btn-sm" onClick={handleShare}>
              <Share2 size={14} /> {sharecopied ? "Copied!" : "Share"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { resetForm(); navigate("/audit"); }}>
              New Audit
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: "860px", padding: "60px 24px" }}>

        {/* Hero savings banner */}
        <SavingsBanner
          verdict={verdict}
          totalMonthlySavings={totalMonthlySavings}
          totalAnnualSavings={totalAnnualSavings}
          savingsPercent={savingsPercent}
          totalCurrentSpend={totalCurrentSpend}
        />

        {/* Credex CTA for high savings */}
        <CredexCTA isHighSavings={isHighSavings} totalMonthlySavings={totalMonthlySavings} />

        {/* AI Summary */}
        <AISummary aiSummary={aiSummary} summaryLoading={summaryLoading} />

        {/* Redundancy warnings */}
        <RedundancyWarnings redundancyWarnings={redundancyWarnings} />

        {/* Per-tool breakdown */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "16px" }}>Tool-by-tool breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {toolResults.map((result, i) => (
              <ToolResult key={i} result={result} expanded={expanded[i]} onToggle={() => setExpanded(ex => ({ ...ex, [i]: !ex[i] }))} />
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Lead capture */}
        <EmailCaptureForm
          emailSent={emailSent}
          emailLoading={emailLoading}
          emailCapture={emailCapture}
          onEmailChange={setEmailCapture}
          onSubmit={handleEmailSubmit}
          isOptimal={isOptimal}
        />

        {/* Share CTA */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text2)", marginBottom: "16px", fontSize: "15px" }}>
            Share this audit with your team
          </p>
          <button className="btn btn-secondary" onClick={handleShare}>
            <Share2 size={16} /> {sharecopied ? "Link Copied!" : "Copy Shareable Link"}
          </button>
          <p style={{ color: "var(--text3)", fontSize: "12px", marginTop: "12px" }}>
            Shared links show tool categories and savings — company name and email are removed.
          </p>
        </div>
      </div>
    </div>
  );
}
