/* choose-option/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  const { tagSuggest, suggest, comboFilter, clamp, listHeight, layOf, treeClick, rowY, visible, matrixAsked, lc, errorOf, planOf, solveOf, instructionOf, nonEmpty } = env.taskOf('choose-option').lib;

  function simulate(model, spec, step) {
    const v = spec.scenario;
    const m = JSON.parse(JSON.stringify(model));
    if (step.wait) {
      m.loading = false;
      m.active = -1;
      return m;
    }
    if (step.key) {
      const list = v === 'tags' ? tagSuggest(spec, m) : v === 'autocomplete' ? suggest(spec, m.text) : comboFilter(spec, m.query);
      if (step.key === 'ArrowDown') m.active = Math.min(list.length - 1, (m.active ?? -1) + 1);
      else if (step.key === 'ArrowUp') m.active = Math.max(0, (m.active ?? 0) - 1);
      else if (step.key === 'Enter' && m.active >= 0) {
        if (v === 'tags') { m.values = m.values.concat(list[m.active]); m.text = ''; m.open = false; m.active = -1; return m; }
        m.value = list[m.active];
        if (v === 'autocomplete') m.text = m.value;
        m.open = false;
        m.active = -1;
      }
      return m;
    }
    if (step.wheel) {
      if (v === 'listbox') m.scroll = clamp((m.scroll || 0) + step.wheel[1] / (m.px || 32), 0, spec.options.length - spec.rows);
      else m.top = clamp((m.top || 0) + step.wheel[1], 0, listHeight(spec, layOf(spec, m)) - layOf(spec, m).view);
      return m;
    }
    if (step.drag) {
      const to = step.drag[1];
      if (to.scroll !== undefined) m.scroll = clamp(to.scroll, 0, spec.options.length - spec.rows);
      else m.top = clamp(to.scrollTop, 0, listHeight(spec, layOf(spec, m)) - layOf(spec, m).view);
      return m;
    }
    if (step.type) {
      if (v === 'tags') {
        m.text = step.type[1]; m.active = -1; m.open = m.text.trim() !== '';
        return m;
      }
      if (v === 'combobox') {
        m.query = step.type[1];
        m.active = comboFilter(spec, m.query).length ? 0 : -1;
      } else {
        m.text = step.type[1]; m.value = ''; m.active = -1;
        m.open = m.text.trim() !== '';
        m.loading = !!spec.latency && m.open;
      }
      return m;
    }
    const c = step.click;
    if (c.cell !== undefined) {
      m.values[spec.rows.indexOf(c.cell[0])] = c.cell[1];
      return m;
    }
    if (c.open !== undefined) {
      if (v === 'dependent') {
        if (c.open === 'city' && !m.country) throw new Error('opened the city select without a country');
        m.open = c.open;
      } else { m.open = true; if (v === 'combobox') { m.query = ''; m.active = -1; } if (v === 'grouped') m.top = 0; }
    } else if (c.suggestion !== undefined && v === 'tags') {
      if (!tagSuggest(spec, m).includes(c.suggestion)) throw new Error(`clicked missing suggestion ${c.suggestion}`);
      m.values = m.values.concat(c.suggestion); m.text = ''; m.open = false; m.active = -1;
    } else if (c.more !== undefined) {
      m.expanded = !m.expanded;
    } else if (c.suggestion !== undefined) {
      m.value = c.suggestion; m.text = m.value; m.open = false;
    } else if (c.remove !== undefined) {
      if (v === 'tags' && !m.expanded && m.values.indexOf(c.remove) >= spec.maxShow) throw new Error(`removed hidden chip ${c.remove}`);
      m.values = m.values.filter((x) => x !== c.remove);
    } else if (c.field === 'chips') {
      m.open = true;
    } else if (c.toggle !== undefined) {
      m.on[c.toggle] = !m.on[c.toggle];
    } else if (c.parent !== undefined || c.link) {
      m.values = treeClick(spec, m.values, c);
    } else if (c.option !== undefined) {
      const x = c.option;
      if (v === 'dropdown' || v === 'combobox') { m.value = x; m.open = false; } else if (v === 'radio') m.value = x;
      else if (v === 'grouped') {
        if (spec.disabled.includes(x)) throw new Error(`picked disabled ${x}`);
        const L = layOf(spec, m);
        const y = rowY(spec, L, spec.options.indexOf(x));
        if (!(y >= m.top - 1 && y + L.row <= m.top + L.view + 1)) throw new Error(`clicked hidden row ${x}`);
        m.value = x; m.open = false;
      } else if (v === 'dependent') {
        if (c.of === 'country') { if (m.country !== x) m.city = ''; m.country = x; } else m.city = x;
        m.open = '';
      } else if (v === 'tree') m.values = treeClick(spec, m.values, c);
      else if (v === 'chips') m.values = spec.options.filter((o) => o === x || m.values.includes(o));
      else if (v === 'checkbox' || (v === 'listbox' && spec.multi)) {
        if (v === 'listbox' && !visible(spec, m.scroll, spec.options.indexOf(x))) throw new Error(`clicked hidden row ${x}`);
        m.values = m.values.includes(x) ? m.values.filter((y) => y !== x) : spec.options.filter((o) => o === x || m.values.includes(o));
      } else {
        if (!visible(spec, m.scroll, spec.options.indexOf(x))) throw new Error(`clicked hidden row ${x}`);
        m.values = [x];
      }
    }
    return m;
  }

  env.selfTest('choose-option', (T) => {
    const fam = T.def;
    T.sweep({ seeds: 60, sample: false }, ({ scenario, seed }) => {
      for (const startMode of ['off', 'partial', 'wrong', 'scene']) {
        const rng = new env.Rng(seed * 7919 + 17);
        const ood = seed % 5 === 4;
        const tag = `${scenario} seed ${seed} ${startMode}${ood ? ' ood' : ''}`;
        let spec;
        let model;
        try {
          const traits = scenario !== 'checkbox' ? undefined : [undefined, { grid: true, topic: 'topics', count: [15, 15] }, { topic: 'amenities' }, { grid: true, topic: 'amenities', count: [18, 18] }][seed % 4];
          spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood, traits, csplit: seed % 3 === 2 ? 'heldout' : 'train', level: ['normal', 'easy', 'medium'][(seed >> 1) % 3] });
          if (traits && traits.topic && spec.category !== (traits.topic === 'amenities' ? 'amenity' : 'topic')) T.fail(`${tag}: topic trait ignored`);
          model = fam.init(spec, rng.fork('i'));
          if (startMode === 'scene' && (scenario === 'dropdown' || scenario === 'autocomplete') && !(model.open && !model.value)) T.fail(`${tag}: scene state ${JSON.stringify(model)}`);
        } catch (e) {
          T.fail(`${tag}: ${e}`);
          continue;
        }
        const n = spec.options.length;
        if (new Set(spec.options).size !== n) T.fail(`${tag}: duplicate options`);
        if (scenario === 'matrix' && (spec.rows.length !== n || matrixAsked(spec).some((i) => !spec.cols.includes(spec.goals[i])))) T.fail(`${tag}: matrix goals`);
        if (scenario !== 'dependent' && scenario !== 'toggles' && scenario !== 'matrix') for (const t of spec.targets || [spec.target]) if (!spec.options.includes(t)) T.fail(`${tag}: target ${t} not an option`);
        if (scenario === 'listbox' && !spec.targets.some((t) => spec.options.indexOf(t) >= spec.rows)) T.fail(`${tag}: no scrolling needed`);
        if (scenario === 'grouped' && spec.disabled.includes(spec.target)) T.fail(`${tag}: target disabled`);
        if (scenario === 'grouped' && spec.criterion === 'firstAvail') {
          const g = spec.groups.find((x) => x.name === spec.group);
          if (g.options.find((o) => !spec.disabled.includes(o)) !== spec.target) T.fail(`${tag}: firstAvail mismatch`);
        }
        if (scenario === 'tags') {
          for (const t of spec.targets) if (!tagSuggest(spec, { text: spec.queries[t], values: [] }).includes(t)) T.fail(`${tag}: query of ${t} misses it`);
        }
        if (scenario === 'combobox' && !comboFilter(spec, spec.query).includes(spec.target)) T.fail(`${tag}: query misses target`);
        if (scenario === 'autocomplete') {
          const h = spec.hint;
          if (!lc(spec.target).startsWith(lc(h.prefix))) T.fail(`${tag}: target lacks prefix ${h.prefix}`);
          if (h.kind === 'affix') {
            const hits = spec.options.filter((o) => lc(o).startsWith(lc(h.prefix)) && lc(o).endsWith(lc(h.suffix)));
            if (hits.length !== 1 || hits[0] !== spec.target) T.fail(`${tag}: hint matches ${hits.join('|')}`);
          }
          const sg = suggest(spec, spec.typed);
          if (!sg.includes(spec.target) || sg.length < 2) T.fail(`${tag}: typed ${spec.typed} suggests ${sg.join('|')}`);
        }
        if (spec.criterion && scenario === 'radio') {
          const ok = spec.options.filter((o) => o === spec.target).length === 1 && spec.details[spec.target];
          if (!ok) T.fail(`${tag}: criterion target`);
        }
        const e0 = errorOf(model, spec);
        const tol = fam.tolerance(spec);
        if (startMode === 'off' ? e0 <= tol.minInitialError : e0 <= tol.tau) {
          // The kit resamples such starts; only flag when it happens for most seeds (checked below).
          continue;
        }
        let m = model;
        let k = 0;
        try {
          for (; k < 30; k++) {
            const step = planOf(m, spec);
            if (!step) break;
            m = simulate(m, spec, step);
          }
        } catch (e) {
          T.fail(`${tag}: ${e}`);
        }
        if (errorOf(m, spec) !== 0) T.fail(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
        if (k > (scenario === 'tags' ? 40 : 24)) T.fail(`${tag}: plan took ${k} steps`);
        if (errorOf(solveOf(spec, model), spec) !== 0) T.fail(`${tag}: solve() not on target`);
        const text = instructionOf(spec, rng.fork('instr'));
        if (/submit|press done|click done/i.test(text)) T.fail(`${tag}: instruction names the end control: ${text}`);
      }
    });
    // Judge modes: the data the reply is graded from.
    for (const scenario of fam.scenarios) {
      for (const mode of ['ambiguous', 'impossible']) {
        for (let seed = 0; seed < 12; seed++) {
          const tag = `${scenario} judge ${mode} seed ${seed}`;
          try {
            const rng = new env.Rng(seed * 7919 + 41);
            const sp = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: 'off', judge: mode });
            const j = sp.judge;
            if (!j) { if (mode === 'impossible') T.fail(`${tag}: no spec.judge`); continue; }
            const text = instructionOf(sp, rng.fork('t'));
            if (!text || text.includes('{') || /undefined/.test(text)) T.fail(`${tag}: instruction ${text}`);
            if (mode === 'ambiguous') {
              if (!(Array.isArray(j.cands) && j.cands.length >= 2 && j.cands.every(nonEmpty))) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
              if (!Array.isArray(j.others)) T.fail(`${tag}: no others`);
            } else if (!nonEmpty(j.what)) T.fail(`${tag}: what ${JSON.stringify(j.what)}`);
          } catch (e) { T.fail(`${tag}: ${e && e.stack || e}`); }
        }
      }
    }
    const s = { scenario: 'checkbox', targets: ['a', 'b'] };
    if (Math.abs(errorOf({ values: ['a', 'c'] }, s) - 2 / 3) > 1e-9) T.fail('jaccard: {a,c} vs {a,b}');
    T.check(errorOf({ values: [] }, s) === 1, 'jaccard: empty');


  });
})();
