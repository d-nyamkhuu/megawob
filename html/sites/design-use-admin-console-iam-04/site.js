// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Northstar IT Administration'];

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
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      // This design is consistently the 2006 Northstar sky-glass identity portal.
      // Keep the theme draws above for seeded episode stability, while fixing its visual palette.
      for (const [k, v] of Object.entries({ bg: '#dff6ff', panel: '#ffffff', fg: '#12366c', muted: '#52698e', line: '#b5dcf7' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#078bd4');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
  };

  env.site({
    name: 'design-use-admin-console-iam-04',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
