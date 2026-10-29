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
      for (const [k, v] of Object.entries({ bg: '#eef2fb', panel: '#ffffff', fg: '#171b35', muted: '#66718e', line: '#dce3f1' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#5264f5');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'w95-titlebar', header);
      util.el('span', 'w95-appicon', titlebar, '▦');
      util.el('strong', '', titlebar, 'Acme Studio');
      const winbtns = util.el('div', 'w95-window-buttons', titlebar);
      for (const glyph of ['_', '□', '×']) util.el('span', '', winbtns, glyph);
      const menu = util.el('nav', 'w95-menu', header);
      for (const item of ['Home', 'Calendar', 'Projects', 'People', 'Analytics', 'Settings']) {
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
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const rail = util.el('aside', 'calendar-rail', body);
      const create = util.el('button', 'calendar-create', rail, '＋　Create event');
      create.type = 'button';
      const mini = util.el('section', 'calendar-mini', rail);
      const miniHead = util.el('div', 'calendar-mini-head', mini);
      util.el('strong', '', miniHead, 'September 2027');
      const miniNav = util.el('div', 'calendar-mini-nav', miniHead);
      util.el('button', '', miniNav, '‹').type = 'button';
      util.el('button', '', miniNav, '›').type = 'button';
      const miniDays = util.el('div', 'calendar-mini-days', mini);
      for (const day of ['S','M','T','W','T','F','S']) util.el('span', '', miniDays, day);
      const miniDates = util.el('div', 'calendar-mini-dates', mini);
      for (const day of ['29','30','31','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','1','2']) {
        const b = util.el('button', day === '14' ? 'is-today' : '', miniDates, day);
        b.type = 'button';
        if (day === '29' || day === '30' || day === '31' || (miniDates.children.length > 32)) b.classList.add('is-muted');
      }
      const search = util.el('div', 'calendar-search', rail);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search calendars');
      const lists = [['My calendars', [['My events','#4785f2',true],['Team','#39a96b',true],['Client meetings','#8954ed',true],['Holidays','#ff861b',true]]],
        ['Other calendars', [['Design team','#f04d68',true],['Engineering','#f2bb00',true],['Marketing','#09a8aa',true],['Product','#ffffff',false],['Facilities','#ffffff',false]]]];
      for (const [title, entries] of lists) {
        const group = util.el('section', 'calendar-list', rail);
        const h = util.el('div', 'calendar-list-title', group, title);
        if (title === 'Other calendars') util.el('span', '', h, '＋');
        for (const [label, color, checked] of entries) {
          const row = util.el('label', 'calendar-list-row', group);
          const box = util.el('input', '', row); box.type = 'checkbox'; box.checked = checked;
          box.style.setProperty('--cal-color', color);
          util.el('span', '', row, label);
        }
      }
      Object.assign(_c, { create, lists, mini, miniDates, miniDays, miniHead, miniNav, rail, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const calendarControls = util.el('div', 'calendar-card-controls', body);
      const dateNav = util.el('div', 'calendar-date-nav', calendarControls);
      for (const label of ['‹', 'Today', '›']) {
        const b = util.el('button', '', dateNav, label);
        b.type = 'button';
      }
      const monthSelect = util.el('button', 'calendar-month-select', calendarControls, 'September 2027');
      monthSelect.type = 'button';
      util.el('span', 'calendar-month-chevron', monthSelect, '⌄');
      const viewTabs = util.el('div', 'calendar-view-tabs', calendarControls);
      for (const label of ['Day', 'Week', 'Month']) {
        const b = util.el('button', label === 'Month' ? 'is-active' : '', viewTabs, label);
        b.type = 'button';
      }
      const weekdays = util.el('div', 'calendar-weekday-header', body);
      for (const label of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) util.el('span', '', weekdays, label);
      const firstWeekDates = util.el('div', 'calendar-firstweek-dates', body);
      for (const [i, label] of ['29', '30', '31', '1', '2', '3', '4'].entries()) {
        util.el('span', i < 3 ? 'is-muted' : '', firstWeekDates, label);
      }
      const teamStrip = util.el('div', 'w95-team-strip', document.body);
      const teamTitle = util.el('div', 'w95-strip-title', teamStrip, 'Team availability  ⓘ\nSep 14, 2027');
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
      for (const [person, color] of [['Alex Chen','#39a96b'],['Jamie Diaz','#2468ef'],['Morgan Lee','#ff861b'],['Taylor Kim','#8954ed'],['Jordan Park','#f04d68']]) check(people, person, color);
      const zones = util.el('div', 'w95-zones', teamStrip);
      util.el('span', 'w95-strip-title', zones, 'Time Zones');
      const zoneChecks = util.el('div', 'w95-zone-items', zones);
      for (const zone of ['PDT　 Los Angeles', 'EDT　 New York', 'BST　 London']) {
        const item = util.el('label', 'w95-check', zoneChecks);
        const box = util.el('input', '', item); box.type = 'checkbox'; box.checked = true;
        util.el('span', '', item, zone);
      }
      Object.assign(_c, { calendarControls, check, dateNav, firstWeekDates, monthSelect, people, stage, teamStrip, teamTitle, viewTabs, weekdays, zoneChecks, zones });
    },
  };

  env.site({
    name: 'design-use-calendar-month-04',
    template: 'site/base',
    design: { parts },
  });
})();
