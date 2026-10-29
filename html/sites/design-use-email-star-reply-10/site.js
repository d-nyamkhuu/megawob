// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'plain',
        'brand': 'Activities',
        'nav': 'Mail',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#000',
        'line': '#444',
        'title': '#fff',
        'control': '#ddd',
        'accent': '#ddd',
        'accentfg': '#000',
        'sel': '#ddd',
        'font': '"Times New Roman",serif',
        'bar': 60,
        'note': 'left:2%;top:9%;width:96%;padding:8px 0;border:0;border-block:1px solid #111;font-size:20px',
        'end': 'right:2%;bottom:1.5%;padding:7px 32px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:2%;top:11%;width:25%;height:34%',
          'document': 'left:2%;top:11%;width:96%;height:45%;border:0;border-bottom:1px solid #111',
          'editor': 'left:2%;top:57%;width:96%;height:36%;border:0;border-bottom:1px solid #111',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-reply-10',
        'scenario': 'star-reply',
        'platform': 'web',
        'account': 'Oct 26  10:24',
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
        'frame.15': (_base, S) =>
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
        'frame.19': (_base, S) =>
          function (_c) {
            const { E, bar, ctx } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const labels = ctx.content.END_LABELS || [
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
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const allLabels = labels.map(labelOf);
              const defaultLabel = allLabels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
              const base = er.bool(0.5);
              const alternatives = allLabels.filter(
                (x) => x.trim().toLowerCase() !== defaultLabel.trim().toLowerCase(),
              );
              const label = base ? defaultLabel : labelOf(er.pick(alternatives.length ? alternatives : labels));
              const placement = base ? 'header' : ctx.rng.fork('chrome/placement').pick(['link', 'icon']);
              document.body.dataset.endPlacement = placement;
              const cls =
                'end-control' + (placement === 'link' ? ' end-link' : placement === 'icon' ? ' end-icon' : '');
              _c.submit = E(
                placement === 'link' ? 'a' : 'button',
                cls,
                document.body,
                placement === 'icon' ? '✓' : label,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const current = _c.submit && _c.submit.getAttribute('aria-label');
              const options = [
                ...new Set(
                  (
                    ctx.content.END_LABELS || [
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
                  ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x))),
                ),
              ].filter((x) => x.trim().toLowerCase() !== (current || '').trim().toLowerCase());
              if (options.length) {
                const b = E('button', 'chrome-pq', bar, options[0] && cr.pick(options));
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
              }
            }
            Object.assign(_c, { cr });
          },
      },
    },
  });
})();
