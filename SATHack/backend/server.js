require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── PASSAGES ────────────────────────────────────────────────────────────────
const passages = [
  {
    id: "douglass_01",
    title: "What to the Slave is the Fourth of July?",
    author: "Frederick Douglass",
    year: 1852,
    genre: "historical_document",
    text: `Fellow-citizens, pardon me, allow me to ask, why am I called upon to speak here today? What have I, or those I represent, to do with your national independence? Are the great principles of political freedom and of natural justice, embodied in that Declaration of Independence, extended to us? Would to God, both for your sakes and ours, that an affirmative answer could be truthfully returned to these questions! But such is not the state of the case. I say it with a sad sense of the disparity between us. I am not included within the pale of this glorious anniversary. The rich inheritance of justice, liberty, prosperity, and independence bequeathed by your fathers is shared by you, not by me.`,
  },
  {
    id: "darwin_01",
    title: "On the Origin of Species",
    author: "Charles Darwin",
    year: 1859,
    genre: "science",
    text: `It may be said that natural selection is daily and hourly scrutinising, throughout the world, every variation, even the slightest; rejecting that which is bad, preserving and adding up all that is good; silently and insensibly working, whenever and wherever opportunity offers, at the improvement of each organic being in relation to its organic and inorganic conditions of life. We see nothing of these slow changes in progress, until the hand of time has marked the long lapses of ages, and then so imperfect is our view into long past geological ages, that we only see that the forms of life are now different from what they formerly were.`,
  },
  {
    id: "dubois_01",
    title: "The Souls of Black Folk",
    author: "W.E.B. Du Bois",
    year: 1903,
    genre: "essay",
    text: `It is a peculiar sensation, this double-consciousness, this sense of always looking at one's self through the eyes of others, of measuring one's soul by the tape of a world that looks on in amused contempt and pity. One ever feels his two-ness — an American, a Negro; two souls, two thoughts, two unreconciled strivings; two warring ideals in one dark body, whose dogged strength alone keeps it from being torn asunder. The history of the American Negro is the history of this strife — this longing to attain self-conscious manhood, to merge his double self into a better and truer self.`,
  },
  {
    id: "austen_01",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    genre: "literary_fiction",
    text: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters. My dear Mr. Bennet, said his lady to him one day, have you heard that Netherfield Park is let at last? Mr. Bennet replied that he had not. But it is, returned she; for Mrs. Long has just been here, and she told me all about it.`,
  },
  {
    id: "thoreau_01",
    title: "Civil Disobedience",
    author: "Henry David Thoreau",
    year: 1849,
    genre: "essay",
    text: `I heartily accept the motto, that government is best which governs least; and I should like to see it acted up to more rapidly and systematically. Carried out, it finally amounts to this, which also I believe: that government is best which governs not at all; and when men are prepared for it, that will be the kind of government which they will have. Government is at best but an expedient; but most governments are usually, and all governments are sometimes, inexpedient. The objections which have been brought against a standing army, and they are many and weighty, and deserve to prevail, may also at last be brought against a standing government.`,
  },
  {
    id: "anthony_01",
    title: "Is It a Crime for a Citizen to Vote?",
    author: "Susan B. Anthony",
    year: 1873,
    genre: "historical_document",
    text: `Friends and fellow citizens: I stand before you tonight under indictment for the alleged crime of having voted at the last presidential election, without having a lawful right to vote. It shall be my work this evening to prove to you that in thus voting, I not only committed no crime, but, instead, simply exercised my citizen's rights, guaranteed to me and all United States citizens by the National Constitution, beyond the power of any state to deny. The preamble of the federal Constitution says we, the people of the United States, in order to form a more perfect union, establish justice, insure domestic tranquility, provide for the common defense, promote the general welfare, and secure the blessings of liberty to ourselves and our posterity.`,
  },
  {
    id: "emerson_01",
    title: "Self-Reliance",
    author: "Ralph Waldo Emerson",
    year: 1841,
    genre: "essay",
    text: `To believe your own thought, to believe that what is true for you in your private heart is true for all men — that is genius. Speak your latent conviction, and it shall be the universal sense; for the inmost in due time becomes the outmost, and our first thought is rendered back to us by the trumpets of the Last Judgment. Familiar as the voice of the mind is to each, the highest merit we ascribe to Moses, Plato, and Milton is that they set at naught books and traditions, and spoke not what men thought, but what they thought. A man should learn to detect and watch that gleam of light which flashes across his mind from within.`,
  },
  {
    id: "wharton_01",
    title: "The Age of Innocence",
    author: "Edith Wharton",
    year: 1920,
    genre: "literary_fiction",
    text: `On a January evening of the early seventies, Christine Nilsson was singing in Faust at the Academy of Music in New York. Though there was already talk of the erection of a new Opera House which should compete in costliness and splendour with those of the great European capitals, the world of fashion was still content to reassemble every winter in the shabby red and gold boxes of the sociable old Academy. Conservatives cherished it for being small and inconvenient, and thus keeping out the new people whom New York was beginning to dread and yet be drawn to.`,
  },
];

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert Digital SAT question writer. Generate exactly ONE SAT-style question from the given passage.

Pick ONE of these question types:
- WORD_CHOICE: Take one sentence, replace a key word with [BLANK], ask "Which choice completes the text with the most logical and precise word or phrase?"
- TRANSITION: Take one sentence, replace a transition word with [BLANK], ask "Which choice completes the text with the most logical transition?"
- CENTRAL_IDEA: Ask what the main idea or primary purpose of the passage is.
- INFERENCE: Ask what can be reasonably concluded from the passage.
- VOCAB_IN_CONTEXT: Ask what a specific word most nearly means as used in the passage.
- TEXT_STRUCTURE: Ask why the author included a specific detail or used a specific technique.
- GRAMMAR: Take one sentence from the passage, introduce a grammatical issue (punctuation, subject-verb agreement, run-on, or pronoun reference), present it with [BLANK] where the correction goes, and ask "Which choice conforms to the conventions of Standard English?"

RULES:
- Correct answer must be directly supported by the passage
- All 4 choices must be similar in length and plausible
- Wrong answers must be genuinely tempting traps
- For WORD_CHOICE, TRANSITION, and GRAMMAR types, show the sentence with [BLANK] in passage_excerpt
- For other types set passage_excerpt to null

CRITICAL: Respond with ONLY a valid JSON object. No markdown. No backticks. Start with { end with }.

{
  "type": "CENTRAL_IDEA",
  "passage_excerpt": null,
  "question": "The main purpose of this passage is to",
  "choices": {
    "A": "first answer choice",
    "B": "second answer choice",
    "C": "third answer choice",
    "D": "fourth answer choice"
  },
  "correct": "B",
  "explanation": "Why the correct answer is right.",
  "trap_explanations": {
    "A": "Why A is tempting but wrong",
    "C": "Why C is tempting but wrong",
    "D": "Why D is tempting but wrong"
  }
}`;

async function generateQuestion(passage) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Generate a SAT question for this passage:\n\nTitle: "${passage.title}" by ${passage.author} (${passage.year})\n\n${passage.text}\n\nRespond with ONLY a JSON object.` }
    ],
    temperature: 0.7,
  });

  let raw = response.choices[0].message.content.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON in response');
  return JSON.parse(raw.slice(start, end + 1));
}

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.get('/api/question', async (req, res) => {
  try {
    const passage = passages[Math.floor(Math.random() * passages.length)];
    const question = await generateQuestion(passage);
    res.json({ passage, question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  const { question, userAnswer, isCorrect } = req.body
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a concise SAT tutor. Give feedback in 2-3 sentences. Be direct. Focus on the SAT strategy.' },
        { role: 'user', content: `Question: ${question.question}\nCorrect: ${question.correct}) ${question.choices[question.correct]}\nStudent: ${userAnswer}) ${question.choices[userAnswer]}\nResult: ${isCorrect ? 'CORRECT' : 'INCORRECT'}\nExplanation: ${question.explanation}\nGive brief feedback.` }
      ],
      temperature: 0.6,
    })
    res.json({ feedback: response.choices[0].message.content.trim() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));