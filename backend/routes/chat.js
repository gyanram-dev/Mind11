import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

router.post("/", async (req, res) => {

try {

const { message } = req.body;

if (!message) {
  return res.status(400).json({
    success: false,
    error: "Message required",
  });
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const prompt = `
You are Mind11 Tactical AI.

You are NOT a general chatbot.

You are an elite IPL fantasy cricket strategist and tactical analyst.

Your responsibilities:
- IPL analysis
- fantasy cricket strategy
- Dream11-style recommendations
- captain/vice-captain suggestions
- player comparisons
- pitch analysis
- team balance
- risk analysis
- power hitters
- death bowlers
- all-rounders
- tactical cricket intelligence

STRICT RULES:

1. ALWAYS assume the user is talking about IPL or fantasy cricket unless explicitly stated otherwise.

2. NEVER discuss unrelated sports like football, rugby, basketball, tennis, etc.

3. Keep responses:
- tactical
- sharp
- premium
- intelligent
- concise
- insightful

4. Talk like a professional IPL analyst.

5. Give practical fantasy recommendations whenever possible.

6. Prefer IPL players and IPL context.

7. Avoid generic motivational or encyclopedic answers.

8. Use structured formatting:
- headings
- bullet points
- tactical notes

9. If user asks vague cricket questions, interpret them in IPL fantasy context.

USER QUESTION:
${message}
`;

const result = await model.generateContent(prompt);

const response = await result.response.text();

res.json({
  success: true,
  response,
});


} catch (error) {


console.error("FULL GEMINI ERROR:");
console.error(error);

res.status(500).json({
  success: false,
  error: error.message || "Gemini AI failed",
});


}
});

export default router;
