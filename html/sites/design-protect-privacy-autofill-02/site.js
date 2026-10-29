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
      header.dataset.appTitle = 'ShopEasy Online Store';
      const menu = util.el('div', 'ref-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']) {
        util.el('span', 'ref-menuitem', menu, item);
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Pinecrest Goods');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of local([...navItems, ...content.NAV_ITEMS].slice(0, 6), K.nav)) {
          const labels = ['Home', 'Search', 'Categories', 'Cart', 'Orders', 'My Account'];
          const shown = labels[n.children.length] || item;
          const a = util.el('a', 'ref-navlink', n, shown);
          a.dataset.icon = ['⌂', '🛒', '▣', '▤', '⚙'][n.children.length - 1] || '•';
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header, menu });
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
      const categories = util.el('aside', 'ref-categories', body);
      util.el('div', 'ref-category-title', categories, 'Shop by Category');
      for (const item of ['Electronics', 'Home & Garden', 'Books', 'Movies & Music', 'Toys & Games',
        'Sports & Outdoors', 'Health & Beauty', 'Clothing', 'More Categories']) {
        const a = util.el('a', 'ref-category-link', categories, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'category', label: item }); });
      }
      const storehead = util.el('div', 'ref-storehead', body);
      util.el('div', 'ref-store-logo', storehead, '🛒 ShopEasy');
      util.el('div', 'ref-store-tagline', storehead, 'Great Products.  Everyday Values.');
      const search = util.el('div', 'ref-search', storehead);
      const searchfield = util.el('input', '', search);
      searchfield.type = 'text';
      searchfield.setAttribute('aria-label', 'Search');
      const searchbutton = util.el('button', '', search, 'Search');
      searchbutton.type = 'button';
      Object.assign(_c, { categories, search, searchbutton, searchfield, storehead });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'ref-checkout-help', body);
      const helpbox = (title, icon, lines) => {
        const box = util.el('section', 'ref-helpbox', help);
        const h = util.el('div', 'ref-help-title', box);
        util.el('span', 'ref-help-icon', h, icon);
        util.el('span', '', h, title);
        const list = util.el('ul', '', box);
        for (const line of lines) util.el('li', '', list, line);
      };
      helpbox('Secure Checkout', '▣', ['Your information is protected with 128-bit encryption.']);
      helpbox('Shipping Information', '▱', ['We ship to U.S. addresses only.', 'Please enter a complete and accurate shipping address.', 'P.O. boxes are accepted.', 'Orders usually ship within 1–2 business days.']);
      helpbox('Tips', '▤', ['Use your full name as it appears on your mailbox.', 'Include apartment, suite, or unit numbers if applicable.', 'Double-check the postal code for accuracy.', 'Your shipping address will only be used to fulfill this order.']);
      Object.assign(_c, { help, helpbox, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-autofill-02',
    template: 'site/base',
    design: { parts },
  });
})();
