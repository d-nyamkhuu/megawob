// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'The Daily Chronicle',
        'nav': 'Home  World  Business  Local  Arts  Life',
        'foot': true,
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
        'site': 'design-use-email-delete-04',
        'scenario': 'delete',
        'platform': 'desktop',
        'account': 'Mon, Apr 11, 2011',
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
        'frame.4': (_base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const brand = E('span', 'brand', bar);
            E('span', 'masthead', brand, 'The Daily Chrónicle');
            Object.assign(_c, { brand });
          },
        'frame.6': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const acc = E('span', 'account', bar, '');
            E('span', 'acc-date', acc, C.account);
            const accl = E('span', 'acc-links', acc);
            E('span', '', accl, 'Welcome, reader');
            E('span', 'red', accl, 'My Account');
            E('span', 'red', accl, 'Sign Out');
            Object.assign(_c, { acc, accl });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.14': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, footer } = _c;
            if (C.foot) {
              const pp = E('img', 'newspaper', footer);
              pp.src = 'sites/' + C.site + '/assets/newspaper.svg';
              pp.alt = '';
              pp.setAttribute('aria-hidden', 'true');
              E('span', 'vrule', footer);
            }
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (ctx.display === 'panel' && C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (_base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            _c.endPlacement = 'footer';
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const source = ctx.content && ctx.content.END_LABELS;
              const labels =
                Array.isArray(source) && source.length
                  ? source.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const base = labels.find((x) => String(x).trim().toLowerCase() === 'submit') || 'Submit';
              const baseline = er.bool(0.5);
              _c.endPlacement = baseline ? 'footer' : er.pick(['toolbar', 'link']);
              const alternates = labels.filter(
                (x) => String(x).trim().toLowerCase() !== String(base).trim().toLowerCase(),
              );
              const label = baseline ? base : er.pick(alternates) || base;
              _c.submit = E('button', 'end-control end-' + _c.endPlacement, document.body);
              E('span', '', _c.submit, _c.endPlacement === 'link' ? label + ' ›' : label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && cr.bool(0.3)) {
              const same = String(_c.submit.getAttribute('aria-label')).trim().toLowerCase();
              const pool = (
                (ctx.content && ctx.content.END_LABELS) || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                  'Complete',
                  "I'm done",
                ]
              )
                .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                .filter((x) => String(x).trim().toLowerCase() !== same);
              if (pool.length) {
                const decoy = E('button', 'end-xtra', document.body, cr.pick(pool));
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
              }
            }
            Object.assign(_c, { cr });
          },
      },
    },
  });
})();
