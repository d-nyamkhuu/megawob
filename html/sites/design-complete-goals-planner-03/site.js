// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.controls': (base, S) => function (_c) {
      const { content, ctx, display, label, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const decoyBtn = (parent, text, collides) => {
        const b = util.el('button', 'ref-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label: text, collide: true } : { label: text }));
      };
      const endBtn = (parent, cls, text) => {
        const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'app-titlebar', header);
      const title = util.el('span', 'app-mark', titlebar, '◉');
      title.setAttribute('aria-hidden', 'true');
      util.el('span', 'app-name', titlebar, 'TravelDesk');
      const winControls = util.el('div', 'irix-window-controls', titlebar);
      for (const mark of ['−', '□', '×']) util.el('button', 'irix-window-control', winControls, mark).type = 'button';
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const toolbar = util.el('div', 'app-toolbar', header);
      const n = util.el('nav', 'ref-nav', toolbar);
      const navItems = [['✈', 'Trips'], ['▰', 'Stays'], ['▣', 'Transport'], ['◆', 'Items'], ['▥', 'Reports']];
      navItems.forEach(([icon, label], i) => {
        const a = util.el('a', `ref-navlink${i === 0 ? ' active' : ''}`, n);
        util.el('span', 'nav-icon', a, icon);
        util.el('span', '', a, label);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      });
      const search = util.el('div', 'app-search', toolbar);
      util.el('span', '', search, '⌕');
      util.el('span', 'app-search-text', search, 'Search trips, bookings...');
      util.el('span', 'app-utility', toolbar, '⚙');
      util.el('span', 'app-utility', toolbar, '?');
      if (display === 'header') util.el('div', 'ref-instruction', titlebar, ctx.instruction);
      const decoyHolder = util.el('div', 'app-tools', toolbar);
      Object.assign(_c, { decoyBtn, decoyHolder, endBtn, header, n, navItems, search, title, titlebar, toolbar, winControls });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoyHolder, decoys, endBtn, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', decoyHolder);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      const side = util.el('aside', 'ref-side', body);
      util.el('div', 'side-heading', side, 'MY TRIPS');
      [['▣', 'Upcoming'], ['◷', 'Past'], ['★', 'Favourites'], ['☷', 'All trips']].forEach(([icon, label], i) => {
        const a = util.el('a', `ref-sidelink${i === 0 ? ' active' : ''}`, side);
        util.el('span', 'side-icon', a, icon);
        util.el('span', '', a, label);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label }); });
      });
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', side);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        side.insertBefore(panel, side.children[1]);
      }
      Object.assign(_c, { body, side });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'irix-inspector', body);
      util.el('div', 'inventory-heading', inspector, 'YOUR ITEMS');
      const inventory = util.el('div', 'inventory-list', inspector);
      const items = [
        ['▰', 'Laptop Computer', 'ITM-1001'], ['◉', 'Digital Camera', 'ITM-1002'],
        ['♫', 'Noise Cancelling Headphones', 'ITM-1003'], ['▣', 'Tablet 10″', 'ITM-1004'],
        ['♜', 'Stainless Steel Water Bottle 750 ml', 'ITM-1005'], ['▧', 'USB-C Power Adapter', 'ITM-1006'],
        ['▤', 'Travel Backpack 30 L', 'ITM-1007'], ['▥', 'Cabin Suitcase', 'ITM-1008'],
      ];
      for (const [icon, name, code] of items) {
        const row = util.el('div', 'inventory-row', inventory);
        util.el('span', 'inventory-image', row, icon);
        const info = util.el('span', 'inventory-info', row);
        util.el('span', 'inventory-name', info, name);
        util.el('span', 'inventory-code', info, code);
      }
      Object.assign(_c, { inspector, inventory, items, stage });
    },
    'frame.header': (base, S) => function (_c) {
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
    'frame.panel': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-complete-goals-planner-03',
    template: 'site/base',
    design: { parts },
  });
})();
