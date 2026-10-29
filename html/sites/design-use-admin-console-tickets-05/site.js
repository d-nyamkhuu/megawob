// Amiga Workbench design on templates/site/base.js: band + stage + details inspector.
(function () {
  'use strict';

  const CATS = [['Access', '#0a3ca8', 6], ['Connectivity', '#3a8a2c', 5], ['Billing', '#f58220', 7], ['Hardware', '#c8302c', 6]];
  const QUEUES = [['Endpoint support', '#0a3ca8', 6], ['Accounts team', '#3a8a2c', 5], ['Network operations', '#f58220', 7], ['Identity desk', '#c8302c', 6]];

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const band = util.el('div', 'classic-band', body);
      const s1 = util.el('section', '', band);
      util.el('h3', '', s1, 'Support Tickets');
      util.el('div', 'classic-comp', s1);
      const stats = util.el('div', 'classic-stats', s1);
      for (const [k, v] of [['Open Tickets:', '24'], ['On This Page:', '8'], ['Page:', '1 of 3']]) {
        const d = util.el('div', '', stats); util.el('span', '', d, k); util.el('span', '', d, v);
      }
      for (const [title, rows] of [['Tickets by Category', CATS], ['Tickets by Queue', QUEUES]]) {
        const sec = util.el('section', '', band);
        util.el('h3', '', sec, title);
        const wrap = util.el('div', 'classic-chartwrap', sec);
        const chart = util.el('div', 'classic-chart', wrap);
        const heights = [78, 55, 100, 78];
        rows.forEach(([, col], i) => { const b = util.el('i', '', chart); b.style.background = col; b.style.height = heights[i] + '%'; });
        const legend = util.el('div', 'classic-legend', wrap);
        for (const [name, col, n] of rows) {
          const d = util.el('div', '', legend);
          const sw = util.el('b', '', d); sw.style.background = col;
          util.el('span', '', d, name); util.el('em', '', d, String(n));
        }
      }
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const side = util.el('aside', 'classic-side', body);
      util.el('div', 'classic-title', side, 'Ticket Details');
      const kv = util.el('div', 'classic-kv', side);
      for (const [k, v] of [['ID:', 'TKT-1001'], ['Category:', 'Access'], ['Current Queue:', 'Accounts team']]) {
        util.el('span', '', kv, k); util.el('span', '', kv, v);
      }
      util.el('div', 'classic-sep', side);
      util.el('div', 'classic-lbl', side, 'Subject:');
      util.el('div', 'classic-lbl', side, 'Cannot log in to VPN');
      util.el('div', 'classic-lbl', side, 'Description:');
      util.el('div', 'classic-desc', side, 'User reports an error when connecting to the company VPN. Worked yesterday but not today. Access needed for remote work.');
      util.el('div', 'classic-sep', side);
      const kv2 = util.el('div', 'classic-kv', side);
      for (const [k, v] of [['Created:', '2024-03-14 09:27'], ['Requester:', 'Jordan Miles'], ['Priority:', 'Medium'], ['Device:', 'Windows 11 (laptop)']]) {
        util.el('span', '', kv2, k); util.el('span', '', kv2, v);
      }
      Object.assign(_c, { band, side, stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-admin-console-tickets-05',
    template: 'site/base',
    design: { parts },
  });
})();
