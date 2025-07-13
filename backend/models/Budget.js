import mongoose from 'mongoose';

const CategoryBudgetSchema = new mongoose.Schema({
  category: String,
  budget: Number
}, { _id: false });

const BudgetSchema = new mongoose.Schema({
  firebaseUid: { type: String, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalBudget: { type: Number, required: true },
  categories: [CategoryBudgetSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Budget', BudgetSchema);
