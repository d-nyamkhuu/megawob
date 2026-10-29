// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('crm-titlebar');
      const title = util.el('div', 'crm-window-title', header, 'Support Tickets');
      title.setAttribute('aria-label', 'Support Tickets');
      const stats = util.el('aside', 'crm-stats', null);
      const statCard = (label, value, kind) => {
        const card = util.el('section', `crm-stat crm-stat-${kind}`, stats);
        util.el('div', 'crm-stat-label', card, label);
        util.el('div', 'crm-stat-value', card, value);
        if (kind === 'all') {
          const bars = util.el('div', 'crm-bars', card);
          [7, 10, 14, 9, 18, 23, 15, 27, 35, 30, 40, 48].forEach((h) => {
            const bar = util.el('i', '', bars); bar.style.height = `${h}px`;
          });
        } else {
          util.el('i', 'crm-dot', card);
        }
      };
      statCard('Total Tickets', '128', 'all');
      statCard('Open', '32', 'open');
      statCard('In Progress', '48', 'pending');
      statCard('Resolved', '40', 'resolved');
      const divider = util.el('div', 'crm-stat-divider', stats);
      divider.setAttribute('aria-hidden', 'true');
      statCard('On Hold', '8', 'due');
      S.frameBrand(_c, header);
      Object.assign(_c, { divider, header, statCard, stats, title });
    },
    'frame.body': (base, S) => function (_c) {
      const { stats, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('crm-workspace');
      const summary = util.el('div', 'crm-summary', body);
      summary.appendChild(stats);
      const controls = util.el('div', 'crm-controls', summary);
      const search = util.el('input', 'crm-search', controls);
      search.type = 'search';
      search.placeholder = '⌕  Search tickets…';
      search.setAttribute('aria-label', 'Search tickets');
      const filters = util.el('div', 'crm-filter-row', controls);
      const filterState = { status: '', priority: '', owner: '' };
      const refreshRows = () => env.log('decoy', { label: 'Search tickets', query: search.value });
      search.addEventListener('input', refreshRows);
      const addFilter = (label, key, index) => {
        const wrap = util.el('div', 'crm-filter', filters);
        const button = util.el('button', 'crm-filter-button', wrap);
        button.type = 'button'; button.innerHTML = `<span>${label}</span><b>All</b><i>⌄</i>`;
        const menu = util.el('div', 'crm-filter-menu', wrap);
        button.addEventListener('click', () => {
          for (const node of filters.querySelectorAll('.crm-filter-menu.open')) node.classList.remove('open');
          menu.classList.toggle('open');
          if (!menu.dataset.ready) {
            for (const value of ['All']) {
              const option = util.el('button', 'crm-filter-option', menu, value);
              option.type = 'button';
              option.addEventListener('click', () => {
                filterState[key] = value === 'All' ? '' : value;
                button.querySelector('b').textContent = value;
                menu.classList.remove('open'); refreshRows();
              });
            }
            menu.dataset.ready = '1';
          }
        });
      };
      addFilter('Status', 'status', 6);
      addFilter('Priority', 'priority', 5);
      addFilter('Owner', 'owner', 4);
      const more = util.el('button', 'crm-more-filters', filters, '⚲  More Filters');
      more.type = 'button';
      more.addEventListener('click', () => filters.classList.toggle('expanded'));
      const dock = util.el('nav', 'crm-dock', document.body);
      [['◉', 'Tickets'], ['♟', 'Customers'], ['▣', 'Knowledge Base'], ['▮', 'Reports'], ['⚙', 'Settings']].forEach(([icon, text], i) => {
        const item = util.el('a', `crm-dock-item${i === 0 ? ' active' : ''}`, dock);
        item.href = '#'; item.dataset.role = 'nav';
        util.el('span', 'crm-dock-icon', item, icon);
        util.el('span', '', item, text);
        item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: text }); });
      });
      S.frameSidebar(_c, body);
      Object.assign(_c, { addFilter, body, controls, dock, filterState, filters, more, refreshRows, search });
    },
  };

  env.site({
    name: 'design-use-data-grid-crm-04',
    template: 'site/base',
    design: { parts },
  });
})();
