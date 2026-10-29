// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = rng.bool(0.35);
      const sidebar = true;
      const navDraw = rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const sampledBrand = word ? word(lr.pick(K.brand)) : title;
      const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const brand = util.el('div', 'ref-brand', header, 'Club Manager');
      brand.dataset.role = 'brand';
      const lights = util.el('div', 'aqua-lights', header);
      for (const name of ['red','yellow','green']) util.el('span', name, lights);
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const names = ['Members', 'Events', 'Communications', 'Reports'];
        const icons = ['♟', '▣', '✉', '▥'];
        for (const [i, item] of names.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.icon = icons[i];
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      body.style.top = Math.ceil(_c.header.getBoundingClientRect().height) + 'px';
      const inspector = util.el('section', 'aqua-inspector', document.body);
      const heading = util.el('div', 'aqua-inspector-title', inspector);
      util.el('span', 'aqua-paper', heading, '▤');
      util.el('b', '', heading, 'Details');
      util.el('span', 'aqua-rule', heading);
      const properties = util.el('div', 'aqua-properties', inspector);
      for (const name of ['Member ID:', 'Member Since:']) {
        const field = util.el('div', 'aqua-property', properties);
        util.el('span', '', field, name);
        util.el('div', 'aqua-well', field);
      }
      Object.assign(_c, { body });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        const edge = Math.ceil(note.getBoundingClientRect().bottom) + 8;
        _c.body.style.top = Math.max(edge, _c.header.getBoundingClientRect().bottom) + 'px';
      }
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-complete-goals-booking-05',
    template: 'site/base',
    design: { parts },
  });
})();
