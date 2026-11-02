// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'SunnyMail',
        'nav': 'Home  Search  Mail  News  People  Yellow Pages  Maps  Shopping',
        'bg': '#f1ece4',
        'surface': '#f9f8f4',
        'fg': '#111',
        'line': '#d1cec8',
        'title': '#f6d9d4',
        'control': '#f8f6f2',
        'accent': '#d3091a',
        'sel': '#fbe4df',
        'bar': 63,
        'foot': 90,
        'note': 'left:14.5%;top:1%;width:73%;border:0;background:transparent;font-size:24px;padding:8px',
        'end': 'right:0;bottom:0;width:23%;height:90px',
        'geo': {
          'folders': 'left:0;top:1%;width:12%;height:98%',
          'ledger': 'left:12%;top:1%;width:22%;height:98%',
          'document': 'left:34%;top:1%;width:33%;height:98%',
          'editor': 'left:67%;top:1%;width:33%;height:98%',
          'contacts': 'left:34%;bottom:-80px;width:42%;height:70px;z-index:7',
        },
        'site': 'design-use-email-forward-08',
        'scenario': 'forward',
        'platform': 'web',
        'account': 'Wed, Apr 15, 1998',
        'noteTitle': null,
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 100,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const br = E('span', 'brand', bar);
            E('span', 'b1', br, 'Sunny');
            E('span', 'b2', br, 'Mail');
            Object.assign(_c, { br });
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const ws = E('div', 'websearch', bar);
            E('div', 'wlabel', ws, 'Search the Web');
            const wi = E('input', '', ws);
            wi.type = 'text';
            wi.setAttribute('aria-label', 'Search the Web');
            const wb = E('button', '', ws, 'Go');
            wb.type = 'button';
            Object.assign(_c, { wb, wi, ws });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const mode =
                ctx.display === 'panel' && innerWidth < 1260
                  ? 'header'
                  : ctx.display === 'toast' && innerHeight < 700
                    ? 'header'
                    : ctx.display;
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = mode;
              if (mode === 'panel') E('div', 'note-title', note, 'Task Instructions');
              if (C.noteTitle && mode === 'header') E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            base(_c);
            if (_c.submit) {
              const place = _c.ctx.rng.fork('chrome/site/placement').pick(['home', 'home', 'center', 'menubar']);
              _c.submit.classList.remove('end-home', 'end-center', 'end-menubar');
              _c.submit.classList.add('end-' + place);
            }
            const extra = _c.bar.querySelector(".pq-xtra");
            if (extra) {
              extra.classList.remove("chrome-nav");
              extra.classList.add("chrome-xtra");
              _c.footer.appendChild(extra);
            }
          },
      },
    },
  });
})();
