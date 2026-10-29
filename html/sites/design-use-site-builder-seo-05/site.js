// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Riverdale CMS');
      brand.dataset.role = 'brand';
      const links = util.el('nav', 'rd-topnav', header);
      ['Content', 'Campaigns', 'Social', 'Analytics'].forEach((name, i) => {
        const tab = util.el('span', i === 0 ? 'rd-current' : '', links, name);
        tab.setAttribute('role', 'tab');
      });
      util.el('div', 'rd-topspace', header);
      const search = util.el('span', 'rd-search', header);
      search.setAttribute('aria-label', 'Search');
      util.el('span', 'rd-user', header, 'JD');
      Object.assign(_c, { brand, header, title });
    },
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (_c.ctx.finish) return;
      const r = _c.rng.fork('riverdale/end');
      _c.placement = r.pick(['header', 'header', 'header', 'footer', 'link', 'icon']);
      if (r.bool(0.52)) _c.label = 'Finish';
      _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
    },
  };

  env.site({
    name: 'design-use-site-builder-seo-05',
    template: 'site/base',
    design: { parts },
  });
})();
