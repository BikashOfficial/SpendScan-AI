# Tests — SpendScan AI

## Running Tests

```bash
npm test
```

## Test Files

### `tests/auditEngine.test.js`

Tests for the core audit engine in `src/utils/auditEngine.js`.

| Test | What It Covers |
|------|---------------|
| Cursor Business overkill | Flags Business plan ($40/seat) as wasteful for ≤2 users; verifies correct $40 saving |
| Optimal verdict | Hobby/free plan returns `verdict: "optimal"` and $0 savings |
| Cursor + Copilot redundancy | Cross-tool detection catches paying for both simultaneously |
| High-savings verdict trigger | Ensures `verdict: "high-savings"` fires when savings ≥ $500/mo |
| Annual = 12× monthly | Data integrity check: `totalAnnualSavings === totalMonthlySavings * 12` |
| Copilot Enterprise → Business | Correct saving calculation: (39-19) × seats |
| Empty entries gracefully handled | `runAudit([])` doesn't throw, returns safe defaults |
| Claude + ChatGPT redundancy | Both paid plans triggers redundancy warning |

## Coverage Notes

The audit engine is the most critical business logic in the codebase — it's the thing a "finance person should read and agree with" per the spec. These tests cover:
- Plan downgrade recommendations
- Cross-tool redundancy detection
- Verdict classification logic
- Mathematical integrity (annual = 12× monthly)
- Edge cases (empty input, free plans)

Frontend component tests and API route tests are not included in this submission but would be added in week 2 using React Testing Library and Supertest respectively.
