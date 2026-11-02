/* handle-text/scenarios/scroll-text.js: scenario sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;

  function sampleScroll(rng, spec) {
    const mode = rng.pick(['last', 'line', 'edge']);
    const rows = rng.int(4, 7);
    const cols = rng.int(34, 50);
    const lo = spec.ood ? 40 : rows + (mode === 'edge' ? 6 : 4);
    const hi = spec.ood ? 70 : 32;
    let lines;
    let out;
    for (let tries = 0; tries < 40; tries++) {
      lines = lib.textLines(rng, spec, lo, hi, cols);
      out = { mode, rows, cols, lines, numbered: mode === 'line' ? true : rng.bool(0.4), start: 0, route: rng.pick(['wheel', 'thumb']) };
      if (mode === 'edge') break;
      out.line = mode === 'last' ? lines.length - 1 : rng.int(rows, lines.length - 1);
      out.which = mode === 'last' ? 'last' : rng.pick(['first', 'last']);
      const ws = lines[out.line].split(' ');
      const w = out.which === 'first' ? ws[0] : ws[ws.length - 1];
      if (/^[\p{L}][\p{L}'’-]*[.,;:!?]?$/u.test(w) && lib.wordOnly(w).length >= 2) {
        out.answer = lib.wordOnly(w);
        break;
      }
    }
    if (mode === 'edge') {
      out.goal = rng.pick(['top', 'bottom']);
      // Whole lines, so the start scrollTop is an integer number of px.
      out.start = Math.round(rng.float(0.3, 0.7) * lib.maxScroll({ lines, rows }));
    } else out.field = lib.fieldSpec(rng, 'word');
    return out;
  }
  env.scenario('handle-text', { name: 'scroll-text', sample: sampleScroll });
})();
