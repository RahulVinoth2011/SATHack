import Groq from 'groq-sdk';
import { getRandomPassage, getPairedPassage } from '../passages.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const notesSets = [
  {
    id: "notes_bees",
    topic: "Bee Navigation",
    notes: [
      "Honeybees (Apis mellifera) use a 'waggle dance' to communicate the location of food sources to other bees.",
      "The angle of the dance relative to vertical indicates the direction of the food source relative to the sun.",
      "The duration of the waggle run indicates the distance to the food source.",
      "Bees that observe the dance are able to fly directly to the food source.",
      "Karl von Frisch first decoded the meaning of the waggle dance in the 1940s.",
    ],
  },
  {
    id: "notes_permafrost",
    topic: "Permafrost and Climate",
    notes: [
      "Permafrost is ground that remains frozen for two or more consecutive years.",
      "Permafrost covers about 25% of the Northern Hemisphere's land surface.",
      "When permafrost thaws, it releases carbon dioxide and methane stored in organic matter.",
      "Methane is approximately 25 times more potent as a greenhouse gas than carbon dioxide over a 100-year period.",
      "Scientists estimate that permafrost contains roughly twice as much carbon as is currently in the atmosphere.",
    ],
  },
  {
    id: "notes_urban_heat",
    topic: "Urban Heat Islands",
    notes: [
      "Urban heat islands form when cities replace natural land cover with dense concentrations of pavement, buildings, and other surfaces.",
      "These surfaces absorb and re-emit the sun's heat more than natural landscapes such as forests and water bodies.",
      "Temperatures in urban areas can be 1–7°F higher than in surrounding rural areas.",
      "Green roofs — rooftops covered with vegetation — can reduce urban surface temperatures by up to 40°F.",
      "Researcher Matei Georgescu found that large-scale adoption of green roofs in Phoenix, Arizona could reduce peak summer temperatures by up to 3°F.",
    ],
  },
  {
    id: "notes_sourdough",
    topic: "Sourdough Fermentation",
    notes: [
      "Sourdough bread is leavened using a starter culture containing wild yeasts and lactic acid bacteria.",
      "The bacteria produce lactic and acetic acids, which give sourdough its distinctive tangy flavor.",
      "Longer fermentation times produce more acetic acid, resulting in a more sour taste.",
      "Lactic acid bacteria also break down phytic acid in wheat, which can inhibit the absorption of minerals such as iron and zinc.",
      "A 2019 study by researchers at Stanford University found that sourdough fermentation significantly increased the bioavailability of iron in wheat flour.",
    ],
  },
  {
    id: "notes_bioluminescence",
    topic: "Bioluminescence in Marine Animals",
    notes: [
      "Bioluminescence is the production and emission of light by living organisms.",
      "An estimated 76% of ocean animals are capable of producing light.",
      "Marine bioluminescence is produced through a chemical reaction involving a compound called luciferin.",
      "Some deep-sea fish use bioluminescent lures to attract prey in the darkness of the ocean floor.",
      "Biologist Edith Widder has argued that bioluminescence is the most common form of communication on Earth.",
    ],
  },
];

const SYSTEM_PROMPT = `You are an expert Digital SAT Reading and Writing question writer. Your questions must exactly match the style, structure, difficulty, and phrasing of official College Board Digital SAT questions.

Study these question type patterns carefully and replicate them exactly:

═══════════════════════════════════════════
QUESTION TYPE 1: WORD_CHOICE
═══════════════════════════════════════════
Format: Short passage (1-3 sentences) with one key word replaced by [BLANK].
Question stem (use EXACTLY): "Which choice completes the text with the most logical and precise word or phrase?"

Real SAT example:
"NASA scientist Daniella DellaGiustina reports that despite facing the unexpected obstacle of a surface mostly covered in boulders, OSIRIS-REx successfully [BLANK] a sample of the surface, gathering pieces of it to bring back to Earth."
A) attached  B) collected  C) followed  D) replaced
Answer: B — "collected a sample" is the only phrase that is both precise and fits the action of gathering material.

RULES:
- All 4 choices must be the same part of speech
- Correct answer: the ONE word that is both grammatically correct AND semantically precise for this exact context
- Trap 1: A word that is vaguely related but imprecise (too broad)
- Trap 2: A word that fits grammatically but changes the meaning entirely
- Trap 3: A word that sounds right but doesn't fit the logic of the sentence

═══════════════════════════════════════════
QUESTION TYPE 2: MAIN_IDEA
═══════════════════════════════════════════
Format: Full literary or informational passage.
Question stems (use one EXACTLY):
- "Which choice best states the main idea of the text?"
- "Which choice best states the main purpose of the text?"

Real SAT example (from The Secret Garden passage):
A) Mary hides in the garden to avoid doing her chores.
B) Mary is getting bored with pulling up so many weeds in the garden.
C) Mary is clearing out the garden to create a space to play.
D) Mary feels very satisfied when she's taking care of the garden.
Answer: D

RULES:
- Correct answer: captures the central point accurately without overstating
- Trap 1: A true but too-narrow detail from the passage
- Trap 2: Contradicts the tone or content of the passage
- Trap 3: Overstates — goes beyond what the passage says

═══════════════════════════════════════════
QUESTION TYPE 3: TEXT_STRUCTURE
═══════════════════════════════════════════
Format: Full passage.
Question stems (use one EXACTLY):
- "Which choice best describes the overall structure of the text?"
- "Which choice best describes the function of the [first/second/third] sentence in the overall structure of the text?"

Real SAT example (Walt Whitman poem):
A) The speaker questions an increasingly prevalent attitude, then summarizes his worldview.
B) The speaker regrets his isolation from others, then predicts a profound change in society.
C) The speaker concedes his personal shortcomings, then boasts of his many achievements.
D) The speaker addresses a criticism leveled against him, then announces a grand ambition of his.
Answer: D

RULES:
- Each choice must have TWO parts connected by "then" or "and"
- Correct answer: names both rhetorical moves accurately
- Traps: get one part right but the other wrong

═══════════════════════════════════════════
QUESTION TYPE 4: COMMAND_OF_EVIDENCE
═══════════════════════════════════════════
Format: Passage presenting a researcher's claim or a student's hypothesis.
Question stems (use one EXACTLY):
- "Which finding, if true, would most directly support [name]'s hypothesis?"
- "Which finding, if true, would most directly weaken the student's hypothesis?"

RULES:
- Correct answer: directly and specifically confirms or refutes the exact claim
- Trap 1: Related to the topic but supports a different, adjacent claim
- Trap 2: Relevant but only circumstantially supports/weakens
- Trap 3: Sounds scientific but has no logical connection to the hypothesis

═══════════════════════════════════════════
QUESTION TYPE 5: LOGICAL_COMPLETION
═══════════════════════════════════════════
Format: Passage building an argument, ending with [BLANK] to be completed.
Question stem (use EXACTLY): "Which choice most logically completes the text?"

RULES:
- Correct answer: follows NECESSARILY and DIRECTLY from the argument
- Trap 1: True but not a logical consequence of this specific argument
- Trap 2: Overstates beyond what evidence supports
- Trap 3: A reasonable but unrelated conclusion

═══════════════════════════════════════════
QUESTION TYPE 6: TRANSITION
═══════════════════════════════════════════
Format: Passage with [BLANK] where a transition word/phrase goes.
Question stem (use EXACTLY): "Which choice completes the text with the most logical transition?"

Common correct answers: However, Therefore, Additionally, Finally, In addition, Consequently, Alternatively, Instead, Moreover, Similarly

Real SAT example: "Geoscientists have long considered Hawaii's Mauna Loa volcano to be Earth's largest shield volcano by volume... [BLANK] according to a 2020 study, Hawaii's Pūhāhonu shield volcano is significantly larger."
Answer: D) However

RULES:
- Correct answer: reflects the EXACT logical relationship between the two ideas
- Trap 1: A transition implying addition when contrast is needed (or vice versa)
- Trap 2: A transition implying causation when the relationship is contrast
- Trap 3: A transition that is grammatically fine but logically wrong

═══════════════════════════════════════════
QUESTION TYPE 7: STANDARD_ENGLISH
═══════════════════════════════════════════
Format: Sentence with [BLANK] requiring a grammatical choice.
Question stem (use EXACTLY): "Which choice completes the text so that it conforms to the conventions of Standard English?"

Grammar rules to test (pick exactly ONE):
- Possessives vs. plurals: "people's stories" vs "peoples story's"
- Subject-verb agreement with intervening phrase
- Punctuation with transitional adverbs: semicolon/comma placement
- Em dash vs. comma vs. period for sentence boundaries
- Colon vs. semicolon vs. comma between clauses
- Dangling modifier correction
- Verb tense consistency
- Appositive punctuation

Real SAT example: "the triangle representing the mountain itself [BLANK] among the few defined figures in her paintings."
A) are  B) have been  C) were  D) is
Answer: D

RULES:
- All 4 choices differ ONLY in punctuation or one grammatical element
- Wrong answers represent real, common grammar errors
- The sentence must be complex enough that the error is non-obvious

═══════════════════════════════════════════
QUESTION TYPE 8: RHETORICAL_SYNTHESIS
═══════════════════════════════════════════
Format: 4-5 bullet-point notes about a topic with a specific goal.
Question stem (use one EXACTLY):
- "The student wants to emphasize a difference between [X] and [Y]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"
- "The student wants to present [topic] to an audience unfamiliar with [subject]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"
- "The student wants to explain an advantage of [X]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"
- "The student wants to emphasize a similarity between [X] and [Y]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"

Real SAT example (baking soda vs. baking powder):
D) To produce carbon dioxide within a liquid batter, baking soda needs to be mixed with an acidic ingredient, whereas baking powder does not.
Answer: D — directly states the key difference.

RULES:
- All 4 choices must use information that actually appears in the notes
- Correct answer: directly and specifically accomplishes the stated goal
- Trap 1: Uses notes accurately but accomplishes a DIFFERENT goal
- Trap 2: Accomplishes the goal but omits essential information
- Trap 3: Too vague or general to accomplish the specific goal

═══════════════════════════════════════════
UNIVERSAL RULES:
═══════════════════════════════════════════
1. Answer choices must be similar in length
2. Correct answer is always derivable from the passage/notes alone
3. Wrong answers must be genuinely tempting
4. Use formal academic language matching real SAT register
5. Question stems must use the EXACT phrasing shown above
6. Never reference line numbers

CRITICAL: Respond with ONLY a valid JSON object. No markdown. No backticks. Start with { end with }.

{
  "type": "WORD_CHOICE",
  "passage_excerpt": "Sentence with [BLANK] — only for WORD_CHOICE, TRANSITION, STANDARD_ENGLISH. Set null for all others.",
  "question": "Which choice completes the text with the most logical and precise word or phrase?",
  "choices": {
    "A": "first choice",
    "B": "second choice",
    "C": "third choice",
    "D": "fourth choice"
  },
  "correct": "B",
  "explanation": "Why the correct answer is right, grounded in the passage.",
  "trap_explanations": {
    "A": "Why A is tempting but wrong",
    "C": "Why C is tempting but wrong",
    "D": "Why D is tempting but wrong"
  }
}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const useNotes = Math.random() < 0.25;
    let userPrompt;
    let passage;

    if (useNotes) {
      // Rhetorical synthesis — use notes set
      const notesSet = notesSets[Math.floor(Math.random() * notesSets.length)];
      passage = {
        id: notesSet.id,
        title: `Notes: ${notesSet.topic}`,
        author: 'Student Notes',
        year: null,
        genre: 'rhetorical_synthesis',
        text: notesSet.notes.map(n => `• ${n}`).join('\n'),
      };
      userPrompt = `Generate a RHETORICAL_SYNTHESIS SAT question using these student notes:

Topic: ${notesSet.topic}
Notes:
${notesSet.notes.map(n => `• ${n}`).join('\n')}

The question stem must state a specific goal. All 4 answer choices must be complete sentences using information from the notes. Respond with ONLY a JSON object.`;

    } else {
      // Use a real public domain passage from passages.js
      // 10% chance of paired passage (cross-text connections)
      const usePaired = Math.random() < 0.10;

      if (usePaired) {
        const paired = getPairedPassage();
        passage = {
          ...paired,
          text: `Text 1\n${paired.text_a.text}\n\nText 2\n${paired.text_b.text}`,
        };
        userPrompt = `Generate a CROSS_TEXT SAT question for these two paired passages. The question should ask how the author of Text 2 would respond to a claim in Text 1, or what both texts have in common.

Text 1 by ${paired.text_a.author} (${paired.text_a.year}):
${paired.text_a.text}

Text 2 by ${paired.text_b.author} (${paired.text_b.year}):
${paired.text_b.text}

Use question stem: "Based on the texts, how would [Text 2 author] most likely respond to the claim in Text 1 that [specific claim]?"
Respond with ONLY a JSON object.`;

      } else {
        passage = getRandomPassage();
        const types = ['WORD_CHOICE', 'MAIN_IDEA', 'TEXT_STRUCTURE', 'COMMAND_OF_EVIDENCE', 'LOGICAL_COMPLETION', 'TRANSITION', 'STANDARD_ENGLISH'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        userPrompt = `Generate a ${chosenType} SAT question for this passage:

Title: "${passage.title}" by ${passage.author} (${passage.year})
Genre: ${passage.genre}

Passage:
${passage.text}

Respond with ONLY a JSON object.`;
      }
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    });

    let raw = response.choices[0].message.content.trim();
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON in response');
    const question = JSON.parse(raw.slice(start, end + 1));

    res.status(200).json({ passage, question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}