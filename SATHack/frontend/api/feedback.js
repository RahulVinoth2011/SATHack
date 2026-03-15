import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { question, userAnswer, isCorrect } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a concise SAT tutor. Give feedback in 2-3 sentences. Be direct. Focus on SAT strategy.'
        },
        {
          role: 'user',
          content: `Question: ${question.question}
Correct: ${question.correct}) ${question.choices[question.correct]}
Student: ${userAnswer}) ${question.choices[userAnswer]}
Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}
Explanation: ${question.explanation}
Give brief feedback.`
        }
      ],
      temperature: 0.6,
    });

    res.status(200).json({ feedback: response.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}