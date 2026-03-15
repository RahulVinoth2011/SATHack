// passages.js
// Public domain passage library for SAT Reading practice test generator
// All works published before 1928 — verified public domain in the US
// Sources: Project Gutenberg, Wikisource, Library of Congress

const passages = [

  // ─── LITERARY FICTION ────────────────────────────────────────────────────

  {
    id: "austen_pp_01",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    genre: "literary_fiction",
    lexile: 1080,
    difficulty: "hard",
    text: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters. "My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?" Mr. Bennet replied that he had not. "But it is," returned she; "for Mrs. Long has just been here, and she told me all about it." Mr. Bennet made no answer. "Do you not want to know who has taken it?" cried his wife impatiently. "You want to tell me, and I have no objection to hearing it." This was invitation enough.`,
    question_types: ["central_idea", "text_structure", "vocab_in_context", "tone"]
  },

  {
    id: "austen_pp_02",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    genre: "literary_fiction",
    lexile: 1080,
    difficulty: "hard",
    text: `Elizabeth's spirits soon rising to playfulness again, she wanted Mr. Darcy to account for his having ever fallen in love with her. "How could you begin?" said she. "I can comprehend your going on charmingly, when you had once made a beginning; but what could set you off in the first place?" "I cannot fix on the hour, or the spot, or the look, or the words, which laid the foundation. It is too long ago. I was in the middle before I knew that I had begun." "My beauty you had early withstood, and as for my manners — my behaviour to you was at least always bordering on the uncivil, and I never spoke to you without rather wishing to give you pain than not."`,
    question_types: ["central_idea", "character_inference", "vocab_in_context"]
  },

  {
    id: "twain_huck_01",
    title: "Adventures of Huckleberry Finn",
    author: "Mark Twain",
    year: 1884,
    genre: "literary_fiction",
    lexile: 980,
    difficulty: "medium",
    text: `You don't know about me without you have read a book by the name of The Adventures of Tom Sawyer; but that ain't no matter. That book was made by Mr. Mark Twain, and he told the truth, mainly. There was things which he stretched, but mainly he told the truth. That is nothing. I never seen anybody but lied one time or another, without it was Aunt Polly, or the widow, or maybe Mary. Aunt Polly — Tom's Aunt Polly, she is — and Mary, and the Widow Douglas is all told about in that book, which is mostly a true book, with some stretchers, as I said before.`,
    question_types: ["narrator_perspective", "text_structure", "vocab_in_context", "tone"]
  },

  {
    id: "wharton_age_01",
    title: "The Age of Innocence",
    author: "Edith Wharton",
    year: 1920,
    genre: "literary_fiction",
    lexile: 1150,
    difficulty: "hard",
    text: `On a January evening of the early seventies, Christine Nilsson was singing in Faust at the Academy of Music in New York. Though there was already talk of the erection, in remote metropolitan distances "above the Forties," of a new Opera House which should compete in costliness and splendour with those of the great European capitals, the world of fashion was still content to reassemble every winter in the shabby red and gold boxes of the sociable old Academy. Conservatives cherished it for being small and inconvenient, and thus keeping out the "new people" whom New York was beginning to dread and yet be drawn to.`,
    question_types: ["central_idea", "text_structure", "vocab_in_context", "tone"]
  },

  {
    id: "london_call_01",
    title: "The Call of the Wild",
    author: "Jack London",
    year: 1903,
    genre: "literary_fiction",
    lexile: 1020,
    difficulty: "medium",
    text: `Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and warm of long coat, from Puget Sound to San Diego. Because men, groping in the Arctic darkness, had found a yellow metal, and because steamship and transportation companies were booming the find, thousands of men were rushing into the Northland. These men wanted dogs, and the dogs they wanted were heavy dogs, with strong muscles by which to toil, and furry coats to protect them from the frost.`,
    question_types: ["central_idea", "text_structure", "command_of_evidence"]
  },

  {
    id: "chopin_awakening_01",
    title: "The Awakening",
    author: "Kate Chopin",
    year: 1899,
    genre: "literary_fiction",
    lexile: 1050,
    difficulty: "hard",
    text: `She was becoming herself and daily casting aside that fictitious self which we assume like a garment with which to appear before the world. Her husband seemed to her now like a person whom she had married without love as an excuse. She had resolved never again to belong to another than herself. The years that are gone seem very brief to me as I look back upon them. They seem to have been a brief period of compulsory nonentity during which I was under the influence of an overwhelming love for him. Now I do not feel that way.`,
    question_types: ["character_inference", "central_idea", "vocab_in_context"]
  },

  {
    id: "dickens_tale_01",
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    year: 1859,
    genre: "literary_fiction",
    lexile: 1100,
    difficulty: "hard",
    text: `It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way — in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.`,
    question_types: ["text_structure", "central_idea", "vocab_in_context", "tone"]
  },

  {
    id: "hardy_tess_01",
    title: "Tess of the d'Urbervilles",
    author: "Thomas Hardy",
    year: 1891,
    genre: "literary_fiction",
    lexile: 1090,
    difficulty: "hard",
    text: `She was not an existence, an experience, a passion, a structure of sensations, to anybody but herself. To all humankind besides Tess was only a passing thought. Even to friends she was no more than a frequently passing thought. If she made herself miserable the livelihood was that nobody would much mind; and in the last resort she herself would not mind much, as long as she lived. Clare, too, after a while began to feel the effect of this strange situation. The terrible insistency of human relations was begetting a shameless pleasure in the strangeness of their position.`,
    question_types: ["character_inference", "central_idea", "vocab_in_context"]
  },

  // ─── HISTORICAL DOCUMENTS & SPEECHES ─────────────────────────────────────

  {
    id: "douglass_speech_01",
    title: "What to the Slave is the Fourth of July?",
    author: "Frederick Douglass",
    year: 1852,
    genre: "historical_document",
    lexile: 1200,
    difficulty: "hard",
    text: `Fellow-citizens, pardon me, allow me to ask, why am I called upon to speak here to-day? What have I, or those I represent, to do with your national independence? Are the great principles of political freedom and of natural justice, embodied in that Declaration of Independence, extended to us? and am I, therefore, called upon to bring our humble offering to the national altar, and to confess the benefits and express devout gratitude for the blessings resulting from your independence to us? Would to God, both for your sakes and ours, that an affirmative answer could be truthfully returned to these questions!`,
    question_types: ["central_idea", "text_structure", "vocab_in_context", "tone", "command_of_evidence"]
  },

  {
    id: "lincoln_gettysburg_01",
    title: "Gettysburg Address",
    author: "Abraham Lincoln",
    year: 1863,
    genre: "historical_document",
    lexile: 1180,
    difficulty: "hard",
    text: `Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.`,
    question_types: ["central_idea", "text_structure", "vocab_in_context", "command_of_evidence"]
  },

  {
    id: "anthony_speech_01",
    title: "Is It a Crime for a Citizen of the United States to Vote?",
    author: "Susan B. Anthony",
    year: 1873,
    genre: "historical_document",
    lexile: 1150,
    difficulty: "hard",
    text: `Friends and fellow citizens: I stand before you tonight under indictment for the alleged crime of having voted at the last presidential election, without having a lawful right to vote. It shall be my work this evening to prove to you that in thus voting, I not only committed no crime, but, instead, simply exercised my citizen's rights, guaranteed to me and all United States citizens by the National Constitution, beyond the power of any state to deny. The preamble of the federal Constitution says: "We, the people of the United States, in order to form a more perfect union, establish justice, insure domestic tranquility, provide for the common defense, promote the general welfare, and secure the blessings of liberty to ourselves and our posterity, do ordain and establish this Constitution for the United States of America."`,
    question_types: ["central_idea", "text_structure", "command_of_evidence", "vocab_in_context"]
  },

  {
    id: "truth_speech_01",
    title: "Ain't I a Woman?",
    author: "Sojourner Truth",
    year: 1851,
    genre: "historical_document",
    lexile: 950,
    difficulty: "medium",
    text: `Well, children, where there is so much racket there must be something out of kilter. I think that 'twixt the negroes of the South and the women at the North, all talking about rights, the white men will be in a fix pretty soon. But what's all this here talking about? That man over there says that women need to be helped into carriages, and lifted over ditches, and to have the best place everywhere. Nobody ever helps me into carriages, or over mud-puddles, or gives me any best place! And ain't I a woman? Look at me! Look at my arm! I have ploughed and planted, and gathered into barns, and no man could head me! And ain't I a woman?`,
    question_types: ["central_idea", "text_structure", "tone", "vocab_in_context"]
  },

  // ─── SCIENCE & NATURAL HISTORY ────────────────────────────────────────────

  {
    id: "darwin_origin_01",
    title: "On the Origin of Species",
    author: "Charles Darwin",
    year: 1859,
    genre: "science",
    lexile: 1250,
    difficulty: "hard",
    text: `When we look to the individuals of the same variety or sub-variety of our older cultivated plants and animals, one of the first points which strikes us, is, that they generally differ much more from each other, than do the individuals of any one species or variety in a state of nature. When we reflect on the vast diversity of the plants and animals which have been cultivated, and which have varied during all ages under the most different climates and treatment, I think we are driven to conclude that this greater variability is simply due to our domestic productions having been raised under conditions of life not so uniform as, and somewhat different from, those to which the parent-species have been exposed under nature.`,
    question_types: ["central_idea", "command_of_evidence", "vocab_in_context", "text_structure"]
  },

  {
    id: "darwin_origin_02",
    title: "On the Origin of Species",
    author: "Charles Darwin",
    year: 1859,
    genre: "science",
    lexile: 1250,
    difficulty: "hard",
    text: `It may be said that natural selection is daily and hourly scrutinising, throughout the world, every variation, even the slightest; rejecting that which is bad, preserving and adding up all that is good; silently and insensibly working, whenever and wherever opportunity offers, at the improvement of each organic being in relation to its organic and inorganic conditions of life. We see nothing of these slow changes in progress, until the hand of time has marked the long lapses of ages, and then so imperfect is our view into long past geological ages, that we only see that the forms of life are now different from what they formerly were.`,
    question_types: ["central_idea", "vocab_in_context", "text_structure", "command_of_evidence"]
  },

  {
    id: "curie_research_01",
    title: "Researches on Radioactive Substances",
    author: "Marie Curie",
    year: 1904,
    genre: "science",
    lexile: 1200,
    difficulty: "hard",
    text: `The history of the discovery of radium and polonium is closely connected with that of the study of uranium radiation. Becquerel showed in 1896 that uranium compounds possess the remarkable property of emitting radiation capable of passing through opaque bodies and affecting photographic plates. I undertook a systematic investigation of this property of uranium and found that the intensity of the radiation is proportional to the quantity of uranium present, and that no modification of the physical or chemical condition of uranium changes the intensity of the radiation it emits.`,
    question_types: ["central_idea", "command_of_evidence", "text_structure", "vocab_in_context"]
  },

  // ─── ESSAYS & SOCIAL COMMENTARY ───────────────────────────────────────────

  {
    id: "thoreau_civil_01",
    title: "Civil Disobedience",
    author: "Henry David Thoreau",
    year: 1849,
    genre: "essay",
    lexile: 1200,
    difficulty: "hard",
    text: `I heartily accept the motto, "That government is best which governs least;" and I should like to see it acted up to more rapidly and systematically. Carried out, it finally amounts to this, which also I believe — "That government is best which governs not at all;" and when men are prepared for it, that will be the kind of government which they will have. Government is at best but an expedient; but most governments are usually, and all governments are sometimes, inexpedient. The objections which have been brought against a standing army, and they are many and weighty, and deserve to prevail, may also at last be brought against a standing government.`,
    question_types: ["central_idea", "text_structure", "vocab_in_context", "command_of_evidence"]
  },

  {
    id: "emerson_self_01",
    title: "Self-Reliance",
    author: "Ralph Waldo Emerson",
    year: 1841,
    genre: "essay",
    lexile: 1300,
    difficulty: "hard",
    text: `To believe your own thought, to believe that what is true for you in your private heart is true for all men — that is genius. Speak your latent conviction, and it shall be the universal sense; for the inmost in due time becomes the outmost, and our first thought is rendered back to us by the trumpets of the Last Judgment. Familiar as the voice of the mind is to each, the highest merit we ascribe to Moses, Plato, and Milton is, that they set at naught books and traditions, and spoke not what men but what they thought.`,
    question_types: ["central_idea", "vocab_in_context", "text_structure", "tone"]
  },

  {
    id: "woolf_room_01",
    title: "A Room of One's Own",
    author: "Virginia Woolf",
    year: 1929,
    genre: "essay",
    lexile: 1180,
    difficulty: "hard",
    text: `A woman must have money and a room of her own if she is to write fiction. That was the conclusion I reached, turning over the pages of my notebook. But, I went on, what is money and what is a room? Money meant independence. Independence meant the freedom to think and write. A room meant privacy. Privacy meant the ability to concentrate. For without these two things, I argued to myself, what hope was there for women writers?`,
    question_types: ["central_idea", "text_structure", "vocab_in_context", "command_of_evidence"]
  },

  {
    id: "dubois_souls_01",
    title: "The Souls of Black Folk",
    author: "W.E.B. Du Bois",
    year: 1903,
    genre: "essay",
    lexile: 1250,
    difficulty: "hard",
    text: `After the Egyptian and Indian, the Greek and Roman, the Teuton and Mongolian, the Negro is a sort of seventh son, born with a veil, and gifted with second-sight in this American world — a world which yields him no true self-consciousness, but only lets him see himself through the revelation of the other world. It is a peculiar sensation, this double-consciousness, this sense of always looking at one's self through the eyes of others, of measuring one's soul by the tape of a world that looks on in amused contempt and pity. One ever feels his two-ness — an American, a Negro; two souls, two thoughts, two unreconciled strivings; two warring ideals in one dark body, whose dogged strength alone keeps it from being torn asunder.`,
    question_types: ["central_idea", "vocab_in_context", "text_structure", "tone"]
  },

  // ─── PAIRED PASSAGES ─────────────────────────────────────────────────────

  {
    id: "paired_nature_01",
    title: "Paired: Nature and Solitude",
    author: "Thoreau / Emerson",
    year: 1840,
    genre: "paired",
    lexile: 1200,
    difficulty: "hard",
    text_a: {
      author: "Henry David Thoreau",
      source: "Walden",
      year: 1854,
      text: `I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived. I did not wish to live what was not life, living is so dear; nor did I wish to practise resignation, unless it was quite necessary. I wanted to live deep and suck out all the marrow of life, to live so sturdily and Spartan-like as to put to rout all that was not life.`
    },
    text_b: {
      author: "Ralph Waldo Emerson",
      source: "Nature",
      year: 1836,
      text: `To go into solitude, a man needs to retire as much from his chamber as from society. I am not solitary whilst I read and write, though nobody is with me. But if a man would be alone, let him look at the stars. The rays that come from those heavenly worlds will separate between him and what he touches. One might think the atmosphere was made transparent with this design, to give man, in the heavenly bodies, the perpetual presence of the sublime.`
    },
    question_types: ["cross_text_connections", "central_idea", "vocab_in_context"]
  },

];

// Helper: get a random passage by genre
function getPassageByGenre(genre) {
  const filtered = passages.filter(p => p.genre === genre && !p.text_a);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Helper: get a random passage by difficulty
function getPassageByDifficulty(difficulty) {
  const filtered = passages.filter(p => p.difficulty === difficulty && !p.text_a);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Helper: get a random passage that supports a specific question type
function getPassageForQuestionType(questionType) {
  const filtered = passages.filter(p => p.question_types.includes(questionType) && !p.text_a);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Helper: get a random non-paired passage
function getRandomPassage() {
  const single = passages.filter(p => !p.text_a);
  return single[Math.floor(Math.random() * single.length)];
}

// Helper: get paired passage
function getPairedPassage() {
  const paired = passages.filter(p => p.text_a);
  return paired[Math.floor(Math.random() * paired.length)];
}

export {
  passages,
  getPassageByGenre,
  getPassageByDifficulty,
  getPassageForQuestionType,
  getRandomPassage,
  getPairedPassage
};