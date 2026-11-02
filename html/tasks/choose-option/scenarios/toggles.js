/* choose-option/scenarios/toggles.js: toggles sampling and start states. */
(function () {
  'use strict';
  const { C, SETTINGS, uniq, SETTING_TITLES } = env.taskOf('choose-option').lib;

  function labelFor(rng, item, neg) {
    const c = item.concept;
    const C1 = c[0].toUpperCase() + c.slice(1);
    if (item.kind === 'onoff') return neg ? rng.pick([`Disable ${c}`, `Turn off ${c}`, `Pause ${c}`]) : rng.pick([`Enable ${c}`, C1, `Turn on ${c}`]);
    if (item.kind === 'visible') return neg ? `Hide ${c}` : `Show ${c}`;
    return neg ? `Block ${c}` : `Allow ${c}`;
  }

  function sampleToggles(rng, spec, opts) {
    const n = opts.ood ? rng.int(9, 12) : rng.int(5, 8);
    const picked = C.sample(rng, SETTINGS, n, C.csplitOf(spec));
    const items = picked.map((s) => {
      const neg = rng.bool(0.45);
      return { label: labelFor(rng, s, neg), concept: s.concept, kind: s.kind, neg, desc: s.desc };
    });
    const k = opts.ood ? rng.int(3, 4) : rng.int(1, 3);
    let said = rng.sample(items.map((_, i) => i), k);
    // Usually at least one named switch has a negated label (the point of the scenario).
    const negs = items.map((it, i) => (it.neg ? i : -1)).filter((i) => i >= 0 && !said.includes(i));
    if (!said.some((i) => items[i].neg) && negs.length && rng.bool(0.8)) said[0] = rng.pick(negs);
    said = uniq(said).sort((a, b) => a - b);
    const base = items.map(() => rng.bool(0.5));
    // want: the effect each named switch must have; effect true = feature on / visible / allowed.
    const effect = said.map(() => rng.bool(0.5));
    const want = base.slice();
    said.forEach((i, j) => { want[i] = items[i].neg ? !effect[j] : effect[j]; });
    return Object.assign(spec, { label: 'Settings', labelAliases: ['settings', 'preferences'], noun: 'setting', plural: 'settings',
      title: rng.pick(SETTING_TITLES), note: rng.pick([
        'Changes apply to all your devices.', 'These settings are saved to your account.',
        'You can change them at any time.', 'Choose options that fit your needs.',
        'Your choices help shape your account.'
      ]),
      items, said, effect, base, want, options: items.map((it) => it.label) });
  }

  env.scenario('choose-option', {
    name: 'toggles',
    sample(rng, spec, opts) {
      const scenario = spec.scenario;return sampleToggles(rng, spec, opts);
    },
    init(spec, rng, { mode }) {
      const on = spec.base.slice();
      const said = spec.said;
      if (mode === 'partial' && said.length > 1) {
        const done = rng.sample(said, rng.int(1, said.length - 1));
        for (const i of said) on[i] = done.includes(i) ? spec.want[i] : !spec.want[i];
      } else if (mode === 'wrong' && said.some((i) => spec.items[i].neg)) {
        // The literal misreading: a negated switch set as if its label meant the effect.
        for (const i of said) on[i] = spec.items[i].neg ? !spec.want[i] : spec.want[i];
      } else for (const i of said) on[i] = !spec.want[i];
      return { on };
    },
  });
})();
