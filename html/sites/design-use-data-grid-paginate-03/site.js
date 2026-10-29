// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, TITLES, endLabel } = S;
      // Motif workstation frame surrounding the task window.

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
      const top = util.el('div', 'mag-top', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', top, 'Acme Enterprises');
      brand.dataset.role = 'brand';
      const account = util.el('div', 'mag-account', top);
      for (const item of ['Welcome, Maria Lopez', 'Help', 'My Account', 'Sign Out']) util.el('span', '', account, item);
      Object.assign(_c, { account, brand, collide, cr, decoys, label, nav, placement, sidebar, title, top, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Dashboard', 'Orders', 'Customers', 'Inventory', 'Employees', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          if (item === 'Orders') a.classList.add('active');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
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
      const pageHead = util.el('div', 'mag-page-head', document.body);
      util.el('h1', '', pageHead, 'Orders');
      const stats = util.el('div', 'mag-stats', pageHead);
      for (const [label, value] of [['Total Orders','342'],['Open','128'],['Shipped','176'],['Cancelled','38']]) {
        const stat = util.el('div', 'mag-stat', stats);
        util.el('span', '', stat, label);
        util.el('strong', '', stat, value);
      }
      if (display === 'header') {
        const note = document.querySelector('.ref-instruction');
        if (note) pageHead.insertBefore(note, stats);
      }
      Object.assign(_c, { headerTools, pageHead, stats, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-data-grid-paginate-03',
    template: 'site/base',
    design: { parts },
  });
})();
