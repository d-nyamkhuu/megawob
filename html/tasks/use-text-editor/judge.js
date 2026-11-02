/* use-text-editor/judge.js: Ambiguous and impossible requests and their reply candidates. */
(function () {
  'use strict';
  const task = env.taskOf('use-text-editor');
  const { lib } = task;

  const wordsOfText = (t) => (String(t).normalize('NFKD').toLowerCase().match(/[a-z0-9]+/g) || []);
  // Stretches of 2-4 words of `text` that overlap [a, b) (inside: lie within it; 3-5 words) and occur exactly once in the
  // whole text: what tells that place apart from the others. At most `max`, shortest first.
  function placeSpans(text, a, b, { inside = false, max = 8 } = {}) {
    const toks = [];
    const re = /[A-Za-z0-9]+/g;
    let mm;
    while ((mm = re.exec(text))) toks.push({ w: mm[0].toLowerCase(), a: mm.index, b: mm.index + mm[0].length });
    const hay = ` ${toks.map((t) => t.w).join(' ')} `;
    const count = (sp) => { let n = 0; for (let i = hay.indexOf(` ${sp} `); i >= 0; i = hay.indexOf(` ${sp} `, i + 1)) n++; return n; };
    const out = [];
    for (let len = inside ? 3 : 2; len <= (inside ? 5 : 4); len++) {
      for (let i = 0; i + len <= toks.length; i++) {
        const t0 = toks[i];
        const t1 = toks[i + len - 1];
        if (inside ? !(t0.a >= a && t1.b <= b) : !(t1.b > a && t0.a < b)) continue;
        const sp = toks.slice(i, i + len).map((t) => t.w).join(' ');
        if (count(sp) === 1 && !out.includes(sp)) out.push(sp);
      }
    }
    return out.slice(0, max);
  }
  // cands entry per place; a place with nothing that tells it apart makes every place a twin of `fallback`.
  const placeCands = (lists, fallback) => (lists.every((l) => l.length) ? lists : lists.map(() => [fallback]));
  const lineNames = (n) => [`line ${n}`, `ln ${n}`, String(n)];
  // Candidates / others for lines (1-based) of a code file: the line number, the line's own text when it is unique.
  function lineCands(text, lines) {
    const ls = lib.linesOf(text);
    const uniq = (l) => ls[l].trim().length >= 8 && ls.filter((x) => x.trim() === ls[l].trim()).length === 1;
    const cands = lines.map((n) => [...lineNames(n), ...(uniq(n - 1) ? [ls[n - 1].trim()] : [])]);
    const others = ls.map((_, i) => i + 1).filter((n) => !lines.includes(n)).map(lineNames);
    return { cands, others };
  }

  function judgeOf(jr, spec, mode, meta) {
    const prose = lib.isProse(spec);
    let text = prose ? lib.flatDoc(spec.doc0) : spec.base;
    const nLines = lib.linesOf(text).length;
    const v = spec.scenario;
    const g = spec.goal;
    const out = (o) => ({ mode, ...o });
    if (v === 'trackchanges') {
      const ss = lib.suggestions(spec.doc0);
      const by = {};
      for (const s of ss) by[s.author] = (by[s.author] || 0) + 1;
      const act = jr.pick(['Accept', 'Reject']);
      if (mode === 'impossible') {
        const B = spec.names.ghost;
        return out({ text: `${act} ${B}'s suggestion.`, what: [B], message: `I can't do that: there is no suggestion from ${B} in this document.` });
      }
      const A = Object.keys(by).find((a) => by[a] >= 2);
      // A suggestion is told apart by the words it adds or removes and the stretches of text around it.
      const flat0 = lib.flatDoc(spec.doc0);
      const words1 = (t) => t.trim();
      const names = (x, byAuthor) => {
        const own = [x.ins, x.del].map(words1).filter((t) => t.length >= 2 && wordsOfText(t).length === 1);
        return [...(byAuthor ? [x.author, `${x.author}'s`] : []), ...own, ...placeSpans(flat0, x.o, x.o + (x.ins + x.del).length)];
      };
      const pool = A ? ss.filter((x) => x.author === A) : ss;
      // a name two suggestions share (the same word added twice) tells neither apart
      const lists0 = pool.map((x) => names(x, !A));
      const key = (n) => wordsOfText(n).join(' ');
      const cands = placeCands(lists0.map((l, i) => l.filter((n) => lists0.every((o, j) => j === i || !o.some((m) => key(m) === key(n))))), `${A || 'the'} suggestion`);
      const taken = new Set(cands.flat().map((n) => wordsOfText(n).join(' ')));
      const others = A ? ss.filter((x) => x.author !== A).flatMap((x) => [x.author, ...names(x, false).slice(0, 3)])
        .filter((n) => n.length >= 4 && !taken.has(wordsOfText(n).join(' '))).map((n) => [n]) : [];
      if (A) return out({ text: `${act} ${A}'s suggestion.`, cands, others: [...new Map(others.map((o) => [o[0].toLowerCase(), o])).values()], message: `${A} made ${by[A]} suggestions here. Which one do you mean?` });
      return out({ text: `${act} the suggestion in the document.`, cands, others: [], message: `There are ${ss.length} suggestions here. Which one do you mean?` });
    }
    if (prose) {
      if (v === 'findreplace') {
        if (mode === 'impossible') {
          const X = jr.pick(lib.CODENAMES.filter((w) => !text.includes(w) && w !== g.y));
          return out({ text: `Replace "${X}" with "${g.y}" everywhere in the document.`, what: [X], message: `I can't do that: "${X}" does not appear in the document.` });
        }
        const who = spec.names.person;
        // the sentences that mention the person and the text: each told apart by stretches of its own words
        const sents = [];
        const sre = /[^.!?\n]+[.!?]?/g;
        let sm;
        while ((sm = sre.exec(text))) if (sm[0].includes(who) && sm[0].includes(g.x)) sents.push({ a: sm.index, b: sm.index + sm[0].length });
        const cands = placeCands(sents.map((x) => placeSpans(text, x.a, x.b, { inside: true })), `${who} sentence`);
        return out({ text: `In the sentence that mentions ${who}, replace "${g.x}" with "${g.y}".`, cands, others: [],
          message: `Two sentences mention ${who} and "${g.x}". Which one do you mean?` });
      }
      const w = g.ref.word || jr.pick(lib.ADD_WORDS);
      if (mode === 'impossible') {
        const k = spec.doc0.length + jr.int(0, 2);
        const n = spec.doc0.length;
        return out({ text: `In the ${lib.ORD[k]} paragraph, add the word "${w}" right after "${g.ref.tok}".`,
          what: [`${lib.ORD[k]} paragraph`, `paragraph ${k + 1}`, `${k + 1}th paragraph`, lib.ORD[k]],
          message: `I can't do that: the document has only ${n} paragraph${n === 1 ? '' : 's'}, so there is no ${lib.ORD[k]} paragraph.` });
      }
      const ws = [...new Set(lib.plainWords(text).filter((x) => x.w.length >= 3 && lib.countWord(spec, text, x.w) >= 2).map((x) => x.w))];
      let tok = jr.pick(ws);
      if (tok === undefined) {
        // no word occurs twice: the last paragraph gets a closing sentence that repeats one
        tok = jr.pick([...new Set(lib.plainWords(text).filter((x) => x.w.length >= 4).map((x) => x.w))]);
        const last = spec.doc0[spec.doc0.length - 1];
        last[last.length - 1].t += ` Please recheck the ${tok} soon.`;
        text = lib.flatDoc(spec.doc0);
      }
      // each occurrence: its paragraph (when every one has its own) and stretches of the document around it
      const occ = lib.occurrences(spec, text, tok);
      const pns = occ.map(([a]) => lib.paraOf(text, a));
      const distinctParas = new Set(pns).size === occ.length;
      const cands = placeCands(occ.map(([a, b], i) => [...(distinctParas ? [`${lib.ORD[pns[i]]} paragraph`, `paragraph ${pns[i] + 1}`] : []),
        ...placeSpans(text, a, b)]), tok);
      return out({ text: `Add the word "${w}" right after "${tok}".`, cands, others: [], message: `"${tok}" appears ${lib.countWord(spec, text, tok)} times in the document. Which one do you mean?` });
    }
    const nm = meta.names;
    const fetchLines = lib.tagLines(meta, 'fetch').map((l) => l + 1);
    const atLines = `lines ${lib.listOf(fetchLines)}`;
    if (v === 'findreplace') {
      if (mode === 'impossible') {
        const X = jr.pick(lib.NOUNS.filter((w) => !text.toLowerCase().includes(w) && w !== g.y));
        return out({ text: `Replace every "${X}" with "${g.y}".`, what: [X], message: `I can't do that: "${X}" does not appear in the file.` });
      }
      const y = jr.pick(['keys', 'refs', 'codes']);
      return out({ text: `On the line that calls "${nm.fetch}", replace "ids" with "${y}".`, ...lineCands(text, fetchLines),
        message: `"${nm.fetch}" is called on ${atLines}. Which one do you mean?` });
    }
    const N = nLines + jr.int(1, 8);
    const none = `I can't do that: the file has only ${nLines} lines, so there is no line ${N}.`;
    const noLine = [`line ${N}`, `lines ${N}`, `ln ${N}`];
    if (v === 'multiline') {
      const verb = { comment: 'Comment out', uncomment: 'Uncomment', indent: 'Indent', outdent: 'Outdent', delete: 'Delete' }[g.op];
      if (mode === 'impossible') return out({ text: `${verb} lines ${N}-${N + jr.int(1, 3)}.`, what: noLine, message: none });
    }
    if (v === 'multicursor') {
      const t = lib.spoken(g.text);
      if (mode === 'impossible') return out({ text: `Add ${t} at the start of lines ${lib.listOf([N, N + 1, N + 2])}.`, what: noLine, message: none });
      return out({ text: `Add ${t} to the line that calls "${nm.fetch}".`, ...lineCands(text, fetchLines), message: `"${nm.fetch}" is called on ${atLines}. Which one do you mean?` });
    }
    if (v === 'autocomplete') {
      const s1 = g.ref.stmts[0];
      if (mode === 'impossible') return out({ text: `Add a new line "${s1}" after line ${N}.`, what: noLine, message: none });
      return out({ text: `After the line that calls "${nm.fetch}", add a new line "${s1}".`, ...lineCands(text, fetchLines), message: `"${nm.fetch}" is called on ${atLines}. Which one do you mean?` });
    }
    if (v === 'cursor' && mode === 'impossible') return out({ text: `At the end of line ${N}, type ${lib.spoken(g.text)}.`, what: noLine, message: none });
    // ambiguous: an identifier on two or more lines
    const ids = lib.identifiers(spec, text);
    const multi = [...new Set(ids.filter((x) => new Set(ids.filter((y) => y.w === x.w).map((y) => y.l)).size >= 2).map((x) => x.w))];
    const tok = jr.pick(multi);
    const at = [...new Set(ids.filter((y) => y.w === tok).map((y) => y.l + 1))];
    const message = `"${tok}" appears on lines ${lib.listOf(at)}. Which one do you mean?`;
    if (v === 'multiline') {
      const verb = { comment: 'Comment out', uncomment: 'Uncomment', indent: 'Indent', outdent: 'Outdent', delete: 'Delete' }[g.op];
      return out({ text: `${verb} the line that contains "${tok}".`, ...lineCands(text, at), message });
    }
    return out({ text: `Type ${lib.spoken(g.text)} right after "${tok}".`, ...lineCands(text, at), message });
  }

  // ---------------------------------------------------------------- sample

  Object.assign(lib, { judgeOf });
})();
