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
      root.style.setProperty('--accent', '#1683e8');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      // ShopEase dashboard remains visible around the floating preferences window.
      const appbar = util.el('div', 'shop-appbar', document.body);
      util.el('span', 'shop-mark', appbar, '▣');
      util.el('strong', 'shop-wordmark', appbar, 'ShopEase');
      const appnav = util.el('nav', 'shop-nav', appbar);
      ['Home', 'Orders', 'Products', 'Customers', 'Analytics'].forEach((item, i) => {
        const link = util.el('span', `shop-nav-item${i === 0 ? ' active' : ''}`, appnav, item);
        if (i === 0) link.dataset.active = 'true';
      });
      const appactions = util.el('div', 'shop-actions', appbar);
      util.el('span', 'shop-search-icon', appactions, '⌕');
      util.el('span', 'shop-bell', appactions, '♧');
      util.el('span', 'shop-avatar', appactions, 'JD');
      const dashboard = util.el('div', 'shop-dashboard', document.body);
      const dashside = util.el('aside', 'shop-sidebar', dashboard);
      ['⌂  Dashboard', '▢  Orders', '◇  Products', '♙  Customers', '⚑  Marketing', '⊗  Discounts', '▥  Reports'].forEach((item, i) => {
        const row = util.el('div', `shop-side-row${i === 0 ? ' active' : ''}`, dashside, item);
        if (i === 1) util.el('span', 'shop-count', row, '24');
      });
      const dashmain = util.el('main', 'shop-main', dashboard);
      const stats = util.el('div', 'shop-stats', dashmain);
      [['Total Orders','1,284','↑ 12%'],['Total Revenue','$48,620',''],['Active Customers','892','↑ 5%'],['Products','320','↑ 3%']].forEach(([title,value,delta]) => {
        const card = util.el('div', 'shop-stat', stats);
        util.el('div', 'shop-stat-title', card, title);
        util.el('strong', 'shop-stat-value', card, value);
        if (delta) util.el('span', 'shop-stat-delta', card, delta);
        util.el('span', 'shop-spark', card, '⌁╱⌁╱⌁');
      });
      const orders = util.el('div', 'shop-orders', dashmain);
      util.el('strong', 'shop-orders-title', orders, 'Recent Orders');
      ['#10432','#10431','#10430','#10429','#10428'].forEach((n, i) => {
        const row = util.el('div', 'shop-order-row', orders);
        util.el('span', '', row, n);
        util.el('span', '', row, ['Processing','Shipped','Delivered','Processing','Cancelled'][i]);
      });
      util.el('div', 'shop-dim', document.body);
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.classList.toggle('ref-header-note', display === 'header');
      // The note takes space in the flow; it needs no extra stage reservation.
      document.body.classList.remove('ref-has-note');
      Object.assign(_c, { H, W, appactions, appbar, appnav, dashboard, dashmain, dashside, display, orders, roomy, stats, tall });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      document.body.classList.toggle('office-no-instruction', display === 'hidden');
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (display === 'hidden') headerTools.classList.add('ref-hidden-tools');
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      // Keep the sibling's random draws consumed; the reference uses dashboard metrics in the background.
      if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-change-settings-mixed-04',
    template: 'site/base',
    design: { parts },
  });
})();
