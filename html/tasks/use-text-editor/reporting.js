/* use-text-editor/reporting.js: Visible facts, silent save failures and retargeting. */
(function () {
  'use strict';
  const task = env.taskOf('use-text-editor');
  const { lib } = task;

  const MODE_LABEL = { edit: 'Editing', suggest: 'Suggesting', view: 'Viewing' };
  const LANG_LABEL = { js: 'JavaScript', py: 'Python' };
  // aliases: other spellings of the value; labels: other names of the fact. The cursor position is two facts: a value with a
  // comma ("Ln 3, Col 5") cannot be stated in plain text, where a comma ends the clause.
  function factsOf(m, spec) {
    if (lib.isProse(spec)) {
      return [
        { label: 'Words', value: String(lib.wordCount(m.doc)), labels: ['Word count', 'Number of words'] },
        { label: 'Suggestions', value: String(lib.suggestions(m.doc).length), labels: ['Open suggestions', 'Pending suggestions'] },
        { label: 'Mode', value: MODE_LABEL[m.mode], labels: ['Editing mode'] },
      ];
    }
    const [l, c] = lib.lc(m.text, m.cur[0].h);
    return [
      { label: 'Lines', value: String(lib.linesOf(m.text).length), labels: ['Line count', 'Number of lines'] },
      { label: 'Cursor line', value: String(l + 1), labels: ['Cursor Ln', 'Ln'] },
      { label: 'Cursor column', value: String(c + 1), labels: ['Cursor Col', 'Col'] },
      { label: 'Language', value: LANG_LABEL[spec.lang], labels: ['Language mode'] },
    ];
  }

  const clampCur = (cur, n) => cur.map((c) => ({ h: Math.min(c.h, n), a: Math.min(c.a, n) }));
  function silentOf(next, prev, spec) {
    if (spec.judge) return null;
    const tau = lib.toleranceOf(spec).tau;
    const bad = (m) => (m && lib.errorOf(m, spec) > tau && lib.bufferOf(m, spec) !== lib.bufferOf(next, spec) ? m : null);
    if (lib.isProse(spec)) {
      if (lib.serDoc(next.doc) === lib.serDoc(prev.doc)) return null;
      const n = lib.U.clone(next);
      n.doc = lib.U.clone(prev.doc);
      n.cur = clampCur(n.cur, lib.flatDoc(n.doc).length);
      return bad(n);
    }
    if (next.text === prev.text) return null;
    const nl = lib.linesOf(next.text);
    const pl = lib.linesOf(prev.text);
    const n = lib.U.clone(next);
    if (nl.length === pl.length) {
      const diff = nl.map((x, i) => (x !== pl[i] ? i : -1)).filter((i) => i >= 0);
      if (diff.length >= 2) {
        // one cursor's line (or one line of the block) kept its old content
        const l = diff[diff.length - 1];
        n.text = nl.map((x, i) => (i === l ? pl[i] : x)).join('\n');
        n.cur = clampCur(n.cur, n.text.length);
        const r = bad(n);
        if (r) return r;
      }
    }
    // the autosave lost the last change
    n.text = prev.text;
    n.cur = clampCur(next.cur, n.text.length);
    n.pop = null;
    return bad(n);
  }

  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    let out = null;
    if (lib.isProse(spec)) {
      const doc0 = lib.U.clone(model.doc);
      const s1 = { ...spec, doc0 };
      if (spec.goal.kind === 'review' && lib.suggestions(doc0).length) {
        const ss = lib.suggestions(doc0);
        const pick = rng.sample(ss, Math.min(ss.length, rng.int(1, 2)));
        const want = {};
        for (const s of pick) want[s.id] = rng.pick(['accept', 'reject']);
        s1.goal = { kind: 'review', want, how: 'list', items: pick.map((s) => ({ id: s.id, act: want[s.id], ...lib.describe(s), author: s.author })) };
      } else if (spec.goal.kind === 'suggest') {
        try { s1.goal = lib.goalSuggest(rng, s1); } catch (e) { return null; }
      } else {
        const text = lib.flatDoc(doc0);
        const chars = lib.runChars(doc0);
        const ws = lib.plainWords(text).filter((x) => x.w.length >= 4 && lib.countWord(s1, text, x.w) === 1
          && chars.slice(Math.max(0, x.a - 1), x.b + 1).every((c) => c.k === 'b' || c.k === 'n'));
        if (!ws.length) return null;
        const x = rng.pick(ws);
        const w = rng.pick(lib.ADD_WORDS.filter((a) => !text.includes(` ${a} `)));
        s1.goal = { kind: 'insert', at: x.b, text: ` ${w}`, ref: { by: 'after', tok: x.w, para: lib.paraOf(text, x.a), word: w } };
      }
      s1.doc1 = lib.proseTarget(s1, s1.goal);
      s1.target = lib.serDoc(s1.doc1);
      s1.d0 = lib.dist(lib.serDoc(doc0), s1.target);
      out = s1;
    } else {
      const base = model.text;
      const s1 = { ...spec, base };
      const ids = lib.identifiers(s1, base).filter((x) => x.w.length >= 3 && lib.countWord(s1, base, x.w) === 1);
      if (!ids.length) return null;
      const x = rng.pick(ids);
      s1.goal = { kind: 'insert', at: x.b, text: rng.pick(lib.SUFFIX[spec.lang]), ref: { by: 'unique', tok: x.w, line: x.l } };
      s1.target = lib.codeTarget(s1, s1.goal);
      s1.d0 = lib.dist(base, s1.target);
      out = s1;
    }
    return out && lib.errorOf(model, out) > lib.toleranceOf(out).tau ? out : null;
  }

  Object.assign(lib, { factsOf, silentOf, retargetOf });
  Object.assign(task.helpers, { MODE_LABEL, LANG_LABEL });
})();
