/* handle-text/scenarios/copy-paste.js: scenario sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;

  function sampleCopyPaste(rng, spec) {
    const n = spec.ood ? rng.int(4, 5) : rng.pick([1, 1, 2, 3, 3]);
    const titles = rng.sample(lib.TITLES, n);
    const pool = lib.sentences(spec).filter((s) => s.length <= 95);
    const texts = rng.sample(pool, n);
    const boxes = texts.map((text, i) => ({ title: titles[i], text }));
    const box = rng.int(0, n - 1);
    return {
      boxes,
      want: { box, start: 0, end: boxes[box].text.length },
      answer: boxes[box].text,
      how: 'all',
      refBy: n === 1 ? 'only' : rng.pick(['ordinal', 'title']),
      field: lib.fieldSpec(rng, 'copy'),
    };
  }
  env.scenario('handle-text', { name: 'copy-paste', sample: sampleCopyPaste });
})();
