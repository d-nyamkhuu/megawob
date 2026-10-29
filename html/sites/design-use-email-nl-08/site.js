// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'irix',
        'brand': 'Toolchest   Desktop   Windows   Applications   Help',
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
        'site': 'design-use-email-nl-08',
        'scenario': 'nl',
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
        'folderList': ['inbox', 'archive', 'trash'],
        'rowHeight': 36,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar, ctx, footer, stage } = _c;
            const account = bar.querySelector('.account');
            account.replaceChildren();
            account.innerHTML =
              '<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="17" fill="white"/><circle cx="18" cy="12" r="6" fill="#193e68"/><path d="M8 28v-3c0-8 20-8 20 0v3a16 16 0 0 1-20 0" fill="#193e68"/></svg><span>Alex Taylor</span><svg class="account-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
            for (const [label, path] of [
              ['Settings', 'M9 2h6l1 4 4-1 3 5-3 3 3 3-3 5-4-1-1 4H9l-1-4-4 1-3-5 3-3-3-3 3-5 4 1z'],
              ['Help', ''],
            ]) {
              const b = E('button', 'footer-link', footer);
              b.type = 'button';
              b.innerHTML =
                label === 'Settings'
                  ? '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="' +
                    path +
                    '" fill="currentColor"/><circle cx="13" cy="13" r="4" fill="#eef1f6"/></svg>'
                  : '<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="12" fill="currentColor"/><text x="13" y="19" text-anchor="middle" fill="white" font-size="19" font-family="Arial">?</text></svg>';
              E('span', '', b, label);
              b.addEventListener('click', () => env.log('decoy', { label }));
            }
            _c.display = ctx.display;
            if (_c.display === 'panel' && stage.clientWidth < 1280) _c.display = 'header';
            document.body.dataset.instructionDisplay = _c.display;
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (_c.display === 'panel') E('div', 'note-title', note, 'Your task');
              else if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const placement = endRng.pick(['footer', 'footer', 'header', 'link']);
            const label = placement === 'footer' ? 'Submit' : endRng.pick(endLabels.filter((x) => x !== 'Submit'));
            document.body.dataset.endPlacement = ctx.finish ? 'none' : placement;
            Object.assign(_c, { account, endLabels, endRng, label, labelOf, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabels, footer, label, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control end-' + placement, document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = label;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const options = [...new Set(endLabels)].filter(
                (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
              );
              if (options.length) {
                const decoyLabel = collideRng.pick(options);
                const decoy = E('button', 'end-xtra', footer, decoyLabel);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
