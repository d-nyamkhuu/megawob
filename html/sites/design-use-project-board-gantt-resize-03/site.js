// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      // Keep the app's pale blue 2020 utility palette across episode themes.
      root.style.setProperty('--bg', '#e7eff5');
      root.style.setProperty('--panel', '#f4f8fc');
      root.style.setProperty('--fg', '#0a1955');
      root.style.setProperty('--muted', '#506b9d');
      root.style.setProperty('--line', '#d7e3f0');
      root.style.setProperty('--accent', '#258eff');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
  };

  env.site({
    name: 'design-use-project-board-gantt-resize-03',
    template: 'site/base',
    design: { parts },
  });
})();
