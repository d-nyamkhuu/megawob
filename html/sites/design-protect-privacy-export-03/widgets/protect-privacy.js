// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-export-03',
  name: 'design',
  split: 'train',
  scenarios: ['export'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      fit: (base) => (ctx) => {
        const geo = base(ctx); // Preserve the template's seeded geometry draws.
        return { ...geo, M: 0, fullW: ctx.size.width, fullH: ctx.size.height,
          winW: ctx.size.width, winH: ctx.size.height, ax: 'left' };
      },
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove(); // The application tabs live in the site frame.
      },
      address: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove(); // Native desktop frame has no browser address bar.
      },
      view: (base, S) => (m) => {
        const P = S.P;
        const spec = S.spec;
        const crm = P.element('div', 'sp-crm openlook-crm', S.app);
        const summary = P.element('section', 'ol-summary', crm);
        P.element('div', 'ol-buildings', summary, '▥');
        const stats = P.element('div', 'ol-summary-copy', summary);
        P.element('h2', '', stats, 'Customers');
        const active = spec.rows.filter((r) => String(r.status || '').toLowerCase() === 'active').length;
        const regionCol = spec.cols.find((c) => /country|region/i.test(c.label));
        const countries = regionCol ? new Set(spec.rows.map((r) => r[regionCol.id]).filter(Boolean)).size : 0;
        const facts = P.element('div', 'ol-summary-stats', stats);
        for (const [label, value] of [['Total Customers', spec.total], ['Active Customers', active], ['Countries', countries]]) {
          const fact = P.element('div', 'ol-stat', facts);
          P.element('span', '', fact, `${label}:`);
          P.element('b', '', fact, value);
        }
        const chart = P.element('div', 'ol-chart', summary);
        P.element('div', 'ol-chart-title', chart, 'New Customers by Month');
        const bars = P.element('div', 'ol-bars', chart);
        const heights = [10, 14, 22, 17, 33, 27, 32, 48, 37, 55, 54, 41];
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        months.forEach((month, i) => {
          const col = P.element('div', 'ol-month', bars);
          const bar = P.element('i', '', col);
          bar.style.height = `${heights[i]}%`;
          P.element('span', '', col, month);
        });

        const lower = P.element('div', 'ol-lower', crm);
        const main = P.element('div', 'sp-main ol-table-area', lower);
        main.style.flex = '7 1 0';
        P.table(main, m);
        const inspector = P.element('aside', 'ol-inspector', lower);
        P.element('h2', '', inspector, 'Customer Details');
        const row = spec.rows[0] || {};
        const fields = spec.cols.map((c) => [c.label, row[c.id] || '']);
        const extras = [['Address', '123 Market St\nSan Francisco, CA 94105\nUSA'], ['Phone', '(415) 555-0123'], ['Notes', 'Prefers email contact.\nLoyal customer.']];
        fields.concat(extras).forEach(([label, value]) => {
          const line = P.element('div', 'ol-detail', inspector);
          P.element('span', '', line, `${label}:`);
          const input = P.element(label === 'Notes' ? 'textarea' : 'div', 'ol-value', line, value);
          if (label === 'Notes') input.setAttribute('readonly', '');
        });
        if (!m.dlg) return;
        P.dialog(m);
      },
      table: (base) => (main, m) => {
        base(main, m);
        const header = main.firstElementChild;
        header.classList.add('ol-table-header');
        header.style.marginBottom = '0';
        const card = header.nextElementSibling;
        card.style.overflow = 'auto';
        card.style.flex = '1';
        card.style.minHeight = '0';
      },
    },
  },
});
