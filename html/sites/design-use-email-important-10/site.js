// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-important-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gtk',
        'brand': 'Inbox - Mozilla Thunderbird',
        'nav': 'File   Edit   View   Go   Message   Tools   Help',
        'bg': '#eeede7',
        'surface': '#eeece4',
        'fg': '#111',
        'line': '#aaa99e',
        'title': 'linear-gradient(#4f83b4,#32689e)',
        'titlefg': '#fff',
        'control': 'linear-gradient(#f5f4ec,#dedcd0)',
        'accent': '#bacada',
        'accentfg': '#000',
        'sel': '#dce6ee',
        'bar': 35,
        'note': 'left:.5%;top:1%;width:20%;height:98%;font-weight:400',
        'end': 'left:2%;bottom:4%;width:17%',
        'geo': {
          'folders': 'left:21.3%;top:16%;width:14%;height:83%',
          'ledger': 'left:35.8%;top:16%;width:63.7%;height:40%',
          'document': 'left:35.8%;top:57%;width:63.7%;height:42%',
          'editor': 'left:64%;top:58%;width:35.5%;height:41%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-important-10',
        'scenario': 'important',
        'platform': 'desktop',
        'account': 'Mon Apr 14  10:24 AM',
        'noteTitle': null,
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'templates', 'junk', 'trash'],
        'rowHeight': 36,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { E } = _c;
            const paper = E('div', 'paper-tiles', document.body);
            paper.setAttribute('aria-hidden', 'true');
            for (let i = 0; i < 180; i++) E('i', '', paper);
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bar, paper });
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { E } = _c;
            const mast = E('header', 'mast', document.body);
            E('div', 'mast-corner', document.body);
            const ml = E('div', 'mast-left', mast);
            ml.innerHTML = 'Home<br>Sweet<br>Home';
            E('div', 'mast-house', mast);
            const mc = E('div', 'mast-center', mast);
            E('h1', '', mc, 'Sunnydale Online');
            E('p', '', mc, 'A Friendly Place on the Internet');
            E('div', 'mast-flowers', mast);
            const lk = E('div', 'mast-links', mast);
            for (const t of ['Good People', 'Good Ideas', 'Brighter Days']) {
              const a = E('a', '', lk, t);
              a.href = '#';
              a.addEventListener('click', (ev) => {
                ev.preventDefault();
                env.log('decoy', { label: t });
              });
            }
            const side = E('nav', 'side-index', document.body);
            [
              'Mail',
              'News',
              'Friends',
              'Photos',
              'Calendar',
              'Links',
              'Guestbook',
              'Settings',
              'Help',
              'Sign Out',
            ].forEach((t, i) => {
              const r = E('div', 'side-row', side);
              E('span', 'n', r, String(i + 1));
              const a = E('a', '', r, t);
              a.href = '#';
              a.addEventListener('click', (ev) => {
                ev.preventDefault();
                env.log('decoy', { label: t });
              });
            });
            const bot = E('footer', 'mast-foot', document.body);
            E('div', 'foot-globe', bot);
            E('div', 'foot-l', bot).innerHTML = 'Small Town<br>Big Connections';
            E('div', 'foot-r', bot).innerHTML = 'Friends Make<br>a Brighter Internet';
            E('div', 'foot-sun', bot);
            Object.assign(_c, { bot, lk, mast, mc, ml, side });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, stage } = _c;
            _c.display = ctx.display;
            if (
              (_c.display === 'panel' && stage.clientWidth < 1260) ||
              (_c.display === 'toast' && stage.clientHeight < 700)
            )
              _c.display = 'header';
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (_c.display === 'panel' || _c.display === 'toast')
                E('div', 'episode-note-title', note, _c.display === 'panel' ? 'Mail task' : 'A note from Mail');
              else if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            base(_c);
            if (_c.submit && !_c.submit.classList.contains('end-home')) {
              const placement = _c.ctx.rng.fork('chrome/site').pick(['center', 'menubar']);
              _c.submit.classList.remove('end-center', 'end-menubar');
              _c.submit.classList.add('end-' + placement);
            }
            for (const button of _c.bar.querySelectorAll('[data-role="xtra"]')) {
              button.className = 'episode-xtra';
              document.body.appendChild(button);
            }
          },
        'frame.21': (base, S) =>
          function (_c) {
            for (const n of document.querySelectorAll('.task-note')) {
              let f = parseFloat(getComputedStyle(n).fontSize);
              while (n.scrollHeight > n.clientHeight + 1 && f > 12) {
                f -= 0.5;
                n.style.setProperty('font-size', f + 'px', 'important');
              }
            }
          },
      },
    },
  });
})();
