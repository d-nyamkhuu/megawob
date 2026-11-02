// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'flash',
        'brand': 'MailDesk',
        'nav': '',
        'foot': true,
        'bg': '#9fcbef',
        'surface': '#eff6fc',
        'fg': '#062354',
        'line': '#8daed0',
        'title': '#3164a2',
        'titlefg': '#fff',
        'control': '#d3e4f4',
        'accent': '#f6d956',
        'accentfg': '#082356',
        'sel': '#c3ddf3',
        'bar': 75,
        'note': 'left:1%;top:13%;width:19%;background:#ffe896;clip-path:polygon(0 0,100% 0,100% 86%,90% 100%,0 100%)',
        'end': 'left:2%;bottom:5%;width:17%;clip-path:polygon(9% 0,94% 0,100% 50%,90% 100%,0 100%,0 60%)',
        'geo': {
          'folders': 'left:.5%;top:24%;width:20%;height:74%;background:#80b6e8;border:0',
          'ledger': 'left:21.2%;top:1%;width:78%;height:44%',
          'document': 'left:21.2%;top:47%;width:78%;height:51%',
          'editor': 'left:52%;top:48%;width:47%;height:50%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-08',
        'scenario': 'star',
        'platform': 'web',
        'account': '—        ☐        ✕',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'compose', 'sent', 'drafts', 'trash'],
        'rowHeight': 44,
        'stack': false,
        'dock': ['Reply', 'Forward', 'Delete', 'Label ⌄', 'More ⌄'],
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { bar } = _c;
            const account = bar.querySelector('.account');
            account.innerHTML =
              '<svg viewBox="0 0 150 24" aria-hidden="true"><path d="M4 12h15 M64 5h14v14H64z M125 5l14 14 M139 5l-14 14"/></svg>';
            Object.assign(_c, { account });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, footer } = _c;
            if (C.foot) {
              const paths = [
                'M10 3 1 12l9 7v-6c10 0 15 3 18 9-1-12-8-16-18-16z',
                'M19 3 28 12l-9 7v-6C9 13 4 16 1 22 2 10 9 6 19 6z',
                'M6 7h19 M12 7V3h7v4 M8 7l1 21h13l1-21 M13 12v10 M18 12v10',
                'M3 3h12l13 13-12 12L3 15z M9 9h.1',
                'M5 15h.1 M15 15h.1 M25 15h.1',
              ];
              for (const [i, t] of C.dock.entries()) {
                const item = E('span', 'shelf-item', footer);
                item.innerHTML = '<svg viewBox="0 0 30 30" aria-hidden="true"><path d="' + paths[i] + '"/></svg>';
                E('div', 'shelf-label', item, t.replace(' ⌄', ''));
                if (i > 2) {
                  const chevron = E('i', 'chevron', item);
                  chevron.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m2 5 6 6 6-6"/></svg>';
                }
              }
            }
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end');
            ((_c.endPlacement = 'default'), (_c.endLabel = 'Submit'));
            if (!ctx.finish) {
              _c.endPlacement = endRng.pick([
                'default',
                'default',
                'default',
                'default',
                'header',
                'header',
                'link',
                'link',
              ]);
              if (_c.endPlacement !== 'default') {
                const labels =
                  ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                    ? ctx.content.END_LABELS
                    : [
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
                _c.endLabel = endRng.pick(labels);
                if (typeof _c.endLabel !== 'string')
                  _c.endLabel = _c.endLabel.label || _c.endLabel.text || _c.endLabel.name || String(_c.endLabel);
              }
            }
            Object.assign(_c, { endRng });
          },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                'button',
                'end-control ' + (_c.endPlacement === 'default' ? '' : 'end-' + _c.endPlacement),
                document.body,
                _c.endPlacement === 'link' ? _c.endLabel + ' ›' : _c.endLabel,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endLabel);
              _c.submit.title = _c.endLabel;
              if (_c.endPlacement === 'header') {
                _c.submit.style.left = '69%';
                _c.submit.style.top = '.3%';
                _c.submit.style.width = '12%';
                _c.submit.style.height = '4.2%';
              } else if (_c.endPlacement === 'link') {
                _c.submit.style.left = '2%';
                _c.submit.style.top = '72%';
                _c.submit.style.width = '18%';
                _c.submit.style.height = '6%';
              }
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && collideRng.bool(0.3)) {
              const bank =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labels = bank
                .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                .filter((x) => x.trim().toLowerCase() !== _c.endLabel.trim().toLowerCase());
              if (labels.length) {
                const label = collideRng.pick(labels);
                const decoy = E('button', 'end-pq', document.body, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
                if (_c.endPlacement === 'header') {
                  decoy.style.left = '2%';
                  decoy.style.top = '72%';
                } else {
                  decoy.style.left = '69%';
                  decoy.style.top = '.3%';
                }
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
