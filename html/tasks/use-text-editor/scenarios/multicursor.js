/* use-text-editor/multicursor: goal sampling for the multicursor scenario. */
(function () {
  'use strict';
  const { lib } = env.taskOf('use-text-editor');

  function goalMulti(rng, spec, meta, op, opts) {
    const text = spec.base;
    const ls = lib.linesOf(text);
    if (op === 'await') {
      const lines = lib.tagLines(meta, 'fetch');
      const cols = lines.map((l) => ls[l].indexOf(meta.names.fetch));
      return { kind: 'multi', op, lines, cols, text: 'await ', route: 'alt' };
    }
    if (op === 'prefix') {
      let lines = lib.tagLines(meta, 'const');
      if (spec.lang === 'py' && rng.bool(0.5)) lines = [...lines, ...lib.tagLines(meta, 'let')];
      if (spec.level === 'easy') lines = lines.slice(0, 2);
      const t = spec.lang === 'js' ? rng.pick(['export ', 'APP_']) : rng.pick(['APP_', 'CFG_']);
      const col = t === 'APP_' && spec.lang === 'js' ? 6 : 0;
      return { kind: 'multi', op, lines, cols: lines.map(() => col), text: t, route: lib.pickRoute(rng, opts, 'keys', ['alt'], ['keys', 'keys', 'alt']) };
    }
    let lines = lib.tagLines(meta, rng.pick(['fetch', 'stmt']));
    if (spec.level === 'easy') lines = lines.slice(0, 2);
    return { kind: 'multi', op: 'suffix', lines, cols: lines.map((l) => ls[l].length), text: rng.pick(lib.NOTE[spec.lang]),
      route: lib.pickRoute(rng, opts, 'keys', ['alt'], ['keys', 'keys', 'alt']) };
  }

  env.scenario('use-text-editor', {
    name: 'multicursor',
    sampleCode(rng, spec, meta, op, opts) { return goalMulti(rng, spec, meta, op, opts); },
  });
})();
