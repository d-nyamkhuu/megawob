// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const classicSide = util.el('aside', 'classic-side', body);
      const detail = util.el('section', 'classic-panel classic-details', classicSide);
      util.el('h2', 'classic-panel-title', detail, 'Ticket Details');
      for (const [label, value] of [['ID', '—'], ['Opened', '—'], ['User', '—'], ['Category', '—'], ['Summary', '—']]) {
        const row = util.el('div', 'classic-detail-row', detail);
        util.el('span', '', row, `${label}:`);
        util.el('span', 'classic-value', row, value);
      }
      const queues = util.el('section', 'classic-panel classic-queues', classicSide);
      util.el('h2', 'classic-panel-title classic-title-queues', queues, 'Queues');
      const qtable = util.el('div', 'classic-queue-table', queues);
      const qhead = util.el('div', 'classic-queue-head', qtable);
      util.el('b', '', qhead, 'Queue Name');
      util.el('b', '', qhead, 'Open Tickets');
      for (const queue of ['Accounts team', 'Endpoint support', 'Identity desk', 'Network operations']) {
        const row = util.el('div', 'classic-queue-row', qtable);
        util.el('span', '', row, queue); util.el('span', '', row, '0');
      }
      const activity = util.el('section', 'classic-panel classic-activity', classicSide);
      util.el('h2', 'classic-panel-title classic-title-activity', activity, 'Recent Activity');
      const ahead = util.el('div', 'classic-activity-head', activity);
      for (const t of ['Time', 'User', 'Action']) util.el('b', '', ahead, t);
      for (const rowdata of [['08:12', 'system', 'Ticket created'], ['09:27', 'system', 'Ticket updated'],
        ['09:41', 'system', 'Queue checked']]) {
        const row = util.el('div', 'classic-activity-row', activity);
        for (const t of rowdata) util.el('span', '', row, t);
      }
      const routing = util.el('section', 'classic-routing', body);
      util.el('h2', 'classic-panel-title classic-title-routing', routing, 'Routing Summary');
      const rhead = util.el('div', 'classic-routing-row classic-routing-head', routing);
      for (const t of ['Category', 'Assigned', 'Unassigned', 'Total']) util.el('b', '', rhead, t);
      for (const [name, color] of [['Access', '#ff2020'], ['Connectivity', '#1458e8'],
        ['Billing', '#11b82b'], ['Hardware', '#f2e500']]) {
        const row = util.el('div', 'classic-routing-row', routing);
        const cat = util.el('span', 'classic-routing-category', row, name);
        cat.style.setProperty('--category-color', color);
        for (const v of ['0', '—', '—']) util.el('span', '', row, v);
      }
      const total = util.el('div', 'classic-routing-row classic-routing-total', routing);
      util.el('b', '', total, 'Total');
      for (const v of ['0', '—', '—']) util.el('b', '', total, v);
      Object.assign(_c, { activity, ahead, classicSide, detail, qhead, qtable, queues, rhead, routing, stage, total });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const appDock = util.el('nav', 'classic-dock', document.body);
      const dockItems = [['⌂', 'Home'], ['✎', 'Tickets'], ['♟', 'Accounts'], ['▣', 'Endpoints'],
        ['▤', 'Billing'], ['▥', 'Hardware'], ['◉', 'Reports'], ['⚙', 'Admin']];
      for (const [icon, text] of dockItems) {
        const item = util.el('div', `classic-dock-item${text === 'Tickets' ? ' selected' : ''}`, appDock);
        util.el('span', 'classic-dock-icon', item, icon);
        util.el('span', 'classic-dock-label', item, text);
      }
      Object.assign(_c, { appDock, dockItems, submit });
    },
  };

  env.site({
    name: 'design-use-admin-console-tickets-01',
    template: 'site/base',
    design: { parts },
  });
})();
