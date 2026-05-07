// AI Spend Audit Engine
// All pricing verified from official vendor pages - see PRICING_DATA.md

export const TOOLS = {
  cursor: {
    name: "Cursor",
    plans: {
      hobby: { name: "Hobby", price: 0, seats: 1 },
      pro: { name: "Pro", price: 20, seats: 1 },
      business: { name: "Business", price: 40, seats: 1 },
      enterprise: { name: "Enterprise", price: null, seats: 1 },
    },
  },
  github_copilot: {
    name: "GitHub Copilot",
    plans: {
      individual: { name: "Individual", price: 10, seats: 1 },
      business: { name: "Business", price: 19, seats: 1 },
      enterprise: { name: "Enterprise", price: 39, seats: 1 },
    },
  },
  claude: {
    name: "Claude (Anthropic)",
    plans: {
      free: { name: "Free", price: 0, seats: 1 },
      pro: { name: "Pro", price: 20, seats: 1 },
      max: { name: "Max", price: 100, seats: 1 },
      team: { name: "Team", price: 30, seats: 1 },
      enterprise: { name: "Enterprise", price: null, seats: 1 },
      api: { name: "API Direct", price: null, seats: 1 },
    },
  },
  chatgpt: {
    name: "ChatGPT (OpenAI)",
    plans: {
      free: { name: "Free", price: 0, seats: 1 },
      plus: { name: "Plus", price: 20, seats: 1 },
      team: { name: "Team", price: 30, seats: 1 },
      enterprise: { name: "Enterprise", price: null, seats: 1 },
      api: { name: "API Direct", price: null, seats: 1 },
    },
  },
  anthropic_api: {
    name: "Anthropic API",
    plans: {
      api: { name: "API Direct (pay-as-you-go)", price: null, seats: 1 },
    },
  },
  openai_api: {
    name: "OpenAI API",
    plans: {
      api: { name: "API Direct (pay-as-you-go)", price: null, seats: 1 },
    },
  },
  gemini: {
    name: "Google Gemini",
    plans: {
      free: { name: "Free", price: 0, seats: 1 },
      pro: { name: "Gemini Advanced", price: 19.99, seats: 1 },
      api: { name: "API Direct", price: null, seats: 1 },
    },
  },
  windsurf: {
    name: "Windsurf (Codeium)",
    plans: {
      free: { name: "Free", price: 0, seats: 1 },
      pro: { name: "Pro", price: 15, seats: 1 },
      teams: { name: "Teams", price: 35, seats: 1 },
    },
  },
};

export const USE_CASES = [
  { value: "coding", label: "Coding / Development" },
  { value: "writing", label: "Writing / Content" },
  { value: "data", label: "Data Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / General" },
];

/**
 * Evaluate a single tool entry and return recommendations
 */
function evaluateTool(entry) {
  const { toolId, planId, monthlySpend, seats, useCase } = entry;
  const tool = TOOLS[toolId];
  if (!tool) return null;

  const plan = tool.plans[planId];
  const recommendations = [];
  let potentialSaving = 0;

  const expectedSpend = plan?.price ? plan.price * seats : monthlySpend;

  // --- Cursor evaluations ---
  if (toolId === "cursor") {
    if (planId === "business" && seats <= 2) {
      recommendations.push({
        type: "downgrade",
        action: "Downgrade to Cursor Pro",
        saving: (40 - 20) * seats,
        reason: `Business plan ($40/seat) is overkill for ${seats} user(s). Pro ($20/seat) covers individual and small teams with the same core AI features.`,
      });
      potentialSaving += (40 - 20) * seats;
    }
    if (planId === "pro" && useCase !== "coding") {
      recommendations.push({
        type: "switch",
        action: "Consider GitHub Copilot Individual instead",
        saving: 10 * seats,
        reason: `For non-coding primary use cases, GitHub Copilot Individual ($10/seat) offers similar code completion at half the cost.`,
      });
      potentialSaving += 10 * seats;
    }
    if (planId === "hobby") {
      recommendations.push({
        type: "optimal",
        action: "You're on the free plan — optimal",
        saving: 0,
        reason: "No cost, no action needed.",
      });
    }
  }

  // --- GitHub Copilot evaluations ---
  if (toolId === "github_copilot") {
    if (planId === "enterprise" && seats < 10) {
      recommendations.push({
        type: "downgrade",
        action: "Downgrade to GitHub Copilot Business",
        saving: (39 - 19) * seats,
        reason: `Enterprise ($39/seat) adds policy controls and audit logs — unnecessary for teams under 10. Business ($19/seat) has the same core AI features.`,
      });
      potentialSaving += (39 - 19) * seats;
    }
    if (planId === "business" && seats === 1) {
      recommendations.push({
        type: "downgrade",
        action: "Switch to GitHub Copilot Individual",
        saving: (19 - 10) * seats,
        reason: `Individual plan ($10/seat) is identical to Business for solo developers. Business adds team management you don't need.`,
      });
      potentialSaving += (19 - 10) * seats;
    }
  }

  // --- Claude evaluations ---
  if (toolId === "claude") {
    if (planId === "max" && useCase === "coding") {
      recommendations.push({
        type: "switch",
        action: "Consider Cursor Pro + Claude API instead",
        saving: 60,
        reason: `Claude Max ($100/mo) for coding is expensive. Cursor Pro ($20) with Claude API access (~$20/mo typical usage) gives better IDE integration at ~60% less.`,
      });
      potentialSaving += 60;
    }
    if (planId === "team" && seats <= 2) {
      recommendations.push({
        type: "downgrade",
        action: "Switch to individual Claude Pro plans",
        saving: (30 - 20) * seats,
        reason: `Team plan ($30/seat) vs Pro ($20/seat) — Team adds admin controls not needed for 2 users. Save $${(30 - 20) * seats}/mo.`,
      });
      potentialSaving += (30 - 20) * seats;
    }
    if (planId === "pro" && seats > 1) {
      recommendations.push({
        type: "upgrade",
        action: "Consider Claude Team plan for multi-seat management",
        saving: 0,
        reason: `Team plan adds collaboration features for $10 more/seat — may be worth it for ${seats}+ users needing shared context.`,
      });
    }
  }

  // --- ChatGPT evaluations ---
  if (toolId === "chatgpt") {
    if (planId === "plus" && useCase === "coding") {
      recommendations.push({
        type: "switch",
        action: "Consider Cursor or Windsurf for coding",
        saving: 5,
        reason: `ChatGPT Plus ($20/mo) for coding lacks IDE integration. Windsurf Free or Cursor Hobby ($0) gives inline code suggestions directly in your editor.`,
      });
      potentialSaving += 5;
    }
    if (planId === "team" && seats <= 2) {
      recommendations.push({
        type: "downgrade",
        action: "Switch to individual ChatGPT Plus plans",
        saving: (30 - 20) * seats,
        reason: `Team ($30/seat) vs Plus ($20/seat): Team adds workspace features irrelevant for ≤2 users. Save $${(30 - 20) * seats}/mo.`,
      });
      potentialSaving += (30 - 20) * seats;
    }
  }

  // --- Duplicate tool detection: Claude + ChatGPT ---
  // (handled in overall audit)

  // --- Windsurf evaluations ---
  if (toolId === "windsurf") {
    if (planId === "teams" && seats <= 3) {
      recommendations.push({
        type: "downgrade",
        action: "Switch to Windsurf Pro per seat",
        saving: (35 - 15) * seats,
        reason: `Teams plan ($35/seat) vs Pro ($15/seat): Teams adds admin controls not needed for ≤3 users. Save $${(35 - 15) * seats}/mo.`,
      });
      potentialSaving += (35 - 15) * seats;
    }
  }

  // --- API spend evaluations ---
  if (toolId === "anthropic_api" || toolId === "openai_api") {
    if (monthlySpend > 200) {
      recommendations.push({
        type: "credits",
        action: "Explore discounted AI credits via Credex",
        saving: Math.round(monthlySpend * 0.2),
        reason: `At $${monthlySpend}/mo API spend, discounted infrastructure credits from Credex could save ~20% ($${Math.round(monthlySpend * 0.2)}/mo) on committed usage.`,
      });
      potentialSaving += Math.round(monthlySpend * 0.2);
    }
    if (monthlySpend > 50 && monthlySpend < 200) {
      recommendations.push({
        type: "info",
        action: "Monitor usage trends",
        saving: 0,
        reason: `$${monthlySpend}/mo API spend is reasonable. Watch for sudden spikes — set budget alerts in the vendor dashboard.`,
      });
    }
  }

  // --- Gemini evaluations ---
  if (toolId === "gemini") {
    if (planId === "pro" && useCase === "coding") {
      recommendations.push({
        type: "switch",
        action: "Consider Windsurf Free for coding instead",
        saving: 19.99,
        reason: `Gemini Advanced ($20/mo) for coding lacks deep IDE integration. Windsurf Free offers inline AI coding at $0/mo.`,
      });
      potentialSaving += 19.99;
    }
  }

  // If no recommendations, mark as optimal
  if (recommendations.length === 0) {
    recommendations.push({
      type: "optimal",
      action: "Spend looks optimal for your usage",
      saving: 0,
      reason: `Your current ${tool.name} ${plan?.name || planId} plan is well-matched to your team size and use case.`,
    });
  }

  return {
    toolId,
    toolName: tool.name,
    planName: plan?.name || planId,
    currentMonthlySpend: monthlySpend,
    seats,
    useCase,
    recommendations,
    potentialMonthlySaving: potentialSaving,
    potentialAnnualSaving: potentialSaving * 12,
  };
}

/**
 * Cross-tool analysis: detect redundant subscriptions
 */
function detectRedundancy(entries) {
  const warnings = [];

  const hasCursor = entries.find((e) => e.toolId === "cursor" && e.planId !== "hobby");
  const hasWindsurf = entries.find((e) => e.toolId === "windsurf" && e.planId !== "free");
  const hasCopilot = entries.find((e) => e.toolId === "github_copilot");

  if (hasCursor && hasWindsurf) {
    const saving = Math.min(hasCursor.monthlySpend, hasWindsurf.monthlySpend);
    warnings.push({
      type: "redundancy",
      tools: ["Cursor", "Windsurf"],
      saving,
      reason: `You're paying for both Cursor and Windsurf — both are AI coding editors with overlapping features. Pick one and cancel the other. Save ~$${saving}/mo.`,
    });
  }

  if (hasCursor && hasCopilot) {
    warnings.push({
      type: "redundancy",
      tools: ["Cursor", "GitHub Copilot"],
      saving: hasCopilot.monthlySpend,
      reason: `Cursor includes Claude/GPT-4 code completion built-in. GitHub Copilot alongside it is largely redundant. Consider cancelling Copilot and saving $${hasCopilot.monthlySpend}/mo.`,
    });
  }

  const hasClaude = entries.find((e) => e.toolId === "claude");
  const hasChatGPT = entries.find((e) => e.toolId === "chatgpt");
  if (hasClaude && hasChatGPT && hasClaude.planId !== "free" && hasChatGPT.planId !== "free") {
    const smaller = Math.min(hasClaude.monthlySpend, hasChatGPT.monthlySpend);
    warnings.push({
      type: "redundancy",
      tools: ["Claude", "ChatGPT"],
      saving: smaller,
      reason: `Paying for both Claude and ChatGPT suggests overlap. For most use cases, one frontier model suffices. Consolidating could save ~$${smaller}/mo.`,
    });
  }

  return warnings;
}

/**
 * Main audit function — takes array of tool entries, returns full audit result
 */
export function runAudit(toolEntries, teamSize) {
  const activeEntries = toolEntries.filter(
    (e) => e.toolId && e.planId && (e.monthlySpend > 0 || TOOLS[e.toolId]?.plans[e.planId]?.price === 0)
  );

  const toolResults = activeEntries
    .map(evaluateTool)
    .filter(Boolean);

  const redundancyWarnings = detectRedundancy(activeEntries);

  const redundancySavings = redundancyWarnings.reduce((sum, w) => sum + (w.saving || 0), 0);
  const toolSavings = toolResults.reduce((sum, r) => sum + r.potentialMonthlySaving, 0);
  const totalMonthlySavings = toolSavings + redundancySavings;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCurrentSpend = activeEntries.reduce((sum, e) => sum + (e.monthlySpend || 0), 0);

  const savingsPercent = totalCurrentSpend > 0
    ? Math.round((totalMonthlySavings / totalCurrentSpend) * 100)
    : 0;

  let verdict = "optimal";
  if (totalMonthlySavings >= 500) verdict = "high-savings";
  else if (totalMonthlySavings >= 100) verdict = "medium-savings";
  else if (totalMonthlySavings > 0) verdict = "low-savings";

  return {
    toolResults,
    redundancyWarnings,
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsPercent,
    verdict,
    teamSize,
    generatedAt: new Date().toISOString(),
  };
}
