import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  appId: { type: String, required: true },
  name: { type: String, required: true },
  eventType: { type: String, required: true },
  field: { type: String, required: true },
  condition: {
    max: { type: Number, required: true },
    windowSeconds: { type: Number, required: true },
  },
  enabled: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const RuleModel = mongoose.model('Rule', ruleSchema);