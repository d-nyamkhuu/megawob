// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'MAIL',
        'nav': '',
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
        'site': 'design-use-email-delete-10',
        'scenario': 'delete',
        'platform': 'desktop',
        'account': 'JS',
        'noteTitle': 'Your task',
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
        'frame.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            E('div', 'fake-search', bar, 'Search mail');
            E('span', 'account', bar, C.account);
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
              const ins = E('div', 'instruction', note);
              const text = ctx.instruction;
              const sender = ctx.spec?.emails?.find((p) => text.includes(p.name))?.name;
              if (sender) {
                const at = text.indexOf(sender);
                ins.append(document.createTextNode(text.slice(0, at)));
                E('span', 'instruction-sender', ins, sender);
                ins.append(document.createTextNode(text.slice(at + sender.length)));
              } else ins.textContent = text;
              E('hr', 'note-rule', note);
              E('div', 'note-sub', note, 'Actions');
              const ol = E('ol', 'note-steps', note);
              for (const s of [
                'Locate the email' + (sender ? ' from ' + sender : '') + ' in the inbox (it is still present).',
                'Click the trash icon in the email toolbar to delete it.',
              ])
                E('li', '', ol, s);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const defaults = er.bool(0.5);
              const bank = ctx.content?.END_LABELS || [
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
              ];
              const label = defaults
                ? 'Submit'
                : String(
                    er.pick(bank.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))),
                  );
              const placement = defaults ? 'margin' : er.pick(['header', 'link']);
              _c.submit = E('button', 'end-control', document.body);
              E('span', '', _c.submit, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const same = (x) => String(x).trim().toLowerCase() === label.trim().toLowerCase();
                const pool = bank
                  .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                  .filter((x) => !same(x));
                if (pool.length) {
                  const text = String(cr.pick(pool));
                  const decoy = E('button', 'end-pq', document.body, text);
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
