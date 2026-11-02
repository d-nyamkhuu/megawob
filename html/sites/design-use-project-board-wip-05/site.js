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
      // Fixed Qt Plastik palette; retain the seeded theme draws above for stable episode streams.
      Object.entries({ bg: '#e7ebf2', panel: '#f5f7fa', fg: '#0b1026', muted: '#536176', line: '#adbaca', accent: '#3b8fe8' })
        .forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { ctx, display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'qt-titlebar', header);
      util.el('span', 'qt-appicon', titlebar, '▤');
      util.el('strong', 'qt-title', titlebar, 'Project Planner');
      const winbuttons = util.el('div', 'qt-winbuttons', titlebar);
      for (const symbol of ['–', '□', '×']) util.el('span', 'qt-winbutton', winbuttons, symbol);
      const menubar = util.el('nav', 'qt-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Task', 'Project', 'Schedule', 'Window', 'Help']) {
        const a = util.el('a', 'qt-menuitem', menubar, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }
      const toolbar = util.el('nav', 'qt-toolbar', header);
      for (const [icon, label] of [['▯','New'],['▱','Open'],['▤','Print'],['＋','Add Task'],['◇','Add Milestone'],['🔗','Link Tasks'],['⌕＋','Zoom In'],['⌕−','Zoom Out'],['▦','Today']]) {
        const item = util.el('div', 'qt-tool', toolbar);
        util.el('span', 'qt-tool-icon', item, icon);
        util.el('span', 'qt-tool-label', item, label);
      }
      const inspector = util.el('aside', 'qt-inspector', header);
      util.el('h2', '', inspector, 'Project');
      const fields = [['Name:','Atlas Release'],['Start:','Apr 1, 1984'],['End:','Apr 30, 1984'],['Status:','On track']];
      for (const [label, value] of fields) { const row = util.el('div','qt-field',inspector); util.el('span','',row,label); util.el('div','qt-value',row,value); }
      util.el('hr','',inspector);
      util.el('h2','',inspector,'Selected Item');
      for (const label of ['Name:','Type:','Team:','Status:','Start:','Duration:','Depends on:']) { const row=util.el('div','qt-field',inspector); util.el('span','',row,label); util.el('div','qt-value',row,label==='Name:'?'None':'—'); }
      util.el('div','qt-description-label',inspector,'Description:');
      util.el('div','qt-description',inspector,'');
      const timeline = util.el('section','qt-timeline',header);
      util.el('h2','',timeline,'Timeline');
      const table = util.el('div','qt-time-table',timeline);
      const head = util.el('div','qt-time-head',table);
      util.el('div','qt-time-name',head,'Task Name'); util.el('div','',head,'Team'); util.el('div','',head,'Start'); util.el('div','',head,'Duration');
      const chart = util.el('div','qt-chart',head); util.el('strong','',chart,'April 1984'); util.el('div','qt-days',chart,'1　　　5　　　10　　　15　　　20　　　25　　　30');
      const rows = [['Analytics dashboard','Web','Apr 3','8 days',5,15],['Mobile polish','Mobile','Apr 5','10 days',7,21],['Prototype review','Design','Apr 10','5 days',15,25],['Component library','Frontend','Apr 12','8 days',19,34],['Locale fallback','Infrastructure','Apr 18','7 days',34,53],['Payment flow','Backend','Apr 20','6 days',42,61]];
      for (const r of rows) { const row=util.el('div','qt-time-row',table); for (let i=0;i<4;i++) util.el('div',i===0?'qt-time-name':'',row,r[i]); const track=util.el('div','qt-time-track',row); const bar=util.el('i','',track); bar.style.left=`${r[4]}%`; bar.style.width=`${r[5]-r[4]}%`; }
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      Object.assign(_c, { header, menubar, titlebar, winbuttons });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-project-board-wip-05',
    template: 'site/base',
    design: { parts },
  });
})();
