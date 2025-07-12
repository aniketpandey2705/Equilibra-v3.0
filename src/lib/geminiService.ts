interface AIAnalysis {
  summary: string;
  moodRating: number; // 1-10 scale
  moodLabel: string; // 'happy', 'sad', 'neutral', 'excited', 'anxious', etc.
  keyThemes: string[];
  insights: string;
}

export const geminiService = {
  async analyzeJournalEntry(content: string): Promise<AIAnalysis> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = `
        Analyze this journal entry and provide the following in JSON format:
        
        Journal Entry: "${content}"
        
        Please analyze the text and return a JSON object with:
        1. "summary": A concise 2-3 sentence summary of the main points
        2. "moodRating": A number from 1-10 where 1 is very negative/sad and 10 is very positive/happy
        3. "moodLabel": A single word describing the overall mood (e.g., "happy", "sad", "neutral", "excited", "anxious", "grateful", "frustrated", "peaceful")
        4. "keyThemes": An array of 3-5 key themes or topics mentioned
        5. "insights": A brief insight or reflection about the entry (1-2 sentences)
        
        Return only valid JSON, no additional text.
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const responseText = data.candidates[0].content.parts[0].text;
        
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          
          // Validate and provide defaults if needed
          return {
            summary: analysis.summary || 'No summary available',
            moodRating: Math.max(1, Math.min(10, analysis.moodRating || 5)),
            moodLabel: analysis.moodLabel || 'neutral',
            keyThemes: Array.isArray(analysis.keyThemes) ? analysis.keyThemes : ['general'],
            insights: analysis.insights || 'No insights available'
          };
        } else {
          throw new Error('Invalid response format from AI');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Return default analysis if API fails
      return {
        summary: 'Unable to analyze entry at this time.',
        moodRating: 5,
        moodLabel: 'neutral',
        keyThemes: ['general'],
        insights: 'Analysis temporarily unavailable.'
      };
    }
  },

  getMoodEmoji(moodLabel: string): string {
    const moodEmojis: { [key: string]: string } = {
      'happy': '😊',
      'excited': '🤩',
      'grateful': '🙏',
      'peaceful': '😌',
      'content': '😊',
      'joyful': '😄',
      'neutral': '😐',
      'calm': '😌',
      'focused': '🤔',
      'sad': '😢',
      'anxious': '😰',
      'frustrated': '😤',
      'angry': '😠',
      'worried': '😟',
      'stressed': '😰',
      'tired': '😴',
      'confused': '😕'
    };
    
    return moodEmojis[moodLabel.toLowerCase()] || '📝';
  },

  getMoodColor(moodRating: number): string {
    if (moodRating >= 8) return 'text-green-500';
    if (moodRating >= 6) return 'text-blue-500';
    if (moodRating >= 4) return 'text-yellow-500';
    return 'text-red-500';
  }
}; 