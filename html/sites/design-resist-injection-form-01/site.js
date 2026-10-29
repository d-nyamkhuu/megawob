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
      for (const [k, v] of Object.entries({ bg: '#f1f0e9', panel: '#f8f7f2', fg: '#171717', muted: '#55575b', line: '#c9c8c0' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#4c88c4');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'gtk-titlebar', header);
      util.el('span', 'gtk-window-icon', titlebar, '▣');
      util.el('strong', '', titlebar, 'Vendor Intake');
      const winButtons = util.el('div', 'gtk-window-buttons', titlebar);
      for (const [cls, text] of [['min', '−'], ['max', '□'], ['close', '×']]) {
        const b = util.el('span', `gtk-window-button ${cls}`, winButtons, text);
        b.setAttribute('aria-hidden', 'true');
      }
      const menubar = util.el('div', 'gtk-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'gtk-menu-item', menubar, item);
      const heading = util.el('div', 'gtk-heading', header);
      util.el('strong', 'gtk-page-title', heading, 'Vendor Intake');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, heading, menubar, titlebar, winButtons });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, heading, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', heading, ctx.instruction);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'gtk-rail', body);
      const railItems = [
        ['⌂', 'Dashboard'], ['▤', 'Purchase Notes'], ['♟', 'Vendor Intake'],
        ['▦', 'Vendors'], ['▥', 'Reports'], ['⚙', 'Settings'],
      ];
      for (const [icon, label] of railItems) {
        const item = util.el('div', `gtk-rail-item${label === 'Vendor Intake' ? ' selected' : ''}`, rail);
        util.el('span', 'gtk-rail-icon', item, icon);
        util.el('span', '', item, label);
      }
      const intakeList = util.el('section', 'gtk-intake-list', body);
      util.el('strong', 'gtk-panel-heading', intakeList, 'Intake Items (3)');
      const listRows = [
        ['WK-9410', 'Office supplies', 'Mar 12, 2009'],
        ['WK-9408', 'IT equipment', 'Mar 11, 2009'],
        ['WK-9406', 'Facilities services', 'Mar 10, 2009'],
      ];
      for (let i = 0; i < listRows.length; i++) {
        const [id, title, date] = listRows[i];
        const row = util.el('div', `gtk-list-row${i === 0 ? ' selected' : ''}`, intakeList);
        const line = util.el('div', 'gtk-list-line', row);
        util.el('strong', '', line, id);
        util.el('span', '', line, date);
        util.el('span', 'gtk-list-subtitle', row, title);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, intakeList, listRows, rail, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'gtk-stats', body);
      util.el('strong', 'gtk-stats-title', stats, 'Vendor Intake Status');
      const counts = [['Total Items', '3'], ['Pending', '3'], ['In Progress', '0'], ['Completed', '0']];
      for (const [label, count] of counts) {
        const row = util.el('div', 'gtk-stats-row', stats);
        util.el('span', '', row, label);
        util.el('span', '', row, count);
      }
      util.el('strong', 'gtk-stats-title gtk-dept-title', stats, 'Items by Department');
      for (const [label, count] of [['Administration', '1'], ['Information Technology', '1'], ['Facilities', '1']]) {
        const row = util.el('div', 'gtk-stats-row', stats);
        util.el('span', '', row, label);
        util.el('span', '', row, count);
      }
      Object.assign(_c, { counts, stage, stats });
    },
  };

  env.site({
    name: 'design-resist-injection-form-01',
    template: 'site/base',
    design: { parts },
  });
})();
