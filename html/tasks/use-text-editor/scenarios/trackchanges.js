/* use-text-editor/trackchanges: goal sampling for the trackchanges scenario. */
(function () {
  'use strict';
  const { lib } = env.taskOf('use-text-editor');

  function goalReview(rng, spec) {
    const ss = lib.suggestions(spec.doc0);
    const byAuthor = {};
    for (const s of ss) (byAuthor[s.author] = byAuthor[s.author] || []).push(s);
    const kind = spec.level === 'easy' ? 'one' : rng.pick(['one', 'two', 'author']);
    const want = {};
    if (kind === 'author') {
      const A = rng.pick(Object.keys(byAuthor));
      const a = rng.pick(['accept', 'accept', 'reject']);
      for (const s of byAuthor[A]) want[s.id] = a;
      return { kind: 'review', want, how: 'author', author: A, act: a };
    }
    const pick = rng.sample(ss, kind === 'one' ? 1 : 2);
    for (const s of pick) want[s.id] = rng.pick(['accept', 'reject']);
    return { kind: 'review', want, how: 'list', items: pick.map((s) => ({ id: s.id, act: want[s.id], ...lib.describe(s), author: s.author })) };
  }

  function goalSuggest(rng, spec) {
    const text = lib.flatDoc(spec.doc0);
    const chars = lib.runChars(spec.doc0);
    const ws = lib.plainWords(text).filter((x) => x.w.length >= 4 && chars.slice(Math.max(0, x.a - 1), x.b + 1).every((c) => c.k === 'b' || c.k === 'n')
      && lib.countWord(spec, text, x.w) === 1);
    const x = rng.pick(ws);
    const op = rng.pick(['insert', 'delete', 'replace']);
    if (op === 'insert') {
      const w = rng.pick(lib.ADD_WORDS);
      return { kind: 'suggest', op, a: x.a, b: x.a, word: x.w, text: `${w} `, add: w, para: lib.paraOf(text, x.a) };
    }
    if (op === 'delete') return { kind: 'suggest', op, a: x.a, b: x.b, word: x.w, text: '', para: lib.paraOf(text, x.a) };
    const w = rng.pick(lib.SWAP_WORDS.filter((s) => s !== x.w.toLowerCase()));
    return { kind: 'suggest', op, a: x.a, b: x.b, word: x.w, text: w, add: w, para: lib.paraOf(text, x.a) };
  }

  Object.assign(lib, { goalSuggest });
  env.scenario('use-text-editor', {
    name: 'trackchanges',
    review: goalReview, suggest: goalSuggest,
  });
})();
