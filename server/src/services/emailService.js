import nodemailer from "nodemailer";

// Transporter is created lazily so dotenv has time to load first
let _transporter = null;
const getTransporter = () => {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return _transporter;
};

const FROM_EMAIL = () => process.env.FROM_EMAIL || `SpendScan AI <${process.env.SMTP_USER}>`;

export async function sendAuditEmail({ to, totalMonthlySavings, totalAnnualSavings, verdict, auditId, toolResults = [] }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️  SMTP_USER / SMTP_PASS not set — skipping email");
    return { success: false, reason: "no_smtp_credentials" };
  }

  const isHighSavings = verdict === "high-savings";
  const isOptimal = verdict === "optimal";

  // ── Savings Hero Block ─────────────────────────────────────────
  const savingsHero = isOptimal
    ? `
      <div style="text-align:center;padding:8px 0 4px;">
        <div style="display:inline-block;background:#dcfce7;color:#15803d;font-size:12px;font-weight:700;letter-spacing:0.06em;padding:4px 12px;border-radius:999px;text-transform:uppercase;margin-bottom:12px;">✓ OPTIMIZED</div>
        <p style="font-size:18px;font-weight:700;color:#111827;margin:0 0 6px;">Your AI spend looks well-optimized 👍</p>
        <p style="font-size:14px;color:#6b7280;margin:0;">No major savings found right now. We'll monitor for better options.</p>
      </div>`
    : `
      <div style="text-align:center;padding:8px 0 4px;">
        <div style="display:inline-block;background:rgba(0,229,160,0.12);color:#00b87a;font-size:12px;font-weight:700;letter-spacing:0.06em;padding:4px 14px;border-radius:999px;text-transform:uppercase;margin-bottom:16px;">💰 SAVINGS FOUND</div>
        <div style="font-size:52px;font-weight:900;color:#00e5a0;line-height:1;letter-spacing:-0.03em;margin-bottom:4px;">
          $${totalMonthlySavings.toFixed(0)}<span style="font-size:22px;font-weight:500;color:#6b7280;">/mo</span>
        </div>
        <p style="font-size:15px;color:#9ca3af;margin:8px 0 0;">
          That's <strong style="color:#f9fafb;">$${totalAnnualSavings.toFixed(0)}/year</strong> back in your budget
        </p>
      </div>`;

  // ── Tool Rows ──────────────────────────────────────────────────
  const topTools = toolResults.filter((t) => t.potentialMonthlySaving > 0).slice(0, 5);
  const toolRowsHtml = topTools.length > 0
    ? `
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <thead>
        <tr>
          <th style="text-align:left;font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:0.08em;text-transform:uppercase;padding:0 0 10px;border-bottom:1px solid #1f2937;">Tool</th>
          <th style="text-align:left;font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:0.08em;text-transform:uppercase;padding:0 0 10px;border-bottom:1px solid #1f2937;">Current Plan</th>
          <th style="text-align:right;font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:0.08em;text-transform:uppercase;padding:0 0 10px;border-bottom:1px solid #1f2937;">Savings</th>
        </tr>
      </thead>
      <tbody>
        ${topTools.map((t, i) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1f2937;font-weight:600;font-size:14px;color:#f9fafb;">${t.toolName}</td>
          <td style="padding:12px 0;border-bottom:1px solid #1f2937;font-size:13px;color:#6b7280;">${t.planName}</td>
          <td style="padding:12px 0;border-bottom:1px solid #1f2937;text-align:right;">
            <span style="background:rgba(0,229,160,0.1);color:#00e5a0;font-weight:700;font-size:13px;padding:3px 10px;border-radius:6px;">
              −$${t.potentialMonthlySaving.toFixed(0)}/mo
            </span>
          </td>
        </tr>`).join("")}
      </tbody>
    </table>`
    : "";

  // ── Credex CTA ─────────────────────────────────────────────────
  const credexBlock = isHighSavings
    ? `
    <div style="background:linear-gradient(135deg,rgba(60,143,255,0.12) 0%,rgba(139,92,246,0.08) 100%);border:1px solid rgba(60,143,255,0.25);border-radius:14px;padding:24px;margin-bottom:28px;">
      <p style="font-size:16px;font-weight:700;color:#f9fafb;margin:0 0 8px;">💡 You qualify for Credex credits</p>
      <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 20px;">
        At <strong style="color:#f9fafb;">$${totalMonthlySavings.toFixed(0)}/mo</strong> in identified savings, 
        discounted AI infrastructure credits from Credex could save you an additional 15–25% on committed usage 
        across Cursor, Claude, ChatGPT Enterprise, and more.
      </p>
      <a href="https://credex.rocks" 
         style="display:inline-block;background:linear-gradient(135deg,#00e5a0,#00b87a);color:#0a0a0f;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:-0.01em;">
        Book a Free Consultation →
      </a>
    </div>`
    : "";

  // ── Share Link ─────────────────────────────────────────────────
  const shareUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/r/${auditId}`;

  // ── Full HTML Template ─────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>SpendScan AI Report</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- ── HEADER ─────────────────────────────────────── -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1117 0%,#111827 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;border:1px solid #1f2937;border-bottom:none;">
              <!-- Logo -->
              <div style="margin-bottom:20px;">
                <span style="display:inline-flex;align-items:center;gap:8px;font-size:20px;font-weight:800;color:#f9fafb;letter-spacing:-0.03em;">
                  <span style="display:inline-block;width:10px;height:10px;background:#00e5a0;border-radius:50%;"></span>
                  SpendScan AI
                </span>
              </div>
              <!-- Divider -->
              <div style="height:1px;background:linear-gradient(90deg,transparent,#1f2937,transparent);margin-bottom:20px;"></div>
              <!-- Savings hero on dark bg -->
              ${savingsHero}
            </td>
          </tr>

          <!-- ── BODY ───────────────────────────────────────── -->
          <tr>
            <td style="background:#161b22;padding:32px 40px;border:1px solid #1f2937;border-top:none;">

              <!-- Intro -->
              <p style="font-size:15px;color:#9ca3af;margin:0 0 28px;line-height:1.6;">
                Hi there, here's a full breakdown of your AI spend audit. 
                ${isOptimal 
                  ? "Your stack is well-optimised — we'll alert you when better options emerge."
                  : "We've identified opportunities to reduce your monthly spend without losing capability."}
              </p>

              <!-- Tool breakdown -->
              ${toolRowsHtml 
                ? `<p style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;margin:0 0 14px;">Top Savings Opportunities</p>
                   ${toolRowsHtml}`
                : ""}

              <!-- Credex CTA -->
              ${credexBlock}

              <!-- Share link box -->
              <div style="background:#0d1117;border:1px solid #1f2937;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
                <p style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;margin:0 0 10px;">🔗 Your Shareable Audit Link</p>
                <a href="${shareUrl}" 
                   style="color:#3b82f6;font-size:13px;word-break:break-all;text-decoration:none;">
                  ${shareUrl}
                </a>
                <p style="color:#4b5563;font-size:12px;margin:10px 0 0;">
                  Share this link with your team — company names and emails are never included in shared views.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${shareUrl}" 
                   style="display:inline-block;background:linear-gradient(135deg,#00e5a0,#00b87a);color:#0a0a0f;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px;letter-spacing:-0.02em;">
                  View Full Audit Report →
                </a>
              </div>

              <!-- Disclaimer -->
              <p style="color:#374151;font-size:12px;line-height:1.6;margin:0;border-top:1px solid #1f2937;padding-top:20px;">
                Pricing data is sourced from official vendor pages and updated weekly. 
                Savings are estimates based on publicly available plan pricing. 
                This report is provided free by <a href="https://credex.rocks" style="color:#6b7280;text-decoration:none;">Credex</a>.
              </p>
            </td>
          </tr>

          <!-- ── FOOTER ─────────────────────────────────────── -->
          <tr>
            <td style="background:#0d1117;padding:20px 40px;border-radius:0 0 16px 16px;border:1px solid #1f2937;border-top:none;text-align:center;">
              <p style="color:#4b5563;font-size:12px;margin:0;">
                <strong style="color:#6b7280;">SpendScan AI</strong> · A free tool by 
                <a href="https://credex.rocks" style="color:#6b7280;text-decoration:none;">Credex</a> · 
                Discounted AI infrastructure credits
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  try {
    const info = await getTransporter().sendMail({
      from: FROM_EMAIL(),
      to,
      subject: isOptimal
        ? "✅ Your AI Spend Audit — You're spending well"
        : `💰 Your AI Spend Audit — $${totalMonthlySavings.toFixed(0)}/mo in savings found`,
      html,
    });

    console.log(`✅ Email sent to ${to} — messageId: ${info.messageId}`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Email send failed:", err.message);
    return { success: false, reason: err.message };
  }
}