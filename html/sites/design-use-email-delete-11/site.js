// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-11',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'next',
        'brand': 'Mail',
        'nav': 'File   Edit   Message   View   Tools   Help',
        'bg': '#aaa',
        'surface': '#c6c6c6',
        'fg': '#101010',
        'line': '#444',
        'title': 'linear-gradient(#303030,#151515)',
        'titlefg': '#fff',
        'control': 'linear-gradient(#ddd,#aaa)',
        'accent': '#ddd',
        'accentfg': '#000',
        'sel': '#777',
        'selfg': '#fff',
        'bar': 45,
        'note': 'left:2%;top:9%;width:71%',
        'end': 'right:3%;bottom:4%',
        'ob': ['newsletter', 'Close'],
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:1%;top:15%;width:74%;height:42%',
          'document': 'left:1%;top:58%;width:74%;height:40%',
          'editor': 'left:40%;top:59%;width:35%;height:39%',
          'contacts': 'right:1%;top:1%;width:23%;height:80%',
        },
        'site': 'design-use-email-delete-11',
        'scenario': 'delete',
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
        'rowHeight': 33,
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
            const { E, bar, ctx } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const legacy = er.bool(0.5);
              const placement = legacy ? 'inspector' : er.pick(['menu', 'title']);
              const labels = (ctx.content && ctx.content.END_LABELS) || [
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
              const label = legacy ? 'Submit' : String(er.pick(labels));
              _c.submit = E('button', 'end-control', placement === 'menu' ? bar : document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.title = label;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.addEventListener('click', () => ctx.submit());
              if (placement === 'menu') _c.submit.classList.add('end-menu');
              if (placement === 'title') _c.submit.classList.add('end-title');
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const same = (x) => String(x).trim().toLowerCase() === label.trim().toLowerCase();
                const choices = [...new Set(labels.map((x) => String(x)))].filter((x) => !same(x));
                if (choices.length) {
                  const d = E(
                    'button',
                    'chrome-nav pqs-xtra',
                    document.querySelector('.nav') || bar,
                    cr.pick(choices),
                  );
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
                }
              }
            }
          },
        'frame.20': () => () => {},
        'overlay.1': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            if (ctx.initial) {
              const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
              const e = E('aside', 'obstruction newsletter', document.body);
              e.setAttribute('role', 'dialog');
              const title = E('div', 'newsletter-title', e);
              E('span', 'newsletter-gadget', title, '◻');
              E('span', '', title, 'Hillview Newsletter');
              const art = E('div', '', e);
              art.innerHTML =
                '<svg class="building-art" viewBox="0 0 200 190"><rect width="200" height="190" fill="#ccc"/><path d="M0 145 30 125V50l105-35 50 35v95l15 20v25H0Z" fill="#eee" stroke="#333"/><path d="m30 50 105 30 50-30M135 80v80M30 135l105 25 50-20M12 180l185-26" stroke="#333" fill="none"/>' +
                [43, 66, 89, 112, 146, 164]
                  .flatMap((x) => [65, 100].map((y) => '<path d="M' + x + ' ' + y + 'v22h12V' + y + 'z" fill="#333"/>'))
                  .join('') +
                '</svg>';
              E('h3', '', e, 'The Hillview Newsletter');
              E('p', '', e, 'Ideas. People. A Brighter Tomorrow.');
              const b = E('button', '', e, 'Close');
              b.type = 'button';
              b.dataset.dismiss = 'true';
              b.addEventListener('click', () => ctx.dismiss());
              return { el: e, dismiss: b };
            }
            const e = ctx.util.el('aside', 'perturb ' + ctx.kind, document.body);
            Object.assign(_c, { e });
          },
      },
    },
  });
})();
