// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      // Static GEM application navigation and article index; these are frame, not task data.
      const gemRail = util.el('nav', 'gem-rail', body);
      const gemItems = [
        ['⌂', 'Home'], ['▤', 'Help Center'], ['▣', 'Orders'], ['◇', 'Products'],
        ['♧', 'Customers'], ['▥', 'Reports'], ['⚙', 'Settings'],
      ];
      for (const [icon, text] of gemItems) {
        const item = util.el('a', `gem-rail-item${text === 'Help Center' ? ' current' : ''}`, gemRail);
        item.href = '#';
        item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'navigation', label: text }); });
        util.el('span', 'gem-rail-icon', item, icon);
        util.el('span', 'gem-rail-label', item, text);
      }
      const gemIndex = util.el('aside', 'gem-index', body);
      util.el('div', 'gem-index-title', gemIndex, 'Help Articles');
      const gemList = util.el('div', 'gem-index-list', gemIndex);
      const articleTitles = ['Shipping & Delivery', 'Returns & Refunds', 'Orders & Payments', 'Products & Sizing',
        'Account Management', 'Promotions & Coupons', 'International Orders', 'Taxes & Duties', 'Track My Order',
        'Accessibility', 'Gift Cards', 'Corporate Orders'];
      articleTitles.forEach((text, i) => {
        const row = util.el('a', `gem-index-row${i === 0 ? ' current' : ''}`, gemList);
        row.href = '#';
        row.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'article-index', label: text }); });
        util.el('span', 'gem-index-number', row, `${i + 1}.`);
        util.el('span', 'gem-index-label', row, text);
      });
      S.frameSidebar(_c, body);
      Object.assign(_c, { articleTitles, body, gemIndex, gemItems, gemList, gemRail });
    },
  };

  env.site({
    name: 'design-scroll-page-accordion-01',
    template: 'site/base',
    design: { parts },
  });
})();
