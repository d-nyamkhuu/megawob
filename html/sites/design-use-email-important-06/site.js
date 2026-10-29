// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-important-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gtk',
        'brand': 'Riverton Mail',
        'nav': 'Mail   Contacts   Calendar   Notepad',
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
        'site': 'design-use-email-important-06',
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
        'frame.6': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            {
              const ac = E('span', 'account', bar);
              E('span', '', ac, 'Laura Bennett');
              E('i', '', ac, ' | ');
              for (const t of ['Settings', 'Help', 'Sign out']) {
                if (t !== 'Settings') E('i', '', ac, ' | ');
                const a = E('a', '', ac, t);
                a.href = '#';
                a.addEventListener('click', (ev) => {
                  ev.preventDefault();
                  env.log('decoy', { label: t });
                });
              }
            }
            {
              const s = E('div', 'search-deco', document.body);
              const inp = E('input', '', s);
              inp.placeholder = 'Search mail...';
              E('button', '', s, 'Search').type = 'button';
              const op = E('button', 'strip-deco', document.body, 'Open');
              op.type = 'button';
              op.style.left = '2.3vw';
              op.style.width = '6.6vw';
              op.addEventListener('click', () => env.log('decoy', { label: 'Open' }));
              const mu = E('button', 'strip-deco', document.body, 'Mark unread');
              mu.type = 'button';
              mu.style.left = '22.7vw';
              mu.style.width = '10vw';
              mu.addEventListener('click', () => env.log('decoy', { label: 'Mark unread' }));
              const pg = E('div', 'pager', document.body);
              E('b', '', pg, '‹');
              E('span', '', pg, 'Page 1 of 1');
              E('b', '', pg, '›');
            }
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            _c.display = ctx.display;
            if ((_c.display === 'panel' || _c.display === 'toast') && document.documentElement.clientWidth < 1180)
              _c.display = 'header';
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end'),
              endLabels = ctx.content.END_LABELS;
            ((_c.placement = 'footer'), (_c.label = 'Submit'));
            if (!ctx.finish) {
              if (endRng.bool(0.5)) {
                _c.placement = 'footer';
                _c.label = 'Submit';
              } else {
                _c.placement = endRng.pick(['header', 'link']);
                const picked = endRng.pick(endLabels);
                _c.label = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name;
              }
            }
            Object.assign(_c, { endLabels, endRng });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabels } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control end-' + _c.placement, document.body, _c.label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              if (_c.placement === 'link') {
                _c.submit.setAttribute('aria-label', _c.label);
                _c.submit.title = _c.label;
              }
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && collideRng.bool(0.3)) {
              const same = (x) =>
                  String(x.label || x.text || x)
                    .trim()
                    .toLowerCase() === String(_c.label).trim().toLowerCase(),
                pool = endLabels.filter((x) => !same(x));
              if (pool.length) {
                const item = collideRng.pick(pool),
                  text = String(item.label || item.text || item),
                  b = E('button', 'end-xtra', document.body, text);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
