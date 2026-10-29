// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-archive-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        style: 'mail2014',
        brand: 'Mail',
        nav: 'Inbox   Starred   Sent   Drafts   Archive',
        bg: '#eef1f4',
        surface: '#fff',
        fg: '#202124',
        line: '#e0e3e7',
        title: '#3367d6',
        control: '#f5f6f7',
        accent: '#d93025',
        accentfg: '#fff',
        sel: '#e7f0fd',
        selfg: '#1967d2',
        font: 'Arial,sans-serif',
        note: 'left:20%;top:17%;width:60%',
        end: 'right:3%;top:18px',
        site: 'design-use-email-archive-01',
        scenario: 'archive',
        platform: 'desktop',
        account: 'Search mail',
        noteTitle: '',
        folderLabels: {
          sent: 'Sent',
          drafts: 'Drafts',
          junk: 'Junk',
          spam: 'Spam',
          templates: 'Templates',
          compose: 'Compose',
        },
        folderList: ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        rowHeight: 62,
        stack: true,
        dock: [],
      },
      parts: {
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const search = E('div', 'mail-search', bar);
            E('span', 'search-glass', search, '⌕');
            E('span', 'search-label', search, 'Search mail');
            const input = E('input', '', search);
            input.setAttribute('aria-label', 'Search mail');
            input.placeholder = 'Search mail';
            input.disabled = true;
            E('span', 'apps-icon', bar, '▦');
            E('span', 'avatar', bar, 'J');
            const tabs = E('nav', 'mail-tabs', document.body);
            for (const label of C.nav.split(/\s{2,}/)) {
              const a = E('button', 'chrome-nav' + (label === 'Inbox' ? ' active' : ''), tabs, label);
              a.type = 'button';
              a.addEventListener('click', () => env.log('decoy', { label }));
            }
            Object.assign(_c, { input, search, tabs });
          },
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { footer } = _c;
            footer.hidden = true;
          },
        'frame.14': () => () => {},
        'frame.17': (base, S) =>
          function (_c) {
            const { E, ctx, display } = _c;
            if (display !== 'hidden') {
              _c.note = E('aside', 'task-note', document.body);
              _c.note.dataset.display = display;
              E('div', 'instruction', _c.note, ctx.instruction);
            }
          },
      },
    },
  });
})();
