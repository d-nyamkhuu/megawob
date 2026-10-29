// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const storeHead = util.el('div', 'bf-head', header);
      util.el('div', 'bf-logo', storeHead, 'SkyWay');
      const search = util.el('div', 'bf-search', storeHead);
      ['Flights', 'Hotels', 'Cars', 'Holiday Packages', 'Manage Booking'].forEach((t, i) => util.el('span', i ? 'bf-tab' : 'bf-tab on', search, t));
      const right = util.el('div', 'bf-head-right', storeHead);
      util.el('span', 'bf-account', right, 'My Account');
      util.el('span', 'bf-cart', right, 'Help');
      util.el('span', 'bf-cart', right, 'English ⌄');
      const lp = util.el('aside', 'sw-left', document.body);
      util.el('h4', '', lp, 'Search Flights');
      for (const [l, v] of [['From', 'Belagavi (IXG)'], ['To', 'Baltimore (BWI)'], ['Depart', 'Tue, 15 Jul 2025'], ['Return', 'Tue, 29 Jul 2025'], ['Passengers', '1 adult']]) {
        util.el('label', '', lp, l);
        util.el('div', 'sw-field', lp, v);
      }
      util.el('div', 'sw-btn', lp, 'Search Flights');
      util.el('h4', 'sw-h2', lp, 'Filter Results');
      for (const t of ['Non-stop (2)', '1 stop (18)', '2+ stops (6)']) util.el('div', 'sw-chk', lp, t);
      const rp = util.el('aside', 'sw-right', document.body);
      util.el('h4', '', rp, '✈ Flight Details');
      util.el('div', 'sw-photo', rp);
      util.el('b', '', rp, 'Belagavi (IXG) → Baltimore (BWI)');
      util.el('p', '', rp, 'Tue, 15 Jul 2025 – Tue, 29 Jul 2025');
      util.el('p', '', rp, '1 adult, Economy Class');
      util.el('u', '', rp, 'Change search');
      util.el('h5', '', rp, 'Outgoing flight');
      util.el('p', '', rp, '06:20  Belagavi (IXG)');
      util.el('p', '', rp, '22:15  Baltimore (BWI)');
      util.el('p', '', rp, 'Total duration: 25h 25m');
      util.el('h5', '', rp, 'Return flight');
      util.el('p', '', rp, '08:10  Baltimore (BWI)');
      util.el('p', '', rp, '20:40  Belagavi (IXG)');
      util.el('p', '', rp, 'Total duration: 26h 0m');
      util.el('h5', '', rp, 'Fare type');
      util.el('p', '', rp, 'Economy Class');
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
    name: 'design-avoid-dark-patterns-precheck-05',
    template: 'site/base',
    design: { parts },
  });
})();
