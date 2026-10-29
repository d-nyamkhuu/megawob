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
      const summaryAccounts = util.el('section', 'bank-summary-pane bank-summary-accounts', inspector);
      util.el('h3', '', summaryAccounts, 'My Accounts');
      const accountTable = util.el('div', 'bank-summary-table bank-account-table', summaryAccounts);
      const accountHead = util.el('div', 'bank-summary-row bank-summary-head', accountTable);
      for (const labelText of ['Account', 'Type', 'Balance']) util.el('span', '', accountHead, labelText);
      for (const [title, mask, type, balance] of [
        ['Everyday checking', '9886', 'Checking', '$2,412.63'],
        ['Reserve savings', '5014', 'Savings', '$18,230.41'],
        ['House fund', '2719', 'Savings', '$6,845.20'],
        ['Travel fund', '6420', 'Savings', '$1,203.17'],
      ]) {
        const row = util.el('div', 'bank-summary-row bank-account-row', accountTable);
        util.el('span', '', row, `${title}  •${mask}`); util.el('span', '', row, type); util.el('strong', '', row, balance);
      }
      const summaryTransfers = util.el('section', 'bank-summary-pane bank-summary-transfers', inspector);
      util.el('h3', '', summaryTransfers, 'Scheduled Transfers');
      const transferTable = util.el('div', 'bank-summary-table bank-transfer-table', summaryTransfers);
      const transferHead = util.el('div', 'bank-summary-row bank-summary-head', transferTable);
      for (const labelText of ['From', 'To', 'Amount', 'Frequency', 'Next Transfer']) util.el('span', '', transferHead, labelText);
      const transferRow = util.el('div', 'bank-summary-row bank-transfer-row', transferTable);
      for (const value of ['House fund •2719', 'Reserve savings •5014', '$250.00', 'Monthly', '2025-11-20']) util.el('span', '', transferRow, value);
      S.frameSidebar(_c, body);
      Object.assign(_c, { accountHead, accountTable, body, inspector, summaryAccounts, summaryTransfers, transferHead, transferRow, transferTable });
    },
  };

  env.site({
    name: 'design-use-bank-schedule-02',
    template: 'site/base',
    design: { parts },
  });
})();
