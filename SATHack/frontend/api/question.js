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
  {
    id: "notes_turnpike",
    topic: "Early American Infrastructure",
    notes: [
      "The Philadelphia and Lancaster Turnpike was a road built between 1792 and 1794.",
      "It was the first private turnpike in the United States.",
      "It connected the cities of Philadelphia and Lancaster in the state of Pennsylvania.",
      "It was sixty-two miles long.",
      "The road was made of crushed stone and gravel, a technique known as macadamization.",
    ],
  },
  {
    id: "notes_solar_roasting",
    topic: "Solar-Powered Chile Roasting",
    notes: [
      "Engineer Kenneth Armijo and his team roasted batches of green chiles using between 38 and 42 heliostats.",
      "Heliostats are devices that concentrate sunlight to generate heat.",
      "The team successfully reached the same roasting temperature used in traditional propane roasting.",
      "However, propane roasting yielded faster results — propane batches took four minutes, while solar batches took six.",
      "Armijo hypothesizes that using more heliostats could reduce the solar roasting time.",
    ],
  },
  {
    id: "notes_streaming",
    topic: "Music Streaming and Live Performance",
    notes: [
      "Streaming services allow consumers to access large numbers of songs for a monthly fee.",
      "The rise of streaming has reduced sales of full-length albums.",
      "As a result, musicians are increasingly dependent on revenue from live performances.",
      "Music festival appearances have become a more important part of musicians' careers.",
      "Live music festival attendance has grown in part due to the 'experiential economy,' in which consumers find value in purchasing lived experiences.",
    ],
  },
];

const SYSTEM_PROMPT = `You are a Digital SAT question writer. Generate ONE question matching the exact style of official College Board SAT questions.

QUESTION TYPES AND EXACT STEMS:
- WORDS_IN_CONTEXT: "Which choice completes the text with the most logical and precise word or phrase?" — replace one key word with [BLANK] in passage_excerpt. All 4 choices same part of speech.
- TEXT_PURPOSE: "Which choice best describes the function of the underlined sentence?" — each choice starts with a verb (offers/describes/summarizes/criticizes/presents).
- TEXT_STRUCTURE: "Which choice best describes the overall structure of the text?" — each choice has TWO parts connected by "then."
- MAIN_IDEA: "Which choice best states the main idea of the text?"
- DETAIL: "According to the text, [specific question]?"
- COMMAND_OF_EVIDENCE: "Which finding, if true, would most directly support/weaken [name]'s hypothesis?"
- INFERENCES: "Which choice most logically completes the text?" — passage ends mid-sentence, put full passage ending in [BLANK] in passage_excerpt.
- TRANSITIONS: "Which choice completes the text with the most logical transition?" — replace transition word with [BLANK] in passage_excerpt. Choices are single transition words/phrases only.
- BOUNDARIES: "Which choice completes the text so that it conforms to the conventions of Standard English?" — all 4 choices are the SAME words differing ONLY in punctuation.
- FORM_STRUCTURE_SENSE: "Which choice completes the text so that it conforms to the conventions of Standard English?" — all 4 choices differ in ONE grammatical element only (verb form, tense, possessive, pronoun).
- QUOTATION_EVIDENCE: "Which quotation from the text most effectively illustrates the claim?" — passage makes a specific claim, choices are 4 short quoted passages.
- RHETORICAL_SYNTHESIS: "The student wants to [specific goal]. Which choice most effectively uses relevant information from the notes to accomplish this goal?" — choices are complete sentences.
- CROSS_TEXT_CONNECTIONS: "Based on the texts, both authors would most likely agree with which statement?" — paired passages only.

TRAP ANSWER RULES (apply to every question):
- "also-true" trap: accurate but not the right answer
- "opposite" trap: reverses the meaning
- "extreme" trap: uses always/never/all/none
- "plausible but unsupported" trap: sounds reasonable but not in the passage

PASSAGE_EXCERPT RULES:
- Set to sentence with [BLANK] for: WORDS_IN_CONTEXT, TRANSITIONS, BOUNDARIES, FORM_STRUCTURE_SENSE, INFERENCES
- Set to null for everything else

UNIVERSAL RULES:
- ALL 4 choices A, B, C, D must always be present and non-empty
- Choices must be similar in length
- Correct answer derivable from passage alone
- Formal SAT-register language
- Never reference line numbers

CRITICAL: Respond with ONLY valid JSON. No markdown. No backticks. Start with { end with }.

{
  "type": "WORDS_IN_CONTEXT",
  "passage_excerpt": "sentence with [BLANK] or null",
  "question": "exact question stem",
  "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correct": "B",
  "explanation": "why correct answer is right",
  "trap_explanations": { "A": "why wrong", "C": "why wrong", "D": "why wrong" }
}`;

const PASSAGE_TYPES = [
  'WORDS_IN_CONTEXT',
  'WORDS_IN_CONTEXT',
  'WORDS_IN_CONTEXT',
  'TEXT_PURPOSE',
  'TEXT_STRUCTURE',
  'MAIN_IDEA',
  'DETAIL',
  'COMMAND_OF_EVIDENCE',
  'COMMAND_OF_EVIDENCE',
  'INFERENCES',
  'INFERENCES',
  'INFERENCES',
  'TRANSITIONS',
  'TRANSITIONS',
  'BOUNDARIES',
  'BOUNDARIES',
  'BOUNDARIES',
  'FORM_STRUCTURE_SENSE',
  'FORM_STRUCTURE_SENSE',
  'FORM_STRUCTURE_SENSE',
  'QUOTATION_EVIDENCE',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const rand = Math.random();
    let userPrompt;
    let passage;

    if (rand < 0.20) {
      const notesSet = notesSets[Math.floor(Math.random() * notesSets.length)];
      passage = {
        id: notesSet.id,
        title: `Notes: ${notesSet.topic}`,
        author: 'Student Notes',
        year: null,
        genre: 'rhetorical_synthesis',
        text: notesSet.notes.map(n => `• ${n}`).join('\n'),
      };
      userPrompt = `Generate a RHETORICAL_SYNTHESIS SAT question using these student notes.

Topic: ${notesSet.topic}
Notes:
${notesSet.notes.map(n => `• ${n}`).join('\n')}

- Question stem must state a SPECIFIC goal
- All 4 choices must be complete sentences using ONLY info from the notes
- Correct answer directly accomplishes the stated goal
- Wrong answers accomplish a different goal, are vague, or omit key info
- Set passage_excerpt to null
Respond with ONLY a JSON object.`;

    } else if (rand < 0.30) {
      const paired = getPairedPassage();
      passage = {
        ...paired,
        text: `Text 1\n${paired.text_a.text}\n\nText 2\n${paired.text_b.text}`,
      };
      userPrompt = `Generate a CROSS_TEXT_CONNECTIONS SAT question for these two passages.

Text 1 by ${paired.text_a.author} (${paired.text_a.year}):
${paired.text_a.text}

Text 2 by ${paired.text_b.author} (${paired.text_b.year}):
${paired.text_b.text}

- Use stem: "Based on the texts, both authors would most likely agree with which statement?"
- Correct answer: simplest claim both texts support
- Wrong answers: one overstates, one only fits one text, one contradicts both
- Set passage_excerpt to null
Respond with ONLY a JSON object.`;

    } else {
      passage = getRandomPassage();
      const chosenType = PASSAGE_TYPES[Math.floor(Math.random() * PASSAGE_TYPES.length)];
      const needsExcerpt = ['WORDS_IN_CONTEXT', 'TRANSITIONS', 'BOUNDARIES', 'FORM_STRUCTURE_SENSE', 'INFERENCES'].includes(chosenType);

      userPrompt = `Generate a ${chosenType} SAT question for this passage.

Title: "${passage.title}" by ${passage.author} (${passage.year})
Genre: ${passage.genre}

Passage:
${passage.text}

- Use the EXACT question stem for ${chosenType} from your instructions
- ${needsExcerpt ? 'Put the sentence with [BLANK] in passage_excerpt' : 'Set passage_excerpt to null'}
- ALL 4 choices A, B, C, D must be present and non-empty
- Include all 4 trap answer types
Respond with ONLY a JSON object.`;
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.9,
    });

    let raw = response.choices[0].message.content.trim();
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON in response');
    const question = JSON.parse(raw.slice(start, end + 1));

    // Safety check — ensure all choices exist
    ['A', 'B', 'C', 'D'].forEach(l => {
      if (!question.choices[l]) question.choices[l] = '(unavailable)';
    });

    res.status(200).json({ passage, question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}