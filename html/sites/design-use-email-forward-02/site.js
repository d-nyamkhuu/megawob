// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gem',
        'brand': 'Desk   File   Message   Options   Window   Help',
        'nav': '',
        'bg': 'repeating-linear-gradient(135deg,#bbb 0 1px,#eee 1px 3px)',
        'surface': '#eee',
        'fg': '#000',
        'line': '#111',
        'title': 'repeating-linear-gradient(135deg,#999 0 1px,#ddd 1px 3px)',
        'control': '#ddd',
        'accent': '#ddd',
        'accentfg': '#000',
        'sel': '#000',
        'selfg': '#fff',
        'font': '"DejaVu Sans Mono",monospace',
        'bar': 27,
        'note': 'left:1%;top:6%;width:39%;height:16%',
        'end': 'right:1.5%;bottom:6%;width:12%',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:1%;top:25%;width:40%;height:72%',
          'document': 'left:1%;top:25%;width:41%;height:72%',
          'editor': 'left:42.5%;top:25%;width:42.5%;height:72%',
          'contacts': 'right:1%;top:25%;width:13%;height:49%',
        },
        'site': 'design-use-email-forward-02',
        'scenario': 'forward',
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
        'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
        'rowHeight': 34,
        'stack': true,
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
            const { E, ctx } = _c;
            const vw = document.documentElement.clientWidth,
              vh = document.documentElement.clientHeight;
            _c.display = ctx.display || 'header';
            if (_c.display === 'panel' && (vw < 1260 || vh < 700)) _c.display = 'header';
            if (_c.display === 'toast' && (vw < 1260 || vh < 700)) _c.display = 'header';
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            Object.assign(_c, { vh, vw });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, vw } = _c;
            _c.collision = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                cr = ctx.rng.fork('chrome/collide');
              const labels = ctx.content && ctx.content.END_LABELS;
              const labelBank =
                Array.isArray(labels) && labels.length
                  ? labels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const label = er.bool(0.5) ? 'Submit' : labelText(er.pick(labelBank));
              let place = er.pick(['bottom', 'bottom', 'bottom', 'toolbar', 'contacts']);
              if (place === 'toolbar' && vw < 1200) place = 'bottom';
              _c.submit = E(
                'button',
                'end-control end-' + place,
                document.body,
                place === 'contacts' ? label + ' ›' : label,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
              if (cr.bool(0.3)) {
                const pool = [
                  ...new Set(
                    labelBank.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()),
                  ),
                ];
                if (pool.length) {
                  _c.collision = E('button', 'end-pqs', document.body, labelText(cr.pick(pool)));
                  _c.collision.type = 'button';
                  _c.collision.dataset.role = 'xtra';
                  _c.collision.addEventListener('click', () =>
                    env.log('decoy', { label: _c.collision.textContent, collide: true }),
                  );
                }
              }
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            for (const e of document.body.querySelectorAll('.task-note,.end-control,.end-pqs,.obstruction')) {
              const r = e.getBoundingClientRect();
              e.style.left = Math.round(r.left) + 'px';
              e.style.top = Math.round(r.top) + 'px';
              e.style.width = Math.round(r.width) + 'px';
              e.style.height = Math.round(r.height) + 'px';
              e.style.right = 'auto';
              e.style.bottom = 'auto';
            }
          },
      },
    },
  });
})();
