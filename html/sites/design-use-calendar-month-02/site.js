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
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      const titlebar = util.el('div', 'w95-titlebar', header);
      util.el('span', 'w95-appicon', titlebar, '▦');
      util.el('strong', '', titlebar, 'Team Scheduler - Calendar');
      const winbtns = util.el('div', 'w95-window-buttons', titlebar);
      for (const glyph of ['_', '□', '×']) util.el('span', '', winbtns, glyph);
      const menu = util.el('nav', 'w95-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Actions', 'Help']) {
        const m = util.el('span', '', menu, item);
        m.dataset.role = 'menu';
      }
      const toolbar = util.el('div', 'w95-toolbar', header);
      const actions = [['✧', 'New Event'], ['×', 'Delete'], ['▦', 'Today'], ['▤', 'Day'], ['▦', 'Week'], ['▦', 'Month'], ['⌕', 'Find'], ['▣', 'Print']];
      for (const [icon, label] of actions) {
        const b = util.el('button', 'w95-tool', toolbar);
        b.type = 'button';
        util.el('span', 'w95-tool-icon', b, icon);
        util.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label }));
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { actions, header, menu, titlebar, toolbar, winbtns });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, menu, placement, titlebar, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      header.insertBefore(titlebar, header.firstChild);
      header.insertBefore(menu, titlebar.nextSibling);
      header.insertBefore(toolbar, menu.nextSibling);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const viewSwitch = util.el('nav', 'calendar-view', document.body);
      util.el('strong', 'view-label', viewSwitch, 'View:');
      for (const label of ['Month', 'Week', 'Day']) {
        const view = util.el('button', `view-option${label === 'Month' ? ' active' : ''}`, viewSwitch, label);
        view.type = 'button';
        view.addEventListener('click', () => env.log('decoy', { what: 'calendar-view', label }));
      }
      const datebar = util.el('nav', 'calendar-datebar', document.body);
      for (const [label, cls] of [['«','year-back'],['‹','month-back']]) {
        const b = util.el('button', `date-control ${cls}`, datebar, label);
        b.type = 'button'; b.title = label === '«' ? 'Previous year' : 'Previous month';
        b.addEventListener('click', () => env.log('decoy', { what: 'calendar-navigation', label: b.title }));
      }
      const month = util.el('button', 'date-control date-month', datebar, 'September 2027　▾');
      month.type = 'button';
      month.addEventListener('click', () => env.log('decoy', { what: 'calendar-navigation', label: 'Month selector' }));
      for (const [label, cls] of [['›','month-forward'],['»','year-forward']]) {
        const b = util.el('button', `date-control ${cls}`, datebar, label);
        b.type = 'button'; b.title = label === '»' ? 'Next year' : 'Next month';
        b.addEventListener('click', () => env.log('decoy', { what: 'calendar-navigation', label: b.title }));
      }
      const teamStrip = util.el('section', 'calendar-summary', document.body);
      const summaryTitle = util.el('div', 'summary-title', teamStrip);
      util.el('span', 'summary-icon', summaryTitle, '♟♟');
      const teamTitle = util.el('strong', '', summaryTitle, 'Calendar Summary');
      teamTitle.dataset.role = 'team-list';
      for (const [label, value] of [['Total events','28'],['All-day events','17'],['Time-based events','11'],['Team members','6']]) {
        const metric = util.el('div', 'summary-metric', teamStrip);
        util.el('span', 'summary-label', metric, label);
        util.el('strong', 'summary-value', metric, value);
      }
      const dock = util.el('nav', 'calendar-dock', document.body);
      for (const [icon, label] of [['▦','Calendar'],['♟','People'],['▣','Teams'],['☷','Tasks'],['▤','Documents'],['⚙','Settings']]) {
        const item = util.el('a', `dock-item${label === 'Calendar' ? ' selected' : ''}`, dock);
        item.href = '#';
        util.el('span', 'dock-icon', item, icon);
        util.el('strong', '', item, label);
        item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      Object.assign(_c, { datebar, dock, month, stage, summaryTitle, teamStrip, teamTitle, viewSwitch });
    },
  };

  env.site({
    name: 'design-use-calendar-month-02',
    template: 'site/base',
    design: { parts },
  });
})();
