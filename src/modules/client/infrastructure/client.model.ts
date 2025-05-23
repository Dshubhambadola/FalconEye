import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  appId: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const ClientModel = mongoose.model('Client', clientSchema);