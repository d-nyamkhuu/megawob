// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const desktop = util.el('div', 'bank-window', document.body);
      const leftPane = util.el('aside', 'bank-sidebar', desktop);
      const traffic = util.el('div', 'bank-traffic', leftPane);
      for (const color of ['red', 'yellow', 'green']) util.el('i', `bank-dot ${color}`, traffic);
      util.el('div', 'bank-search', leftPane, '⌕  Search');
      const logo = util.el('div', 'bank-logo', leftPane);
      util.el('span', 'bank-mark', logo, '✣');
      util.el('strong', '', logo, 'Harborview Bank');
      const sideNav = util.el('nav', 'bank-sidenav', leftPane);
      for (const [icon, item] of [['⌂','Home'],['▤','Accounts'],['⇄','Transfers'],['▣','Bill Pay'],['▱','Cards'],['☷','Transactions'],['▥','Insights']]) {
        const a = util.el('a', `bank-side-link${item === 'Transfers' ? ' selected' : ''}`, sideNav);
        util.el('span', 'bank-side-icon', a, icon); util.el('span', '', a, item);
      }
      const sideBottom = util.el('div', 'bank-side-bottom', leftPane);
      for (const [icon, item] of [['◉','Support'],['⚙','Settings']]) {
        const a = util.el('a', 'bank-side-link', sideBottom);
        util.el('span', 'bank-side-icon', a, icon); util.el('span', '', a, item);
      }
      const header = util.el('header', 'ref-task', desktop);
      S.frameBrand(_c, header);
      Object.assign(_c, { desktop, header, leftPane, logo, sideBottom, sideNav, traffic });
    },
    'frame.nav': (base, S) => function (_c) {
      const { header, util } = _c;
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Overview', 'Transfers', 'Bill Pay', 'Cards', 'Transactions', 'Insights']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { desktop, util } = _c;
      const body = util.el('div', 'ref-body', desktop);
      const inspector = util.el('aside', 'bank-inspector', body);
      util.el('h2', '', inspector, 'Existing Recurring Transfers');
      const table = util.el('div', 'bank-transfer-list', inspector);
      const head = util.el('div', 'bank-transfer-head', table);
      for (const label of ['From', 'To', 'Amount', 'Frequency']) util.el('span', '', head, label);
      for (const rowData of [
        ['Everyday Checking ·6450', 'Home Savings ·1122', '$250.00', 'Monthly'],
        ['Paycheck Checking ·0178', 'Vacation Savings ·3311', '$100.00', 'Monthly'],
        ['Everyday Checking ·6450', 'Car Fund ·7788', '$75.00', 'Weekly'],
        ['Business Checking ·9033', 'Tax Savings ·4455', '$300.00', 'Monthly'],
        ['Everyday Checking ·6450', 'Reserve Savings ·8499', '$500.00', 'Monthly'],
        ['Paycheck Checking ·0178', 'College Fund ·6677', '$200.00', 'Monthly'],
        ['Everyday Checking ·6450', 'Emergency Fund ·9900', '$50.00', 'Weekly'],
        ['Joint Checking ·2288', 'Home Savings ·1122', '$150.00', 'Monthly'],
      ]) {
        const row = util.el('div', 'bank-transfer-row', table);
        for (const value of rowData) util.el('span', '', row, value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, head, inspector, table });
    },
  };

  env.site({
    name: 'design-use-bank-schedule-04',
    template: 'site/base',
    design: { parts },
  });
})();
