/*
 * use-data-grid / find a row on a paged grid and tick it
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { cmp, domCol, fill, inPage, jaccard, keyCol, nameCol, pageCount, pagerItems, pageRows, pageSizeOf, pick, rowOf,
    say, visibleRows } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'paginate',
    inputs: ['pointer', 'keyboard', 'wheel'],
    rows: [[18, 42], [50, 90]],
    levelRows: { easy: [12, 18], medium: [16, 28] },
    goal(rng, spec, dom) {
    spec.pageSize = rng.int(spec.ood ? 6 : 6, spec.ood ? 8 : 10);
    const n = spec.rows.length;
    if (n <= spec.pageSize) return null;
    const how = rng.pick(['key', 'name', 'name', 'max', 'min']);
    let row;
    let col;
    if (how === 'key' || how === 'name') {
      col = (how === 'key' ? keyCol(dom) : nameCol(dom)).id;
      row = spec.rows[rng.int(spec.pageSize, n - 1)];
    } else {
      const numeric = dom.cols.filter((c) => (c.type === 'money' || c.type === 'num' || c.type === 'date') && c.ext);
      col = rng.pick(numeric).id;
      const vals = spec.rows.map((r) => r.c[col]);
      const best = how === 'max' ? vals.reduce((a, b) => (cmp(b, a) > 0 ? b : a)) : vals.reduce((a, b) => (cmp(b, a) < 0 ? b : a));
      const hits = spec.rows.filter((r) => r.c[col] === best);
      if (hits.length !== 1) return null;
      row = hits[0];
      if (spec.rows.indexOf(row) < spec.pageSize) return null;
    }
    spec.goal = { row: row.id, how, col };
    spec.target = [row.id];
    spec.route = how === 'max' || how === 'min' ? rng.pick(['pages', 'sort']) : 'pages';
    return { need: [col, nameCol(dom).id] };
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const ids = spec.rows.map((r) => r.id);
      const order = visibleRows(m, spec).map((r) => r.id);
      const tp = Math.floor(order.indexOf(g.row) / pageSizeOf(m, spec));
      if (mode === 'partial') m.page = tp;
      else if (mode === 'wrong') {
        const wrongs = ids.filter((x) => x !== g.row);
        m.selected = [rng.pick(wrongs)];
      } else if (rng.bool(0.3) && tp > 1) m.page = rng.int(0, tp - 1);
    },
    solve(spec, m) {
      const g = spec.goal;
      return { ...m, selected: [g.row] };
    },
    error(m, spec) {
      const g = spec.goal;
      const t = g.row;
      if (m.selected.includes(t)) return 0.6 * (1 - jaccard(m.selected, [t]));
      return pageRows(m, spec).some((r) => r.id === t) ? 0.6 : 1;
    },
    plan(m, spec) {
      const g = spec.goal;
      if (m.menu || m.markMenu) return { click: { blank: true } };
      const extra = m.selected.filter((x) => x !== g.row);
      if (extra.length) {
        if (extra.every((x) => inPage(m, spec, x))) return { click: { row: extra[0] } };
        return { click: { clearSel: true } };
      }
      if (Object.keys(m.filters).length || m.query) {
        const vis = visibleRows(m, spec).some((r) => r.id === g.row);
        if (!vis) return { click: { clearFilters: true } };
      }
      if (spec.route === 'sort' && (g.how === 'max' || g.how === 'min')) {
        const want = g.how === 'max' ? 'desc' : 'asc';
        if (!(m.sort && m.sort.col === g.col && m.sort.dir === want) && !inPage(m, spec, g.row)) return { click: { header: g.col } };
      }
      if (inPage(m, spec, g.row)) {
        if (m.screenRows && !m.screenRows.includes(g.row)) {
          const rows = pageRows(m, spec).map(r => r.id);
          return { wheel: [{ viewport: true }, rows.indexOf(g.row) < rows.indexOf(m.screenRows[0]) ? -140 : 140] };
        }
        return { click: { row: g.row } };
      }
      const order = visibleRows(m, spec).map((r) => r.id);
      const tp = Math.floor(order.indexOf(g.row) / pageSizeOf(m, spec));
      const items = pagerItems(m.page, pageCount(m, spec));
      if (items.includes(tp)) return { click: { page: tp } };
      return { click: { pager: tp > m.page ? 'next' : 'prev' } };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const d = domCol(spec, g.col);
      const row = rowOf(spec, g.row);
      let desc;
      if (g.how === 'key') desc = `${spec.entity} ${row.c[g.col]}`;
      else if (g.how === 'name') {
        const v = row.c[g.col];
        desc = rng.pick({
          orders: [`the order placed by ${v}`, `${v}'s order`, `the row for ${v}`],
          people: [`the employee ${v}`, `${v}'s record`, `the row for ${v}`],
          inventory: [`the product "${v}"`, `the row for "${v}"`, `the "${v}" item`],
          invoices: [`the invoice for ${v}`, `${v}'s invoice`, `the row for ${v}`],
        }[spec.domain]);
      }
      else desc = `the ${g.how === 'max' ? d.ext[0] : d.ext[1]} ${spec.entity}`;
      const T = [
        'Select {desc}.',
        'Select the row for {desc}.',
        'I need {desc} selected, with no other records selected.',
        'Mark {desc} as selected.',
        'Locate {desc} in the table and mark it as selected.',
        'Somewhere in this list is {desc}; select it.',
        'Select {desc} in the list.',
        'Make {desc} the sole selection.',
        'Only {desc} should be selected.',
        'Leave just {desc} selected.',
        'The selection should contain only {desc}.',
        'I want {desc} selected on its own.',
        'Find {desc}; select it alone.',
        'Select {desc}; leave all other rows unselected.',
      ];
      const core = fill(pick(rng, spec, T), { desc });
      return say(rng, spec, core, { terse: `select ${desc}` });
    },
    retarget(s, spec, model, rng) {
      const g = s.goal;
      const candidates = s.rows.filter((r) => !model.selected.includes(r.id));
      if (!candidates.length) return false;
      g.row = rng.pick(candidates).id;
      s.target = [g.row];
      return true;
    },
  });
})();
