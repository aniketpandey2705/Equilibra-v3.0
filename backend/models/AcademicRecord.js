import mongoose from 'mongoose';

const AcademicRecordSchema = new mongoose.Schema({
  firebaseUid: { type: String, ref: 'User', required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  semester: { type: String, required: true },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('AcademicRecord', AcademicRecordSchema); 