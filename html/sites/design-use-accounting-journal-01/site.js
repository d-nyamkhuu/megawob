// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const dock = util.el('nav', 'ref-dock', document.body);
        dock.setAttribute('aria-hidden', 'true');
        for (const [icon, text] of [
          ['⌂', 'Home'],
          ['▤', 'Journal'],
          ['♜', 'Reconcile'],
          ['▥', 'Expenses'],
          ['▦', 'Accounts Payable'],
          ['▥', 'Reports'],
          ['⚙', 'Settings'],
          ['?', 'Help'],
          ['◢', 'IRIX'],
        ]) {
          const cell = util.el('div', 'ref-dock-item', dock);
          util.el('span', 'ref-dock-icon', cell, icon);
          util.el('span', 'ref-dock-label', cell, text);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { dock, header });
      },
    'frame.body': (base) =>
      function (_c) {
        base(_c);
        const rail = _c.util.el('aside', 'ref-accounting-rail', _c.body);
        _c.util.el(
          'div',
          'ref-accounting-summary',
          rail,
          'Accounting\n\n  ▤   Bank Feed\n\n  ▧   Reconcile\n\n  ◫   General Ledger\n\n  ▤   Expenses\n\n  ▥   Accounts Payable\n\n  ▥   Reports\n\nStatus\n\nBank Items\n  12 unmatched\n  224 matched\n\nAP Invoices\n  5 pending\n  2 approved\n\nExpenses\n  8 unfiled\n  3 flagged\n\nJournal Entries\n  0 unposted\n  142 this period',
        );
        const side = _c.body.querySelector('.ref-side');
        if (side) rail.appendChild(side);
        _c.accountingRail = rail;
      },
    'frame.panel': (base) =>
      function (_c) {
        base(_c);
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) _c.accountingRail.prepend(panel);
      },
  };

  env.site({
    name: 'design-use-accounting-journal-01',
    template: 'site/base',
    design: { parts },
  });
})();
