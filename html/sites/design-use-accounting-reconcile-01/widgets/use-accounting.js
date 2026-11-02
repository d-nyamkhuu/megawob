// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-reconcile-01',
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
    titles: { reconcile: 'Reconcile Bank Account' },
    parts: {
      top: () => () => {},
      sidebar: () => () => {},
      navigation: () => () => {},
      heading: (base, S) => () => {
        const h = S.el('div', 'af-heading', S.main);
        S.el('h2', '', h, 'Reconcile Bank Account');
        const balances = S.el('div', 'civic-balances', h);
        for (const [label, value] of [['Beginning balance', S.spec.opening], ['Ending balance', S.spec.opening - S.spec.bank.reduce((sum, row) => sum + row.amount, 0)]]) {
          const item = S.el('div', 'civic-balance', balances);
          S.el('span', '', item, label);
          S.el('strong', '', item, S.task.helpers.money(value));
        }
        S.statusBadge = S.el('span', 'civic-internal', h);
        S.metrics = S.el('div', 'civic-internal', h);
      },
      toolbar: (base, S) => () => {
        const bar = S.el('div', 'civic-controls', S.main.querySelector('.af-heading'));
        const account = S.P.iconButton(bar, 'Operating Account (•••• 1042)', 'chevron', () => S.P.showPanel('Account details', p => {
          S.P.kv(p, 'Account', 'Operating / ending 1042');
          S.P.kv(p, 'Opening balance', S.task.helpers.money(S.spec.opening));
        }), 'civic-account');
        account.setAttribute('aria-label', 'Operating account details');
        S.el('span', 'civic-period-label', bar, 'Statement period');
        const dates = [...S.spec.bank, ...S.spec.ledger].map(row => row.date).sort();
        const period = dates[0].slice(0, 7);
        const [year, month] = period.split('-');
        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1];
        const monthDays = [31, Number(year) % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Number(month) - 1];
        S.P.iconButton(bar, monthName + ' 1, ' + year + ' – ' + monthName + ' ' + monthDays + ', ' + year, 'calendar', () => S.P.showPanel('Statement period', p => S.P.kv(p, 'Period', period)), 'civic-period');
      },
      renderReconcile: (base, S) => () => {
        const left = S.P.scroll(S.P.column('Bank Feed', S.spec.bank.length + ' transactions'), 'bank');
        const right = S.P.scroll(S.P.column('Ledger', S.spec.ledger.length + ' transactions'), 'ledger');
        for (const [rows, pane, store, bank] of [[S.spec.bank, left, S.bankNodes, true], [S.spec.ledger, right, S.ledgerNodes, false]]) {
          const col = pane.pane.closest('.af-column');
          col.classList.add(bank ? 'civic-bank' : 'civic-ledger');
          const columns = S.el('div', 'civic-tablehead', col);
          col.insertBefore(columns, col.querySelector('.af-scrollbox'));
          const check = S.el('span', 'civic-check-cell', columns); S.el('span', 'civic-checkbox', check);
          for (const text of bank ? ['Date  ▴', 'Payee', 'Description', 'Amount'] : ['Date  ▴', 'Payee', 'Account', 'Memo', 'Amount']) S.el('span', '', columns, text);
          for (const row of rows) {
            const node = S.P.transactionRow(pane.content, row, bank);
            store[row.id] = node; pane.positions[row.id] = node;
            S.register(bank ? { bank: row.id } : { ledger: row.id }, node);
            if (bank) S.P.bankBehavior(node, row, right);
            S.P.item(node, row);
          }
        }
      },
      transactionRow: (base, S) => (parent, row, bank) => {
        const node = S.el('div', 'af-row civic-transaction' + (bank ? ' bank' : ' ledger'), parent);
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
        node._match = S.el('div', 'af-match', node, 'Unmatched');
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
        const stack = note ? S.el('div', 'civic-details-stack', S.shell) : S.shell;
        if (note) { stack.appendChild(note); S.root.classList.add('civic-panel-note'); }
        const inspector = S.el('aside', 'af-inspector', stack);
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
        S.root.appendChild(footer);
        footer.querySelector(':scope > svg').remove();
      },
      syncFooter: (base, S) => model => {
        base(model);
        if (model.notice || model.final) return;
        const matched = Object.keys(model.matches).length;
        S.footerNotice.replaceChildren();
        S.el('span', '', S.footerNotice, 'Unmatched bank transactions: ');
        S.el('b', '', S.footerNotice, String(S.spec.bank.length - matched));
        S.el('span', 'civic-status-divider', S.footerNotice, '|');
        S.el('span', '', S.footerNotice, 'Unmatched ledger transactions: ');
        S.el('b', '', S.footerNotice, String(S.spec.ledger.length - matched));
      },
    },
  },
});
