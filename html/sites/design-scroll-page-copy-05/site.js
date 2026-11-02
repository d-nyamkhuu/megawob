// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#e5eaee', panel: '#ffffff', fg: '#0d0c24', muted: '#748195', line: '#d7dee5' },
    dark: { bg: '#15171c', panel: '#20232b', fg: '#e8eaf0', muted: '#9aa1ad', line: '#3a3f4b' },
    warm: { bg: '#f6f1e8', panel: '#fffaf2', fg: '#2b2118', muted: '#7d6b58', line: '#e2d6c3' },
  };

  const ACCENTS = ['#006dff', '#006dff', '#006dff', '#006dff', '#006dff', '#006dff'];

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      name = 'light';
      accent = '#006dff';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowbar = util.el('div', 'ref-windowbar', header);
      util.el('span', 'ref-app-icon', windowbar, '◈');
      const controls = util.el('div', 'ref-window-controls', windowbar);
      [['green','–'],['yellow','□'],['red','×']].forEach(([color, glyph]) => util.el('span', `ref-window-dot ref-window-${color}`, controls, glyph));
      util.el('div', 'ref-window-title', windowbar, 'Support Center - Acme Electronics');
      const menu = util.el('nav', 'carbon-menu', header);
      ['File', 'Edit', 'View', 'Tools', 'Actions', 'Help'].forEach(x => util.el('span', '', menu, x));
      const toolbar = util.el('div', 'carbon-toolbar', header);
      const toolIcons = [
        ['New Ticket', '<path fill="#e7edf2" stroke="#51687b" d="M4 2h12l5 5v16H4z"/><path fill="#a7c9df" d="M16 2v5h5z"/><path fill="#2d80bb" d="M10 11h5v3h3v4h-3v3h-5v-3H7v-4h3z"/>'],
        ['Open', '<path fill="#b4d9ed" stroke="#506b86" d="M2 6h8l2 2h10v12H2z"/><path fill="#4388be" stroke="#285276" d="M2 10h21l-3 12H1z"/>'],
        ['Reply', '<path fill="#a9cbdf" stroke="#5a778b" d="M11 3L2 11l9 8v-5c7-1 10 3 11 7 0-9-4-13-11-13z"/>'],
        ['Forward', '<path fill="#e8edf2" stroke="#60788b" d="M3 2h12l5 5v16H3z"/><path fill="#9abfd7" d="M15 2v5h5z"/><path fill="#398cc4" stroke="#27618c" d="M9 14h7v-4l7 6-7 6v-4H9z"/>'],
        ['Print', '<path fill="#e3e8eb" stroke="#667c8a" d="M6 2h12v7H6z"/><path fill="#788e9d" stroke="#536776" d="M3 9h18v10H3z"/><path fill="#fff" stroke="#687b88" d="M6 16h12v7H6z"/><circle cx="18" cy="12" r="1" fill="#cce7ef"/>'],
      ];
      toolIcons.forEach(([label,icon]) => {
        const b = util.el('div', 'carbon-tool', toolbar);
        const glyph = util.el('span', 'carbon-icon', b);
        glyph.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;
        util.el('span', '', b, label);
      });
      Object.assign(_c, { controls, header, windowbar });
      document.addEventListener('pointerover', (event) => {
        const code = event.target.closest && event.target.closest('.ps-code');
        if (!code) return;
        const field = document.querySelector('.ps-input');
        if (!field) return;
        field.value = code.textContent.trim();
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
      Object.assign(_c, { controls, header, windowbar });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, windowbar, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', windowbar, ctx.instruction);
      else util.el('div', 'ref-spacer', _c.header);
    },
  };

  env.site({
    name: 'design-scroll-page-copy-05',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
