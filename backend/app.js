import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import expensesRouter from './routes/expenses.js';
import budgetsRouter from './routes/budgets.js';
import journalEntriesRouter from './routes/journalEntries.js';
import goalsRouter from './routes/goals.js';
import User from './models/User.js';
import admin from 'firebase-admin';
import fs from 'fs';
import academicRouter from './routes/academic.js';

dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const serviceAccount = serviceAccountPath ? JSON.parse(fs.readFileSync(serviceAccountPath)) : undefined;
  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
  });
}

// Mock AI Analysis Service
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

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Add global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use('/api/expenses', expensesRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/journal-entries', journalEntriesRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/academic', academicRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// User creation/login endpoint
app.post('/api/users', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Missing idToken' });
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        displayName: name,
        photoURL: picture,
      });
    }
    res.json({
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired idToken', details: err.message });
  }
});

// AI Analysis endpoint
app.post('/api/analyze-journal', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const analysis = generateAIAnalysis(content);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user settings
app.get('/api/user/settings', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    res.json(req.user.settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user settings
app.put('/api/user/settings', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const updates = req.body;
    req.user.settings = { ...req.user.settings, ...updates };
    await req.user.save();
    res.json(req.user.settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Firebase auth middleware
const firebaseAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const idToken = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decoded;
    // Optionally fetch MongoDB user
    req.user = await User.findOne({ firebaseUid: decoded.uid });
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired idToken', details: err.message });
  }
};

// Apply auth middleware to all /api/* except /api/users
app.use((req, res, next) => {
  if (req.path === '/api/users') return next();
  if (req.path.startsWith('/api/')) return firebaseAuthMiddleware(req, res, next);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
