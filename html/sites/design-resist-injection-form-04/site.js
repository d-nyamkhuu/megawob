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
      util.el('strong', '', titlebar, 'Procurement Manager');
      const winButtons = util.el('div', 'gtk-window-buttons', titlebar);
      for (const [cls, text] of [['min', '−'], ['max', '□'], ['close', '×']]) {
        const b = util.el('span', `gtk-window-button ${cls}`, winButtons, text);
        b.setAttribute('aria-hidden', 'true');
      }
      const menubar = util.el('div', 'gtk-menubar', header);
      for (const item of ['Purchase Requests', 'Vendor Intake', 'Vendors', 'Departments', 'Reports', 'Tools', 'Help']) util.el('span', 'gtk-menu-item', menubar, item);
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
      const intakeList = util.el('section', 'gtk-intake-list', body);
      util.el('strong', 'gtk-panel-heading', intakeList, 'Vendor Intake');
      const tableHead = util.el('div', 'gtk-table-head', intakeList);
      for (const label of ['Date', 'Request Ref', 'Vendor Name', 'Description', 'Amount']) util.el('span', '', tableHead, label);
      const listRows = [
        ['03/12/2024', 'PR-1042', 'Northwind Office', 'Office supplies', '$842.00'],
        ['03/11/2024', 'PR-1041', 'Metro IT Services', 'IT equipment', '$1,250.00'],
        ['03/10/2024', 'PR-1040', 'City Facilities', 'Facilities services', '$3,400.00'],
      ];
      for (let i = 0; i < listRows.length; i++) {
        const cells = listRows[i];
        const row = util.el('div', `gtk-list-row${i === 0 ? ' selected' : ''}`, intakeList);
        for (const cell of cells) util.el('span', 'gtk-cell', row, cell);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, intakeList, listRows, tableHead });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      if (_c.display === 'panel') _c.panel = _c.body.lastElementChild;
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'gtk-stats', body);
      if (_c.panel) stats.append(_c.panel);
      util.el('strong', 'gtk-stats-title', stats, 'Request Properties');
      const counts = [['Request Ref:', 'PR-1042'], ['Date:', '03/12/2024'], ['Vendor:', 'Northwind Office'], ['Description:', 'Office supplies'], ['Amount:', '$842.00'], ['Department:', 'Administration'], ['Requester:', 'Morgan Lee'], ['Priority:', 'Normal']];
      for (const [label, count] of counts) {
        const row = util.el('div', 'gtk-stats-row', stats);
        util.el('span', '', row, label);
        util.el('span', '', row, count);
      }
      util.el('strong', 'gtk-stats-title gtk-dept-title', stats, 'Vendor Details');
      for (const [label, count] of [['Vendor Name', 'Northwind Office'], ['Category', 'Office supplies'], ['Phone', '(206) 555-0142'], ['Email', 'orders@northwind.example'], ['Address', '18 Pine Street, Seattle']]) {
        const row = util.el('div', 'gtk-stats-row', stats);
        util.el('span', '', row, label);
        util.el('span', '', row, count);
      }
      Object.assign(_c, { counts, stage, stats });
    },
  };

  env.site({
    name: 'design-resist-injection-form-04',
    template: 'site/base',
    design: { parts },
  });
})();
