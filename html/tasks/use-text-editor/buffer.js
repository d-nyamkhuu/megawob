/* use-text-editor/buffer.js: Text geometry, distances, buffers and editing transactions. */
(function () {
  'use strict';
  const task = env.taskOf('use-text-editor');
  const { lib } = task;

  const { clamp, cap } = env.util;

  const C = env.content;
  const I = env.instruct;
  const U = env.util;

  const ME = 'You';
  const HIST = 40;
  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];

  // ---------------------------------------------------------------- distance

  // Levenshtein distance after stripping the common prefix and suffix (UTF-16 units; the buffers are ASCII
  // plus the ⟨ ⟩ marks).
  // megawob-lint: allow util-copy string edit distance, not a point distance
  function dist(a, b) {
    if (a === b) return 0;
    let p = 0;
    const n = Math.min(a.length, b.length);
    while (p < n && a.charCodeAt(p) === b.charCodeAt(p)) p++;
    let s = 0;
    while (s < n - p && a.charCodeAt(a.length - 1 - s) === b.charCodeAt(b.length - 1 - s)) s++;
    const x = a.slice(p, a.length - s);
    const y = b.slice(p, b.length - s);
    if (!x.length) return y.length;
    if (!y.length) return x.length;
    let prev = new Int32Array(y.length + 1);
    let cur = new Int32Array(y.length + 1);
    for (let j = 0; j <= y.length; j++) prev[j] = j;
    for (let i = 1; i <= x.length; i++) {
      cur[0] = i;
      const xc = x.charCodeAt(i - 1);
      for (let j = 1; j <= y.length; j++) {
        const sub = prev[j - 1] + (xc === y.charCodeAt(j - 1) ? 0 : 1);
        const del = prev[j] + 1;
        const ins = cur[j - 1] + 1;
        cur[j] = sub < del ? (sub < ins ? sub : ins) : (del < ins ? del : ins);
      }
      [prev, cur] = [cur, prev];
    }
    return prev[y.length];
  }

  // The first hunk of an optimal alignment of a -> b: replace a[from, to) with ins. null when equal.
  function firstHunk(a, b) {
    if (a === b) return null;
    let p = 0;
    const n = Math.min(a.length, b.length);
    while (p < n && a[p] === b[p]) p++;
    let s = 0;
    while (s < n - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
    const x = a.slice(p, a.length - s);
    const y = b.slice(p, b.length - s);
    if (!x.length || !y.length || x.length * y.length > 360000) return { from: p, to: p + x.length, ins: y };
    // Full DP, then walk forward from the start along an optimal path, collecting the first run of edits.
    const W = y.length + 1;
    const D = new Int32Array((x.length + 1) * W);
    for (let i = x.length; i >= 0; i--) {
      for (let j = y.length; j >= 0; j--) {
        const k = i * W + j;
        if (i === x.length) D[k] = y.length - j;
        else if (j === y.length) D[k] = x.length - i;
        else {
          const sub = D[(i + 1) * W + j + 1] + (x[i] === y[j] ? 0 : 1);
          D[k] = Math.min(sub, D[(i + 1) * W + j] + 1, D[i * W + j + 1] + 1);
        }
      }
    }
    let i = 0;
    let j = 0;
    let from = -1;
    let ins = '';
    let to = -1;
    while (i < x.length || j < y.length) {
      const k = i * W + j;
      const match = i < x.length && j < y.length && x[i] === y[j] && D[k] === D[(i + 1) * W + j + 1];
      if (match) {
        if (from >= 0) break;
        i++;
        j++;
        continue;
      }
      if (from < 0) from = i;
      if (i < x.length && j < y.length && D[k] === D[(i + 1) * W + j + 1] + 1) { ins += y[j]; i++; j++; }
      else if (j < y.length && D[k] === D[i * W + j + 1] + 1) { ins += y[j]; j++; }
      else { i++; }
      to = i;
    }
    if (from < 0) return null;
    return { from: p + from, to: p + Math.max(from, to), ins };
  }

  // ---------------------------------------------------------------- text geometry

  function lc(text, o) {
    let l = 0;
    let s = 0;
    const e = Math.min(o, text.length);
    for (let i = 0; i < e; i++) if (text.charCodeAt(i) === 10) { l++; s = i + 1; }
    return [l, o - s];
  }
  const linesOf = (text) => text.split('\n');
  function offOf(text, l, c) {
    const ls = linesOf(text);
    const L = clamp(l, 0, ls.length - 1);
    let o = 0;
    for (let i = 0; i < L; i++) o += ls[i].length + 1;
    return o + clamp(c, 0, ls[L].length);
  }
  const lineStart = (text, o) => text.lastIndexOf('\n', o - 1) + 1;
  function lineEnd(text, o) {
    const e = text.indexOf('\n', o);
    return e < 0 ? text.length : e;
  }
  const leadWs = (s) => s.match(/^[ \t]*/)[0].length;

  const lo = (c) => Math.min(c.h, c.a);
  const hi = (c) => Math.max(c.h, c.a);
  const caret = (o) => ({ h: o, a: o });
  const collapsed = (c) => c.h === c.a;

  // Keep creation order; drop a cursor that overlaps an earlier one.
  function normCur(cur) {
    const out = [];
    for (const c of cur) {
      if (out.some((d) => (lo(c) === lo(d) && hi(c) === hi(d)) || (lo(c) < hi(d) && lo(d) < hi(c)))) continue;
      out.push(c);
    }
    return out.length ? out : [caret(0)];
  }

  // Apply non-overlapping edits [{ a, b, s, h?, an? }] (h / an: head / anchor offsets inside s, default s.length)
  // to text. Returns { text, pos: [{ h, a } | null per edit] } (null = dropped as overlapping).
  function applyEdits(text, edits) {
    const order = edits.map((e, k) => ({ ...e, k })).sort((x, y) => x.a - y.a || x.b - y.b || x.k - y.k);
    let out = '';
    let last = 0;
    let delta = 0;
    const pos = [];
    for (const e of order) {
      if (e.a < last) { pos[e.k] = null; continue; }
      out += text.slice(last, e.a) + e.s;
      const base = e.a + delta;
      const h = e.h ?? e.s.length;
      pos[e.k] = { h: base + h, a: base + (e.an ?? h) };
      delta += e.s.length - (e.b - e.a);
      last = e.b;
    }
    out += text.slice(last);
    return { text: out, pos };
  }

  // Where offset p goes after edits (sorted, non-overlapping). Insertions at p push p right.
  function mapPos(p, edits) {
    let d = 0;
    for (const e of [...edits].sort((x, y) => x.a - y.a)) {
      if (p < e.a) break;
      if (p >= e.b && (e.b > e.a || p >= e.a)) { d += e.s.length - (e.b - e.a); continue; }
      return e.a + d;
    }
    return p + d;
  }

  // ---------------------------------------------------------------- language

  const KEYWORDS = {
    js: ['async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'delete', 'else',
      'export', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null',
      'of', 'return', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'undefined', 'var', 'void', 'while',
      'yield'],
    py: ['and', 'as', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
      'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'not', 'or',
      'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield'],
  };
  const isWordCh = (spec, ch) => !!ch && (spec.doc === 'prose' ? /[\p{L}\p{N}'’]/u.test(ch) : /[A-Za-z0-9_$]/.test(ch));
  function wordAt(spec, text, o) {
    let a = o;
    let b = o;
    if (!isWordCh(spec, text[o]) && isWordCh(spec, text[o - 1])) { a = o - 1; b = o; }
    while (a > 0 && isWordCh(spec, text[a - 1])) a--;
    while (b < text.length && isWordCh(spec, text[b])) b++;
    if (b === a && o < text.length && text[o] !== '\n') b = o + 1;
    return [a, b];
  }
  // Whole-word occurrences of w in text (identifier boundaries for code, letters for prose).
  function occurrences(spec, text, w, { mc = true, ww = true } = {}) {
    if (!w) return [];
    const out = [];
    const T = mc ? text : text.toLowerCase();
    const W = mc ? w : w.toLowerCase();
    for (let i = T.indexOf(W); i >= 0; i = T.indexOf(W, i + Math.max(1, W.length))) {
      if (ww && (isWordCh(spec, text[i - 1]) || isWordCh(spec, text[i + W.length]))) {
        i = i + 1 - Math.max(1, W.length);
        continue;
      }
      out.push([i, i + W.length]);
    }
    return out;
  }

  // ---------------------------------------------------------------- prose runs

  const runChars = (doc) => {
    const out = [];
    doc.forEach((para, p) => {
      if (p) out.push({ ch: '\n', k: 'n' });
      for (const r of para) for (const ch of r.t) out.push(r.k === 'b' ? { ch, k: 'b' } : { ch, k: r.k, a: r.a, id: r.id });
    });
    return out;
  };
  function implode(chars) {
    const doc = [[]];
    for (const c of chars) {
      if (c.k === 'n') { doc.push([]); continue; }
      const para = doc[doc.length - 1];
      const last = para[para.length - 1];
      if (last && last.k === c.k && last.a === c.a && last.id === c.id) last.t += c.ch;
      else para.push(c.k === 'b' ? { t: c.ch, k: 'b' } : { t: c.ch, k: c.k, a: c.a, id: c.id });
    }
    return doc;
  }
  const flatDoc = (doc) => doc.map((p) => p.map((r) => r.t).join('')).join('\n');
  function serDoc(doc) {
    return doc.map((p) => {
      let out = '';
      let k = 'b';
      for (const r of p) {
        if (r.k !== k) {
          if (k !== 'b') out += '⟩';
          if (r.k !== 'b') out += r.k === 'i' ? '⟨+' : '⟨-';
          k = r.k;
        }
        out += r.t;
      }
      if (k !== 'b') out += '⟩';
      return out;
    }).join('\n');
  }
  const visibleText = (doc) => doc.map((p) => p.filter((r) => r.k !== 'd').map((r) => r.t).join('')).join('\n');
  const wordCount = (doc) => (visibleText(doc).match(/[\p{L}\p{N}][\p{L}\p{N}'’.,-]*/gu) || []).length;
  // Open suggestions in document order: { id, author, ins, del, p, o (flat offset of the first char) }.
  function suggestions(doc) {
    const map = new Map();
    let o = 0;
    doc.forEach((para, p) => {
      if (p) o += 1;
      for (const r of para) {
        if (r.k !== 'b') {
          if (!map.has(r.id)) map.set(r.id, { id: r.id, author: r.a, ins: '', del: '', p, o });
          const s = map.get(r.id);
          if (r.k === 'i') s.ins += r.t;
          else s.del += r.t;
        }
        o += r.t.length;
      }
    });
    return [...map.values()];
  }

  // ---------------------------------------------------------------- model basics

  const isProse = (spec) => spec.doc === 'prose';
  const flat = (m, spec) => (isProse(spec) ? flatDoc(m.doc) : m.text);
  const snap = (m, spec) => (isProse(spec) ? { doc: m.doc, cur: m.cur } : { text: m.text, cur: m.cur });

  function codeModel(spec, text) {
    return { text, cur: [caret(0)], focus: null, pop: null, find: null, hist: [], fut: [], clip: null, op: null, dcol: null };
  }
  function proseModel(spec, doc) {
    return { doc: U.clone(doc), cur: [caret(0)], focus: null, mode: 'edit', menu: false, find: null, hist: [], fut: [],
      seq: 0, clip: null, op: null };
  }

  // Replace the buffer content and cursors, recording undo history (kind 'type' coalesces with a previous 'type').
  function commit(m, spec, content, cur, kind = 'edit') {
    const n = { ...m, ...content, cur: normCur(cur), fut: [], pop: null };
    if (!(kind === 'type' && m.op === 'type')) n.hist = [...(m.hist || []), snap(m, spec)].slice(-HIST);
    n.op = kind;
    return n;
  }

  // Edit flat ranges [[a, b, s]] in one undo step; cursors collapse after each edit (or follow opts.cur).
  function editRanges(m, spec, ranges, kind = 'edit', opts = {}) {
    if (!ranges.length) return m;
    if (isProse(spec)) {
      if (m.mode === 'view') return m;
      // Edit from the last range to the first, so each range's offsets are still valid; the caret ends after the
      // first (lowest) range, which no later edit moved.
      let chars = runChars(m.doc);
      let seq = m.seq || 0;
      let at = 0;
      for (const r of ranges.slice().sort((x, y) => y[0] - x[0])) {
        const res = proseEdit(chars, m.mode, r[0], r[1], r[2], seq, opts.back);
        chars = res.chars;
        seq = res.seq;
        at = res.caret;
      }
      return commit(m, spec, { doc: implode(chars), seq }, opts.cur || [caret(at)], kind);
    }
    const { text, pos } = applyEdits(m.text, ranges.map(([a, b, s]) => ({ a, b, s })));
    const cur = opts.cur || pos.filter(Boolean);
    return commit(m, spec, { text }, cur, kind);
  }

  // One prose edit on the char array: replace [a, b) with s under the mode (edit: plain; suggest: tracked).
  // back: a pure deletion leaves the caret before the struck text (Backspace) instead of after it.
  function proseEdit(chars0, mode, a, b, s, seq, back) {
    const chars = chars0.slice();
    const mk = (ch, k, au, id) => (ch === '\n' ? { ch, k: 'n' } : k === 'b' ? { ch, k } : { ch, k, a: au, id });
    if (mode !== 'suggest') {
      const L = chars[a - 1];
      const R = chars[b];
      const inside = L && R && L.k === 'i' && R.k === 'i' && L.id === R.id;
      const ins = [...s].map((ch) => (inside ? mk(ch, 'i', L.a, L.id) : mk(ch, 'b')));
      chars.splice(a, b - a, ...ins);
      return { chars, caret: a + ins.length, seq };
    }
    let pos = a;
    let delId = null;
    if (b > a) {
      const near = [chars[a - 1], chars[b]].find((c) => c && c.k === 'd' && c.a === ME);
      delId = near ? near.id : `s${++seq}`;
      const keep = [];
      for (let i = a; i < b; i++) {
        const c = chars[i];
        if (c.k === 'i') continue; // an insertion struck in suggesting mode just goes away
        keep.push(c.k === 'b' ? { ch: c.ch, k: 'd', a: ME, id: delId } : c);
      }
      chars.splice(a, b - a, ...keep);
      pos = a + keep.length;
    }
    if (s) {
      const L = chars[pos - 1];
      const R = chars[pos];
      const own = (c, k) => c && c.k === k && c.a === ME;
      const id = own(L, 'i') ? L.id : delId || (own(L, 'd') ? L.id : own(R, 'i') ? R.id : `s${++seq}`);
      const ins = [...s].map((ch) => mk(ch, 'i', ME, id));
      chars.splice(pos, 0, ...ins);
      pos += ins.length;
      return { chars, caret: pos, seq };
    }
    return { chars, caret: back ? a : pos, seq };
  }


  Object.assign(lib, { clamp, cap, C, I, U, ME, ORD, dist, firstHunk, lc, linesOf, offOf, lineStart, lineEnd, leadWs, lo, hi, caret, collapsed, normCur, applyEdits, mapPos, KEYWORDS, isWordCh, wordAt, occurrences, runChars, implode, flatDoc, serDoc, wordCount, suggestions, isProse, flat, snap, codeModel, proseModel, commit, editRanges });
  Object.assign(task.helpers, { lc, offOf, lines: linesOf, suggestions, wordCount, KEYWORDS, lo, hi });
})();
