import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── PASSAGES (inlined — Vercel serverless can't import from parent directories) ──
const passages = [
  {
    id: "austen_pp_01", title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "literary_fiction",
    text: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters. My dear Mr. Bennet, said his lady to him one day, have you heard that Netherfield Park is let at last? Mr. Bennet replied that he had not. But it is, returned she; for Mrs. Long has just been here, and she told me all about it.`,
  },
  {
    id: "austen_pp_02", title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "literary_fiction",
    text: `Elizabeth's spirits soon rising to playfulness again, she wanted Mr. Darcy to account for his having ever fallen in love with her. How could you begin? said she. I can comprehend your going on charmingly, when you had once made a beginning; but what could set you off in the first place? I cannot fix on the hour, or the spot, or the look, or the words, which laid the foundation. It is too long ago. I was in the middle before I knew that I had begun. My beauty you had early withstood, and as for my manners — my behaviour to you was at least always bordering on the uncivil, and I never spoke to you without rather wishing to give you pain than not.`,
  },
  {
    id: "twain_huck_01", title: "Adventures of Huckleberry Finn", author: "Mark Twain", year: 1884, genre: "literary_fiction",
    text: `You don't know about me without you have read a book by the name of The Adventures of Tom Sawyer; but that ain't no matter. That book was made by Mr. Mark Twain, and he told the truth, mainly. There was things which he stretched, but mainly he told the truth. I never seen anybody but lied one time or another, without it was Aunt Polly, or the widow, or maybe Mary. Aunt Polly and the Widow Douglas are all told about in that book, which is mostly a true book, with some stretchers, as I said before.`,
  },
  {
    id: "wharton_age_01", title: "The Age of Innocence", author: "Edith Wharton", year: 1920, genre: "literary_fiction",
    text: `On a January evening of the early seventies, Christine Nilsson was singing in Faust at the Academy of Music in New York. Though there was already talk of the erection of a new Opera House which should compete in costliness and splendour with those of the great European capitals, the world of fashion was still content to reassemble every winter in the shabby red and gold boxes of the sociable old Academy. Conservatives cherished it for being small and inconvenient, and thus keeping out the new people whom New York was beginning to dread and yet be drawn to.`,
  },
  {
    id: "london_call_01", title: "The Call of the Wild", author: "Jack London", year: 1903, genre: "literary_fiction",
    text: `Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and warm of long coat, from Puget Sound to San Diego. Because men, groping in the Arctic darkness, had found a yellow metal, and because steamship and transportation companies were booming the find, thousands of men were rushing into the Northland. These men wanted dogs, and the dogs they wanted were heavy dogs, with strong muscles by which to toil, and furry coats to protect them from the frost.`,
  },
  {
    id: "chopin_awakening_01", title: "The Awakening", author: "Kate Chopin", year: 1899, genre: "literary_fiction",
    text: `She was becoming herself and daily casting aside that fictitious self which we assume like a garment with which to appear before the world. She had resolved never again to belong to another than herself. The years that are gone seem very brief to me as I look back upon them. They seem to have been a brief period of compulsory nonentity during which I was under the influence of an overwhelming love. Now I do not feel that way. Now I am myself.`,
  },
  {
    id: "dickens_tale_01", title: "A Tale of Two Cities", author: "Charles Dickens", year: 1859, genre: "literary_fiction",
    text: `It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way — in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.`,
  },
  {
    id: "burnett_garden_01", title: "The Secret Garden", author: "Frances Hodgson Burnett", year: 1911, genre: "literary_fiction",
    text: `Mary was an odd, determined little person, and now she had something interesting to be determined about, she was very much absorbed, indeed. She worked and dug and pulled up weeds steadily, only becoming more pleased with her work every hour instead of tiring of it. It seemed to her like a fascinating sort of play. She found things to do every hour, and was never tired of managing her little kingdom.`,
  },
  {
    id: "douglass_speech_01", title: "What to the Slave is the Fourth of July?", author: "Frederick Douglass", year: 1852, genre: "historical_document",
    text: `Fellow-citizens, pardon me, allow me to ask, why am I called upon to speak here today? What have I, or those I represent, to do with your national independence? Are the great principles of political freedom and of natural justice, embodied in that Declaration of Independence, extended to us? But such is not the state of the case. I say it with a sad sense of the disparity between us. I am not included within the pale of this glorious anniversary. The rich inheritance of justice, liberty, prosperity, and independence bequeathed by your fathers is shared by you, not by me.`,
  },
  {
    id: "lincoln_gettysburg_01", title: "Gettysburg Address", author: "Abraham Lincoln", year: 1863, genre: "historical_document",
    text: `Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.`,
  },
  {
    id: "anthony_speech_01", title: "Is It a Crime for a Citizen to Vote?", author: "Susan B. Anthony", year: 1873, genre: "historical_document",
    text: `Friends and fellow citizens: I stand before you tonight under indictment for the alleged crime of having voted at the last presidential election, without having a lawful right to vote. It shall be my work this evening to prove to you that in thus voting, I not only committed no crime, but, instead, simply exercised my citizen's rights, guaranteed to me and all United States citizens by the National Constitution, beyond the power of any state to deny.`,
  },
  {
    id: "darwin_origin_01", title: "On the Origin of Species", author: "Charles Darwin", year: 1859, genre: "science",
    text: `It may be said that natural selection is daily and hourly scrutinising, throughout the world, every variation, even the slightest; rejecting that which is bad, preserving and adding up all that is good; silently and insensibly working, whenever and wherever opportunity offers, at the improvement of each organic being in relation to its organic and inorganic conditions of life. We see nothing of these slow changes in progress, until the hand of time has marked the long lapses of ages.`,
  },
  {
    id: "curie_research_01", title: "Researches on Radioactive Substances", author: "Marie Curie", year: 1904, genre: "science",
    text: `I undertook a systematic investigation of the property of uranium and found that the intensity of the radiation is proportional to the quantity of uranium present, and that no modification of the physical or chemical condition of uranium changes the intensity of the radiation it emits. These results showed that radioactivity is an atomic property of uranium, and suggested the possibility that elements other than uranium might possess the same property. This led me to examine other chemical elements and to discover that thorium was also radioactive.`,
  },
  {
    id: "thoreau_civil_01", title: "Civil Disobedience", author: "Henry David Thoreau", year: 1849, genre: "essay",
    text: `I heartily accept the motto, that government is best which governs least; and I should like to see it acted up to more rapidly and systematically. Carried out, it finally amounts to this, which also I believe: that government is best which governs not at all; and when men are prepared for it, that will be the kind of government which they will have. Government is at best but an expedient; but most governments are usually, and all governments are sometimes, inexpedient.`,
  },
  {
    id: "emerson_self_01", title: "Self-Reliance", author: "Ralph Waldo Emerson", year: 1841, genre: "essay",
    text: `To believe your own thought, to believe that what is true for you in your private heart is true for all men — that is genius. Speak your latent conviction, and it shall be the universal sense; for the inmost in due time becomes the outmost, and our first thought is rendered back to us by the trumpets of the Last Judgment. Familiar as the voice of the mind is to each, the highest merit we ascribe to Moses, Plato, and Milton is that they set at naught books and traditions, and spoke not what men thought, but what they thought.`,
  },
  {
    id: "woolf_room_01", title: "A Room of One's Own", author: "Virginia Woolf", year: 1929, genre: "essay",
    text: `A woman must have money and a room of her own if she is to write fiction. That was the conclusion I reached, turning over the pages of my notebook. Money meant independence. Independence meant the freedom to think and write. A room meant privacy. Privacy meant the ability to concentrate. For without these two things, what hope was there for women writers?`,
  },
  {
    id: "dubois_souls_01", title: "The Souls of Black Folk", author: "W.E.B. Du Bois", year: 1903, genre: "essay",
    text: `It is a peculiar sensation, this double-consciousness, this sense of always looking at one's self through the eyes of others, of measuring one's soul by the tape of a world that looks on in amused contempt and pity. One ever feels his two-ness — an American, a Negro; two souls, two thoughts, two unreconciled strivings; two warring ideals in one dark body, whose dogged strength alone keeps it from being torn asunder.`,
  },
  {
    id: "whitman_song_01", title: "Song of Myself", author: "Walt Whitman", year: 1855, genre: "literary_fiction",
    text: `I celebrate myself, and sing myself, and what I assume you shall assume, for every atom belonging to me as good belongs to you. I loafe and invite my soul, I lean and loafe at my ease observing a spear of summer grass. My tongue, every atom of my blood, formed from this soil, this air, born here of parents born here from parents the same, and their parents the same.`,
  },
  {
    id: "hardy_tess_01", title: "Tess of the d'Urbervilles", author: "Thomas Hardy", year: 1891, genre: "literary_fiction",
    text: `She was not an existence, an experience, a passion, a structure of sensations, to anybody but herself. To all humankind besides Tess was only a passing thought. Even to friends she was no more than a frequently passing thought. If she made herself miserable the likelihood was that nobody would much mind; and in the last resort she herself would not mind much, as long as she lived.`,
  },
  {
    id: "truth_speech_01", title: "Ain't I a Woman?", author: "Sojourner Truth", year: 1851, genre: "historical_document",
    text: `Well, children, where there is so much racket there must be something out of kilter. I think that between the negroes of the South and the women at the North, all talking about rights, the white men will be in a fix pretty soon. That man over there says that women need to be helped into carriages, and lifted over ditches, and to have the best place everywhere. Nobody ever helps me into carriages, or over mud-puddles, or gives me any best place! And ain't I a woman?`,
  },
];

// Paired passage for cross-text questions
const pairedPassage = {
  id: "paired_nature_01",
  title: "Paired: Nature and Solitude",
  author: "Thoreau / Emerson",
  year: 1854,
  genre: "paired",
  text_a: {
    author: "Henry David Thoreau", source: "Walden", year: 1854,
    text: `I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived. I did not wish to live what was not life, living is so dear; nor did I wish to practise resignation, unless it was quite necessary. I wanted to live deep and suck out all the marrow of life.`
  },
  text_b: {
    author: "Ralph Waldo Emerson", source: "Nature", year: 1836,
    text: `To go into solitude, a man needs to retire as much from his chamber as from society. I am not solitary whilst I read and write, though nobody is with me. But if a man would be alone, let him look at the stars. The rays that come from those heavenly worlds will separate between him and what he touches. One might think the atmosphere was made transparent with this design, to give man, in the heavenly bodies, the perpetual presence of the sublime.`
  },
};

// ── NOTES SETS ────────────────────────────────────────────────────────────────
const notesSets = [
  {
    id: "notes_bees", topic: "Bee Navigation",
    notes: [
      "Honeybees (Apis mellifera) use a 'waggle dance' to communicate the location of food sources to other bees.",
      "The angle of the dance relative to vertical indicates the direction of the food source relative to the sun.",
      "The duration of the waggle run indicates the distance to the food source.",
      "Bees that observe the dance are able to fly directly to the food source.",
      "Karl von Frisch first decoded the meaning of the waggle dance in the 1940s.",
    ],
  },
  {
    id: "notes_permafrost", topic: "Permafrost and Climate",
    notes: [
      "Permafrost is ground that remains frozen for two or more consecutive years.",
      "Permafrost covers about 25% of the Northern Hemisphere's land surface.",
      "When permafrost thaws, it releases carbon dioxide and methane stored in organic matter.",
      "Methane is approximately 25 times more potent as a greenhouse gas than carbon dioxide over a 100-year period.",
      "Scientists estimate that permafrost contains roughly twice as much carbon as is currently in the atmosphere.",
    ],
  },
  {
    id: "notes_urban_heat", topic: "Urban Heat Islands",
    notes: [
      "Urban heat islands form when cities replace natural land cover with dense concentrations of pavement, buildings, and other surfaces.",
      "These surfaces absorb and re-emit the sun's heat more than natural landscapes such as forests and water bodies.",
      "Temperatures in urban areas can be 1–7°F higher than in surrounding rural areas.",
      "Green roofs — rooftops covered with vegetation — can reduce urban surface temperatures by up to 40°F.",
      "Researcher Matei Georgescu found that large-scale adoption of green roofs in Phoenix, Arizona could reduce peak summer temperatures by up to 3°F.",
    ],
  },
  {
    id: "notes_sourdough", topic: "Sourdough Fermentation",
    notes: [
      "Sourdough bread is leavened using a starter culture containing wild yeasts and lactic acid bacteria.",
      "The bacteria produce lactic and acetic acids, which give sourdough its distinctive tangy flavor.",
      "Longer fermentation times produce more acetic acid, resulting in a more sour taste.",
      "Lactic acid bacteria also break down phytic acid in wheat, which can inhibit the absorption of minerals such as iron and zinc.",
      "A 2019 study by researchers at Stanford University found that sourdough fermentation significantly increased the bioavailability of iron in wheat flour.",
    ],
  },
  {
    id: "notes_bioluminescence", topic: "Bioluminescence in Marine Animals",
    notes: [
      "Bioluminescence is the production and emission of light by living organisms.",
      "An estimated 76% of ocean animals are capable of producing light.",
      "Marine bioluminescence is produced through a chemical reaction involving a compound called luciferin.",
      "Some deep-sea fish use bioluminescent lures to attract prey in the darkness of the ocean floor.",
      "Biologist Edith Widder has argued that bioluminescence is the most common form of communication on Earth.",
    ],
  },
  {
    id: "notes_turnpike", topic: "Early American Infrastructure",
    notes: [
      "The Philadelphia and Lancaster Turnpike was a road built between 1792 and 1794.",
      "It was the first private turnpike in the United States.",
      "It connected the cities of Philadelphia and Lancaster in the state of Pennsylvania.",
      "It was sixty-two miles long.",
      "The road was made of crushed stone and gravel, a technique known as macadamization.",
    ],
  },
  {
    id: "notes_solar_roasting", topic: "Solar-Powered Chile Roasting",
    notes: [
      "Engineer Kenneth Armijo and his team roasted batches of green chiles using between 38 and 42 heliostats.",
      "Heliostats are devices that concentrate sunlight to generate heat.",
      "The team successfully reached the same roasting temperature used in traditional propane roasting.",
      "However, propane roasting yielded faster results — propane batches took four minutes, while solar batches took six.",
      "Armijo hypothesizes that using more heliostats could reduce the solar roasting time.",
    ],
  },
  {
    id: "notes_streaming", topic: "Music Streaming and Live Performance",
    notes: [
      "Streaming services allow consumers to access large numbers of songs for a monthly fee.",
      "The rise of streaming has reduced sales of full-length albums.",
      "As a result, musicians are increasingly dependent on revenue from live performances.",
      "Music festival appearances have become a more important part of musicians' careers.",
      "Live music festival attendance has grown in part due to the experiential economy, in which consumers find value in purchasing lived experiences.",
    ],
  },
];

const SYSTEM_PROMPT = `You are a Digital SAT question writer. Generate ONE question matching the exact style of official College Board SAT questions.

QUESTION TYPES AND EXACT STEMS:
- WORDS_IN_CONTEXT: "Which choice completes the text with the most logical and precise word or phrase?" — Write a NEW 1-3 sentence passage about the same topic as the source (do NOT copy sentences verbatim). Put [BLANK] where one key word belongs. All 4 choices same part of speech.
- TEXT_PURPOSE: "Which choice best describes the function of the underlined sentence?" — each choice starts with a verb (offers/describes/summarizes/criticizes/presents).
- TEXT_STRUCTURE: "Which choice best describes the overall structure of the text?" — each choice has TWO parts connected by "then."
- MAIN_IDEA: "Which choice best states the main idea of the text?"
- DETAIL: "According to the text, [specific question]?"
- COMMAND_OF_EVIDENCE: "Which finding, if true, would most directly support/weaken [name]'s hypothesis?"
- INFERENCES: "Which choice most logically completes the text?" — Write a NEW passage about the same topic (do NOT copy verbatim). The passage builds an argument and ends with [BLANK]. Put the new passage in passage_excerpt.
- TRANSITIONS: "Which choice completes the text with the most logical transition?" — take one sentence from the passage, replace a transition word with [BLANK]. Choices are single transition words/phrases only.
- BOUNDARIES: "Which choice completes the text so that it conforms to the conventions of Standard English?" — all 4 choices are the SAME words differing ONLY in punctuation.
- FORM_STRUCTURE_SENSE: "Which choice completes the text so that it conforms to the conventions of Standard English?" — all 4 choices differ in ONE grammatical element only.
- QUOTATION_EVIDENCE: "Which quotation from the text most effectively illustrates the claim?" — passage makes a specific claim, choices are 4 short quoted passages.
- RHETORICAL_SYNTHESIS: "The student wants to [specific goal]. Which choice most effectively uses relevant information from the notes to accomplish this goal?" — choices are complete sentences.
- CROSS_TEXT_CONNECTIONS: "Based on the texts, both authors would most likely agree with which statement?"

TRAP ANSWER RULES: Include all 4 types per question:
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
  'WORDS_IN_CONTEXT', 'WORDS_IN_CONTEXT', 'WORDS_IN_CONTEXT',
  'TEXT_PURPOSE', 'TEXT_STRUCTURE',
  'MAIN_IDEA', 'DETAIL',
  'COMMAND_OF_EVIDENCE', 'COMMAND_OF_EVIDENCE',
  'INFERENCES', 'INFERENCES', 'INFERENCES',
  'TRANSITIONS', 'TRANSITIONS',
  'BOUNDARIES', 'BOUNDARIES', 'BOUNDARIES',
  'FORM_STRUCTURE_SENSE', 'FORM_STRUCTURE_SENSE', 'FORM_STRUCTURE_SENSE',
  'QUOTATION_EVIDENCE',
];

function getRandomPassage() {
  return passages[Math.floor(Math.random() * passages.length)];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const rand = Math.random();
    let userPrompt;
    let passage;

    if (rand < 0.20) {
      // RHETORICAL SYNTHESIS
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
      // CROSS-TEXT
      passage = {
        id: pairedPassage.id,
        title: pairedPassage.title,
        author: pairedPassage.author,
        year: pairedPassage.year,
        genre: 'paired',
        text: `Text 1\n${pairedPassage.text_a.text}\n\nText 2\n${pairedPassage.text_b.text}`,
      };
      userPrompt = `Generate a CROSS_TEXT_CONNECTIONS SAT question for these two passages.

Text 1 by ${pairedPassage.text_a.author} (${pairedPassage.text_a.year}):
${pairedPassage.text_a.text}

Text 2 by ${pairedPassage.text_b.author} (${pairedPassage.text_b.year}):
${pairedPassage.text_b.text}

- Use stem: "Based on the texts, both authors would most likely agree with which statement?"
- Correct answer: simplest claim both texts support
- Wrong answers: one overstates, one only fits one text, one contradicts both
- Set passage_excerpt to null
Respond with ONLY a JSON object.`;

    } else {
      // PASSAGE-BASED
      passage = getRandomPassage();
      const chosenType = PASSAGE_TYPES[Math.floor(Math.random() * PASSAGE_TYPES.length)];
      const needsExcerpt = ['WORDS_IN_CONTEXT', 'TRANSITIONS', 'BOUNDARIES', 'FORM_STRUCTURE_SENSE', 'INFERENCES'].includes(chosenType);

      userPrompt = `Generate a ${chosenType} SAT question for this passage.

Title: "${passage.title}" by ${passage.author} (${passage.year})
Genre: ${passage.genre}

Passage:
${passage.text}

- Use the EXACT question stem for ${chosenType}
- ${needsExcerpt ? 'Put the sentence/passage with [BLANK] in passage_excerpt' : 'Set passage_excerpt to null'}
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

    ['A', 'B', 'C', 'D'].forEach(l => {
      if (!question.choices[l]) question.choices[l] = '(unavailable)';
    });

    res.status(200).json({ passage, question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}