/* handle-text/scenarios/unicode.js: scenario sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;

  function sampleUnicode(rng, spec, opts) {
    const mode = rng.pick(['type', 'copy', 'button']);
    if (mode === 'type') return { mode, answer: lib.unicodeText(rng), field: lib.fieldSpec(rng, 'type') };
    if (mode === 'copy') {
      const text = lib.unicodeText(rng);
      return { mode, boxes: [{ title: rng.pick([
        'Label', 'Phrase', 'Caption', 'Sign', 'Greeting', 'Header', 'Postcard', 'Bulletin', 'Motto', 'Cue'
      ]), text }],
        want: { box: 0, start: 0, end: text.length }, answer: text, how: 'drag', field: lib.fieldSpec(rng, 'copy') };
    }
    const items = [];
    const n = spec.ood ? 9 : 6;
    const labels = rng.sample(lib.UNI_BUTTONS, n);
    const short = lib.sentences(spec).filter((s) => s.length <= 60);
    for (let i = 0; i < n; i++) {
      const u = rng.next();
      const nb = items.filter((x) => x.type === 'button').length;
      const mustButton = n - i <= 2 - nb;
      if (!mustButton && u < 0.3) items.push({ type: 'text', text: rng.pick(short) });
      else if (!mustButton && u < 0.55) items.push({ type: 'input', label: rng.bool(0.5) ? `${rng.pick([
        'Name', 'Code', 'City', 'Note', 'Email', 'Room', 'Date', 'Year', 'Size', 'Alias'
      ])}:` : '', width: rng.int(90, 200) });
      else items.push({ type: 'button', label: labels[nb], br: rng.bool(0.5) });
    }
    const buttons = items.filter((x) => x.type === 'button');
    return { mode, items, target: rng.pick(buttons).label, recoverable: opts.recover ?? rng.bool(0.5) };
  }
  env.scenario('handle-text', { name: 'unicode', sample: sampleUnicode });
})();
