/* choose-option/scenarios/listbox.js: listbox sampling and start states. */
(function () {
  'use strict';
  const { sampleOptions, routeOf } = env.taskOf('choose-option').lib;



  env.scenario('choose-option', {
    name: 'listbox',
    sample(rng, spec, opts, { cat }) {
      const multi = rng.bool(0.5);
      const rows = opts.ood ? rng.int(5, 6) : rng.int(6, 9);
      const n = opts.ood ? rng.int(40, 60) : rng.int(15, 30);
      const k = multi ? rng.int(2, 3) : 1;
      let picked = null;
      for (let t = 0; t < 40 && !picked; t++) {
        const o = sampleOptions(rng.fork(`opts#${t}`), cat, n, k, spec.csplit);
        // At least one target starts below the visible rows, so the list has to be scrolled.
        if (o.targets.some((x) => o.options.indexOf(x) >= rows)) picked = o;
      }
      if (!picked) return null;
      Object.assign(spec, { options: picked.options, targets: picked.options.filter((o) => picked.targets.includes(o)), multi, rows,
        route: routeOf(opts, rng.bool(0.5) ? 'wheel' : 'drag') });
      if (!multi) spec.target = spec.targets[0];
      return spec;
    },
    init(spec, rng, { mode, wrongs }) {
      const inView = wrongs.filter((o) => spec.options.indexOf(o) < spec.rows);
      if (mode === 'partial') return { values: spec.multi ? [spec.targets[0]] : [], scroll: 0 };
      if (mode === 'wrong') return { values: [rng.pick(inView.length ? inView : wrongs)], scroll: 0 };
      const values = rng.bool(0.4) && inView.length ? [rng.pick(inView)] : [];
      return { values, scroll: 0 };
    },
  });
})();
