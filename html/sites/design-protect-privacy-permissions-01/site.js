// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Thistle Mobile');
      brand.dataset.role = 'brand';
      util.el('span', 'ref-support', header, 'Support');
      Object.assign(_c, { brand, header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('h2', '', inspector, 'Ticket details');
      const details = [
        ['Ticket #', 'TM-48291'], ['Subject', 'Unable to make calls'], ['Status', 'Open'],
        ['Created', 'Apr 16, 2022, 9:14 AM'], ['Last update', 'Apr 16, 2022, 10:24 AM'],
        ['Category', 'Calls & network'], ['Device', 'Pixel 6'], ['Phone number', '+1 555-0199'],
        ['Plan', 'Thistle Mobile Unlimited'],
      ];
      const detailList = util.el('dl', 'ref-detail-list', inspector);
      for (const [key, value] of details) {
        util.el('dt', '', detailList, key);
        const dd = util.el('dd', '', detailList, value);
        if (key === 'Status') dd.classList.add('ref-status');
      }
      util.el('h2', 'ref-related-title', inspector, 'Related articles');
      const articles = util.el('div', 'ref-articles', inspector);
      for (const title of ['Fix call and network issues', 'Check your mobile data settings', 'Reset network settings', 'Contact support']) {
        util.el('div', 'ref-article', articles, title);
      }
      Object.assign(_c, { articles, detailList, details, inspector, stage });
    },
  };

  env.site({
    name: 'design-protect-privacy-permissions-01',
    template: 'site/base',
    design: { parts },
  });
})();
