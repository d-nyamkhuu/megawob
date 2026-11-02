// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const storeHead = util.el('div', 'bf-head', header);
      util.el('div', 'bf-logo', storeHead, 'Bluefin Electronics');
      const search = util.el('div', 'bf-search', storeHead, '⌕　Search products, brands and more');
      const right = util.el('div', 'bf-head-right', storeHead);
      util.el('span', 'bf-account', right, 'Account');
      util.el('span', 'bf-cart', right, 'Cart');
      const hero = util.el('section', 'bf-hero', document.body);
      const heroCopy = util.el('div', 'bf-hero-copy', hero);
      util.el('strong', '', heroCopy, 'Secure checkout');
      util.el('span', '', heroCopy, "You’re almost there. Review your items and choose your options.");
      const benefits = util.el('div', 'bf-benefits', heroCopy);
      for (const [icon, title, sub] of [['♧','Free delivery','on orders over $50'], ['♢','Secure payments','256-bit encryption'], ['◴','30-day returns','Hassle free']]) {
        const item = util.el('div', 'bf-benefit', benefits);
        util.el('span', 'bf-benefit-icon', item, icon);
        const words = util.el('span', 'bf-benefit-words', item);
        util.el('b', '', words, title);
        util.el('small', '', words, sub);
      }
      const heroRight = util.el('div', 'bf-hero-right', hero);
      util.el('strong', '', heroRight, 'Tech for a brighter everyday');
      util.el('span', '', heroRight, 'Laptops, audio, smart home and more.');
      S.frameBrand(_c, header);
      Object.assign(_c, { benefits, header, hero, heroCopy, heroRight, right, search, storeHead });
    },
    'frame.footer': (base, S) => function (_c) {
      const { util, wantFooter } = _c;
      base(_c);
      if (wantFooter) {
        const foot = document.querySelector('.ref-foot');
        const dock = util.el('nav', 'bf-dock', foot);
        foot.prepend(dock);
        for (const item of ['⌂　Home', '▦　Shop', '◇　Deals', '♡　Wish list', '▤　Orders', '♙　Account']) util.el('span', '', dock, item);
        foot.querySelector('.ref-foot-text').textContent = 'Secure checkout · Ready';
      }
    },
    'frame.floating': (base, S) => function (_c) {
      const { util } = _c;
      base(_c);
      if (!document.querySelector('.bf-dock')) {
        const dock = util.el('nav', 'bf-dock bf-dock-fixed', document.body);
        for (const item of ['⌂　Home', '▦　Shop', '◇　Deals', '♡　Wish list', '▤　Orders', '♙　Account']) util.el('span', '', dock, item);
      }
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-precheck-01',
    template: 'site/base',
    design: { parts },
  });
})();
