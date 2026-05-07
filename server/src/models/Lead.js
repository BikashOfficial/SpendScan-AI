import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    company: { type: String, trim: true, default: "" },
    role: { type: String, default: "" },
    auditId: {
      type: String,
      required: true,
      index: true,
    },
    totalMonthlySavings: { type: Number, default: 0 },
    verdict: { type: String, default: "" },
    // Abuse protection
    honeypot: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate leads for same email + auditId
LeadSchema.index({ email: 1, auditId: 1 }, { unique: true });

export default mongoose.model("Lead", LeadSchema);
