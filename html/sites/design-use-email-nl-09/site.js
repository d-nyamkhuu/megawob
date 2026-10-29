// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'irix',
        'brand': 'Mail',
        'nav': '',
        'bg': 'linear-gradient(#777f9a,#414e68)',
        'surface': '#bdbec7',
        'fg': '#08090b',
        'line': '#575b69',
        'title': 'linear-gradient(#b7b2d5,#9791ba)',
        'control': 'linear-gradient(#dddde4,#a3a5b2)',
        'accent': '#aba3cc',
        'accentfg': '#111',
        'sel': '#aca5cf',
        'font': '"Arial Narrow",Arial,sans-serif',
        'bar': 25,
        'note': 'right:1%;top:5%;width:15%;background:#fff0bd;font-size:16px',
        'end': 'right:1%;bottom:3%;width:8%;padding:10px',
        'geo': {
          'folders': 'left:1%;top:2%;width:6%;height:60%',
          'ledger': 'left:7.5%;top:2%;width:41.5%;height:67%',
          'document': 'left:50%;top:2%;width:33%;height:45%',
          'editor': 'left:48%;top:49%;width:42%;height:48%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-nl-09',
        'scenario': 'nl',
        'platform': 'desktop',
        'account': '',
        'noteTitle': null,
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'archive', 'trash'],
        'rowHeight': 36,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            const roomy = window.innerWidth >= 1260,
              tall = window.innerHeight >= 700;
            _c.display = ctx.display || 'header';
            if ((_c.display === 'panel' && !roomy) || (_c.display === 'toast' && !tall)) _c.display = 'header';
            document.body.dataset.instr = _c.display;
            const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
            const bank =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
            const er = ctx.rng.fork('chrome/end'),
              choices = ['header', 'header', 'header', 'link', 'link', 'icon'],
              place = er.pick(choices),
              standard = bank.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || bank[0],
              endText = labelOf(place === 'header' ? standard : er.pick(bank));
            const cr = ctx.rng.fork('chrome/collide');
            _c.collision = null;
            if (cr.bool(0.3)) {
              const options = [...new Set(bank.map(labelOf))].filter(
                (x) => x.trim().toLowerCase() !== endText.trim().toLowerCase(),
              );
              if (options.length) _c.collision = cr.pick(options);
            }
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bank, bar, choices, cr, endText, er, labelOf, place, roomy, standard, tall });
          },
        'frame.6': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const acc = E('span', 'account', bar);
            acc.innerHTML =
              '<svg viewBox="0 0 120 24" aria-hidden="true"><path d="M6 12h12"/><rect x="48" y="5" width="14" height="14" rx="2"/><path d="m92 5 14 14M106 5 92 19"/></svg>';
            E('div', 'banner-bg', document.body);
            const bic = E('div', 'banner-icon', document.body);
            bic.innerHTML =
              '<svg viewBox="0 0 48 40" aria-hidden="true"><rect x="3" y="5" width="42" height="31" rx="4" fill="white" stroke="none"/><path d="m5 8 19 14L43 8" fill="none" stroke="#8583ca" stroke-width="4"/></svg>';
            const sub = E(
              'div',
              'banner-sub',
              document.body,
              'Use the email list below to find the message, then follow the instruction above.',
            );
            sub.hidden = _c.display !== 'header';
            Object.assign(_c, { acc, bic, sub });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endText, place } = _c;
            if (!ctx.finish) {
              const cls =
                place === 'icon' ? 'end-control icon-end' : place === 'link' ? 'end-control link-end' : 'end-control';
              _c.submit = E(place === 'link' ? 'a' : 'button', cls, document.body, place === 'icon' ? '✓' : endText);
              if (place === 'link') {
                _c.submit.href = '#';
                _c.submit.addEventListener('click', (e) => e.preventDefault());
              } else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = place === 'icon' ? endText : '';
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.addEventListener('click', () => ctx.submit());
              if (_c.collision) {
                const d = E('button', 'end-xtra', document.body, _c.collision);
                d.type = 'button';
                d.addEventListener('click', () => env.log('decoy', { label: _c.collision, collide: true }));
              }
            }
          },
      },
    },
  });
})();
