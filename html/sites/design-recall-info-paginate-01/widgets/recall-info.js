// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-paginate-01',
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
    columns: '96px minmax(0,2.6fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,1.2fr) minmax(0,1.15fr)',
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
          gridTemplateColumns: `${compact ? 146 : 230}px minmax(0,1fr)`,
          gridTemplateRows: `${Math.round(ctx.size.height * (compact ? .44 : .40))}px minmax(0,1fr)`,
          gap: compact ? '10px' : '14px', padding: compact ? '0 8px 8px' : '0 14px 14px',
        });
        return work;
      },
      bar: (base, S) => (ctx, app) => {
        ctx.rng.pick(S.D.users);
      },
      heading: () => (ctx, work) => {
        const spec = ctx.spec;
        const band = env.util.el('section', 'jh-summary', work);
        if (ctx.size.height < 600 || ctx.size.width < 800) band.classList.add('jh-summary-compact');
        Object.assign(band.style, { gridColumn: '1 / -1', gridTemplateRows: 'minmax(0,1fr)', minHeight: '0', overflow: 'hidden' });
        const art = env.util.el('div', 'jh-city', band);
        art.setAttribute('aria-hidden', 'true');
        const details = env.util.el('div', 'jh-details', band);
        const title = env.util.el('h1', 'jh-title', details, spec.title);
        const meta = env.util.el('div', 'jh-meta', details);
        env.util.el('span', '', meta, '⌖　Austin, TX');
        const total = env.util.el('span', 'ur-sub jh-total', meta, `${spec.rows.length} results`);
        env.util.el('span', '', meta, 'Updated today, 10:24 AM');
        const filters = env.util.el('div', 'jh-filters', details);
        for (const text of [spec.title, 'Remote & On-site', 'All Work Modes', 'All Experience Levels']) {
          env.util.el('span', 'jh-filter', filters, `${text}　⌄`);
        }
        const stats = env.util.el('div', 'jh-stats', details);
        const vals = [
          [`${spec.rows.length.toLocaleString()}`, 'Total jobs', 'blue', '▤'],
          ['712', 'Companies', 'green', '▥'],
          ['431', 'New this week', 'orange', '★'],
          ['128', 'Saved jobs', 'purple', '♧'],
        ];
        for (const [value, label, color, icon] of vals) {
          const card = env.util.el('div', `jh-stat ${color}`, stats);
          env.util.el('span', 'jh-stat-icon', card, icon);
          const copy = env.util.el('span', 'jh-stat-copy', card);
          env.util.el('b', '', copy, value);
          env.util.el('small', '', copy, label);
        }
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
        for (const c of ['Select', ...ctx.spec.cols, '']) env.util.el('span', 'jh-cell', th, c);
        return { sel: null, tbl };
      },
      row: () => (ctx, tbl, k, pick) => {
        const r = env.util.el('div', 'ur-trow ur-grid', tbl);
        Object.assign(r.style, { flex: '1 1 0', minHeight: '0', height: 'auto' });
        const b = env.util.el('button', 'ur-btn small jh-select', r, '');
        b.type = 'button'; b.setAttribute('aria-label', ctx.spec.actLabel); b.addEventListener('click', pick);
        const name = env.util.el('span', 'jh-cell jh-name', r);
        const num = env.util.el('span', 'jh-cell num', r);
        const rate = env.util.el('span', 'jh-cell num jh-rating', r);
        const cat = env.util.el('span', 'jh-cell jh-category', r);
        const extra = env.util.el('span', 'jh-cell jh-extra', r);
        return { r, name, num, rate, cat: cat, b, idx: null, extra };
      },
      pager: () => (ctx, work, apply) => {
        const pager = env.util.el('div', 'ur-pager jh-pager', work);
        const room = ctx.size.height * (ctx.size.width < 800 ? .56 : .60) - 28;
        const compact = room < 300;
        Object.assign(pager.style, { gridColumn: '1', gridRow: '2', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', gap: '6px', minWidth: '0', minHeight: '0', padding: room < 440 ? '10px 8px' : '22px 18px' });
        const heading = env.util.el('div', 'jh-pager-heading', pager);
        Object.assign(heading.style, { display: 'flex', flexDirection: compact ? 'row' : 'column', alignItems: compact ? 'baseline' : 'stretch', gap: '6px', flex: 'none' });
        const label = env.util.el('b', 'jh-pager-title', heading, 'Results');
        const pageText = env.util.el('span', 'jh-page-text', heading);
        if (compact) { label.style.fontSize = '16px'; pageText.style.fontSize = '11px'; }
        const controls = env.util.el('div', 'jh-page-controls', pager);
        if (room < 440) Object.assign(controls.style, { gap: '6px', margin: '2px 0' });
        const pb = { prev: env.util.el('button', 'ur-btn small', controls, '‹'), nums: [] };
        pb.prev.type = 'button'; pb.prev.addEventListener('click', () => apply({ prev: true }));
        env.util.el('span', 'jh-page-current', controls, `${ctx.spec.pages} pages`);
        pb.next = env.util.el('button', 'ur-btn small', controls, '›');
        pb.next.type = 'button'; pb.next.addEventListener('click', () => apply({ next: true }));
        if (room < 440) {
          for (const button of [pb.prev, pb.next]) Object.assign(button.style, { height: '34px', width: '34px', padding: '4px', fontSize: '20px' });
          controls.querySelector('.jh-page-current').style.fontSize = '14px';
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
        const stats = env.util.el('div', 'jh-side-stats', pager, compact
          ? `${ctx.spec.rows.length.toLocaleString()} results · 712 companies\n431 new · 128 saved`
          : `${ctx.spec.rows.length.toLocaleString()}　 Total results\n712　 Companies\n431　 New this week\n128　 Saved jobs`);
        if (room < 440) Object.assign(stats.style, { fontSize: compact ? '9px' : '11px', lineHeight: '1.5', paddingTop: '6px', flex: 'none' });
        return { pb, pageText };
      },
      rowData: () => (ctx, sl, row, on) => {
        const fam = env.taskDef;
        sl.name.textContent = row.name;
        sl.name.title = row.name;
        sl.num.textContent = fam.helpers.fmtNum(ctx.spec, row.num);
        sl.rate.textContent = `★ ★ ★ ★ ☆　${row.rate.toFixed(1)}`;
        sl.cat.textContent = row.cat;
        sl.extra.textContent = row.extra || row.detail || '';
        sl.b.textContent = on ? '✓' : '';
        sl.b.classList.toggle('on', on);
        sl.r.classList.toggle('selected', on);
      },
      selection: () => () => {},
    },
  },
});
