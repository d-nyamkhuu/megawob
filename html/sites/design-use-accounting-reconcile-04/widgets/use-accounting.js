// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-reconcile-04',
  name: 'design',
  split: 'train',
  scenarios: ['reconcile'],
  template: 'use-accounting/workspace',
  design: {
    brand: 'Peachtree Accounting', font: '14px/1.2 Arial, sans-serif',
    bg: '#dedfe0', panel: '#fbfcfd', fg: '#111', muted: '#454b51',
    line: '#a3adb7', accent: '#3986cf', inspectorMinWidth: 0,
    parts: {
      top: () => () => {},
      sidebar: () => () => {},
      navigation: () => () => {},
      heading: (base, S) => () => {
        const hidden = S.el('div', 'qt-hidden', S.main);
        S.statusBadge = S.el('span', '', hidden);
        S.metrics = S.el('div', '', hidden);
      },
      toolbar: (base, S) => () => {
        const bar = S.el('div', 'qt-accountbar', S.main);
        S.el('span', '', bar, 'Account:');
        S.P.button(bar, 'Operating Account (Checking) - 1042', () => S.P.showPanel('Account details', panel => {
          S.P.kv(panel, 'Account', 'Operating / ending 1042');
          S.P.kv(panel, 'Entity', S.spec.company);
          S.P.kv(panel, 'Opening balance', S.task.helpers.money(S.spec.opening));
        }), 'qt-account qt-combo');
        S.el('span', '', bar, 'Statement Date:');
        const datebox = S.el('span', 'qt-statementbox', bar);
        const date = S.el('input', 'qt-statement', datebox);
        date.type = 'text'; date.value = '09/30/2026'; date.setAttribute('aria-label', 'Statement date');
        S.el('span', 'qt-calendar', datebox, '▦');
        S.el('span', '', bar, 'Beginning Balance:');
        S.el('span', 'qt-balance', bar, S.task.helpers.money(S.spec.opening));
        S.el('span', '', bar, 'Ending Balance:');
        const end = S.el('input', 'qt-ending', bar); end.setAttribute('aria-label', 'Ending balance');
      },
      column: (base, S) => (title) => {
        const col = S.el('section', 'af-column qt-list', S.work);
        S.el('div', 'af-colhead', col, title);
        const head = S.el('div', 'qt-tablehead qt-matchgrid', col);
        for (const label of ['Date', 'Payee / Description', 'Amount', 'Match']) S.el('span', '', head, label);
        return col;
      },
      transactionRow: (base, S) => (parent, row, bank) => {
        const node = S.el('div', 'af-row qt-matchgrid' + (bank ? ' bank' : ''), parent);
        const date = row.date.split('-');
        S.el('span', 'qt-date', node, date[1] + '/' + date[2] + '/' + date[0]);
        S.el('span', 'qt-payee', node, row.merchant);
        S.el('span', 'qt-amount', node, '-' + S.task.helpers.money(row.amount).replace(/^\$/, ''));
        const check = S.el('span', 'qt-matchcell', node);
        S.el('span', 'qt-check', check);
        node._match = S.el('span', 'af-match', check, 'Unmatched ');
        node.title = row.merchant + ' / ' + row.date;
        node.tabIndex = 0;
        node.addEventListener('pointerdown', () => S.current.selectTransaction(row, node));
        node.addEventListener('keydown', e => { if (e.key === 'Enter') S.current.selectTransaction(row, node); });
        return node;
      },
      renderReconcile: (base, S) => () => {
        const left = S.P.scroll(S.P.column('Bank Feed (Unreconciled)'), 'bank');
        const right = S.P.scroll(S.P.column('Ledger (Unreconciled)'), 'ledger');
        const details = S.el('section', 'qt-details', S.main);
        S.el('div', 'qt-sectionhead', details, 'Transaction Details');
        const body = S.el('div', 'qt-detailbody', details);
        const first = S.el('div', 'qt-detailfields qt-firstfields', body);
        const second = S.el('div', 'qt-detailfields', body);
        const inputs = {}, drafts = new Map();
        const field = (parent, label, key, combo) => {
          const wrap = S.el('label', 'qt-detailfield', parent);
          S.el('span', '', wrap, label + ':');
          const box = S.el('span', 'qt-fieldbox' + (combo ? ' qt-combobox' : ''), wrap);
          const input = S.el('input', '', box); input.type = 'text'; input.setAttribute('aria-label', label);
          if (key === 'date') { box.classList.add('qt-datebox'); S.el('span', 'qt-calendar', box, '▦'); }
          if (combo) S.el('span', 'qt-arrow', box, '▾');
          inputs[key] = input;
          input.addEventListener('input', () => {
            if (S.current.selectedTransaction) {
              const record = drafts.get(S.current.selectedTransaction);
              record[key] = input.value;
            }
          });
        };
        field(first, 'Date', 'date'); field(first, 'Payee', 'payee'); field(first, 'Amount', 'amount');
        field(second, 'Type', 'type', true); field(second, 'Reference', 'reference');
        field(second, 'Memo', 'memo'); field(second, 'Category', 'category', true); field(second, 'Project', 'project', true);
        const split = S.el('fieldset', 'qt-split', body);
        S.el('legend', '', split, 'Split / Journal Entry');
        const grid = S.el('div', 'qt-splittable', split);
        const head = S.el('div', 'qt-tablehead qt-splitgrid', grid);
        for (const label of ['Account', 'Description', 'Amount']) S.el('span', '', head, label);
        const lines = S.el('div', 'qt-splitlines', grid);
        const controls = S.el('div', 'qt-splitcontrols', split);
        S.P.button(controls, 'Add Line', () => {
          const line = S.el('div', 'qt-splitgrid qt-splitline', lines);
          for (const label of ['Account', 'Description', 'Amount']) {
            const input = S.el('input', '', line); input.setAttribute('aria-label', 'Split ' + label.toLowerCase());
          }
          edit.disabled = remove.disabled = false;
        });
        const edit = S.P.button(controls, 'Edit Line', () => lines.querySelector('input')?.focus()); edit.disabled = true;
        const remove = S.P.button(controls, 'Delete Line', () => {
          lines.lastElementChild?.remove(); edit.disabled = remove.disabled = !lines.children.length;
        }); remove.disabled = true;
        S.current.selectTransaction = (row, node) => {
          S.current.selectedTransaction = row;
          if (!drafts.has(row)) {
            const date = row.date.split('-');
            drafts.set(row, { date: date[1] + '/' + date[2] + '/' + date[0], payee: row.merchant,
              amount: '-' + S.task.helpers.money(row.amount).replace(/^\$/, ''), type: 'Check', reference: row.id,
              memo: '', category: '', project: '' });
          }
          for (const [key, input] of Object.entries(inputs)) input.value = drafts.get(row)[key];
          if (node) node.closest('.af-column').querySelectorAll('.af-row').forEach(n => n.classList.toggle('qt-selected', n === node));
          S.root.querySelectorAll('.qt-relatedrow').forEach(n => n.classList.toggle('qt-selected', n.dataset.transaction === row.id));
        };
        for (const [rows, pane, store, bank] of [[S.spec.bank, left, S.bankNodes, true], [S.spec.ledger, right, S.ledgerNodes, false]]) {
          for (const row of rows) {
            const node = S.P.transactionRow(pane.content, row, bank);
            store[row.id] = node; pane.positions[row.id] = node;
            S.register(bank ? { bank: row.id } : { ledger: row.id }, node);
            if (bank) S.P.bankBehavior(node, row, right);
            S.P.item(node, row);
          }
        }
        const initial = S.spec.bank[0];
        if (initial) S.current.selectTransaction(initial, S.bankNodes[initial.id]);
        const ledgerInitial = S.spec.ledger[0];
        if (ledgerInitial) S.ledgerNodes[ledgerInitial.id].classList.add('qt-selected');
      },
      inspector: (base, S) => () => {
        const rail = S.el('section', 'qt-related', S.shell);
        const note = S.ctx.stage.parentElement.querySelector(':scope > .ref-panel');
        if (note) rail.appendChild(note);
        S.el('div', 'qt-relatedtitle', rail, 'Related Records');
        const tabs = S.el('div', 'qt-tabs', rail);
        const panel = S.el('div', 'qt-relatedpanel', rail);
        const toolbar = S.el('div', 'qt-relatedtools', panel);
        S.el('span', '', toolbar, 'Show:');
        const period = S.P.button(toolbar, 'This Period', () => {
          period.textContent = period.textContent.includes('This') ? 'All Periods' : 'This Period';
          period.classList.add('qt-combo');
        }, 'qt-combo');
        const refresh = S.P.button(toolbar, 'Refresh', () => draw(active)); refresh.classList.add('qt-refresh');
        const table = S.el('div', 'qt-relatedtable', panel);
        const head = S.el('div', 'qt-tablehead qt-relatedgrid', table);
        for (const label of ['Date', 'Type', 'Payee / Description', 'Amount']) S.el('span', '', head, label);
        const rows = S.el('div', 'qt-relatedrows', table);
        let active = 'All Transactions';
        const buttons = [];
        const records = [...S.spec.bank, ...S.spec.ledger.filter(r => !S.spec.bank.some(b => b.merchant === r.merchant && b.date === r.date && b.amount === r.amount))];
        const draw = label => {
          active = label; rows.replaceChildren();
          buttons.forEach(b => b.classList.toggle('qt-tabactive', b.textContent === label));
          const data = label === 'All Transactions' ? records : label === 'Journal Entries' ? S.spec.ledger : label === 'Receipts' ? S.spec.bank : S.background.map(r => ({ id: r.ref, date: r.date, merchant: r.company, amount: r.amount }));
          for (const record of data) {
            const row = S.el('div', 'qt-relatedrow qt-relatedgrid', rows); row.dataset.transaction = record.id;
            const date = record.date.split('-');
            for (const value of [date[1] + '/' + date[2] + '/' + date[0], label === 'Invoices' ? 'Bill' : 'Check', record.merchant, '-' + S.task.helpers.money(record.amount).replace(/^\$/, '')]) S.el('span', '', row, value);
            row.addEventListener('click', () => S.current.selectTransaction(record, S.bankNodes[record.id] || S.ledgerNodes[record.id]));
            row.classList.toggle('qt-selected', S.current.selectedTransaction?.id === record.id);
          }
        };
        for (const label of ['All Transactions', 'Receipts', 'Invoices', 'Journal Entries']) buttons.push(S.P.button(tabs, label, () => draw(label)));
        draw(active);
      },
      synced: (base, S) => (model) => {
        for (const node of S.root.querySelectorAll('.af-row')) {
          node.querySelector('.qt-check').textContent = node.classList.contains('matched') ? '✓' : '';
        }
      },
    },
  },
});
