// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-important-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gtk',
        'brand': 'Mail',
        'nav': 'File   Edit   View   Message   Tools   Help',
        'bg': '#eeede7',
        'surface': '#eeece4',
        'fg': '#111',
        'line': '#aaa99e',
        'title': 'linear-gradient(#4f83b4,#32689e)',
        'titlefg': '#fff',
        'control': 'linear-gradient(#f5f4ec,#dedcd0)',
        'accent': '#bacada',
        'accentfg': '#000',
        'sel': '#dce6ee',
        'bar': 35,
        'note': 'left:.5%;top:1%;width:20%;height:98%;font-weight:400',
        'end': 'left:2%;bottom:4%;width:17%',
        'geo': {
          'folders': 'left:21.3%;top:16%;width:14%;height:83%',
          'ledger': 'left:35.8%;top:16%;width:63.7%;height:40%',
          'document': 'left:35.8%;top:57%;width:63.7%;height:42%',
          'editor': 'left:64%;top:58%;width:35.5%;height:41%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-important-07',
        'scenario': 'important',
        'platform': 'desktop',
        'account': '–      □      ✕',
        'noteTitle': null,
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'templates', 'junk', 'trash'],
        'rowHeight': 36,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { E } = _c;
            const drafting = E('div', 'drafting-marks', document.body);
            drafting.innerHTML =
              '<svg viewBox="0 0 1672 941" preserveAspectRatio="none"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M26 27H305 M26 54H305 M32 20V64 M277 20V122 M277 811V913 M32 904H1318 M1288 21V123 M1288 811V921 M207 904H1318 M43 842V915 M43 904h54 M1608 331h45 M1637 278v375"/><path d="M268 896h15v16h-15z M1281 896h15v16h-15z M1402 799h237v99h-237z M1482 799v99 M1560 799v99 M1402 832h158 M1402 865h158 M1568 845h65 M1600 814v63"/><circle cx="1600" cy="845" r="24"/><circle cx="43" cy="904" r="4"/><path d="M93 904l-5-2m5 2-5 2 M43 847l-2 5m2-5 2 5 M1277 27h22 M1288 16v22"/></g><g fill="currentColor" font-family="monospace" font-size="14"><text x="58" y="46">A1</text><text x="113" y="46">1:50</text><text x="179" y="46">0.00</text><text x="50" y="857">Y</text><text x="86" y="895">X</text><text x="1420" y="822">SCALE</text><text x="1501" y="822">1:50</text><text x="1420" y="855">UNITS</text><text x="1501" y="855">mm</text><text x="1420" y="887">GRID</text><text x="1501" y="887">10</text></g></svg>';
            Object.assign(_c, { drafting });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            const noteMode = ctx.display || 'header';
            document.body.dataset.instr = noteMode;
            Object.assign(_c, { noteMode });
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, noteMode } = _c;
            if (noteMode !== 'hidden') {
              _c.note = E('aside', 'task-note', document.body);
              _c.note.dataset.display = noteMode;
              if (C.noteTitle) E('div', 'note-title', _c.note, C.noteTitle);
              E('div', 'instruction', _c.note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end');
            const endLabels = ctx.content.END_LABELS || [
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
            const labels = endLabels.map(labelOf);
            const label = endRng.bool(0.5) ? 'Submit' : endRng.pick(labels.filter((x) => x.toLowerCase() !== 'submit'));
            const placement = endRng.pick(['palette', 'palette', 'toolbar', 'status']);
            document.body.dataset.endPlacement = placement;
            Object.assign(_c, { endLabels, endRng, label, labelOf, labels, placement });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, label, labels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
              if (placement === 'toolbar') _c.submit.classList.add('end-toolbar');
              if (placement === 'status') _c.submit.classList.add('end-status');
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const lower = label.toLowerCase();
              const options = [...new Set(labels)].filter((x) => x.toLowerCase() !== lower);
              if (options.length) {
                const colliding = E('button', 'chrome-pq', document.body, collideRng.pick(options));
                colliding.type = 'button';
                colliding.setAttribute('aria-label', colliding.textContent);
                colliding.addEventListener('click', () =>
                  env.log('decoy', { label: colliding.textContent, collide: true }),
                );
              }
            }
            Object.assign(_c, { collideRng });
          },
        'frame.22': (base, S) =>
          function (_c) {
            for (const e of document.body.querySelectorAll('.task-note,.end-control,.obstruction')) {
              if (e.classList.contains('end-control')) continue;
              const r = e.getBoundingClientRect();
              e.style.left = Math.round(r.left) + 'px';
              e.style.top = Math.round(r.top) + 'px';
              e.style.width = Math.round(r.width) + 'px';
              e.style.height = Math.round(r.height) + 'px';
              e.style.right = 'auto';
              e.style.bottom = 'auto';
            }
          },
      },
    },
  });
})();
