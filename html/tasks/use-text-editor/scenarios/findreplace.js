/* use-text-editor/findreplace: goal sampling for the findreplace scenario. */
(function () {
  'use strict';
  const { lib } = env.taskOf('use-text-editor');

  function goalFindCode(rng, spec, meta, opts) {
    const text = spec.base;
    const nm = meta.names;
    const x = rng.pick([nm.n, nm.n, nm.f]);
    const pool = (x === nm.n ? lib.NOUNS : lib.FIELDS).filter((w) => w !== x && !text.toLowerCase().includes(w));
    const y = lib.C.pick(rng, pool, { csplit: spec.csplit });
    const want = lib.occurrences(spec, text, x, { mc: true, ww: true });
    const lines = [...new Set(want.map(([a]) => lib.lc(text, a)[0]))];
    let mode = spec.level === 'easy' ? 'all' : rng.pick(['all', 'all', 'some']);
    if (mode === 'some' && lines.length < 3) mode = 'all';
    const route = lib.pickRoute(rng, opts, 'keys', ['button'], ['keys', 'button']);
    if (mode === 'some') {
      const k = rng.int(1, Math.min(3, lines.length - 1));
      const keep = rng.sample(lines, k).sort((a, b) => a - b);
      const w = want.filter(([a]) => keep.includes(lib.lc(text, a)[0]));
      return { kind: 'find', x, y, mode, want: w, lines: keep, route, ...lib.needs(spec, text, x, w) };
    }
    return { kind: 'find', x, y, mode, want, route, ...lib.needs(spec, text, x, want) };
  }

  function goalFindProse(rng, spec, T, opts) {
    const text = lib.flatDoc(spec.doc0);
    const y = lib.C.pick(rng, lib.CODENAMES.filter((w) => w !== T && !text.includes(w)), { csplit: spec.csplit });
    const want = lib.occurrences(spec, text, T, { mc: true, ww: true });
    const paras = [...new Set(want.map(([a]) => lib.paraOf(text, a)))];
    let mode = spec.level === 'easy' ? 'all' : rng.pick(['all', 'all', 'some']);
    if (mode === 'some' && paras.length < 2) mode = 'all';
    const route = lib.pickRoute(rng, opts, 'keys', ['button'], ['keys', 'button']);
    if (mode === 'some') {
      const p = rng.pick(paras);
      const w = want.filter(([a]) => lib.paraOf(text, a) === p);
      return { kind: 'find', x: T, y, mode, want: w, para: p, route, ...lib.needs(spec, text, T, w) };
    }
    return { kind: 'find', x: T, y, mode, want, route, ...lib.needs(spec, text, T, want) };
  }

  env.scenario('use-text-editor', {
    name: 'findreplace',
    sampleCode(rng, spec, meta, op, opts) { return goalFindCode(rng, spec, meta, opts); },
    sampleProse: goalFindProse,
  });
})();
