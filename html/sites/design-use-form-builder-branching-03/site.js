// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        if (kind === 'banner') {
          Object.assign(el.style, { position: 'fixed', top: '90px' });
        }
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        util.el('span', 'ref-window-icon', document.body, '▧');
        const windowControls = util.el('div', 'ref-window-controls', document.body);
        for (const glyph of ['−', '□', '×']) util.el('span', '', windowControls, glyph);
        const gtkbar = util.el('nav', 'ref-gtkbar', header);
        const gtkItems = [
          [
            'Overview',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 14 16 3l13 11v15H19V19h-6v10H3z" fill="#f8fbff" stroke="#2769a5" stroke-width="2"/><path d="m1 14 15-13 15 13" fill="none" stroke="#428bd0" stroke-width="3"/></svg>',
          ],
          [
            'Editor',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 2h14l7 7v21H6z" fill="#fff" stroke="#286da9" stroke-width="2"/><path d="M20 2v8h7M11 16h11M11 21h11M11 26h8" fill="none" stroke="#367db8" stroke-width="2"/></svg>',
          ],
          [
            'Settings',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m13 2 6 0 1 4 4 2 4-1 3 5-3 3v5l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-5l-3-3 3-5 4 1 4-2z" fill="#d9e1e9" stroke="#456781" stroke-width="1.5"/><circle cx="16" cy="17" r="5" fill="#f8f8f5" stroke="#456781" stroke-width="2"/></svg>',
          ],
          [
            'Distribute',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="5" width="28" height="22" rx="2" fill="#fff" stroke="#286da9" stroke-width="2"/><path d="m3 8 13 10L29 8" fill="none" stroke="#428bd0" stroke-width="2"/></svg>',
          ],
          [
            'Results',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 18h6v12H3zM13 9h6v21h-6zM23 2h6v28h-6z" fill="#59ad69" stroke="#286b3d" stroke-width="1.5"/><path d="M6 18v12m10-21v21M26 2v28" stroke="#eaffee"/></svg>',
          ],
        ];
        for (const [label, svg] of gtkItems) {
          const a = util.el('a', `ref-gtk-item${label === 'Editor' ? ' active' : ''}`, gtkbar);
          a.href = '#';
          a.dataset.role = 'nav';
          a.setAttribute('aria-label', label);
          const icon = util.el('span', 'ref-gtk-icon', a);
          icon.innerHTML = svg;
          util.el('span', '', a, label);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { gtkItems, gtkbar, header, windowControls });
      },
  };

  env.site({
    name: 'design-use-form-builder-branching-03',
    template: 'site/base',
    design: { parts },
  });
})();
