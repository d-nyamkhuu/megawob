// LedgerPro presentation; the shared template retains task behavior and targets.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-reconcile-02',
  name: 'design',
  split: 'train',
  scenarios: ['reconcile'],
  template: 'use-accounting/workspace',
  design: {
      brand: 'LedgerPro', logo: 'L', inset: 0, radius: 0,
      font: '14px/1.35 "Segoe UI", Tahoma, Arial, sans-serif',
      sidebarWidth: 233, narrowSidebarWidth: 186,
      railWidth: 0, inspectorMinWidth: 10000,
    parts: {
      icon: (base, S) => (parent, name) => {
        if (name !== 'people') return base(parent, name);
        const svg = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'af-svg', 'aria-hidden':'true'}, parent);
        S.ctx.util.svg('path', {d:'M15 21H3v-2a6 6 0 0 1 12 0z M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M16 3a4 4 0 0 1 0 8 M18 14a6 6 0 0 1 4 6'}, svg);
        return svg;
      },
      top: () => () => {},
      navigation: () => () => {},
      toolbar: () => () => {},
      sidebar: (base, S) => () => {
        S.side = S.el('nav', 'af-sidebar ledger-sidebar', S.shell);
        S.el('div', 'ledger-side-label', S.side, 'Workspace');
        for (const [text, icon] of [['Dashboard','help'],['Bank Feeds','bank'],['Reconcile','invoice'],['General Ledger','book'],['Journal Entries','book'],['Expenses','receipt'],['Accounts Payable','invoice'],['Reports','chart']]) {
          S.P.navItem(text, icon, '', text === 'Reconcile');
        }
        const taskPanel = document.querySelector('.ref-panel');
        if (taskPanel) S.side.appendChild(taskPanel);
        S.el('div', 'ledger-side-label lists-label', S.side, 'Lists');
        for (const [text, icon] of [['Chart of Accounts','book'],['Vendors','people'],['Customers','people'],['Projects','folder']]) S.P.navItem(text, icon);
      },
      heading: (base, S) => () => {
        const band = S.el('section', 'ledger-account-band', S.main);
        const account = S.el('div', 'ledger-account', band);
        S.el('h2', '', account, 'Business Checking');
        S.P.icon(account.querySelector('h2'), 'chevron');
        S.el('div', '', account, 'First National Bank  · · · ·  1042');
        const period = S.el('div', 'ledger-period', band);
        S.el('label', '', period, 'Statement Period');
        S.P.iconButton(period, 'Sep 1, 2026 – Sep 30, 2026', 'chevron', () => S.P.showPanel('Statement Period', p => S.P.kv(p, 'Period', 'September 2026')), 'ledger-period-control');
        S.statusBadge = S.el('span', 'af-badge ledger-record-status', account, 'Draft');
        S.metrics = S.el('div', 'ledger-account-metrics', band);
      },
      syncMetrics: (base, S) => m => {
        S.metrics.replaceChildren();
        const count = Object.keys(m.matches).filter(k => m.matches[k]).length;
        const ending = S.spec.opening - S.spec.bank.reduce((sum, r) => sum + r.amount, 0);
        for (const [label, value] of [['Beginning Balance', S.task.helpers.money(S.spec.opening)], ['Ending Balance', S.task.helpers.money(ending)], ['Cleared Transactions', String(count)], ['Unmatched Bank', String(S.spec.bank.length - count)], ['Unmatched Ledger', String(S.spec.ledger.length - count)]]) {
          const cell = S.el('div', 'ledger-balance', S.metrics);
          S.el('span', '', cell, label); S.el('strong', '', cell, value);
        }
      },
      column: (base, S) => (title, note) => {
        const bank = title === 'Bank statement';
        const col = base(bank ? 'Bank Feed' : 'General Ledger', '(' + (bank ? S.spec.bank.length : S.spec.ledger.length) + ' transactions)');
        col.classList.add(bank ? 'ledger-bank-column' : 'ledger-book-column');
        const head = col.querySelector('.af-colhead');
        if (bank) S.P.iconButton(head, '', 'download', () => S.P.showPanel('Bank Feed', p => S.P.kv(p, 'Source', 'Direct bank feed')), 'ledger-download');
        const search = S.el('div', 'ledger-search', head); S.P.icon(search, 'search');
        S.el('span', '', search, bank ? 'Search bank transactions...' : 'Search ledger transactions...');
        const labels = S.el('div', 'ledger-table-head ' + (bank ? 'bank' : 'book'), col);
        for (const text of bank ? ['Date', 'Payee', 'Amount', 'Status'] : ['Date', 'Payee / Description', 'Amount', 'Account', 'Status']) S.el('span', '', labels, text);
        return col;
      },
      transactionRow: (base, S) => (parent, row, bank) => {
        const node = S.el('div', 'af-row ledger-table-row ' + (bank ? 'bank' : 'book'), parent);
        node.title = row.id + ' · ' + row.merchant;
        const date = row.date.split('-');
        S.el('span', 'ledger-date', node, date.length === 3 ? date[1] + '/' + date[2] + '/' + date[0] : row.date);
        S.el('span', 'af-payee', node, row.merchant);
        S.el('span', 'ledger-amount', node, '-' + S.task.helpers.money(row.amount));
        if (!bank) S.el('span', 'ledger-row-account', node, row.account || '6100 Office Supplies');
        node._match = S.el('div', 'af-match', node, 'Unmatched ');
        node.addEventListener('click', () => S.current.showDetails?.(row));
        return node;
      },
      renderReconcile: (base, S) => () => {
        base();
        S.panes.bank.content.querySelector('.af-summarybox')?.remove();
        S.panes.ledger.content.querySelector('.af-content')?.remove();
        const details = S.el('section', 'ledger-details', S.main);
        details.dataset.details = 'true';
        S.current.showDetails = row => {
        if (!row) return;
        const details = S.main.querySelector('[data-details]');
        if (!details) return;
        const footer = details.querySelector('.af-footer');
        details.replaceChildren();
        const form = S.el('div', 'ledger-detail-form', details);
        S.el('h3', '', form, 'Transaction Details');
        const grid = S.el('div', 'ledger-detail-grid', form);
        const date = row.date.split('-');
        for (const [label, value, cls] of [['Date', date[1] + '/' + date[2] + '/' + date[0], 'detail-date'], ['Payee / Description', row.merchant, 'detail-payee'], ['Amount', '-' + S.task.helpers.money(row.amount), 'detail-amount'], ['Account', row.account || '1000 Checking', 'detail-account'], ['Memo', row.merchant, 'detail-memo']]) {
          const field = S.el('div', 'ledger-detail-field ' + cls, grid);
          S.el('label', '', field, label);
          const control = S.el('div', 'ledger-readonly', field, value);
          if (label === 'Date' || label === 'Account') S.P.icon(control, label === 'Date' ? 'calendar' : 'chevron');
        }
        const preview = S.el('div', 'ledger-journal-preview', details);
        S.el('h3', '', preview, 'Journal Entry Preview');
        const table = S.el('div', 'ledger-preview-table', preview);
        for (const values of [['Account','Debit','Credit','Memo'], [row.account || '6100 Office Supplies', S.task.helpers.money(row.amount), '$0.00', row.merchant], ['1000 Checking', '$0.00', S.task.helpers.money(row.amount), row.merchant]]) {
          const line = S.el('div', 'ledger-preview-line', table);
          for (const value of values) S.el('span', '', line, value);
        }
        if (footer) details.appendChild(footer);
        };
        S.current.showDetails(S.spec.bank[0]);
      },
      syncMatches: (base, S) => m => {
        base(m);
        for (const node of Object.values(S.bankNodes)) {
          const unlink = node._match?.querySelector('.af-unlink');
          if (unlink) {
            unlink.style.position = 'absolute';
            unlink.style.right = '18px';
            unlink.style.top = '0';
            unlink.style.zIndex = '2';
          }
        }
        for (const [id, node] of Object.entries(S.ledgerNodes)) if (!Object.values(m.matches).includes(id)) node._match.textContent = 'Unmatched';
      },
      footer: (base, S) => () => {
        base();
        S.main.querySelector('.ledger-details').appendChild(S.main.querySelector('.af-footer'));
      },
    },
  },
});
