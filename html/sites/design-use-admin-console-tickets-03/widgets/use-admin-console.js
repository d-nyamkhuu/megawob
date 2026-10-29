// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-tickets-03',
  name: 'design',
  split: 'train',
  scenarios: ['tickets'],
  template: 'use-admin-console/console',
  design: {
    inset: 0,
    pageSize: 12,
    fontSize: 16,
    fontFamily: '"Segoe UI", Arial, sans-serif',
    parts: {
      fit: (base) => (ctx) => {
        const geo = base(ctx);
        return { ...geo, withContext: false, paneWidth: geo.width, compact: false };
      },
      topbar: () => () => {},
      sidebar: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      heading: (base, S) => () => {
        const el = S.ctx.util.el;
        const legend = el('div', 'notebook-legend', S.workspace);
        el('span', 'notebook-info', legend, 'i');
        el('span', 'notebook-legend-label', legend, 'Routing Help:');
        const categories = [...new Set(S.spec.tickets.map(t => t.category))];
        const routes = Object.values(S.spec).find(v => v && typeof v === 'object' && !Array.isArray(v)
          && categories.every(c => typeof v[c] === 'string' && S.spec.options.queue.includes(v[c])));
        categories.forEach((category, i) => {
          const item = el('div', `notebook-route route-${i % 4}`, legend);
          el('i', 'notebook-dot', item);
          el('span', '', item, category);
          el('span', 'notebook-arrow', item, '→');
          const queue = routes?.[category];
          el('span', '', item, queue || 'See routing policy');
        });
        el('h2', 'notebook-table-title', S.workspace, 'Support Tickets');
      },
      tickets: (base, S) => (m) => {
        const labels = [['Category', 'nb-category'], ['Ticket #', 'nb-number'], ['Subject', 'nb-subject'],
          ['Requester', 'nb-requester'], ['Created', 'nb-created'], ['Priority', 'nb-priority'], ['Queue', 'nb-queue']];
        const body = S.P.table(S.main, labels, 'notebook-tickets');
        for (const t of S.spec.tickets.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) S.P.ticketRow(body, t, m);
        if (S.spec.tickets.length > m.pageSize) S.P.pager(S.spec.tickets, m);
        if (S.spec.judge?.mode === 'confirm') S.P.button(S.P.actions(), 'Apply routing proposals',
          { nav: 'applyRoutes' }, { nav: 'applyRoutes' }, 'primary');
      },
      ticketRow: (base, S) => (body, t, m) => {
        const el = S.ctx.util.el;
        const index = S.spec.tickets.indexOf(t);
        const categories = [...new Set(S.spec.tickets.map(t => t.category))];
        const row = el('tr', '', body);
        el('span', `notebook-category route-${categories.indexOf(t.category) % 4}`, el('td', '', row), t.category);
        el('td', 'notebook-mono', row, t.id);
        el('td', 'notebook-subject', row, t.title);
        el('td', '', row, t.requester);
        const minutes = 9 * 60 + 14 + index * 37;
        el('td', 'notebook-mono', row, t.created || `2024-03-01 ${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
        el('span', `notebook-priority priority-${t.priority.toLowerCase()}`, el('td', '', row), t.priority);
        S.P.picker(el('td', '', row), `queue:${t.id}`, m.queues[t.id]);
      },
      facts: (base, S) => (m) => {
        const el = S.ctx.util.el;
        const box = el('section', 'notebook-summary', S.workspace);
        const head = el('h2', '', box);
        const chart = el('span', 'notebook-chart', head);
        chart.innerHTML = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M2 16h6v10H2zm9-14h6v24h-6zm9 7h6v17h-6z"/></svg>';
        el('span', '', head, 'Routing Summary');
        const grid = el('div', 'notebook-summary-grid', box);
        const categories = [...new Set(S.spec.tickets.map(t => t.category))];
        const routes = Object.values(S.spec).find(v => v && typeof v === 'object' && !Array.isArray(v)
          && categories.every(c => typeof v[c] === 'string' && S.spec.options.queue.includes(v[c])));
        const ordered = categories.map(c => routes?.[c]).filter(Boolean);
        const queues = [...ordered, ...S.spec.options.queue.filter(q => !ordered.includes(q))];
        queues.forEach((queue, i) => {
          const stat = el('div', `notebook-stat route-${i % 4}`, grid);
          const label = el('div', 'notebook-stat-label', stat);
          el('i', 'notebook-dot', label);
          el('span', '', label, queue);
          el('b', '', stat, String(Object.values(m.queues).filter(q => q === queue).length));
          el('div', 'notebook-stat-unit', stat, 'tickets');
        });
        const audit = el('div', 'notebook-audit', grid);
        el('div', '', audit, 'Last updated');
        el('div', 'notebook-mono', audit, '2024-03-01 08:55');
        el('div', 'notebook-audit-label', audit, 'Audit reference');
        const facts = env.taskDef.facts(m, S.spec);
        const reference = facts.find(f => /audit|reference/i.test(f.label));
        el('div', 'notebook-mono', audit, reference?.value || S.spec.auditRef || '—');
      },
    },
  },
});
