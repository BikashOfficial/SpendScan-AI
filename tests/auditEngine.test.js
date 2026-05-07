/**
 * Audit Engine Tests
 * Run: npm test
 */

import { runAudit } from "../client/src/utils/auditEngine.js";

// Test 1: Detects Cursor Business overkill for small team
test("flags Cursor Business as overkill for 1-2 users", () => {
  const entries = [{
    id: "1", toolId: "cursor", planId: "business",
    monthlySpend: 80, seats: 2, useCase: "coding"
  }];
  const result = runAudit(entries, 2);
  const cursorResult = result.toolResults[0];
  expect(cursorResult.potentialMonthlySaving).toBeGreaterThan(0);
  const rec = cursorResult.recommendations.find(r => r.type === "downgrade");
  expect(rec).toBeDefined();
  expect(rec.saving).toBe(40); // (40-20) * 2 seats
});

// Test 2: Optimal spend returns correct verdict
test("returns optimal verdict when no savings found", () => {
  const entries = [{
    id: "2", toolId: "cursor", planId: "hobby",
    monthlySpend: 0, seats: 1, useCase: "coding"
  }];
  const result = runAudit(entries, 1);
  expect(result.verdict).toBe("optimal");
  expect(result.totalMonthlySavings).toBe(0);
});

// Test 3: Detects Cursor + Copilot redundancy
test("detects redundancy between Cursor and GitHub Copilot", () => {
  const entries = [
    { id: "1", toolId: "cursor", planId: "pro", monthlySpend: 20, seats: 1, useCase: "coding" },
    { id: "2", toolId: "github_copilot", planId: "individual", monthlySpend: 10, seats: 1, useCase: "coding" }
  ];
  const result = runAudit(entries, 1);
  expect(result.redundancyWarnings.length).toBeGreaterThan(0);
  const redundancy = result.redundancyWarnings.find(w =>
    w.tools.includes("Cursor") && w.tools.includes("GitHub Copilot")
  );
  expect(redundancy).toBeDefined();
});

// Test 4: High savings verdict triggers correctly
test("triggers high-savings verdict when savings >= 500", () => {
  const entries = [
    { id: "1", toolId: "anthropic_api", planId: "api", monthlySpend: 3000, seats: 1, useCase: "mixed" },
    { id: "2", toolId: "openai_api", planId: "api", monthlySpend: 2000, seats: 1, useCase: "mixed" }
  ];
  const result = runAudit(entries, 5);
  expect(result.verdict).toBe("high-savings");
  expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(500);
});

// Test 5: Annual savings is exactly 12x monthly savings
test("annual savings equals 12x monthly savings", () => {
  const entries = [{
    id: "1", toolId: "github_copilot", planId: "enterprise",
    monthlySpend: 195, seats: 5, useCase: "coding"
  }];
  const result = runAudit(entries, 5);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});

// Test 6: GitHub Copilot Enterprise → Business downgrade for small team
test("recommends Copilot Business over Enterprise for small teams", () => {
  const entries = [{
    id: "1", toolId: "github_copilot", planId: "enterprise",
    monthlySpend: 39, seats: 1, useCase: "coding"
  }];
  const result = runAudit(entries, 1);
  const saving = result.toolResults[0].potentialMonthlySaving;
  expect(saving).toBe(20); // (39-19) * 1
});

// Test 7: Empty entries returns safe result
test("handles empty tool entries gracefully", () => {
  const result = runAudit([], 1);
  expect(result.totalMonthlySavings).toBe(0);
  expect(result.toolResults).toHaveLength(0);
  expect(result.verdict).toBe("optimal");
});

// Test 8: Claude + ChatGPT both paid → redundancy warning
test("detects Claude + ChatGPT redundancy when both paid", () => {
  const entries = [
    { id: "1", toolId: "claude", planId: "pro", monthlySpend: 20, seats: 1, useCase: "writing" },
    { id: "2", toolId: "chatgpt", planId: "plus", monthlySpend: 20, seats: 1, useCase: "writing" }
  ];
  const result = runAudit(entries, 1);
  const redundancy = result.redundancyWarnings.find(w =>
    w.tools.includes("Claude") && w.tools.includes("ChatGPT")
  );
  expect(redundancy).toBeDefined();
});
