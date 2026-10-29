// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Fenwick & Bell');
        brand.dataset.role = 'brand';
      } else {
        const brand = util.el('div', 'ref-brand', header, 'Fenwick & Bell');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Home', 'Shop⌄', 'New In', 'Home & Living', 'Fashion', 'Beauty', 'Gifts', 'Offers']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (!nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Home', 'Shop⌄', 'New In', 'Home & Living', 'Fashion', 'Beauty', 'Gifts', 'Offers']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Wrenfield Mart's fixed account rail and page furniture. The task widget remains
      // responsible for the live form and its anchors; these elements are decorative.
      const rail = util.el('aside', 'wm-rail', document.body);
      rail.remove();
      const hero = util.el('div', 'wm-hero', stage);
      const heroWords = util.el('div', 'wm-hero-words', hero);
      util.el('strong', '', heroWords, 'Wrenfield Mart');
      util.el('em', '', heroWords, 'More of What You Need. Every Day.');
      util.el('div', 'wm-box-art', hero, 'Wrenfield\nMart  🛒');
      util.el('div', 'wm-slogan', hero, 'GREAT CHOICES\nLOWER PRICES\nBRIGHTER DAYS');
      const sidePanel = util.el('aside', 'wm-sidepanels', stage);
      util.el('h2', 'wm-panel-head', sidePanel, 'Why shop with Fenwick & Bell?');
      const benefits = [['♧', 'Free standard delivery', 'over £40'],
        ['↶', 'Free 28-day returns', ''],
        ['♢', 'Sustainably sourced', 'products'],
        ['☆', 'Rated Excellent', 'by our customers']];
      for (const [icon, title, copy] of benefits) {
        const row = util.el('div', 'wm-benefit', sidePanel);
        util.el('span', 'wm-benefit-icon', row, icon);
        const words = util.el('div', '', row);
        util.el('strong', '', words, title);
        util.el('span', '', words, copy);
      }
      util.el('h2', 'wm-panel-head wm-recent-head', sidePanel, 'Need help?');
      const recent = util.el('div', 'wm-recent help-links', sidePanel);
      for (const line of ['Delivery information', 'Returns & refunds', 'Our privacy policy', 'Contact support']) {
        util.el('div', 'wm-row', recent, line);
      }
      Object.assign(_c, { benefits, hero, heroWords, rail, recent, sidePanel, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-trickq-04',
    template: 'site/base',
    design: { parts },
  });
})();
