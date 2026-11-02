// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('crm-titlebar');
      const title = util.el('div', 'crm-window-title', header, 'Support Desk');
      title.setAttribute('aria-label', 'Support Desk');
      const windowControls = util.el('div', 'crm-window-controls', header);
      const control = (label, svg) => {
        const button = util.el('button', 'crm-window-control', windowControls);
        button.type = 'button';
        button.setAttribute('aria-label', label);
        button.title = label;
        button.innerHTML = svg;
      };
      control('Minimize', '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 11.5h10"/></svg>');
      control('Maximize', '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="9" height="10" rx=".5"/></svg>');
      control('Close', '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg>');
      const stats = util.el('aside', 'crm-stats', null);
      const statCard = (label, value, kind) => {
        const card = util.el('section', `crm-stat crm-stat-${kind}`, stats);
        util.el('div', 'crm-stat-label', card, label);
        util.el('div', 'crm-stat-value', card, value);
        if (kind === 'all') {
          const bars = util.el('div', 'crm-bars', card);
          [7, 10, 14, 9, 18, 23, 15, 27, 35, 30, 40, 48].forEach((h) => {
            const bar = util.el('i', '', bars); bar.style.height = `${h}px`;
          });
        } else {
          util.el('i', 'crm-dot', card);
        }
      };
      statCard('All Tickets', '248', 'all');
      statCard('Open', '142', 'open');
      statCard('Pending', '64', 'pending');
      statCard('Resolved', '42', 'resolved');
      const divider = util.el('div', 'crm-stat-divider', stats);
      divider.setAttribute('aria-hidden', 'true');
      statCard('Due Today', '18', 'due');
      S.frameBrand(_c, header);
      Object.assign(_c, { control, divider, header, statCard, stats, title, windowControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { stats, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('crm-workspace');
      body.appendChild(stats);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-use-data-grid-crm-01',
    template: 'site/base',
    design: { parts },
  });
})();
