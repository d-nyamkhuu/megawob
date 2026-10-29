/* choose-option/scenarios/autocomplete.js: autocomplete sampling and start states. */
(function () {
  'use strict';
  const { alpha, prefixFor, C, suffixFor, MAX_SUGGEST, keysOf, suggest, misspell } = env.taskOf('choose-option').lib;



  env.scenario('choose-option', {
    name: 'autocomplete',
    sample(rng, spec, opts, { cat }) {
      // The datasource is the whole bank (a country list lists every country); the target comes from the
      // content split when possible.
      const pool = cat.pool.slice().sort(alpha);
      const cands = pool.filter((t) => prefixFor(pool, t));
      const part = C.split(cands, spec.csplit);
      const target = rng.pick(part.length ? part : cands);
      const prefix = prefixFor(pool, target);
      let hint = { kind: 'full', prefix };
      if (rng.bool(0.45)) {
        const suffix = suffixFor(pool, target, prefix);
        if (suffix) hint = { kind: 'affix', prefix, suffix };
      }
      const slow = rng.bool(0.5);
      return Object.assign(spec, {
        options: pool, target, hint, typed: prefix, maxSuggest: MAX_SUGGEST,
        latency: slow ? (opts.ood ? rng.int(30, 45) * 100 : rng.int(12, 26) * 100) : 0,
        // scene starts show the typed query without focus in some widgets: no key route there (the click route works everywhere)
        keys: keysOf(opts, rng.bool(0.3)) && spec.startMode !== 'scene',
        placeholder: `Start typing a ${cat.noun}...`,
      });
    },
    init(spec, rng, { mode, wrongs }) {
      const m = { value: '', text: '', open: false, loading: false, readyAt: 0, active: -1 };
      if (mode === 'partial') return { ...m, text: spec.typed.slice(0, Math.max(1, spec.typed.length - 1)) };
      // scene: a query typed and the suggestion list open (loaded), nothing committed
      if (mode === 'scene') return { ...m, text: spec.typed.slice(0, Math.max(2, spec.typed.length - 1)), open: true };
      const rivals = suggest(spec, spec.typed).filter((o) => o !== spec.target);
      const rival = () => (rivals.length ? rng.pick(rivals) : rng.pick(wrongs));
      if (mode === 'wrong') {
        if (rng.bool(0.5)) { const w = rival(); return { ...m, value: w, text: w }; }
        return { ...m, text: misspell(spec, rng), open: true };
      }
      if (rng.bool(0.65)) return m;
      const w = rival();
      return { ...m, value: w, text: w };
    },
  });
})();
