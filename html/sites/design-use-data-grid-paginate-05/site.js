// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      const appTools = util.el('header', 'orders-brand', document.body);
      util.el('strong', '', appTools, 'Acme');
      util.el('span', '', appTools, 'COMMERCE');
      Object.assign(_c, { H, W, appTools, display, roomy, tall });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      S.frameSidebar(_c, body);
      const inspector = util.el('aside', 'order-inspector', body);
      util.el('h2', '', inspector, 'Order Details');
      const empty = util.el('div', 'inspector-empty', inspector);
      empty.innerHTML = '<svg viewBox="0 0 72 72" width="72" height="72" aria-hidden="true"><path d="M36 4 64 20v32L36 68 8 52V20Z M8 20l28 16 28-16M36 36v32" fill="none" stroke="#898989" stroke-width="3.5" stroke-linejoin="round"/></svg><span>Select an order to view<br>details</span>';
      const details = util.el('div', 'inspector-fields', inspector);
      for (const label of ['Order #','Date','Customer','Status','Total','Items','Ship Method','Tracking #']) {
        util.el('span', '', details, label); util.el('span', '', details, '—');
      }
      util.el('hr', '', inspector);
      util.el('div', 'inspector-section', inspector, 'Shipping Address\n—\n—\n—');
      util.el('hr', '', inspector);
      util.el('div', 'inspector-section', inspector, 'Payment Method\n—');
      const dock = util.el('nav', 'bottom-dock', document.body);
      const icons = {
        Dashboard:'<path d="m3 12 13-11 13 11v17H19V18h-6v11H3z"/>',
        Orders:'<rect x="6" y="2" width="20" height="28" rx="2"/><path d="M11 10h10M11 16h10M11 22h7"/>',
        Inventory:'<path d="M16 2 29 9v15L16 31 3 24V9zM3 9l13 8 13-8M16 17v14"/>',
        Customers:'<circle cx="12" cy="10" r="5"/><circle cx="23" cy="12" r="4"/><path d="M3 28v-4c0-5 4-8 9-8s9 3 9 8v4M21 18c5 0 8 3 8 7v3"/>',
        Reports:'<path d="M5 27V17M15 27V5M25 27V11"/>',
        Settings:'<circle cx="16" cy="16" r="5"/><path d="M13 2h6l1 4 3 1 4-2 4 5-3 3v5l3 3-4 5-4-2-3 1-1 4h-6l-1-4-3-1-4 2-4-5 3-3v-5l-3-3 4-5 4 2 3-1z"/>'
      };
      for (const label of ['Dashboard','Orders','Inventory','Customers','Reports','Settings']) {
        const item = util.el('div', label === 'Orders' ? 'dock-item active' : 'dock-item', dock);
        const icon = util.el('span', 'dock-icon', item);
        icon.innerHTML = `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[label]}</svg>`;
        util.el('span', '', item, label);
      }
      Object.assign(_c, { body, inspector, dock });
    },
  };

  env.site({
    name: 'design-use-data-grid-paginate-05',
    template: 'site/base',
    design: { parts },
  });
})();
