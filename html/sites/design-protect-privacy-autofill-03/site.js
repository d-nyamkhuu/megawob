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
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.appTitle = 'Ridgeway Market';
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Ridgeway Market');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of local([...navItems, ...content.NAV_ITEMS].slice(0, 5), K.nav)) {
          const labels = ['Store', 'Orders', 'Account', 'Checkout', 'Help'];
          const shown = labels[n.children.length] || item;
          const a = util.el('a', 'ref-navlink', n, shown);
          a.dataset.icon = ['⌂', '🛒', '▣', '▤', '⚙'][n.children.length - 1] || '•';
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const order = util.el('aside', 'ref-order-summary', body);
      const orderCard = util.el('div', 'ref-order-card', order);
      util.el('div', 'ref-order-title', orderCard, 'Your Order');
      util.el('div', 'ref-order-count', orderCard, '3 items');
      util.el('div', 'ref-order-rule', orderCard);
      util.el('div', 'ref-order-line', orderCard, 'Items in cart                 3');
      util.el('div', 'ref-order-line', orderCard, 'Delivery            Address');
      util.el('div', 'ref-order-line', orderCard, 'Checkout          In progress');
      util.el('div', 'ref-order-security', order, '✓  Secure checkout');
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) order.append(taskPanel);
      Object.assign(_c, { order, orderCard, taskPanel });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-autofill-03',
    template: 'site/base',
    design: { parts },
  });
})();
