/* use-data-grid/selftest.js: task checks; loaded only by kit/selftest.js, never by an episode. */
(function () {
  'use strict';
  env.selfTest('use-data-grid', (T) => {
    const { init: initOf, tolerance: toleranceOf, error: errorOf, instruction: instructionOf, plan: planOf,
      solve: solveOf, silent: silentOf, retarget: retargetOf, facts: factsOf } = T.def;
    const { startEdit, commitEdit, setDraftCell, headerClick, nudgeWidth, setQuery, setWidth, moveCol, setFocus,
      openMenu, setSort, toggleDraft, draftAll, applyFilter, clearFilters, rowClick, toggleRow, toggleAll, clearSel,
      setPageSize, gotoPage, openMark, askBulk, runBulk, cancelConfirm, undo, closeMenus, pagerItems } = T.helpers;
    const { clamp } = env.util;

    function simulate(m, spec, step) {
      if (step.wheel) return { ...m, virtualTop: clamp((m.virtualTop || 0) + Math.round(step.wheel[1] / 22), 0, spec.rows.length - (m.windowSize || 6)) };
      if (step.dblclick) return startEdit(m, spec, step.dblclick.cell[0], step.dblclick.cell[1]);
      if (step.key && step.key === 'Enter' && m.editing) return commitEdit(m, spec);
      if (step.type && step.type[0].cellInput) return setDraftCell(m, step.type[1]);
      if (step.key) {
        if (step.key === 'Enter' && m.focus && m.focus.kind === 'header') return headerClick(m, spec, m.focus.col);
        if (m.focus && m.focus.kind === 'edge') return nudgeWidth(m, m.focus.col, step.key === 'ArrowRight' ? 10 : -10);
        return m;
      }
      if (step.type) return setQuery(m, step.type[1]);
      if (step.drag) {
        const [a, b] = step.drag;
        if (a.edge) return setWidth(m, a.edge, b.edgeAt[1]);
        return moveCol(m, a.header, b.slot);
      }
      const t = step.click;
      const shift = (step.modifiers || []).includes('Shift');
      if (t.header) return setFocus(headerClick(m, spec, t.header), { kind: 'header', col: t.header });
      if (t.edge) return setFocus(m, { kind: 'edge', col: t.edge });
      if (t.menuBtn) return openMenu(m, spec, t.menuBtn, 'col');
      if (t.funnel) return openMenu(m, spec, t.funnel, 'filter');
      if (t.menuItem) return setSort(m, m.menu.col, t.menuItem === 'clear' ? null : t.menuItem);
      if (t.filterOpt !== undefined) return toggleDraft(m, t.filterOpt);
      if (t.filterAll) return draftAll(m, spec);
      if (t.filterApply) return applyFilter(m, spec);
      if (t.clearFilters) return clearFilters(m);
      if (t.rowBody) return rowClick(m, spec, t.rowBody, { shift, ctrl: (step.modifiers || []).includes('Control') });
      if (t.row) return toggleRow(m, spec, t.row, shift);
      if (t.all) return toggleAll(m, spec);
      if (t.clearSel) return clearSel(m);
      if (t.pageSize) return setPageSize(m, spec, t.pageSize);
      if (t.page !== undefined) return gotoPage(m, spec, t.page);
      if (t.pager) return gotoPage(m, spec, m.page + (t.pager === 'next' ? 1 : -1));
      if (t.bulk) return t.bulk === 'status' ? openMark(m) : askBulk(m, spec, t.bulk, null);
      if (t.statusOpt) return runBulk(m, spec, 'status', t.statusOpt);
      if (t.confirm) return t.confirm === 'ok' ? runBulk(m, spec, m.confirm.action, m.confirm.value) : cancelConfirm(m);
      if (t.undo) return undo(m, spec);
      if (t.blank) return closeMenus(m);
      throw new Error(`simulate: unknown step ${JSON.stringify(step)}`);
    }

    const fails = T.fails;
    const fam = T.def;
    for (const scenario of fam.scenarios) {
      for (const startMode of ['off', 'partial', 'wrong']) {
        for (let seed = 0; seed < 30; seed++) {
          const tag = `${scenario}/${startMode} seed ${seed}`;
          const rng = new env.Rng(seed * 7919 + 13);
          let spec;
          let m;
          try {
            spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 5 === 4, recover: seed % 2 === 0 });
            m = initOf(spec, rng.fork('i'));
          } catch (e) {
            T.fail(`${tag}: ${e}`);
            continue;
          }
          const tol = toleranceOf(spec);
          const e0 = errorOf(m, spec);
          if (!(e0 > tol.tau)) { if (startMode === 'off') T.fail(`${tag}: start error ${e0}`); continue; }
          T.check(instructionOf(spec, rng.fork('n')), `${tag}: empty instruction`);
          let k = 0;
          try {
            for (; k < 34 && errorOf(m, spec) > tol.tau; k++) {
              const step = planOf(m, spec);
              if (!step) throw new Error('plan gave up');
              m = simulate(m, spec, step);
              const r = fam.ended(m, spec);
              if (r) throw new Error(`plan ended the episode (${r}) after ${JSON.stringify(step)}`);
            }
          } catch (e) {
            T.fail(`${tag}: ${e}`);
          }
          if (errorOf(m, spec) > tol.tau) T.fail(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
          T.check(k <= 30, `${tag}: plan took ${k} steps`);
          const s = solveOf(spec, initOf(spec, rng.fork('i')));
          if (errorOf(s, spec) > tol.tau) T.fail(`${tag}: solve() not on target (${errorOf(s, spec)})`);
          if (fails.length > 12) return;
        }
      }
    }
    for (const scenario of fam.scenarios) {
      const rng = new env.Rng(7919);
      const spec = fam.sample(rng.fork('hooks'), { scenario, startMode: 'off', level: 'normal' });
      const initial = initOf(spec, rng.fork('init'));
      const solved = solveOf(spec, initial);
      const before = JSON.stringify([initial, solved, spec]);
      const corrupt = silentOf(solved, initial, spec, rng.fork('silent'));
      if (corrupt && !(errorOf(corrupt, spec) > toleranceOf(spec).tau)) T.fail(`${scenario}: silent did not break the save`);
      const switched = retargetOf(spec, solved, rng.fork('retarget'));
      if (switched && (!(errorOf(solved, switched) > toleranceOf(switched).tau) || !Number.isFinite(errorOf(initial, switched)))) T.fail(`${scenario}: invalid retarget`);
      T.check(before === JSON.stringify([initial, solved, spec]), `${scenario}: hook mutated its input`);
      T.check(factsOf(solved, spec).every(f => typeof f.value === 'string'), `${scenario}: facts must be strings`);
      for (const mode of ['ambiguous', 'confirm']) {
        const j = fam.sample(rng.fork(mode), { scenario, startMode: 'off', judge: mode });
        let m = initOf(j, rng.fork('judge-init'));
        if (mode === 'ambiguous' && errorOf(m, j) !== 0) T.fail(`${scenario}: ambiguous start`);
        if (mode === 'ambiguous') {
          const jd = j.judge;
          if (!(jd.cands && jd.cands.length === 2 && jd.cands.every((c) => c[0]) && jd.cands[0][0] !== jd.cands[1][0])) T.fail(`${scenario}: cands ${JSON.stringify(jd.cands)}`);
          if (!jd.name || !instructionOf(j, rng.fork('jt'))) T.fail(`${scenario}: ambiguous instruction`);
        }
        if (mode === 'confirm' && errorOf(m, j) <= toleranceOf(j).tau) T.fail(`${scenario}: confirm starts prepared`);
        for (let i = 0; i < 60 && errorOf(m, j) > toleranceOf(j).tau; i++) m = simulate(m, j, planOf(m, j));
        if (errorOf(m, j) > toleranceOf(j).tau) T.fail(`${scenario}: judge preparation failed`);
      }
    }
    T.check(JSON.stringify(pagerItems(5, 12)) === JSON.stringify([0, '…', 4, 5, 6, '…', 11]), `pagerItems ${pagerItems(5, 12)}`);
  });
})();
