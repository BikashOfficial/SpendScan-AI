import mongoose from "mongoose";

const RecommendationSchema = new mongoose.Schema({
  type: String,
  action: String,
  saving: Number,
  reason: String,
}, { _id: false });

const ToolResultSchema = new mongoose.Schema({
  toolId: String,
  toolName: String,
  planName: String,
  currentMonthlySpend: Number,
  seats: Number,
  useCase: String,
  recommendations: [RecommendationSchema],
  potentialMonthlySaving: Number,
  potentialAnnualSaving: Number,
}, { _id: false });

const EntrySchema = new mongoose.Schema({
  id: String,
  toolId: String,
  planId: String,
  monthlySpend: Number,
  seats: Number,
  useCase: String,
}, { _id: false });

const AuditResultSchema = new mongoose.Schema({
  toolResults: [ToolResultSchema],
  redundancyWarnings: [mongoose.Schema.Types.Mixed],
  totalCurrentSpend: Number,
  totalMonthlySavings: Number,
  totalAnnualSavings: Number,
  savingsPercent: Number,
  verdict: String,
  teamSize: Number,
  generatedAt: String,
}, { _id: false });

const AuditSchema = new mongoose.Schema(
  {
    auditId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    entries: [EntrySchema],
    teamSize: { type: Number, default: 1 },
    result: AuditResultSchema,
    // Lead info — attached later via /api/leads
    leadEmail: { type: String, default: null },
    leadCaptured: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

export default mongoose.model("Audit", AuditSchema);
