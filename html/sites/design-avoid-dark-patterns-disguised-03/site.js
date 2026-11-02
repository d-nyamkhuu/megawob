// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('filenest-header');
      if (display !== 'header' || nav) rng.pick(TITLES); // preserve the frame stream used by the reference layout
      const brand = util.el('div', 'ref-brand', header, 'Inkwell Editor');
      brand.dataset.role = 'brand';
      util.el('div', 'filenest-tagline', header, 'W R I T E   ·   O R G A N I Z E   ·   B E   P R O D U C T I V E');
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('filenest-body');
      {
        const side = util.el('aside', 'ref-side', body);
        side.classList.add('filenest-recent');
        if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7)); // preserve seeded frame draws
        util.el('strong', 'recent-heading', side, '');
        for (const item of ['Home','Features','Downloads','Support','Community','Documentation']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('filenest-stage');
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'inkwell-help', body);
      util.el('strong', 'inkwell-help-title', help, 'Why Inkwell?');
      for (const line of ['Clean, distraction-free interface','Supports plain text and rich text','Cross-platform','Open source','Active community']) {
        util.el('div', 'inkwell-help-item', help, line);
      }
      util.el('strong', 'inkwell-help-title inkwell-help-second', help, 'Need Help?');
      for (const line of ['Installation Guide','System Requirements','Frequently Asked Questions','Community Forum']) {
        util.el('div', 'inkwell-help-link', help, line);
      }
      const dock = util.el('nav', 'inkwell-dock', document.body);
      for (const [icon, item] of [['⌂','Home'],['▤','Features'],['⬇','Downloads'],['●','Support'],['♟','Community'],['◫','Documentation']]) {
        const a = util.el('a', 'inkwell-dock-item', dock);
        util.el('span', 'inkwell-dock-icon', a, icon);
        util.el('span', '', a, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      Object.assign(_c, { dock, help, stage });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-disguised-03',
    template: 'site/base',
    design: { parts },
  });
})();
