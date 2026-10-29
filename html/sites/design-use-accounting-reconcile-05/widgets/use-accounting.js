// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-reconcile-05',
  name: 'design',
  split: 'train',
  scenarios: ['reconcile'],
  template: 'use-accounting/workspace',
  design: {
    inset: 0,
    radius: 5,
    font: '14px/1.35 Arial, "Segoe UI", sans-serif',
    panel: '#ffffff', bg: '#f3f6fa', fg: '#102b50', muted: '#405b7e',
    line: '#cbd9e8', accent: '#1476c9',
    inspectorMinWidth: 0,
    titles: { reconcile: 'Reconcile Operating Account' },
    parts: {
      top: () => () => {},
      sidebar: () => () => {},
      navigation: () => () => {},
      heading: (base, S) => () => {
        const h = S.el('div', 'af-heading', S.main);
        S.el('h2', '', h, 'Reconcile Operating Account');
        const accountBalance = document.querySelector('.civic-index-row.is-selected span:last-child');
        if (accountBalance) accountBalance.textContent = S.task.helpers.money(S.spec.opening);
        const instruction = document.querySelector('.ref-instruction');
        if (instruction) {
          h.appendChild(instruction);
          S.root.classList.add('has-header-instruction');
        }
        const balances = S.el('div', 'civic-balances', h);
        for (const [label, value] of [['Statement Balance', S.spec.opening], ['Ending Balance', S.spec.opening]]) {
          const item = S.el('div', 'civic-balance', balances);
          S.el('span', '', item, label);
          S.el('strong', '', item, S.task.helpers.money(value));
        }
        S.statusBadge = S.el('span', 'civic-internal', h);
        S.metrics = S.el('div', 'civic-internal', h);
      },
      toolbar: (base, S) => () => {
        const bar = S.el('div', 'civic-controls', S.main.querySelector('.af-heading'));
        const account = S.P.iconButton(bar, 'Operating Account', 'chevron', () => S.P.showPanel('Account details', p => {
          S.P.kv(p, 'Account', 'Operating / ending 4580');
          S.P.kv(p, 'Opening balance', S.task.helpers.money(S.spec.opening));
        }), 'civic-account');
        account.setAttribute('aria-label', 'Operating account details');
        account.replaceChildren();
        const bankIcon = S.ctx.util.svg('svg', { viewBox:'0 0 24 24', class:'civic-account-icon', 'aria-hidden':'true' }, account);
        S.ctx.util.svg('path', { d:'M2 8 12 2l10 6ZM4 10v9m5-9v9m6-9v9m5-9v9M2 22h20' }, bankIcon);
        const copy = S.el('span', 'civic-account-copy', account);
        S.el('strong', '', copy, 'Operating Account');
        S.el('small', '', copy, '• • • •  4580');
        S.el('span', 'civic-account-chevron', account, '⌄');
        const dates = [...S.spec.bank, ...S.spec.ledger].map(row => row.date).sort();
        const period = dates[0].slice(0, 7);
        const [year, month] = period.split('-');
        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1];
        const monthDays = [31, Number(year) % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Number(month) - 1];
        const periodDetails = () => S.P.showPanel('Statement period', p => S.P.kv(p, 'Period', period));
        S.P.iconButton(bar, monthName + ' 1, ' + year, 'calendar', periodDetails, 'civic-period civic-period-start');
        S.el('span', 'civic-period-dash', bar, '–');
        S.P.iconButton(bar, monthName + ' ' + monthDays + ', ' + year, 'calendar', periodDetails, 'civic-period civic-period-end');
      },
      renderReconcile: (base, S) => () => {
        base();
        for (const [index, col] of [...S.main.querySelectorAll('.af-column')].entries()) {
          const bank = index === 0;
          col.classList.add(bank ? 'civic-bank' : 'civic-ledger');
          const head = col.querySelector('.af-colhead');
          head.replaceChildren();
          S.el('span', 'civic-column-title', head, bank ? 'Bank Feed (Operating Account)' : 'Ledger Entries (Operating Account)');
          S.el('small', '', head, (bank ? S.spec.bank.length : S.spec.ledger.length) + ' items');
          const searchWrap = S.el('label', 'civic-table-search', head);
          const searchIcon = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'civic-search-icon', 'aria-hidden':'true'}, searchWrap);
          S.ctx.util.svg('path', {d:'M16 16 21 21M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z'}, searchIcon);
          const input = S.el('input', '', searchWrap);
          input.type = 'search'; input.placeholder = bank ? 'Search bank feed' : 'Search ledger entries';
          input.setAttribute('aria-label', input.placeholder);
          input.addEventListener('input', () => {
            const query = input.value.trim().toLowerCase();
            for (const node of col.querySelectorAll('.civic-transaction')) node.style.display = !query || node.textContent.toLowerCase().includes(query) ? '' : 'none';
          });
          const filter = S.el('button', 'civic-filter', head);
          const filterIcon = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', 'aria-hidden':'true'}, filter);
          S.ctx.util.svg('path', {d:'M3 6h18M6 11h12M10 16h4'}, filterIcon);
          filter.type = 'button'; filter.title = 'Filter transactions';
          filter.addEventListener('click', () => S.P.showPanel('Transaction filters', p => S.P.kv(p, 'Account', 'Operating Account')));
          const columns = S.el('div', 'civic-tablehead', col);
          col.insertBefore(columns, col.querySelector('.af-scrollbox'));
          const check = S.el('span', 'civic-check-cell', columns); S.el('span', 'civic-checkbox', check);
          for (const text of bank ? ['Date  ⌃', 'Payee', 'Description', 'Amount'] : ['Date  ⌃', 'Payee / Account', 'Account', 'Memo', 'Amount']) S.el('span', '', columns, text);
          const content = col.querySelector('.af-content');
          const extra = content && [...content.children].find(node => !node.classList.contains('af-row'));
          if (extra) extra.classList.add('civic-pane-extra');
        }
      },
      transactionRow: (base, S) => (parent, row, bank) => {
        const node = base(parent, row, bank);
        node.classList.add('civic-transaction', bank ? 'bank' : 'ledger');
        const match = node._match || node.querySelector('.af-match');
        const original = S.el('div', 'civic-original-row', node);
        for (const child of [...node.childNodes]) if (child !== original && child !== match) original.appendChild(child);
        node.title = row.id + ' · ' + row.date + ' · ' + row.merchant;
        const check = S.el('span', 'civic-check-cell', node); S.el('span', 'civic-checkbox', check);
        const [year, month, day] = row.date.split('-');
        const date = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1] + ' ' + Number(day) + ', ' + year;
        S.el('span', 'civic-date', node, date);
        S.el('span', 'civic-payee', node, row.merchant);
        if (bank) S.el('span', 'civic-description', node, 'Payment to ' + row.merchant);
        else {
          S.el('span', 'civic-account-name', node, 'Operating Account');
          S.el('span', 'civic-description', node, 'Payment · ' + row.id);
        }
        S.el('span', 'civic-amount', node, '-' + S.task.helpers.money(row.amount));
        if (match) node.appendChild(match);
        node.addEventListener('click', () => {
          const body = S.root.querySelector('.civic-inspector-body');
          if (!body) return;
          body.classList.add('has-selection'); body.replaceChildren();
          S.el('h3', '', body, row.merchant);
          S.P.kv(body, 'Date', date); S.P.kv(body, 'Amount', '-' + S.task.helpers.money(row.amount));
          S.P.kv(body, 'Reference', row.id);
          S.P.kv(body, 'Source', bank ? 'Bank Feed' : 'Ledger');
          S.el('p', '', body, 'Drag a bank transaction to its exact ledger match.');
        });
        return node;
      },
      inspector: (base, S) => () => {
        const note = document.querySelector('.ref-panel');
        if (note) S.root.classList.add('civic-panel-note');
        const inspector = S.el('aside', 'af-inspector', S.shell);
        S.el('div', 'af-inspectorhead', inspector, 'Transaction Details');
        const body = S.el('div', 'civic-inspector-body', inspector);
        const icon = S.ctx.util.svg('svg', { viewBox: '0 0 86 106', class: 'civic-empty-document', 'aria-hidden': 'true' }, body);
        S.ctx.util.svg('path', { d: 'M13 5H57L79 28V94Q79 100 73 100H13Q7 100 7 94V11Q7 5 13 5ZM57 6V28H78M26 44H60M26 59H60M26 74H45' }, icon);
        S.el('p', '', body, 'Select a transaction to view details and add a match.');
      },
      refreshPane: (base, S) => (pane, name, state) => {
        base(pane, name, state);
        pane.track.classList.toggle('civic-static-track', pane.pane.scrollHeight <= pane.pane.clientHeight);
      },
      footer: (base, S) => () => {
        base();
        const footer = S.main.querySelector('.af-footer');
        footer.querySelector(':scope > svg')?.remove();
        const settings = S.el('button', 'civic-settings', footer);
        const settingsIcon = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', 'aria-hidden':'true'}, settings);
        S.ctx.util.svg('path', {d:'m9 2 1-1h4l1 3 2 1 3-1 2 4-2 2v3l2 2-2 4-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-4 2-2v-3L2 8l2-4 3 1 2-1ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8'}, settingsIcon);
        S.el('span', '', settings, 'Reconciliation Settings');
        settings.type = 'button';
        settings.addEventListener('click', () => S.P.showPanel('Reconciliation Settings', p => S.P.kv(p, 'Matching', 'Exact date, payee and amount')));
        footer.prepend(settings);
      },
      syncFooter: (base, S) => model => {
        base(model);
        if (model.notice || model.final) return;
        S.footerNotice.replaceChildren();
      },
    },
  },
});
