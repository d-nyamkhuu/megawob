// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appTitle = util.el('div', 'ref-brand', header);
        util.el('span', 'ref-app-mark', appTitle).innerHTML =
          '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#173a47"/><path d="M22.8 6.5c-7.8.2-13.2 3.8-13.2 10.2 0 3.1 1.8 5.1 4.7 5.1 4.9 0 8.4-6.1 8.5-15.3ZM9.4 25.5c2.2-6.3 5.7-10.6 11.8-13.4" fill="#65c6a3" stroke="#65c6a3" stroke-width="1.3" stroke-linecap="round"/></svg>';
        util.el('span', '', appTitle, 'EverNote Pro');
        appTitle.dataset.role = 'brand';
        const win = util.el('div', 'ref-window-controls', header);
        for (const [label, glyph] of [
          ['Minimize', '−'],
          ['Maximize', '□'],
          ['Close', '×'],
        ]) {
          const b = util.el('span', 'ref-window-control', win, glyph);
          b.setAttribute('aria-label', label);
        }
        const menu = util.el('nav', 'ref-menu', document.body);
        for (const item of ['File', 'Edit', 'View', 'Note', 'Format', 'Tools', 'Help'])
          util.el('span', 'ref-menu-item', menu, item);
        const actionbar = util.el('div', 'ref-actionbar', document.body);
        for (const [ico, label] of [
          ['plus', 'New Note'],
          ['folder', 'Open'],
          ['undo', 'Undo'],
          ['redo', 'Redo'],
        ]) {
          const item = util.el('div', 'ref-action-item', actionbar);
          const icon = util.el('span', 'ref-action-icon', item);
          const paths = {
            plus: '<path d="M12 5v14M5 12h14"/><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>',
            folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
            undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h9a7 7 0 1 1 0 14h-2"/>',
            redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9h-9a7 7 0 1 0 0 14h2"/>',
          };
          icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[ico]}</svg>`;
          util.el('span', '', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { actionbar, appTitle, header, menu, win });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'ref-rail', body);
        for (const [ico, label] of [
          ['home', 'Home'],
          ['note', 'Notes'],
          ['check', 'Tasks'],
          ['tag', 'Tags'],
          ['trash', 'Trash'],
          ['gear', 'Settings'],
        ]) {
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
        util.el('h1', '', info, 'Preferences');
        util.el(
          'p',
          'ref-info-intro',
          info,
          'Customize how EverNote Pro works for you. Changes are saved only when you click Save.',
        );
        const tips = util.el('section', 'ref-tips', info);
        const tipsTitle = util.el('h2', '', tips);
        tipsTitle.innerHTML =
          '<svg class="ref-inline-icon ref-bulb" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6m-5 3h4m-5-6c0-1.4-3-3-3-7a6 6 0 0 1 12 0c0 4-3 5.6-3 7"/><path d="M9 14h6"/></svg><span>Tips</span>';
        const list = util.el('ul', '', tips);
        for (const text of [
          'Use the settings search to quickly find an option.',
          'Some settings show additional options when turned on.',
          'Your changes apply across all your devices after saving.',
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
    name: 'design-change-settings-search-01',
    template: 'site/base',
    design: { parts },
  });
})();
