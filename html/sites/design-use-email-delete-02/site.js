// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'extranet',
        'brand': 'Riverton Supply Co.',
        'nav': 'Home   Orders   Inventory   Reports   Messages   Partners   Support',
        'bg': '#d7dbdf',
        'surface': '#f4f4f3',
        'fg': '#061029',
        'line': '#8e98a7',
        'title': '#d8dce0',
        'control': 'linear-gradient(#eff1f3,#cbd0d6)',
        'accent': '#123d71',
        'sel': '#c8dbed',
        'font': 'Verdana,Arial,sans-serif',
        'bar': 82,
        'foot': 62,
        'note': 'right:1.8%;bottom:12%;width:38%',
        'end': 'right:2%;bottom:1.5%',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:.5%;top:1%;width:58%;height:98%',
          'document': 'right:.5%;top:1%;width:40.5%;height:98%',
          'editor': 'right:.5%;top:40%;width:40.5%;height:59%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-delete-02',
        'scenario': 'delete',
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
        'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
        'rowHeight': 43,
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
            _c.display = ctx.display;
            if (
              (_c.display === 'panel' && window.innerWidth < 1180) ||
              (_c.display === 'toast' && window.innerHeight < 700)
            )
              _c.display = 'header';
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              const title = _c.display === 'panel' ? 'Task instructions' : C.noteTitle;
              if (title) E('div', 'note-title', note, title);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, ctx, footer } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end').fork(String(ctx.instruction));
              const labels = ctx.content && ctx.content.END_LABELS;
              const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const pool =
                labels && labels.length
                  ? labels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const defaultLabel = labelText(
                pool.find((x) => labelText(x).trim().toLowerCase() === 'submit') || 'Submit',
              );
              const baseline = er.bool(0.5);
              const alternatives = pool.filter(
                (x) => labelText(x).trim().toLowerCase() !== defaultLabel.trim().toLowerCase(),
              );
              const label = baseline ? defaultLabel : labelText(er.pick(alternatives.length ? alternatives : pool));
              const placement = baseline ? 'footer' : er.pick(['footer-link', 'header']);
              _c.submit = E('button', 'end-control', document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
              const cr = ctx.rng.fork('chrome/collide').fork(String(ctx.instruction));
              if (cr.bool(0.3)) {
                const collisionPool = (
                  labels && labels.length
                    ? labels
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
                ).map(labelText);
                const options = [...new Set(collisionPool)].filter(
                  (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
                );
                if (options.length) {
                  const decoy = E(
                    'button',
                    'end-xtra',
                    placement === 'header' || placement === 'footer-link' ? bar : footer,
                    labelText(cr.pick(options)),
                  );
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.dataset.collide = 'true';
                  decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
