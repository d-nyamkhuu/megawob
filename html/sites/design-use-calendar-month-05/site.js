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
      // The reference design is a fixed Windows desktop palette; retain draws above for stable episode streams.
      for (const [k, v] of Object.entries({ bg: '#c0c0c0', panel: '#c0c0c0', fg: '#080808', muted: '#555555', line: '#808080' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#000080');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'w95-titlebar', header);
      util.el('span', 'w95-appicon', titlebar, '▦');
      util.el('strong', '', titlebar, 'Team Calendar');
      const winbtns = util.el('div', 'w95-window-buttons', titlebar);
      for (const glyph of ['_', '□', '×']) util.el('span', '', winbtns, glyph);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, titlebar, winbtns });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const info = util.el('section', 'paper-info', body);
      const mini = util.el('div', 'paper-mini', info);
      util.el('h2', '', mini, 'March 2027');
      const miniNav = util.el('div', 'paper-mini-nav', mini);
      util.el('button', '', miniNav, '◀'); util.el('span', '', miniNav, 'March 2027'); util.el('button', '', miniNav, '▶');
      const miniGrid = util.el('div', 'paper-mini-grid', mini);
      for (const d of ['Su','Mo','Tu','We','Th','Fr','Sa','28','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','1','2','3']) util.el('span', '', miniGrid, d);
      const teamStrip = util.el('div', 'w95-team-strip', info);
      const teamTitle = util.el('h2', 'w95-strip-title', teamStrip, 'Team Members');
      teamTitle.dataset.role = 'team-list';
      const people = util.el('div', 'w95-people', teamStrip);
      const check = (parent, label, color) => {
        const item = util.el('label', 'w95-check', parent);
        const box = util.el('input', '', item);
        box.type = 'checkbox'; box.checked = true;
        util.el('span', 'w95-color-chip', item).style.background = color;
        util.el('span', '', item, label);
      };
      for (const [person, color] of [['Alex Rivera','#d0d0ce'],['Blake Chen','#858584'],['Casey Park','#b3b3b1'],['Devon Lane','#858584'],['Jamie Patel','#d0d0ce']]) check(people, person, color);
      const legend = util.el('div', 'paper-legend', info);
      util.el('h2', '', legend, 'Event Types');
      for (const [label, cls] of [['All-day event','all-day'],['Team meeting','meeting'],['Client meeting','client'],['Project work','project'],['Travel','travel']]) {
        const row = util.el('div', 'paper-legend-row', legend);
        util.el('span', `paper-swatch ${cls}`, row); util.el('span', '', row, label);
      }
      const summary = util.el('div', 'paper-summary', info);
      util.el('h2', '', summary, 'Summary – March 2027');
      for (const [label, value] of [['Total events','26'],['All-day events','8'],['Team meetings','9'],['Client meetings','5'],['Project work','3'],['Travel','1']]) {
        const row = util.el('div', 'paper-summary-row', summary); util.el('span', '', row, label); util.el('span', '', row, value);
      }
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { check, info, mini, people, stage, teamStrip, teamTitle });
    },
  };

  env.site({
    name: 'design-use-calendar-month-05',
    template: 'site/base',
    design: { parts },
  });
})();
