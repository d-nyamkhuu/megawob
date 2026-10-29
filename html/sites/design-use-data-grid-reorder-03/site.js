// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // retain the scaffold's seeded draw; the design title is fixed below.
        if (word) lr.pick(K.brand);
      }
      const brand = util.el('div', 'ref-brand', header, 'Orders');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      const search = util.el('label', 'ref-order-search', headerTools);
      util.el('span', 'ref-order-search-icon', search, '⌕');
      const searchInput = util.el('input', 'ref-order-search-input', search);
      searchInput.type = 'text';
      searchInput.placeholder = 'Search orders…';
      searchInput.readOnly = true;
      const action = (text, symbol) => {
        const b = util.el('button', `ref-order-action${text === 'New Order' ? ' ref-order-primary' : ''}`, headerTools);
        b.type = 'button';
        util.el('span', 'ref-action-icon', b, symbol);
        util.el('span', 'ref-action-text', b, text);
        b.addEventListener('click', () => env.log('decoy', { label: text }));
      };
      action('New Order', '+');
      action('Edit', '↗');
      action('Duplicate', '▢');
      action('Delete', '⌫');
      action('More', '⌄');
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { action, headerTools, search, searchInput, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const summary = util.el('aside', 'ref-design-summary', body);
      const totalCount = 1248;
      const pendingCount = 320;
      const shippedCount = 892;
      const cancelledCount = 36;
      const metric = (parent, value, caption, tone) => {
        const box = util.el('div', `ref-metric ref-metric-${tone}`, parent);
        util.el('strong', 'ref-metric-value', box, value.toLocaleString('en-US'));
        util.el('span', 'ref-metric-caption', box, caption);
      };
      const summaryCard = util.el('section', 'ref-summary-card', summary);
      util.el('div', 'ref-design-summary-title', summaryCard, 'Order Summary');
      const metrics = util.el('div', 'ref-metrics', summaryCard);
      metric(metrics, totalCount, 'Total Orders', 'plain');
      metric(metrics, pendingCount, 'Pending', 'amber');
      metric(metrics, shippedCount, 'Shipped', 'green');
      metric(metrics, cancelledCount, 'Cancelled', 'red');
      const quick = util.el('section', 'ref-quick-search', summary);
      util.el('div', 'ref-design-section-title', quick, 'Quick Search');
      const quickField = util.el('div', 'ref-sidebar-search', quick);
      util.el('span', 'ref-search-glass', quickField, '⌕');
      const quickInput = util.el('input', 'ref-sidebar-input', quickField);
      quickInput.placeholder = 'Search orders, customers, products…';
      quickInput.readOnly = true;
      const filterBox = util.el('section', 'ref-sidebar-filters', summary);
      util.el('div', 'ref-design-section-title', filterBox, 'Filters');
      const filter = (label, value) => {
        const wrap = util.el('label', 'ref-sidebar-filter', filterBox);
        util.el('span', 'ref-sidebar-label', wrap, label);
        const field = util.el('div', 'ref-sidebar-control', wrap, value);
        util.el('span', 'ref-sidebar-chevron', field, '⌄');
      };
      filter('Order Status', 'All');
      filter('Customer', 'All');
      filter('Date Range', '▣  All dates');
      const amount = util.el('div', 'ref-amount-range', filterBox);
      for (const [label, value] of [['Min Amount', 'Any'], ['Max Amount', 'Any']]) {
        const wrap = util.el('label', 'ref-sidebar-filter', amount);
        util.el('span', 'ref-sidebar-label', wrap, label);
        util.el('div', 'ref-sidebar-control', wrap, value);
      }
      const clear = util.el('div', 'ref-sidebar-clear', filterBox, 'Clear Filters');
      clear.setAttribute('aria-hidden', 'true');
      S.frameSidebar(_c, summary);
      Object.assign(_c, { amount, body, cancelledCount, clear, filter, filterBox, metric, metrics, pendingCount, quick, quickField, quickInput, shippedCount, summary, summaryCard, totalCount });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.summary.prepend(panel);
    },
  };

  env.site({
    name: 'design-use-data-grid-reorder-03',
    template: 'site/base',
    design: { parts },
  });
})();
