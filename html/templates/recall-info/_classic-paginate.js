/* recall-info/_classic-paginate: classic's paginate parts and view builder; part names stay in classic. */
(function () {
  'use strict';

  function parts(S, shared) {
    const { el, titleLine } = shared;
    const BASE = {};
    // paginate: a selectable paginated results table.
    const paginateHeading = (ctx, work) => titleLine(ctx, work, `${ctx.spec.rows.length} results`);

    BASE.table = (ctx, work) => {
      const { spec } = ctx;
      const sel = el('div', 'ur-sel', work);
      const tbl = el('div', 'ur-tbl', work);
      const th = el('div', 'ur-thead ur-grid', tbl);
      [...spec.cols, ''].forEach((c) => el('span', '', th, c));
      return { sel, tbl };
    };

    const paginateRow = (ctx, tbl, k, pick) => {
      const { spec } = ctx;
      const r = el('div', 'ur-trow ur-grid', tbl);
      const name = el('span', '', r);
      const num = el('span', 'num', r);
      const rate = el('span', 'num', r);
      const cat = el('span', '', r);
      const b = el('button', 'ur-btn small', r, spec.actLabel);
      b.type = 'button';
      b.addEventListener('click', pick);
      el('span', 'ur-badge', cat);
      S.P.decorated(ctx, r, k);
      return { r, name, num, rate, cat: cat.firstChild, b, idx: null };
    };

    BASE.pager = (ctx, work, apply) => {
      const { spec } = ctx;
      const pages = spec.pages;
      const pager = el('div', 'ur-pager', work);
      const pb = {};
      pb.prev = el('button', 'ur-btn small', pager, spec.pager === 'numbers' ? '‹' : '‹ Previous');
      pb.nums = [];
      let pageText = null;
      if (spec.pager === 'numbers') {
        for (let p = 0; p < pages; p++) {
          const b = el('button', 'ur-btn small', pager, String(p + 1));
          b.type = 'button';
          b.addEventListener('click', () => apply({ goto: p }));
          pb.nums.push(b);
        }
      } else pageText = el('span', '', pager);
      pb.next = el('button', 'ur-btn small', pager, spec.pager === 'numbers' ? '›' : 'Next ›');
      pb.prev.type = 'button';
      pb.next.type = 'button';
      pb.prev.addEventListener('click', () => apply({ prev: true }));
      pb.next.addEventListener('click', () => apply({ next: true }));
      return { pb, pageText };
    };

    BASE.rowData = (ctx, sl, row, on) => {
      const { spec } = ctx;
      const fam = env.taskDef;
      sl.name.textContent = row.name;
      sl.name.title = row.name;
      sl.num.textContent = fam.helpers.fmtNum(spec, row.num);
      sl.rate.textContent = `★ ${row.rate.toFixed(2)}`;
      sl.cat.textContent = row.cat;
      sl.b.textContent = on ? '✓ Selected' : spec.actLabel;
      sl.b.classList.toggle('on', on);
    };

    BASE.selection = (ctx, sel, m) => {
      const { spec } = ctx;
      const fam = env.taskDef;
      sel.innerHTML = '';
      if (m.picked == null) sel.append('Nothing selected yet');
      else {
        const r = spec.rows[m.picked];
        sel.append('Selected: ');
        el('b', '', sel, r.name);
        sel.append(` · ${spec.numCol} ${fam.helpers.fmtNum(spec, r.num)} · ★ ${r.rate.toFixed(2)} · ${spec.catCol}: ${r.cat}`);
      }
    };

    return { parts: BASE, paginateHeading, paginateRow };
  }

  function build(S, shared) {
    const { el, center, actions, fitPanels } = shared;
    return (ctx, work, app) => {
      const { spec } = ctx;
      const fam = env.taskDef;
      const per = spec.perPage;
      const pages = spec.pages;
      const apply = actions(ctx, paint);
      app.style.setProperty('--ur-cols', S.D.columns);
      const total = S.P.heading(ctx, work);
      const { sel, tbl } = S.P.table(ctx, work);
      const slots = [];
      for (let k = 0; k < per; k++) {
        slots.push(S.P.row(ctx, tbl, k, () => { const i = slots[k].idx; if (i !== null) apply({ pick: i }); }));
      }
      const { pb, pageText } = S.P.pager(ctx, work, apply);
      function paint(m) {
        const idxs = fam.helpers.rowsOnPage(spec, m.page);
        slots.forEach((sl, k) => {
          const i = idxs[k];
          sl.idx = i === undefined ? null : i;
          sl.r.classList.toggle('off', i === undefined);
          if (i === undefined) return;
          const row = spec.rows[i];
          S.P.rowData(ctx, sl, row, m.picked === i);
        });
        S.P.selection(ctx, sel, m);
        const a = m.page * per + 1;
        const z = Math.min(spec.rows.length, (m.page + 1) * per);
        total.textContent = `${spec.rows.length} results · showing ${a}-${z}`;
        pb.nums.forEach((b, p) => b.classList.toggle('on', p === m.page));
        if (pageText) pageText.textContent = `Page ${m.page + 1} of ${pages}`;
        pb.prev.classList.toggle('gone', m.page === 0);
        pb.next.classList.toggle('gone', m.page === pages - 1);
      }
      paint(ctx.model);
      return {
        paint,
        locate(t) {
          if (t.page !== undefined) return center(pb.nums[t.page]);
          if (t.pager) return center(t.pager === 'next' ? pb.next : pb.prev);
          if (t.pick !== undefined) {
            const sl = slots.find((x) => x.idx === t.pick);
            if (!sl) throw new Error(`recall-info/classic: row ${t.pick} is not on this page`);
            return center(sl.b);
          }
          throw new Error(`recall-info/classic cannot locate ${JSON.stringify(t)}`);
        },
      };
    };
  }

  env.template('recall-info/_classic-paginate', () => ({ parts, build }));
})();
