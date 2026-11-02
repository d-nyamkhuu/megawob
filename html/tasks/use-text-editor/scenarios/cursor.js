/* use-text-editor/cursor: goal sampling for the cursor scenario. */
(function () {
  'use strict';
  const { lib } = env.taskOf('use-text-editor');

  function goalCursor(rng, spec) {
    const text = spec.base;
    const ids = lib.identifiers(spec, text);
    const onLine = (x) => ids.filter((y) => y.l === x.l && y.w === x.w).length === 1;
    const kind = rng.pick(['after', 'after', 'before', 'eol', 'lncol', 'unique']);
    if (kind === 'eol') {
      const ls = lib.linesOf(text);
      const cand = ls.map((x, l) => l).filter((l) => ls[l].trim() && !ls[l].trim().startsWith(spec.tok) && ls[l].length < 60);
      const l = rng.pick(cand);
      const t = spec.lang === 'js' && !spec.semi && rng.bool(0.4) && /[\w)\]]$/.test(ls[l]) ? ';' : rng.pick(lib.EOL[spec.lang]);
      return { kind: 'insert', at: lib.offOf(text, l, ls[l].length), text: t, ref: { by: 'eol', line: l } };
    }
    if (kind === 'unique') {
      const uniq = ids.filter((x) => lib.countWord(spec, text, x.w) === 1 && x.w.length >= 3);
      if (uniq.length) {
        const x = rng.pick(uniq);
        return { kind: 'insert', at: x.b, text: rng.pick(lib.SUFFIX[spec.lang]), ref: { by: 'unique', tok: x.w, line: x.l } };
      }
    }
    const cand = ids.filter(onLine);
    const x = rng.pick(cand);
    if (kind === 'before') return { kind: 'insert', at: x.a, text: rng.pick(lib.PREFIX[spec.lang]), ref: { by: 'before', tok: x.w, line: x.l } };
    if (kind === 'lncol') {
      const after = rng.bool(0.5);
      const at = after ? x.b : x.a;
      const [l, c] = lib.lc(text, at);
      return { kind: 'insert', at, text: rng.pick(after ? lib.SUFFIX[spec.lang] : lib.PREFIX[spec.lang]), ref: { by: 'lncol', line: l, col: c } };
    }
    return { kind: 'insert', at: x.b, text: rng.pick(lib.SUFFIX[spec.lang]), ref: { by: 'after', tok: x.w, line: x.l } };
  }

  function goalProseCursor(rng, spec) {
    const text = lib.flatDoc(spec.doc0);
    const ws = lib.plainWords(text);
    const paraWords = (x) => ws.filter((y) => lib.paraOf(text, y.a) === lib.paraOf(text, x.a) && y.w === x.w).length === 1;
    const cand = ws.filter((x) => paraWords(x) && x.w.length >= 4);
    const x = rng.pick(cand);
    const add = rng.pick(lib.ADD_WORDS);
    const before = rng.bool(0.3);
    return { kind: 'insert', at: before ? x.a : x.b, text: before ? `${add} ` : ` ${add}`, ref: { by: before ? 'before' : 'after', tok: x.w, para: lib.paraOf(text, x.a), word: add } };
  }

  env.scenario('use-text-editor', {
    name: 'cursor',
    sampleCode: goalCursor, sampleProse: goalProseCursor,
  });
})();
