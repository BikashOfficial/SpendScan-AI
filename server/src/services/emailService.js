import nodemailer from "nodemailer";

// Transporter is created lazily so dotenv has time to load first
let _transporter = null;
const getTransporter = () => {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false otherwise
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

  const savingsLine = isOptimal
    ? `<p style="color:#6b7280;">Your AI tool spend looks well-optimized. No major savings found right now.</p>`
    : `<p style="font-size:32px;font-weight:800;color:#00e5a0;margin:0;">$${totalMonthlySavings.toFixed(0)}<span style="font-size:16px;color:#9ca3af;">/mo</span></p>
       <p style="color:#6b7280;margin-top:4px;">That's <strong style="color:#111;">$${totalAnnualSavings.toFixed(0)}/year</strong> in potential savings</p>`;

  const toolRows = toolResults
    .filter((t) => t.potentialMonthlySaving > 0)
    .slice(0, 5)
    .map((t) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${t.toolName}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">${t.planName}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#00b87a;font-weight:700;text-align:right;">
          −$${t.potentialMonthlySaving.toFixed(0)}/mo
        </td>
      </tr>`)
    .join("");

  const credexBlock = isHighSavings ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin:24px 0;">
      <p style="font-weight:700;font-size:16px;margin:0 0 8px;">💡 You qualify for Credex credits</p>
      <p style="color:#374151;margin:0 0 16px;font-size:14px;">
        At $${totalMonthlySavings.toFixed(0)}/mo in identified savings, discounted AI infrastructure credits 
        from Credex could save you an additional 15–25% on committed usage.
      </p>
      <a href="https://credex.rocks" style="background:#111;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        Book a Credex Consultation →
      </a>
    </div>` : "";

  const shareUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/r/${auditId}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background:#0a0a0f;padding:32px;text-align:center;">
      <p style="color:#00e5a0;font-weight:800;font-size:20px;margin:0;letter-spacing:-0.02em;">
        ● SpendScan AI
      </p>
      <p style="color:#9ca3af;font-size:13px;margin:8px 0 0;">Your AI Spend Audit Report</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="font-size:22px;font-weight:700;margin:0 0 8px;color:#111;">
        ${isOptimal ? "Your spend looks optimized 👍" : "We found savings in your stack"}
      </h2>
      <p style="color:#6b7280;margin:0 0 24px;">Here's a summary of your audit results.</p>

      <!-- Savings hero -->
      <div style="background:#f9fafb;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        ${savingsLine}
      </div>

      <!-- Tool breakdown -->
      ${toolRows ? `
      <h3 style="font-size:15px;font-weight:600;color:#374151;margin:0 0 12px;">Top savings opportunities</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${toolRows}
      </table>` : ""}

      <!-- Credex CTA -->
      ${credexBlock}

      <!-- Share link -->
      <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 8px;">📎 Share your audit</p>
        <a href="${shareUrl}" style="color:#3b82f6;font-size:13px;word-break:break-all;">${shareUrl}</a>
      </div>

      <p style="color:#9ca3af;font-size:12px;margin:0;">
        Pricing data is sourced from official vendor pages and verified weekly. 
        This audit is provided free by <a href="https://credex.rocks" style="color:#3b82f6;">Credex</a>.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center;">
        SpendScan AI by Credex · <a href="https://credex.rocks" style="color:#6b7280;">credex.rocks</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const info = await getTransporter().sendMail({
      from: FROM_EMAIL(),
      to,
      subject: isOptimal
        ? "Your AI Spend Audit — You're spending well ✅"
        : `Your AI Spend Audit — $${totalMonthlySavings.toFixed(0)}/mo in potential savings found`,
      html,
    });

    console.log(`✅ Email sent to ${to} — messageId: ${info.messageId}`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Email send failed:", err.message);
    return { success: false, reason: err.message };
  }
}