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
      root.style.setProperty('--accent', accent);
      // This reference design uses one cool gray Bootstrap-era palette across episodes.
      root.style.setProperty('--bg', '#eef1f4');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--fg', '#171e2c');
      root.style.setProperty('--muted', '#8993a3');
      root.style.setProperty('--line', '#c5cdd8');
      root.style.setProperty('--accent', '#0865cd');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
      const brand = util.el('div', 'ref-brand', header, 'Company Records');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      Object.assign(_c, { stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-recall-info-crossref-01',
    template: 'site/base',
    design: { parts },
  });
})();
