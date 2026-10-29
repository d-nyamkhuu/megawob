// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'chronicle-account', header, 'Welcome, Alex Carter　 |　 Help　 |　 Sign Out');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'chronicle-rail', body);
      const railIcons = {
        Pages: 'M2 12 12 3l10 9h-3v10h-5v-7h-4v7H5V12z',
        Articles: 'M5 2h10l5 5v15H5z M14 2v6h6 M8 12h9 M8 16h9 M8 19h7',
        Media: 'M2 3h20v18H2z M3 18l6-7 5 5 3-3 5 6 M16 7h.1',
        Campaigns: 'M2 5h20v15H2z M2 6l10 8L22 6',
        Social: 'M20 10c0 4-4 7-9 7l-6 4 1-6C0 11 3 3 11 3c5 0 9 3 9 7 M17 17l5 4-1-6',
        Analytics: 'M3 14h4v8H3z M10 9h4v13h-4z M17 3h4v19h-4z',
        Settings: 'M10 2h4l1 4 4-1 2 4-3 3 3 3-2 4-4-1-1 4h-4l-1-4-4 1-2-4 3-3-3-3 2-4 4 1z M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
      };
      for (const [name, path] of Object.entries(railIcons)) {
        const row = util.el('div', `chronicle-rail-row${name === 'Pages' ? ' active' : ''}`, rail);
        const svg = util.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, row);
        util.svg('path', { d: path }, svg);
        util.el('span', '', row, name);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railIcons });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const summary = util.el('aside', 'chronicle-summary', body);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) summary.appendChild(taskPanel);
      const status = util.el('section', 'chronicle-summary-section', summary);
      util.el('h2', '', status, 'Page Status');
      util.el('div', 'chronicle-status', status, 'Unpublished');
      util.el('p', '', status, 'Last updated:\nApr 24, 2011 10:16 AM\nBy Alex Carter');
      const details = util.el('section', 'chronicle-summary-section', summary);
      util.el('h2', '', details, 'Page Details');
      util.el('strong', '', details, 'Title');
      util.el('div', 'chronicle-field', details, 'Home Page');
      util.el('strong', '', details, 'URL Slug');
      util.el('div', 'chronicle-field', details, 'home');
      util.el('strong', '', details, 'Template');
      util.el('div', 'chronicle-field', details, 'Main (Two Column)　⌄');
      const counts = util.el('section', 'chronicle-summary-section', summary);
      util.el('h2', '', counts, 'Content Blocks');
      for (const [block, count] of [['Heading 1','5'],['Text 3','4'],['Image 2','6'],['Quote 6','3'],['Article List','2'],['Video 1','2'],['Divider','1']]) {
        const row = util.el('div', 'chronicle-count', counts);
        util.el('span', '', row, block); util.el('span', '', row, count);
      }
      const scheduled = util.el('section', 'chronicle-summary-section', summary);
      util.el('h2', '', scheduled, 'Scheduled Publishing');
      util.el('p', '', scheduled, 'Not scheduled');
      util.el('a', '', scheduled, 'Set a date and time');
      Object.assign(_c, { counts, details, scheduled, stage, status, summary, taskPanel });
    },
  };

  env.site({
    name: 'design-use-site-builder-page-02',
    template: 'site/base',
    design: { parts },
  });
})();
