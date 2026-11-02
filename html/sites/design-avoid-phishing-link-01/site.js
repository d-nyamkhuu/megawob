// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'ref-search', header);
      util.el('span', '', search, '⌕');
      util.el('span', 'ref-search-label', search, 'Search mail');
      util.el('span', 'ref-search-filter', search, '☷');
      const summary = util.el('div', 'ref-summary', document.body);
      [['✉', 'Inbox', '12'], ['⚑', 'Flagged', '3'], ['♧', 'With Attachments', '5'], ['●●', 'From Vendors', '4']].forEach(([icon, title, count]) => {
        const item = util.el('div', 'ref-summary-item', summary);
        util.el('span', 'ref-summary-icon', item, icon);
        const copy = util.el('span', 'ref-summary-copy', item);
        util.el('span', '', copy, title); util.el('strong', '', copy, count);
      });
      Object.assign(_c, { search, summary });
    },
  };

  env.site({
    name: 'design-avoid-phishing-link-01',
    template: 'site/base',
    design: { parts },
  });
})();
