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
      for (const [k, v] of Object.entries({ bg: '#f5f6f7', panel: '#ffffff', fg: '#20242b', muted: '#727985', line: '#dfe2e6' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#1684ee');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
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
      const calToolbar = util.el('div', 'cal-toolbar', header);
      const today = util.el('button', 'cal-today', calToolbar, 'Today');
      today.type = 'button';
      const prev = util.el('button', 'cal-arrow', calToolbar, '‹');
      prev.type = 'button';
      const next = util.el('button', 'cal-arrow', calToolbar, '›');
      next.type = 'button';
      util.el('strong', 'cal-month-title', calToolbar, 'March 2027');
      const views = util.el('div', 'cal-views', calToolbar);
      for (const view of ['Day', 'Week', 'Month', 'Agenda']) {
        const b = util.el('button', view === 'Month' ? 'active' : '', views, view); b.type = 'button';
      }
      const search = util.el('div', 'cal-search', calToolbar);
      util.el('span', '', search, '⌕');
      util.el('span', 'cal-search-placeholder', search, 'Search');
      S.frameBrand(_c, header);
      Object.assign(_c, { actions, calToolbar, header, menu, next, prev, search, titlebar, today, toolbar, views, winbtns });
    },
    'frame.tools': (base, S) => function (_c) {
      const { calToolbar, collide, decoyBtn, decoys, endBtn, header, label, menu, placement, titlebar, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      header.insertBefore(titlebar, header.firstChild);
      header.insertBefore(calToolbar, titlebar.nextSibling);
      header.insertBefore(menu, calToolbar.nextSibling);
      header.insertBefore(toolbar, menu.nextSibling);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'cal-app-rail', body);
      for (const [icon, label] of [['▦','Calendar'], ['♟','People'], ['✓','Tasks'], ['▤','Notes']]) {
        const item = util.el('div', label === 'Calendar' ? 'cal-rail-item selected' : 'cal-rail-item', rail);
        util.el('span', 'cal-rail-icon', item, icon);
        util.el('span', 'cal-rail-label', item, label);
      }
      const list = util.el('aside', 'cal-list-panel', body);
      util.el('strong', 'cal-list-heading', list, 'My Calendars');
      const listRow = (label, color, checked) => {
        const row = util.el('div', 'cal-list-row', list);
        util.el('span', checked ? 'cal-check checked' : 'cal-check', row, checked ? '✓' : '');
        util.el('span', 'cal-color', row).style.background = color;
        util.el('span', '', row, label);
      };
      listRow('Personal', '#9b59b6', false);
      listRow('Work', '#1684ee', true);
      listRow('Team', '#32a852', true);
      listRow('Holidays', '#f5a623', true);
      util.el('div', 'cal-list-subhead', list, 'Shared Calendars');
      for (const [label, color] of [['Engineering','#78c9e8'],['Design','#a66ac4'],['Marketing','#ed7b82'],['Product','#f2bb39']]) listRow(label, color, true);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, list, listRow, rail });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const teamStrip = util.el('div', 'w95-team-strip', document.body);
      const teamTitle = util.el('div', 'w95-strip-title', teamStrip, 'Team Members');
      teamTitle.dataset.role = 'team-list';
      const people = util.el('div', 'w95-people', teamStrip);
      const check = (parent, label, color) => {
        const item = util.el('label', 'w95-check', parent);
        const box = util.el('input', '', item);
        box.type = 'checkbox'; box.checked = true;
        util.el('span', 'w95-color-chip', item).style.background = color;
        util.el('span', '', item, label);
      };
      check(people, 'All Team Members', '#c0c0c0');
      for (const [person, color] of [['Alex Chen','#1664e8'],['Brooke Davis','#14b866'],['Chris Patel','#fb5868'],['Dana Kim','#ffd23f'],['Elliot Park','#a855ef'],['Francis Lopez','#ff8629'],['Grace Ng','#10b9aa']]) check(people, person, color);
      const zones = util.el('div', 'w95-zones', teamStrip);
      util.el('span', 'w95-strip-title', zones, 'Time Zones');
      const zoneChecks = util.el('div', 'w95-zone-items', zones);
      for (const zone of ['Pacific Time (PT)', 'Eastern Time (ET)']) {
        const item = util.el('label', 'w95-check', zoneChecks);
        const box = util.el('input', '', item); box.type = 'checkbox'; box.checked = true;
        util.el('span', '', item, zone);
      }
      Object.assign(_c, { check, people, stage, teamStrip, teamTitle, zoneChecks, zones });
    },
  };

  env.site({
    name: 'design-use-calendar-month-03',
    template: 'site/base',
    design: { parts },
  });
})();
