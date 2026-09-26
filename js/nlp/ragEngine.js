// RAG (Retrieval-Augmented Generation) & NLP Semantic Matching Engine
// Operates client-side to parse natural language feelings and match against the LGBT+ flags database.

import { FLAGS_DATA } from '../data/flagsData.js';

// Synonyms and semantic feature dictionary
const DICTIONARY = {
  women: ['woman', 'women', 'girl', 'girls', 'female', 'females', 'feminine', 'feminine people', 'wlw', 'ladies', 'she', 'her'],
  men: ['man', 'men', 'guy', 'guys', 'male', 'males', 'masculine', 'masculine people', 'mlm', 'fellas', 'he', 'him'],
  nonbinary: ['nonbinary', 'non-binary', 'non binary', 'enby', 'enbies', 'nb', 'genderqueer', 'genderfluid', 'neutral gender', 'they', 'them', 'genderless', 'agender', 'beyond binary', 'outside the binary'],
  all_genders: ['everyone', 'all genders', 'any gender', 'any gender identity', 'people of any gender', 'people of all genders', 'regardless of gender', 'gender does not matter', 'without regard to gender'],
  no_attraction: ['no attraction', 'no attraction at all', 'don\'t feel attraction', 'do not feel attraction', 'never attracted', 'not attracted', 'zero attraction', 'lack attraction', 'without attraction'],
  no_sexual_attraction: ['no sexual attraction', 'no physical attraction', 'don\'t experience sexual attraction', 'do not experience sexual attraction', 'never feel sexual attraction', 'not sexually attracted', 'not attracted sexually', 'without sexual attraction', 'no sex drive toward people', 'no desire for sex', 'not interested in sex'],
  no_romantic_attraction: ['no romantic attraction', 'don\'t experience romantic attraction', 'do not experience romantic attraction', 'never feel romantic attraction', 'not romantically attracted', 'not attracted romantically', 'no romance', 'no romantic feelings', 'no crushes', 'never get crushes'],
  low_sexual_attraction: ['minimal sexual attraction', 'very minimal sexual attraction', 'little sexual attraction', 'very little sexual attraction', 'low sexual attraction', 'weak sexual attraction', 'minimal physical attraction', 'rare sexual attraction', 'infrequent sexual attraction', 'sexual attraction is faint', 'sexual attraction is weak'],
  opposite_gender: ['straight', 'heterosexual', 'hetero', 'heteroromantic', 'attracted to the opposite gender', 'attracted to a different gender', 'opposite-sex attraction'],
  emotional_bond: ['emotional bond', 'emotional connection', 'deep connection', 'know them well', 'friends first', 'close friend', 'after connection', 'after getting close', 'emotional relationship', 'strong bond', 'bond first', 'trust first', 'only after intimacy'],
  rare_attraction: ['rarely', 'seldom', 'weakly', 'sometimes', 'infrequently', 'once in a blue moon', 'low intensity', 'low-intensity', 'grey area', 'gray area', 'once in a while'],
  fluidity: ['changes', 'shifting', 'fluctuates', 'fluid', 'different days', 'sometimes boy sometimes girl', 'evolving', 'varies', 'can change', 'not fixed', 'changes over time'],
  fantasies_only: ['fantasy', 'fantasies', 'reading romance', 'romantic fiction', 'erotica', 'erotic fiction', 'fictional characters', 'imaginary people', 'disconnected', 'third person', 'don\'t want in real life', 'not in real life'],
  wants_relationship: ['wants sex', 'desires relationship', 'want intimacy', 'wants intimacy', 'without feeling turned on', 'wants romance', 'desires romance', 'likes romantic relationships', 'wants a partner'],
  self_man: ['i am a man', 'i am a guy', 'i\'m a boy', 'i am male', 'as a man', 'as a guy', 'my gender is male', 'my gender is man'],
  self_woman: ['i am a woman', 'i am a girl', 'i\'m female', 'as a woman', 'as a girl', 'my gender is female', 'my gender is woman'],
  self_enby: ['i am nonbinary', 'i am enby', 'my gender is enby', 'my gender is nonbinary', 'as a non-binary person', 'neither male nor female', 'not a man or woman']
};

export class NaturalLanguageMatcher {
  constructor(flagsDatabase = FLAGS_DATA) {
    this.database = flagsDatabase;
  }

  /**
   * Preprocess and tokenize input text
   */
  normalizeText(text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract key semantic traits from text
   */
  extractTraits(normalizedText) {
    const traits = {
      targets: new Set(),
      conditions: new Set(),
      selfGender: new Set(),
      samTypes: new Set(),
      rawTokens: normalizedText.split(' ')
    };

    // Target genders
    for (const word of DICTIONARY.women) {
      if (normalizedText.includes(word) && !['female'].includes(word)) traits.targets.add('women');
    }
    for (const word of DICTIONARY.men) {
      if (normalizedText.includes(word) && !['male'].includes(word)) traits.targets.add('men');
    }
    for (const word of DICTIONARY.nonbinary) {
      if (normalizedText.includes(word)) traits.targets.add('nonbinary');
    }
    for (const phrase of DICTIONARY.all_genders) {
      if (normalizedText.includes(phrase)) traits.targets.add('all');
    }

    // Conditions & Spectrum Dynamics
    for (const phrase of DICTIONARY.no_attraction) {
      if (normalizedText.includes(phrase)) traits.conditions.add('no_attraction');
    }
    for (const phrase of DICTIONARY.no_sexual_attraction) {
      if (normalizedText.includes(phrase)) traits.conditions.add('no_sexual_attraction');
    }
    for (const phrase of DICTIONARY.no_romantic_attraction) {
      if (normalizedText.includes(phrase)) traits.conditions.add('no_romantic_attraction');
    }
    for (const phrase of DICTIONARY.low_sexual_attraction) {
      if (normalizedText.includes(phrase)) traits.conditions.add('low_sexual_attraction');
    }
    for (const phrase of DICTIONARY.opposite_gender) {
      if (normalizedText.includes(phrase)) traits.conditions.add('opposite_gender');
    }
    for (const phrase of DICTIONARY.emotional_bond) {
      if (normalizedText.includes(phrase)) traits.conditions.add('emotional_bond');
    }
    for (const phrase of DICTIONARY.rare_attraction) {
      if (normalizedText.includes(phrase)) traits.conditions.add('rare_attraction');
    }
    for (const phrase of DICTIONARY.fluidity) {
      if (normalizedText.includes(phrase)) traits.conditions.add('fluidity');
    }
    for (const phrase of DICTIONARY.fantasies_only) {
      if (normalizedText.includes(phrase)) traits.conditions.add('fantasies_only');
    }
    for (const phrase of DICTIONARY.wants_relationship) {
      if (normalizedText.includes(phrase)) traits.conditions.add('wants_relationship');
    }

    // Self Gender Identity
    for (const phrase of DICTIONARY.self_man) {
      if (normalizedText.includes(phrase)) traits.selfGender.add('man');
    }
    for (const phrase of DICTIONARY.self_woman) {
      if (normalizedText.includes(phrase)) traits.selfGender.add('woman');
    }
    for (const phrase of DICTIONARY.self_enby) {
      if (normalizedText.includes(phrase)) traits.selfGender.add('nonbinary');
    }

    if (traits.conditions.has('opposite_gender')) {
      if (traits.selfGender.has('woman')) traits.targets.add('men');
      if (traits.selfGender.has('man')) traits.targets.add('women');
    }

    // SAM Types
    if (normalizedText.includes('sex') || normalizedText.includes('sexual') || normalizedText.includes('physical')) {
      traits.samTypes.add('sexual');
    }
    if (normalizedText.includes('romance') || normalizedText.includes('romantic') || normalizedText.includes('fall in love') || normalizedText.includes('crush')) {
      traits.samTypes.add('romantic');
    }

    return traits;
  }

  /**
   * Main RAG search & score method
   */
  analyze(userInput) {
    if (!userInput || !userInput.trim()) {
      return { matches: [], extractedTraits: null };
    }

    const normalized = this.normalizeText(userInput);
    const traits = this.extractTraits(normalized);

    const scoredResults = this.database.map(item => {
      let score = 0;
      const matchReasons = [];

      // 1. Tag & Keyword matching (TF-IDF inspired weight)
      item.tags.forEach(tag => {
        const normTag = tag.toLowerCase();
        if (normalized.includes(normTag)) {
          score += 15;
          matchReasons.push(`Matched tag: "${tag}"`);
        } else {
          // Check token overlap
          const tagTokens = normTag.split(' ');
          tagTokens.forEach(token => {
            if (token.length > 3 && normalized.includes(token)) {
              score += 5;
            }
          });
        }
      });

      // 2. Condition & Spectrum Rules
      if (traits.conditions.has('emotional_bond')) {
        if (item.id === 'demisexual' || item.id === 'demiromantic') {
          score += 45;
          matchReasons.push('Strong match for requiring an emotional bond before attraction');
        }
      }

      if (traits.conditions.has('no_attraction')) {
        if (item.id === 'asexual' || item.id === 'aromantic' || item.id === 'asexual_spectrum' || item.id === 'aromantic_spectrum') {
          score += 40;
          matchReasons.push('Matched preference for little to no attraction');
        }
      }

      if (traits.conditions.has('no_sexual_attraction')) {
        if (item.id === 'asexual' || item.id === 'asexual_spectrum') {
          score += 55;
          matchReasons.push('Matched little to no sexual attraction');
        }
      }

      if (traits.conditions.has('low_sexual_attraction')) {
        if (item.id === 'grayasexual') {
          score += 65;
          matchReasons.push('Matched minimal or low-intensity sexual attraction');
        } else if (item.id === 'asexual' || item.id === 'asexual_spectrum') {
          score += 35;
          matchReasons.push('Matched the asexual spectrum');
        }
      }

      if (traits.conditions.has('no_romantic_attraction')) {
        if (item.id === 'aromantic' || item.id === 'aromantic_spectrum') {
          score += 120;
          matchReasons.push('Matched little to no romantic attraction');
        }
      }

      if (traits.conditions.has('rare_attraction')) {
        if (item.id.includes('gray') || item.id === 'demisexual' || item.id === 'demiromantic') {
          score += 35;
          matchReasons.push('Matches rare or low-intensity attraction spectrum');
        }
      }

      if (traits.conditions.has('fluidity')) {
        if (item.id === 'abrosexual' || item.id === 'genderfluid' || item.id === 'bisexual') {
          score += 45;
          matchReasons.push('Matches fluidity in attraction or gender');
        }
      }

      if (traits.conditions.has('fantasies_only')) {
        if (item.id === 'aegosexual') {
          score += 50;
          matchReasons.push('Matched enjoyment of fantasies without desire for real-life participation');
        }
      }

      if (traits.conditions.has('wants_relationship')) {
        if (item.id === 'cupiosexual' || item.id === 'polyamorous') {
          score += 35;
          matchReasons.push('Matched desire for relationships/intimacy');
        }
      }

      // 3. Target Gender alignment
      if (traits.targets.has('women') && traits.targets.has('men')) {
        if (['bisexual', 'pansexual', 'omnioriented', 'polysexual'].includes(item.id)) {
          score += 35;
          matchReasons.push('Attraction to both men and women');
        }
      } else if (traits.targets.has('women') && !traits.targets.has('men')) {
        if (['lesbian', 'sapphic', 'trixic', 'neptunic'].includes(item.id)) {
          score += 35;
          matchReasons.push('Attraction centered around women & feminine people');
        }
      } else if (traits.targets.has('men') && !traits.targets.has('women')) {
        if (['gay', 'achillean', 'toric', 'uranic'].includes(item.id)) {
          score += 35;
          matchReasons.push('Attraction centered around men & masculine people');
        }
      }

      if (traits.targets.has('all')) {
        if (['pansexual', 'omnioriented', 'bisexual', 'pangender'].includes(item.id)) {
          score += 40;
          matchReasons.push('Attraction to all genders / gender-inclusive');
        }
      }

      if (traits.conditions.has('opposite_gender')) {
        if (traits.targets.has('men') && ['androsexual', 'androromantic'].includes(item.id)) {
          score += 35;
          matchReasons.push('Matches straight attraction to men');
        }
        if (traits.targets.has('women') && ['gynesexual', 'gyneromantic'].includes(item.id)) {
          score += 35;
          matchReasons.push('Matches straight attraction to women');
        }
      }

      // 4. Sample phrase semantic overlap
      if (item.samplePhrases) {
        item.samplePhrases.forEach(phrase => {
          const normPhrase = this.normalizeText(phrase);
          const overlap = normPhrase.split(' ').filter(word => word.length > 3 && normalized.includes(word));
          if (overlap.length >= 2) {
            score += overlap.length * 4;
            matchReasons.push(`Similar to phrase: "${phrase}"`);
          }
        });
      }

      // Explicitly absent attraction should not recommend labels that describe experiencing it.
      if (traits.conditions.has('no_sexual_attraction') && item.sam?.includes('sexual') && !['asexual', 'asexual_spectrum'].includes(item.id)) {
        score = Math.min(score, 7);
      }
      if (traits.conditions.has('low_sexual_attraction') && item.sam?.includes('sexual') && !['grayasexual', 'asexual', 'asexual_spectrum'].includes(item.id)) {
        score = Math.min(score, 7);
      }
      if (traits.conditions.has('no_romantic_attraction') && item.sam?.includes('romantic') && !['aromantic', 'aromantic_spectrum'].includes(item.id)) {
        score = Math.min(score, 7);
      }

      // Calculate confidence percentage (capped at 99%)
      const confidence = Math.min(99, Math.max(15, Math.round((score / 75) * 100)));

      return {
        item,
        score,
        confidence,
        reasons: [...new Set(matchReasons)]
      };
    });

    // Filter results with minimum relevance and sort descending
    const filtered = scoredResults
      .filter(res => res.score > 8)
      .sort((a, b) => b.score - a.score);

    return {
      matches: filtered,
      extractedTraits: traits
    };
  }
}
