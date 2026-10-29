// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // This reference design uses one cool gray Bootstrap-era palette across episodes.
      root.style.setProperty('--bg', '#eef1f4');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--fg', '#171e2c');
      root.style.setProperty('--muted', '#8993a3');
      root.style.setProperty('--line', '#c5cdd8');
      root.style.setProperty('--accent', '#0865cd');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
      const brand = util.el('div', 'ref-brand', header, 'Order Manager');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const menu = util.el('nav', 'ol-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help']) util.el('span', '', menu, item);
      Object.assign(_c, { menu });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const windowControls = util.el('div', 'ol-window-controls', header);
      for (const [symbol, label] of [['–', 'Minimize window'], ['□', 'Maximize window'], ['×', 'Close window']]) {
        const control = util.el('button', 'ol-window-control', windowControls, symbol);
        control.type = 'button';
        control.title = label;
        control.setAttribute('aria-label', label);
      }
      Object.assign(_c, { headerTools, submit, windowControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'ol-rail', body);
      for (const [icon, text] of [['▤', 'Orders'], ['♟', 'Customers'], ['↗', 'Returns'], ['▥', 'Reports'], ['⚙', 'Settings']]) {
        const item = util.el('div', `ol-rail-item${text === 'Orders' ? ' active' : ''}`, rail);
        util.el('span', 'ol-rail-icon', item, icon);
        util.el('span', 'ol-rail-label', item, text);
      }
      if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      Object.assign(_c, { body, rail });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, label, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      const help = util.el('aside', 'ol-help', body);
      const helpHead = util.el('div', 'ol-help-head', help);
      util.el('strong', '', helpHead, 'Help');
      util.el('span', 'ol-pin', helpHead, '◆');
      const helpContent = util.el('div', 'ol-help-content', help);
      util.el('h3', '', helpContent, 'Working with orders');
      util.el('p', '', helpContent, 'Select an order from the list to view its details. Use the tabs to see related information or to create a return request.');
      util.el('hr', '', helpContent);
      util.el('h3', '', helpContent, 'Tabs');
      const tabInfo = util.el('div', 'ol-help-list', helpContent);
      for (const [label, desc] of [['Order', 'order details, carrier and items'], ['Billing', 'customer and invoice details'], ['Shipping', 'delivery address and method'], ['Return form', 'enter a return request']]) {
        const row = util.el('div', '', tabInfo);
        util.el('b', '', row, label);
        util.el('span', '', row, ` — ${desc}`);
      }
      util.el('hr', '', helpContent);
      util.el('h3', '', helpContent, 'Tips');
      const tips = util.el('ul', '', helpContent);
      for (const tip of ['Use the information from the order, billing and shipping tabs to complete the return form.', 'Values you need may be on a different tab.', 'The order list can be long; use the scrollbar to view more orders.']) util.el('li', '', tips, tip);
      Object.assign(_c, { help, helpContent, helpHead, stage, tabInfo, tips });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-recall-info-crossref-03',
    template: 'site/base',
    design: { parts },
  });
})();
