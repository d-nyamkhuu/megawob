/* handle-text/scenarios/find.js: scenario sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;
  const C = env.content;

  function sampleFind(rng, spec) {
    for (;;) {
      const k = spec.ood ? rng.int(10, 14) : rng.int(5, 8);
      const domain = rng.pick(Object.keys(lib.DOC_TITLES));
      const paragraphs = C.paragraphs(rng, k, { csplit: spec.csplit, min: 2, max: 4, domain });
      const doc = paragraphs.join('\n\n');
      // The phrase sits in the second half of the document (out of view at the start).
      const pi = rng.int(Math.floor(k / 2), k - 1);
      const words = paragraphs[pi].split(' ');
      const len = rng.int(2, 5);
      if (words.length < len + 2) continue;
      const i = rng.int(0, words.length - len);
      let phrase = words.slice(i, i + len).join(' ').replace(/[.,;:!?)"]+$/, '').replace(/^[("]+/, '');
      if (phrase.length < 8 || /\n/.test(phrase)) continue;
      if (doc.split(phrase).length !== 2) continue;
      const base = paragraphs.slice(0, pi).reduce((a, p) => a + p.length + 2, 0);
      const start = base + paragraphs[pi].indexOf(phrase);
      if (paragraphs[pi].split(phrase).length !== 2) continue;
      return { mode: rng.bool(0.4) ? 'page' : 'pane', title: rng.pick(lib.DOC_TITLES[domain] || ['Document']), paragraphs, doc, phrase, para: pi,
        want: { start, end: start + phrase.length }, route: rng.pick(['wheel', 'thumb']) };
    }
  }
  env.scenario('handle-text', { name: 'find', sample: sampleFind });
})();
