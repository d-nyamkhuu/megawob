/* select-text/spec.js: sampling of a spec's text, target and ask per scenario (sampleSpec), and the other-span draw of
 * the wrong / off start modes. Attached to the task's lib. */
(function () {
  'use strict';
  const lib = env.taskOf('select-text').lib;
  const { STOP, chatFieldText, chatText, countOf, lineText, messageText, paraStart, realText, sampleMarks, storyText,
    tableText, termsText, trimRange, wordTokens, words } = lib;

  // ---------------------------------------------------------------- sampling

  function sampleSpec(rng, scenario, o) {
    const cs = { csplit: o.csplit };
    const ood = o.ood;
    const pane = o.pane;
    const nP = (lo, hi) => (pane ? rng.int(6, ood ? 10 : 8) : ood ? rng.int(hi, hi + 2) : rng.int(lo, hi));
    const plain = !o.unit && !o.native;
    const story = plain && scenario !== 'field' && scenario !== 'word' && rng.bool(0.25);
    const lv = o.level;
    const text = (lo, hi, minS, maxS) => {
      if (lv === 'easy') { hi = lo; maxS = minS; } else if (lv === 'medium') { hi = Math.min(hi, lo + 1); maxS = Math.min(maxS, minS + 1); }
      if (o.native === 'input') return lineText(rng, cs);
      if (o.unit === 'cell') return tableText(rng, o, cs, scenario);
      if (o.unit === 'clause') return termsText(rng, nP(lo, hi), Math.min(maxS, 3), cs);
      if (o.unit === 'message') return chatText(rng, pane ? nP(lo, hi) : rng.int(lo, ood ? hi + 1 : hi), cs);
      return story ? storyText(rng, nP(lo, hi), minS, maxS) : realText(rng, nP(lo, hi), minS, maxS, cs);
    };

    if (o.unit === 'cell' && (scenario === 'paragraph' || scenario === 'field')) {
      // A whole cell: by column label (paragraph; mostly the notes column) or by role (field).
      for (;;) {
        const t = text();
        const nC = t.table.cols.length;
        const cells = t.paragraphs.map((x, p) => ({ p, c: p % nC })).filter(({ p, c }) => c > 0 && countOf(t.doc, t.paragraphs[p]) === 1);
        const pool = scenario === 'field' ? cells.filter((x) => x.c < nC - 1)
          : rng.bool(0.6) ? cells.filter((x) => x.c === nC - 1) : cells;
        if (!pool.length) continue;
        const x = rng.pick(pool);
        const start = paraStart(t.paragraphs, x.p);
        const ask = scenario === 'field' ? { kind: 'role', role: t.table.cols[x.c].role, p: x.p } : { kind: 'cell', p: x.p };
        return { t, target: { start, end: start + t.paragraphs[x.p].length }, ask };
      }
    }

    if (scenario === 'paragraph') {
      const t = text(3, 5, 2, 4);
      const i = rng.int(0, t.paragraphs.length - 1);
      const start = paraStart(t.paragraphs, i);
      let ask = { kind: 'index', p: i, of: t.paragraphs.length };
      if (rng.bool(0.5)) {
        if (t.topics) ask = { kind: 'topic', p: i, topic: t.topics[i] };
        else {
          const counts = {};
          for (const w of words(t.doc)) counts[w] = (counts[w] || 0) + 1;
          const uniq = [...new Set(t.paragraphs[i].match(/[A-Za-z]+/g) || [])]
            .filter((w) => counts[w.toLowerCase()] === 1 && w.length >= 5 && !STOP.has(w.toLowerCase()));
          if (uniq.length) ask = { kind: 'mentions', p: i, word: rng.pick(uniq) };
        }
      }
      return { t, target: { start, end: start + t.paragraphs[i].length }, ask };
    }
    if (scenario === 'sentence') {
      const t = text(3, 4, 3, 4);
      const sp = rng.pick(t.pool || t.spans);
      const counts = {};
      for (const w of words(t.doc)) counts[w] = (counts[w] || 0) + 1;
      const unique = [...new Set(sp.text.match(/[A-Za-z]+/g))]
        .filter((w) => counts[w.toLowerCase()] === 1 && w.length >= 4 && !STOP.has(w.toLowerCase()));
      const ws = sp.text.split(' ');
      let prefix = null;
      for (let k = 3; k <= Math.min(6, ws.length - 1) && !prefix; k++) {
        const p = ws.slice(0, k).join(' ').replace(/[.,;:]$/, '');
        if (t.spans.filter((x) => x.text.startsWith(p)).length === 1 && !/"/.test(p)) prefix = p;
      }
      const kinds = ['index'];
      if (unique.length) kinds.push('word', 'word');
      if (prefix) kinds.push('prefix');
      const kind = rng.pick(kinds);
      const ask = kind === 'index' ? { kind, p: sp.p, s: sp.s }
        : kind === 'word' ? { kind, word: rng.pick(unique) } : { kind, prefix };
      return { t, target: { start: sp.start, end: sp.end }, ask };
    }
    if (scenario === 'tip') {
      for (let guard = 0; guard < 60; guard++) {
        const t = text(3, 4, 2, 4);
        const toks = wordTokens(t.doc);
        const counts = {};
        for (const k of toks) counts[k.w.toLowerCase()] = (counts[k.w.toLowerCase()] || 0) + 1;
        const low = t.doc.toLowerCase();
        const cand = toks.filter((k) => k.clean && k.w.length >= 4 && counts[k.w.toLowerCase()] === 1 && !STOP.has(k.w.toLowerCase())
          && countOf(low, k.w.toLowerCase()) === 1);
        if (cand.length < 5) continue;
        const [target, anchor, d1, d2] = rng.sample(cand, 4);
        const decoy = rng.sample(cand.filter((k) => k !== target), 2);
        const marks = [[anchor, target], [d1, decoy[0]], [d2, decoy[1]]]
          .map(([m, named]) => ({ start: m.start, end: m.end, kind: 'tip', tip: `Key term: ${named.w}` }))
          .sort((a, b) => a.start - b.start);
        return { t, marks, target: { start: target.start, end: target.end },
          ask: { kind: 'tip', anchor: anchor.w, anchorAt: anchor.start, word: target.w } };
      }
      throw new Error('highlight: could not sample tip');
    }
    if (scenario === 'word') {
      for (;;) {
        const t = text(3, 4, 2, 4);
        const toks = wordTokens(t.doc);
        const counts = {};
        for (const k of toks) counts[k.w.toLowerCase()] = (counts[k.w.toLowerCase()] || 0) + 1;
        const low = t.doc.toLowerCase();
        const cand = toks.filter((k) => k.clean && k.w.length >= 4 && counts[k.w.toLowerCase()] === 1 && !STOP.has(k.w.toLowerCase())
          && countOf(low, k.w.toLowerCase()) === 1);
        if (!cand.length) continue;
        const k = rng.pick(cand);
        return { t, target: { start: k.start, end: k.end }, ask: { kind: 'word', word: k.w, p: t.spans.find((s) => s.start <= k.start && k.end <= s.end).p, where: rng.bool(0.3) } };
      }
    }
    if (scenario === 'field') {
      for (;;) {
        const n = lv === 'easy' ? 2 : lv === 'medium' ? 3 : ood ? rng.int(5, 6) : rng.int(3, 4);
        const t = o.unit === 'message' ? chatFieldText(rng, n, cs) : messageText(rng, n, cs);
        const role = rng.pick(t.roles.filter((r) => t.ents[r]));
        const e = t.ents[role];
        const [s, en] = trimRange(t.doc, e.start, e.end);
        if (countOf(t.doc, t.doc.slice(s, en)) !== 1) continue;
        return { t, target: { start: s, end: en }, ask: { kind: 'role', role } };
      }
    }
    // phrase
    for (;;) {
      const t = text(3, 4, 2, 4);
      const marks = o.marks ? sampleMarks(rng, t, rng.int(2, 4)) : [];
      const span = marks.length && rng.bool(0.6);
      for (let tries = 0; tries < 60; tries++) {
        const sp = rng.pick(t.pool || t.spans);
        const ws = sp.text.split(' ');
        const len = rng.int(2, ood ? 6 : 4);
        if (ws.length < len + 1) continue;
        const i = rng.int(0, ws.length - len);
        const pick = ws.slice(i, i + len);
        if (pick.some((w) => /[^A-Za-z']/.test(w))) continue;
        const phrase = pick.join(' ');
        if (countOf(t.doc, phrase) !== 1 || countOf(t.doc.toLowerCase(), phrase.toLowerCase()) !== 1) continue;
        const start = t.doc.indexOf(phrase);
        const end = start + phrase.length;
        if (span && !marks.some((m) => (m.start > start && m.start < end) || (m.end > start && m.end < end && m.start > start))) continue;
        return { t, marks, target: { start, end }, ask: { kind: 'phrase', p: sp.p, phrase, where: rng.bool(0.5) } };
      }
    }
  }

  // ---------------------------------------------------------------- start states

  function otherSpan(rng, spec) {
    const t = spec.target;
    const v = spec.scenario;
    const ok = (a, b) => b > a && (b <= t.start || a >= t.end);
    if (v === 'paragraph') {
      const ps = spec.paragraphs.map((p, i) => [paraStart(spec.paragraphs, i), paraStart(spec.paragraphs, i) + p.length]).filter(([a, b]) => ok(a, b));
      if (ps.length) return rng.pick(ps);
    }
    if (v === 'word' || v === 'field' || v === 'phrase' || v === 'tip') {
      const toks = wordTokens(spec.doc).filter((k) => ok(k.start, k.end) && k.w.length >= 4);
      if (toks.length) {
        const k = rng.pick(toks);
        if (v === 'word' || v === 'tip') return [k.start, k.end];
        const j = toks.indexOf(k);
        const k2 = toks[Math.min(toks.length - 1, j + rng.int(1, 2))];
        return /\n/.test(spec.doc.slice(k.start, k2.end)) || !ok(k.start, k2.end) ? [k.start, k.end] : [k.start, k2.end];
      }
    }
    const ss = spec.sentences.filter(([a, b]) => ok(a, b));
    return ss.length ? rng.pick(ss) : [0, 0];
  }


  Object.assign(lib, { sampleSpec, otherSpan });
})();
