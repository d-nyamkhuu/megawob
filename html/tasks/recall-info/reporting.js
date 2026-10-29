/* recall-info/reporting.js: report facts, silent save faults and retargeting over the same records. */
(function () {
  'use strict';
  const { alnum, clone, fmtNum, rowsOnPage } = env.taskOf('recall-info').lib;
  const V = env.scenariosOf('recall-info');

  function facts(model, spec) {
    if (spec.judge) return [];
    switch (spec.scenario) {
      case 'code':
        return [{ label: spec.codeLabel, value: spec.code, labels: [spec.codeLabel.toLowerCase(), 'code on file'] },
          { label: 'Status', value: spec.labels.done }];
      case 'count':
        return [{ label: 'Answer on file', value: String(spec.answer), labels: [spec.ansLabel] }, { label: 'Items in list', value: String(spec.T) }];
      case 'paginate': {
        const r = spec.rows[spec.target];
        return [{ label: 'Selected', value: r.name }, { label: spec.numCol, value: fmtNum(spec, r.num) }, { label: spec.catCol, value: r.cat }];
      }
      case 'crossref':
        return spec.fields.slice(0, 3).map((f) => ({ label: f.label, value: f.truth }));
      default: {
        const it = spec.items[spec.target];
        return [{ label: 'Your choice', value: it.name, labels: ['Chosen'] }, { label: 'Price', value: `$${it.price.toFixed(2)}` }];
      }
    }
  }

  function silent(next, prev, spec, rng) {
    if (spec.judge) return null;
    const out = clone(next);
    switch (spec.scenario) {
      case 'code':
        if (!next.confirmed || prev.confirmed || alnum(next.saved).length < 3) return null;
        out.saved = next.saved.slice(0, -1);
        return out;
      case 'count':
        if (!next.committed || String(next.saved).length < 2) return null;
        out.saved = String(next.saved).slice(0, -1);
        return out;
      case 'crossref': {
        if (!next.committed || !next.saved) return null;
        const cands = spec.fields.filter((f) => alnum(next.saved[f.id]).length >= 5);
        if (!cands.length) return null;
        const f = cands.reduce((b, x) => (x.truth.length > b.truth.length ? x : b));
        out.saved[f.id] = String(next.saved[f.id]).slice(0, Math.max(3, String(next.saved[f.id]).length - rng.int(2, 3)));
        return out;
      }
      default: {
        if (next.picked == null || next.picked === prev.picked) return null;
        const n = spec.scenario === 'paginate' ? rowsOnPage(spec, next.page) : spec.items.map((_, i) => i);
        const nb = n.filter((i) => i !== next.picked && i !== spec.target && Math.abs(n.indexOf(i) - n.indexOf(next.picked)) === 1);
        if (!nb.length) return null;
        out.picked = rng.pick(nb);
        return out;
      }
    }
  }

  function retarget(spec, model, rng) {
    if (spec.judge) return null;
    if (spec.scenario === 'count') {
      const cands = spec.critVals.filter((v) => v !== spec.critVal && V.count.countOfVal(spec, v) >= 1
        && String(V.count.countOfVal(spec, v)) !== model.entered && String(V.count.countOfVal(spec, v)) !== String(model.saved));
      if (!cands.length) return null;
      const v = rng.pick(cands);
      const out = clone(spec);
      out.critVal = v;
      out.answer = V.count.countOfVal(spec, v);
      return out;
    }
    if (spec.scenario === 'paginate' || spec.scenario === 'compare') {
      const asks = (spec.scenario === 'paginate' ? V.paginate.asks(spec) : V.compare.asks(spec))
        .filter((a) => a.target !== spec.target && a.target !== model.picked);
      if (!asks.length) return null;
      const out = clone(spec);
      out.ask = rng.pick(asks);
      out.target = out.ask.target;
      return out;
    }
    if (spec.scenario === 'crossref') {
      const out = clone(spec);
      let changed = false;
      // Flip the source tab of the shared-key fields (the two source tabs are tabNames[0] / [1]).
      const idxOf = (name) => out.tabs.findIndex((t) => t.name === name);
      const a = idxOf(out.tabNames[0]);
      const b = idxOf(out.tabNames[1]);
      for (const f of out.fields) {
        if (f.keyId === null) continue;
        const toB = f.src === a;
        const val = out.recs[toB ? 1 : 0][f.keyId];
        if (alnum(val) === alnum(f.truth)) continue;
        if (changed && !rng.bool(0.6)) continue;
        f.src = toB ? b : a;
        f.truth = val;
        changed = true;
      }
      return changed ? out : null;
    }
    return null;
  }

  Object.assign(env.taskOf('recall-info').lib, { facts, silent, retarget });
})();
