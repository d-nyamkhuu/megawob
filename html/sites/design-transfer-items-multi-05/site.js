// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) => function (_c) {
      const { body, display, endBtn, header, H, label, placement, util } = _c;
      let { submit } = _c;
      document.body.classList.add('report-designer');
      if (H < 900) document.body.classList.add('rd-short');
      header.classList.add('rd-titlebar');
      if (display === 'header') {
        header.classList.add('rd-instructed');
        util.el('div', 'rd-header-note', header, _c.ctx.instruction);
      }
      util.el('span', 'rd-appicon', header, '▦');
      util.el('strong', 'rd-title', header, 'Sales Reporting　—　Report Designer');
      const win = util.el('div', 'rd-window', header);
      for (const t of ['−', '□', '×']) util.el('span', '', win, t);

      const menus = util.el('nav', 'rd-menubar', document.body);
      menus.setAttribute('aria-label', 'Application menu');
      for (const t of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Reports', 'Window', 'Help']) util.el('span', '', menus, t);
      const bar = util.el('div', 'rd-toolbar', document.body);
      const icons = [
        '<path d="M4 1h9l5 5v17H4z"/><path d="M13 1v6h5M7 12h8M7 16h8"/>',
        '<path d="M2 7h8l2 2h10v11H2z"/><path d="M2 7V5h7l2 2"/>',
        '<path d="M2 6h20v15H2z"/><path d="M5 8h14v10H5zM7 20h10"/>',
        '<path d="m6 3 15 18M19 3 4 21M7 4l3 3M16 17l3 3"/>',
        '<path d="M3 2h12l6 6v14H3z"/><path d="M15 2v7h6M6 13h12M6 17h12"/>',
        '<path d="M5 2h12l4 4v16H5z"/><path d="M8 3v6h9V3M8 14h10M8 18h10"/>',
        '<path d="M8 7 3 12l5 5M4 12h13a5 5 0 0 1 5 5"/>',
        '<path d="m16 7 5 5-5 5M20 12H7a5 5 0 0 0-5 5"/>',
        '<path d="M2 3h20v18H2zM2 9h20M9 3v18M15 9v12"/>',
        '<path d="M3 21V3M3 21h19M6 17l5-6 4 3 6-8"/><path d="M18 6h3v3"/>'
      ];
      icons.forEach((d, i) => { const x = util.el('span', `rd-tool${[3,6,8].includes(i) ? ' separated' : ''}`, bar); x.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`; });
      if (placement === 'floating') submit = endBtn(bar, 'ref-submit rd-submit', label);
      if (placement === 'header' || placement === 'icon') {
        const tools = header.querySelector('.ref-tools');
        if (tools) { submit = tools.querySelector('.ref-submit'); if (submit) submit.classList.add('rd-submit'); }
      }

      const shell = util.el('div', 'rd-shell', body);
      const sidebar = util.el('section', 'rd-sidebar', shell);
      util.el('h2', 'rd-section', sidebar, 'Reports');
      const table = util.el('div', 'rd-report-table', sidebar);
      const th = util.el('div', 'rd-report-head', table);
      util.el('span', '', th, 'Name'); util.el('span', '', th, 'Type');
      for (const [name, type] of [['Account Summary','Standard'],['Closed Opportunities','Standard'],['Pipeline Forecast','Standard'],['Sales Activity','Standard'],['Lead Analysis','Standard'],['Opportunity Detail','Custom'],['Regional Performance','Standard'],['Top Customers','Standard'],['Win/Loss Analysis','Standard']]) {
        const row = util.el('div', `rd-report-row${name === 'Lead Analysis' ? ' current' : ''}`, table);
        const nameCell = util.el('span', 'rd-report-name', row);
        util.el('span', 'rd-report-icon', nameCell);
        util.el('span', 'rd-report-text', nameCell, name);
        util.el('span', '', row, type);
      }
      const pane = util.el('main', 'rd-main', shell);
      const details = util.el('section', 'rd-details', pane);
      util.el('h2', 'rd-section', details, 'Report Details');
      const form = util.el('div', 'rd-form', details);
      for (const [name, value, cls] of [['Name:', 'Lead Analysis','single'], ['Description:', 'Detailed view of leads and conversion activity.','multi'], ['Report type:', 'Custom','select'], ['Data source:', 'Sales Database','select'], ['Category:', 'Leads','select']]) {
        const field = util.el('div', `rd-field ${cls}`, form); util.el('label', '', field, name); util.el('div', 'rd-value', field, value);
      }
      const tabs = util.el('nav', 'rd-tabs', pane);
      ['1. Data Source','2. Columns','3. Filters','4. Grouping','5. Sorting','6. Preview'].forEach((t, i) => util.el('span', `rd-tab${i === 1 ? ' active' : ''}`, tabs, t));
      pane.appendChild(document.querySelector('.ref-stage'));
      document.querySelector('.ref-body').classList.add('rd-body');
      body.classList.add('rd-body');
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-transfer-items-multi-05',
    template: 'site/base',
    design: { parts },
  });
})();
