/* choose-option/scenarios/tags.js: tags sampling and start states. */
(function () {
  'use strict';
  const { sampleChips, keysOf, tagQuery, pre2 } = env.taskOf('choose-option').lib;

  function sampleTags(rng, spec, opts) {
    sampleChips(rng, spec, opts, true);
    const r = rng.fork('tags');
    spec.maxShow = opts.ood ? r.int(3, 4) : r.int(2, 3);
    spec.keys = keysOf(opts, r.bool(0.3));
    spec.queries = Object.fromEntries(spec.targets.map((t) => [t, tagQuery(spec, t)]));
    spec.placeholder = r.pick(['Add a tag…', `Add ${spec.noun}…`, 'Type to add']);
    return spec;
  }

  env.scenario('choose-option', {
    name: 'tags',
    sample(rng, spec, opts) {
      const scenario = spec.scenario;return sampleTags(rng, spec, opts);
    },
    init(spec, rng, { mode, wrongs }) {
      const k = spec.targets.length;
      const M = spec.maxShow;
      const m = { values: [], text: '', open: false, active: -1, expanded: false };
      const extras = (n) => {
        const nb = wrongs.filter((o) => spec.targets.some((t) => pre2(t) === pre2(o)));
        const out = [];
        for (let i = 0; i < n && out.length < wrongs.length; i++) {
          const c = rng.pick(nb.length && rng.bool(0.5) ? nb : wrongs);
          if (!out.includes(c)) out.push(c);
        }
        return out;
      };
      if (mode === 'partial') return { ...m, values: rng.sample(spec.targets, rng.int(1, Math.max(1, k - 1))) };
      if (mode === 'wrong' || rng.bool(0.5)) {
        // Extras go last, so with enough chips before them they sit behind "+N more".
        let t = rng.int(0, k);
        if (rng.bool(0.6)) t = Math.max(t, Math.min(k, M));
        const w = extras(rng.int(1, 3));
        return { ...m, values: rng.sample(spec.targets, t).concat(w) };
      }
      return { ...m, values: [] };
    },
  });
})();
