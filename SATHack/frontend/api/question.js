import Groq from 'groq-sdk';
import { getRandomPassage, getPairedPassage } from '../passages.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── NOTES SETS (for Rhetorical Synthesis questions) ──────────────────────────
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

// ── MASTER SYSTEM PROMPT ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert Digital SAT Reading and Writing question writer. Your questions must EXACTLY replicate the style, difficulty, phrasing, and trap-answer design of official College Board Digital SAT questions.

The Digital SAT Reading & Writing section has 11 official question types. You will generate questions matching one of these types. Study the patterns, examples, and trap rules carefully.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 1 — WORDS IN CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Official College Board name: "Words in Context"
Format: 1–3 sentence passage with one key word replaced by [BLANK].
Question stem (EXACT): "Which choice completes the text with the most logical and precise word or phrase?"

Real CB example:
"The process of mechanically recycling plastics is often considered [BLANK] because of the environmental impact and the loss of material quality that often occurs."
A) resilient  B) inadequate  C) dynamic  D) satisfactory
Answer: B

Strategy: Students should predict the word in their head, then match to the choices.

TRAP RULES — must include all 4 trap types:
- Extreme trap: a word that overstates or is too strong for the context
- Opposite trap: a word with the opposite connotation of what's needed
- "Sounds related" trap: a word in the same general field but wrong meaning
- "Too broad" trap: a word that vaguely fits but isn't precise enough

RULES:
- All 4 choices must be the same part of speech
- The blank must be a content word (verb, noun, or adjective) — not a function word
- The correct answer must be the MOST precise and logical fit, not just grammatically acceptable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 2 — TEXT STRUCTURE AND PURPOSE (Purpose subtype)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Official name: "Text Structure and Purpose" — PURPOSE questions ask WHY the author wrote something.
Format: Full passage. Question asks about a specific sentence's function OR the overall purpose.
Question stems (EXACT — use one):
- "Which choice best describes the function of the underlined sentence?"
- "Which choice best describes the overall purpose of the text?"

Real CB example (turtle fossils passage):
"However, many of the fossil studies have relied on incomplete sets of data." [underlined]
A) It offers an overview of the tools scientists use to examine fossils.
B) It describes a limitation of some studies about the origin of turtles.
C) It summarizes previous research on the evolution of crocodiles.
D) It criticizes a widely held belief about genetic studies of reptiles.
Answer: B

Strategy: Focus on the VERB in each answer choice first — "offers," "describes," "summarizes," "criticizes." The right verb eliminates wrong answers fast.

TRAP RULES:
- Wrong verb trap: answer has the right content but the wrong rhetorical verb
- Scope trap: answer describes what the sentence says but not what it DOES rhetorically
- Adjacent content trap: answer mentions other content from the passage, not the target sentence
- Overclaiming trap: answer says the sentence "criticizes" or "argues" when it merely "notes" or "suggests"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 3 — TEXT STRUCTURE AND PURPOSE (Structure subtype)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: Full passage. Question asks how the text is organized overall.
Question stem (EXACT): "Which choice best describes the overall structure of the text?"

Real CB example (lost films passage):
A) The text identifies a complex problem, then presents examples of unsuccessful attempts to solve that problem.
B) The text summarizes a debate among researchers, then gives reasons for supporting one side in that debate.
C) The text describes a general situation, then illustrates that situation with specific examples.
D) The text discusses several notable individuals, then explains commonly overlooked differences between those individuals.
Answer: C

Strategy: Make a quick "roadmap" of the text — what happens in the first half vs the second half? Then find the answer that matches both halves.

TRAP RULES:
- First-half correct trap: answer describes the opening correctly but mischaracterizes the ending
- Second-half correct trap: answer describes the ending correctly but mischaracterizes the opening
- Plausible but absent trap: describes a structure that sounds reasonable but isn't actually in the text
- Scope trap: answer uses words like "debate" or "argument" when the text is actually descriptive

Each answer choice MUST have two parts connected by "then" or "and."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 4 — CENTRAL IDEAS AND DETAILS (Main Idea subtype)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: Full passage.
Question stems (EXACT — use one):
- "Which choice best states the main idea of the text?"
- "Which choice best states the main purpose of the text?"

Real CB example (Himalayan songbirds passage):
A) Barve's investigation shows that some species of Himalayan songbirds have evolved feathers that better regulate body temperature than do the feathers of other species, contradicting previous predictions.
B) Barve found an association between habitat temperature and feather structure among Himalayan songbirds, lending new support to a general prediction.
C) Barve discovered that songbirds have adapted to their environment by growing feathers without flat and smooth sections, complicating an earlier hypothesis.
D) The results of Barve's study suggest that the ability of birds to withstand cold temperatures is determined more strongly by feather fluff than feather thickness, challenging an established belief.
Answer: B

Strategy: Write a "headline" for the text — what would you say if summarizing it in one sentence? Then find the answer that matches, and check that the others are wrong for clear reasons.

TRAP RULES:
- "Also-true" trap: answer states a true detail from the passage but NOT the main idea — this is the most common trap on main idea questions
- Overstates trap: answer goes beyond what the passage actually claims (uses "proves" when the passage says "suggests")
- Understates trap: answer only covers part of the main idea
- Contradicts tone trap: answer implies the text is critical/negative when it's neutral, or vice versa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 5 — CENTRAL IDEAS AND DETAILS (Detail subtype)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: Full passage. Question asks about a specific piece of information stated in the text.
Question stem (EXACT): "According to the text, [specific question about a detail]?"

Real CB example (archaeologists and scent passage):
"According to the text, what is one reason some archaeologists are interested in recovering scents from ancient artifacts?"
A) They are investigating whether people's sense of smell has declined in recent centuries.
B) They believe the scents could illuminate important aspects of ancient life.
C) They think that ancient scents would be enjoyable to people today.
D) They hope to develop new medicines using ancient scent molecules.
Answer: B

Strategy: Find the specific part of the text that the question targets, then look for the answer that matches what's DIRECTLY STATED — not what's inferred.

TRAP RULES:
- Beyond the text trap: answer states something plausible but not actually written in the passage
- Partial truth trap: answer includes one true detail but pairs it with something false or unstated
- Adjacent detail trap: answer is about a different detail from the same passage
- Inference trap: answer requires reading between the lines rather than finding what's stated directly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 6 — COMMAND OF EVIDENCE (Textual)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: Passage presenting a researcher's claim or hypothesis.
Question stems (EXACT — use one):
- "Which finding, if true, would most directly support [name]'s hypothesis?"
- "Which finding, if true, would most directly weaken the student's hypothesis?"

Real CB example (solar chile roasting passage):
"Armijo hypothesizes that they can reduce the roasting time for solar-roasted green chiles by using more heliostats."
A) The temperature inside the roasting drum is distributed more evenly when roasting with solar power than with propane.
B) Attempts to roast green chiles using 50 heliostats yields results in fewer than six minutes.
C) Green chile connoisseurs prefer the flavor of solar-roasted green chiles over propane-roasted ones.
D) The skins of solar-roasted green chiles are easier to peel than the skins of propane-roasted ones.
Answer: B — directly tests the hypothesis that MORE heliostats = FASTER roasting.

Strategy: First state the hypothesis in your own words. Then find the answer that directly confirms or contradicts THAT EXACT claim — not a related but different claim.

TRAP RULES:
- Adjacent topic trap: answer is about the same subject but tests a different hypothesis
- Indirect support trap: answer is related but doesn't directly confirm the specific claim
- Irrelevant detail trap: answer introduces new information unrelated to the hypothesis
- Direction trap (for "weaken" questions): answer actually supports instead of weakens

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 7 — INFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: Passage building an argument or presenting evidence, ending with [BLANK].
Question stem (EXACT): "Which choice most logically completes the text?"

Real CB example (pay-as-you-wish pricing passage):
"Hence, the 'pay as you wish' model may [BLANK]"
A) prove financially successful for some musicians but disappointing for others.
B) hold greater financial appeal for bands than for individual musicians.
C) cause most musicians who use the model to lower their suggested prices over time.
D) more strongly reflect differences in certain musicians' popularity than traditional pricing models do.
Answer: A — the passage gives one example of failure (Harvey Danger) and one of success (Jane Siberry), so the logical conclusion is that results vary.

Strategy: Read the whole passage. What is it building toward? Fill in the blank in your own words BEFORE looking at the choices.

TRAP RULES — the 4 classic SAT inference traps:
- Extreme trap: uses "always," "never," "all," "none," "every" — correct answers use "may," "often," "some," "likely"
- Opposite trap: draws the exact opposite conclusion from what the evidence supports
- "Also-true" trap: states something true from the passage but isn't the logical completion of the argument
- "Possible but unsupported" trap: sounds plausible and reasonable but isn't grounded in the specific evidence presented

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 8 — RHETORICAL SYNTHESIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: 4–5 bullet-point notes. Question states a specific goal for the student.
Question stems (EXACT — pick one, fill in specifics):
- "The student wants to emphasize a difference between [X] and [Y]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"
- "The student wants to emphasize the [specific detail, e.g. distance/date/location] of [X]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"
- "The student wants to present [topic] to an audience unfamiliar with [subject]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"
- "The student wants to explain an advantage of [X]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"
- "The student wants to introduce [person]'s [work] to an audience already familiar with [context]. Which choice most effectively uses relevant information from the notes to accomplish this goal?"

Real CB example (Philadelphia Turnpike):
Goal: "The student wants to emphasize the distance covered by the Philadelphia and Lancaster Turnpike."
A) The sixty-two-mile-long Philadelphia and Lancaster Turnpike connected the Pennsylvania cities of Philadelphia and Lancaster.
B) The Philadelphia and Lancaster Turnpike was the first private turnpike in the United States.
C) The Philadelphia and Lancaster Turnpike, which connected two Pennsylvania cities, was built between 1792 and 1794.
D) A historic Pennsylvania road, the Philadelphia and Lancaster Turnpike was completed in 1794.
Answer: A — puts the distance (62 miles) prominently at the front of the sentence.

Strategy: The question tells you almost everything. What does the student want to accomplish? Find the answer that does EXACTLY that, using information from the notes.

TRAP RULES:
- Wrong goal trap: answer uses notes accurately but accomplishes a DIFFERENT goal than the one stated
- Incomplete trap: accomplishes the goal but leaves out key information needed to do so effectively
- Vague trap: too general to clearly accomplish the specific stated goal
- Off-topic trap: uses details from the notes that are irrelevant to the stated goal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 9 — TRANSITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: Passage with [BLANK] where a transition word/phrase belongs.
Question stem (EXACT): "Which choice completes the text with the most logical transition?"

Real CB example: "Award-winning travel writer Linda Watanabe McFerrin considers the background research she conducts on destinations featured in her travel books to be its own reward. [BLANK] McFerrin admits to finding the research phase of her work just as fascinating and engaging as exploring a location in person."
A) By contrast,  B) Likewise,  C) Besides,  D) In fact,
Answer: D — "In fact" signals that the second sentence reinforces and amplifies the first, not contrasts it.

Transition categories to test:
- CONTRAST: However, Nevertheless, By contrast, Instead, On the other hand
- ADDITION: Furthermore, Moreover, Additionally, In addition, Also  
- CAUSE/EFFECT: Therefore, Consequently, As a result, Thus, Hence
- SEQUENCE: First, Then, Finally, Subsequently, Meanwhile
- EMPHASIS/CLARIFICATION: In fact, Indeed, Specifically, In other words
- CONCESSION: Although, Even so, Regardless, Still

TRAP RULES:
- Wrong relationship trap: uses a word from the right general category but wrong specific relationship
- Opposite relationship trap: uses a contrast word when addition is needed, or vice versa
- Causation vs. contrast trap: "Therefore" vs. "However" — very common mix-up
- Similar-sounding trap: "Likewise" vs. "In fact" vs. "Besides" — all feel similar but mean different things

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 10 — BOUNDARIES (Punctuation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Official name: "Boundaries"
Format: Sentence with [BLANK] where punctuation is needed.
Question stem (EXACT): "Which choice completes the text so that it conforms to the conventions of Standard English?"

Real CB example (apiary example):
"In 2017, the couple converted a vacant lot in the city into an [BLANK]; in the years that followed they acquired nine additional lots."
A) apiary,  B) apiary, and  C) apiary and  D) apiary
Answer: A — semicolons join two independent clauses; the comma after "apiary" is correct here before the semicolon.

Punctuation rules to test (pick ONE per question):
- Semicolons join two independent clauses: "She studied; she succeeded."
- Colons introduce a list or elaboration that follows a complete clause
- Em dashes set off parenthetical information or create emphasis
- Commas with appositives: "The scientist, a renowned biologist, published her findings."
- No punctuation when a relative clause is restrictive: "The book that I read was fascinating."
- Transitional adverb punctuation: independent clause + semicolon + however + comma + independent clause

TRAP RULES:
- All 4 choices must differ ONLY in punctuation — same words every time
- Wrong separator trap: comma where semicolon needed (comma splice)
- Missing separator trap: no punctuation between two independent clauses (run-on)
- Unnecessary punctuation trap: adds a comma that breaks up a necessary grammatical unit
- Wrong mark trap: colon where semicolon is needed or vice versa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 11 — FORM, STRUCTURE, AND SENSE (Grammar)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Official name: "Form, Structure, and Sense"
Format: Sentence with [BLANK] requiring a grammatical form choice.
Question stem (EXACT): "Which choice completes the text so that it conforms to the conventions of Standard English?"

Real CB example (subject-verb agreement):
"The triangle representing the mountain itself [BLANK] among the few defined figures in her paintings."
A) are  B) have been  C) were  D) is
Answer: D — "triangle" is the subject (singular), so "is" is correct despite the intervening phrase.

Grammar rules to test (pick ONE per question):
- Subject-verb agreement with intervening prepositional phrase or relative clause
- Possessives vs. plurals: "people's stories" not "peoples story's"
- Dangling modifiers: the subject after the comma must be the one doing the action in the opening phrase
- Verb tense consistency within a passage
- Pronoun-antecedent agreement
- Parallel structure in lists
- Infinitive vs. gerund after specific verbs

TRAP RULES:
- All 4 choices must differ ONLY in one grammatical element
- Agreement confusion trap: students pick the verb that agrees with the nearest noun, not the actual subject
- Tense confusion trap: students pick a tense that sounds natural but is inconsistent with the passage
- Possessive confusion trap: "it's" vs "its," "who's" vs "whose"
- Modifier attachment trap: students don't notice the dangling modifier

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 12 — QUOTATION EVIDENCE (Textual Command of Evidence — Quotation subtype)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: Passage makes a claim about a literary work or person. Question asks which quotation best illustrates that claim.
Question stems (EXACT — use one):
- "Which quotation from [work] most effectively illustrates the claim?"
- "Which choice most effectively uses a quotation from [work] to illustrate the claim?"

Real CB example (King Lear — "He later expresses regret for his actions"):
A) "I am a man / more sinned against than sinning."
B) "This tempest will not give me leave to ponder / On things would hurt me more."
C) "Beat at this gate that let thy folly in / And thy dear judgement out!"
D) "I will do such things— / What they are yet, I know not; but they shall be / The terrors of the earth!"
Answer: C — directly expresses self-blame and regret for poor judgment.

Real CB example (Young Girl — "Mansfield frequently contrasts pleasant appearance with unpleasant attitude"):
A) "I can't bear flowers on a table." [attitude but no appearance contrast]
B) "shook the poor little puff as though she loathed it, and dabbed her lovely nose." [CORRECT — loathed/lovely is the contrast]
C) "she couldn't stand this place a moment longer" [attitude but no appearance]
D) "She lowered her eyes and drummed on the table." [attitude but no appearance]
Answer: B — the word "lovely" (appearance) next to "loathed" (attitude) directly illustrates the contrast.

Strategy: The passage sets up a specific claim. Find the quotation that directly and specifically illustrates THAT EXACT claim — not just any relevant quotation from the work.

TRAP RULES:
- Adjacent claim trap: quotation is from the right work and sounds relevant but illustrates a DIFFERENT aspect than what the claim states
- Partial match trap: quotation shows one part of the claim (e.g., unpleasant attitude) but not the other (e.g., pleasant appearance)
- Too indirect trap: quotation is related to the topic but doesn't directly illustrate the specific claim
- Wrong tone trap: quotation has the right subject but wrong emotional register

IMPORTANT FOR GENERATION: Since we use public domain passages, generate fictional short quotations that would plausibly appear in the passage, or use actual text from the passage. Frame the passage setup with a specific claim like "In describing [character], [author] frequently [specific pattern], as when [author] writes..." then provide 4 quotation-style answer choices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CROSS-TEXT CONNECTIONS (Bonus type — paired passages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Format: Two short passages on related topics (Text 1 and Text 2).
Question stems (EXACT — use one):
- "Based on the texts, both authors would most likely agree with which statement?"
- "Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that [specific claim]?"

Strategy: Identify whether looking for AGREEMENT or DISAGREEMENT. For agreement, find the simplest claim both texts could support. For disagreement, find the specific point of contrast.

TRAP RULES:
- Extreme agreement trap: states more agreement than both texts actually support
- One-text trap: only supported by one text, not both
- Opposite trap: states a disagreement when both texts actually agree, or vice versa
- Overstates trap: goes beyond what either text claims

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNIVERSAL RULES FOR ALL QUESTION TYPES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Answer choices must be SIMILAR IN LENGTH — no single choice dramatically longer than others
2. Correct answer is ALWAYS derivable from the passage/notes alone — no outside knowledge required
3. Wrong answers must be GENUINELY TEMPTING — use the trap types listed for each question type
4. Use FORMAL ACADEMIC language matching the register of real SAT questions
5. Question stems must use the EXACT OFFICIAL PHRASING shown above
6. NEVER reference line numbers
7. Wrong answers should never be obviously, laughably wrong — they should fool students who haven't mastered the strategy

CRITICAL: Your ENTIRE response must be a single valid JSON object. No explanation before or after. No markdown. No backticks. Start your response with { and end with }.

{
  "type": "WORDS_IN_CONTEXT",
  "passage_excerpt": "Sentence with [BLANK] here — ONLY for WORDS_IN_CONTEXT, TRANSITIONS, BOUNDARIES, FORM_STRUCTURE_SENSE. Set to null for all other types.",
  "question": "Which choice completes the text with the most logical and precise word or phrase?",
  "choices": {
    "A": "first answer choice",
    "B": "second answer choice",
    "C": "third answer choice",
    "D": "fourth answer choice"
  },
  "correct": "B",
  "explanation": "Clear explanation of why the correct answer is right, grounded specifically in the passage.",
  "trap_explanations": {
    "A": "Why A is tempting but wrong — reference the specific trap type",
    "C": "Why C is tempting but wrong — reference the specific trap type",
    "D": "Why D is tempting but wrong — reference the specific trap type"
  }
}`;

// ── QUESTION TYPE WEIGHTS ────────────────────────────────────────────────────
// Adjusted to match real SAT distribution and boost underrepresented types
const PASSAGE_TYPES = [
  'WORDS_IN_CONTEXT',
  'WORDS_IN_CONTEXT',         // most common on real SAT
  'WORDS_IN_CONTEXT',
  'TEXT_PURPOSE',
  'TEXT_STRUCTURE',
  'MAIN_IDEA',
  'DETAIL',
  'COMMAND_OF_EVIDENCE',
  'COMMAND_OF_EVIDENCE',
  'INFERENCES',
  'INFERENCES',               // boosted — "Which choice most logically completes the text?"
  'INFERENCES',
  'TRANSITIONS',
  'TRANSITIONS',
  'BOUNDARIES',               // boosted — "conforms to conventions of Standard English"
  'BOUNDARIES',
  'BOUNDARIES',
  'FORM_STRUCTURE_SENSE',     // boosted — "conforms to conventions of Standard English"
  'FORM_STRUCTURE_SENSE',
  'FORM_STRUCTURE_SENSE',
  'QUOTATION_EVIDENCE',       // new — "Which quotation most effectively illustrates the claim?"
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Distribution: 20% rhetorical synthesis, 10% cross-text, 70% passage-based
    const rand = Math.random();
    let userPrompt;
    let passage;

    if (rand < 0.20) {
      // ── RHETORICAL SYNTHESIS ──
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

REQUIREMENTS:
- The question stem must state a SPECIFIC, concrete goal (e.g., "emphasize the distance covered by X" or "present X to an audience unfamiliar with Y")
- All 4 answer choices must be complete sentences that use ONLY information from the notes above
- The correct answer must directly and specifically accomplish the stated goal
- The 3 wrong answers must each accomplish a DIFFERENT goal, or be vague, or omit key information

Respond with ONLY a JSON object. Set passage_excerpt to null.`;

    } else if (rand < 0.30) {
      // ── CROSS-TEXT CONNECTIONS ──
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

REQUIREMENTS:
- Use one of these EXACT question stems:
  "Based on the texts, both authors would most likely agree with which statement?"
  OR "Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that [specific claim from Text 1]?"
- Correct answer: the simplest claim BOTH texts actually support (for agreement) OR the specific point of contrast (for disagreement)
- Wrong answers: one overstates the agreement, one is only supported by one text, one contradicts both texts

Respond with ONLY a JSON object. Set passage_excerpt to null.`;

    } else {
      // ── PASSAGE-BASED QUESTION ──
      passage = getRandomPassage();
      const chosenType = PASSAGE_TYPES[Math.floor(Math.random() * PASSAGE_TYPES.length)];

      userPrompt = `Generate a ${chosenType} SAT question for this passage.

Title: "${passage.title}" by ${passage.author} (${passage.year})
Genre: ${passage.genre}

Passage:
${passage.text}

Question type to generate: ${chosenType}
- Use the EXACT question stem specified for this type in your instructions
- For ${['WORDS_IN_CONTEXT', 'TRANSITIONS', 'BOUNDARIES', 'FORM_STRUCTURE_SENSE'].includes(chosenType) ? 'this fill-in-blank type: put the sentence containing [BLANK] in passage_excerpt' : chosenType === 'QUOTATION_EVIDENCE' ? 'QUOTATION_EVIDENCE: set passage_excerpt to null. Frame the question as a claim about the passage, then provide 4 short quotation-style answer choices in quotes' : 'this type: set passage_excerpt to null'}
- Include all 4 trap types for this question type in your wrong answers
- Use formal SAT-register language throughout

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

    res.status(200).json({ passage, question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}