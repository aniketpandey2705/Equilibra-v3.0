import mongoose from 'mongoose';

const AIAnalysisSchema = new mongoose.Schema({
  summary: { type: String },
  moodRating: { type: Number, min: 0, max: 10 },
  moodLabel: { type: String },
  keyThemes: [String],
  insights: { type: String },
  sentiment: { type: Number, min: -1, max: 1 },
  wordCount: { type: Number, default: 0 }
}, { _id: false });

const JournalEntrySchema = new mongoose.Schema({
  firebaseUid: { type: String, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String },
  moodScore: { type: Number, min: 0, max: 10 },
  tags: [String],
  date: { type: Date, required: true },
  aiAnalysis: AIAnalysisSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('JournalEntry', JournalEntrySchema);
