// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-tickets-04',
  name: 'design',
  split: 'train',
  scenarios: ['tickets'],
  template: 'use-admin-console/console',
  design: {
    inset: 0, narrowAt: 0, contextAt: 100000, fontSize: 14,
    fontFamily: 'Arial, Helvetica, sans-serif',
    parts: {
      topbar: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      frame: (base, S) => () => {
        const { el } = S.ctx.util, m = S.ctx.model, s = S.spec;
        const frame = el('div', 'desk-frame', S.shell);
        const rail = el('div', 'desk-filter', frame);
        const count = (label, value, cls = '') => {
          const row = el('div', `desk-filter-row ${cls}`, rail);
          el('span', '', row, label); el('span', '', row, String(value));
        };
        count('Tickets', s.tickets.length, 'desk-filter-title');
        count('All Tickets', s.tickets.length, 'active');
        for (const label of ['Open', 'In Progress', 'Waiting on User', 'Resolved', 'Closed']) count(label, label === 'Open' ? s.tickets.length : 0);
        el('h3', 'desk-filter-group', rail, 'By Category');
        for (const category of [...new Set(s.tickets.map(t => t.category))]) count(category, s.tickets.filter(t => t.category === category).length);
        el('h3', 'desk-filter-group', rail, 'By Priority');
        for (const priority of [...new Set(s.tickets.map(t => t.priority))]) count(priority, s.tickets.filter(t => t.priority === priority).length);
        const index = el('section', 'desk-index', frame);
        const head = el('div', 'desk-index-head', index);
        el('h2', '', head, 'All Tickets');
        const search = el('div', 'desk-index-search', head);
        S.P.icon(search, 'search'); el('span', '', search, 'Search tickets...');
        const list = el('div', 'desk-index-list', index);
        for (const [i, t] of s.tickets.entries()) {
          const item = el('div', 'desk-index-item', list);
          el('span', 'desk-record-id', item, t.id);
          el('span', `desk-badge category-${t.category.toLowerCase()}`, item, t.category);
          el('strong', 'desk-record-title', item, t.title);
          el('span', 'desk-record-meta', item, `${t.requester} · ${i + 2}h ago`);
          if (m.queues[t.id] && m.queues[t.id] !== 'Unassigned') { item.classList.add('routed'); item.title = `${t.id}: ${m.queues[t.id]}`; }
        }
        list.scrollTop = S.ui.indexScroll || 0;
        list.addEventListener('scroll', () => { S.ui.indexScroll = list.scrollTop; });
        S.workspace = el('div', 'aa-workspace desk-workspace', frame);
        return frame;
      },
      heading: (base, S) => () => {
        const head = S.ctx.util.el('header', 'desk-heading', S.workspace);
        S.ctx.util.el('h2', '', head, `Ticket Queue Management (${S.spec.tickets.length})`);
      },
      tickets: (base, S) => m => {
        const labels = [['', 'desk-checkcol'], ['ID', 'desk-idcol'], ['Requester', 'desk-requestercol'], ['Subject', 'desk-subjectcol'], ['Category', 'desk-categorycol'], ['Priority', 'desk-prioritycol'], ['Queue', 'desk-queuecol']];
        const body = S.P.table(S.main, labels, 'desk-ticket-table');
        S.ctx.util.el('i', 'aa-checkmark', body.parentElement.querySelector('th'));
        for (const t of S.spec.tickets.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) S.P.ticketRow(body, t, m);
        S.P.pager(S.spec.tickets, m);
        if (S.spec.judge?.mode === 'confirm') S.P.button(S.P.actions(), 'Apply routing proposals', { nav: 'applyRoutes' }, { nav: 'applyRoutes' }, 'primary');
      },
      ticketRow: (base, S) => (body, t, m) => {
        const { el } = S.ctx.util, tr = el('tr', '', body);
        el('i', 'aa-checkmark', el('td', 'desk-checkcol', tr));
        el('td', 'desk-idcol', tr, t.id);
        el('td', 'desk-requestercol', tr, t.requester);
        el('td', 'desk-subjectcol', tr, t.title);
        el('span', `desk-badge category-${t.category.toLowerCase()}`, el('td', 'desk-categorycol', tr), t.category);
        el('td', `desk-prioritycol priority-${t.priority.toLowerCase()}`, tr, t.priority);
        S.P.picker(el('td', 'desk-queuecol', tr), `queue:${t.id}`, m.queues[t.id] || 'Unassigned');
      },
      facts: (base, S) => m => {
        const { el } = S.ctx.util;
        const summary = el('section', 'desk-summary', S.workspace);
        el('h3', '', summary, 'Routing Summary');
        const row = el('div', 'desk-summary-row', summary);
        const categories = [...new Set(S.spec.tickets.map(t => t.category))];
        for (const category of categories) {
          const tickets = S.spec.tickets.filter(t => t.category === category);
          const assigned = tickets.filter(t => m.queues[t.id] && m.queues[t.id] !== 'Unassigned');
          const col = el('div', `desk-summary-stat category-${category.toLowerCase()}`, row);
          const label = el('div', 'desk-summary-label', col);
          el('i', 'desk-category-dot', label); el('span', '', label, category);
          el('b', 'desk-summary-count', col, `${assigned.length} / ${tickets.length}`);
          const queues = [...new Set(assigned.map(t => m.queues[t.id]))];
          const instruction = S.ctx.instruction || S.ctx.stage.ticketInstruction || '';
          const at = instruction.toLowerCase().indexOf(category.toLowerCase());
          const next = Math.min(instruction.length, ...categories.filter(c => c !== category).map(c => instruction.toLowerCase().indexOf(c.toLowerCase())).filter(i => i > at));
          const clause = at >= 0 ? instruction.slice(at, next) : '';
          const requestedQueue = S.spec.options.queue.find(q => q !== 'Unassigned' && clause.includes(q));
          el('div', 'desk-summary-detail', col, requestedQueue ? `to ${requestedQueue}` : queues.length === 1 ? `to ${queues[0]}` : queues.length ? 'Multiple queues' : 'Awaiting assignment');
        }
        const audit = el('div', 'desk-summary-audit', row);
        el('small', '', audit, 'Last updated');
        el('span', '', audit, 'Apr 24, 2024, 10:15 AM');
        for (const fact of env.taskDef.facts(m, S.spec).filter(f => /reference/i.test(f.label))) {
          el('small', '', audit, fact.label); el('span', '', audit, String(fact.value));
        }
      },
    },
  },
});
