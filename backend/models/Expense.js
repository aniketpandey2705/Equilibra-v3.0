import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  firebaseUid: { type: String, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  paymentMethod: { type: String, default: 'card' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Expense', ExpenseSchema);
