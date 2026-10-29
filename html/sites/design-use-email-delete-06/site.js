// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'My Mail',
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
        'site': 'design-use-email-delete-06',
        'scenario': 'delete',
        'platform': 'desktop',
        'account': 'Mon Apr 14  10:24 AM',
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
        'frame.3': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            document.body.classList.toggle('finish-mode', !!ctx.finish);
            const endR = ctx.rng.fork('chrome/end');
            const endPlaces = ['brief', 'brief', 'brief', 'toolbar', 'workspace', 'toolbar'];
            const endPlace = ctx.finish ? null : endR.pick(endPlaces);
            const endBank =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const endOptions = endBank.map((x) =>
              typeof x === 'string' ? x : x.label || x.text || x.name || String(x),
            );
            const endText = ctx.finish
              ? 'Submit'
              : endR.bool(0.5)
                ? 'Submit'
                : endR.pick(endOptions.filter((x) => x.trim().toLowerCase() !== 'submit')) || 'Submit';
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bar, endBank, endOptions, endPlace, endPlaces, endR, endText });
          },
        'frame.6': (base, S) =>
          function (_c) {
            const { E, bar, ctx, endText } = _c;
            const acct = E('span', 'account', bar);
            for (const [i, t] of ['Help', 'Sign Out'].entries()) {
              if (i) acct.appendChild(document.createTextNode(' | '));
              const a = E('a', '', acct, t);
              a.href = '#';
              a.addEventListener('click', (ev) => {
                ev.preventDefault();
                env.log('decoy', { label: t });
              });
            }
            E('div', 'vrule', document.body);
            E('div', 'brief-rule', document.body);
            const brief = E('div', 'brief', document.body);
            E('b', '', brief, 'Details:');
            E(
              'p',
              '',
              brief,
              'The inbox on the right lists your messages. Each row shows the sender, subject and date. Use the toolbar to manage your mail.',
            );
            E('b', 'notes-head', brief, 'Notes:');
            const notes = E('p', '', brief, 'Check a box to select a message.');
            E('br', '', notes);
            notes.appendChild(
              document.createTextNode(
                ctx.finish
                  ? 'You can finish when you are ready.'
                  : 'When you are ready, click the ' + endText + ' button.',
              ),
            );
            Object.assign(_c, { acct, brief, notes });
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
            const { E, ctx, endBank, endPlace, endText } = _c;
            if (!ctx.finish) {
              const endClass = endPlace === 'brief' ? 'end-control' : 'end-control end-' + endPlace;
              _c.submit = E('button', endClass, document.body, endText);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.title = endText;
              _c.submit.addEventListener('click', () => ctx.submit());
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const labels = endBank
                  .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                  .filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase());
                if (labels.length) {
                  const collideText = cr.pick(labels);
                  const otherPlaces = ['brief', 'toolbar', 'workspace'].filter((x) => x !== endPlace);
                  const decoy = E('button', 'end-xtra end-xtra-' + cr.pick(otherPlaces), document.body, collideText);
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.addEventListener('click', () => env.log('decoy', { label: collideText, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
