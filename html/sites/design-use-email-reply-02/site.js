// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'precision',
        'brand': 'Aurora Mail',
        'nav': '',
        'bg': '#1c1528',
        'surface': '#241c32',
        'fg': '#eee6ff',
        'line': '#473953',
        'title': '#30243d',
        'control': '#372b47',
        'accent': '#f5616a',
        'sel': '#70414f',
        'bar': 0,
        'note': 'left:.8%;top:1%;width:75.5%;height:14%;background:#352640',
        'end': 'right:1.2%;bottom:7%;width:20.5%',
        'geo': {
          'folders': 'left:1%;top:25%;width:27.5%;height:5%;flex-direction:row;border:0',
          'ledger': 'left:.5%;top:17%;width:28%;height:82%',
          'document': 'left:29%;top:17%;width:47%;height:42%',
          'editor': 'left:29%;top:59%;width:47%;height:40%',
          'contacts': 'right:1%;top:1%;width:21.5%;height:78%',
        },
        'site': 'design-use-email-reply-02',
        'scenario': 'reply',
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
        'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
        'rowHeight': 95,
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
            const { E, ctx } = _c;
            _c.endPlacement = 'default';
            _c.endLabel = 'Submit';
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              if (!er.bool(0.5)) {
                _c.endPlacement = er.pick(['panel', 'link']);
                const labels = ctx.content && ctx.content.END_LABELS;
                const options =
                  Array.isArray(labels) && labels.length
                    ? labels
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
                _c.endLabel = er.pick(options);
                if (typeof _c.endLabel !== 'string')
                  _c.endLabel = _c.endLabel.label || _c.endLabel.text || _c.endLabel.name || String(_c.endLabel);
              }
              const isLink = _c.endPlacement === 'link';
              _c.submit = E(
                isLink ? 'a' : 'button',
                'end-control' + (_c.endPlacement === 'default' ? '' : ' end-' + _c.endPlacement),
                document.body,
                _c.endLabel,
              );
              if (isLink) _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endLabel);
              _c.submit.title = _c.endLabel;
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const labels = ctx.content && ctx.content.END_LABELS;
              const pool =
                Array.isArray(labels) && labels.length
                  ? labels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const options = [...new Set(pool.map(labelOf))].filter(
                (x) => x.trim().toLowerCase() !== _c.endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = cr.pick(options);
                const b = E('button', 'end-xtra', document.body, label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { cr });
          },
      },
    },
  });
})();
