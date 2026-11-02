// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const desktop = util.el('div', 'bank-window', document.body);
        const leftPane = util.el('aside', 'bank-sidebar', desktop);
        const traffic = util.el('div', 'bank-traffic', leftPane);
        for (const color of ['red', 'yellow', 'green']) util.el('i', `bank-dot ${color}`, traffic);
        util.el('div', 'bank-search', leftPane, '⌕  Search');
        const logo = util.el('div', 'bank-logo', leftPane);
        util.el('span', 'bank-mark', logo, '✣');
        util.el('strong', '', logo, 'Hillside Bank');
        const sideNav = util.el('nav', 'bank-sidenav', leftPane);
        for (const [icon, item] of [
          ['⌂', 'Home'],
          ['▤', 'Accounts'],
          ['⇄', 'Transfers'],
          ['▣', 'Bill Pay'],
          ['▱', 'Cards'],
          ['☷', 'Transactions'],
          ['▥', 'Insights'],
        ]) {
          const a = util.el('a', `bank-side-link${item === 'Transfers' ? ' selected' : ''}`, sideNav);
          util.el('span', 'bank-side-icon', a, icon);
          util.el('span', '', a, item);
        }
        const sideBottom = util.el('div', 'bank-side-bottom', leftPane);
        for (const [icon, item] of [
          ['◉', 'Support'],
          ['⚙', 'Settings'],
        ]) {
          const a = util.el('a', 'bank-side-link', sideBottom);
          util.el('span', 'bank-side-icon', a, icon);
          util.el('span', '', a, item);
        }
        const header = util.el('header', 'ref-task', desktop);
        S.frameBrand(_c, header);
        Object.assign(_c, { desktop, header, leftPane, logo, sideBottom, sideNav, traffic });
      },
    'frame.nav': (base, S) =>
      function (_c) {
        const { header, util } = _c;
        if (true) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of [
            'One-time Transfer',
            'Recurring Transfer',
            'Pay a Bill',
            'Card Controls',
            'Dispute a Charge',
          ]) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { desktop, util } = _c;
        const body = util.el('div', 'ref-body', desktop);
        const inspector = util.el('aside', 'bank-inspector', body);
        const tablePanel = (title, cls) => {
          const p = util.el('section', `bank-panel ${cls || ''}`, inspector);
          util.el('h3', '', p, title);
          return p;
        };
        const accounts = tablePanel('Accounts', 'accounts-panel');
        const accountHead = util.el('div', 'bank-table bank-head', accounts);
        for (const x of ['Account', 'Type', 'Balance']) util.el('span', '', accountHead, x);
        for (const [n, t, b, sel] of [
          ['Everyday checking •8843', 'Checking', '$2,316.50', true],
          ['Reserve savings •9737', 'Savings', '$12,480.32'],
          ['Rewards card •4411', 'Credit Card', '$1,203.18'],
          ['Home loan •5582', 'Loan', '$210,342.17'],
        ]) {
          const row = util.el('div', `bank-table account-row${sel ? ' selected' : ''}`, accounts);
          for (const x of [n, t, b]) util.el('span', '', row, x);
        }
        const activity = tablePanel('Scheduled Activity', 'activity-panel');
        for (const [n, v] of [
          ['Upcoming bill payments', '3'],
          ['Upcoming transfers', '1'],
          ['Active recurring transfers', '2'],
          ['Active card controls', '0'],
        ]) {
          const row = util.el('div', 'bank-activity-row', activity);
          util.el('span', '', row, n);
          util.el('span', '', row, v);
        }
        const transactions = tablePanel('Recent Transactions', 'transactions-panel');
        const th = util.el('div', 'bank-table bank-head', transactions);
        for (const x of ['Date', 'Description', 'Amount']) util.el('span', '', th, x);
        for (const [d, n, a] of [
          ['2024-06-07', 'Grocery Store', '-$86.24'],
          ['2024-06-06', 'Hillside Power', '-$120.00'],
          ['2024-06-04', 'Online Transfer', '-$50.00'],
          ['2024-06-02', 'Coffee House', '-$4.75'],
          ['2024-06-01', 'Payroll Deposit', '$1,425.00'],
        ]) {
          const row = util.el('div', 'bank-table transaction-row', transactions);
          for (const x of [d, n, a]) util.el('span', '', row, x);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { accountHead, accounts, activity, body, inspector, tablePanel, th, transactions });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { desktop, endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const bottom = util.el('nav', 'bank-bottom-dock', desktop);
        for (const [icon, item] of [
          ['⌂', 'Accounts'],
          ['⇄', 'Transfers & Payments'],
          ['▤', 'Bill Pay'],
          ['▣', 'Cards'],
          ['▥', 'Activity'],
          ['✉', 'Messages'],
          ['⚙', 'Profile & Settings'],
        ]) {
          const a = util.el('a', `bank-dock-item${item === 'Transfers & Payments' ? ' active' : ''}`, bottom);
          util.el('span', 'bank-dock-icon', a, icon);
          util.el('span', '', a, item);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'dock', label: item });
          });
        }
        Object.assign(_c, { bottom, submit });
      },
  };

  env.site({
    name: 'design-use-bank-schedule-03',
    template: 'site/base',
    design: { parts },
  });
})();
