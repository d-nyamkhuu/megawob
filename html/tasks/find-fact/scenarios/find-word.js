/*
 * find-fact / find-word: mode 'nth' (type the Nth word of a short paragraph of real sentences) or mode 'after' (two
 * paragraphs.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const C = env.content;
  const { quote: q } = env.util;
  const { cleanTokens, goodSentence, normWord, ORD, planType, say, textErr, wrongOf } = fam.lib;

  function sampleFindWord(rng, spec) {
    const pool = C.split(C.SENTENCES, spec.csplit).filter(goodSentence);
    if (rng.bool(0.5)) {
      for (let tries = 0; ; tries++) {
        const k = spec.ood ? rng.int(3, 4) : rng.int(1, 2);
        const text = rng.sample(pool, k).join(' ');
        const words = cleanTokens(text);
        if ((words.length < 8 || words.length > (spec.ood ? 70 : 34)) && tries < 30) continue;
        const cands = words.map((w, i) => i).filter((i) => /^[\p{L}][\p{L}'’-]*[.,;:!?]?$/u.test(words[i]) && normWord(words[i]).length >= 2);
        const n = rng.pick(cands) + 1;
        return { mode: 'nth', paragraphs: [text], words, n, at: n - 1, answer: words[n - 1].replace(/[.,;:!?]$/, '') };
      }
    }
    for (let tries = 0; ; tries++) {
      const paras = [0, 1].map(() => rng.sample(pool, spec.ood ? rng.int(4, 5) : rng.int(2, 3)).join(' '));
      const words = cleanTokens(paras.join(' '));
      const len = rng.bool(0.5) ? 1 : 2;
      const at = rng.int(len, words.length - 1);
      const phrase = words.slice(at - len, at);
      if (phrase.some((w) => /[.,!?;:)]$/.test(w) || /^[(]/.test(w)) && tries < 400) continue; // inside one clause
      if (!/^[\p{L}][\p{L}'’-]*[.,;:!?]?$/u.test(words[at]) || normWord(words[at]).length < 2) continue;
      const low = phrase.map(normWord);
      if (low.some((w) => !w)) continue;
      let hits = 0;
      for (let i = 0; i + len <= words.length; i++) if (low.every((w, k) => normWord(words[i + k]) === w)) hits++;
      if (hits !== 1) continue;
      return { mode: 'after', paragraphs: paras, words, phrase: phrase.map((w) => w.replace(/[.,;:!?]$/, '')).join(' '), at, answer: words[at].replace(/[.,;:!?]$/, '') };
    }
  }

  const PH_PHRASES = [
    'silver lining', 'paper trail', 'night shift', 'harbor bridge', 'spare key', 'blue folder', 'quiet hour',
    'velvet ribbon', 'brass lantern', 'window latch', 'garden shed', 'wax seal', 'picnic rug', 'ocean breeze',
    'lemon zest', 'wool scarf', 'clay pot', 'autumn leaves', 'echo chamber', 'pine cone', 'honey jar',
    'frost pattern', 'dawn chorus', 'tangled yarn', 'ripple effect', 'broken record', 'maple syrup', 'salad tongs'
  ];

  env.scenario('find-fact', {
    name: 'find-word',
    sample: sampleFindWord,
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const ok = (w) => /^[\p{L}][\p{L}'’-]*[.,;:!?]?$/u.test(w) && normWord(w).length >= 2;
      if (spec.mode === 'nth') {
        const near = spec.words.map((w, i) => i).filter((i) => i < k(4, 8) && ok(spec.words[i]));
        if (near.length) {
          const i = r.pick(near);
          const cut = Math.min(spec.words.length, i + 1 + k(4, 8));
          spec.words = spec.words.slice(0, cut);
          spec.paragraphs = [spec.words.join(' ')];
          Object.assign(spec, { n: i + 1, at: i, answer: spec.words[i].replace(/[.,;:!?]$/, '') });
        }
      } else {
        const len = spec.phrase.split(' ').length;
        const lo = Math.max(0, spec.at - len - k(8, 14));
        const hi = Math.min(spec.words.length, spec.at + 1 + k(8, 14));
        spec.words = spec.words.slice(lo, hi);
        spec.paragraphs = [spec.words.join(' ')];
        spec.at -= lo;
      }
    },
    wrongAnswers(spec, rng) {
      return [wrongOf(rng, spec.answer, spec.words.slice(Math.max(0, spec.at - 2), spec.at + 3).map((w) => w.replace(/[.,;:!?]$/, '')))];
    },
    error: (model, spec) => textErr(model.answers[0], spec.answer, normWord),
    plan: planType,
    answers: (spec, one) => one('word', spec.answer),
    instruction(spec, rng) {
      if (spec.mode === 'nth') {
        return say(rng, spec, [
          'Find the {ord} word in the paragraph and type it into the textbox.',
          'Type the {ord} word of the paragraph.',
          'Count to word number {n} in the text and enter that word.',
          'Which word is {ord} in the paragraph? Type it.',
          'Enter word #{n} of the passage into the answer field.',
          'Type the paragraph’s {ord} word into the box.',
          'Use word #{n} of the text as your typed answer.',
          'The answer box needs the paragraph’s {ord} word.',
          'Which word occupies position {n} in the text? Type it.',
        ], { ord: ORD(spec.n), n: spec.n }, { terse: `${ORD(spec.n)} word` });
      }
      return say(rng, spec, [
        'Type the word that comes right after {p} in the text.',
        'Find {p} in the text and type the word that follows it.',
        'Which word comes directly after {p}? Enter it.',
        'Locate the phrase {p} and type the next word.',
        'Enter the word immediately following {p} in the passage.',
        'In the text, what word follows {p}? Type it into the box.',
        'After {p}, which word do you read next? Enter that word.',
        'Use the word directly after {p} as your typed answer.',
        'Reading past {p}, enter the next word you reach.',
        'The box needs the very first word after the phrase {p}.',
        'What follows the end of {p}? Type the next word.',
      ], { p: q(spec.phrase) }, { terse: `word after ${q(spec.phrase)}` });
    },
    replyInstruction(spec, rng) {
      if (spec.mode === 'nth') {
        return say(rng, spec, [
          'Which word is {ord} in the paragraph?',
          'Find the {ord} word of the paragraph.',
          'Count to word number {n} in the text.',
          'What is word #{n} of the passage?',
          'Look for the paragraph’s {ord} word.',
          'Reply with word #{n} from the text.',
        ], { ord: ORD(spec.n), n: spec.n }, { terse: `${ORD(spec.n)} word` });
      }
      return say(rng, spec, [
        'Which word comes directly after {p} in the text?',
        'Find {p} in the text and look at the word that follows it.',
        'What word follows {p} in the passage?',
        'Locate the phrase {p} and read the next word.',
        'Check which word comes right after {p}.',
        'Use the word just after {p} as your answer.',
        'Your answer is the first word after the phrase {p}.',
        'What follows the end of {p}? State the next word.',
      ], { p: q(spec.phrase) }, { terse: `word after ${q(spec.phrase)}` });
    },
    judgeAsk(jr, spec, page, pick) {
      let x = null, templates, vars = {}, message;
      const n = spec.words.length + jr.int(5, 40);
      if (spec.mode === 'nth') {
        x = ORD(n);
        templates = ['Type the {x} word of the paragraph.', 'Find the {x} word in the paragraph and type it into the textbox.', 'Enter word number {n} of the passage.'];
        vars = { x, n };
        message = `I can't do that: the text has only ${spec.words.length} words.`;
      } else {
        x = pick(PH_PHRASES);
        if (!x) return null;
        templates = ['Type the word that comes right after "{x}" in the text.', 'Find "{x}" in the text and type the word that follows it.', 'Which word comes directly after "{x}"? Enter it.'];
        vars = { x };
        message = `I can't do that: there is no "${x}" in the text.`;
      }
      return { x, templates, vars, message };
    },
    retargetTries(spec, model, rng, tries) {
      if (spec.mode === 'nth') {
        for (let n = 1; n <= spec.words.length; n++) {
          const w = spec.words[n - 1].replace(/[.,;:!?]$/, '');
          if (n !== spec.n && normWord(w)) tries.push({ ...spec, n, at: n - 1, answer: w });
        }
      }
    },
  });
})();
