// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appTitle = util.el('div', 'ref-brand', header, 'Notes');
      appTitle.dataset.role = 'brand';
      const win = util.el('div', 'ref-window-controls', header);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const b = util.el('span', 'ref-window-control', win, glyph);
        b.setAttribute('aria-label', label);
      }
      const menu = util.el('nav', 'ref-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Note', 'Format', 'Tools', 'Help']) util.el('span', 'ref-menu-item', menu, item);
      const actionbar = util.el('div', 'ref-actionbar', document.body);
      for (const [ico, label] of [['✚', 'New Note'], ['▱', 'Open'], ['↶', 'Undo'], ['↻', 'Redo']]) {
        const item = util.el('div', 'ref-action-item', actionbar);
        util.el('span', 'ref-action-icon', item, ico);
        util.el('span', '', item, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { actionbar, appTitle, header, menu, win });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'ref-rail', body);
      const railItems = [['▤', 'All Notes'], ['☆', 'Favorites'], ['♧', 'Shared'], ['▤', 'Recently Deleted'], ['▱', 'Personal'], ['▱', 'Work'], ['▱', 'Travel'], ['▱', 'Ideas'], ['▤', 'Archives']];
      for (const [index, [ico, label]] of railItems.entries()) {
        if (index === 4) util.el('div', 'ref-folders-title', rail, 'Folders　⌄');
        const item = util.el('div', `ref-rail-item${label === 'Travel' ? ' selected' : ''}`, rail);
        util.el('span', 'ref-rail-icon', item, ico);
        util.el('span', '', item, label);
      }
      const info = util.el('aside', 'ref-info', body);
      util.el('h1', '', info, 'Preferences');
      util.el('p', 'ref-info-intro', info, 'Customize how EverNote Pro works for you. Changes are saved only when you click Save.');
      const notes = util.el('div', 'ref-note-list', info);
      const rows = [
        ['Weekend Hike Plan', 'Today, 9:41 AM', 'landscape'],
        ['Packing List', 'Today, 8:12 AM', ''],
        ['Lake House', 'Yesterday', ''],
        ['Summer Plans', 'Yesterday', ''],
        ['Budget', 'Yesterday', ''],
        ['National Park', 'Mar 14, 2025', ''],
        ['Photo Ideas', 'Mar 12, 2025', ''],
      ];
      for (const [title, when, art] of rows) {
        const row = util.el('div', `ref-note-row${art ? ' has-art selected' : ''}`, notes);
        if (art) util.el('div', 'ref-note-art', row);
        util.el('strong', '', row, title);
        util.el('span', '', row, when);
      }
      const tips = util.el('section', 'ref-tips', info);
      util.el('h2', '', tips, '💡  Tips');
      const list = util.el('ul', '', tips);
      for (const text of ['Use the settings search to quickly find an option.', 'Some settings show additional options when turned on.', 'Your changes apply across all your devices after saving.']) util.el('li', '', list, text);
      const help = util.el('section', 'ref-help', info);
      util.el('h2', '', help, '♧  Need help?');
      for (const text of ['Preferences overview', 'Manage your data', 'Notification settings', 'Billing and subscriptions', 'Privacy and security']) {
        const a = util.el('a', '', help, text); a.href = '#'; a.addEventListener('click', e => { e.preventDefault(); env.log('decoy', { what: 'help', label: text }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, help, info, list, notes, rail, railItems, rows, tips });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('div', 'ref-inspector-art', inspector);
      util.el('h2', '', inspector, 'Weekend Hike Plan');
      util.el('p', 'ref-inspector-date', inspector, 'Today, 9:41 AM');
      util.el('div', 'ref-inspector-section', inspector, 'Properties');
      for (const [key, value] of [['Kind', 'Note'], ['Size', '4.2 MB'], ['Created', 'Apr 18, 2025, 9:12 AM'], ['Modified', 'Apr 18, 2025, 9:41 AM']]) {
        const row = util.el('div', 'ref-inspector-row', inspector);
        util.el('span', '', row, key); util.el('span', '', row, value);
      }
      util.el('div', 'ref-inspector-section', inspector, 'Tags');
      util.el('div', 'ref-inspector-tags', inspector, 'Hiking　 Travel　＋');
      util.el('div', 'ref-inspector-section', inspector, 'Related Notes');
      for (const label of ['Packing List', 'Trail Map', 'Outdoor Gear']) util.el('div', 'ref-related', inspector, `▤　${label}`);
      const dock = util.el('nav', 'ref-bottom-dock', body);
      for (const [icon, label] of [['▣', 'Notes'], ['✓', 'Tasks'], ['▦', 'Calendar'], ['▧', 'Gallery'], ['⌕', 'Search']]) {
        const item = util.el('div', `ref-dock-item${label === 'Notes' ? ' selected' : ''}`, dock);
        util.el('span', 'ref-dock-icon', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { dock, inspector, stage });
    },
  };

  env.site({
    name: 'design-change-settings-search-02',
    template: 'site/base',
    design: { parts },
  });
})();
