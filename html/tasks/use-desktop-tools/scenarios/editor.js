/*
 * use-desktop-tools / editor: format text in a rich-text editor (style, size, align, list, revert).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { C, LV, say, tpl } = fam.lib;
  const { cap, quote: q, sameJson } = env.util;

  const HUES = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  const TARGET_HUES = ['red', 'orange', 'green', 'blue', 'purple'];
  const SWATCHES = {
    'red.0': '#e03131', 'red.1': '#a61e1e', 'orange.0': '#f08c00', 'orange.1': '#b35900',
    'yellow.0': '#e8c200', 'yellow.1': '#9c8000', 'green.0': '#2f9e44', 'green.1': '#1b6b2c',
    'blue.0': '#1c7ed6', 'blue.1': '#174ea6', 'purple.0': '#8f3fe0', 'purple.1': '#5f2699',
  };
  const SIZES = ['small', 'normal', 'large', 'huge'];
  const SIZE_LABEL = { small: 'Small', normal: 'Normal', large: 'Large', huge: 'Huge' };
  const ALIGNS = ['left', 'center', 'right', 'justify'];
  const hueOf = (c) => (c ? c.split('.')[0] : null);
  const isGap = (ch) => /\s/.test(ch);

  const PLAIN = { b: 0, i: 0, u: 0, c: null, s: null };
  function expand(runs, n) {
    const out = [];
    for (const r of runs) for (let k = 0; k < r.n; k++) out.push({ b: r.b, i: r.i, u: r.u, c: r.c, s: r.s ?? null });
    while (out.length < n) out.push({ ...PLAIN });
    return out.slice(0, n);
  }
  function compress(styles) {
    const runs = [];
    for (const s of styles) {
      const last = runs[runs.length - 1];
      const sv = s.s ?? null;
      if (last && last.b === s.b && last.i === s.i && last.u === s.u && last.c === s.c && last.s === sv) last.n++;
      else runs.push({ n: 1, b: s.b, i: s.i, u: s.u, c: s.c, s: sv });
    }
    return runs;
  }

  // Paragraph p spans [start, end) of doc (the '\n' separators belong to no paragraph).
  function paraBounds(doc) {
    const out = [];
    let s = 0;
    for (let i = 0; i <= doc.length; i++) {
      if (i === doc.length || doc[i] === '\n') {
        out.push([s, i]);
        s = i + 1;
      }
    }
    return out;
  }
  const paraOf = (spec, i) => {
    const B = spec.bounds;
    for (let p = 0; p < B.length; p++) if (i <= B[p][1]) return p;
    return B.length - 1;
  };
  function touched(spec, sel) {
    const a = paraOf(spec, sel.start);
    const b = sel.end > sel.start ? paraOf(spec, sel.end - 1) : a;
    const out = [];
    for (let p = a; p <= b; p++) out.push(p);
    return out;
  }

  const WORD_RE = /[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]/g;
  function wordsOf(doc) {
    const out = [];
    let m;
    WORD_RE.lastIndex = 0;
    while ((m = WORD_RE.exec(doc))) out.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
    return out;
  }
  const countCI = (doc, s) => {
    const d = doc.toLowerCase();
    const t = s.toLowerCase();
    let n = 0;
    for (let i = d.indexOf(t); i >= 0; i = d.indexOf(t, i + 1)) n++;
    return n;
  };
  function sentencesOf(doc) {
    const out = [];
    const re = /[^.!?\n]+[.!?]+(?=\s|$)|[^.!?\n]+$/gm;
    let m;
    while ((m = re.exec(doc))) {
      const lead = m[0].length - m[0].trimStart().length;
      out.push({ start: m.index + lead, end: m.index + m[0].trimEnd().length });
    }
    // Real sentence boundaries only (decimals like "$42.18" split the regex's matches).
    const startOk = (i) => i === 0 || doc[i - 1] === '\n' || (doc[i - 1] === ' ' && /[.!?]/.test(doc[i - 2] || ''));
    const endOk = (i) => i === doc.length || /[\s]/.test(doc[i]);
    return out.filter((s) => s.end - s.start > 8 && startOk(s.start) && endOk(s.end) && /[.!?]$/.test(doc.slice(s.start, s.end)));
  }

  function snapOf(m) {
    return { runs: m.runs, pf: m.pf };
  }
  function applyOp(snap, op, spec) {
    const st = expand(snap.runs, spec.doc.length);
    const pf = snap.pf.map((x) => ({ ...x }));
    if (op.kind === 'para') {
      for (const p of op.paras) pf[p][op.attr] = op.value;
    } else {
      for (let i = op.start; i < op.end; i++) {
        if (spec.doc[i] === '\n') continue;
        st[i][op.attr] = op.value;
      }
    }
    return { runs: compress(st), pf };
  }

  const ORD = ['first', 'second', 'third', 'fourth', 'fifth'];
  const STYLE_WORDS = {
    b: ['bold', 'boldface', 'bold'], i: ['italic', 'italics', 'italicized'], u: ['underlined', 'underlined', 'underline'],
  };

  function sampleParas(rng, crng, opts, task) {
    const groups = Object.keys(C.SENTENCE_GROUPS);
    const g = rng.pick(groups);
    const pool = C.sample(crng, C.SENTENCE_GROUPS[g], 30, { csplit: opts.csplit }).filter((s) => s.length <= 150 && !s.includes('\n'));
    const nP = task === 'list' ? rng.int(3, 4) : opts.level === 'easy' ? 2 : rng.int(2, opts.ood ? 4 : 3);
    const paras = [];
    let k = 0;
    for (let p = 0; p < nP && k < pool.length; p++) {
      const n = task === 'list' || pool[k].length > 90 ? 1 : rng.int(1, 2);
      paras.push(pool.slice(k, k + n).join(' '));
      k += n;
    }
    return paras;
  }

  function charDiff(a, b, spec) {
    const A = expand(a.runs, spec.doc.length);
    const B = expand(b.runs, spec.doc.length);
    let n = 0;
    for (let i = 0; i < spec.doc.length; i++) {
      if (isGap(spec.doc[i])) continue;
      const x = A[i];
      const y = B[i];
      if (!!x.b !== !!y.b || !!x.i !== !!y.i || !!x.u !== !!y.u || hueOf(x.c) !== hueOf(y.c) || (x.s || null) !== (y.s || null)) n++;
    }
    return n;
  }
  function paraDiff(a, b) {
    let n = 0;
    for (let p = 0; p < a.pf.length; p++) n += (a.pf[p].a !== b.pf[p].a ? 1 : 0) + (a.pf[p].l !== b.pf[p].l ? 1 : 0);
    return n;
  }

  // Trait tools: the toolbar buttons the design has (names as in the plan targets); goals are limited to what they
  // can do. Returns the list, or null when the trait is absent or leaves too little to sample from.
  function toolsOf(opts) {
    const t = opts.traits && opts.traits.tools;
    return Array.isArray(t) && ['bold', 'italic', 'underline', 'color'].some((x) => t.includes(x)) ? t : null;
  }
  const hasTool = (spec, ...names) => !spec.tools || names.every((n) => spec.tools.includes(n));
  function taskAllowed(T, task) {
    const any = (...n) => n.some((x) => T.includes(x));
    if (task === 'style') return any('bold', 'italic', 'underline', 'color');
    if (task === 'size') return any('size');
    if (task === 'align') return any('align-center', 'align-right', 'align-justify') && any('undo', 'align-left');
    if (task === 'list') return any('bullet', 'number');
    return any('undo');
  }

  function sampleEditor(rng, opts) {
    const crng = rng.fork('content');
    const T = toolsOf(opts);
    const tasks = opts.level === 'easy' ? ['style', 'style', 'align'] : opts.level === 'medium' ? ['style', 'style', 'style', 'size', 'align', 'list']
      : ['style', 'style', 'style', 'size', 'align', 'list', 'revert'];
    for (let tries = 0; ; tries++) {
      const task = rng.pick(T ? tasks.filter((x) => taskAllowed(T, x)) : tasks);
      const paras = sampleParas(rng, crng, opts, task);
      if (paras.length < 2 || (task === 'list' && paras.length < 3)) continue;
      const doc = paras.join('\n');
      const spec = { paras, doc, task, bounds: paraBounds(doc), keys: rng.bool(0.25) };
      if (T) spec.tools = T.slice();
      const plainRuns = [{ n: doc.length, ...PLAIN }];
      const pf0 = paras.map(() => ({ a: 'left', l: 'none' }));
      let base = { runs: plainRuns, pf: pf0 };
      // Some documents already carry formatting that must survive (a bold first word, a centered title line).
      if (rng.bool(0.3)) {
        const w = wordsOf(doc)[0];
        base = applyOp(base, { kind: 'char', attr: 'b', value: 1, start: w.start, end: w.end }, spec);
      }
      const W = wordsOf(doc).filter((w) => w.text.length >= 3);
      const uniqueWord = W.filter((w) => countCI(doc, w.text) === 1);
      const phrases = [];
      for (let i = 0; i + 1 < W.length; i++) {
        for (const k of [2, 3]) {
          const ws = W.slice(i, i + k);
          if (ws.length < k) continue;
          const s = ws[0].start;
          const e = ws[k - 1].end;
          if (!/^[A-Za-z'’ -]+$/.test(doc.slice(s, e))) continue;
          if (countCI(doc, doc.slice(s, e)) === 1) phrases.push({ start: s, end: e });
        }
      }
      const sents = sentencesOf(doc).filter((s) => countCI(doc, doc.slice(s.start, Math.min(s.end, s.start + 24))) === 1);
      const charTarget = (scopes) => {
        const scope = rng.pick(scopes);
        if (scope === 'word' && uniqueWord.length) return { scope, t: rng.pick(uniqueWord) };
        if (scope === 'phrase' && phrases.length) return { scope, t: rng.pick(phrases) };
        if (scope === 'sentence' && sents.length) return { scope, t: rng.pick(sents) };
        if (scope === 'para') {
          const p = rng.int(0, paras.length - 1);
          return { scope, t: { start: spec.bounds[p][0], end: spec.bounds[p][1] }, p };
        }
        if (scope === 'all') return { scope, t: { start: 0, end: doc.length } };
        return null;
      };
      let goal;
      if (task === 'style') {
        const ct = charTarget(opts.level === 'easy' ? ['word'] : opts.level === 'medium' ? ['word', 'word', 'phrase'] : ['word', 'word', 'word', 'phrase', 'phrase', 'sentence', 'all']);
        if (!ct) continue;
        Object.assign(spec, { scope: ct.scope, target: { start: ct.t.start, end: ct.t.end }, p: ct.p });
        spec.style = rng.pick(T ? ['bold', 'italic', 'underline', 'color'].filter((x) => T.includes(x)) : ['bold', 'italic', 'underline', 'color']);
        if (spec.style === 'color') spec.color = rng.pick(TARGET_HUES);
        const attr = { bold: 'b', italic: 'i', underline: 'u', color: 'c' }[spec.style];
        const value = attr === 'c' ? `${spec.color}.0` : 1;
        goal = applyOp(base, { kind: 'char', attr, value, start: spec.target.start, end: spec.target.end }, spec);
      } else if (task === 'size') {
        const ct = charTarget(['phrase', 'sentence', 'para', 'para']);
        if (!ct) continue;
        Object.assign(spec, { scope: ct.scope, target: { start: ct.t.start, end: ct.t.end }, p: ct.p });
        spec.size = rng.pick(['small', 'large', 'large', 'huge']);
        goal = applyOp(base, { kind: 'char', attr: 's', value: spec.size, start: spec.target.start, end: spec.target.end }, spec);
      } else if (task === 'align') {
        const all = rng.bool(0.2) && !LV(opts);
        const p = rng.int(0, paras.length - 1);
        spec.prange = all ? [0, paras.length - 1] : [p, p];
        spec.align = rng.pick(T ? ['center', 'center', 'right', 'justify'].filter((x) => T.includes(`align-${x}`)) : ['center', 'center', 'right', 'justify']);
        goal = applyOp(base, { kind: 'para', attr: 'a', value: spec.align, paras: range(spec.prange) }, spec);
      } else if (task === 'list') {
        const n = rng.int(2, Math.min(3, paras.length));
        const p0 = rng.int(0, paras.length - n);
        spec.prange = [p0, p0 + n - 1];
        spec.list = rng.pick(T ? ['bullet', 'number'].filter((x) => T.includes(x)) : ['bullet', 'number']);
        goal = applyOp(base, { kind: 'para', attr: 'l', value: spec.list, paras: range(spec.prange) }, spec);
      } else {
        // revert: one or two accidental changes on top of the base document; the goal is the base.
        const nOps = opts.ood ? 2 : rng.bool(0.3) ? 2 : 1;
        const ops = [];
        let snap = base;
        for (let k = 0; k < nOps; k++) {
          const op = accident(rng, spec, charTarget);
          if (!op) break;
          const next = applyOp(snap, op, spec);
          if (sameJson(next, snap)) continue;
          ops.push(op);
          snap = next;
        }
        if (!ops.length) continue;
        spec.ops = ops;
        goal = base;
        spec.from = snap;
      }
      spec.base = base;
      spec.goal = goal;
      const from = spec.from || base;
      const cd = charDiff(from, goal, spec);
      const pd = paraDiff(from, goal);
      spec.norm = { c: Math.max(1, cd), p: Math.max(1, pd), k: (cd ? 1 : 0) + (pd ? 1 : 0) || 1 };
      if (cd + pd === 0) continue;
      return spec;
    }
  }
  const range = ([a, b]) => Array.from({ length: b - a + 1 }, (_, k) => a + k);

  function accident(rng, spec, charTarget) {
    const kind = rng.pick(['b', 'c', 's', 'a', 'l', 'i']);
    const p = rng.int(0, spec.paras.length - 1);
    if (kind === 'a') return { kind: 'para', attr: 'a', value: rng.pick(['center', 'right']), paras: [p], desc: { what: 'align', p } };
    if (kind === 'l') return { kind: 'para', attr: 'l', value: rng.pick(['bullet', 'number']), paras: [p], desc: { what: 'list', p } };
    const ct = charTarget(['para', 'sentence', 'phrase']);
    if (!ct) return null;
    const value = kind === 'c' ? `${rng.pick(TARGET_HUES)}.0` : kind === 's' ? rng.pick(['huge', 'large']) : 1;
    return { kind: 'char', attr: kind, value, start: ct.t.start, end: ct.t.end, desc: { what: kind, scope: ct.scope, p: ct.p } };
  }

  function editorInit(spec, rng) {
    const m = { runs: spec.base.runs, pf: spec.base.pf, sel: { start: 0, end: 0 }, pop: null, past: [], future: [] };
    if (spec.task === 'revert') {
      let snap = spec.base;
      const past = [];
      const n = spec.startMode === 'partial' && spec.ops.length > 1 ? spec.ops.length - 1 : spec.ops.length;
      for (let k = 0; k < n; k++) {
        past.push(snap);
        snap = applyOp(snap, spec.ops[k], spec);
      }
      return { ...m, ...snap, past };
    }
    if (spec.startMode === 'scene') {
      // The text to format selected, nothing applied (a revert task keeps its accidents: that is its scene).
      if (spec.target) return { ...m, sel: { ...spec.target } };
      return { ...m, sel: { start: spec.bounds[spec.prange[0]][0], end: spec.bounds[spec.prange[1]][1] } };
    }
    if (spec.startMode === 'partial') {
      if (spec.prange && spec.prange[1] > spec.prange[0]) {
        const op = spec.task === 'align' ? { kind: 'para', attr: 'a', value: spec.align, paras: [spec.prange[0]] }
          : { kind: 'para', attr: 'l', value: spec.list, paras: [spec.prange[0]] };
        return { ...m, ...applyOp(spec.base, op, spec), past: [spec.base] };
      }
      if (spec.target) {
        const ws = wordsOf(spec.doc).filter((w) => w.start >= spec.target.start && w.end <= spec.target.end);
        if (ws.length >= 2) {
          const half = ws[Math.floor(ws.length / 2) - 1].end;
          const attr = spec.task === 'size' ? 's' : { bold: 'b', italic: 'i', underline: 'u', color: 'c' }[spec.style];
          const value = attr === 's' ? spec.size : attr === 'c' ? `${spec.color}.0` : 1;
          return { ...m, ...applyOp(spec.base, { kind: 'char', attr, value, start: spec.target.start, end: half }, spec), past: [spec.base] };
        }
        return { ...m, sel: { ...spec.target } };
      }
      return { ...m, sel: { start: spec.bounds[spec.prange[0]][0], end: spec.bounds[spec.prange[1]][1] } };
    }
    if (spec.startMode === 'wrong') {
      let op;
      if (spec.prange) {
        const others = range([0, spec.paras.length - 1]).filter((p) => p < spec.prange[0] || p > spec.prange[1]);
        const p = others.length ? rng.pick(others) : spec.prange[0];
        op = spec.task === 'align'
          ? { kind: 'para', attr: 'a', value: others.length ? spec.align : ALIGNS.find((a) => a !== spec.align && a !== 'left'), paras: [p] }
          : { kind: 'para', attr: 'l', value: others.length ? spec.list : (spec.list === 'bullet' ? 'number' : 'bullet'), paras: [p] };
      } else {
        const ws = wordsOf(spec.doc).filter((w) => w.end <= spec.target.start || w.start >= spec.target.end);
        const w = ws.length ? rng.pick(ws) : null;
        if (spec.task === 'size') op = w ? { kind: 'char', attr: 's', value: spec.size, start: w.start, end: w.end }
          : { kind: 'char', attr: 's', value: spec.size === 'huge' ? 'small' : 'huge', start: spec.target.start, end: spec.target.end };
        else if (spec.style === 'color') op = { kind: 'char', attr: 'c', value: `${rng.pick(TARGET_HUES.filter((h) => h !== spec.color))}.0`, start: spec.target.start, end: spec.target.end };
        else {
          const attr = { bold: 'b', italic: 'i', underline: 'u' }[spec.style];
          op = w ? { kind: 'char', attr, value: 1, start: w.start, end: w.end }
            : { kind: 'char', attr: ['b', 'i', 'u'].find((a) => a !== attr && hasTool(spec, { b: 'bold', i: 'italic', u: 'underline' }[a])) || (attr === 'b' ? 'i' : 'b'), value: 1, start: spec.target.start, end: spec.target.end };
        }
      }
      return { ...m, ...applyOp(spec.base, op, spec), past: [spec.base] };
    }
    return m;
  }

  function editorError(m, spec) {
    const snap = snapOf(m);
    const cd = charDiff(snap, spec.goal, spec);
    const pd = paraDiff(snap, spec.goal);
    const e = (cd / spec.norm.c + pd / spec.norm.p) / spec.norm.k;
    // Character tasks (style, size) before any formatting: selecting the target text is the only progress there can
    // be, worth up to half (interval Jaccard, so selecting the whole document earns about nothing).
    if (!e || spec.judge || (spec.task !== 'style' && spec.task !== 'size') || !spec.target || !sameJson(snap, spec.base)) return e;
    const { start, end } = m.sel || {};
    if (!(end > start)) return e;
    const t = spec.target;
    const inter = Math.max(0, Math.min(end, t.end) - Math.max(start, t.start));
    return e * (1 - 0.5 * inter / ((end - start) + (t.end - t.start) - inter));
  }

  const TOOL_ATTR = { bold: 'b', italic: 'i', underline: 'u' };
  // A toolbar action (Quill-like). B / I / U set the style on the selection unless every non-space character
  // already has it (then they remove it); color and size set the attribute; alignment and lists act on every
  // paragraph the selection touches (lists toggle off when all of them already have that list type).
  function edApply(m, spec, tool, value) {
    const { start, end } = m.sel;
    const doc = spec.doc;
    const st = expand(m.runs, doc.length);
    const pf = m.pf.map((x) => ({ ...x }));
    if (tool === 'color' || tool === 'size') {
      if (!(end > start)) return { ...m, pop: null };
      const attr = tool === 'color' ? 'c' : 's';
      const v = tool === 'color' ? (value === 'default' || !value ? null : value) : (value === 'normal' || !value ? null : value);
      for (let i = start; i < end; i++) if (doc[i] !== '\n') st[i][attr] = v;
    } else if (TOOL_ATTR[tool]) {
      if (!(end > start)) return m;
      const a = TOOL_ATTR[tool];
      let idx = [];
      for (let i = start; i < end; i++) if (!isGap(doc[i])) idx.push(i);
      if (!idx.length) idx = [...Array(end - start).keys()].map((k) => start + k).filter((i) => doc[i] !== '\n');
      const all = idx.every((i) => st[i][a]);
      for (let i = start; i < end; i++) if (doc[i] !== '\n') st[i][a] = all ? 0 : 1;
    } else if (tool.startsWith('align-')) {
      for (const p of touched(spec, m.sel)) pf[p].a = tool.slice(6);
    } else if (tool === 'bullet' || tool === 'number') {
      const ps = touched(spec, m.sel);
      const all = ps.every((p) => pf[p].l === tool);
      for (const p of ps) pf[p].l = all ? 'none' : tool;
    } else return m;
    const next = { runs: compress(st), pf };
    if (sameJson(next, snapOf(m))) return { ...m, pop: null };
    return { ...m, ...next, past: m.past.concat([snapOf(m)]).slice(-30), future: [], pop: null };
  }
  function edUndo(m) {
    if (!m.past.length) return m;
    const prev = m.past[m.past.length - 1];
    return { ...m, ...prev, past: m.past.slice(0, -1), future: m.future.concat([snapOf(m)]), pop: null };
  }
  function edRedo(m) {
    if (!m.future.length) return m;
    const next = m.future[m.future.length - 1];
    return { ...m, ...next, future: m.future.slice(0, -1), past: m.past.concat([snapOf(m)]), pop: null };
  }

  function editorPlan(m, spec) {
    const err = editorError(m, spec);
    if (err < 1e-12) return null;
    if (m.past.length && (spec.keys || hasTool(spec, 'undo')) && editorError(edUndo(m), spec) < err - 1e-9) {
      return spec.keys ? { key: 'Control+z' } : { click: { tool: 'undo' } };
    }
    const doc = spec.doc;
    const st = expand(m.runs, doc.length);
    const gst = expand(spec.goal.runs, doc.length);
    const val = (s, a) => (a === 'c' ? hueOf(s.c) : a === 's' ? s.s || null : s[a] ? 1 : 0);
    for (const a of ['s', 'b', 'i', 'u', 'c']) {
      const bad = (k) => !isGap(doc[k]) && val(st[k], a) !== val(gst[k], a);
      let i = 0;
      while (i < doc.length && !bad(i)) i++;
      if (i >= doc.length) continue;
      const v = val(gst[i], a);
      let last = i;
      for (let j = i + 1; j < doc.length; j++) {
        if (isGap(doc[j])) continue;
        if (bad(j) && val(gst[j], a) === v) last = j;
        else break;
      }
      if (m.sel.start !== i || m.sel.end !== last + 1) return { drag: [{ char: i, edge: 'before' }, { char: last, edge: 'after' }] };
      if (a === 's') return m.pop === 'size' ? { click: { size: v || 'normal' } } : { click: { tool: 'size' } };
      if (a === 'c') return m.pop === 'color' ? { click: { swatch: v ? `${v}.0` : 'default' } } : { click: { tool: 'color' } };
      const tool = { b: 'bold', i: 'italic', u: 'underline' }[a];
      return spec.keys ? { key: `Control+${a}` } : { click: { tool } };
    }
    const B = spec.bounds;
    for (const a of ['a', 'l']) {
      const bad = (p) => m.pf[p][a] !== spec.goal.pf[p][a];
      let p = 0;
      while (p < B.length && !bad(p)) p++;
      if (p >= B.length) continue;
      const v = spec.goal.pf[p][a];
      const cur = m.pf[p][a];
      let qq = p;
      while (qq + 1 < B.length && bad(qq + 1) && spec.goal.pf[qq + 1][a] === v && (v !== 'none' || m.pf[qq + 1][a] === cur)) qq++;
      const want = { start: B[p][0], end: B[qq][1] };
      const tp = touched(spec, m.sel);
      if (tp[0] !== p || tp[tp.length - 1] !== qq || !(m.sel.end > m.sel.start)) {
        return { drag: [{ char: want.start, edge: 'before' }, { char: want.end - 1, edge: 'after' }] };
      }
      if (a === 'a') return { click: { tool: `align-${v}` } };
      return { click: { tool: v === 'none' ? cur : v } };
    }
    return null;
  }

  const T_STYLE = ['Make {t} {sty} using the text editor.', 'Give {t} the style {sty}.', 'Make {t} {sty} in the document.',
    'Format {t} as {sty}.', 'Set {t} to {sty} in the editor.', 'Apply {sty} formatting to {t}.', 'Select {t} and make it {sty}.',
    'Choose {sty} to style {t}.', '{t} should use {sty} style.', 'The style for {t} should be {sty}.',
    'Let {t} appear in {sty} style.'];
  const T_COLOR = ['Color {t} {c}.', 'Make {t} {c}.', 'Change the text color of {t} to {c}.', 'Give {t} the color {c}.',
    'Set the font color of {t} to {c}.', 'Turn {t} {c} in the editor.', 'Make {t} {c} in the document (any shade is fine).',
    'The text color for {t} should be {c}.', '{t} needs {c} text.', 'Use a {c} font for {t}.',
    'Select {t} and color it {c}.', 'The hue of {t} should be {c}.', 'Have {t} use {c} text.',
    '{c} is the text color to use for {t}.', 'Display {t} using {c} text.', 'Let {t} appear in {c}.',
    'Use the editor to color {t} {c}.', 'The letters in {t} need to be {c}.', 'Apply {c} to the font in {t}.',
    'Set {t} in {c} type.', 'Replace the font color on {t} with {c}.'];
  const T_SIZE = ['Make {t} {sz}.', 'Set the font size of {t} to {S}.', 'Change {t} to the {S} text size.',
    'Give {t} the size {S}.', 'Format {t} in {S} size.', 'Make {t} {S} with the size menu.', 'Use size {S} for {t}.',
    '{t} needs {sz} text.', 'Resize {t} with the {S} size.', 'The font in {t} needs size {S}.',
    'Let {t} use {sz} type.'];
  const T_ALIGN = ['Make {p} {al}.', 'Set the alignment of {p} to {A}.', 'Make sure {p} is {al}.',
    'Change {p} so that it is {al}.', 'Format {p} as {al} text.', 'Use the alignment buttons to make {p} {al}.',
    'Use the {A} alignment for {p}.', '{p} should be {al}.', 'Give {p} {A} alignment.', 'Have {p} appear {al}.'];
  const T_LIST = ['Turn {p} into a {L}.', 'Format {p} as a {L}.', 'Make {p} a {L}.', 'Convert {p} into a {L}.',
    'Make sure {p} is a {L}.', 'Apply a {L} to {p}.', 'Use a {L} for {p}.', '{p} should form a {L}.',
    '{p} calls for a {L}.'];
  const T_REVERT1 = ['Undo the last change in the document ({d}).', 'Undo the last edit, it was a mistake: {d}.',
    'Revert the accidental change ({d}).', 'Put the document back the way it was before {d}.',
    'Undo the formatting that was just applied: {d}.', 'Revert the change someone made by accident ({d}).',
    'Take back the most recent formatting edit: {d}.', 'Return to the state before the last edit: {d}.',
    'Discard the latest formatting change ({d}).', 'Go back one edit to reverse this mistake: {d}.',
    'The latest edit ({d}) should be undone.', 'Undo once to fix the accidental edit: {d}.',
    'Use Undo to return to the point before {d}.', 'Stop after undoing the most recent edit ({d}).',
    'One undo should fix the latest mistake: {d}.', 'Undo the single edit described here: {d}.',
    'The editor needs one undo after this edit: {d}.', 'Restore the document with a single undo ({d}).',
    '{d}. Please undo that last formatting change.', 'Remove the effect of the latest edit ({d}).'];
  const T_REVERTN = ['Undo the last {n} changes in the document ({d}).', 'Undo the last {n} edits; they were mistakes ({d}).',
    'Revert the {n} accidental changes: {d}.', 'Put the document back the way it was before these {n} changes: {d}.',
    'Undo the formatting applied by the last {n} edits ({d}).', 'Roll back the last {n} formatting changes ({d}).',
    'The latest {n} edits were accidental; undo them ({d}).', 'Step back {n} edits to reverse these mistakes: {d}.',
    'Restore the state preceding the latest {n} edits ({d}).',
    'Take back these {n} most recent formatting edits: {d}.', 'Discard the last {n} formatting mistakes: {d}.',
    'These last {n} edits ({d}) should all be undone.', 'Undo {n} times to fix the latest formatting errors: {d}.',
    '{d}; undo these {n} most recent formatting edits.', 'Keep prior work; undo the last {n} edits ({d}).',
    'A series of {n} mistaken edits needs reversing: {d}.',
    'Stop after undoing the latest {n} formatting edits ({d}).', 'Recover the document with {n} undo steps ({d}).',
    '{d}. Please undo those {n} latest formatting edits.', 'The last {n} edits went wrong ({d}); undo them.',
    'Remove the effect of the last {n} formatting edits: {d}.'];

  function edTargetText(rng, spec) {
    if (spec.scope === 'all') return rng.pick([
      'everything', 'the whole document', 'all of the text', 'the document text', 'every character', 'all content'
    ]);
    if (spec.scope === 'para') return `the ${ORD[spec.p]} paragraph`;
    const text = spec.doc.slice(spec.target.start, spec.target.end);
    if (spec.scope === 'sentence') {
      const words = text.split(' ').slice(0, 4).join(' ');
      return rng.pick([`the sentence starting with "${words}"`, `the whole sentence that begins "${words}…"`]);
    }
    return rng.bool(0.8) ? q(text) : `the ${spec.scope === 'word' ? 'word' : 'words'} ${q(text)}`;
  }
  function paraText(rng, spec) {
    const [a, b] = spec.prange;
    if (a === 0 && b === spec.paras.length - 1 && a !== b) return rng.pick([
      'every paragraph', 'the whole document', 'all paragraphs', 'the document body', 'all document text',
      'the full text'
    ]);
    if (a === b) {
      const first = spec.paras[a].split(' ').slice(0, 3).join(' ');
      return rng.pick([`the ${ORD[a]} paragraph`, `the paragraph that starts with "${first}"`]);
    }
    if (b === spec.paras.length - 1 && rng.bool(0.4)) return `the last ${b - a + 1} paragraphs`;
    return rng.pick([`paragraphs ${a + 1} to ${b + 1}`, `the ${ORD[a]} ${b - a === 1 ? 'and' : 'through'} ${ORD[b]} paragraphs`]);
  }
  function opText(rng, spec, op) {
    const d = op.desc || {};
    const where = d.scope === 'para' || d.what === 'align' || d.what === 'list' ? `the ${ORD[d.p]} paragraph`
      : d.scope === 'sentence' ? 'a sentence' : 'a phrase';
    if (op.attr === 'a') return `${where} was ${op.value === 'center' ? 'centered' : 'right-aligned'}`;
    if (op.attr === 'l') return `${where} was turned into a ${op.value === 'bullet' ? 'bulleted' : 'numbered'} list`;
    if (op.attr === 'c') return `${where} was colored ${hueOf(op.value)}`;
    if (op.attr === 's') return `${where} was made ${op.value}`;
    return `${where} was made ${{ b: 'bold', i: 'italic', u: 'underlined' }[op.attr]}`;
  }

  const ABSENT_WORDS = ['zephyr', 'marmalade', 'quixotic', 'sprocket', 'tangerine'];

  // The words of the document whose every character has the attribute (b / i / u / c colour / s size).
  function styledWords(model, spec, attr) {
    const st = expand(model.runs, spec.doc.length);
    return wordsOf(spec.doc).filter((w) => {
      for (let i = w.start; i < w.end; i++) if (!st[i][attr]) return false;
      return true;
    }).length;
  }

  // editor: another word / phrase / sentence / paragraph for a style or size goal, another paragraph range for align / list.
  function retargetEditor(s, spec, rng) {
    if (spec.task === 'revert') return false;
    const doc = spec.doc;
    const base = spec.base;
    if (spec.task === 'align' || spec.task === 'list') {
      const nP = spec.paras.length;
      const ranges = [];
      if (spec.task === 'align') for (let p = 0; p < nP; p++) ranges.push([p, p]);
      else for (let n = 2; n <= Math.min(3, nP); n++) for (let p0 = 0; p0 + n <= nP; p0++) ranges.push([p0, p0 + n - 1]);
      const cand = ranges.filter((r) => r[0] !== spec.prange[0] || r[1] !== spec.prange[1]);
      if (!cand.length) return false;
      s.prange = rng.pick(cand);
      const attr = spec.task === 'align' ? 'a' : 'l';
      s.goal = applyOp(base, { kind: 'para', attr, value: spec.task === 'align' ? spec.align : spec.list, paras: range(s.prange) }, spec);
    } else {
      const W = wordsOf(doc).filter((w) => w.text.length >= 3);
      const cands = [];
      const scope = spec.scope === 'phrase' || spec.scope === 'sentence' || spec.scope === 'para' ? spec.scope : 'word';
      if (scope === 'word') for (const w of W) if (countCI(doc, w.text) === 1) cands.push({ start: w.start, end: w.end });
      if (scope === 'phrase') {
        for (let i = 0; i + 1 < W.length; i++) {
          for (const k of [2, 3]) {
            const ws = W.slice(i, i + k);
            if (ws.length < k) continue;
            const a = ws[0].start;
            const b = ws[k - 1].end;
            if (/^[A-Za-z'’ -]+$/.test(doc.slice(a, b)) && countCI(doc, doc.slice(a, b)) === 1) cands.push({ start: a, end: b });
          }
        }
      }
      if (scope === 'sentence') {
        for (const x of sentencesOf(doc)) if (countCI(doc, doc.slice(x.start, Math.min(x.end, x.start + 24))) === 1) cands.push({ start: x.start, end: x.end });
      }
      if (scope === 'para') spec.bounds.forEach((b, p) => cands.push({ start: b[0], end: b[1], p }));
      const pool = cands.filter((c) => c.start !== spec.target.start || c.end !== spec.target.end);
      if (!pool.length) return false;
      const t = rng.pick(pool);
      s.target = { start: t.start, end: t.end };
      s.scope = scope;
      if (scope === 'para') s.p = t.p;
      else delete s.p;
      const attr = spec.task === 'size' ? 's' : { bold: 'b', italic: 'i', underline: 'u', color: 'c' }[spec.style];
      const value = attr === 's' ? spec.size : attr === 'c' ? `${spec.color}.0` : 1;
      s.goal = applyOp(base, { kind: 'char', attr, value, start: t.start, end: t.end }, spec);
    }
    const cd = charDiff(base, s.goal, spec);
    const pd = paraDiff(base, s.goal);
    if (cd + pd === 0) return false;
    s.norm = { c: Math.max(1, cd), p: Math.max(1, pd), k: (cd ? 1 : 0) + (pd ? 1 : 0) || 1 };
    return true;
  }

  // Exposed for widgets.
  Object.assign(fam.helpers, { edApply, edUndo, edRedo, expand, SWATCHES, HUES, SIZES, SIZE_LABEL });

  const changed = (m, spec) => !sameJson(snapOf(m), spec.task === 'revert' ? spec.from : spec.base);

  env.scenario('use-desktop-tools', {
    name: 'editor',
    sample: sampleEditor,
    init: editorInit,
    error: editorError,
    plan: editorPlan,
    lead: 0.7,
    solve: (spec, m) => ({ ...m, runs: spec.goal.runs, pf: spec.goal.pf, pop: null }),
    instruction(spec, rng) {
      if (spec.task === 'revert') {
        const ops = spec.ops;
        const d = ops.length === 1 ? opText(rng, spec, ops[0]) : ops.map((o) => opText(rng, spec, o)).join(', then ');
        const core = ops.length === 1 ? tpl(rng, spec, T_REVERT1, { d }) : tpl(rng, spec, T_REVERTN, { d, n: ops.length === 2 ? 'two' : ops.length });
        return say(rng, spec, core, ops.length === 1 ? 'undo the last change' : `undo the last ${ops.length} changes`);
      }
      if (spec.task === 'align') {
        const p = paraText(rng, spec);
        const al = { center: rng.pick(['centered', 'center-aligned']), right: 'right-aligned', justify: 'justified' }[spec.align];
        const A = { center: 'center', right: 'right', justify: 'justified' }[spec.align];
        return say(rng, spec, tpl(rng, spec, T_ALIGN, { p, P: cap(p), al, A }), `${p}: ${al}`);
      }
      if (spec.task === 'list') {
        const p = paraText(rng, spec);
        const L = spec.list === 'bullet' ? rng.pick([
          'bulleted list', 'bullet list', 'list with bullet points', 'list in bullet form', 'set of bullets'
        ])
          : rng.pick(['numbered list', 'numbered (1, 2, 3) list']);
        return say(rng, spec, tpl(rng, spec, T_LIST, { p, P: cap(p), L }), `${p} → ${L}`);
      }
      const t = edTargetText(rng, spec);
      if (spec.task === 'size') {
        const S = SIZE_LABEL[spec.size];
        const sz = { small: rng.pick(['Small', 'small']), large: rng.pick(['Large', 'large']), huge: rng.pick(['Huge', 'huge']) }[spec.size];
        return say(rng, spec, tpl(rng, spec, T_SIZE, { t, S, sz }), `${t}: ${S}`);
      }
      if (spec.style === 'color') return say(rng, spec, tpl(rng, spec, T_COLOR, { t, c: spec.color }), `${t} ${spec.color}`);
      const sty = rng.pick(STYLE_WORDS[{ bold: 'b', italic: 'i', underline: 'u' }[spec.style]]);
      return say(rng, spec, tpl(rng, spec, T_STYLE, { t, sty }), `${t} ${sty}`, [`select ${t}`, `make it ${sty}`]);
    },
    changed,
    prepared(m, spec, e) {
      if (changed(m, spec)) return e;
      const sel = m.sel;
      if (spec.target) return sel.start === spec.target.start && sel.end === spec.target.end ? 0 : e;
      const tp = touched(spec, sel);
      return sel.end > sel.start && tp[0] === spec.prange[0] && tp[tp.length - 1] === spec.prange[1] ? 0 : e;
    },
    confirmVerb: 'apply the formatting',
    prepareConfirm(jr, spec) {
      if (spec.task === 'revert') return false; // nothing to prepare: resampled
    },
    ambiguous(jr, spec) {
      const W = wordsOf(spec.doc).filter((w) => w.text.length >= 2);
      const groups = new Map();
      for (const w of W) {
        const k = w.text.toLowerCase();
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(w);
      }
      const reps = [...groups.values()].filter((g) => g.length >= 2);
      if (!reps.length) return undefined;
      const two = reps.filter((g) => g.length === 2);
      const g = jr.pick(two.length ? two : reps);
      const word = g[0].text.toLowerCase();
      const pn = (w) => paraOf(spec, w.start) + 1;
      // Each place by what tells it apart on the page: the 2-4 word stretches of the document around it that the other
      // places do not have, plus its paragraph number when every place has its own paragraph. A place with nothing that
      // tells it apart makes them all twins (the kit accepts "first X" / "second X").
      const pns = g.map(pn);
      const AW = wordsOf(spec.doc);
      const spans = (w) => {
        const i = AW.findIndex((x) => x.start === w.start);
        const out = new Set();
        for (let len = 2; len <= 4; len++) {
          for (let a = i - len + 1; a <= i; a++) {
            if (a >= 0 && a + len <= AW.length) out.add(AW.slice(a, a + len).map((x) => x.text.toLowerCase()).join(' '));
          }
        }
        return out;
      };
      const mine = g.map(spans);
      const uniq = mine.map((set, k) => [...set].filter((x) => mine.every((o, j) => j === k || !o.has(x))));
      const byPara = new Set(pns).size === g.length;
      const cands = uniq.every((u) => u.length) || byPara
        ? g.map((_, k) => [...(byPara ? [`paragraph ${pns[k]}`, `para ${pns[k]}`, `¶${pns[k]}`] : []), ...uniq[k].slice(0, 8)])
        : g.map(() => [word]);
      return { mode: 'ambiguous', cands,
        message: `The word "${word}" appears ${g.length === 2 ? 'twice' : `${g.length} times`} (in paragraph ${pn(g[0])} and paragraph ${pn(g[1])}${g.length > 2 ? ' ...' : ''}). Which one should I make bold: the first or the second?`,
        templates: [
          'Make the word {w} bold.', 'Bold the word {w} in the document.', 'In the text editor, make {w} bold.',
          'Apply bold formatting to {w}.', 'The word {w} should appear bold.', 'Use bold type on the word {w}.',
          'For the word {w}, choose bold.', '{w} is the word to put in bold.'
        ],
        vars: { w: q(word) }, terse: `bold ${q(word)}` };
    },
    impossible(jr, spec) {
      const doc = spec.doc.toLowerCase();
      // a word from other sentences of the content bank that this document does not contain
      const pool = [...new Set(C.sample(jr.fork('absent'), Object.values(C.SENTENCE_GROUPS).flat(), 40, { csplit: spec.csplit })
        .flatMap((x) => x.toLowerCase().match(/[a-z]{6,12}/g) || []))].filter((w) => !doc.includes(w));
      const word = pool.length ? jr.pick(pool) : ABSENT_WORDS.find((w) => !doc.includes(w)) || 'zxqv';
      return { mode: 'impossible', what: [word], message: `I can't do that: the word "${word}" does not appear in the document.`,
        templates: [
          'Make the word {w} bold.', 'Bold the word {w} in the document.', 'In the text editor, make {w} bold.',
          'Give the word {w} a bold style.', 'Style {w} in bold lettering.', 'The word {w} needs bold type.',
          'With {w} selected, apply bold.', 'For {w}, apply bold formatting.', 'Use bold when formatting {w}.'
        ],
        vars: { w: q(word) }, terse: `bold ${q(word)}` };
    },
    facts(model, spec, add) {
      add('Document status', model.past.length ? 'Edited' : 'Saved', [model.past.length ? 'edited' : 'saved']);
      add('Paragraphs', spec.paras.length);
      if (spec.task === 'list') add('List items', model.pf.filter((f) => f.l !== 'none').length, null, ['bullets', 'list paragraphs']);
      else if (spec.task === 'align') add('Aligned paragraphs', model.pf.filter((f) => f.a !== 'left').length, null, ['paragraphs not left-aligned']);
      else if (spec.task === 'revert') add('Formatted paragraphs', model.pf.filter((f) => f.a !== 'left' || f.l !== 'none').length);
      else if (spec.task === 'size') add('Words in a changed size', styledWords(model, spec, 's'));
      else {
        const attr = { bold: 'b', italic: 'i', underline: 'u', color: 'c' }[spec.style];
        add({ b: 'Bold words', i: 'Italic words', u: 'Underlined words', c: 'Colored words' }[attr], styledWords(model, spec, attr));
      }
    },
    silent(next, prev, spec, rng, cands) {
      const A = expand(prev.runs, spec.doc.length);
      const B = expand(next.runs, spec.doc.length);
      const diff = [];
      for (let i = 0; i < spec.doc.length; i++) {
        if (isGap(spec.doc[i])) continue;
        if (['b', 'i', 'u', 'c', 's'].some((a) => (A[i][a] || null) !== (B[i][a] || null))) diff.push(i);
      }
      if (diff.length) {
        cands.push((m) => {
          let j = diff[diff.length - 1];
          const st = expand(m.runs, spec.doc.length);
          for (; j >= 0 && !isGap(spec.doc[j]); j--) if (diff.includes(j)) st[j] = { ...A[j] };
          m.runs = compress(st);
        });
      }
      const pd = next.pf.map((f, p) => p).filter((p) => next.pf[p].a !== prev.pf[p].a || next.pf[p].l !== prev.pf[p].l);
      if (pd.length) {
        const p = pd[pd.length - 1];
        cands.push((m) => { m.pf[p] = { ...prev.pf[p] }; });
      }
    },
    retarget: (s, spec, model, rng) => retargetEditor(s, spec, rng),
    simulate(m, spec, step, now, t) {
      if (step.drag) m = { ...m, sel: { start: step.drag[0].char, end: step.drag[1].char + 1 }, pop: null };
      else if (step.key) {
        const k = step.key.split('+')[1];
        m = k === 'z' ? edUndo(m) : edApply(m, spec, { b: 'bold', i: 'italic', u: 'underline' }[k]);
      } else if (t.tool === 'undo') m = edUndo(m);
      else if (t.tool === 'redo') m = edRedo(m);
      else if (t.tool === 'color' || t.tool === 'size') m = { ...m, pop: m.pop === t.tool ? null : t.tool };
      else if (t.tool) m = edApply(m, spec, t.tool);
      else if (t.swatch !== undefined) m = edApply(m, spec, 'color', t.swatch);
      else if (t.size !== undefined) m = edApply(m, spec, 'size', t.size);
      return m;
    },
    check() {
      const fails = [];
      const doc = 'Ab cd.\nEf gh.';
      const es = { scenario: 'editor', doc, bounds: paraBounds(doc), paras: ['Ab cd.', 'Ef gh.'] };
      let em = { runs: [{ n: doc.length, ...PLAIN }], pf: [{ a: 'left', l: 'none' }, { a: 'left', l: 'none' }], sel: { start: 2, end: 9 }, pop: null, past: [], future: [] };
      em = edApply(em, es, 'align-center');
      if (em.pf[0].a !== 'center' || em.pf[1].a !== 'center') fails.push('editor: alignment should cover every touched paragraph');
      em = edApply(em, es, 'bold');
      if (expand(em.runs, doc.length)[6].b) fails.push('editor: the paragraph separator must not get styles');
      em = edUndo(edUndo(em));
      if (em.pf[0].a !== 'left' || em.past.length) fails.push('editor: undo should restore the previous snapshot');
      return fails;
    },
  });
})();
