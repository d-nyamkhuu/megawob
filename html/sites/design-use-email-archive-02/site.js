// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-archive-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'File   Edit   Message   Window',
        'nav': '',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#080808',
        'line': '#111',
        'title': 'repeating-linear-gradient(0deg,#fff 0 1px,#555 1px 2px)',
        'control': '#fff',
        'accent': '#fff',
        'accentfg': '#000',
        'sel': '#050505',
        'selfg': '#fff',
        'font': '"DejaVu Sans Mono",monospace',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-archive-02',
        'scenario': 'archive',
        'platform': 'desktop',
        'account': 'Mon Apr 14  10:24 AM',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 40,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const globalSearch = E('div', 'global-mail-search', bar);
            E('span', 'search-glass', globalSearch, '⌕');
            const globalInput = E('input', '', globalSearch);
            globalInput.type = 'search';
            globalInput.placeholder = 'Search mail';
            globalInput.setAttribute('aria-label', 'Search mail');
            const utilities = E('div', 'desktop-utilities', bar);
            for (const [glyph, label] of [
              ['?', 'Help'],
              ['⚙', 'Settings'],
            ]) {
              const b = E('button', 'utility-button', utilities, glyph);
              b.type = 'button';
              b.title = label;
              b.setAttribute('aria-label', label);
              b.addEventListener('click', () => env.log('decoy', { label }));
            }
            E('span', 'profile-chip', utilities, 'JS');
            E('span', 'window-divider', utilities, '');
            for (const [glyph, label] of [
              ['−', 'Minimize'],
              ['□', 'Maximize'],
              ['×', 'Close'],
            ]) {
              const b = E('button', 'window-button', utilities, glyph);
              b.type = 'button';
              b.title = label;
              b.setAttribute('aria-label', label);
              b.addEventListener('click', () => env.log('decoy', { label }));
            }
            E('span', 'account', bar, C.account);
            Object.assign(_c, { globalInput, globalSearch, utilities });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
