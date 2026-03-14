require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const TEST_PASSAGE = `
The jungle was a wall of green, impenetrable and ancient. Darwin had spent three weeks 
pushing through undergrowth that seemed to grow back the moment it was cut. His boots 
were long ruined, his notebooks swollen with humidity. Yet each morning he rose before 
dawn, driven by the same restless certainty that somewhere in this suffocating abundance 
lay a pattern — some organizing principle that would make sense of the endless variation 
of beaks and shells and wings he had catalogued. He did not yet have a name for what he 
was looking for. He only knew he could not stop looking.
`;

const SYSTEM_PROMPT = `You are an expert SAT question writer with deep knowledge of the Digital SAT Reading & Writing section.
Your job is to generate a single high-quality SAT-style question from a given passage.

Follow these strict rules:
1. The correct answer must be directly supported by the passage text — no outside knowledge
2. All four answer choices must be plausible and similar in length
3. Wrong answers (distractors) must be tempting — use these distractor strategies:
   - Too broad or too narrow
   - True but irrelevant to the question
   - Contradicts the passage subtly
   - Common misreading of the passage
4. Question stem must be clear and unambiguous
5. Never reference line numbers since we don't have them

Return your response in this exact JSON format and nothing else — no markdown, no backticks, just raw JSON:
{
  "question": "the question stem here",
  "choices": {
    "A": "first choice",
    "B": "second choice",
    "C": "third choice",
    "D": "fourth choice"
  },
  "correct": "A",
  "explanation": "Why the correct answer is right, grounded in the passage text.",
  "distractors": {
    "B": "why this choice is tempting but wrong",
    "C": "why this choice is tempting but wrong",
    "D": "why this choice is tempting but wrong"
  },
  "type": "central_idea"
}`;

async function generateQuestion(passage, questionType = "central_idea") {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Generate a ${questionType} SAT Reading question for this passage:\n\n${passage}` }
      ],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const question = JSON.parse(clean);

    console.log("\n--- GENERATED QUESTION ---\n");
    console.log(`Type: ${question.type}`);
    console.log(`\nQ: ${question.question}\n`);
    console.log(`A) ${question.choices.A}`);
    console.log(`B) ${question.choices.B}`);
    console.log(`C) ${question.choices.C}`);
    console.log(`D) ${question.choices.D}`);
    console.log(`\nCorrect Answer: ${question.correct}`);
    console.log(`\nExplanation: ${question.explanation}`);
    console.log("\n--- WHY WRONG ANSWERS ARE TEMPTING ---");
    for (const [letter, reason] of Object.entries(question.distractors)) {
      console.log(`${letter}: ${reason}`);
    }

    return question;

  } catch (err) {
    console.error("Error:", err.message);
  }
}

generateQuestion(TEST_PASSAGE, "central_idea");