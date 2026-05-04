import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { CohereClient } from 'cohere-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

const PROMPT = (query) => `You are a product search assistant. A shopper asks: "${query}".
List the top 10 products/brands you would recommend.
Return ONLY a valid JSON array with no extra text, no markdown, no explanation:
[{"rank":1,"brand":"X","product":"Y","reason":"Z"}]`;

function extractJSON(text) {
  const clean = text.replace(/```json|```/g, '').trim();
  const match = clean.match(/\[[\s\S]*\]/);
  if (match) return JSON.parse(match[0]);
  throw new Error('No JSON array found in: ' + clean.slice(0, 100));
}

async function queryGPT(query) {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You must respond with ONLY a valid JSON array. No explanation, no markdown, no text before or after.' },
      { role: 'user', content: PROMPT(query) }
    ],
    temperature: 0.1,
  });
  return extractJSON(res.choices[0].message.content);
}

async function queryClaude(query) {
  const res = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: 'You must respond with ONLY a valid JSON array. No explanation, no markdown, no text before or after.' },
      { role: 'user', content: PROMPT(query) }
    ],
    temperature: 0.1,
  });
  return extractJSON(res.choices[0].message.content);
}

async function queryGemini(query) {
  const res = await cohere.chat({
    model: 'command-r-08-2024',
    message: PROMPT(query),
    preamble: 'You must respond with ONLY a valid JSON array. No explanation, no markdown, no text before or after.',
  });
  return extractJSON(res.text);
}

app.post('/analyze', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query required' });

  const [gptResult, claudeResult, geminiResult] = await Promise.allSettled([
    queryGPT(query),
    queryClaude(query),
    queryGemini(query),
  ]);

  const extract = (r) => (r.status === 'fulfilled' ? r.value : []);

  const gpt = extract(gptResult);
  const claude = extract(claudeResult);
  const gemini = extract(geminiResult);

  if (gptResult.status === 'rejected') console.error('GPT failed:', gptResult.reason.message);
  if (claudeResult.status === 'rejected') console.error('Claude failed:', claudeResult.reason.message);
  if (geminiResult.status === 'rejected') console.error('Gemini failed:', geminiResult.reason.message);

  const brandCount = {};
  [...gpt, ...claude, ...gemini].forEach(({ brand }) => {
    const key = brand.toLowerCase().trim();
    if (!brandCount[key]) brandCount[key] = { brand, count: 0 };
    brandCount[key].count += 1;
  });

  const reportCard = Object.values(brandCount).sort((a, b) => b.count - a.count);

  res.json({ gpt, claude, gemini, reportCard, query });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
