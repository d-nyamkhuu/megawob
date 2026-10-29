/* use-text-editor/oracle.js: Closed-loop editor plans and repair steps. */
(function () {
  'use strict';
  const task = env.taskOf('use-text-editor');
  const { lib } = task;

  const KEYNAME = { ' ': 'Space', '\n': 'Enter', '\t': 'Tab' };
  const keyOf = (ch) => KEYNAME[ch] || ch;
  const one = (m) => m.cur.length === 1;
  const caretAt = (m, o) => m.focus === 'editor' && one(m) && lib.collapsed(m.cur[0]) && m.cur[0].h === o;
  // Type one character at the caret (Escape first while the completion popup would take it).
  const typeStep = (m, ch) => (m.pop && (ch === '\n' || ch === '\t') ? { key: 'Escape' } : { key: keyOf(ch) });

  // Generic repair: the first hunk of an optimal alignment of the flat text with the flat target.
  function genericStep(m, spec, F, T) {
    if (m.focus === 'editor' && m.cur.length > 1) return { key: 'Escape' };
    const h = lib.firstHunk(F, T);
    const c = m.cur[0];
    if (h.to === h.from) return caretAt(m, h.from) ? typeStep(m, h.ins[0]) : { click: { pos: h.from } };
    if (m.focus === 'editor' && one(m) && lib.lo(c) === h.from && lib.hi(c) === h.to) return h.ins ? typeStep(m, h.ins[0]) : { key: 'Delete' };
    if (h.to - h.from <= 2) return caretAt(m, h.from) ? { key: 'Delete' } : { click: { pos: h.from } };
    if (m.focus === 'editor' && one(m) && c.a === h.from) return { click: { pos: h.to }, modifiers: ['Shift'] };
    return { click: { pos: h.from } };
  }

  // An insert goal: the text typed so far at goal.at; the caret goes after it and the next character follows.
  function insertStep(m, spec) {
    const g = spec.goal;
    const F = lib.flat(m, spec);
    const B = lib.isProse(spec) ? lib.flatDoc(spec.doc0) : spec.base;
    if (lib.isProse(spec) && lib.serDoc(m.doc) !== F) return null;
    for (let k = g.text.length - 1; k >= 0; k--) {
      if (F.length !== B.length + k) continue;
      if (F.slice(0, g.at + k) === B.slice(0, g.at) + g.text.slice(0, k) && F.slice(g.at + k) === B.slice(g.at)) {
        if (m.focus === 'editor' && m.cur.length > 1) return { key: 'Escape' };
        return caretAt(m, g.at + k) ? typeStep(m, g.text[k]) : { click: { pos: g.at + k } };
      }
    }
    return null;
  }

  function lineClass(spec, a, b) {
    if (a === b) return 'same';
    const u = ' '.repeat(spec.unit);
    if (b === u + a) return 'indent';
    if (a === u + b) return 'outdent';
    const i = lib.leadWs(a);
    if (b === `${a.slice(0, i)}${spec.tok} ${a.slice(i)}`) return 'comment';
    if (a === `${b.slice(0, i)}${spec.tok} ${b.slice(i)}`) return 'uncomment';
    return 'other';
  }
  // Select whole lines ga..gb per route; null once selected. full: up to the start of the next line (for Delete).
  function selectLines(m, spec, ga, gb, route, full) {
    const t = m.text;
    const n = lib.linesOf(t).length;
    const A = lib.offOf(t, ga, 0);
    const E = full && gb + 1 < n ? lib.offOf(t, gb + 1, 0) : lib.lineEnd(t, A === t.length ? A : lib.offOf(t, gb, 0));
    const c = m.cur[0];
    const ok = m.focus === 'editor' && one(m) && (full ? lib.lo(c) === A && lib.hi(c) === E
      : (lib.curLines(t, c)[0] === ga && lib.curLines(t, c)[1] === gb && (ga === gb || !lib.collapsed(c))));
    if (ok) return null;
    if (route === 'drag') return { drag: [{ pos: A }, { pos: E }] };
    if (route === 'keys') {
      const [hl, hc] = lib.lc(t, c.h);
      if (m.focus === 'editor' && one(m) && c.a === A && hc === 0 && hl > ga - 1 && hl <= gb) return { key: 'Shift+ArrowDown' };
      if (m.focus === 'editor' && one(m) && c.a === A && c.h === t.length && full) return null;
      return { click: { pos: A } };
    }
    if (caretAt(m, A) || (m.focus === 'editor' && one(m) && c.a === A)) return { click: { pos: E }, modifiers: ['Shift'] };
    return { click: { pos: A } };
  }
  function linesStep(m, spec) {
    const g = spec.goal;
    const cl = lib.linesOf(m.text);
    const tl = lib.linesOf(spec.target);
    if (g.op === 'delete') {
      const r = cl.length - tl.length;
      if (r <= 0) return null;
      for (let x = 0; x + r <= cl.length; x++) {
        if ([...cl.slice(0, x), ...cl.slice(x + r)].join('\n') !== spec.target) continue;
        const gb = x + r - 1;
        if (g.route === 'kill') return selectLines(m, spec, x, gb, 'shift', false) || { key: 'Control+Shift+K' };
        const route = g.route;
        const full = gb + 1 < cl.length;
        if (!full) return null;
        return selectLines(m, spec, x, gb, route, true) || { key: 'Delete' };
      }
      return null;
    }
    if (cl.length !== tl.length) return null;
    const cls = cl.map((x, i) => lineClass(spec, x, tl[i]));
    if (cls.includes('other')) return null;
    const ga = cls.findIndex((x) => x !== 'same');
    if (ga < 0) return null;
    let gb = ga;
    while (gb + 1 < cls.length && cls[gb + 1] === cls[ga]) gb++;
    // comment / uncomment toggles a whole group by its smallest indentation: keep groups of equal indentation
    for (let l = ga + 1; l <= gb; l++) if (lib.leadWs(cl[l]) !== lib.leadWs(cl[ga])) { gb = l - 1; break; }
    const op = cls[ga];
    const sel = selectLines(m, spec, ga, gb, g.route === 'kill' ? 'shift' : g.route, false);
    if (sel) return sel;
    if (op === 'comment' || op === 'uncomment') return { key: 'Control+/' };
    if (op === 'indent') return { key: ga === gb ? 'Control+]' : 'Tab' };
    return { key: ga === gb ? 'Control+[' : 'Shift+Tab' };
  }

  // multicursor: every goal line still missing a tail of the text at its column; cursors there, then the next char.
  function multiStep(m, spec) {
    const g = spec.goal;
    const cl = lib.linesOf(m.text);
    const tl = lib.linesOf(spec.target);
    if (cl.length !== tl.length) return null;
    const len = g.text.length;
    const st = [];
    for (let l = 0; l < cl.length; l++) {
      const i = g.lines.indexOf(l);
      if (i < 0) { if (cl[l] !== tl[l]) return null; continue; }
      const T = tl[l];
      const c = g.op === 'suffix' ? T.length - len : g.cols[i];
      let k = -1;
      for (let j = len; j >= 0; j--) if (cl[l] === T.slice(0, c + j) + T.slice(c + len)) { k = j; break; }
      if (k < 0) return null;
      if (k < len) st.push({ l, p: lib.offOf(m.text, l, c + k), k });
    }
    if (!st.length) return null;
    const kmin = Math.min(...st.map((x) => x.k));
    const want = st.filter((x) => x.k === kmin);
    const ps = want.map((x) => x.p);
    const cs = m.cur.map((c) => c.h);
    const allCaret = m.focus === 'editor' && m.cur.every(lib.collapsed);
    if (allCaret && cs.length === ps.length && ps.every((p) => cs.includes(p))) return typeStep(m, g.text[kmin]);
    const contiguous = want.every((x, i) => !i || x.l === want[i - 1].l + 1);
    const sameCol = want.every((x) => lib.lc(m.text, x.p)[1] === lib.lc(m.text, want[0].p)[1]);
    if (g.route === 'keys' && contiguous && allCaret) {
      const ls = m.cur.map((c) => lib.lc(m.text, c.h)[0]);
      const prefixOk = ls.every((l, i) => l === want[i]?.l) && m.cur.length <= want.length;
      if (prefixOk && m.cur.length < want.length && (sameCol || g.op === 'suffix')) {
        const okStart = g.op === 'suffix' || m.cur[0].h === want[0].p;
        if (okStart) return { key: 'Control+Alt+ArrowDown' };
      }
      if (prefixOk && m.cur.length === want.length && g.op === 'suffix') return { key: 'End' };
      if (sameCol || g.op === 'suffix') return { click: { pos: want[0].p } };
    }
    // alt-click the missing spots (a plain click first unless every cursor is a wanted spot)
    if (allCaret && cs.every((p) => ps.includes(p))) {
      const miss = ps.find((p) => !cs.includes(p));
      return { click: { pos: miss }, modifiers: ['Alt'] };
    }
    return { click: { pos: ps[0] } };
  }

  // find widget: open, fill, set the options, then Replace All or Replace / Next.
  function findStep(m, spec) {
    const g = spec.goal;
    const f = m.find;
    if (!f || !f.open) {
      if (g.route === 'keys') return m.focus === 'editor' ? { key: 'Control+h' } : { click: { pos: m.cur[0].h } };
      return { click: { find: 'open' } };
    }
    if (!f.rep) return { click: { find: 'expand' } };
    if (f.query !== g.x) return { type: [{ find: 'query' }, g.x] };
    if (!g.partial && !!f.mc !== g.mc) return { click: { find: 'case' } };
    if (!g.partial && !!f.ww !== g.ww) return { click: { find: 'word' } };
    if (f.repl !== g.y) return { type: [{ find: 'repl' }, g.y] };
    const e = lib.errorOf(m, spec);
    const ms = lib.matches(m, spec);
    if (!ms.length) return null;
    if (g.mode === 'all' && !g.partial) {
      const all = lib.findOp(m, spec, 'all');
      if (lib.errorOf(all, spec) < e) return { click: { find: 'all' } };
    }
    const better = (r) => lib.errorOf(lib.editRanges(m, spec, [[r[0], r[1], f.repl]]), spec) < e;
    if (!ms.some(better)) return null;
    const cm = lib.currentMatch(m, spec);
    return better(cm) ? { click: { find: 'one' } } : { click: { find: 'next' } };
  }

  // Can whole-word, case-sensitive replacements of goal.x alone reach the target from model x?
  function onFindPath(x, spec) {
    const g = spec.goal;
    let e = lib.errorOf(x, spec);
    for (let t = 0; t < 12 && e > 0; t++) {
      const ms = lib.occurrences(spec, lib.flat(x, spec), g.x, { mc: true, ww: true });
      let best = null;
      for (const r of ms) {
        const y = lib.editRanges(x, spec, [[r[0], r[1], g.y]]);
        const ey = lib.errorOf(y, spec);
        if (ey < e && (!best || ey < best[1])) best = [y, ey];
      }
      if (!best) return false;
      [x, e] = best;
    }
    return e === 0;
  }

  function reviewStep(m, spec) {
    const g = spec.goal;
    const s = lib.suggestions(m.doc).find((x) => g.want[x.id]);
    return s ? { click: { sug: s.id, act: g.want[s.id] } } : null;
  }

  function suggestStep(m, spec) {
    const g = spec.goal;
    if (m.mode !== 'suggest') return m.menu ? { click: { mode: 'suggest' } } : { click: { mode: 'menu' } };
    if (m.menu) return { click: { mode: 'menu' } };
    const chars = lib.runChars(m.doc);
    const B = lib.runChars(spec.doc0);
    const own = (c, k) => c && c.k === k && c.a === lib.ME;
    // the rest of the document must still be the start document
    const span = g.op === 'insert' ? 0 : g.b - g.a;
    const struck = span > 0 && chars.slice(g.a, g.b).every((c) => own(c, 'd'));
    const at = g.op === 'insert' ? g.a : g.b;
    let k = 0;
    while (k < g.text.length && own(chars[at + k], 'i') && chars[at + k].ch === g.text[k]) k++;
    const rest = (x, y) => x.length - k === y.length && x.slice(0, g.a).every((c, i) => c.ch === y[i].ch && c.k === y[i].k)
      && x.slice(at + k).every((c, i) => c.ch === y[g.b + i].ch && c.k === y[g.b + i].k);
    if (!rest(chars, B)) return null;
    if (span > 0 && !struck) {
      if (chars.slice(g.a, g.b).some((c) => c.k !== 'b') || chars.slice(g.a, g.b).map((c) => c.ch).join('') !== g.word) return null;
      const c = m.cur[0];
      if (m.focus === 'editor' && one(m) && lib.lo(c) === g.a && lib.hi(c) === g.b) return g.text ? typeStep(m, g.text[0]) : { key: 'Backspace' };
      return { dblclick: { pos: g.a + 1 } };
    }
    if (k >= g.text.length) return null;
    return caretAt(m, at + k) ? typeStep(m, g.text[k]) : { click: { pos: at + k } };
  }

  // A click while the completion popup is open could land on the popup: close it first.
  function planOf(m, spec) {
    const step = planStep(m, spec);
    if (step && m.pop && m.focus === 'editor' && !step.key && !(step.click && step.click.pop !== undefined)) return { key: 'Escape' };
    return step;
  }
  function planStep(m, spec) {
    const g = spec.goal;
    const prose = lib.isProse(spec);
    const e = lib.errorOf(m, spec);
    if (prose && m.menu && g.kind !== 'suggest') return { click: { mode: 'menu' } };
    // Undo whatever went wrong first.
    if (m.hist && m.hist.length && lib.errorOf(lib.undo(m, spec), spec) < e) {
      if (prose) return { click: { undo: true } };
      return m.focus === 'editor' ? { key: 'Control+z' } : { click: { pos: m.cur[0].h } };
    }
    if (prose && g.kind !== 'suggest' && g.kind !== 'review' && m.mode !== 'edit') return m.menu ? { click: { mode: 'edit' } } : { click: { mode: 'menu' } };
    let step = null;
    if (g.kind === 'insert') step = insertStep(m, spec);
    else if (g.kind === 'lines') step = linesStep(m, spec);
    else if (g.kind === 'multi') step = multiStep(m, spec);
    else if (g.kind === 'find') {
      if (m.hist && m.hist.length && !onFindPath(m, spec) && m.hist.some((h) => onFindPath({ ...m, ...h }, spec))) {
        if (prose) return { click: { undo: true } };
        return m.focus === 'editor' ? { key: 'Control+z' } : { click: { pos: m.cur[0].h } };
      }
      step = findStep(m, spec);
    }
    else if (g.kind === 'review') {
      // the decisions still to make must reach the target; otherwise a wrong decision is in the way: undo it
      let x = m;
      for (const id of Object.keys(g.want)) x = lib.review(x, spec, id, g.want[id]);
      if (lib.errorOf(x, spec) > 0) return m.hist && m.hist.length ? { click: { undo: true } } : null;
      step = reviewStep(m, spec);
    }
    else if (g.kind === 'suggest') step = suggestStep(m, spec);
    if (step) return step;
    // Off the goal's own path: undo while an earlier state is on it.
    const own = { insert: insertStep, lines: linesStep, multi: multiStep, suggest: suggestStep }[g.kind];
    if (own && m.hist && m.hist.some((h) => { const x = { ...m, ...h }; return lib.errorOf(x, spec) === 0 || own(x, spec); })) {
      if (prose) return { click: { undo: true } };
      return m.focus === 'editor' ? { key: 'Control+z' } : { click: { pos: m.cur[0].h } };
    }
    if (prose && (g.kind === 'review' || g.kind === 'suggest' || lib.suggestions(m.doc).length)) {
      // Tracked changes have no plain-text repair: undo (toolbar) while an earlier state is better, still has a
      // wanted suggestion open, or is the start document.
      const has = (doc, id) => lib.runChars(doc).some((c) => c.id === id);
      const s0 = lib.serDoc(spec.doc0);
      const back = (m.hist || []).some((h) => lib.errorOf({ ...m, ...h }, spec) < e || lib.serDoc(h.doc) === s0
        || (g.kind === 'review' && Object.keys(g.want).some((id) => !has(m.doc, id) && has(h.doc, id))));
      return back ? { click: { undo: true } } : null;
    }
    if (prose && m.mode !== 'edit') return m.menu ? { click: { mode: 'edit' } } : { click: { mode: 'menu' } };
    return genericStep(m, spec, lib.flat(m, spec), prose ? lib.flatDoc(spec.doc1) : spec.target);
  }


  Object.assign(lib, { planOf });
})();
