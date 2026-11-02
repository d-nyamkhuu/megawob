/* select-text/hooks.js: the round 2 hooks (judge mode impossible, facts, parts, silent, retarget) and the error that
 * honours a judge. Attached to the task's lib. */
(function () {
  'use strict';
  const C = env.content;
  const I = env.instruct;
  const lib = env.taskOf('select-text').lib;
  const { ORD, ROLES, STOP, TABLE_ROLES, countOf, iouError, paraStart, sentenceParts, trimRange, wordTokens } = lib;


  const tauOf = (spec) => (spec && spec.level === 'easy' ? 0.12 : spec && spec.level === 'medium' ? 0.06 : 0.02);
  const paraOf = (spec, i) => {
    let b = 0;
    for (let p = 0; p < spec.paragraphs.length; p++) {
      const e = b + spec.paragraphs[p].length;
      if (i < e + 2) return { p, start: b, end: e };
      b = e + 2;
    }
    return { p: spec.paragraphs.length - 1, start: b, end: spec.doc.length };
  };
  const roleLabel = (role) => {
    const n = (ROLES[role] || { names: [role] }).names[0].replace(/^the /, '');
    return n[0].toUpperCase() + n.slice(1);
  };

  // Phantom words for judge=impossible: the single words of the content banks' product and dish names (about 700), checked
  // against the document so they never occur on the page; table rows of a missing person use a name from the people bank.
  let phBank = null;
  const phWords = () => {
    if (!phBank) {
      const set = new Set();
      for (const list of [C.PRODUCTS, C.DISHES]) for (const x of list) for (const w of x.name.split(/\s+/)) if (/^[a-z]{5,11}$/i.test(w)) set.add(w.toLowerCase());
      phBank = [...set].sort();
    }
    return phBank;
  };

  // judge=impossible: the instruction names something the text does not hold. The ask is replaced by a phantom
  // one that reuses the scenario's own wording: a paragraph or sentence that mentions a missing word, a phrase with
  // one word swapped for a missing one, a missing word, an underlined word that is not there (tip), a role the
  // message has no entity for (field), a row for a person the table does not list (table cells).
  function judgeOf(jr, spec, t) {
    const low = spec.doc.toLowerCase();
    const free = (pool) => pool.filter((x) => !low.includes(x.toLowerCase()));
    const word = jr.pick(free(phWords()));
    if (!word) return null;
    const v = spec.scenario;
    const a = spec.ask;
    let ask;
    let value = word;
    let key = null;
    let message = `I can't do that: there is no "${word}" in the text.`;
    if (v === 'paragraph') {
      if (spec.unit === 'cell') {
        key = free([C.personName(jr.fork('person'), { csplit: spec.csplit }).full])[0];
        if (!key) return null;
        ask = { kind: 'cell', p: a.p };
        value = key;
        message = `I can't do that: the table has no row for ${key}.`;
      } else ask = { kind: 'mentions', p: 0, word };
    } else if (v === 'sentence') ask = { kind: 'word', word };
    else if (v === 'word') ask = { kind: 'word', word, p: 0, where: false };
    else if (v === 'tip') {
      ask = { kind: 'tip', anchor: word, anchorAt: -1, word: '' };
      message = `I can't do that: there is no underlined word "${word}" in the text.`;
    } else if (v === 'phrase') {
      const ws = a.phrase.split(' ');
      const at = ws.map((w, i) => i).filter((i) => ws[i].length >= 4 && !STOP.has(ws[i].toLowerCase()));
      ws[at.length ? jr.pick(at) : jr.int(0, ws.length - 1)] = word;
      value = ws.join(' ');
      ask = { kind: 'phrase', p: a.p, phrase: value, where: false };
      message = `I can't do that: the phrase "${value}" is not in the text.`;
    } else if (v === 'field') {
      if (spec.unit === 'cell') {
        const have = spec.table.cols.map((c) => c.role);
        const miss = Object.keys(TABLE_ROLES).filter((r) => !have.includes(r));
        if (!miss.length) return null;
        const role = jr.pick(miss);
        ask = { kind: 'role', role, p: a.p, name: jr.pick(TABLE_ROLES[role]) };
        value = ask.name.replace(/^the /, '');
        message = `I can't do that: the table has no ${value} column.`;
      } else {
        const miss = Object.keys(ROLES).filter((r) => !(t.ents || {})[r]);
        if (!miss.length) return null;
        const role = jr.pick(miss);
        ask = { kind: 'role', role, name: jr.pick(ROLES[role].names.filter((x) => !/sender|message|to call/.test(x))) };
        value = ask.name.replace(/^the /, '');
        message = `I can't do that: there is no ${value} in the ${spec.unit === 'message' ? 'conversation' : 'message'}.`;
      }
    }
    if (!ask) return null;
    // what: the missing thing as the instruction names it (the swapped-in word as an alternate for a phrase)
    return { mode: 'impossible', what: v === 'phrase' ? [value, word] : [value], value, key, ask, message };
  }

  // Error of a judge=impossible episode: 0 while nothing is selected, 1 once anything is.
  function judgeError(model, spec) {
    const L = spec.doc.length;
    let s = Math.max(0, Math.min(L, Math.round(model.start || 0)));
    let e = Math.max(0, Math.min(L, Math.round(model.end || 0)));
    if (e < s) [s, e] = [e, s];
    [s, e] = trimRange(spec.doc, s, e);
    return e > s ? 1 : 0;
  }
  const errorOf = (model, spec) => (spec.judge ? judgeError(model, spec) : iouError(model, spec));

  // facts: what the page shows around the solved selection: the field's value under its role name (field), the
  // tooltip's key term (tip), the words just before and after the selection in its paragraph, and when one of
  // those is missing the first / last selected word (multi-word spans).
  function factsOf(model, spec) {
    if (spec.judge) return [];
    const { start, end } = spec.target;
    const out = [];
    if (spec.scenario === 'field') out.push({ label: roleLabel(spec.ask.role), value: spec.text, labels: [roleLabel(spec.ask.role).toLowerCase()] });
    if (spec.scenario === 'tip') out.push({ label: 'Key term', value: spec.text, labels: ['tooltip term'] });
    const para = paraOf(spec, start);
    const toks = wordTokens(spec.doc);
    const before = toks.filter((k) => k.end <= start && k.start >= para.start).pop();
    const after = toks.find((k) => k.start >= end && k.end <= para.end);
    if (before) out.push({ label: 'Word before the selection', value: before.w, labels: ['preceding word'] });
    if (after) out.push({ label: 'Word after the selection', value: after.w, labels: ['following word'] });
    const inside = toks.filter((k) => k.start >= start && k.end <= end);
    if (out.length < 3 && inside.length >= 2) {
      if (!before) out.push({ label: 'First selected word', value: inside[0].w });
      if (!after) out.push({ label: 'Last selected word', value: inside[inside.length - 1].w });
    }
    return out.length >= 2 ? out.slice(0, 4) : [];
  }

  // preempt=cancel: the one selection (its range)
  const partsOf = (model) => [{ name: 'Selection', value: [Math.min(model.start || 0, model.end || 0), Math.max(model.start || 0, model.end || 0)],
    aliases: ['Highlight', 'Selected text'] }];

  // silent: the selection came out a word short at either end (the release snapped to the previous word), or
  // did not stick at all (the previous selection is back).
  function silentOf(next, prev, spec, rng) {
    if (spec.judge || !next) return null;
    const tau = tauOf(spec);
    const doc = spec.doc;
    let [s, e] = [Math.min(next.start, next.end), Math.max(next.start, next.end)];
    [s, e] = trimRange(doc, s, e);
    const cands = [];
    const inside = wordTokens(doc).filter((k) => k.start >= s && k.end <= e);
    if (inside.length >= 2) {
      cands.push([s, inside[inside.length - 2].end]);
      cands.push([inside[1].start, e]);
    }
    if (prev) cands.push([Math.min(prev.start, prev.end), Math.max(prev.start, prev.end)]);
    for (const [a, b] of rng.shuffle(cands)) {
      const m = env.util.clone(next);
      m.start = a;
      m.end = b;
      if (iouError(m, spec) > tau) return m;
    }
    return null;
  }

  // retarget: another span of the same kind in the same text. paragraph: another paragraph by number (table:
  // another notes cell); sentence: another sentence by paragraph and sentence number; phrase: another quoted
  // phrase; word: another word that occurs once; tip: one of the decoy underlined words (its tooltip names the
  // new word); field: another column of the same row (table cells only; messages keep no other entity offsets).
  // A Shift+click / keyboard route falls back to dragging when the new span does not start and end at words.
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    const doc = spec.doc;
    const t0 = spec.target;
    const toks = wordTokens(doc);
    const low = doc.toLowerCase();
    const inLink = (i) => spec.marks.some((m) => m.kind === 'link' && m.start <= i && i < m.end);
    const tries = [];
    const add = (start, end, ask) => {
      if (start === t0.start && end === t0.end) return;
      if (!(end > start) || /\s/.test(doc[start]) || /\s/.test(doc[end - 1]) || inLink(start)) return;
      if (countOf(doc, doc.slice(start, end)) !== 1) return;
      tries.push({ start, end, ask });
    };
    const nC = spec.unit === 'cell' ? spec.table.cols.length : 0;
    if (v === 'paragraph') {
      spec.paragraphs.forEach((x, p) => {
        const s = paraStart(spec.paragraphs, p);
        if (spec.unit === 'cell') { if (p % nC === nC - 1) add(s, s + x.length, { kind: 'cell', p }); } else add(s, s + x.length, { kind: 'index', p, of: spec.paragraphs.length });
      });
    } else if (v === 'sentence') {
      for (const [a, b] of spec.sentences) {
        const { p, start: ps } = paraOf(spec, a);
        if (nC && p % nC !== nC - 1) continue;
        const s = spec.sentences.filter(([x]) => x >= ps && x < a).length;
        if (sentenceParts(spec.paragraphs[p])[s] === doc.slice(a, b) && ORD[s] && ORD[p] !== undefined) add(a, b, { kind: 'index', p, s });
      }
    } else if (v === 'phrase') {
      for (let k = 0; k < 80 && tries.length < 6; k++) {
        const [a, b] = rng.pick(spec.sentences);
        const { p } = paraOf(spec, a);
        if (nC && p % nC !== nC - 1) continue;
        const ws = doc.slice(a, b).split(' ');
        const len = rng.int(2, 4);
        if (ws.length < len + 1) continue;
        const i = rng.int(0, ws.length - len);
        const pick = ws.slice(i, i + len);
        if (pick.some((w) => /[^A-Za-z']/.test(w))) continue;
        const phrase = pick.join(' ');
        if (countOf(low, phrase.toLowerCase()) !== 1) continue;
        const s = doc.indexOf(phrase);
        add(s, s + phrase.length, { kind: 'phrase', p, phrase, where: false });
      }
    } else if (v === 'word') {
      const counts = {};
      for (const k of toks) counts[k.w.toLowerCase()] = (counts[k.w.toLowerCase()] || 0) + 1;
      for (const k of toks) {
        if (!k.clean || k.w.length < 4 || counts[k.w.toLowerCase()] !== 1 || STOP.has(k.w.toLowerCase()) || countOf(low, k.w.toLowerCase()) !== 1) continue;
        if (spec.marks.some((m) => m.kind === 'link' && m.start < k.end && k.start < m.end)) continue;
        add(k.start, k.end, { kind: 'word', word: k.w, p: paraOf(spec, k.start).p, where: false });
      }
    } else if (v === 'tip') {
      for (const m of spec.marks) {
        if (m.kind !== 'tip' || m.start === spec.ask.anchorAt) continue;
        const w = m.tip.replace(/^Key term: /, '');
        const k = toks.find((x) => x.w === w);
        if (k) add(k.start, k.end, { kind: 'tip', anchor: doc.slice(m.start, m.end), anchorAt: m.start, word: w });
      }
    } else if (v === 'field' && nC) {
      const row = spec.ask.p - (spec.ask.p % nC);
      for (let c = 1; c < nC - 1; c++) {
        const p = row + c;
        const s = paraStart(spec.paragraphs, p);
        const [a, b] = trimRange(doc, s, s + spec.paragraphs[p].length);
        add(a, b, { kind: 'role', role: spec.table.cols[c].role, p });
      }
    }
    const ok = tries.map((x) => {
      const ns = { ...spec, target: { start: x.start, end: x.end }, text: doc.slice(x.start, x.end), ask: x.ask };
      if (ns.route === 'shift' || ns.route === 'keys') {
        const first = toks.find((k) => k.start === x.start);
        const wordStart = !!first && first.end < x.end && /[\s("“]/.test(doc[x.start - 1] || ' ');
        if (!wordStart || !/\s/.test(doc[x.end] || ' ') || inLink(x.end - 1)) ns.route = 'drag';
      }
      return ns;
    }).filter((ns) => iouError(model, ns) > tauOf(ns));
    return ok.length ? rng.pick(ok) : null;
  }


  Object.assign(lib, { tauOf, errorOf, judgeOf, factsOf, partsOf, silentOf, retargetOf });
})();
