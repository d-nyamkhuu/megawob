/*
 * click-control / open: double-click to open.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const { fileItems, pickIn, T, targetCorrect } = fam.lib;

  function sampleOpen(rng, ctx) {
    const { o, ood } = ctx;
    const items = fileItems(rng, ood ? rng.int(12, 14) : rng.int(6, 10), o);
    return { layout: rng.pick(['grid', 'grid', 'list']), route: rng.bool(0.25) ? 'toolbar' : 'dbl', items, target: rng.pick(items).key };
  }

  env.scenario('click-control', {
    name: 'open',
    sample: sampleOpen,
    baseModel(spec, c) {
      return { sel: null, ...c };
    },
    progress: (model, spec) => model.sel === spec.target ? 0.5 : 1,
    correct: targetCorrect,
    result(spec, key) {
      const it = spec.items.find((x) => x.key === key); return it ? it.name : key;
    },
    wrongFinal(spec, rng) {
      const ks = spec.items.map((x) => x.key).filter((k) => k !== spec.target);
      return { key: rng.pick(ks), patch: { sel: null } };
    },
    wrongNav(spec, rng) {
      return { sel: rng.pick(spec.items.map((x) => x.key).filter((k) => k !== spec.target)) };
    },
    partial(spec) {
      return { sel: spec.target };
    },
    planStep(model, spec) {
      if (spec.route === 'toolbar') return model.sel === spec.target ? { click: { openbtn: true } } : { click: { item2: spec.target } };
      return { dblclick: { item2: spec.target } };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      spec.items = pickIn(r, spec.items, (x) => x.key === spec.target, k(2, 4));
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const it = spec.items.find((x) => x.key === spec.target);
      const extra = it.kind === 'folder' ? T.openFolder : T.openFile;
      core = P(T.open.concat(extra), { qname: q(it.name), kind: it.kind === 'folder' ? 'folder' : 'file' });
      terse = `open ${q(it.name)}`;
      return { core, terse, steps };
    },
    phKind: () => 'open',
    retarget: (spec, model, rng, out, other) => other(spec.items.map((x) => x.key), spec.target),
  });
})();
