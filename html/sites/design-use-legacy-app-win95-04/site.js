// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
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
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Reference-style read-only record summary rail. It is decorative; the task's live
      // editor and its anchors remain owned by the task widget.
      const summary = util.el('aside', 'legacy-summary', body);
      util.el('div', 'legacy-summary-title', summary, 'Record Summary');
      const summaryCard = (title, rows) => {
        const card = util.el('section', 'legacy-summary-card', summary);
        util.el('div', 'legacy-summary-head', card, title);
        for (const [label, value] of rows) {
          const row = util.el('div', 'legacy-summary-row', card);
          util.el('span', '', row, label);
          util.el('span', '', row, value);
        }
      };
      summaryCard('Total Records', [['All Records', '156'], ['Active', '132'], ['Inactive', '24']]);
      summaryCard('Records by Type', [['Workstation', '56'], ['Server', '18'], ['Printer', '24'],
        ['Network Device', '20'], ['Other', '38']]);
      summaryCard('Records by Cost Center', [['1000 - Corporate', '28'], ['1100 - IT', '26'],
        ['1200 - Administration', '18'], ['2100 - Human Resources', '16'], ['2200 - Finance', '24'],
        ['3100 - Facilities', '22'], ['3200 - Operations', '22']]);
      Object.assign(_c, { stage, summary, summaryCard });
    },
  };

  env.site({
    name: 'design-use-legacy-app-win95-04',
    template: 'site/base',
    design: { parts },
  });
})();
