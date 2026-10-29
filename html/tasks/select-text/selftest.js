/* select-text/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('select-text', (T) => {
    const { def, lib } = T;
    const { sentenceParts, iouError, countOf, words, wordTokens, planOf, instructionOf, factsOf, silentOf, retargetOf, tauOf,
      errorOf } = lib;

    const sentenceCases = [
      ['Happy birthday, Amara! Hope you have an amazing day.', ['Happy birthday, Amara!', 'Hope you have an amazing day.']],
      ['Has anyone tried the ramen place? Worth it?', ['Has anyone tried the ramen place?', 'Worth it?']],
      ['Dr. Rivera reviewed invoice INV-2024-0193. Email ana@example.com about the $42.18 total.',
        ['Dr. Rivera reviewed invoice INV-2024-0193.', 'Email ana@example.com about the $42.18 total.']],
      ['Meet Ms. Chen at 10 a.m. tomorrow. Visit example.com for details.',
        ['Meet Ms. Chen at 10 a.m. tomorrow.', 'Visit example.com for details.']],
    ];
    for (const [text, want] of sentenceCases) {
      if (JSON.stringify(sentenceParts(text)) !== JSON.stringify(want)) T.fail(`sentence boundaries: ${text}`);
    }
    const spec = { doc: 'abc def\n\nghi', target: { start: 4, end: 7 } };
    const near = (x, y) => Math.abs(x - y) < 1e-9;
    if (!near(iouError({ start: 4, end: 7 }, spec), 0)) T.fail('exact selection should have error 0');
    if (!near(iouError({ start: 3, end: 9 }, spec), 0)) T.fail('surrounding whitespace should be ignored');
    if (!near(iouError({ start: 0, end: 0 }, spec), 1)) T.fail('empty selection should have error 1');
    if (!near(iouError({ start: 5, end: 7 }, spec), 1 / 3)) T.fail('partial selection IoU wrong');
    if (!near(iouError({ start: 9, end: 3 }, spec), 0)) T.fail('reversed selection should be normalised');
    const modes = ['off', 'partial', 'wrong'];
    for (let seed = 0; seed < 300; seed++) {
      const scenario = def.scenarios[seed % def.scenarios.length];
      const startMode = modes[seed % 3];
      let s;
      try {
        s = def.sample(new env.Rng(seed), { scenario, scenarios: def.scenarios, startMode, traits: { pane: true, marks: true },
          ood: seed % 7 === 0, csplit: seed % 5 === 0 ? 'heldout' : 'train' });
        s.startMode = startMode;
      } catch (e) {
        T.fail(`seed ${seed} ${scenario}: ${e.stack || e}`);
        continue;
      }
      const { start, end } = s.target;
      if (s.doc !== s.paragraphs.join('\n\n')) T.fail(`seed ${seed}: doc is not the joined paragraphs`);
      if (!(end > start) || /\s/.test(s.doc[start]) || /\s/.test(s.doc[end - 1])) T.fail(`seed ${seed}: target not trimmed`);
      if (countOf(s.doc, s.text) !== 1) T.fail(`seed ${seed} ${scenario}: target text is not unique`);
      if (scenario === 'paragraph' && !s.paragraphs.includes(s.text)) T.fail(`seed ${seed}: paragraph target mismatch`);
      if (scenario === 'sentence' && !s.sentences.some(([a, b]) => a === start && b === end)) T.fail(`seed ${seed}: sentence target malformed`);
      if (scenario === 'sentence' && sentenceParts(s.text).length !== 1) T.fail(`seed ${seed}: target spans multiple sentences`);
      if (scenario === 'sentence' && s.ask.kind === 'index' && sentenceParts(s.paragraphs[s.ask.p])[s.ask.s] !== s.text) {
        T.fail(`seed ${seed}: sentence index does not match the paragraph`);
      }
      if (s.ask.kind === 'topic' && s.paragraphs.filter((p) => p.includes(s.ask.topic)).length !== 1) T.fail(`seed ${seed}: topic not unique`);
      if ((s.ask.kind === 'word' || s.ask.kind === 'mentions') && words(s.doc).filter((w) => w === s.ask.word.toLowerCase()).length !== 1) T.fail(`seed ${seed}: word not unique`);
      if (s.ask.kind === 'prefix' && !s.text.startsWith(s.ask.prefix)) T.fail(`seed ${seed}: prefix mismatch`);
      if ((scenario === 'word' || scenario === 'tip') && s.text !== s.ask.word) T.fail(`seed ${seed}: word target mismatch`);
      if (scenario === 'tip') {
        const anchorMark = s.marks.find((mk) => mk.kind === 'tip' && mk.start === s.ask.anchorAt);
        if (!anchorMark || anchorMark.tip !== `Key term: ${s.text}` || s.doc.slice(anchorMark.start, anchorMark.end) !== s.ask.anchor) T.fail(`seed ${seed}: tip anchor`);
        if (s.marks.some((mk) => mk.kind === 'tip' && mk.start < end && start < mk.end)) T.fail(`seed ${seed}: a tip covers the target`);
      }
      const m = def.init(s, new env.Rng(seed + 1));
      if (startMode !== 'off' && iouError(m, s) <= 0.02) T.fail(`seed ${seed} ${scenario}: ${startMode} start is solved`);
      if ((s.route === 'shift' || s.route === 'keys') && !wordTokens(s.doc).some((k) => k.start === start)) T.fail(`seed ${seed}: keys route without a first word`);
      if (T.fails.length > 10) break;
    }
    // Opt-in shapes (base widgets terms, chat, table, textbox) and forced routes.
    const shapes = [[{ unit: 'clause', pane: true, marks: true }, ['paragraph', 'sentence', 'phrase', 'word']],
      [{ unit: 'message', pane: true }, def.scenarios], [{ unit: 'cell' }, def.scenarios], [{ native: true }, def.scenarios],
      [{ pane: 'always', marks: true }, def.scenarios]];
    const forcedRoutes = [undefined, 'keyboard', 'wheel', 'pointer'];
    for (let seed = 0; seed < 240 && T.fails.length <= 10; seed++) {
      const [traits, vs] = shapes[seed % shapes.length];
      const scenario = vs[Math.floor(seed / shapes.length) % vs.length];
      const route = forcedRoutes[Math.floor(seed / 7) % 4];
      let s;
      try {
        s = def.sample(new env.Rng(1000 + seed), { scenario, startMode: 'off', traits, route, ood: seed % 9 === 0,
          csplit: seed % 5 === 0 ? 'heldout' : 'train' });
        instructionOf(s, new env.Rng(seed));
      } catch (e) {
        T.fail(`shape seed ${seed} ${scenario} ${JSON.stringify(traits)}: ${e.stack || e}`);
        continue;
      }
      const tag = `shape seed ${seed} ${scenario} ${Object.keys(traits)[0]}`;
      const { start, end } = s.target;
      if (s.doc !== s.paragraphs.join('\n\n')) T.fail(`${tag}: doc is not the joined paragraphs`);
      if (!(end > start) || /\s/.test(s.doc[start]) || /\s/.test(s.doc[end - 1])) T.fail(`${tag}: target not trimmed`);
      if (countOf(s.doc, s.text) !== 1) T.fail(`${tag}: target text is not unique`);
      if (scenario === 'paragraph' && !s.paragraphs.includes(s.text)) T.fail(`${tag}: paragraph target mismatch`);
      if (scenario === 'sentence' && sentenceParts(s.text).length !== 1) T.fail(`${tag}: target spans multiple sentences`);
      if (s.unit === 'message' && (s.chat.who.length !== s.paragraphs.length || new Set(s.chat.at).size !== s.paragraphs.length)) T.fail(`${tag}: chat meta`);
      if (s.ask.kind === 'from' && s.chat.who[s.ask.p] === 0) T.fail(`${tag}: message named by the viewer`);
      if (s.unit === 'clause' && s.titles.length !== s.paragraphs.length) T.fail(`${tag}: clause titles`);
      if (s.unit === 'cell' && s.paragraphs.length !== s.table.cols.length * s.table.rows) T.fail(`${tag}: table shape`);
      if (s.native === 'input' && (s.paragraphs.length !== 1 || s.doc.length > 80)) T.fail(`${tag}: input line`);
      if (route === 'pointer' && (s.keys || s.route === 'keys' || s.scroll !== 'thumb')) T.fail(`${tag}: pointer route not forced`);
      if (route === 'keyboard' && s.keys && s.route !== 'keys') T.fail(`${tag}: keyboard route not forced`);
      if (route === 'wheel' && s.pane && s.scroll !== 'wheel') T.fail(`${tag}: wheel route not forced`);
    }
    // Round 2 hooks on every shape and scenario: facts are strings, silent stays wrong, retarget gives a new
    // solvable goal, judge=impossible starts untouched and names its phantom.
    const all = [[{}, def.scenarios], ...shapes];
    for (let seed = 0; seed < 180 && T.fails.length <= 10; seed++) {
      const [traits, vs] = all[seed % all.length];
      const scenario = vs[Math.floor(seed / all.length) % vs.length];
      const tag = `hooks seed ${seed} ${scenario} ${JSON.stringify(traits)}`;
      if (scenario === 'tip' && (traits.unit || traits.native)) continue; // tip: only the plain 'paragraphs' widget
      try {
        const r = new env.Rng(5000 + seed);
        const s = def.sample(r.fork('s'), { scenario, startMode: 'wrong', traits });
        s.startMode = 'wrong';
        const m0 = def.init(s, r.fork('i'));
        const sol = def.solve(s, m0);
        const facts = factsOf(sol, s);
        if (facts.length && (facts.length < 2 || facts.length > 4 || facts.some((f) => typeof f.value !== 'string' || !f.value || !s.doc.includes(f.value)))) T.fail(`${tag}: bad facts ${JSON.stringify(facts)}`);
        const sil = silentOf(sol, m0, s, r.fork('sil'));
        if (sil && (iouError(sil, s) <= tauOf(s) || typeof sil.start !== 'number')) T.fail(`${tag}: silent is solved`);
        const ns = retargetOf(s, sol, r.fork('rt'));
        if (ns) {
          if (iouError(sol, ns) <= tauOf(ns)) T.fail(`${tag}: retarget already solved`);
          if (ns.doc !== s.doc || ns.marks !== s.marks) T.fail(`${tag}: retarget changed the scene`);
          if (iouError(def.solve(ns, sol), ns) !== 0 || !planOf(sol, ns)) T.fail(`${tag}: retarget not solvable`);
          const it = instructionOf(ns, r.fork('it'));
          if (!it || /undefined|\{\w+\}/.test(it)) T.fail(`${tag}: retarget instruction ${it}`);
        } else if (scenario !== 'field' || s.unit === 'cell') T.fail(`${tag}: no retarget`);
        const js = def.sample(r.fork('s'), { scenario, startMode: 'wrong', traits, judge: 'impossible' });
        js.startMode = 'wrong';
        if (!js.judge) T.fail(`${tag}: judge impossible not built`);
        else {
          if (errorOf(def.init(js, r.fork('i')), js) !== 0) T.fail(`${tag}: judge start not untouched`);
          if (errorOf(def.solve(js, m0), js) !== 1) T.fail(`${tag}: judge selection not wrong`);
          const jt = instructionOf(js, r.fork('it'));
          if (!jt || /undefined|\{\w+\}/.test(jt) || !js.judge.message.includes(js.judge.value)) T.fail(`${tag}: bad judge instruction ${jt}`);
          if (js.judge.value !== js.judge.key && /"/.test(js.judge.message) && !s.doc.includes(js.judge.value) && js.doc.toLowerCase().includes(js.judge.value.toLowerCase())) T.fail(`${tag}: judge value on the page`);
        }
      } catch (e) {
        T.fail(`${tag}: ${e.stack || e}`);
      }
    }  });
})();
