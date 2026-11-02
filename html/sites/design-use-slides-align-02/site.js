// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const win = util.el('div', 'ref-windowbar', header);
      util.el('span', 'ref-window-icon', win, '◉');
      util.el('span', 'ref-window-title', win, 'Documents');
      const winControls = util.el('div', 'ref-window-controls', win);
      for (const mark of ['−', '□', '×']) util.el('span', 'ref-window-control', winControls, mark);
      const menu = util.el('nav', 'ref-menubar', header);
      for (const item of ['Sales', 'Home', 'Accounts', 'Contacts', 'Opportunities', 'Reports', 'Dashboards', 'Documents', 'More']) {
        util.el('span', 'ref-menu-item', menu, item);
      }
      const launcher = util.el('button', 'ref-launcher', menu);
      launcher.type = 'button';
      launcher.setAttribute('aria-label', 'App launcher');
      for (let i = 0; i < 9; i++) util.el('i', '', launcher);
      launcher.addEventListener('click', () => env.log('decoy', { what: 'app-launcher' }));
      const controls = util.el('div', 'ref-global-controls', menu);
      util.el('div', 'ref-global-search', controls, '⌕　Search...');
      for (const [mark, label] of [['?', 'Help'], ['♟', 'Notifications']]) {
        const b = util.el('button', 'ref-global-icon', controls, mark);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        b.addEventListener('click', () => env.log('decoy', { what: label.toLowerCase() }));
      }
      const profile = util.el('button', 'ref-profile', controls, 'JD');
      profile.type = 'button';
      profile.title = 'Profile';
      profile.setAttribute('aria-label', 'Profile');
      profile.addEventListener('click', () => env.log('decoy', { what: 'profile' }));
      const appbar = util.el('div', 'ref-appbar', header);
      const appTools = [
        ['▧', 'New Slide'], ['▣', 'Duplicate'], ['▤', 'Delete'], ['T', 'Text Box'],
        ['▧', 'Picture'], ['◇', 'Shape'], ['↶', 'Undo'], ['↷', 'Redo'],
      ];
      for (const [icon, text] of appTools) {
        const tool = util.el('div', 'ref-app-tool', appbar);
        util.el('span', 'ref-app-icon', tool, icon);
        util.el('span', '', tool, text);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appTools, appbar, controls, header, launcher, menu, profile, win, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const records = util.el('aside', 'ref-records', body);
      util.el('div', 'ref-record-title', records, 'Documents');
      util.el('button', 'ref-record-new', records, 'New　⌄');
      util.el('div', 'ref-record-filter', records, 'All Presentations　⌄');
      util.el('div', 'ref-record-search', records, '⌕　 Search presentations...');
      util.el('div', 'ref-record-head', records, 'Name　　　　　　　　 Last Modified　⌄');
      for (const [i, title] of ['Q3 Business Review', 'Sales Strategy', 'Product Roadmap', 'Customer Feedback', 'Market Analysis', 'Competitive Landscape', 'Go-to-Market Plan', 'Financial Overview', 'Executive Summary', 'Team Update'].entries()) {
        const row = util.el('div', `ref-record-row${i === 0 ? ' selected' : ''}`, records);
        util.el('span', 'ref-ppt-mark', row, 'P');
        util.el('span', 'ref-record-name', row, title);
        util.el('span', 'ref-record-date', row, ['Mar 3, 2016','Feb 26, 2016','Feb 18, 2016','Feb 12, 2016','Feb 3, 2016','Jan 28, 2016','Jan 20, 2016','Jan 15, 2016','Jan 8, 2016','Dec 18, 2015'][i]);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, records });
    },
  };

  env.site({
    name: 'design-use-slides-align-02',
    template: 'site/base',
    design: { parts },
  });
})();
