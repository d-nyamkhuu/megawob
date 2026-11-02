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
          ['<svg viewBox="0 0 28 28"><rect x="3" y="8" width="22" height="17" fill="#244e8d" stroke="#111"/><rect x="8" y="3" width="12" height="7" fill="#d5e5ff" stroke="#111"/><rect x="6" y="11" width="6" height="11" fill="#fff"/><rect x="16" y="11" width="6" height="11" fill="#fff"/><path d="M9 13v7M19 13v7" stroke="#2b5e9f"/></svg>', 'Accounts'],
          ['<svg viewBox="0 0 28 28"><rect x="5" y="2" width="19" height="24" fill="#143f80" stroke="#111"/><rect x="8" y="5" width="12" height="18" fill="#f8fafb"/><path d="M10 9h9M10 12h9M10 15h9M10 18h7" stroke="#385b9c" stroke-width="1.5"/><path d="M7 3v21" stroke="#7da7da" stroke-width="2"/></svg>', 'Journal'],
          ['<svg viewBox="0 0 28 28"><path d="M4 3h16l3 3v15H4z" fill="#fbfbfa" stroke="#111"/><path d="M8 9h12M8 13h10M8 17h8" stroke="#555"/><path d="M7 23l5-5 4 3 7-10" fill="none" stroke="#17823d" stroke-width="3"/></svg>', 'Reconcile'],
          ['<svg viewBox="0 0 28 28"><rect x="4" y="3" width="20" height="22" fill="#f0f0e6" stroke="#111"/><path d="M8 6v16M12 7v15M16 7v15M20 6v16" stroke="#2a598e" stroke-width="2"/><path d="M5 18h18" stroke="#af4d27" stroke-width="3"/></svg>', 'Expenses'],
          ['<svg viewBox="0 0 28 28"><rect x="4" y="9" width="20" height="13" fill="#b8bec2" stroke="#111"/><rect x="7" y="3" width="14" height="8" fill="#fff" stroke="#111"/><rect x="8" y="18" width="12" height="7" fill="#fff" stroke="#111"/><path d="M10 20h8M10 22h7" stroke="#333"/><circle cx="21" cy="14" r="2" fill="#c52626"/></svg>', 'Payables'],
          ['<svg viewBox="0 0 28 28"><rect x="5" y="2" width="18" height="24" fill="#e9edf0" stroke="#111"/><path d="M9 7h10M9 11h10M9 15h10M9 19h10" stroke="#274e83" stroke-width="1.5"/><path d="M4 25h20" stroke="#3a5b88" stroke-width="2"/></svg>', 'Reports'],
        ]) {
          const cell = util.el('div', 'ref-dock-item', dock);
          util.el('span', 'ref-dock-icon', cell).innerHTML = icon;
          util.el('span', 'ref-dock-label', cell, text);
        }
        const titleIcon = util.el('span', 'ledger-title-icon', document.body);
        titleIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" fill="#eee" stroke="#161616"/><rect x="5" y="4" width="14" height="17" fill="#235993"/><rect x="8" y="7" width="8" height="11" fill="#fff"/><path d="M10 9h5M10 12h5M10 15h4" stroke="#193c67" stroke-width="1.2"/><path d="M4 7h4M17 9h3" stroke="#dc7e28" stroke-width="2"/></svg>';
        const gadgets = util.el('div', 'ledger-window-gadgets', document.body);
        util.el('span', '', gadgets, '–');
        util.el('span', '', gadgets, '□');
        util.el('span', 'close', gadgets, '×');
        S.frameBrand(_c, header);
        Object.assign(_c, { dock, header });
      },
    'frame.body': (base) => function (_c) {
      base(_c);
      const { util, body } = _c;
      const band = util.el('div', 'ref-record-band', body);
      for (const heading of ['Source Document', 'Vendor Details', 'Amount', 'Attachments']) {
        const box = util.el('section', 'ref-record-box', band);
        util.el('div', 'ref-record-title', box, heading);
        const detail = util.el('div', 'ref-record-detail', box);
        if (heading === 'Source Document') {
          const grid = util.el('div', 'ledger-record-grid', detail);
          for (const [label, value] of [['Type:', 'Accrual voucher'], ['No:', 'Source voucher'], ['Date:', 'On source voucher'], ['Vendor:', 'On source voucher'], ['Reference:', 'On source voucher']]) {
            util.el('span', '', grid, label); util.el('span', 'ledger-record-field', grid, value);
          }
        } else if (heading === 'Vendor Details') {
          util.el('div', '', detail, 'Finance Operations / Internal');
          util.el('div', '', detail, 'Source record on file');
          util.el('div', 'ledger-terms', detail, 'Terms:   Net 30');
        } else if (heading === 'Amount') {
          for (const [label, value] of [['Subtotal:', '—'], ['Tax:', '—'], ['Total:', 'USD']]) {
            const row = util.el('div', 'ledger-amount-line', detail);
            util.el('span', '', row, label); util.el('span', '', row, value);
          }
        } else {
          const file = util.el('div', 'ledger-attachment', detail);
          util.el('span', '', file, '♧'); util.el('span', '', file, 'Source voucher attached');
        }
      }
    },
    'frame.panel': (base) => function (_c) { base(_c); },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const { util } = _c;
      let foot = document.querySelector('.ref-foot');
      if (!foot) foot = util.el('footer', 'ref-foot', document.body);
      foot.classList.add('ledger-statusbar');
      let label = foot.querySelector('.ref-foot-text');
      if (!label) label = util.el('span', 'ref-foot-text', foot);
      label.textContent = 'ⓘ   F1  Help    │    F2  Accounts    │    F3  Journal    │    F4  Reconcile    │    F5  Expenses    │    F6  Payables    │    F7  Reports    │    Tab  Next Field    │    Shift+Tab  Previous Field    │    Ctrl+L  Clear Line';
    },
  };

  env.site({
    name: 'design-use-accounting-journal-05',
    template: 'site/base',
    design: { parts },
  });
})();
