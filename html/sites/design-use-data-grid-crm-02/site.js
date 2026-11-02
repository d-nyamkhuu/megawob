// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);

      // This design always uses the editorial top navigation and support rail.
      void sidebar;
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, lr, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('crm-titlebar');
      const title = util.el('div', 'crm-window-title', header, 'Acme');
      title.setAttribute('aria-label', 'Acme');
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
      stats.classList.add('crm-support-sidebar');
      util.el('div', 'crm-kicker', stats, 'Support');
      util.el('div', 'crm-side-heading', stats, 'Tickets');
      [['All Tickets','32'], ['My Tickets','8'], ['Unassigned','6'], ['Open','24'], ['Pending','4'], ['Resolved','4']].forEach(([label, count], i) => {
        const row = util.el('div', `crm-folder${i === 0 ? ' active' : ''}`, stats);
        util.el('span', '', row, label); util.el('span', 'crm-count', row, count);
      });
      util.el('div', 'crm-side-rule', stats);
      util.el('div', 'crm-filter-title', stats, 'Filters');
      util.el('div', 'crm-search', stats, '⌕  Search tickets...');
      [['Status','All'], ['Priority','All'], ['Owner','All'], ['Channel','All']].forEach(([label, value]) => {
        const row = util.el('div', 'crm-filter-row', stats);
        util.el('span', '', row, label); util.el('span', 'crm-filter-value', row, `${value}　⌄`);
      });
      util.el('div', 'crm-side-rule', stats);
      util.el('div', 'crm-tips-title', stats, '♧  Tips');
      util.el('div', 'crm-tips', stats, 'Use the checkboxes to select multiple tickets. Hold Shift and click to select a range. You can sort, filter and reorder columns. Drag a column header to change the order. Resize columns by dragging the divider.');
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        void sampledNav;
        for (const item of ['Dashboard', 'Tickets', 'Customers', 'Reports', 'Knowledge Base']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const globalSearch = util.el('div', 'crm-global-search', header);
      util.el('span', 'crm-search-icon', globalSearch, '⌕');
      util.el('span', 'crm-search-placeholder', globalSearch, 'Search tickets...');
      util.el('span', 'crm-bell', header, '♧');
      util.el('span', 'crm-avatar', header, 'JD');
      Object.assign(_c, { globalSearch, header, statCard, stats, title });
    },
    'frame.body': (base, S) => function (_c) {
      const { stats, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('crm-workspace');
      body.appendChild(stats);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-data-grid-crm-02',
    template: 'site/base',
    design: { parts },
  });
})();
