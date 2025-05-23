import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  appId: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, required: true }
}, {
  timestamps: true
});

export const EventModel = mongoose.model('Event', eventSchema);