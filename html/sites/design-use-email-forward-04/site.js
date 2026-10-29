// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'QuickMail',
        'nav': null,
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
        'site': 'design-use-email-forward-04',
        'scenario': 'forward',
        'platform': 'web',
        'account': 'Help  |  My Account  |  Sign Out',
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
        'frame.6': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const acc = E('span', 'account', bar);
            ['Help', 'Settings', 'Sign Out'].forEach((t, i) => {
              if (i) E('i', '', acc, '|');
              E('u', '', acc, t);
            });
            const tabs = E('div', 'tabbar', document.body);
            ['Mail', 'Contacts', 'Calendar', 'Tasks'].forEach((t, i) => {
              const b = E('button', 'tab' + (i ? '' : ' on'), tabs, t);
              b.type = 'button';
              if (i) b.addEventListener('click', () => env.log('decoy', { label: t }));
            });
            Object.assign(_c, { acc, tabs });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, tabs } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const placement = er.bool(0.5) ? 'footer' : er.pick(['header', 'link']);
              const labels = ctx.content.END_LABELS || [
                'Submit',
                'Done',
                'Finish',
                'Continue',
                'Save',
                'OK',
                'Confirm',
                'Apply',
              ];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const label = placement === 'footer' ? 'Submit' : labelOf(er.pick(labels));
              _c.submit = E('button', 'end-control end-' + placement, document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = label;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            {
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const labels = ctx.content.END_LABELS || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                ];
                const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
                const active = _c.submit ? _c.submit.getAttribute('aria-label').trim().toLowerCase() : '';
                const choices = [...new Set(labels.map(labelOf))].filter((x) => x.trim().toLowerCase() !== active);
                if (choices.length) {
                  const label = cr.pick(choices);
                  const b = E('button', 'chrome-pq', tabs, label);
                  b.type = 'button';
                  b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
