/*
 * find-fact / similar: click-checkboxes-soft.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const { say, SYNONYMS } = fam.lib;

  function sampleSimilar(rng, spec) {
    const n = spec.ood ? rng.int(8, 10) : rng.int(3, 7);
    const k = rng.int(1, Math.min(4, n - 1));
    const groups = rng.sample([...SYNONYMS.keys()], n);
    const given = [];
    const words = groups.map((g, i) => {
      const [shownWord, givenWord] = rng.sample(SYNONYMS[g], 2);
      if (i < k) given.push(givenWord);
      return { text: shownWord, group: g };
    });
    const targets = words.slice(0, k).map((w) => w.text);
    return { words: rng.shuffle(words), given, targets };
  }

  env.scenario('find-fact', {
    name: 'similar',
    sample: sampleSimilar,
    baseModel() {
      return { values: [] };
    },
    start(m, spec, mode) {
      const texts = spec.words.map((w) => w.text);
      if (mode === 'partial') {
        const half = spec.targets.length > 1 ? spec.targets.slice(0, Math.floor(spec.targets.length / 2)) : [];
        m.values = texts.filter((x) => half.includes(x));
      } else {
        const bad = texts.filter((x) => !spec.targets.includes(x));
        m.values = texts.filter((x) => x === bad[0] || x === spec.targets[0]);
      }
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      let kk = spec.targets.length;
      if (easy && kk > 2) kk = 2;
      const gone = new Set(spec.targets.slice(kk));
      spec.given = spec.given.slice(0, kk);
      spec.targets = spec.targets.slice(0, kk);
      const dis = spec.words.filter((w) => !spec.targets.includes(w.text) && !gone.has(w.text));
      const keepD = new Set(r.sample(dis, k(1, 2)).map((w) => w.text));
      spec.words = spec.words.filter((w) => spec.targets.includes(w.text) || keepD.has(w.text));
    },
    error(model, spec) {
      const a = new Set(model.values);
      const b = new Set(spec.targets);
      let inter = 0;
      for (const v of a) if (b.has(v)) inter++;
      const union = a.size + b.size - inter;
      return union ? 1 - inter / union : 0;
    },
    plan(model, spec) {
      const want = new Set(spec.targets);
      const w = spec.words.find((x) => want.has(x.text) !== model.values.includes(x.text));
      return w ? { click: { word: w.text } } : null;
    },
    solve(spec) {
      return { values: spec.words.map((w) => w.text).filter((x) => spec.targets.includes(x)) };
    },
    instruction(spec, rng) {
      return say(rng, spec, [
        'Select words similar to {given}.',
        'Check every word that means the same as {given}.',
        'Tick the synonyms of {given}.',
        'Mark all words with a similar meaning to {given}.',
        'Check the boxes of words that are close in meaning to {given}.',
        'Select each word that could replace {given}.',
        'Choose all matches in meaning for {given}.',
        'Each synonym of {given} should be checked.',
        'Every synonym of {given} belongs in your picks.',
      ], { given: spec.given.join(', ') }, { terse: `synonyms of ${spec.given.join(', ')}` });
    },
    judgeAsk(jr, spec, page, pick) {
      let x = null, templates, vars = {}, message;
      const used = new Set(spec.words.map((w) => w.group));
      const groups = [...SYNONYMS.keys()].filter((g) => !used.has(g));
      if (!groups.length) return null;
      x = jr.pick(SYNONYMS[jr.pick(groups)]);
      templates = [
        'Select words similar to {x}.', 'Check every word that means the same as {x}.', 'Tick the synonyms of {x}.',
        'Each synonym of {x} must be checked.'
      ];
      vars = { x };
      message = `I can't do that: none of the listed words means the same as ${x}.`;
      return { x, templates, vars, message };
    },
    judgeError: (model) => model.values.length ? 1 : 0,
    silentEdit(next, prev, spec, rng, m) {
      m.values = env.util.clone(prev.values);
    },
  });
})();
