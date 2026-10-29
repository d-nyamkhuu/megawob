// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-search-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gtk-clearlooks',
        'brand': 'Web Mail',
        'nav': 'File   Edit   View   Go   Message   Tools   Help',
        'bg': '#e9e7e1',
        'surface': '#f7f6f2',
        'fg': '#171a20',
        'line': '#a9aaa8',
        'title': 'linear-gradient(#6c9bd0,#3674b5)',
        'control': '#efeee9',
        'accent': '#4e88c4',
        'accentfg': '#fff',
        'sel': '#4b86c2',
        'selfg': '#fff',
        'font': 'Arial,sans-serif',
        'site': 'design-use-email-search-03',
        'scenario': 'search',
        'platform': 'desktop',
        'account': '',
        'noteTitle': '',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 34,
        'stack': true,
        'dock': [],
      },
      parts: {
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const controls = E('div', 'window-controls', bar);
            for (const s of ['−', '□', '×']) E('span', 'window-control', controls, s);
            const menu = E('nav', 'menu-bar', document.body);
            for (const label of C.nav.split(/\s{2,}/)) {
              const a = E('span', 'menu-item', menu, label);
            }
            const rail = E('aside', 'folder-rail', document.body);
            for (const [icon, label] of [
              ['✎', 'Compose'],
              ['▣', 'Inbox (18)'],
              ['☆', 'Starred'],
              ['➤', 'Sent Mail'],
              ['▤', 'Drafts'],
              ['▱', 'All Mail'],
              ['⊘', 'Spam'],
              ['▤', 'Trash'],
            ]) {
              const r = E('div', 'rail-item' + (label.startsWith('Inbox') ? ' active' : ''), rail);
              E('span', 'rail-icon', r, icon);
              E('span', '', r, label);
            }
            Object.assign(_c, { controls, menu, rail });
          },
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E } = _c;
            const searchButton = E('button', 'search-button', document.body, 'Search Mail');
            searchButton.type = 'button';
            searchButton.addEventListener('click', () => {
              const input = document.querySelector('.am-search input');
              if (input) input.focus();
            });
            const tools = E('div', 'mail-toolbar', document.body);
            for (const [icon, label, disabled] of [
              ['✎', 'Compose', false],
              ['↶', 'Reply', true],
              ['⇇', 'Reply All', true],
              ['➦', 'Forward', true],
              ['▤', 'Delete', true],
              ['⊘', 'Spam', true],
              ['▾', 'More', false],
            ]) {
              const b = E('button', 'mail-tool', tools);
              b.type = 'button';
              E('span', 'tool-icon', b, icon);
              E('span', '', b, label);
              if (disabled) b.disabled = true;
              if (label === 'Compose')
                b.addEventListener('click', () => {
                  const actual = document.querySelector('.am-new');
                  if (actual) actual.click();
                });
            }
            const cols = E('div', 'mail-columns', document.body);
            E('span', 'column-check', cols, '□');
            E('span', '', cols, 'From');
            E('span', '', cols, 'Subject');
            E('span', 'column-date', cols, 'Date   ▾');
            const help = E('aside', 'help-panel', document.body);
            E('h2', '', help, 'Search Mail');
            E(
              'p',
              '',
              help,
              'Use the search box to find messages in your mailbox. You can search by sender, subject, or keywords.',
            );
            E('h3', '', help, 'Tips:');
            const ul = E('ul', '', help);
            for (const t of [
              'Type a person’s name to find messages from that person.',
              'Use keywords from the subject or message body.',
              'You can also search for older messages in All Mail.',
            ])
              E('li', '', ul, t);
            const footer = E('footer', 'desktop-footer', document.body);
            footer.hidden = true;
            Object.assign(_c, { cols, footer, help, searchButton, tools, ul });
          },
        'frame.13': () => () => {},
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
