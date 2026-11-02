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
          const header = document.querySelector('header.ref-task');
          if (header) el.style.top = `${header.getBoundingClientRect().bottom}px`;
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
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(THEMES.light)) root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', '#0878f9');
        root.dataset.theme = 'light';
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const winMark = util.el('span', 'legacy-system-mark', header, '▣');
        winMark.setAttribute('aria-hidden', 'true');
        const winActions = util.el('span', 'legacy-window-actions', header);
        winActions.setAttribute('aria-hidden', 'true');
        for (const [cls, glyph] of [
          ['legacy-minimize', '−'],
          ['legacy-maximize', '□'],
          ['legacy-close', '×'],
        ]) {
          util.el('span', cls, winActions, glyph);
        }
        const menu = util.el('div', 'legacy-menubar', header);
        menu.setAttribute('aria-hidden', 'true');
        for (const label of ['File', 'Edit', 'View', 'Record', 'Tools', 'Window', 'Help']) {
          const item = util.el('span', 'legacy-menu-button', menu);
          util.el('span', 'legacy-menu-label', item, label);
          util.el('span', 'legacy-menu-pin', item, label === 'File' ? '♦' : '▼');
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { header, menu, winActions, winMark });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'equipment-rail', body);
        rail.setAttribute('aria-label', 'Asset management');
        const iconPaths = [
          '<path fill="#777" d="M14 8h39v45l-7 7H9V14z"/><path fill="#eee" d="M9 14h37v46H9zM9 14l7-6h37l-7 6z"/><path fill="#bbb" d="M13 19h29v16H13zm0 20h29v16H13z"/><path fill="none" d="M24 23h10v4H24zm0 20h10v4H24z"/><path stroke="#fff" d="M15 20h25M15 40h25"/>',
          '<path fill="#ddd" d="M7 58V31h14V17l13-8 13 8v26h10v15z"/><path fill="#aaa" d="M34 9v49h13V17z"/><path fill="none" d="M29 12V6h7M31 6V1M21 58V19M34 58V20M7 58h50"/><path stroke-width="3" d="M12 36h2m-2 7h2m-2 7h2m11-23h2m-2 7h2m-2 7h2m-2 7h2m10-20h2m-2 7h2m-2 7h2m-2 7h2m11 1h2"/>',
          '<path fill="#eee" d="M3 14h40v29H3z"/><path fill="#aaa" d="M3 43h39v7H3z"/><path fill="#1674ae" d="M43 22h12l8 14v14H42V22zM3 43h39v7H3z"/><path fill="#dceaf3" d="M47 26h7l6 10H47z"/><path fill="#222" d="M18 49a6 6 0 1 1-12 0 6 6 0 1 1 12 0zm39 0a6 6 0 1 1-12 0 6 6 0 1 1 12 0z"/><path stroke="#ddd" stroke-width="3" d="M10 49h4m35 0h4"/><path stroke="#ffda73" stroke-width="3" d="M60 40h3"/>',
          '<path fill="#aaa" d="M17 6h31l9 10v44H17z"/><path fill="#fff" d="M12 4h31l10 10v44H12z"/><path fill="#ccc" d="M43 4v11h10"/><path d="M19 14h18m-18 5h26m-26 4h26m-26 4h26m-26 4h26m-26 4h26m-26 4h26m-26 4h26m-26 4h26"/>',
          '<path fill="#aaa" d="M29 4h8l2 7 5 2 6-3 6 6-3 6 2 5 7 2v8l-7 2-2 5 3 6-6 6-6-3-5 2-2 7h-8l-2-7-5-2-6 3-6-6 3-6-2-5-7-2v-8l7-2 2-5-3-6 6-6 6 3 5-2z"/><circle fill="#ddd" cx="33" cy="33" r="15"/><path fill="#555" d="M33 21a12 12 0 1 1-1 24V34l-7-8 5-5z"/><ellipse fill="#eee" cx="35" cy="33" rx="5" ry="9"/><path stroke="#fff" d="M30 7h5M13 16l4-3M7 30v5M16 50l4 3"/>',
        ];
        ['Equipment', 'Locations', 'Vendors', 'Reports', 'Administration'].forEach((text, i) => {
          const item = util.el('div', `equipment-rail-item${i === 0 ? ' on' : ''}`, rail);
          const svg = util.svg(
            'svg',
            {
              class: 'equipment-rail-icon',
              viewBox: '0 0 66 66',
              fill: 'none',
              stroke: '#111',
              'stroke-width': '1.7',
              'stroke-linejoin': 'round',
              'aria-hidden': 'true',
            },
            item,
          );
          svg.innerHTML = iconPaths[i];
          util.el('span', '', item, text);
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, iconPaths, rail });
      },
  };

  env.site({
    name: 'design-use-legacy-app-win95-02',
    template: 'site/base',
    design: { parts },
  });
})();
