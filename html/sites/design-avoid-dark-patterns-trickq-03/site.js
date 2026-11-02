// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, header, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const windowBar = util.el('div', 'br-windowbar', document.body);
        document.body.insertBefore(windowBar, header);
        util.el('strong', '', windowBar, 'Brackenridge Co.');
        util.el('span', 'br-window-controls', windowBar, '—　□　×');
        const menu = util.el('nav', 'br-menubar', document.body);
        document.body.insertBefore(menu, header);
        for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, item);
        const toolbar = util.el('nav', 'br-toolbar', document.body);
        document.body.insertBefore(toolbar, header);
        const navItems = [
          ['◆', 'Home'],
          ['🛒', 'Shop'],
          ['◆', 'Deals'],
          ['▤', 'Orders'],
          ['●', 'Account'],
        ];
        for (const [icon, label] of navItems) {
          const item = util.el('div', 'br-navitem', toolbar);
          util.el('b', '', item, icon);
          util.el('span', '', item, label);
        }
        const progress = util.el('div', 'br-progress', body);
        body.insertBefore(progress, stage);
        util.el('strong', 'br-checkout-title', progress, 'Checkout');
        const steps = util.el('div', 'br-steps', progress);
        for (const [n, label] of [
          ['1', 'Shipping'],
          ['2', 'Review & Pay'],
          ['3', 'Order Complete'],
        ]) {
          const step = util.el('div', `br-step${n === '1' ? ' active' : ''}`, steps);
          util.el('b', '', step, n);
          util.el('span', '', step, label);
        }
        const inspector = util.el('aside', 'br-inspector', body);
        // Instruction and filler navigation get their own space in the inspector.
        for (const child of Array.from(body.children)) {
          if (child.classList.contains('ref-panel') || child.classList.contains('ref-side'))
            inspector.appendChild(child);
        }
        const inspectHead = util.el('div', 'br-inspector-head', inspector);
        util.el('strong', '', inspectHead, 'Your order');
        util.el('span', '', inspectHead, '(2 items)');
        util.el('a', '', inspectHead, 'Edit');
        const products = [
          ['🎒', 'Trailhead 25 Backpack', 'Color: Navy', '$79.00'],
          ['♟', 'Ridge 1L Water Bottle', 'Color: Stainless', '$18.00'],
        ];
        for (const [icon, name, detail, price] of products) {
          const row = util.el('div', 'br-product', inspector);
          const art = util.el('span', 'br-product-art', row);
          art.setAttribute('aria-hidden', 'true');
          const photo = util.el('img', '', art);
          photo.src = name.includes('Backpack')
            ? 'sites/design-avoid-dark-patterns-trickq-03/assets/backpack.webp'
            : 'sites/design-avoid-dark-patterns-trickq-03/assets/bottle.webp';
          photo.alt = '';
          const copy = util.el('div', '', row);
          util.el('strong', '', copy, name);
          util.el('span', '', copy, detail);
          util.el('span', '', copy, 'Qty: 1');
          util.el('b', 'br-price', row, price);
        }
        const totals = util.el('div', 'br-totals', inspector);
        for (const [label, price] of [
          ['Subtotal', '$97.00'],
          ['Shipping', 'FREE'],
          ['Estimated tax　●', '$8.49'],
          ['Total (USD)', '$105.49'],
        ]) {
          const row = util.el('div', 'br-total', totals);
          util.el('span', '', row, label);
          util.el('b', '', row, price);
        }
        const perks = util.el('div', 'br-perks', inspector);
        const perk = (svg, text) => {
          const line = util.el('div', 'br-perk', perks);
          const icon = util.el('span', 'br-perk-icon', line);
          icon.innerHTML = svg;
          util.el('span', '', line, text);
        };
        perk(
          '<svg viewBox="0 0 32 32"><path d="M2 7h18v16H2zM20 12h6l5 6v5H20zM8 27a3 3 0 1 0 0-6 3 3 0 0 0 0 6m17 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6" fill="currentColor"/><path d="M23 14v5h6" fill="none" stroke="#fff" stroke-width="2"/></svg>',
          'Free shipping on orders over $50',
        );
        perk(
          '<svg viewBox="0 0 32 32"><path d="M25 13a10 10 0 0 0-18-5L4 11m0-7v7h7M7 19a10 10 0 0 0 18 5l3-3m0 7v-7h-7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          '30-day returns',
        );
        perk(
          '<svg viewBox="0 0 32 32"><rect x="5" y="14" width="22" height="16" rx="2" fill="currentColor"/><path d="M10 14V9a6 6 0 0 1 12 0v5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="16" cy="21" r="2" fill="#fff"/><path d="M16 22v4" stroke="#fff" stroke-width="2"/></svg>',
          'Secure checkout',
        );
        const help = util.el('div', 'br-help', inspector);
        util.el('strong', '', help, '❔　 Need help?　⌄');
        util.el('a', '', help, 'Shipping information');
        util.el('a', '', help, 'Returns & refunds');
        util.el('a', '', help, 'Contact support');
        Object.assign(_c, {
          help,
          inspectHead,
          inspector,
          menu,
          navItems,
          perk,
          perks,
          products,
          progress,
          stage,
          steps,
          toolbar,
          totals,
          windowBar,
        });
      },
  };

  env.site({
    name: 'design-avoid-dark-patterns-trickq-03',
    template: 'site/base',
    design: { parts },
  });
})();
