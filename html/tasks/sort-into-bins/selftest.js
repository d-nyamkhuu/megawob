/* sort-into-bins/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and Node tests). */
(function () {
  'use strict';
  const fam = env.taskOf('sort-into-bins');
  const lib = fam.lib;
  const modes = ['off', 'partial', 'wrong'];

  function episodes(T) {
    const fails = T.fails;
    T.sweep({ seeds: 60, rng: (seed) => new env.Rng(seed * 7919 + 13), sample: false }, ({ scenario, seed, rng, tag }) => {
      if (fails.length > 12) return;
      const startMode = modes[seed % 3];
      let spec;
      let model;
      try {
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 6 === 0 });
        model = fam.init(spec, rng.fork('i'));
      } catch (e) {
        fails.push(`${tag}: ${e.stack || e}`);
        return;
      }
      const e0 = lib.errorOf(model, spec);
      if (startMode === 'off' && e0 <= fam.tolerance(spec).minInitialError) {
        // The kit resamples such starts; only flag systematic failures.
        if (scenario === 'single') fails.push(`${tag}: start error ${e0} too low`);
      }
      if (scenario === 'desk') {
        let m = { ...model, loc: { ...model.loc } };
        let n = 0;
        for (; n < 40; n++) {
          const st = lib.deskPlan(m, spec);
          if (!st) break;
          if (st.click) m = { ...m, open: st.click.folder };
          else {
            const id = st.drag[0].item;
            const t = st.drag[1];
            const pt = t.folder ? (() => { const d = spec.folders.find((x) => x.id === t.folder); return [d.x + d.w / 2, d.y + d.h / 2]; })() : t.point;
            m = lib.deskDrop(spec, m, id, pt, pt);
          }
        }
        if (lib.deskError(m, spec) !== 0) fails.push(`${tag}: desk plan ends at ${lib.deskError(m, spec)}`);
        if (lib.deskError(lib.solveOf(spec, model), spec) !== 0) fails.push(`${tag}: desk solve`);
        // Desk start positions avoid the folders and the window.
        for (const f of spec.files) {
          const r = lib.itemRect(spec, model.pos[f.id]);
          if (spec.folders.some((d) => lib.overlap(r, lib.boxRect(d)))) fails.push(`${tag}: ${f.id} starts on a folder`);
          if (r[0] < -lib.EPS || r[1] < -lib.EPS || r[2] > 1 + lib.EPS || r[3] > 1 + lib.EPS) fails.push(`${tag}: ${f.id} off the board`);
        }
        for (const d of spec.folders) if (d.y + d.h > 1 + lib.EPS || d.y < -lib.EPS) fails.push(`${tag}: folder ${d.id} off the board`);
      } else if (scenario === 'palette') {
        const m = lib.solveOf(spec, model);
        if (lib.paletteError(m, spec) !== 0) fails.push(`${tag}: palette solve ends at ${lib.paletteError(m, spec)}`);
        if (startMode !== 'off' && e0 <= 0) fails.push(`${tag}: ${startMode} start solved`);
      } else {
        if (Math.abs(spec.item.w * spec.aspect - spec.item.h) > 1e-9) fails.push(`${tag}: items not square`);
        for (const c of spec.containers) {
          if (c.x < 0 || c.y < 0 || c.x + c.w > 1 + lib.EPS || c.y + c.h > 1 + lib.EPS) fails.push(`${tag}: ${c.id} off the board`);
        }
        if (!spec.pile && startMode === 'off' && spec.rule.mode !== 'remove') {
          const rects = spec.items.map((it) => lib.itemRect(spec, model.pos[it.id]));
          rects.forEach((r, i) => {
            for (let j = i + 1; j < rects.length; j++) if (lib.overlap(r, rects[j])) fails.push(`${tag}: i${i} overlaps i${j} at start`);
          });
          }
          let m = { pos: { ...model.pos }, z: model.z.slice() };
          let n = 0;
          for (; n < 40; n++) {
            const step = lib.boxPlan(m, spec);
            if (!step) break;
            m = lib.applyBoxStep(spec, m, step);
          }
          if (lib.boxError(m, spec) !== 0) fails.push(`${tag}: plan ends at error ${lib.boxError(m, spec)} after ${n} steps`);
          if (lib.boxError(lib.solveOf(spec, model), spec) !== 0) fails.push(`${tag}: solve() not on target`);
          if (startMode !== 'off' && e0 <= 0) fails.push(`${tag}: ${startMode} start solved`);
        }
    });
  }

  function episodeHooks(T) {
    const fails = T.fails;
    // round 2: facts, silent, retarget, judge modes
    for (const scenario of fam.scenarios) {
      for (let seed = 0; seed < 40 && fails.length < 12; seed++) {
        const rng = new env.Rng(seed * 7919 + 17);
        const tag = `${scenario} seed ${seed} hooks`;
        try {
          const spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: 'off', ood: seed % 6 === 0 });
          const m0 = fam.init(spec, rng.fork('i'));
          const solved = lib.solveOf(spec, m0);
          const facts = lib.factsOf(solved, spec);
          if (facts.length < 2 || facts.some((f) => !f.label || typeof f.value !== 'string' || !f.value)) fails.push(`${tag}: facts ${JSON.stringify(facts)}`);
          const parts = lib.partsOf(solved, spec);
          if (!parts.length || new Set(parts.map((x) => x.name)).size !== parts.length) fails.push(`${tag}: parts ${JSON.stringify(parts)}`);
          const sil = lib.silentOf(solved, m0, spec, new env.Rng(seed + 3));
          if (sil && lib.errorOf(sil, spec) <= 0) fails.push(`${tag}: silent copy has no error`);
          const ns = lib.retargetOf(spec, solved, new env.Rng(seed + 9));
          if (ns) {
            if (!(lib.errorOf(solved, ns) > 0)) fails.push(`${tag}: retarget already met`);
            if (!Number.isFinite(lib.errorOf(fam.init(ns, new env.Rng(seed + 1)), ns))) fails.push(`${tag}: retarget init error`);
            if (typeof fam.instruction(ns, new env.Rng(seed + 2)) !== 'string') fails.push(`${tag}: retarget instruction`);
            if (lib.errorOf(lib.solveOf(ns, solved), ns) !== 0) fails.push(`${tag}: retarget solve() not on target`);
          }
          for (const judge of fam.judgeModes) {
            const js = fam.sample(new env.Rng(seed * 31 + 5), { scenario, scenarios: fam.scenarios, startMode: 'off', judge });
            if (!js.judge) continue;
            const jm = fam.init(js, new env.Rng(seed + 7));
            if (lib.errorOf(jm, js) !== 0) fails.push(`${tag} ${judge}: start is not solved`);
            if (!js.judge.what || !js.judge.what.length || js.judge.what.some((w) => !w)) fails.push(`${tag} ${judge}: no what`);
            const text = fam.instruction(js, new env.Rng(seed + 4));
            if (!text) fails.push(`${tag} ${judge}: no instruction`);
          }
        } catch (e) {
          fails.push(`${tag}: ${e.stack || e}`);
        }
      }
    }
  }

  function tallBoards(T) {
    const fails = T.fails;
    // Scrollable boards (traits.tall): the plan scrolls (wheel or thumb) and hops so every drag has both ends on screen.
    for (const scenario of ['single', 'collect', 'sort']) {
      for (let seed = 0; seed < 40; seed++) {
        const rng = new env.Rng(seed * 131 + 7);
        const tag = `${scenario} tall seed ${seed}`;
        const spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: modes[seed % 3], ood: seed % 6 === 0,
          traits: { tall: true, noPile: true, snap: true }, route: seed % 3 === 1 ? 'wheel' : seed % 3 === 2 ? 'pointer' : undefined });
        if (!spec.tall || !spec.snap || spec.pile) fails.push(`${tag}: traits not applied`);
        const model = fam.init(spec, rng.fork('i'));
        const m = { pos: { ...model.pos }, z: model.z.slice(), view: { top: 0, h: spec.tall, boardH: 600 } };
        const vis = (y) => lib.seen(spec, m.view, y);
        let n = 0;
        for (; n < 40; n++) {
          const st = lib.boxPlan(m, spec);
          if (!st) break;
          if (st.wheel) m.view = { ...m.view, top: Math.max(0, Math.min(1 - spec.tall, m.view.top + st.wheel[1] / 600)) };
          else if (st.drag[0].thumb) m.view = { ...m.view, top: Math.max(0, Math.min(1 - spec.tall, st.drag[1].thumbAt)) };
          else {
            const from = m.pos[st.drag[0].item];
            if (!vis(from[1]) || !vis(st.drag[1].point[1])) fails.push(`${tag}: drag ends off screen at step ${n}`);
            lib.applyBoxStep(spec, m, st);
          }
        }
        if (lib.boxError(m, spec) !== 0 || n >= 36) fails.push(`${tag}: tall plan ends at ${lib.boxError(m, spec)} after ${n} steps`);
      }
    }
  }

  function tidyLayouts(T) {
    const fails = T.fails;
    // Layout traits (central / rows, item size and count): tidy starts clear of the bins, plan solves them.
    for (const [scenario, layout] of [['single', 'central'], ['single', 'rows'], ['collect', 'central'], ['collect', 'rows'], ['sort', 'rows']]) {
      for (let seed = 0; seed < 40; seed++) {
        const rng = new env.Rng(seed * 313 + 11);
        const tag = `${scenario}/${layout} seed ${seed}`;
        const startMode = modes[seed % 3];
        const traits = layout === 'rows' ? { layout, itemsAt: seed % 2 ? 'above' : 'below' } : { layout };
        if (scenario === 'collect') { traits.itemCount = seed % 4 === 0 ? 12 : [6, 12]; traits.itemSize = [0.095, 0.11]; }
        let spec;
        let model;
        try {
          spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 6 === 0, traits });
          model = fam.init(spec, rng.fork('i'));
        } catch (e) {
          fails.push(`${tag}: ${e.stack || e}`);
          continue;
        }
        if (spec.layout !== layout || spec.pile) fails.push(`${tag}: layout not applied`);
        if (scenario === 'collect' && layout === 'central' && spec.containers.length !== 1) fails.push(`${tag}: ${spec.containers.length} bins`);
        if (scenario === 'collect' && spec.items.length < 6) fails.push(`${tag}: ${spec.items.length} items`);
        for (const c of spec.containers) {
          if (c.x < 0 || c.y < 0 || c.x + c.w > 1 + lib.EPS || c.y + c.h > 1 + lib.EPS) fails.push(`${tag}: ${c.id} off the board`);
        }
        if (spec.rule.mode !== 'remove' && startMode === 'off') {
          for (const it of spec.items) if (lib.where(spec, model.pos[it.id]) !== 'out') fails.push(`${tag}: ${it.id} does not start outside`);
        }
        let m = { pos: { ...model.pos }, z: model.z.slice() };
        let n = 0;
        for (; n < 40; n++) {
          const step = lib.boxPlan(m, spec);
          if (!step) break;
          m = lib.applyBoxStep(spec, m, step);
        }
        if (lib.boxError(m, spec) !== 0) fails.push(`${tag}: plan ends at error ${lib.boxError(m, spec)} after ${n} steps`);
        if (lib.boxError(lib.solveOf(spec, model), spec) !== 0) fails.push(`${tag}: solve() not on target`);
        if (startMode !== 'off' && lib.boxError(model, spec) <= 0) fails.push(`${tag}: ${startMode} start solved`);
        // Without the layout traits the sample is the unforced one.
        const plain = fam.sample(new env.Rng(seed).fork('p'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 6 === 0 });
        const plain2 = fam.sample(new env.Rng(seed).fork('p'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 6 === 0, traits: {} });
        if (JSON.stringify(plain) !== JSON.stringify(plain2) || plain.startPos) fails.push(`${tag}: empty traits changed the sample`);
      }
    }
  }

  function paletteTraits(T) {
    const fails = T.fails;
    // Palette trait (collect): blue targets, black and outline-only distractors; the instruction names the target color.
    for (let seed = 0; seed < 60; seed++) {
      const rng = new env.Rng(seed * 97 + 5);
      const tag = `collect/palette seed ${seed}`;
      const startMode = modes[seed % 3];
      const traits = seed % 3 === 0 ? { palette: {} } : seed % 3 === 1 ? { palette: { target: 'blue', distractors: ['black', 'outline'] }, layout: 'central', itemCount: 12 }
        : { palette: { target: 'green', distractors: ['outline', 'red'] }, layout: 'rows' };
      let spec;
      let model;
      try {
        spec = fam.sample(rng.fork('s'), { scenario: 'collect', scenarios: fam.scenarios, startMode, ood: seed % 6 === 0, traits });
        model = fam.init(spec, rng.fork('i'));
      } catch (e) {
        fails.push(`${tag}: ${e.stack || e}`);
        continue;
      }
      const want = traits.palette.target || 'blue';
      const dist = traits.palette.distractors || ['black', 'outline'];
      if (!spec.palette || spec.palette.target !== want || spec.rule.kind !== 'color' || spec.rule.value !== want) fails.push(`${tag}: palette not applied ${JSON.stringify(spec.rule)}`);
      const instr = fam.instruction(spec, rng.fork('n'));
      if (!instr.toLowerCase().includes(want)) fails.push(`${tag}: instruction does not name ${want}: ${instr}`);
      const mode = spec.rule.mode;
      for (const it of spec.items) {
        const g = spec.goal[it.id];
        const isT = it.color === want;
        if (isT && it.fill !== 'solid') fails.push(`${tag}: ${it.id} target ${it.fill}`);
        if (!isT) {
          const kind = it.fill === 'outline' ? 'outline' : it.color;
          if (!dist.includes(kind) || (it.fill === 'outline' && it.color !== 'black')) fails.push(`${tag}: ${it.id} distractor ${it.color}/${it.fill}`);
          if (mode === 'in' && g !== 'out') fails.push(`${tag}: ${it.id} distractor goal ${g}`);
        } else if (mode === 'in' && g === 'out') fails.push(`${tag}: ${it.id} target goal out`);
      }
      const nd = spec.items.filter((it) => it.color !== want);
      if (nd.length >= dist.length) for (const d of dist) if (!nd.some((it) => (it.fill === 'outline' ? 'outline' : it.color) === d)) fails.push(`${tag}: no ${d} distractor`);
      let m = { pos: { ...model.pos }, z: model.z.slice() };
      for (let n = 0; n < 40; n++) {
        const step = lib.boxPlan(m, spec);
        if (!step) break;
        m = lib.applyBoxStep(spec, m, step);
      }
      if (lib.boxError(m, spec) !== 0) fails.push(`${tag}: plan ends at error ${lib.boxError(m, spec)}`);
      if (lib.boxError(lib.solveOf(spec, model), spec) !== 0) fails.push(`${tag}: solve() not on target`);
      // Without the trait the sample is the unforced one (empty traits object: same).
      const plain = fam.sample(new env.Rng(seed).fork('p'), { scenario: 'collect', scenarios: fam.scenarios, startMode, ood: seed % 6 === 0 });
      const plain2 = fam.sample(new env.Rng(seed).fork('p'), { scenario: 'collect', scenarios: fam.scenarios, startMode, ood: seed % 6 === 0, traits: {} });
      if (JSON.stringify(plain) !== JSON.stringify(plain2) || plain.palette || plain.items.some((it) => it.fill)) fails.push(`${tag}: plain sample changed`);
    }
  }

  function geometryTraits(T) {
    const fails = T.fails;
    // Geometry traits: items beside / above / below the bins, bins in a row / column / grid, declared rects.
    const runBoxes = (tag, spec, model) => {
      for (const c of spec.containers) {
        if (c.x < -lib.EPS || c.y < -lib.EPS || c.x + c.w > 1 + lib.EPS || c.y + c.h > 1 + lib.EPS) fails.push(`${tag}: ${c.id} off the board`);
      }
      spec.containers.forEach((c, i) => spec.containers.forEach((o, j) => { if (j < i && lib.overlap(lib.boxRect(c), lib.boxRect(o))) fails.push(`${tag}: ${o.id} and ${c.id} overlap`); }));
      if (spec.rule.mode !== 'remove' && spec.startMode === 'off') {
        for (const it of spec.items) if (lib.where(spec, model.pos[it.id]) !== 'out') fails.push(`${tag}: ${it.id} does not start outside`);
      }
      for (const it of spec.items) {
        const q = lib.itemRect(spec, model.pos[it.id]);
        if (q[0] < -lib.EPS || q[1] < -lib.EPS || q[2] > 1 + lib.EPS || q[3] > 1 + lib.EPS) fails.push(`${tag}: ${it.id} starts off the board`);
      }
      if (spec.rule.mode === 'spatial' || (spec.scenario === 'collect' && spec.containers.length === 2)) {
        const sd = lib.sidesOf(spec.containers[0], spec.containers[1]);
        if (!sd || sd[0] !== spec.containers[0].side || sd[1] !== spec.containers[1].side) fails.push(`${tag}: spatial sides ${spec.containers.map((c) => c.side)} do not match the geometry`);
      }
      let m = { pos: { ...model.pos }, z: model.z.slice() };
      let n = 0;
      for (; n < 40; n++) {
        const step = lib.boxPlan(m, spec);
        if (!step) break;
        m = lib.applyBoxStep(spec, m, step);
      }
      if (lib.boxError(m, spec) !== 0) fails.push(`${tag}: plan ends at error ${lib.boxError(m, spec)} after ${n} steps`);
      if (lib.boxError(lib.solveOf(spec, model), spec) !== 0) fails.push(`${tag}: solve() not on target`);
      if (spec.startMode !== 'off' && lib.boxError(model, spec) <= 0) fails.push(`${tag}: ${spec.startMode} start solved`);
    };
    const trial = (tag, scenario, seed, traits) => {
      const rng = new env.Rng(seed * 577 + 3);
      try {
        const spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: modes[seed % 3], ood: seed % 5 === 0, traits });
        return [spec, fam.init(spec, rng.fork('i'))];
      } catch (e) {
        fails.push(`${tag}: ${e.stack || e}`);
        return [null, null];
      }
    };
    for (const scenario of ['single', 'collect', 'sort']) {
      for (const at of lib.ITEMS_AT) {
        for (const orient of [undefined, ...lib.ORIENTS]) {
          for (let seed = 0; seed < 6; seed++) {
            const tag = `${scenario} itemsAt=${at} orient=${orient} seed ${seed}`;
            const [spec, model] = trial(tag, scenario, seed, orient ? { itemsAt: at, orient } : { itemsAt: at });
            if (!spec) continue;
            if (spec.layout !== 'rows' || spec.itemsAt !== at || spec.orient !== (orient || (at === 'left' || at === 'right' ? 'column' : 'row'))) fails.push(`${tag}: traits not applied`);
            // The items wait on the declared side of every bin.
            const ys = spec.items.map((it) => spec.startPos[it.id][1]);
            const xs = spec.items.map((it) => spec.startPos[it.id][0]);
            const B = spec.containers;
            const okSide = at === 'below' ? Math.min(...ys) > Math.max(...B.map((c) => c.y + c.h)) : at === 'above' ? Math.max(...ys) < Math.min(...B.map((c) => c.y))
              : at === 'left' ? Math.max(...xs) < Math.min(...B.map((c) => c.x)) : Math.min(...xs) > Math.max(...B.map((c) => c.x + c.w));
            if (!okSide) fails.push(`${tag}: items do not wait ${at} the bins`);
            if (B.length > 1 && orient === 'column' && !B.every((c, i) => i === 0 || c.y >= B[i - 1].y + B[i - 1].h - lib.EPS)) fails.push(`${tag}: bins not stacked`);
            if (B.length > 1 && (orient === 'row' || (!orient && !(at === 'left' || at === 'right'))) && !B.every((c, i) => i === 0 || c.x >= B[i - 1].x + B[i - 1].w - lib.EPS)) fails.push(`${tag}: bins not side by side`);
            runBoxes(tag, spec, model);
          }
        }
      }
    }
    const R = (x, y, w, h) => ({ x, y, w, h });
    const RECTS = {
      single: [[R(0.6, 0.3, 0.3, 0.4)], [R(0.05, 0.05, 0.25, 0.35)]],
      collect: [[R(0.35, 0.05, 0.3, 0.5)], [R(0.04, 0.08, 0.3, 0.45), R(0.66, 0.08, 0.3, 0.45)], [R(0.6, 0.04, 0.36, 0.42), R(0.6, 0.54, 0.36, 0.42)]],
      sort: [[R(0.05, 0.05, 0.4, 0.4), R(0.55, 0.05, 0.4, 0.4)], [R(0.62, 0.03, 0.34, 0.45), R(0.62, 0.52, 0.34, 0.45)],
        [R(0.04, 0.04, 0.28, 0.44), R(0.36, 0.04, 0.28, 0.44), R(0.68, 0.04, 0.28, 0.44)],
        [R(0.52, 0.03, 0.22, 0.45), R(0.76, 0.03, 0.22, 0.45), R(0.52, 0.52, 0.22, 0.45), R(0.76, 0.52, 0.22, 0.45)],
        [R(0.06, 0.1, 0.24, 0.42), R(0.4, 0.5, 0.26, 0.42), R(0.72, 0.06, 0.24, 0.4)]],
    };
    for (const [scenario, sets] of Object.entries(RECTS)) {
      sets.forEach((rects, si) => {
        // Rects spread over the whole board leave no band for a tidy start: those sets are scatter-only.
        const spread = scenario === 'sort' && si === 4;
        for (const layout of spread ? [undefined] : [undefined, 'rows']) {
          for (let seed = 0; seed < 8; seed++) {
            const tag = `${scenario} containers#${si} layout=${layout} seed ${seed}`;
            const traits = layout ? { containers: rects, layout } : { containers: { [scenario]: rects } };
            const [spec, model] = trial(tag, scenario, seed, traits);
            if (!spec) continue;
            const got = spec.containers.map((c) => [c.x, c.y, c.w, c.h].join());
            if (got.join('|') !== rects.map((q) => [q.x, q.y, q.w, q.h].join()).join('|')) fails.push(`${tag}: containers not the declared rects`);
            if (!!spec.startPos !== !!layout) fails.push(`${tag}: start ${spec.startPos ? 'tidy' : 'scattered'}`);
            runBoxes(tag, spec, model);
          }
        }
      });
    }
    // Malformed geometry traits throw (nothing is clamped or ignored).
    const throws = (label, scenario, traits) => {
      try {
        fam.sample(new env.Rng(5).fork('s'), { scenario, scenarios: fam.scenarios, startMode: 'off', traits });
        fails.push(`malformed ${label}: no error`);
      } catch (e) {
        if (!/^bins: traits\./.test(e.message)) fails.push(`malformed ${label}: unclear error ${e.message}`);
      }
    };
    throws('itemsAt', 'collect', { itemsAt: 'under' });
    throws('orient', 'sort', { orient: 'diagonal' });
    throws('layout', 'collect', { layout: 'grid' });
    throws('central+itemsAt', 'collect', { layout: 'central', itemsAt: 'left' });
    throws('overlap', 'sort', { containers: [R(0.1, 0.1, 0.4, 0.4), R(0.4, 0.3, 0.4, 0.4)] });
    throws('off board', 'single', { containers: [R(0.8, 0.1, 0.3, 0.3)] });
    throws('zero size', 'single', { containers: [R(0.3, 0.1, 0, 0.3)] });
    throws('NaN', 'single', { containers: [R(0.3, NaN, 0.2, 0.3)] });
    throws('count', 'single', { containers: [R(0.05, 0.1, 0.3, 0.3), R(0.6, 0.1, 0.3, 0.3)] });
    throws('variant key', 'sort', { containers: { sorting: [] } });
    throws('no band', 'sort', { layout: 'rows', containers: RECTS.sort[4] });
    throws('too small', 'sort', { containers: [R(0.1, 0.1, 0.04, 0.05), R(0.6, 0.1, 0.04, 0.05)] });
    // Containment primitives.
    const spec = { aspect: 1, item: { w: 0.1, h: 0.1 }, containers: [{ id: 'c', x: 0.2, y: 0.2, w: 0.3, h: 0.3, head: 0 }] };
    T.check(lib.where(spec, [0.35, 0.35]) === 'c', 'where: center not inside');
    T.check(lib.where(spec, [0.25, 0.35]) === 'c', 'where: flush edge not inside');
    T.check(lib.where(spec, [0.24, 0.35]) === 'partial', 'where: crossing edge not partial');
    T.check(lib.where(spec, [0.1, 0.35]) === 'out', 'where: touching edge not out');
    T.check(lib.where(spec, [0.05, 0.05]) === 'out', 'where: far item not out');
    return fails;
  }

  env.selfTest('sort-into-bins', (T) => {
    episodes(T);
    if (T.fails.length > 12) return;
    episodeHooks(T);
    tallBoards(T);
    tidyLayouts(T);
    paletteTraits(T);
    geometryTraits(T);
  });
})();
