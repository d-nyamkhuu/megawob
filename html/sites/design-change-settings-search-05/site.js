// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appTitle = util.el('div', 'ref-brand', header);
        util.el('b', 'ref-mast', appTitle, 'The Daily Chronicle');
        util.el('i', 'ref-tag', appTitle, 'Independent News for a Brighter Tomorrow');
        appTitle.dataset.role = 'brand';
        const win = util.el('div', 'ref-dateline', header);
        util.el('span', '', win, 'Monday, April 18, 2011');
        const ul = util.el('div', 'ref-util', win);
        for (const t of ['My Account', 'Help', 'Sign Out']) util.el('span', '', ul, t);
        const menu = util.el('nav', 'ref-menu', document.body);
        for (const item of ['Home', 'U.S.', 'World', 'Business', 'Politics', 'Technology', 'Life', 'Opinion', 'Photos', 'Video', 'My Account'])
          util.el('span', `ref-menu-item${item === 'My Account' ? ' on' : ''}`, menu, item);
        const actionbar = util.el('div', 'ref-actionbar', document.body);
        util.el('h2', '', actionbar, 'My Account');
        util.el('p', '', actionbar, 'Manage your profile, preferences and more.');
        S.frameBrand(_c, header);
        Object.assign(_c, { actionbar, appTitle, header, menu, win });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'ref-rail', body);
        for (const [ico, label] of []) {
          const item = util.el('div', `ref-rail-item${label === 'Settings' ? ' selected' : ''}`, rail);
          const icon = util.el('span', 'ref-rail-icon', item);
          const paths = {
            home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
            note: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
            check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 6-7"/>',
            tag: '<path d="M3 12V4h8l10 10-7 7L3 12Z"/><circle cx="8" cy="8" r="1"/>',
            trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
            gear: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m19 13 2-1-2-1-.4-2 1-2-2-2-2 1-2-.4-1-2-2 2-2 .4-2-1-2 2 1 2-.4 2-2 1 2 1 .4 2-1 2 2 2 2-1 2 .4 1 2 2-2 2-.4 2 1 2-2-1-2Z"/>',
          };
          icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[ico]}</svg>`;
          util.el('span', '', item, label);
        }
        const info = util.el('aside', 'ref-info', body);
        util.el('h1', '', info, 'About these settings');
        util.el(
          'p',
          'ref-info-intro',
          info,
          'Manage how The Daily Chronicle looks and behaves for you. Use the settings search to quickly find a preference, or browse the sections below.',
        );
        const tips = util.el('section', 'ref-tips', info);
        const tipsTitle = util.el('h2', '', tips);
        tipsTitle.innerHTML =
          '<svg class="ref-inline-icon ref-bulb" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6m-5 3h4m-5-6c0-1.4-3-3-3-7a6 6 0 0 1 12 0c0 4-3 5.6-3 7"/><path d="M9 14h6"/></svg><span>Tips</span>';
        const list = util.el('ul', '', tips);
        for (const text of [
          'Turn on dark mode to reduce screen brightness in low-light settings.',
          'Some options reveal additional settings when enabled.',
          'Your changes are saved only when you click Save.',
        ])
          util.el('li', '', list, text);
        const help = util.el('section', 'ref-help', info);
        const helpTitle = util.el('h2', '', help);
        helpTitle.innerHTML =
          '<svg class="ref-inline-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v17H5.5A2.5 2.5 0 0 0 3 22.5zM21 5.5A2.5 2.5 0 0 0 18.5 3H13v17h5.5a2.5 2.5 0 0 1 2.5 2.5z"/></svg><span>Need help?</span>';
        for (const text of [
          'Preferences overview',
          'Manage your data',
          'Notification settings',
          'Billing and subscriptions',
          'Privacy and security',
        ]) {
          const a = util.el('a', '', help, text);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'help', label: text });
          });
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, help, helpTitle, info, list, rail, tips, tipsTitle });
      },
  };

  env.site({
    name: 'design-change-settings-search-05',
    template: 'site/base',
    design: { parts },
  });
})();
