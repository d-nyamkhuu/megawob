/* handle-text/scenarios/copy-paste-2.js: scenario sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;
  const C = env.content;

  function sampleCopyPortion(rng, spec) {
    const mode = rng.pick(['sentence', 'line', 'value']);
    const out = { mode, how: 'drag', field: lib.fieldSpec(rng, 'copy') };
    if (mode === 'sentence') {
      const n = rng.int(3, 5);
      const ss = rng.sample(lib.sentences(spec, rng.pick(lib.DOMAINS())).filter((s) => s.length <= 110), n);
      const text = ss.join(' ');
      const k = rng.int(0, ss.length - 1);
      const start = ss.slice(0, k).reduce((a, s) => a + s.length + 1, 0);
      out.boxes = [{ title: rng.pick(lib.TITLES), text }];
      out.want = { box: 0, start, end: start + ss[k].length };
      out.k = k;
    } else if (mode === 'line') {
      const n = rng.int(4, 7);
      const kind = rng.int(0, 2);
      const lines = [];
      for (let t = 0; lines.length < n && t < 200; t++) {
        const l = kind === 0 ? C.personName(rng, C.csplitOf(spec)).full
          : kind === 1 ? C.pick(rng, C.PRODUCTS, C.csplitOf(spec)).name
            : C.address(rng, 'en-US', C.csplitOf(spec)).line1;
        if (l && !lines.includes(l) && l.length <= 44) lines.push(l);
      }
      const k = rng.int(0, lines.length - 1);
      const start = lines.slice(0, k).reduce((a, s) => a + s.length + 1, 0);
      out.boxes = [{ title: [['Attendees', 'Contacts', 'Guest list'], ['Shopping list', 'Items', 'Order lines'], ['Addresses', 'Stops', 'Locations']][kind][rng.int(0, 2)],
        text: lines.join('\n'), lines, numbered: rng.bool(0.5) }];
      out.want = { box: 0, start, end: start + lines[k].length };
      out.k = k;
    } else {
      const keys = rng.sample(Object.keys(lib.VALUE_LABELS), rng.int(3, 5));
      const lines = [rng.pick([`Hi ${C.personName(rng, C.csplitOf(spec)).first}, here are your details:`, 'Thanks for your order.',
        'Your request has been processed.', 'Please keep this message for your records.'])];
      const vals = {};
      for (const key of keys) {
        let v;
        do v = lib.codeValue(rng, key); while (Object.values(vals).includes(v));
        vals[key] = v;
        lines.push(`${lib.VALUE_LABELS[key]}: ${v}`);
      }
      const label = rng.pick(keys);
      const k = keys.indexOf(label) + 1;
      const lineStart = lines.slice(0, k).reduce((a, s) => a + s.length + 1, 0);
      const start = lineStart + lib.VALUE_LABELS[label].length + 2;
      out.boxes = [{ title: rng.pick([
        'Message', 'Email', 'Receipt', 'Confirmation', 'Details', 'Summary', 'Reference', 'Overview'
      ]), text: lines.join('\n'), lines, numbered: false }];
      out.want = { box: 0, start, end: start + vals[label].length };
      out.label = label;
    }
    out.answer = out.boxes[0].text.slice(out.want.start, out.want.end);
    return out;
  }
  env.scenario('handle-text', { name: 'copy-paste-2', sample: sampleCopyPortion });
})();
