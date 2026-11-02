/* choose-option/scenarios/tree.js: tree sampling and start states. */
(function () {
  'use strict';
  const { C, TREES, aliasesFor, TREE_TITLES } = env.taskOf('choose-option').lib;

  function sampleTree(rng, spec, opts) {
    const G = opts.ood ? 3 : rng.int(1, 2);
    const trees = C.sample(rng, TREES, G, C.csplitOf(spec));
    const groups = trees.map((t) => {
      const m = opts.ood ? rng.int(7, 9) : rng.int(3, 6);
      const options = rng.sample(t.options, m).sort((a, b) => t.options.indexOf(a) - t.options.indexOf(b));
      const kind = rng.pick(m >= 4 ? ['all', 'except', 'except', 'none', 'only', 'only'] : ['all', 'except', 'none', 'only']);
      const nl = kind === 'except' || kind === 'only' ? rng.int(1, Math.min(2, m - 2)) : 0;
      const list = rng.sample(options, nl).sort((a, b) => options.indexOf(a) - options.indexOf(b));
      return { name: t.name, options, goal: { kind, list } };
    });
    const options = groups.flatMap((g) => g.options);
    const targets = groups.flatMap((g) => g.options.filter((o) => {
      const { kind, list } = g.goal;
      return kind === 'all' || (kind === 'except' && !list.includes(o)) || (kind === 'only' && list.includes(o));
    }));
    return Object.assign(spec, { groups, options, targets, links: rng.bool(0.35), label: groups[0].name,
      labelAliases: aliasesFor(groups[0].name), noun: 'option', plural: 'options', title: rng.pick(TREE_TITLES),
      note: rng.pick([
        'Changes take effect immediately.', 'Choose what to include.', 'Applies to your whole account.',
        'Groups contain related choices.', 'Options are grouped by category.'
      ]) });
  }

  env.scenario('choose-option', {
    name: 'tree',
    sample(rng, spec, opts) {
      const scenario = spec.scenario;return sampleTree(rng, spec, opts);
    },
    init(spec, rng, { mode }) {
      const vals = new Set();
      spec.groups.forEach((g) => {
        const T = g.options.filter((o) => spec.targets.includes(o));
        let pick;
        if (mode === 'wrong') pick = g.options.filter((o) => !T.includes(o)); // the inverse selection
        else if (mode === 'partial') {
          const diff = g.options.filter((o) => rng.bool(0.5));
          pick = g.options.filter((o) => (diff.includes(o) ? !T.includes(o) : T.includes(o)));
        } else {
          const r = rng.next();
          pick = r < 0.3 ? [] : r < 0.5 ? g.options.slice() : rng.sample(g.options, rng.int(1, g.options.length - 1));
        }
        pick.forEach((o) => vals.add(o));
      });
      return { values: spec.options.filter((o) => vals.has(o)) };
    },
  });
})();
