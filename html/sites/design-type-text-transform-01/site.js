// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-transform-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        site: 'design-type-text-transform-01',
        brand: 'Text Transformer',
        instruction: 'top',
        rail: '',
        menu: 'File|Edit|Tools|Help',
        briefTitle: 'Instructions',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, top, u } = _c;
            const icon = u.el('span', 'ds-be-icon', top, '▤');
            icon.innerHTML =
              '<svg viewBox="0 0 30 32" aria-hidden="true"><path d="M3 2h19l5 5v23H3z" fill="#fafafa" stroke="#17243c" stroke-width="2"/><path d="M22 2v6h5M7 7h10M7 11h14M7 15h16M7 19h10M7 23h15M7 27h12" fill="none" stroke="#24354d" stroke-width="1.6"/><path d="M20 18h3v7h-3z" fill="#8994a2"/></svg>';
            top.insertBefore(icon, top.firstChild);
            const endRng = ctx.rng.fork('chrome/end');
            const commonEnd = !ctx.finish && endRng.bool(0.5);
            const placement = ctx.finish ? null : commonEnd ? 'footer' : endRng.pick(['footer', 'header', 'link']);
            const bank = ctx.content && ctx.content.END_LABELS;
            const labelOf = (x) => (typeof x === 'string' ? x : String((x && (x.label || x.text || x.name)) || x));
            const alternates = (
              bank && bank.length
                ? bank.map(labelOf)
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).filter((x) => x.trim().toLowerCase() !== 'submit');
            const label = commonEnd || !alternates.length ? 'Submit' : endRng.pick(alternates);
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const labels =
                bank && bank.length
                  ? bank.map(labelOf)
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (choices.length) _c.collide = collideRng.pick(choices);
            }
            _c.submit = null;
            const makeEnd = (parent, cls, text) => {
              const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              return b;
            };
            const makeDecoy = (parent, text) => {
              const b = u.el('button', 'ds-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              return b;
            };
            if (C.menu) {
              const nav = u.el('nav', 'ds-menu', document.body);
              C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
              const controls = u.el('div', 'ds-be-controls', nav);
              if (placement === 'header') _c.submit = makeEnd(top, 'ds-submit ds-top-submit', label);
              if (_c.collide && placement === 'header') makeDecoy(controls, _c.collide);
              ['−', '□', '×'].forEach((t) => {
                const b = u.el('button', '', controls, t);
                b.type = 'button';
              });
            }
            Object.assign(_c, {
              alternates,
              bank,
              collideRng,
              commonEnd,
              endRng,
              icon,
              label,
              labelOf,
              makeDecoy,
              makeEnd,
              placement,
            });
          },
        'frame.8': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx } = _c;
            const mode =
              ctx.display === 'hidden'
                ? 'hidden'
                : ctx.display === 'toast'
                  ? 'toast'
                  : ctx.display === 'panel'
                    ? 'left'
                    : C.instruction;
            Object.assign(_c, { mode });
          },
        'frame.13': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, label, makeDecoy, makeEnd, placement, stage, u } = _c;
            if (!ctx.finish && placement === 'footer') _c.submit = makeEnd(foot, 'ds-submit', label);
            if (!ctx.finish && placement === 'link') _c.submit = makeEnd(foot, 'ds-endlink', label + ' ›');
            if (_c.collide && placement !== 'header') makeDecoy(foot, _c.collide);
            const clear = u.el('button', 'ds-be-clear', foot, 'Clear');
            clear.type = 'button';
            clear.addEventListener('click', () => {
              const input = stage.querySelector('input');
              if (input) {
                input.value = '';
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            });
            Object.assign(_c, { clear });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
      },
    },
  });
})();
