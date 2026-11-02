// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowbar = util.el('div', 'dispatch-windowbar', header);
      util.el('span', 'dispatch-appicon', windowbar, '🚚');
      util.el('strong', '', windowbar, 'Fleet Dispatch Console');
      util.el('span', 'dispatch-window-controls', windowbar, '▁　□　×');
      const menubar = util.el('nav', 'dispatch-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Dispatch', 'Tools', 'Reports', 'Help']) {
        const m = util.el('span', '', menubar, item);
        m.dataset.role = 'nav';
      }
      const toolbar = util.el('div', 'dispatch-toolbar', header);
      for (const [icon, label] of [['🚚','New'],['📂','Open'],['▤','Vehicles'],['🗺','Routes'],['🔁','Reassign'],['▤','Dispatch Log'],['▣','Print']]) {
        const t = util.el('span', 'dispatch-tool', toolbar);
        util.el('b', '', t, icon); util.el('span', '', t, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, toolbar, windowbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const help = util.el('aside', 'dispatch-guide', body);
      util.el('h2', '', help, 'Dispatch Guide');
      util.el('p', '', help, 'Drag delivery cards to assign them to a different day. You can also change the stop order within a day by dragging cards up or down.');
      util.el('hr', '', help);
      util.el('p', '', help, 'Each day shows a load limit and the current assigned load. Do not exceed the daily limit.');
      util.el('hr', '', help);
      util.el('h3', '', help, 'Tips:');
      util.el('ul', '', help).innerHTML = '<li>Drag a card to a new day to move the delivery.</li><li>Drag up or down to reorder stops within the same day.</li><li>Watch the load figures as you make changes.</li><li>Use the route list below to view all deliveries.</li>';
      const summary = util.el('section', 'dispatch-summary', help);
      util.el('h2', '', summary, 'Deliveries');
      const summaryBody = util.el('div', 'dispatch-summary-body', summary);
      util.el('div', '', summaryBody, 'Total deliveries:　 8');
      util.el('div', '', summaryBody, 'Unassigned:　　　  0');
      util.el('hr', '', summaryBody);
      util.el('div', '', summaryBody, 'Dispatch reference:');
      util.el('strong', '', summaryBody, 'DR-4187-A');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, help, summary, summaryBody });
    },
  };

  env.site({
    name: 'design-use-dispatch-reschedule-03',
    template: 'site/base',
    design: { parts },
  });
})();
