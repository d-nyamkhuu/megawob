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
      const controls = util.el('div', 'ref-window-controls', windowbar);
      for (const color of ['red', 'yellow', 'green']) util.el('span', `ref-window-dot ref-window-${color}`, controls);
      util.el('div', 'ref-window-title', windowbar, 'Vertex Desktop — Product Information');
      S.frameBrand(_c, header);
      Object.assign(_c, { controls, header, windowbar });
    },
  };

  env.site({
    name: 'design-scroll-page-copy-01',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
