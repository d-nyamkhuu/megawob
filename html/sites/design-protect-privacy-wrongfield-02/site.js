// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      // Keep the full form visible when a toast and end-control frame would crowd it.
      if (_c.display === 'toast' && _c.H <= 720) {
        _c.headerToast = true;
        _c.display = 'header';
        document.body.classList.remove('ref-has-note');
      }
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Acme CRM's compact Lightning-era global bar.
      const crmBrand = util.el('div', 'crm-brand', header);
      util.el('span', 'crm-cloud', crmBrand, '☁');
      util.el('strong', '', crmBrand, 'Acme CRM');
      const search = util.el('div', 'crm-search', header, 'Search accounts, contacts, and more…');
      util.el('span', 'crm-search-icon', search, '⌕');
      if (display !== 'header' || nav || _c.headerToast) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { crmBrand, header, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const stories = util.el('aside', 'travel-stories', body);
      util.el('div', 'travel-stories-title', stories, 'Latest from Saffron Travel');
      const storyItems = [
        ['Hidden Gems in Portugal', 'Travel Tips', 'story-1.jpg'],
        ['Hiking the Alps on a Budget', 'Travel Tips', 'story-2.jpg'],
        ['A Week in Kyoto', 'Destinations', 'story-3.jpg'],
        ['Island Hopping in Greece', 'Destinations', 'story-4.jpg'],
        ['City Guide: Barcelona', 'Travel Tips', 'story-5.jpg'],
        ['Top 10 National Parks in the US', 'Destinations', 'story-6.jpg'],
      ];
      const storyList = util.el('div', 'travel-story-list', stories);
      for (const [title, category, image] of storyItems) {
        const item = util.el('article', 'travel-story', storyList);
        const thumb = util.el('img', 'travel-story-thumb', item);
        thumb.src = `sites/design-protect-privacy-wrongfield-02/assets/${image}`;
        thumb.alt = '';
        const copy = util.el('div', 'travel-story-copy', item);
        util.el('div', 'travel-story-name', copy, title);
        util.el('div', 'travel-story-category', copy, category);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, stories, storyItems, storyList });
    },
  };

  env.site({
    name: 'design-protect-privacy-wrongfield-02',
    template: 'site/base',
    design: { parts },
  });
})();
