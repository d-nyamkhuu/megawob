// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-12',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'notebook',
        'brand': 'Northbridge',
        'nav': 'Workplace  Notebook  Mail  Files  People',
        'bg': '#edf8f2',
        'surface': '#fbfefd',
        'fg': '#10272b',
        'line': '#a4c5b9',
        'title': '#194e3d',
        'titlefg': '#fff',
        'control': '#d0e4dc',
        'accent': '#27825d',
        'sel': '#d4ebe1',
        'bar': 68,
        'note': 'left:1.2%;top:21%;width:20.8%;height:39%;font-size:clamp(16px,1.5vw,25px)',
        'end': 'left:6.5%;top:53.5%;padding:10px 30px;font-size:21px',
        'geo': {
          'folders': 'left:23.2%;top:18%;width:13%;height:65%',
          'ledger': 'left:36.2%;top:18%;width:40.5%;height:65%',
          'document': 'display:none',
          'editor': 'display:none',
          'contacts': 'right:1.2%;top:18%;width:20.7%;height:39%',
        },
        'site': 'design-use-email-delete-12',
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
        'folderList': ['compose', 'inbox', 'sent', 'drafts', 'archive', 'junk', 'trash'],
        'rowHeight': 49,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, footer } = _c;
            if (C.style === 'pixel') {
              E('span', '', footer, 'Quick action:');
              const disabled = E('button', 'quick-disabled', footer, 'Star this message');
              disabled.disabled = true;
              const tools = E('div', 'footer-real-tools', footer);
              for (const op of ['Reply', 'Forward', 'Delete']) {
                const b = E('button', '', tools, op);
                b.type = 'button';
                b.addEventListener('click', () => {
                  const k = op.toLowerCase();
                  const target = document.querySelector('[data-target=\"toolbar:' + k + '\"]');
                  if (target) target.click();
                });
              }
            }
            if (!C.foot) footer.hidden = true;
          },
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
            _c.placement = null;
            _c.endText = 'Submit';
            _c.collide = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const labels = (
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
              ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
              const primary = labels.find((x) => String(x).trim().toLowerCase() === 'submit') || 'Submit';
              const others = labels.filter(
                (x) => String(x).trim().toLowerCase() !== String(primary).trim().toLowerCase(),
              );
              _c.placement = er.pick(['note', 'note', 'header', 'footer']);
              _c.endText = er.bool(0.5) ? primary : er.pick(others.length ? others : [primary]);
              const positions = ['note', 'header', 'footer'];
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const options = [...new Set(labels)].filter(
                  (x) => String(x).trim().toLowerCase() !== String(_c.endText).trim().toLowerCase(),
                );
                if (options.length)
                  _c.collide = { label: cr.pick(options), where: cr.pick(positions.filter((x) => x !== _c.placement)) };
              }
              _c.submit = E('button', 'end-control end-' + _c.placement, document.body, _c.endText);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endText);
              _c.submit.title = _c.endText;
              _c.submit.addEventListener('click', () => ctx.submit());
              if (_c.collide) {
                const b = E('button', 'pq-control pq-' + _c.collide.where, document.body, _c.collide.label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label: _c.collide.label, collide: true }));
              }
            }
          },
      },
    },
  });
})();
