# AI Integration Setup Guide

## Overview
The Equilibria Dashboard now includes AI-powered features using Google's Gemini API:
- **Chatbot**: Intelligent assistant for dashboard help and productivity tips
- **Journal Analysis**: Automatic analysis of journal entries with summaries, mood ratings, and insights

## Features

### Chatbot
- 🤖 AI-powered conversations using Gemini API
- 💬 Real-time chat interface with smooth animations
- 🎨 Modern UI that matches the dashboard design
- 📱 Responsive design that works on all devices
- ⚡ Fast and efficient message handling

### Journal Analysis
- 📝 Automatic text analysis when saving journal entries
- 🧠 AI-generated summaries and insights
- 😊 Mood rating and emotional analysis (1-10 scale)
- 🏷️ Key themes extraction from entries
- 📊 Detailed analysis view in journal entries

## Setup Instructions

### 1. Get a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables
1. In the `new-latest-equi` directory, create or edit the `.env` file
2. Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with the API key you copied

### 3. Start the Development Server
```bash
npm run dev
```

## How to Use

### Chatbot
- **Opening**: Click the floating chat button (message circle icon) in the bottom-right corner of the dashboard
- **Chatting**: Type your message and press Enter or click send
- **Closing**: Click the X button or click outside the chatbot window

### Journal Analysis
- **Writing**: Create a new journal entry in the Write page
- **Analysis**: When you click "Save Entry", the AI will automatically analyze your text
- **Viewing**: See the analysis in the journal entries list with mood ratings, summaries, and themes
- **Details**: Click the eye icon on any entry to view the full AI analysis in a detailed modal

## Example Conversations

You can ask the chatbot about:
- **Dashboard features**: "How do I track my expenses?"
- **Productivity tips**: "How can I improve my daily routine?"
- **Goal setting**: "What's the best way to set achievable goals?"
- **Journal writing**: "How can I write better journal entries?"
- **General help**: "What can you help me with?"

## Troubleshooting

### "Please configure your Gemini API key" message
- Make sure you've added your API key to the `.env` file
- Ensure the key is correct and active
- Restart the development server after adding the key

### API errors
- Check your internet connection
- Verify your API key is valid and has sufficient quota
- Check the browser console for detailed error messages

### Chatbot not appearing
- Make sure you're on the Dashboard page
- Check that all components are properly imported
- Verify there are no JavaScript errors in the console

## Security Notes
- Never commit your API key to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- API keys are only used on the client side for this demo

## Customization
You can customize the chatbot by:
- Modifying the prompt in `Chatbot.tsx` to change the AI's personality
- Adjusting the styling in the component classes
- Adding new features like message history or file uploads

## Support
If you encounter any issues, check the browser console for error messages and ensure your API key is properly configured. 