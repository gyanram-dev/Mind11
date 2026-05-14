import dotenv from 'dotenv';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;

export async function callGemini(prompt) {
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  return {
    prompt,
    response: 'This is a mock Gemini response for prompt processing.'
  };
}
