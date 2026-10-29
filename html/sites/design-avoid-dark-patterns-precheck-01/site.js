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
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const dock = util.el('nav', 'bf-dock', foot);
        for (const item of ['⌂　Home', '▦　Shop', '◇　Deals', '♡　Wish list', '▤　Orders', '♙　Account']) util.el('span', '', dock, item);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      if (!document.querySelector('.bf-dock')) {
        const dock = util.el('nav', 'bf-dock bf-dock-fixed', document.body);
        for (const item of ['⌂　Home', '▦　Shop', '◇　Deals', '♡　Wish list', '▤　Orders', '♙　Account']) util.el('span', '', dock, item);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-precheck-01',
    template: 'site/base',
    design: { parts },
  });
})();
