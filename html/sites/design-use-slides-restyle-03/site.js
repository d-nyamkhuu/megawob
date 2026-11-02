// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Office Suite'];

  const SUITE_TABS = ['Documents', 'Spreadsheets', 'Presentations', 'Mail', 'Contacts', 'Calendar'];

  const DECKS = ['Quarterly Review', 'Product Plan', 'Marketing Strategy', 'Team Update', 'Customer Feedback',
    'Sales Forecast', 'Website Redesign', 'Operations Plan', 'Board Meeting', 'Project Atlas'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = (display !== 'header' || nav) ? rng.pick(TITLES) : TITLES[0];
      const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const [i, item] of navItems.entries()) {
          const a = util.el('a', 'ref-navlink', n, SUITE_TABS[i] || item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (!nav) {
        const n = util.el('nav', 'ref-nav', header);
        SUITE_TABS.forEach((item) => {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        });
      }
      Object.assign(_c, { brand, header, title });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sideItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const [i, item] of sideItems.entries()) {
          const a = util.el('a', 'ref-sidelink', side, DECKS[i] || item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      if (!sidebar) {
        const side = util.el('aside', 'ref-side', body);
        DECKS.forEach((item, i) => {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          if (i === 1) a.classList.add('ref-selected');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        });
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Persistent overview rail, matching the presentation summary in this design.
      const summary = util.el('aside', 'ref-summary', body);
      const summaryHead = util.el('div', 'ref-summary-head', summary);
      util.el('span', 'ref-summary-mark', summaryHead, '✦');
      util.el('strong', '', summaryHead, 'Presentation Overview');
      const preview = util.el('div', 'ref-summary-preview', summary);
      util.el('div', 'ref-summary-cover', preview, 'Explore\nA Cleaner\nTomorrow');
      const details = util.el('div', 'ref-summary-details', preview);
      util.el('strong', '', details, 'Green Future');
      util.el('span', '', details, '4 slides');
      util.el('span', '', details, 'Last modified');
      util.el('span', '', details, 'Apr 12, 2006  10:24 AM');
      const counts = util.el('section', 'ref-summary-section', summary);
      util.el('h3', '', counts, 'Slide Summary');
      [['Total slides', '4'], ['Text boxes', '12'], ['Images', '4'], ['Shapes', '6']].forEach(([k, v]) => {
        const row = util.el('div', 'ref-summary-row', counts);
        util.el('span', '', row, k); util.el('span', '', row, v);
      });
      const design = util.el('section', 'ref-summary-section', summary);
      util.el('h3', '', design, 'Design');
      [['Theme', 'Ocean Breeze'], ['Colour scheme', 'Blue / Green'], ['Slide size', 'Widescreen (16:9)']].forEach(([k, v]) => {
        const row = util.el('div', 'ref-summary-row', design);
        util.el('span', '', row, k); util.el('span', '', row, v);
      });
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) summary.insertBefore(taskPanel, counts);
      Object.assign(_c, { counts, design, details, preview, stage, summary, summaryHead, taskPanel });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-slides-restyle-03',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
