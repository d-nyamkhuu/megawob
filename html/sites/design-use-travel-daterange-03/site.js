// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      S.frameSidebar(_c, body);
      const tripList = util.el('aside', 'tj-trip-sidebar', body);
      const tripHead = util.el('div', 'tj-trip-head', tripList);
      util.el('strong', '', tripHead, 'Trips');
      const addTrip = util.el('button', 'tj-add-trip', tripHead, '+');
      addTrip.type = 'button';
      addTrip.addEventListener('click', () => env.log('decoy', {what:'add trip'}));
      const tripLinks = util.el('div', 'tj-trip-links', tripList);
      for (const [icon, text, count] of [['▣','All Trips','12'],['◷','Upcoming','4'],['▢','Past Trips','8'],['♡','Favorites','3']]) {
        const row = util.el('div', 'tj-trip-link', tripLinks);
        util.el('span', 'tj-trip-icon', row, icon); util.el('span', '', row, text); util.el('small', '', row, count);
      }
      const tripCards = util.el('div', 'tj-trip-cards', tripList);
      for (const [city, dates, art] of [['Singapore','Apr 14 — Apr 20','singapore'],['Kuala Lumpur','May 8 — May 12','kuala'],['Tokyo','Jun 3 — Jun 10','tokyo'],['Sydney','Aug 15 — Aug 22','sydney'],['Barcelona','Oct 1 — Oct 7','barcelona']]) {
        const card = util.el('div', `tj-trip-card${city === 'Kuala Lumpur' ? ' selected' : ''}`, tripCards);
        util.el('span', `tj-trip-thumb ${art}`, card);
        const copy = util.el('span', 'tj-trip-copy', card); util.el('strong', '', copy, city); util.el('small', '', copy, dates);
      }
      Object.assign(_c, { addTrip, body, tripCards, tripHead, tripLinks, tripList });
    },
  };

  env.site({
    name: 'design-use-travel-daterange-03',
    template: 'site/base',
    design: { parts },
  });
})();
