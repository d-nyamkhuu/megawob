// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-header-note', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Acme Corp');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const libraryNav = ['Home', 'Help Center', 'My Support', 'Requests', 'Reports', 'Settings'];
        const sampledNav = nav ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : libraryNav;
        for (let i = 0; i < sampledNav.length; i++) {
          const item = libraryNav[i];
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
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
      const related = util.el('footer', 'ref-related', document.body);
      util.el('strong', 'ref-related-title', related, 'Related articles');
      const relatedItems = util.el('div', 'ref-related-items', related);
      for (const item of ['Company values', 'Benefits overview', 'Code of conduct', 'Working remotely', 'IT support', 'Career development']) {
        util.el('a', 'ref-related-link', relatedItems, item);
      }
      Object.assign(_c, { related, relatedItems, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-scroll-page-carousel-03',
    template: 'site/base',
    design: { parts },
  });
})();
