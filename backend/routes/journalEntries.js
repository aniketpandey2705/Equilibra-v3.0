import express from 'express';
import JournalEntry from '../models/JournalEntry.js';

const router = express.Router();

// Mock AI Analysis Service (same as in app.js)
const generateAIAnalysis = (content) => {
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Simple sentiment analysis based on positive/negative words
  const positiveWords = ['happy', 'great', 'good', 'excellent', 'wonderful', 'amazing', 'love', 'joy', 'success', 'achievement', 'grateful', 'blessed', 'excited', 'motivated', 'inspired'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'disappointed', 'worried', 'anxious', 'stressed', 'tired', 'exhausted'];
  
  const positiveCount = words.filter(word => positiveWords.includes(word.toLowerCase())).length;
  const negativeCount = words.filter(word => negativeWords.includes(word.toLowerCase())).length;
  
  const sentiment = Math.max(-1, Math.min(1, (positiveCount - negativeCount) / Math.max(wordCount, 1)));
  const moodRating = Math.max(1, Math.min(10, 5 + (sentiment * 5)));
  
  // Generate mood labels
  const moodLabels = {
    'very_positive': ['Excited', 'Happy', 'Grateful', 'Accomplished'],
    'positive': ['Content', 'Satisfied', 'Hopeful', 'Motivated'],
    'neutral': ['Neutral', 'Calm', 'Focused', 'Contemplative'],
    'negative': ['Concerned', 'Frustrated', 'Tired', 'Stressed'],
    'very_negative': ['Sad', 'Angry', 'Anxious', 'Overwhelmed']
  };
  
  let moodCategory = 'neutral';
  if (sentiment > 0.3) moodCategory = 'positive';
  else if (sentiment > 0.1) moodCategory = 'positive';
  else if (sentiment < -0.3) moodCategory = 'very_negative';
  else if (sentiment < -0.1) moodCategory = 'negative';
  
  const moodLabel = moodLabels[moodCategory][Math.floor(Math.random() * moodLabels[moodCategory].length)];
  
  // Extract key themes (simplified)
  const commonThemes = ['work', 'family', 'health', 'learning', 'creativity', 'relationships', 'goals', 'reflection', 'challenges', 'success', 'growth', 'stress', 'happiness', 'productivity'];
  const foundThemes = commonThemes.filter(theme => content.toLowerCase().includes(theme));
  const keyThemes = foundThemes.length > 0 ? foundThemes.slice(0, 3) : ['general', 'daily', 'reflection'];
  
  // Generate insights
  const insights = [
    'Showing positive emotional patterns',
    'Demonstrating resilience and growth mindset',
    'Strong focus on personal development',
    'Balanced perspective on challenges',
    'High engagement with daily activities',
    'Reflective and self-aware writing style'
  ];
  
  return {
    summary: `Entry with ${wordCount} words showing ${moodLabel.toLowerCase()} mood`,
    moodRating: Math.round(moodRating * 10) / 10,
    moodLabel,
    keyThemes,
    insights: insights[Math.floor(Math.random() * insights.length)],
    sentiment: Math.round(sentiment * 100) / 100,
    wordCount
  };
};

// Create
router.post('/', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    // Generate AI analysis if content is provided
    let aiAnalysis = null;
    if (req.body.content) {
      aiAnalysis = generateAIAnalysis(req.body.content);
    }
    const moodScore = (aiAnalysis && aiAnalysis.moodRating) || (req.body.aiAnalysis && req.body.aiAnalysis.moodRating) || null;
    const entry = new JournalEntry({ 
      ...req.body, 
      firebaseUid: req.user.firebaseUid,
      aiAnalysis: aiAnalysis || req.body.aiAnalysis,
      moodScore
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all (filter by authenticated user)
router.get('/', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const filter = { firebaseUid: req.user.firebaseUid };
    const entries = await JournalEntry.find(filter).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    // Generate new AI analysis if content is updated
    let aiAnalysis = req.body.aiAnalysis;
    if (req.body.content && !req.body.aiAnalysis) {
      aiAnalysis = generateAIAnalysis(req.body.content);
    }
    const moodScore = (aiAnalysis && aiAnalysis.moodRating) || (req.body.aiAnalysis && req.body.aiAnalysis.moodRating) || null;
    const entry = await JournalEntry.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, aiAnalysis, moodScore },
      { new: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await JournalEntry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
