import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  ruleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule', required: true },
  appId: { type: String, required: true },
  userId: { type: String, required: true },
  event: { type: mongoose.Schema.Types.Mixed, required: true },
  triggeredAt: { type: Date, required: true }
}, {
  timestamps: true
});

export const AlertModel = mongoose.model('Alert', alertSchema);