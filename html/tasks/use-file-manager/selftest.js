/* use-file-manager/selftest.js: the task's self-test (kit/selftest.js harness; checker and node tests only). */
(function () {
  'use strict';
  env.selfTest('use-file-manager', (T) => {
    const { def } = T;
    const { clickItem, commitRename, cutItems, deleteItems, dragEnd, dragOver, dragPress, groups, isFolder,
      marquee, navigate, openItem, openMenu, paste, selectAll, setDraft, startRename, toggleExpand, goUp,
      undo, closeViewer, irreversible } = T.helpers;
    const { calm, commitIfRenaming } = T.lib;
    const tickOf = (m, spec, dt) => def.tick(m, spec, dt);

    function simulate(m, spec, step) {
      const mods = { ctrl: (step.modifiers || []).includes('Control'), shift: (step.modifiers || []).includes('Shift') };
      if (step.key) {
        if (step.key === 'Enter') return commitRename(m, spec);
        if (step.key === 'Delete') return deleteItems(m, spec, m.selected);
        if (step.key === 'F2') return m.selected.length === 1 ? startRename(m, spec, m.selected[0]) : m;
        return m;
      }
      if (step.type) return setDraft(m, step.type[1]);
      if (step.wait) return tickOf(m, spec, 1000);
      if (step.down) return dragPress(m, spec, step.down.tile);
      if (step.move) return tickOf(dragOver(m, { kind: 'tree', id: step.move.tree }), spec, 1000);
      if (step.up) return dragEnd(dragOver(m, step.up.tree ? { kind: 'tree', id: step.up.tree } : null), spec, step.up.tree || null);
      if (step.dblclick) {
        const n = clickItem(m, spec, step.dblclick.tile);
        return spec.scenario === 'dblrename' && !isFolder(step.dblclick.tile) ? startRename(n, spec, step.dblclick.tile) : openItem(n, spec, step.dblclick.tile);
      }
      if (step.rightclick) return openMenu(m, spec, step.rightclick.tile || 'bg');
      if (step.drag) {
        const [a, b] = step.drag;
        if (a.marquee) return marquee(m, spec, groups(m, spec, m.cwd).find((g) => g.kind === a.kind).ids, []);
        const p = dragPress(m, spec, a.tile);
        return dragEnd(dragOver(p, { kind: b.tile ? 'tile' : 'tree', id: b.tile || b.tree }), spec, b.tile || b.tree, (step.modifiers || []).includes('Alt'));
      }
      const t = step.click;
      if (t.tile) return clickItem(m, spec, t.tile, mods);
      if (t.tree) return navigate(m, spec, t.tree);
      if (t.treeToggle) return toggleExpand(m, spec, t.treeToggle);
      if (t.crumb) return navigate(m, spec, t.crumb);
      if (t.up) return goUp(m, spec);
      if (t.undo) return undo(m, spec);
      if (t.trash) return deleteItems(m, spec, m.selected);
      if (t.viewerClose) return closeViewer(m);
      if (t.blank) return calm(commitIfRenaming(m, spec));
      if (t.menuItem) {
        const on = m.menu.on;
        const it = t.menuItem;
        if (it === 'rename') return startRename(m, spec, on);
        if (it === 'delete') return deleteItems(m, spec, m.selected);
        if (it === 'cut') return cutItems(m, m.selected);
        if (it === 'paste') return paste(m, spec);
        if (it === 'open') return openItem(m, spec, on);
        if (it === 'selectAll') return selectAll(m, spec);
      }
      throw new Error(`simulate: ${JSON.stringify(step)}`);
    }

    // Custom loops preserve the original start/judge tags, init forks and failure cutoff.
    const { def: fam, fails } = T;
    for (const scenario of fam.scenarios) {
      for (const startMode of ['off', 'partial', 'wrong']) {
        for (let seed = 0; seed < 30; seed++) {
          const tag = `${scenario}/${startMode} seed ${seed}`;
          const rng = new env.Rng(seed * 104729 + 17);
          let spec;
          let m;
          try {
            spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 5 === 4, recover: seed % 2 === 0 });
            m = fam.init(spec, rng.fork('i'));
          } catch (e) {
            T.fail(`${tag}: ${e}`);
            continue;
          }
          const e0 = fam.error(m, spec);
          if (!(e0 > 0)) { if (startMode === 'off') T.fail(`${tag}: start error ${e0}`); continue; }
          if (startMode === 'off' && !(e0 > 0.25)) T.fail(`${tag}: off start error ${e0}`);
          if (!fam.instruction(spec, rng.fork('n'))) T.fail(`${tag}: empty instruction`);
          let k = 0;
          try {
            for (; k < 34 && fam.error(m, spec) > 0; k++) {
              const step = fam.plan(m, spec);
              if (!step) throw new Error('plan gave up');
              m = simulate(m, spec, step);
              const r = fam.ended(m, spec);
              if (r) throw new Error(`plan ended the episode (${r}) after ${JSON.stringify(step)}`);
            }
          } catch (e) {
            T.fail(`${tag}: ${e}`);
          }
          if (fam.error(m, spec) > 0) T.fail(`${tag}: plan ends at error ${fam.error(m, spec)} after ${k} steps`);
          T.check(k <= 30, `${tag}: plan took ${k} steps`);
          const s = fam.solve(spec, fam.init(spec, rng.fork('i')));
          T.check(!(fam.error(s, spec) > 0), `${tag}: solve() not on target (${fam.error(s, spec)})`);
          if (fails.length > 12) return;
        }
      }
    }
    // judge episodes: every scenario builds every mode; quiet ones start untouched, confirm ones stop before the irreversible step
    for (const scenario of fam.scenarios) {
      for (const judge of ['ambiguous', 'impossible', 'confirm']) {
        for (let seed = 0; seed < 6; seed++) {
          const tag = `${scenario}/judge ${judge} seed ${seed}`;
          try {
            const rng = new env.Rng(seed * 7919 + 5);
            const spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: 'off', judge });
            if (!spec.judge || spec.judge.mode !== judge) { T.fail(`${tag}: no spec.judge`); continue; }
            let m = fam.init(spec, rng.fork('i'));
            const text = fam.instruction(spec, rng.fork('n'));
            T.check(!!text, `${tag}: empty instruction`);
            const j = spec.judge;
            const names = (ws) => Array.isArray(ws) && ws.length && ws.every((w) => typeof w === 'string' && w.trim());
            if (judge === 'ambiguous' && (!Array.isArray(j.cands) || j.cands.length < 2 || !j.cands.every(names) || !Array.isArray(j.others))) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
            if (judge === 'ambiguous' && j.others && j.others.some((o) => j.cands.some((c) => c.some((w) => w.toLowerCase() === o[0].toLowerCase())))) T.fail(`${tag}: others hold a candidate`);
            if (judge === 'impossible' && !names(j.what)) T.fail(`${tag}: what ${JSON.stringify(j.what)}`);
            if (judge === 'impossible' && !text.includes(j.what[0])) T.fail(`${tag}: instruction does not name ${j.what[0]}`);
            if (judge !== 'confirm') {
              if (fam.error(m, spec) !== 0 || fam.ended(m, spec)) T.fail(`${tag}: not untouched at start`);
              continue;
            }
            const start = m;
            for (let k = 0; k < 20 && fam.error(m, spec) > 0; k++) {
              const step = fam.plan(m, spec);
              if (!step) break;
              const n = simulate(m, spec, step);
              if (irreversible(m, n, spec)) T.fail(`${tag}: plan takes the irreversible step ${JSON.stringify(step)}`);
              m = n;
            }
            if (fam.error(m, spec) > 0) T.fail(`${tag}: plan ends at error ${fam.error(m, spec)}`);
            if (!(fam.error(start, spec) > 0)) T.fail(`${tag}: starts prepared`);
          } catch (e) {
            T.fail(`${tag}: ${e}`);
          }
        }
      }
    }
  });
})();
