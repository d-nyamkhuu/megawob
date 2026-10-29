/*
 * act-in-time / simon: simon-says.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const { simonPhase } = fam.lib;

  const SIMON = [['green', '#2f9e44'], ['red', '#e03131'], ['yellow', '#f2c200'], ['blue', '#1c7ed6'],
    ['purple', '#7048e8'], ['orange', '#f76707']];

  function sampleSimon(rng, beat, o) {
    const n = o.ood ? 6 : rng.pick([4, 4, 5, 6]);
    const pads = (n === 4 ? SIMON.slice(0, 4) : rng.sample(SIMON, n)).map(([color, hex]) => ({ color, hex }));
    const len = o.ood ? rng.int(6, 8) : rng.int(3, 5);
    const seq = [...Array(len)].map(() => rng.int(0, n - 1));
    return { pads, seq, show: len * beat, lit: 0.7 };
  }

  function simonMatched(model, spec) {
    let k = 0;
    while (k < model.presses.length && k < spec.seq.length && model.presses[k] === spec.seq[k]) k++;
    return k;
  }

  const T_SIMON = ['Watch the pads light up, then press them in the same order.', 'Push the buttons in the order they light up.',
    'Memorize the flashing sequence and repeat it.', 'Repeat the pattern of lit pads once it has finished playing.',
    'Wait for playback to end, then copy the pad pattern.', 'Take in every flash, then play them back on the pads.'];

  const ABSENT_COLORS = ['pink', 'teal', 'white', 'brown', 'gray'];

  env.scenario('act-in-time', {
    name: 'simon',
    sample: sampleSimon,
    level(spec, lv) {
      const beat = spec.beat;
      const len = Math.round(spec.seq.length - (spec.seq.length - 2) * lv);
      spec.seq = spec.seq.slice(0, len);
      spec.show = len * beat;
    },
    start() {
      return { t: 0, presses: [] };
    },
    error(model, spec) {
      const k = simonMatched(model, spec);
      const e = 1 - k / spec.seq.length;
      return model.presses.length > k ? Math.max(e, 1 / spec.seq.length) : e;
    },
    endedBy: (model, spec) => model.presses.length > simonMatched(model, spec) ? 'wrong-press' : null,
    plan(model, spec) {
      const t = model.t;
      if (simonPhase(spec, t) === 'show') return { wait: true };
      const k = model.presses.length;
      return k < spec.seq.length ? { click: { pad: spec.seq[k] } } : null;
    },
    solveBy(spec, model, m) {
      return { ...m, t: Math.max(m.t, spec.show), presses: spec.seq.slice() };
    },
    phrase: (spec, rng, pick, say) => say(pick(T_SIMON)),
    judgeAsk(jr, spec, mk, cant) {
      const c = jr.pick(ABSENT_COLORS);
      return mk([`${c} pad`, c], ['Watch the pads light up, repeat the pattern, then press the {c} pad.', 'After the pattern has played, repeat it and finish with the {c} pad.',
        'Repeat the lit pattern, and then press the {c} pad as well.'], { c }, cant(`there is no ${c} pad`));
    },
    factRows(model, spec, f) {
      return [f('Phase', simonPhase(spec, model.t) === 'show' ? 'Watch' : 'Repeat', ['Mode']),
      f('Pressed', `${model.presses.length} of ${spec.seq.length}`, ['Presses'], [`${model.presses.length}/${spec.seq.length}`]), f('Flashes', spec.seq.length, ['Pattern length', 'Sequence length'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      if (next.presses.length <= prev.presses.length) return null;
      m.presses = next.presses.slice(0, -1);
      return out(m);
    },
  });
})();
