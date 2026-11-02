// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-single-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-type-text-single-02',
        'brand': 'Text Entry Exercise',
        'title': 'Your Answer',
        'instruction': 'left',
        'rail': '',
        'menu': 'File|Edit|View|Tools|Help',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { top, u } = _c;
            const brand = u.el('span', 'ds-brand', top, C.brand);
            brand.insertAdjacentHTML(
              'afterbegin',
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="#b9c8d3" stroke="#44627b" style="vertical-align:middle;margin-right:8px"><rect x="2" y="2" width="20" height="20"/><path d="M6 6h12M6 10h12M6 14h7M6 18h7"/></svg>',
            );
            const wins = u.el('div', 'ds-wincontrols', top);
            ['minimize', 'maximize', 'close'].forEach((key) => {
              const b = u.el('button', 'ds-wincontrol', wins);
              b.type = 'button';
              b.setAttribute('aria-label', key);
              b.innerHTML =
                '<svg width="16" height="16" viewBox="0 0 16 16"><path d="' +
                { minimize: 'M2 12h12', maximize: 'M2 2h12v12H2z', close: 'M3 3l10 10M13 3 3 13' }[key] +
                '" fill="none" stroke="black" stroke-width="2"/></svg>';
            });
            Object.assign(_c, { brand, wins });
          },
        'frame.7': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, u } = _c;
            function briefing(parent, cls) {
              const b = u.el('aside', cls, parent);
              if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
              u.el('div', 'ds-instruction', b, ctx.instruction);
              if (C.site === 'design-type-text-single-02' && cls === 'ds-brief') {
                u.el('hr', 'ds-rule', b);
                u.el(
                  'p',
                  'ds-note',
                  b,
                  'Type the exact characters shown (including uppercase and lowercase letters) into the text box on the right.',
                );
                u.el('b', 'ds-notes-title', b, 'Notes:');
                const list = u.el('ul', 'ds-note-list', b);
                [
                  'The entry is case-sensitive.',
                  'Enter only the characters shown.',
                  'Do not include extra spaces.',
                ].forEach((t) => u.el('li', '', list, t));
              }
              return b;
            }
            Object.assign(_c, { briefing });
          },
        'frame.23': (base, S) =>
          function (_c) {
            const { ctx, foot, u } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const bank = ctx.content && ctx.content.END_LABELS;
              const labels =
                Array.isArray(bank) && bank.length
                  ? bank
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels));
              const placement = er.pick(['right', 'right', 'header', 'status']);
              const makeEnd = (parent, cls, txt) => {
                const b = u.el('button', cls, parent, txt);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.addEventListener('click', () => ctx.submit());
                return b;
              };
              if (placement === 'right') _c.submit = makeEnd(foot, 'ds-submit', label);
              else if (placement === 'header') {
                const bar = document.querySelector('.ds-menu');
                _c.submit = makeEnd(bar, 'ds-submit ds-end-header', label);
              } else {
                foot.classList.add('ds-end-status');
                _c.submit = makeEnd(foot, 'ds-submit ds-end-status-btn', label);
              }
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const options = labels.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
                if (options.length) {
                  const d = u.el(
                    'button',
                    'ds-xtra ds-pq',
                    document.querySelector('.ds-menu'),
                    labelOf(cr.pick(options)),
                  );
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
                }
              }
            }
          },
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
      },
    },
  });
})();
