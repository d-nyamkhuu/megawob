// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-paginate-05',
  name: 'design',
  split: 'train',
  scenarios: ['paginate'],
  template: 'recall-info/classic',
  design: {
    title: 'JobHub',
    width: 1310,
    tightHeight: 0,
    frameRadius: '16px',
    fontSize: '16px',
    columns: '130px minmax(0,2.1fr) minmax(0,1fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,1fr)',
    parts: {
      placeFrame: (base) => (ctx, app, width, height) => {
        base(ctx, app, width, height);
        Object.assign(app.style, { left: '0px', top: '0px', width: `${ctx.size.width}px`, height: `${ctx.size.height}px` });
      },
      work: () => (ctx, app) => {
        const work = env.util.el('div', 'ur-work', app);
        const compact = ctx.size.width < 800;
        Object.assign(work.style, {
          display: 'grid', position: 'relative', minHeight: '0',
          gridTemplateColumns: `${compact ? 154 : 250}px minmax(0,1fr)`,
          gridTemplateRows: `${compact ? 60 : 86}px minmax(0,1fr) 62px`,
          gap: compact ? '0 8px' : '0 18px', padding: compact ? '0 10px 8px' : '0 18px 14px',
        });
        return work;
      },
      bar: (base, S) => (ctx, app) => {
        ctx.rng.pick(S.D.users);
      },
      heading: () => (ctx, work) => {
        const spec = ctx.spec;
        const resultCount = document.querySelector('.jh-out-stat.blue .jh-out-copy b');
        if (resultCount) resultCount.textContent = String(spec.rows.length);
        const band = env.util.el('section', 'jh-summary', work);
        Object.assign(band.style, { gridColumn: '1 / -1', minHeight: '0', overflow: 'hidden' });
        const title = env.util.el('h1', 'jh-title', band, spec.title);
        const total = env.util.el('span', 'ur-sub jh-total', band, `${spec.rows.length} results`);
        return total;
      },
      table: () => (ctx, work) => {
        const frame = env.util.el('div', 'jh-table-frame', work);
        Object.assign(frame.style, { gridColumn: '2', gridRow: '2', minWidth: '0', minHeight: '0' });
        const tbl = env.util.el('div', 'ur-tbl', frame);
        Object.assign(tbl.style, { height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' });
        if (ctx.size.width < 1000) tbl.style.setProperty('--ur-cols', '42px minmax(0,2.6fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,1.2fr) minmax(0,.5fr)');
        const th = env.util.el('div', 'ur-thead ur-grid', tbl);
        Object.assign(th.style, { flex: '0 0 auto', height: ctx.size.width < 800 ? '31px' : '44px' });
        for (const c of ['Select', 'Position', ...ctx.spec.cols.slice(0, 1), 'Work mode', '']) env.util.el('span', 'jh-cell', th, c);
        return { sel: null, tbl };
      },
      row: () => (ctx, tbl, k, pick) => {
        const r = env.util.el('div', 'ur-trow ur-grid', tbl);
        Object.assign(r.style, { flex: '1 1 0', minHeight: '0', height: 'auto' });
        const b = env.util.el('button', 'ur-btn small jh-select', r, ctx.spec.actLabel || 'Apply');
        b.type = 'button'; b.setAttribute('aria-label', ctx.spec.actLabel); b.addEventListener('click', pick);
        env.util.el('span', 'jh-logo', r, '');
        const copy = env.util.el('div', 'jh-row-copy', r);
        const name = env.util.el('span', 'jh-cell jh-name', copy);
        const metrics = env.util.el('div', 'jh-metrics', r);
        const num = env.util.el('span', 'jh-cell num', metrics);
        const rate = env.util.el('span', 'jh-cell num jh-rating', metrics);
        const cat = env.util.el('span', 'jh-cell jh-category', r);
        const extra = env.util.el('span', 'jh-cell jh-extra', copy);
        return { r, name, num, rate, cat: cat, b, idx: null, extra };
      },
      pager: () => (ctx, work, apply) => {
        const pager = env.util.el('div', 'ur-pager jh-pager', work);
        const room = ctx.size.height * (ctx.size.width < 800 ? .56 : .60) - 28;
        const compact = room < 300;
        Object.assign(pager.style, { gridColumn: '2', gridRow: '3', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '12px', minWidth: '0', minHeight: '0', padding: '0 12px' });
        const filters = env.util.el('aside', 'jh-filters', work);
        Object.assign(filters.style, { gridColumn: '1', gridRow: '2 / 4', minWidth: '0', minHeight: '0' });
        env.util.el('b', 'jh-filter-heading', filters, 'Filters');
        for (const [heading, items] of [['Location', ['New York (12)', 'San Francisco (14)', 'Chicago (7)', 'Remote (9)']], ['Work Mode', ['On-site (11)', 'Hybrid (18)', 'Remote (13)']], ['Experience Level', ['Entry (6)', 'Mid (24)', 'Senior (12)']], ['Company', ['Contoso (8)', 'Fabrikam (6)', 'Northwind (5)', 'Tailspin (4)']]]) {
          const group = env.util.el('div', 'jh-filter-group', filters);
          env.util.el('b', '', group, heading);
          for (const item of items) {
            const line = env.util.el('div', 'jh-filter-line', group);
            env.util.el('span', 'jh-check', line, '');
            env.util.el('span', '', line, item);
          }
        }
        const controls = env.util.el('div', 'jh-page-controls', pager);
        if (room < 440) Object.assign(controls.style, { gap: '6px', margin: '2px 0' });
        const pb = { prev: env.util.el('button', 'ur-btn small', controls, '‹  Previous'), nums: [] };
        pb.prev.type = 'button'; pb.prev.addEventListener('click', () => apply({ prev: true }));
        const pageText = env.util.el('span', 'jh-page-text jh-page-current', controls);
        pb.next = env.util.el('button', 'ur-btn small', controls, 'Next  ›');
        pb.next.type = 'button'; pb.next.addEventListener('click', () => apply({ next: true }));
        if (room < 440) {
          for (const button of [pb.prev, pb.next]) Object.assign(button.style, { height: '34px', width: '34px', padding: '4px', fontSize: '20px' });
          pageText.style.fontSize = '14px';
        }
        if (ctx.spec.pager === 'numbers') {
          const numbers = env.util.el('div', 'jh-page-numbers', pager);
          Object.assign(numbers.style, { display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '4px' });
          pb.nums = Array.from({ length: ctx.spec.pages }, (_, p) => {
            const button = env.util.el('button', 'ur-btn small jh-page-number', numbers, String(p + 1));
            Object.assign(button.style, { minWidth: '0', padding: '4px', height: '26px' });
            button.type = 'button'; button.addEventListener('click', () => apply({ goto: p })); return button;
          });
        }
        const stats = env.util.el('div', 'jh-side-stats', pager, '');
        if (room < 440) Object.assign(stats.style, { fontSize: compact ? '9px' : '11px', lineHeight: '1.5', paddingTop: '6px', flex: 'none' });
        return { pb, pageText };
      },
      rowData: () => (ctx, sl, row, on) => {
        const fam = env.taskDef;
        const nameParts = (row.name || '').split(', ');
        sl.name.textContent = nameParts.shift() || '';
        if (nameParts.length) env.util.el('span', 'jh-company', sl.name, nameParts.join(', '));
        sl.name.title = row.name;
        const logo = sl.r.querySelector('.jh-logo');
        const companyName = nameParts.join(', ') || row.name || 'J';
        const brandIndex = companyName.charCodeAt(0) % 5;
        logo.textContent = companyName.trim().charAt(0).toUpperCase();
        if (brandIndex === 2) logo.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 35C2 17 20 13 39 8c0 20-9 35-25 25 M9 40l22-22"/></svg>';
        if (brandIndex === 4) logo.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true" fill="currentColor"><path d="M5 5h17v17H5z M26 5h17v17H26z M5 26h17v17H5z M26 26h17v17H26z"/></svg>';
        logo.style.backgroundColor = ['#e34a43', '#075293', '#37823e', '#ec650b', '#1682d0'][brandIndex];
        sl.num.textContent = fam.helpers.fmtNum(ctx.spec, row.num);
        sl.rate.textContent = `★ ${row.rate.toFixed(1)}`;
        sl.cat.textContent = row.cat;
        sl.extra.textContent = row.extra || row.detail || '';
        sl.b.textContent = ctx.spec.actLabel || 'Apply';
        sl.b.classList.toggle('on', on);
        sl.r.classList.toggle('selected', on);
      },
      selection: () => () => {},
    },
  },
});
