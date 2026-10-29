// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('helpdesk-window');
      const titlebar = util.el('div', 'app-titlebar', header);
      util.el('span', 'app-mark', titlebar, '✣');
      util.el('strong', 'app-name', titlebar, 'HelpDesk Pro');
      const windowControls = util.el('div', 'window-controls', titlebar);
      util.el('span', '', windowControls, '−');
      util.el('span', '', windowControls, '□');
      util.el('span', '', windowControls, '×');
      const menu = util.el('nav', 'app-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Tickets', 'Reports', 'Tools', 'Help']) {
        const a = util.el('a', 'app-menuitem', menu, item);
        a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, titlebar, windowControls });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools app-toolbar', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('irix-desktop');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const main = util.el('div', 'helpdesk-main', body);
      const workarea = util.el('div', 'helpdesk-workarea', main);
      const stage = util.el('main', 'ref-stage', workarea);
      S.frameAlign(_c, stage);
      const dashboard = util.el('section', 'helpdesk-dashboard-lower', main);
      const activity = util.el('div', 'helpdesk-dashboard-card helpdesk-activity', dashboard);
      util.el('strong', '', activity, 'Recent Activity');
      for (const [line, time, tint] of [
        ['Priya Shah updated TKT-1002', '10 minutes ago', 'blue'],
        ['Marcus Tan commented on TKT-1009', '1 hour ago', 'purple'],
        ['Elena Garcia assigned TKT-1005 to Sam Lee', '2 hours ago', 'green'],
        ['Daniel Kim closed TKT-0998', '3 hours ago', 'gray'],
      ]) {
        const row = util.el('div', 'helpdesk-activity-row', activity);
        util.el('i', tint, row, 'E');
        util.el('span', '', row, line);
        util.el('small', '', row, time);
      }
      const customers = util.el('div', 'helpdesk-dashboard-card helpdesk-customers', dashboard);
      util.el('strong', '', customers, 'Top Customers');
      for (const [label, width, count] of [['Acme Corp', 64, 12], ['Beta Industries', 39, 9], ['Global Media', 31, 8], ['Delta Systems', 27, 6], ['Jupiter Partners', 22, 5]]) {
        const row = util.el('div', 'helpdesk-customer-row', customers);
        util.el('span', '', row, label);
        const track = util.el('i', '', row);
        util.el('b', '', track).style.width = `${width}%`;
        util.el('span', '', row, String(count));
      }
      const summary = util.el('aside', 'helpdesk-summary', workarea);
      for (const [label, value, glyph, tone] of [['Open Tickets', '8', '▣', 'blue'], ['In Progress', '3', '◷', 'amber'], ['Closed Today', '6', '✓', 'green']]) {
        const metric = util.el('div', 'helpdesk-metric', summary);
        const text = util.el('div', '', metric);
        util.el('span', '', text, label);
        util.el('strong', '', text, value);
        util.el('i', tone, metric, glyph);
      }
      const priority = util.el('div', 'helpdesk-priority', summary);
      util.el('strong', '', priority, 'Tickets by Priority');
      util.el('div', 'helpdesk-donut', priority);
      for (const [label, tone, value] of [['Urgent', 'red', '3'], ['High', 'coral', '3'], ['Medium', 'yellow', '3'], ['Low', 'green', '3']]) {
        const row = util.el('div', 'helpdesk-priority-row', priority);
        util.el('i', tone, row);
        util.el('span', '', row, label);
        util.el('b', '', row, value);
      }
      Object.assign(_c, { activity, customers, dashboard, priority, stage, summary });
    },
  };

  env.site({
    name: 'design-use-data-grid-colfilter-04',
    template: 'site/base',
    design: { parts },
  });
})();
