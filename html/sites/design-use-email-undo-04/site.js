// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-undo-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'library',
        'brand': 'Riverton Public Library\nKnowledge for a Brighter Tomorrow',
        'nav': 'Mail    Catalog    Research    Events    Services    About',
        'bg': '#f7f3e9',
        'surface': '#fffdf8',
        'fg': '#28201e',
        'line': '#aaa39a',
        'title': '#68151f',
        'control': '#f2ede3',
        'accent': '#67131d',
        'accentfg': '#fffdf8',
        'sel': '#dfc9c5',
        'selfg': '#401018',
        'font': 'Georgia,serif',
        'note': 'right:1.5%;top:14%;width:22%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:0;top:0;width:24%;height:100%',
          'ledger': 'left:24%;top:0;width:76%;height:100%',
          'document': 'right:0;top:0;width:100%;height:100%',
          'editor': 'right:0;top:0;width:100%;height:100%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-undo-04',
        'scenario': 'undo',
        'platform': 'desktop',
        'account': '',
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
        'rowHeight': 48,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const mark = E('span', 'library-mark', bar);
            mark.innerHTML =
              '<svg viewBox="0 0 150 88" aria-hidden="true"><g fill="#f8f4e9" stroke="#542d29" stroke-width="2.4" stroke-linejoin="round"><path d="M8 18 28 13v64L8 82zM29 12l23-3v67l-23 2zM54 10l23 1v67l-23-1zM80 13l20 4v62l-20-2zM102 18l17 7 16 48-17 6-16-48z"/><path d="M11 27l15-3M11 34l15-3M11 41l15-3M11 48l15-3M11 55l15-3M11 62l15-3M33 21l15-2M33 29l15-2M33 37l15-2M33 45l15-2M33 53l15-2M33 61l15-2M58 20l15 1M58 28l15 1M58 36l15 1M58 44l15 1M58 52l15 1M58 60l15 1M84 24l13 3M84 32l13 3M84 40l13 3M84 48l13 3M84 56l13 3M107 31l10-4M110 39l10-4M113 47l10-4M116 55l10-4M119 63l10-4"/><path d="M4 83q56-5 132-1" fill="none"/></g></svg>';
            E('span', 'brand', bar, C.brand);
            Object.assign(_c, { mark });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E } = _c;
            const help = E('aside', 'library-help', document.body);
            E('h2', '', help, 'Mail Help');
            const topics = [
              ['Find Messages', 'Use the search box to find messages by sender, subject, or keywords.'],
              [
                'Folders',
                'Your mail is organized into folders like Inbox, Sent, Archive, and Trash. Click a folder to view its messages.',
              ],
              [
                'Read and Manage',
                'Select a message to read it. Use the checkboxes to select messages and move, delete, or archive them.',
              ],
              ['Compose', 'Click the Compose button to write a new message, or reply to an existing message.'],
            ];
            for (const [title, copy] of topics) {
              const sec = E('section', 'help-topic', help);
              E('h3', '', sec, title);
              E('p', '', sec, copy);
            }
            const books = E('div', 'help-books', help);
            books.innerHTML =
              '<svg viewBox="0 0 330 180" role="img" aria-label="A stack of library books"><g fill="#f7f0e5" stroke="#60322d" stroke-width="2.5" stroke-linejoin="round"><path d="M18 120 63 91l239 18-43 35-236-19z"/><path d="m18 120 236 19v17L21 138zM254 139l48-30v16l-48 31z"/><path d="M36 83 76 52l224 22-42 33L36 91z"/><path d="m36 83 222 24v16L37 99zM258 107l42-33v15l-42 34z"/><path d="M52 47 86 18l219 23-39 31L52 55z"/><path d="m52 47 214 25v16L54 63zM266 72l39-31v16l-39 31z"/><path d="M30 143l222 18M49 103l207 20M67 63l199 24" fill="none"/></g><g fill="#542d29" font-family="Georgia,serif" font-size="17" text-anchor="middle"><text x="166" y="56">Literature</text><text x="163" y="96">History</text><text x="151" y="136">Science</text></g></svg>';
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { books, footer, help, topics });
          },
      },
    },
  });
})();
