// migrate-moodScore.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import JournalEntry from './models/JournalEntry.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function migrateMoodScore() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const entries = await JournalEntry.find({});
  let updated = 0;
  for (const entry of entries) {
    if ((entry.moodScore === undefined || entry.moodScore === null) && entry.aiAnalysis && typeof entry.aiAnalysis.moodRating === 'number') {
      entry.moodScore = entry.aiAnalysis.moodRating;
      await entry.save();
      updated++;
    }
  }
  console.log(`Migration complete. Updated ${updated} entries.`);
  await mongoose.disconnect();
}

migrateMoodScore().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 