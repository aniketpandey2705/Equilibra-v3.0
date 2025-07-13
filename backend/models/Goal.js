import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  firebaseUid: { type: String, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetDate: { type: Date },
  completed: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Goal', GoalSchema);
