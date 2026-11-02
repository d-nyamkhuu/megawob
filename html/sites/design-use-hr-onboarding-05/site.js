// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const ICONS = {
    people: '<circle cx="9" cy="7" r="3"/><path d="M2 20v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6m2 10v-2a6 6 0 0 0-3-5.2"/>',
    home: '<path d="m3 10 9-7 9 7v10H4V10Zm6 10v-7h6v7"/>',
    folder: '<path d="M2 7V5h7l2 2h11v13H2V7Zm0 3h20"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    addperson: '<circle cx="9" cy="7" r="3"/><path d="M2 20v-2a7 7 0 0 1 13-3m4-1v8m-4-4h8"/>',
    recruit: '<circle cx="9" cy="7" r="3"/><path d="M2 20v-2a7 7 0 0 1 11-5m4 0a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm3.5 8.5 2 2"/>',
    team: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M2 20v-2a6 6 0 0 1 12 0v2m3-7a5 5 0 0 1 5 5v2h-5"/>',
    time: '<circle cx="12" cy="12" r="9"/><path d="M12 6v12m-6-6h12"/>',
    directory: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M5 17a4 4 0 0 1 8 0m2-8h4m-4 4h4m-4 4h4"/>',
    reports: '<path d="M3 21V3m0 18h18M7 17v-5h3v5m2 0V7h3v10m2 0V4h3v13"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m10 2-.7 2.2-2 1-2.3-1L2 8l1.7 1.8v4.4L2 16l3 3.8 2.3-1 2 1L10 22h4l.7-2.2 2-1 2.3 1L22 16l-1.7-1.8V9.8L22 8l-3-3.8-2.3 1-2-1L14 2Z"/>',
    plus: '<path d="M12 3v18M3 12h18"/>',
  };
  const icon = (util, parent, cls, name) => {
    const node = util.el('span', cls, parent);
    node.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
    return node;
  };

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      base(_c);
      const { ctx } = _c;
      const { W, H, roomy, tall, display } = _c;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('app-has-header-note', display === 'header');

      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (_c.ctx.finish) return;
      const r = _c.ctx.rng.fork('peoplehub/ending');
      if (r.bool(0.55)) {
        _c.placement = 'footer';
        _c.wantFooter = true;
        _c.label = 'Finish';
      } else {
        _c.placement = r.pick(['header', 'link', 'icon']);
        _c.wantFooter = _c.placement === 'link';
      }
      if (_c.collide && _c.collide.text.toLowerCase() === _c.label.toLowerCase()) {
        _c.collide.text = _c.content.collideLabel(r, _c.label);
      }
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowTitle = util.el('div', 'app-titlebar', header);
      icon(util, windowTitle, 'app-logo', 'team');
      util.el('strong', '', windowTitle, 'PeopleHub');
      util.el('span', 'app-title-sep', windowTitle, '|');
      util.el('span', '', windowTitle, 'Greenfield Tech');
      const windowControls = util.el('span', 'app-window-controls', windowTitle, '–      □      ×');
      const menu = util.el('div', 'app-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'People', 'Recruiting', 'HR', 'Reports', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'app-toolbar', header);
      for (const [glyph, item] of [['plus','New'],['folder','Open'],['search','Search'],['addperson','Add Candidate'],['addperson','Add Employee'],['reports','Reports']]) {
        const tool = util.el('span', 'app-tool', toolbar);
        icon(util, tool, 'app-tool-icon', glyph);
        util.el('span', '', tool, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls, windowTitle });
    },
    'frame.body': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const nav = util.el('aside', 'app-sidebar', body);
      for (const [glyph, label] of [['home','Home'],['people','People'],['recruit','Recruiting'],['team','Onboarding'],['time','Time Off'],['directory','Directory'],['reports','Reports'],['settings','Settings']]) {
        const row = util.el('div', `app-nav-item${label === 'People' ? ' active' : ''}`, nav);
        icon(util, row, 'app-nav-icon', glyph);
        util.el('span', '', row, label);
      }
      const workHead = util.el('div', 'app-workhead', body);
      util.el('strong', 'app-worktitle', workHead, 'People');
      const tabs = util.el('div', 'app-tabs', workHead);
      for (const label of ['Employees','Candidates','Onboarding','Org Chart']) util.el('span', label === 'Employees' ? 'active' : '', tabs, label);
      const search = util.el('div', 'app-search', workHead);
      icon(util, search, 'app-search-icon', 'search');
      util.el('span', '', search, 'Search people, jobs, or keywords...');
      const taskNote = _c.header.querySelector('.ref-instruction');
      if (taskNote) body.appendChild(taskNote);
      const hires = util.el('aside', 'app-filters', body);
      const categories = util.el('div', 'app-filter-card', hires);
      const categoryTitle = util.el('div', 'app-filter-title', categories);
      util.el('span', '', categoryTitle, 'All People');
      util.el('span', '', categoryTitle, '542');
      for (const [label, number] of [['New Hires','8'],['Onboarding','6'],['Active Employees','510'],['On Leave','18'],['Exits','6']]) {
        const row = util.el('div', `app-filter-row${label === 'Onboarding' ? ' active' : ''}`, categories);
        util.el('span', '', row, label); util.el('span', '', row, number);
      }
      const depts = util.el('div', 'app-filter-card app-depts', hires);
      util.el('div', 'app-filter-title', depts, 'Departments');
      for (const [label, number] of [['Engineering','142'],['Product','93'],['Design','64'],['Sales','88'],['People & Culture','32'],['Finance','45'],['Operations','54'],['IT','24']]) {
        const row = util.el('div', 'app-filter-row', depts);
        util.el('span', '', row, label); util.el('span', '', row, number);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, hires });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util, ctx } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const stats = util.el('aside', 'app-stats', body);
      for (const [label, value, suffix] of [['Onboarding','6','in progress'],['New Hires (30 days)','8',''],['Pending Tasks','32',''],['Overdue Tasks','4','']]) {
        const card = util.el('div', 'app-stat-card', stats);
        util.el('div', '', card, label);
        util.el('strong', label === 'Overdue Tasks' ? 'warn' : '', card, value);
        if (suffix) util.el('div', 'app-stat-suffix', card, suffix);
      }
      const recent = util.el('div', 'app-stat-card app-recent', stats);
      util.el('strong', 'app-recent-title', recent, 'Recent Hires');
      for (const [initials, name, role] of [['EB','Emilio Bravo','Software Engineer'],['LC','Lena Chen','Product Designer'],['NR','Noah Ramirez','Sales Associate'],['AS','Aisha Khan','People Operations'],['DW','Daniel Wu','Data Analyst']]) {
        const row = util.el('div', 'app-recent-row', recent);
        util.el('span', 'app-avatar', row, initials);
        const copy = util.el('div', '', row);
        util.el('div', '', copy, name); util.el('small', '', copy, role);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        const stage = document.querySelector('.ref-stage');
        const workspaceHeader = document.querySelector('.app-workhead');
        if (stage && workspaceHeader) {
          result.el.style.setProperty('top', `${stage.getBoundingClientRect().top}px`, 'important');
          result.el.style.setProperty('left', `${workspaceHeader.getBoundingClientRect().left + 14}px`, 'important');
          result.el.style.setProperty('right', '14px', 'important');
        }
      }
      return result;
    },
  };

  env.site({
    name: 'design-use-hr-onboarding-05',
    template: 'site/base',
    design: { parts },
  });
})();
