// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  const fallbackEnds = [
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
  const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  const episodeEndLabel = (ctx) => {
    const r = ctx.rng.fork('chrome/end'),
      bank = ctx.content && ctx.content.END_LABELS;
    return labelText(r.pick(Array.isArray(bank) && bank.length ? bank : fallbackEnds));
  };
  env.site({
    name: 'design-reorder-items-grid-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'organizer',
        'title': '',
        'foot': 'Reorder all tiles. The list will be read left to right, top to bottom.',
        'accent': '#ff7921',
        'bg': '#f6f4ef',
        'surface': '#fcfcfc',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.22': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { ctx, footer, u } = _c;
            {
              const fc = u.el('div', 'footer-copy', footer);
              fc.hidden = ctx.display === 'hidden';
              u.el('div', 'fc-pin', fc);
              u.el('div', 'fc-title', fc, 'Instructions');
              u.el('div', 'fc-text', fc, ctx.instruction);
            }
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { ctx, footer, note, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              endBank = ctx.content && ctx.content.END_LABELS;
            const ends = Array.isArray(endBank) && endBank.length ? endBank : fallbackEnds;
            const usual = endR.bool(0.5),
              label = usual
                ? labelText(ends.find((x) => labelText(x).toLowerCase() === 'submit') || 'Submit')
                : labelText(endR.pick(ends)),
              placement = usual ? 'dock' : endR.pick(ctx.display === 'hidden' ? ['link'] : ['header', 'link']);
            if (!ctx.finish) {
              if (placement === 'header') note.classList.add('has-end-header');
              if (placement === 'link') {
                _c.submit = u.el('a', 'organizer-endlink', footer, label + ' ›');
                _c.submit.href = '#';
              } else {
                _c.submit = u.el(
                  'button',
                  placement === 'header' ? 'submit organizer-end-header' : 'submit',
                  placement === 'header' ? note : footer,
                  label,
                );
              }
              if (_c.submit.tagName === 'BUTTON') _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const used = label.trim().toLowerCase(),
                opts = [...new Set(ends.map(labelText))].filter((x) => x.trim().toLowerCase() !== used);
              if (opts.length) {
                document.body.classList.add('has-pqd-xtra');
                const text = labelText(cr.pick(opts)),
                  b = u.el('button', 'organizer-xtra', footer, text);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', { label: text, collide: true });
              }
            }
            Object.assign(_c, { cr, endBank, endR, ends, label, placement, usual });
          },
        'frame.29': (base, S) =>
          function (_c) {
            const { C } = S;
            const { footer, u } = _c;
            if (['aqua', 'collage', 'organizer'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(reset, _c.submit);
              if (C.theme === 'organizer') {
                reset.textContent = '';
                reset.type = 'button';
                reset.innerHTML =
                  '<svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="#2b2420" stroke-width="3"><path d="M26 16A10 10 0 1 1 20 7M20 2V8H26"/></svg><span>Reset</span>';
                const sh = u.el('button', 'clear shuffle', footer);
                sh.type = 'button';
                sh.innerHTML =
                  '<svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="#2b2420" stroke-width="4"><rect x="4" y="4" width="9" height="9"/><rect x="19" y="4" width="9" height="9"/><rect x="4" y="19" width="9" height="9"/><rect x="19" y="19" width="9" height="9"/></svg><span>Shuffle</span>';
                if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(sh, _c.submit);
              }
            }
          },
      },
    },
  });
})();
