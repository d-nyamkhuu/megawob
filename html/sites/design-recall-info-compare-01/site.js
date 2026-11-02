// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const brand = util.el('div', 'ref-brand', header, 'Riverton Public Library');
      brand.dataset.role = 'brand';
      util.el('span', 'ref-brand-sub', header, 'CATALOGUE');
      Object.assign(_c, { brand, header });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, rng, util, wantFooter } = _c;
      let { submit } = _c;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        const about = util.el('div', 'ref-foot-about', foot);
        util.el('strong', '', about, 'About this catalogue');
        util.el('span', 'ref-foot-text', about, 'Search and browse our collection of books, journals and more. Select View to see full details for a title.');
        const guide = util.el('div', 'ref-foot-guide', foot);
        util.el('strong', '', guide, 'Cover colour guide');
        const colors = util.el('div', 'ref-color-list', guide);
        for (const [label, color] of [['Green','#405a43'],['Red','#9e2934'],['Blue','#405d73'],['Silver','#aaa69d'],['Brown','#76503a']]) {
          const item = util.el('span', 'ref-color-item', colors);
          const swatch = util.el('i', 'ref-swatch', item);
          swatch.style.backgroundColor = color;
          util.el('span', '', item, label);
        }
        const tools = util.el('div', 'ref-tools', foot);
        if (wantFooter) {
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-recall-info-compare-01',
    template: 'site/base',
    design: { parts },
  });
})();
