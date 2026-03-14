require('dotenv').config();
const Groq = require('groq-sdk');
const readline = require('readline');

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
- WORD_CHOICE: Take one sentence from the passage, replace a key word with [BLANK], ask "Which choice completes the text with the most logical and precise word or phrase?"
- TRANSITION: Take one sentence, replace a transition word with [BLANK], ask "Which choice completes the text with the most logical transition?"
- CENTRAL_IDEA: Ask what the main idea or primary purpose of the passage is.
- INFERENCE: Ask what can be reasonably concluded from the passage.
- VOCAB_IN_CONTEXT: Ask what a specific word most nearly means as used in the passage.
- TEXT_STRUCTURE: Ask why the author included a specific detail or used a specific technique.

RULES:
- Correct answer must be directly supported by the passage text only
- All 4 choices must be similar in length and all plausible
- Wrong answers must be genuinely tempting traps
- For WORD_CHOICE and TRANSITION, show the sentence with [BLANK] in the passage_excerpt field
- For other types, set passage_excerpt to null

CRITICAL: You MUST respond with ONLY a valid JSON object. No explanation before or after. No markdown. No backticks. Your entire response must start with { and end with }.

Use this exact format:
{
  "type": "CENTRAL_IDEA",
  "passage_excerpt": null,
  "question": "The main purpose of this passage is to",
  "choices": {
    "A": "first answer choice here",
    "B": "second answer choice here",
    "C": "third answer choice here",
    "D": "fourth answer choice here"
  },
  "correct": "B",
  "explanation": "Why the correct answer is right, grounded in the passage.",
  "trap_explanations": {
    "A": "Why A is tempting but wrong",
    "C": "Why C is tempting but wrong",
    "D": "Why D is tempting but wrong"
  }
}`;

// ─── COLORS ──────────────────────────────────────────────────────────────────
const c = {
  bold:   t => `\x1b[1m${t}\x1b[0m`,
  cyan:   t => `\x1b[36m${t}\x1b[0m`,
  green:  t => `\x1b[32m${t}\x1b[0m`,
  red:    t => `\x1b[31m${t}\x1b[0m`,
  yellow: t => `\x1b[33m${t}\x1b[0m`,
  gray:   t => `\x1b[90m${t}\x1b[0m`,
  white:  t => `\x1b[97m${t}\x1b[0m`,
  bgBlue: t => `\x1b[44m${t}\x1b[0m`,
  bgGreen:t => `\x1b[42m${t}\x1b[0m`,
  bgRed:  t => `\x1b[41m${t}\x1b[0m`,
};

function wrap(text, width = 62) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else {
      line += ' ' + word;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.join('\n  ');
}

const div = (len = 62) => c.gray('─'.repeat(len));
const clear = () => process.stdout.write('\x1Bc');
const ask = (rl, q) => new Promise(resolve => rl.question(q, resolve));

// ─── API CALLS ───────────────────────────────────────────────────────────────
async function generateQuestion(passage) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Generate a SAT question for this passage:\n\nTitle: "${passage.title}" by ${passage.author} (${passage.year})\n\n${passage.text}\n\nRemember: respond with ONLY a JSON object, nothing else.`
      }
    ],
    temperature: 0.7,
  });

  let raw = response.choices[0].message.content.trim();

  // Strip markdown fences if model included them anyway
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  // Extract JSON object from first { to last }
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Response did not contain a JSON object');

  return JSON.parse(raw.slice(start, end + 1));
}

async function getFeedback(question, userAnswer) {
  const isCorrect = userAnswer === question.correct;
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a concise SAT tutor. Give feedback in 2-3 sentences. Be direct. Focus on the SAT strategy.'
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
  return response.choices[0].message.content.trim();
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function runQuiz() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  clear();
  console.log('\n' + c.bgBlue(c.bold(c.white('  SAT Reading & Writing Practice  '))));
  console.log(c.gray('  Powered by public domain literature\n'));
  console.log('  ' + wrap('Welcome! Answer each question by typing A, B, C, or D.'));
  console.log(c.gray('\n  Type "quit" at any time to exit.\n'));
  await ask(rl, c.gray('  Press Enter to begin...'));

  const TOTAL = 5;
  let score = 0;
  const results = [];

  for (let i = 1; i <= TOTAL; i++) {
    clear();
    console.log('\n' + c.bgBlue(c.bold(c.white('  SAT Reading & Writing  '))) + c.gray(`  Question ${i} of ${TOTAL}\n`));

    const passage = passages[Math.floor(Math.random() * passages.length)];

    process.stdout.write(c.gray('  Generating question...'));
    let question;
    try {
      question = await generateQuestion(passage);
    } catch (err) {
      process.stdout.write('\r' + ' '.repeat(35) + '\r');
      console.log(c.red(`  Could not generate question: ${err.message}`));
      results.push({ skipped: true });
      if (i < TOTAL) await ask(rl, c.gray('  Press Enter to continue...'));
      continue;
    }
    process.stdout.write('\r' + ' '.repeat(35) + '\r');

    // Passage
    console.log(div());
    console.log(c.bold(c.cyan(`  ${passage.title}`)) + c.gray(`  —  ${passage.author}, ${passage.year}`));
    console.log(div());
    console.log('');

    if (question.passage_excerpt) {
      const hl = question.passage_excerpt.replace('[BLANK]', c.bold(c.yellow('[BLANK]')));
      console.log('  ' + wrap(hl));
    } else {
      console.log('  ' + wrap(passage.text));
    }

    // Question + choices
    console.log('\n' + div());
    console.log('');
    console.log('  ' + c.bold(c.white(question.question)));
    console.log('');

    const choiceFmt = {
      A: t => `\x1b[36m${t}\x1b[0m`,
      B: t => `\x1b[35m${t}\x1b[0m`,
      C: t => `\x1b[33m${t}\x1b[0m`,
      D: t => `\x1b[34m${t}\x1b[0m`,
    };
    for (const [letter, text] of Object.entries(question.choices)) {
      console.log(`  ${(choiceFmt[letter] || (t=>t))(c.bold(letter + '.'))} ${text}`);
    }

    console.log('\n' + div());

    // Answer input
    let userAnswer = '';
    while (true) {
      const input = (await ask(rl, c.bold('  Your answer (A/B/C/D): '))).trim().toUpperCase();
      if (input === 'QUIT') { console.log('\n' + c.gray('  Goodbye!\n')); rl.close(); process.exit(0); }
      if (['A','B','C','D'].includes(input)) { userAnswer = input; break; }
      console.log(c.red('  Please enter A, B, C, or D.'));
    }

    const isCorrect = userAnswer === question.correct;
    if (isCorrect) score++;

    // Result
    console.log('');
    if (isCorrect) {
      console.log('  ' + c.bgGreen(c.bold(c.white(' ✓ CORRECT '))));
    } else {
      console.log('  ' + c.bgRed(c.bold(c.white(' ✗ INCORRECT '))) + c.gray(`  Correct answer: ${c.bold(question.correct)}.`));
      console.log(c.gray(`     ${question.correct}. ${question.choices[question.correct]}`));
    }

    // Explanation
    console.log('');
    console.log('  ' + c.bold('Why: ') + c.gray(wrap(question.explanation)));

    // Trap explanation
    if (!isCorrect && question.trap_explanations?.[userAnswer]) {
      console.log('');
      console.log('  ' + c.yellow(`Why ${userAnswer} is tempting: `) + c.gray(wrap(question.trap_explanations[userAnswer])));
    }

    // Tutor feedback
    console.log('');
    process.stdout.write(c.gray('  Getting tutor tip...'));
    try {
      const feedback = await getFeedback(question, userAnswer);
      process.stdout.write('\r' + ' '.repeat(25) + '\r');
      console.log('  ' + c.cyan('💡 ') + wrap(feedback));
    } catch {
      process.stdout.write('\r' + ' '.repeat(25) + '\r');
    }

    results.push({ question, userAnswer, isCorrect });

    console.log('\n' + div());
    if (i < TOTAL) await ask(rl, c.gray('  Press Enter for next question...'));
  }

  // Final score
  clear();
  const valid = results.filter(r => !r.skipped);
  const pct = valid.length > 0 ? Math.round((score / valid.length) * 100) : 0;
  const scoreColor = pct >= 80 ? c.green : pct >= 60 ? c.yellow : c.red;

  console.log('\n' + c.bgBlue(c.bold(c.white('  Quiz Complete!  '))));
  console.log('');
  console.log('  ' + c.bold('Score: ') + scoreColor(c.bold(`${score}/${valid.length}  (${pct}%)`)));
  console.log('');
  console.log(div());
  console.log(c.bold('  Summary:'));
  console.log('');

  results.forEach((r, idx) => {
    if (r.skipped) {
      console.log(`  ${c.gray('—')} Q${idx+1}: ${c.gray('skipped')}`);
    } else {
      const icon = r.isCorrect ? c.green('✓') : c.red('✗');
      console.log(`  ${icon} Q${idx+1}: ${c.gray(r.question.type)} — you: ${c.bold(r.userAnswer)}, correct: ${c.bold(r.question.correct)}`);
    }
  });

  console.log('');
  console.log(div());
  if (pct >= 80)      console.log(c.green(c.bold('  Excellent work!')));
  else if (pct >= 60) console.log(c.yellow(c.bold('  Good effort — keep practicing!')));
  else                console.log(c.red(c.bold('  Review the explanations and try again!')));
  console.log('');

  rl.close();
}

runQuiz().catch(err => {
  console.error('\x1b[31mFatal error: ' + err.message + '\x1b[0m');
  process.exit(1);
});