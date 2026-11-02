/* use-text-editor/commands.js: Keyboard, pointer, completion, find and suggestion commands. */
(function () {
  'use strict';
  const task = env.taskOf('use-text-editor');
  const { lib } = task;

  // ---------------------------------------------------------------- code line operations

  // Lines a cursor touches (a selection ending at column 0 of a later line leaves that line out).
  function curLines(text, c) {
    const [l1] = lib.lc(text, lib.lo(c));
    let [l2, c2] = lib.lc(text, lib.hi(c));
    if (lib.hi(c) > lib.lo(c) && c2 === 0 && l2 > l1) l2 -= 1;
    return [l1, l2];
  }
  function lineGroups(m) {
    const gs = m.cur.map((c) => curLines(m.text, c)).sort((x, y) => x[0] - y[0]);
    const out = [];
    for (const g of gs) {
      const last = out[out.length - 1];
      if (last && g[0] <= last[1] + 0) last[1] = Math.max(last[1], g[1]);
      else out.push([...g]);
    }
    return out;
  }
  // Line edits -> new model with every cursor mapped through them.
  function lineEdit(m, spec, edits) {
    if (!edits.length) return m;
    const { text } = lib.applyEdits(m.text, edits);
    const cur = m.cur.map((c) => ({ h: lib.mapPos(c.h, edits), a: lib.mapPos(c.a, edits) }));
    return lib.commit(m, spec, { text }, cur);
  }
  const lineOff = (ls, l) => ls.slice(0, l).reduce((s, x) => s + x.length + 1, 0);

  function indentEdits(text, groups, unit) {
    const ls = lib.linesOf(text);
    const edits = [];
    for (const [a, b] of groups) {
      for (let l = a; l <= b; l++) if (ls[l].length || a === b) edits.push({ a: lineOff(ls, l), b: lineOff(ls, l), s: ' '.repeat(unit) });
    }
    return edits;
  }
  function outdentEdits(text, groups, unit) {
    const ls = lib.linesOf(text);
    const edits = [];
    for (const [a, b] of groups) {
      for (let l = a; l <= b; l++) {
        const n = Math.min(unit, ls[l].match(/^ */)[0].length);
        if (n) edits.push({ a: lineOff(ls, l), b: lineOff(ls, l) + n, s: '' });
      }
    }
    return edits;
  }
  // VS Code toggle line comment: blank lines are skipped; if every other line starts with the token, remove it
  // (and one space after it); otherwise insert "token " at the smallest indentation of the group.
  function commentEdits(text, groups, tok) {
    const ls = lib.linesOf(text);
    const edits = [];
    for (const [a, b] of groups) {
      const idx = [];
      for (let l = a; l <= b; l++) if (ls[l].trim()) idx.push(l);
      if (!idx.length) continue;
      const all = idx.every((l) => ls[l].slice(lib.leadWs(ls[l])).startsWith(tok));
      if (all) {
        for (const l of idx) {
          const i = lib.leadWs(ls[l]);
          const n = tok.length + (ls[l][i + tok.length] === ' ' ? 1 : 0);
          edits.push({ a: lineOff(ls, l) + i, b: lineOff(ls, l) + i + n, s: '' });
        }
      } else {
        const ind = Math.min(...idx.map((l) => lib.leadWs(ls[l])));
        for (const l of idx) edits.push({ a: lineOff(ls, l) + ind, b: lineOff(ls, l) + ind, s: `${tok} ` });
      }
    }
    return edits;
  }
  function deleteLinesModel(m, spec, groups) {
    const ls = lib.linesOf(m.text);
    const keep = ls.filter((_, l) => !groups.some(([a, b]) => l >= a && l <= b));
    const text = (keep.length ? keep : ['']).join('\n');
    const first = groups[0][0];
    const at = lib.offOf(text, Math.min(first, keep.length - 1), lib.lc(m.text, m.cur[0].h)[1]);
    return lib.commit(m, spec, { text }, [lib.caret(at)]);
  }
  // Text Tab inserts before c: spaces to the next tab stop.
  const tabText = (text, o, unit) => ' '.repeat(unit - (lib.lc(text, o)[1] % unit));
  function enterText(spec, text, o) {
    const s = lib.lineStart(text, o);
    const line = text.slice(s, lib.lineEnd(text, o));
    const col = o - s;
    let ind = line.slice(0, Math.min(lib.leadWs(line), col));
    const before = line.slice(0, col).trimEnd();
    if ((spec.lang === 'py' && before.endsWith(':')) || (spec.lang !== 'py' && /[{[(]$/.test(before))) ind += ' '.repeat(spec.unit);
    return `\n${ind}`;
  }

  // Completion popup for the word that ends at offset o (code widget with spec.suggest; one cursor only).
  function popOf(spec, text, o) {
    if (!spec.suggest) return null;
    let a = o;
    while (a > 0 && lib.isWordCh(spec, text[a - 1])) a--;
    const w = text.slice(a, o);
    if (!w || /^[0-9]/.test(w) || lib.isWordCh(spec, text[o])) return null;
    const words = new Set([...(text.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || []), ...(lib.KEYWORDS[spec.lang] || [])]);
    const lw = w.toLowerCase();
    const items = [...words].filter((x) => x !== w && x.length > w.length && x.toLowerCase().startsWith(lw))
      .sort((x, y) => (x.toLowerCase() < y.toLowerCase() ? -1 : x.toLowerCase() > y.toLowerCase() ? 1 : x < y ? -1 : x > y ? 1 : 0))
      .slice(0, 8);
    return items.length ? { a, o, items, sel: 0 } : null;
  }
  function popPick(m, spec, i) {
    if (!m.pop || !m.pop.items[i]) return m;
    const { a, o, items } = m.pop;
    const n = lib.editRanges(m, spec, [[a, o, items[i]]], 'type');
    return { ...n, pop: null, focus: 'editor' };
  }

  // ---------------------------------------------------------------- keys

  // Canonical key name: modifiers in the order Control, Alt, Shift; a printable character alone (Shift dropped);
  // letters lower case under Control / Alt; 'Space' -> ' '; Meta counts as Control.
  function canonKey(name) {
    const parts = String(name).split('+');
    let key = parts.pop();
    if (key === '' && parts.length && parts[parts.length - 1] === '') { parts.pop(); key = '+'; }
    const mods = new Set(parts.map((p) => (p === 'Meta' ? 'Control' : p)));
    if (key === 'Space' || key === 'Spacebar') key = ' ';
    const ctl = mods.has('Control') || mods.has('Alt');
    if (key.length === 1 && !ctl) return key;
    if (key.length === 1) key = key.toLowerCase();
    return [...['Control', 'Alt', 'Shift'].filter((x) => mods.has(x)), key].join('+');
  }
  const keyFromEvent = (e) => {
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return null;
    const mods = [];
    if (e.ctrlKey || e.metaKey) mods.push('Control');
    if (e.altKey) mods.push('Alt');
    if (e.shiftKey) mods.push('Shift');
    return canonKey([...mods, e.key === ' ' ? 'Space' : e.key].join('+'));
  };

  function moveCur(m, spec, fn, shift) {
    const text = lib.flat(m, spec);
    const cur = m.cur.map((c) => {
      const h = lib.clamp(fn(c, text), 0, text.length);
      return shift ? { h, a: c.a } : lib.caret(h);
    });
    return { ...m, cur: lib.normCur(cur), pop: null, op: 'move', dcol: null };
  }
  function wordLeft(spec, text, o) {
    let i = o;
    while (i > 0 && !lib.isWordCh(spec, text[i - 1]) && text[i - 1] !== '\n') i--;
    if (i === o && text[i - 1] === '\n') return i - 1;
    while (i > 0 && lib.isWordCh(spec, text[i - 1])) i--;
    return i;
  }
  function wordRight(spec, text, o) {
    let i = o;
    while (i < text.length && !lib.isWordCh(spec, text[i]) && text[i] !== '\n') i++;
    if (i === o && text[i] === '\n') return i + 1;
    while (i < text.length && lib.isWordCh(spec, text[i])) i++;
    return i;
  }
  function vertical(text, o, dl) {
    const [l, c] = lib.lc(text, o);
    const n = lib.linesOf(text).length;
    if (l + dl < 0) return 0;
    if (l + dl >= n) return text.length;
    return lib.offOf(text, l + dl, c);
  }

  function undo(m, spec) {
    if (!m.hist || !m.hist.length) return m;
    const s = m.hist[m.hist.length - 1];
    return { ...m, ...s, hist: m.hist.slice(0, -1), fut: [...(m.fut || []), lib.snap(m, spec)], pop: null, op: 'undo' };
  }
  function redo(m, spec) {
    if (!m.fut || !m.fut.length) return m;
    const s = m.fut[m.fut.length - 1];
    return { ...m, ...s, fut: m.fut.slice(0, -1), hist: [...(m.hist || []), lib.snap(m, spec)], pop: null, op: 'redo' };
  }

  // A key in the editor (the model's focus must be 'editor'). Returns { model, handled }.
  function keyDown(m, spec, name) {
    const k = canonKey(name);
    const res = (model, handled = true) => ({ model, handled });
    if (m.focus !== 'editor') return res(m, false);
    const prose = lib.isProse(spec);
    const text = lib.flat(m, spec);
    // Completion popup first: it steals Enter, Tab, arrows and Escape.
    if (!prose && m.pop) {
      if (k === 'Enter' || k === 'Tab') return res(popPick(m, spec, m.pop.sel));
      if (k === 'ArrowDown' || k === 'ArrowUp') {
        const n = m.pop.items.length;
        return res({ ...m, pop: { ...m.pop, sel: (m.pop.sel + (k === 'ArrowDown' ? 1 : n - 1)) % n } });
      }
      if (k === 'Escape') return res({ ...m, pop: null });
    }
    if (prose && m.menu && k === 'Escape') return res({ ...m, menu: false });
    const one = m.cur.length === 1;
    const ranges = (s) => m.cur.map((c) => [lib.lo(c), lib.hi(c), s]);
    const typed = (s) => {
      // Typing coalesces into one undo step; a space after a word starts a new one.
      const brk = /\s/.test(s) && !/\s/.test(text[lib.lo(m.cur[0]) - 1] || ' ');
      const n = lib.editRanges(m, spec, ranges(s), brk ? 'edit' : 'type');
      if (n === m) return n;
      const pop = !prose && one && s.length === 1 && lib.isWordCh(spec, s) ? popOf(spec, n.text, n.cur[0].h) : null;
      return { ...n, pop, op: 'type' };
    };
    if (k.length === 1) return res(prose && m.mode === 'view' ? m : typed(k));
    switch (k) {
      case 'Enter': case 'Shift+Enter':
        if (prose) return res(lib.editRanges(m, spec, ranges('\n')));
        return res(lib.editRanges(m, spec, m.cur.map((c) => [lib.lo(c), lib.hi(c), enterText(spec, m.text, lib.lo(c))])));
      case 'Backspace': case 'Delete': {
        const back = k === 'Backspace';
        const rs = [];
        for (const c of m.cur) {
          if (!lib.collapsed(c)) { rs.push([lib.lo(c), lib.hi(c), '']); continue; }
          if (prose && m.mode === 'suggest') {
            const chars = lib.runChars(m.doc);
            let j = back ? c.h - 1 : c.h;
            while (j >= 0 && j < chars.length && chars[j].k === 'd') j += back ? -1 : 1;
            if (j < 0 || j >= chars.length || chars[j].k === 'n') continue;
            rs.push([j, j + 1, '']);
          } else if (back) {
            if (c.h === 0) continue;
            const s = lib.lineStart(text, c.h);
            const before = text.slice(s, c.h);
            const n = !prose && before.length && /^ +$/.test(before) ? ((before.length - 1) % spec.unit) + 1 : 1;
            rs.push([c.h - n, c.h, '']);
          } else if (c.h < text.length) rs.push([c.h, c.h + 1, '']);
        }
        if (!rs.length) return res(m);
        if (prose && m.mode === 'view') return res(m);
        return res(lib.editRanges(m, spec, rs, 'edit', { back }));
      }
      case 'Tab': case 'Shift+Tab': case 'Control+]': case 'Control+[': {
        if (prose) return res(m);
        const out = k === 'Shift+Tab' || k === 'Control+[';
        const lineMode = k !== 'Tab' || m.cur.some((c) => {
          if (lib.collapsed(c)) return false;
          const [l1, l2] = curLines(m.text, c);
          if (l1 !== l2) return true;
          const s = lib.lineStart(m.text, lib.lo(c));
          return lib.lo(c) <= s + lib.leadWs(m.text.slice(s, lib.lineEnd(m.text, s))) && lib.hi(c) === lib.lineEnd(m.text, s);
        });
        if (out) return res(lineEdit(m, spec, outdentEdits(m.text, lineGroups(m), spec.unit)));
        if (lineMode) return res(lineEdit(m, spec, indentEdits(m.text, lineGroups(m), spec.unit)));
        return res(lib.editRanges(m, spec, m.cur.map((c) => [lib.lo(c), lib.hi(c), tabText(m.text, lib.lo(c), spec.unit)])));
      }
      case 'Control+/':
        if (prose) return res(m);
        return res(lineEdit(m, spec, commentEdits(m.text, lineGroups(m), spec.tok)));
      case 'Control+Shift+k':
        if (prose) return res(m);
        return res(deleteLinesModel(m, spec, lineGroups(m)));
      case 'Control+Alt+ArrowDown': case 'Control+Alt+ArrowUp': {
        if (prose) return res(m);
        const down = k.endsWith('Down');
        const ls = lib.linesOf(m.text);
        const heads = m.cur.map((c) => lib.lc(m.text, c.h));
        const edge = down ? Math.max(...heads.map((x) => x[0])) : Math.min(...heads.map((x) => x[0]));
        const dcol = m.dcol ?? lib.lc(m.text, m.cur[0].h)[1];
        const l = edge + (down ? 1 : -1);
        if (l < 0 || l >= ls.length) return res(m);
        return res({ ...m, cur: lib.normCur([...m.cur, lib.caret(lib.offOf(m.text, l, Math.min(dcol, ls[l].length)))]), dcol, pop: null, op: 'move' });
      }
      case 'Escape':
        if (m.cur.length > 1) return res({ ...m, cur: [m.cur[0]], dcol: null });
        if (m.find && m.find.open) return res({ ...m, find: { ...m.find, open: false } });
        if (!lib.collapsed(m.cur[0])) return res({ ...m, cur: [lib.caret(m.cur[0].h)] });
        return res(m, false);
      case 'Control+f': case 'Control+h':
        return res(findOp(m, spec, 'open', k === 'Control+h'));
      case 'Control+a':
        return res({ ...m, cur: [{ h: text.length, a: 0 }], pop: null, op: 'move' });
      case 'Control+z': return res(undo(m, spec));
      case 'Control+y': case 'Control+Shift+z': return res(redo(m, spec));
      case 'Control+c': case 'Control+x': {
        const c = m.cur[0];
        let a = lib.lo(c);
        let b = lib.hi(c);
        if (a === b && !prose) { a = lib.lineStart(text, a); b = Math.min(text.length, lib.lineEnd(text, a) + 1); }
        const clip = text.slice(a, b);
        if (k === 'Control+c' || a === b) return res({ ...m, clip });
        return res({ ...lib.editRanges(m, spec, [[a, b, '']]), clip });
      }
      case 'Control+v':
        if (m.clip === null || m.clip === undefined) return res(m);
        return res(lib.editRanges(m, spec, ranges(m.clip)));
      case 'ArrowLeft': case 'Shift+ArrowLeft':
        return res(moveCur(m, spec, (c) => (k === 'ArrowLeft' && !lib.collapsed(c) ? lib.lo(c) : c.h - 1), k.startsWith('Shift')));
      case 'ArrowRight': case 'Shift+ArrowRight':
        return res(moveCur(m, spec, (c) => (k === 'ArrowRight' && !lib.collapsed(c) ? lib.hi(c) : c.h + 1), k.startsWith('Shift')));
      case 'ArrowUp': case 'Shift+ArrowUp': case 'ArrowDown': case 'Shift+ArrowDown':
        return res(moveCur(m, spec, (c, t) => vertical(t, c.h, k.endsWith('Up') ? -1 : 1), k.startsWith('Shift')));
      case 'Home': case 'Shift+Home':
        return res(moveCur(m, spec, (c, t) => {
          const s = lib.lineStart(t, c.h);
          const first = s + lib.leadWs(t.slice(s, lib.lineEnd(t, s)));
          return prose ? s : c.h === first ? s : first;
        }, k.startsWith('Shift')));
      case 'End': case 'Shift+End':
        return res(moveCur(m, spec, (c, t) => lib.lineEnd(t, c.h), k.startsWith('Shift')));
      case 'Control+Home': case 'Control+Shift+Home':
        return res(moveCur(m, spec, () => 0, k.includes('Shift')));
      case 'Control+End': case 'Control+Shift+End':
        return res(moveCur(m, spec, (c, t) => t.length, k.includes('Shift')));
      case 'Control+ArrowLeft': case 'Control+Shift+ArrowLeft':
        return res(moveCur(m, spec, (c, t) => wordLeft(spec, t, c.h), k.includes('Shift')));
      case 'Control+ArrowRight': case 'Control+Shift+ArrowRight':
        return res(moveCur(m, spec, (c, t) => wordRight(spec, t, c.h), k.includes('Shift')));
      default:
        return res(m, false);
    }
  }

  // ---------------------------------------------------------------- pointer

  // Press in the text at flat offset o: count 1 caret (shift extends the primary selection, alt adds a cursor),
  // 2 selects the word, 3 the line / paragraph.
  function pointerDown(m, spec, o, { shift = false, alt = false, count = 1 } = {}) {
    const text = lib.flat(m, spec);
    o = lib.clamp(o, 0, text.length);
    const base = { ...m, focus: 'editor', pop: null, menu: lib.isProse(spec) ? false : undefined, op: 'move', dcol: null };
    if (!lib.isProse(spec)) delete base.menu;
    if (count >= 3) {
      const s = lib.lineStart(text, o);
      return { ...base, cur: [{ a: s, h: Math.min(text.length, lib.lineEnd(text, o) + (lib.isProse(spec) ? 0 : 1)) }] };
    }
    if (count === 2) {
      const [a, b] = lib.wordAt(spec, text, o);
      return { ...base, cur: [{ a, h: b }] };
    }
    if (alt && !lib.isProse(spec)) {
      const hit = m.cur.findIndex((c) => lib.collapsed(c) && c.h === o);
      if (hit >= 0 && m.cur.length > 1) return { ...base, cur: m.cur.filter((_, i) => i !== hit) };
      return { ...base, cur: lib.normCur([...m.cur, lib.caret(o)]) };
    }
    if (shift) return { ...base, cur: [{ a: m.cur[0].a, h: o }] };
    return { ...base, cur: [lib.caret(o)] };
  }
  const pointerDrag = (m, spec, a, h) => {
    const text = lib.flat(m, spec);
    return { ...m, focus: 'editor', pop: null, op: 'move', cur: [{ a: lib.clamp(a, 0, text.length), h: lib.clamp(h, 0, text.length) }] };
  };
  const focusTo = (m, where) => (m.focus === where ? m : { ...m, focus: where, pop: null });

  // ---------------------------------------------------------------- find widget

  function matches(m, spec) {
    const f = m.find;
    if (!f || !f.open || !f.query) return [];
    return lib.occurrences(spec, lib.flat(m, spec), f.query, { mc: !!f.mc, ww: !!f.ww });
  }
  // The current match: the first match starting at or after pos (wrapping), or null.
  function currentMatch(m, spec) {
    const ms = matches(m, spec);
    if (!ms.length) return null;
    const p = m.find.pos ?? 0;
    return ms.find((x) => x[0] >= p) || ms[0];
  }
  function findOp(m, spec, op, arg) {
    const f = m.find || { open: false, rep: false, query: '', repl: '', mc: false, ww: false, pos: 0 };
    const text = lib.flat(m, spec);
    const from = lib.lo(m.cur[0]);
    const set = (patch, extra = {}) => ({ ...m, ...extra, find: { ...f, ...patch } });
    switch (op) {
      case 'open': {
        const c = m.cur[0];
        const sel = text.slice(lib.lo(c), lib.hi(c));
        const query = sel && !sel.includes('\n') ? sel : f.query;
        return set({ open: true, rep: !!arg || (f.open && f.rep), query, pos: from }, { focus: 'query', pop: null });
      }
      case 'expand': return set({ open: true, rep: !f.rep });
      case 'close': return set({ open: false }, { focus: 'editor' });
      case 'query': return set({ query: String(arg), pos: from }, { focus: 'query' });
      case 'repl': return set({ repl: String(arg) }, { focus: 'repl' });
      case 'case': return set({ mc: !f.mc });
      case 'word': return set({ ww: !f.ww });
      case 'next': case 'prev': {
        const ms = matches({ ...m, find: f }, spec);
        if (!ms.length) return m;
        const cm = currentMatch({ ...m, find: f }, spec);
        const i = Math.max(0, ms.findIndex((x) => x[0] === cm[0]));
        // The first press selects the current match; later presses move on.
        const selected = cm && lib.lo(m.cur[0]) === cm[0] && lib.hi(m.cur[0]) === cm[1];
        const j = !selected ? i : (i + (op === 'next' ? 1 : ms.length - 1)) % ms.length;
        return { ...m, find: { ...f, pos: ms[j][0] }, cur: [{ a: ms[j][0], h: ms[j][1] }], pop: null };
      }
      case 'one': {
        const cm = currentMatch({ ...m, find: f }, spec);
        if (!cm) return m;
        const n = lib.editRanges({ ...m, find: f }, spec, [[cm[0], cm[1], f.repl]]);
        const p = cm[0] + f.repl.length;
        const after = { ...n, find: { ...f, pos: p } };
        const nm = matches(after, spec);
        const next = nm.find((x) => x[0] >= p) || nm[0];
        return { ...after, find: { ...f, pos: next ? next[0] : p }, cur: next ? [{ a: next[0], h: next[1] }] : after.cur };
      }
      case 'all': {
        const ms = matches({ ...m, find: f }, spec);
        if (!ms.length) return m;
        const n = lib.editRanges({ ...m, find: f }, spec, ms.map(([a, b]) => [a, b, f.repl]));
        return { ...n, find: { ...f } };
      }
      default: return m;
    }
  }

  // ---------------------------------------------------------------- prose review and modes

  function review(m, spec, id, act) {
    const chars = lib.runChars(m.doc);
    if (!chars.some((c) => c.id === id)) return m;
    const out = [];
    for (const c of chars) {
      if (c.id !== id) { out.push(c); continue; }
      const keep = act === 'accept' ? c.k === 'i' : c.k === 'd';
      if (keep) out.push({ ch: c.ch, k: 'b' });
    }
    const text = lib.flatDoc(m.doc);
    const n = lib.commit(m, spec, { doc: lib.implode(out) }, m.cur.map((c) => lib.caret(Math.min(c.h, out.length))));
    void text;
    return { ...n, menu: false };
  }
  const setMode = (m, spec, mode) => ({ ...m, mode, menu: false });
  const toggleMenu = (m) => ({ ...m, menu: !m.menu });

  // ---------------------------------------------------------------- plan steps on the model (oracle simulator)

  // Applies one plan step to the model the way the widget would (used by selfTest and the retarget / silent checks).
  function act(m, spec, step) {
    const t = step.click || step.dblclick || step.tripleclick;
    const mods = step.modifiers || [];
    if (t && t.pos !== undefined) {
      return pointerDown(m, spec, t.pos, { shift: mods.includes('Shift'), alt: mods.includes('Alt'), count: step.dblclick ? 2 : step.tripleclick ? 3 : 1 });
    }
    if (step.drag) return pointerDrag(m, spec, step.drag[0].pos, step.drag[1].pos);
    if (step.key) {
      const k = canonKey(step.key);
      if (m.focus === 'query' || m.focus === 'repl') {
        if (k === 'Enter') return findOp(m, spec, 'next');
        if (k === 'Escape') return findOp(m, spec, 'close');
        return m;
      }
      return keyDown(m, spec, step.key).model;
    }
    if (step.type) {
      const f = step.type[0].find;
      if (f === 'query' || f === 'repl') return findOp(m, spec, f, step.type[1]);
      throw new Error(`cannot type into ${JSON.stringify(step.type[0])}`);
    }
    if (t && t.find) {
      if (t.find === 'query' || t.find === 'repl') return focusTo(m, t.find);
      return findOp(m, spec, t.find, t.find === 'open' ? true : undefined);
    }
    if (t && t.pop !== undefined) return popPick(m, spec, t.pop);
    if (t && t.sug) return review(m, spec, t.sug, t.act);
    if (t && t.mode) return t.mode === 'menu' ? toggleMenu(m) : setMode(m, spec, t.mode);
    if (t && t.undo) return undo(m, spec);
    throw new Error(`cannot simulate ${JSON.stringify(step)}`);
  }

  Object.assign(lib, { act, canonKey, curLines, indentEdits, outdentEdits, commentEdits, undo, matches, currentMatch, findOp, review });
  Object.assign(task.helpers, { keyDown, pointerDown, pointerDrag, findOp, popPick, review, setMode, toggleMenu, undo, redo, focusTo, matches, currentMatch, keyFromEvent });
})();
