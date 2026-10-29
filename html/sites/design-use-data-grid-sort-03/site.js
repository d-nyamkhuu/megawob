// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        // Sun workstation window frame and menu bar. These are static frame; task state stays in the widget.
        const winbar = util.el('div', 'ol-windowbar', header);
        util.el('span', 'ol-appmark', winbar, '✥');
        util.el('strong', 'ol-windowtitle', winbar, 'Order Manager');
        const wincontrols = util.el('div', 'ol-wincontrols', winbar);
        for (const glyph of ['—', '□', '×']) util.el('span', 'ol-wincontrol', wincontrols, glyph);
        const menubar = util.el('nav', 'ol-menubar', header);
        for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'ol-menuitem', menubar, label);
        S.frameBrand(_c, header);
        Object.assign(_c, { header, menubar, winbar, wincontrols });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'ol-rail', body);
        for (const [icon, label, active] of [
          ['⌂', 'Home', false],
          ['▤', 'Products', true],
          ['▣', 'Orders', false],
          ['♟', 'Suppliers', false],
          ['▥', 'Reports', false],
          ['⚙', 'Settings', false],
        ]) {
          const item = util.el('div', `ol-railitem${active ? ' active' : ''}`, rail);
          util.el('span', 'ol-railicon', item, icon);
          util.el('span', 'ol-raillabel', item, label);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rail });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        util.el('div', 'orders-section-title', body, 'Orders');
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const customers = util.el('aside', 'customer-index', body);
        const customerTitle = util.el('div', 'customer-index-title', customers, 'Customers');
        const customerTools = util.el('div', 'customer-index-tools', customers);
        util.el('label', '', customerTools, 'Search:');
        const customerSearch = util.el('input', '', customerTools);
        customerSearch.setAttribute('aria-label', 'Search customers');
        const customerGo = util.el('button', '', customerTools, 'Go');
        customerGo.type = 'button';
        const customerTable = util.el('div', 'customer-index-table', customers);
        const customerHead = util.el('div', 'customer-index-row customer-index-head', customerTable);
        util.el('strong', '', customerHead, 'Customer Name');
        util.el('strong', '', customerHead, 'City');
        for (const [customer, city] of [
          ['Acme Supply', 'New York'],
          ['Atlantic Books', 'Boston'],
          ['Bayside Systems', 'San Francisco'],
          ['Capital Electronics', 'Chicago'],
          ['Central Office', 'Dallas'],
          ['Global Mart', 'Seattle'],
          ['Green Valley', 'Denver'],
          ['Hillman Co.', 'Phoenix'],
          ['Johnson & Co.', 'Minneapolis'],
          ['Lakeside Co.', 'Detroit'],
          ['Metro Office', 'St. Louis'],
          ['Office World', 'Miami'],
          ['Parkway Distributors', 'Atlanta'],
          ['Pine Ridge', 'Portland'],
          ['Sunrise Ltd.', 'San Diego'],
          ['Tech Direct', 'Austin'],
          ['Valley Industrial', 'Raleigh'],
          ['West Point', 'Kansas City'],
        ]) {
          const row = util.el('div', 'customer-index-row', customerTable);
          util.el('span', '', row, customer);
          util.el('span', '', row, city);
        }
        const tip = util.el('div', 'ol-tip', body);
        util.el('span', 'ol-tipmark', tip, '?');
        util.el(
          'span',
          'ol-tiptext',
          tip,
          'Tip: Click a column header to sort. Use the column menus for filtering options.\nYou can select multiple products with Shift-click and use the toolbar for bulk actions.',
        );
        Object.assign(_c, {
          customerGo,
          customerHead,
          customerSearch,
          customerTable,
          customerTitle,
          customerTools,
          customers,
          stage,
          tip,
        });
      },
  };

  env.site({
    name: 'design-use-data-grid-sort-03',
    template: 'site/base',
    design: { parts },
  });
})();
