/* use-text-editor/model.js: Initial states, partial and wrong starts, solving and scoring. */
(function () {
  'use strict';
  const task = env.taskOf('use-text-editor');
  const { lib } = task;

  const baseModel = (spec) => (lib.isProse(spec) ? lib.proseModel(spec, spec.doc0) : lib.codeModel(spec, spec.base));

  function initModel(spec, rng) {
    const m = baseModel(spec);
    if (spec.judge || !rng) return m;
    const mode = spec.startMode;
    if (mode === 'partial') return partialOf(spec, m, rng) || m;
    if (mode === 'wrong') return wrongOf(spec, m, rng) || m;
    return m;
  }
  // A model whose buffer is the given text / doc, with that change on the undo stack (hist) or not.
  const withText = (spec, m, text, cur, hist) => {
    const n = lib.isProse(spec) ? { ...m, doc: text } : { ...m, text };
    return { ...n, cur: cur || [lib.caret(0)], hist: hist ? [...m.hist, lib.snap(m, spec)] : m.hist, op: 'edit' };
  };

  function partialOf(spec, m, rng) {
    const g = spec.goal;
    if (g.kind === 'insert') {
      const k = Math.floor(g.text.length / 2);
      if (!k) return { ...m, cur: [lib.caret(g.at)], focus: 'editor' };
      if (lib.isProse(spec)) return lib.editRanges(m, spec, [[g.at, g.at, g.text.slice(0, k)]]);
      return withText(spec, m, spec.base.slice(0, g.at) + g.text.slice(0, k) + spec.base.slice(g.at), [lib.caret(g.at + k)], false);
    }
    if (g.kind === 'lines') {
      if (g.b > g.a && rng.bool(0.6)) {
        // the first line done already
        const one = { ...g, b: g.a };
        return withText(spec, m, lib.codeTarget(spec, one), [lib.caret(lib.offOf(spec.base, g.a, 0))], true);
      }
      // the range selected, nothing done yet
      const a = lib.offOf(spec.base, g.a, 0);
      const b = g.op === 'delete' ? lib.offOf(spec.base, g.b + 1, 0) : lib.offOf(spec.base, g.b, lib.linesOf(spec.base)[g.b].length);
      return { ...m, cur: [{ a, h: b === a ? b + 1 : b }], focus: 'editor' };
    }
    if (g.kind === 'multi') {
      const k = rng.int(1, g.lines.length - 1);
      const done = { ...g, lines: g.lines.slice(0, k), cols: g.cols.slice(0, k) };
      return withText(spec, m, lib.codeTarget(spec, done), [lib.caret(0)], false);
    }
    if (g.kind === 'find') {
      if (g.want.length >= 2 && rng.bool(0.5)) {
        const done = { ...g, want: g.want.slice(0, 1) };
        if (lib.isProse(spec)) return lib.editRanges(m, spec, [[done.want[0][0], done.want[0][1], g.y]]);
        return withText(spec, m, lib.codeTarget(spec, done), [lib.caret(0)], true);
      }
      return { ...m, focus: 'repl', find: { open: true, rep: true, query: g.x, repl: g.y, mc: false, ww: false, pos: 0 } };
    }
    if (g.kind === 'review') {
      const ids = Object.keys(g.want);
      if (ids.length >= 2) return lib.review(m, spec, ids[0], g.want[ids[0]]);
      return { ...m, cur: [lib.caret(lib.suggestions(m.doc).find((s) => s.id === ids[0]).o)], focus: 'editor' };
    }
    if (g.kind === 'suggest') {
      if (g.op === 'replace' && rng.bool(0.5)) {
        const x = { ...m, mode: 'suggest' };
        return { ...lib.editRanges(x, spec, [[g.a, g.b, '']], 'edit', { back: true }), focus: null };
      }
      return { ...m, mode: 'suggest' };
    }
    return null;
  }

  function wrongOf(spec, m, rng) {
    const g = spec.goal;
    const text = lib.isProse(spec) ? lib.flatDoc(spec.doc0) : spec.base;
    if (g.kind === 'insert') {
      // the same text typed at another spot (another occurrence of the token, or the line below / above)
      const ws = lib.isProse(spec) ? lib.plainWords(text) : lib.identifiers(spec, text);
      const ref = g.ref || {};
      const same = ws.filter((x) => x.w === ref.tok && x.a !== g.at && x.b !== g.at);
      const side = ref.by === 'before' ? 'a' : 'b';
      let at;
      if (same.length) at = rng.pick(same)[side];
      else at = rng.pick(ws.filter((x) => Math.abs(x[side] - g.at) > 3))[side];
      if (g.text.startsWith('\n')) at = lib.lineEnd(text, lib.offOf(text, lib.lc(text, g.at)[0] + rng.pick([-1, 1, 2]), 0));
      const t = g.text.startsWith('\n') && g.ref.stmts ? `\n${lib.linesOf(text)[lib.lc(text, at)[0]].match(/^ */)[0]}${g.ref.stmts[0]}` : g.text;
      if (lib.isProse(spec)) return lib.editRanges(m, spec, [[at, at, t]]);
      return withText(spec, m, text.slice(0, at) + t + text.slice(at), [lib.caret(at + t.length)], true);
    }
    if (g.kind === 'lines') {
      const n = lib.linesOf(text).length;
      const sh = rng.pick([-1, 1]);
      let a = g.a + sh;
      let b = g.b + sh;
      if (a < 0 || b >= n) { a = g.a - sh; b = g.b - sh; }
      if (a < 0 || b >= n) return null;
      // keep the shifted range on equal-indent, non-blank lines where the op applies
      const ls = lib.linesOf(text);
      for (let l = a; l <= b; l++) if (!ls[l].trim()) return null;
      const wrong = { ...g, a, b };
      const t = lib.codeTarget(spec, wrong);
      if (t === text) return null;
      return withText(spec, m, t, [lib.caret(lib.offOf(t, Math.min(a, lib.linesOf(t).length - 1), 0))], true);
    }
    if (g.kind === 'multi') {
      // one line too many (the line after the last one), or the text at the line ends instead of the column
      const ls = lib.linesOf(text);
      const extra = g.lines[g.lines.length - 1] + 1;
      if (g.op !== 'suffix' && rng.bool(0.5)) {
        const w = { ...g, cols: g.lines.map((l) => ls[l].length) };
        return withText(spec, m, lib.codeTarget(spec, w), [lib.caret(0)], true);
      }
      if (extra < ls.length && ls[extra].trim()) {
        const w = { ...g, lines: [...g.lines, extra], cols: [...g.cols, g.op === 'suffix' ? ls[extra].length : Math.min(g.cols[0], ls[extra].length)] };
        return withText(spec, m, lib.codeTarget(spec, w), [lib.caret(0)], true);
      }
      return null;
    }
    if (g.kind === 'find') {
      // Replace All without the options: distractors replaced too
      const all = lib.occurrences(spec, text, g.x, { mc: false, ww: false });
      if (all.length === g.want.length) return null;
      if (lib.isProse(spec)) return lib.editRanges(m, spec, all.map(([a, b]) => [a, b, g.y]));
      return withText(spec, m, lib.applyEdits(text, all.map(([a, b]) => ({ a, b, s: g.y }))).text, [lib.caret(0)], true);
    }
    if (g.kind === 'review') {
      const ids = Object.keys(g.want);
      const id = rng.pick(ids);
      const others = lib.suggestions(spec.doc0).filter((s) => !ids.includes(s.id));
      if (others.length && rng.bool(0.5)) return lib.review(m, spec, rng.pick(others).id, 'accept');
      return lib.review(m, spec, id, g.want[id] === 'accept' ? 'reject' : 'accept');
    }
    if (g.kind === 'suggest') {
      // the edit made directly in editing mode
      return lib.editRanges(m, spec, [[g.a, g.b, g.text]], 'edit', { back: true });
    }
    return null;
  }

  function solveOf(spec, model) {
    const m = model || baseModel(spec);
    if (lib.isProse(spec)) {
      return { ...m, doc: lib.U.clone(spec.doc1), cur: [lib.caret(0)], mode: spec.goal.kind === 'suggest' && !spec.judge ? 'suggest' : m.mode === 'view' ? 'edit' : m.mode, menu: false, pop: null };
    }
    return { ...m, text: spec.target, cur: [lib.caret(0)], pop: null };
  }

  // ---------------------------------------------------------------- error

  const bufferOf = (m, spec) => (lib.isProse(spec) ? lib.serDoc(m.doc) : m.text);
  const errorOf = (m, spec) => {
    const buf = bufferOf(m, spec);
    const d = lib.dist(buf, spec.target);
    if (!d || spec.scenario !== 'multiline' || lib.isProse(spec) || spec.judge || buf !== spec.base) return d;
    // multiline before the edit: selecting the goal's line range is the only progress there can be, worth up to half
    // (line-range Jaccard, so selecting the whole file earns about nothing). A bare caret is not a selection.
    const c = m.cur[0];
    if (c.h === c.a) return d;
    const lo = Math.min(c.h, c.a);
    const hiOff = Math.max(c.h, c.a);
    const [l0] = lib.lc(buf, lo);
    const [l1, col] = lib.lc(buf, hiOff);
    const hi = col === 0 && l1 > l0 ? l1 - 1 : l1;
    const g = spec.goal;
    const inter = Math.max(0, Math.min(hi, g.b) - Math.max(l0, g.a) + 1);
    return d * (1 - 0.5 * inter / ((hi - l0 + 1) + (g.b - g.a + 1) - inter));
  };
  const toleranceOf = (spec) => ({ tau: 0, sigma: Math.max(2, (spec.d0 || 0) / 2), minInitialError: 0.5 });

  // ---------------------------------------------------------------- instructions

  Object.assign(lib, { bufferOf, errorOf, toleranceOf, initModel, solveOf });
})();
