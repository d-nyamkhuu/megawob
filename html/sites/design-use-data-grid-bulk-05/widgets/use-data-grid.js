// Keep the shared grid's actions and anchors, with a paper summary and lower inspector.
function refreshPaperSummary(card) {
  if (!card?.dataset.paper) return;
  const rows = [...card.querySelectorAll('.to-row')];
  for (const pill of card.querySelectorAll('.to-pill')) {
    const status = pill.textContent;
    pill.dataset.tone = /^(Pending|On hold|On leave|Probation|Low stock|Backordered|Waiting)$/.test(status) ? 'warning'
      : /^(Active|Delivered|Paid|In stock)$/.test(status) ? 'success'
      : /^(Processing|Shipped|Remote|Reserved|Sent|Open|In progress)$/.test(status) ? 'info'
      : /^(Cancelled|Overdue|Disputed)$/.test(status) ? 'danger' : 'neutral';
  }
  [...card.querySelectorAll('.paper-metric')].forEach((metric, i) => {
    const label = metric.querySelector('.paper-metric-label').textContent;
    const count = i ? rows.filter(row => row.querySelector('.to-pill')?.textContent === label).length : rows.length;
    metric.querySelector('strong').textContent = String(count);
    const caption = metric.querySelector('.paper-caption');
    if (caption) caption.textContent = Math.round(count / Math.max(rows.length, 1) * 100) + '% of total';
  });
}
function decoratePaperGrid(ctx) {
  const { stage, util } = ctx;

        const card = stage.querySelector('.to-card');
        if (!card || card.dataset.paper) return;
        card.dataset.paper = 'true';
        const head = card.querySelector('.to-head');
        const title = head.querySelector('h2').textContent;
        const note = document.querySelector('.ref-instruction');
        if (note) head.appendChild(note);
        const date = util.el('div', 'paper-date', head);
        const calendar = util.el('span', 'paper-calendar', date);
        calendar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="1"/><path d="M4 10h16M8 2v6m8-6v6M8 13h3v3H8zm5 0h3v3h-3zM8 18h3"/></svg>';
        util.el('span', '', date, 'Apr 1, 2014 – Apr 30, 2014');
        util.el('span', '', date, '⌄');
        const summary = util.el('div', 'paper-summary', card);
        head.after(summary);
        const rows = [...card.querySelectorAll('.to-row')];
        const statuses = [...new Set(rows.map(row => row.querySelector('.to-pill')?.textContent).filter(Boolean))];
        const labels = ['Total ' + title, ...statuses.slice(0, 4)];
        while (labels.length < 5) labels.push(['Processing', 'Cancelled'][labels.length % 2]);
        labels.forEach((label, i) => {
          const metric = util.el('div', 'paper-metric', summary);
          util.el('div', 'paper-metric-label', metric, label);
          const count = i ? rows.filter(row => row.querySelector('.to-pill')?.textContent === label).length : rows.length;
          util.el('strong', '', metric, String(count));
          const caption = util.el('div', i === 0 ? 'paper-trend' : i === 1 ? 'paper-attention' : 'paper-caption', metric,
            i === 0 ? '' : i === 1 ? '●  Needs attention' : Math.round(count / Math.max(rows.length, 1) * 100) + '% of total');
          if (i === 0) {
            util.el('span', 'paper-change', caption, '▲ 12%');
            util.el('span', '', caption, 'vs. last month');
          }
        });
        const tools = card.querySelector('.to-tools');
        const search = util.el('div', 'paper-search', tools);
        tools.prepend(search);
        util.el('span', 'paper-search-icon', search);
        const input = util.el('input', '', search);
        input.placeholder = 'Search ' + title.toLowerCase() + '...';
        input.setAttribute('aria-label', input.placeholder);
        input.addEventListener('input', () => {
          for (const row of card.querySelectorAll('.to-row')) row.hidden = !row.textContent.toLowerCase().includes(input.value.toLowerCase());
        });
        const filters = util.el('div', 'paper-filters', tools);
        search.after(filters);
        const filterHeaders = [...card.querySelectorAll('.to-h')].filter(h => h.querySelector('.ib[title^="Filter"]'));
        for (const h of filterHeaders.slice(0, 2)) {
          const filter = util.el('button', 'paper-filter', filters);
          filter.type = 'button';
          util.el('span', 'paper-filter-label', filter, h.querySelector('.lbl').textContent);
          util.el('span', '', filter, 'All');
          util.el('span', 'paper-chevron', filter, '⌄');
          filter.addEventListener('click', () => {
            const current = [...card.querySelectorAll('.to-h')].find(current => current.dataset.col === h.dataset.col);
            current?.querySelector('.ib[title^="Filter"]')?.click();
          });
        }
        const inspector = stage.querySelector('.to-context') || util.el('aside', 'to-context', card);
        if (inspector) {
          inspector.replaceChildren();
          card.appendChild(inspector);
          const empty = util.el('div', 'paper-empty', inspector);
          util.el('h3', '', empty, 'No ' + title.replace(/s$/, '').toLowerCase() + ' selected');
          util.el('p', '', empty, 'Select a record from the list to view its details.');
          const details = util.el('div', 'paper-details', inspector);
          const tabs = util.el('div', 'paper-detail-tabs', details);
          for (const text of ['Details', 'Items', 'Shipping', 'Notes']) {
            const tab = util.el('button', text === 'Details' ? 'active' : '', tabs, text);
            tab.addEventListener('click', () => {
              for (const sibling of tabs.children) sibling.classList.toggle('active', sibling === tab);
            });
          }
          const fields = util.el('div', 'paper-fields', details);
          const columns = [...card.querySelectorAll('.to-h .lbl')].map(x => x.textContent);
          for (const label of columns) {
            const field = util.el('div', 'paper-field', fields);
            util.el('span', '', field, label);
            util.el('span', 'paper-field-value', field, '—');
          }
          card.querySelector('.to-body').addEventListener('click', e => {
            const row = e.target.closest('.to-row');
            if (!row) return;
            const first = row.querySelector('.to-c');
            empty.querySelector('h3').textContent = first?.querySelector('span[title]')?.textContent || first?.textContent || title;
            empty.querySelector('p').textContent = 'Record details';
            const values = [...row.querySelectorAll('.to-c')].map(x => x.querySelector('span[title]')?.textContent || x.textContent);
            [...fields.querySelectorAll('.paper-field-value')].forEach((x, i) => x.textContent = values[i] || '—');
          });
        }
        refreshPaperSummary(card);
}
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-bulk-05',
  name: 'design',
  split: 'train',
  scenarios: ['bulk'],
  template: 'use-data-grid/grid',
  design: { parts: {
    draw: (base, S) => function (...args) {
      const result = base(...args);
      refreshPaperSummary(S.card);
      return result;
    },
    drawLite: (base, S) => function (...args) {
      const result = base(...args);
      refreshPaperSummary(S.card);
      return result;
    },
    locate: (base, S) => function (target) {
      if (target.row) {
        const row = [...S.body.querySelectorAll('.to-row')].find(row => row.dataset.id === target.row);
        if (row) row.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      return base(target);
    },
    rendered: (base, S) => function (ctx) {
      const result = base(ctx);
      decoratePaperGrid(ctx);
      return result;
    },
  } },
});
