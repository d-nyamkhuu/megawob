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
      // This design is the dark developer calendar in the reference image.
      name = 'dark';
      accent = '#63ee72';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = 'Team Scheduler';
        const brand = util.el('div', 'ref-brand', header, title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'calendar-dock', document.body);
      const dockItems = [['', 'Day'], ['', 'Week'], ['', 'Month'], ['', 'Team'], ['', 'Availability']];
      for (const [icon, text] of dockItems) {
        const item = util.el('div', `calendar-dock-item${text === 'Week' ? ' active' : ''}`, dock);
        util.el('span', 'calendar-dock-icon', item, icon);
        util.el('span', '', item, text);
      }
      const dockTools = util.el('div', 'calendar-dock-tools', dock);
      util.el('span', '', dockTools, '⌕');
      util.el('span', '', dockTools, '♧');
      util.el('span', '', dockTools, '⚙');
      Object.assign(_c, { dock, dockItems, dockTools, stage });
    },
  };

  env.site({
    name: 'design-use-calendar-move-02',
    template: 'site/base',
    design: { parts },
  });
})();
