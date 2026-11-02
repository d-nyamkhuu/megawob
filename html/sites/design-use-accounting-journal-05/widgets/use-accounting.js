// RISC OS journal workspace on the shared accounting model.
let journalTotals = null;
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-journal-05',
  name: 'design',
  split: 'train',
  scenarios: ['journal'],
  template: 'use-accounting/workspace',
  design: {
    parts: {
      inputControl: (base) => (parent, i, k, label, cls = '') => {
        const node = base(parent, i, k, label, cls);
        if (cls === 'money') node.placeholder = '';
        return node;
      },
      voucher: (base, S) => (parent) => {
        const paper = S.el('div', 'af-paper ledger-invoice', parent);
        const mast = S.el('div', 'ledger-invoice-mast', paper);
        const vendor = S.el('div', '', mast);
        S.el('h3', '', vendor, S.spec.company || 'FINANCE OPERATIONS');
        S.el('div', '', vendor, '100 Market Street');
        S.el('div', '', vendor, 'Riverton, CA 95436');
        S.el('div', '', vendor, '(415) 555-0189');
        const meta = S.el('div', 'ledger-invoice-meta', mast);
        S.el('b', '', meta, 'VOUCHER');
        S.el('div', '', meta, 'No:       ' + S.spec.ref);
        S.el('div', '', meta, 'Date:     30 Sep 2026');
        S.el('div', '', meta, 'Terms:    Net 30');
        const bill = S.el('div', 'ledger-bill', paper);
        S.el('b', '', bill, 'Bill To:');
        S.el('div', '', bill, 'Finance Operations');
        S.el('div', '', bill, 'General Ledger Department');
        S.el('div', '', bill, 'Riverton, CA 95436');
        const table = S.el('table', 'ledger-voucher-table', paper);
        const head = S.el('thead', '', table), hr = S.el('tr', '', head);
        for (const label of ['Qty', 'Description', 'Unit Price', 'Amount']) S.el('th', '', hr, label);
        const tbody = S.el('tbody', '', table);
        for (const row of S.spec.voucher.rows) {
          const tr = S.el('tr', '', tbody), amount = row.debit || row.credit || 0;
          S.el('td', '', tr, '1'); S.el('td', '', tr, row.account);
          S.el('td', '', tr, S.task.helpers.money(amount).replace(/^\$/, ''));
          S.el('td', '', tr, S.task.helpers.money(amount).replace(/^\$/, ''));
        }
        S.el('div', 'ledger-invoice-memo', paper, 'Memo: ' + S.spec.voucher.memo);
        const foot = S.el('div', 'ledger-invoice-sum', paper);
        const subtotal = S.spec.voucher.rows.reduce((n, r) => n + (r.debit || 0), 0);
        for (const [label, value] of [['Subtotal', S.task.helpers.money(subtotal).replace(/^\$/, '')], ['Sales Tax', '—'], ['TOTAL', S.task.helpers.money(subtotal).replace(/^\$/, '')]]) {
          const row = S.el('div', '', foot);
          S.el('span', '', row, label);
          S.el('strong', '', row, value);
        }
      },
      renderJournal: (base, S) => () => {
        const source = S.P.scroll(S.P.column('Voucher Image   (' + S.spec.ref + ')', ''), 'source');
        S.P.voucher(source.content);
        if (S.spec.disabled.length) S.el('div', 'af-warning', source.content, 'Period lock · ' + S.spec.disabled[0] + ' is unavailable. No substitute account is authorized.');
        const viewer = S.el('div', 'ledger-viewer', source.content);
        S.el('button', '', viewer, '◀'); S.el('button', '', viewer, '▶');
        S.el('span', '', viewer, '1 of 1'); S.el('button', '', viewer, '⌕');
        S.el('button', '', viewer, 'Fit  ▾');
        const editColumn = S.P.column('Journal Entry', '');
        const datebar = S.el('div', 'ledger-datebar', editColumn.querySelector('.af-colhead'));
        S.el('span', '', datebar, 'Date:'); S.el('span', 'ledger-box', datebar, '30 Sep 2026');
        S.el('span', '', datebar, 'Reference:'); S.el('span', 'ledger-box', datebar, S.spec.ref);
        const edit = S.P.scroll(editColumn, 'editor');
        const table = S.el('div', 'ledger-entry-table', edit.content);
        const th = S.el('div', 'ledger-entry-head', table);
        for (const h of ['Line','Account','Description','Debit (USD)','Credit (USD)','Project']) S.el('span', '', th, h);
        const rows = S.el('div', 'ledger-entry-rows', table);
        const real = S.spec.goal.rows.length;
        for (let i = 0; i < Math.max(6, real); i++) {
          const line = S.el('div', 'ledger-entry-row' + (i >= real ? ' ledger-fill-row' : ''), rows);
          S.el('span', 'ledger-line-number', line, String(i + 1));
          if (i < real) {
            S.P.picker(line, i, 'account', 'Choose account');
            S.el('input', 'ledger-description', line).setAttribute('aria-label', 'Description');
            S.P.input(line, i, 'debit', 'Line ' + (i + 1) + ' debit', 'money');
            S.P.input(line, i, 'credit', 'Line ' + (i + 1) + ' credit', 'money');
            S.el('span', 'ledger-project-picker', line);
            S.P.item(line, S.spec.goal.rows[i]);
          } else {
            S.el('span', 'ledger-fake-picker', line);
            S.el('input', 'ledger-description', line).disabled = true;
            S.el('input', 'ledger-blank-money', line).disabled = true;
            S.el('input', 'ledger-blank-money', line).disabled = true;
            S.el('span', 'ledger-project-picker', line);
          }
          edit.positions[String(i)] = line;
        }
        const lower = S.el('div', 'ledger-lower', edit.content);
        const memoBox = S.el('section', 'ledger-memo-panel', lower);
        S.el('div', 'ledger-panel-title', memoBox, 'Memo');
        S.memo = S.el('textarea', 'ledger-memo-input', memoBox);
        S.memo.setAttribute('aria-label', 'Memo'); S.register({ memo: true }, S.memo);
        edit.positions.memo = S.memo;
        S.memo.addEventListener('input', () => S.P.change({ memo: S.memo.value }));
        const totals = S.el('section', 'ledger-totals-panel', lower);
        S.el('div', 'ledger-panel-title', totals, 'Totals (USD)');
        journalTotals = S.el('div', 'ledger-totals-body', totals);
        S.entryTotal = S.el('div', 'ledger-difference', totals);
        S.validation = S.el('div', 'ledger-validation', edit.content);
      },
      syncJournal: (base, S) => (m) => {
        base(m);
        if (journalTotals && S.spec.scenario === 'journal') {
          const t = S.task.helpers.totals(m, S.spec);
          journalTotals.replaceChildren();
          for (const [label, amount] of [['Debit Total:', t.debit], ['Credit Total:', t.credit]]) {
            const row = S.el('div', 'ledger-total-row', journalTotals);
            S.el('span', '', row, label);
            S.el('span', 'ledger-box', row, S.task.helpers.money(amount).replace(/^\$/, ''));
          }
        }
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const band = document.querySelector('.ref-record-band');
        if (!band) return;
        const fields = band.querySelectorAll('.ledger-record-field');
        if (fields.length >= 5) {
          fields[1].textContent = S.spec.ref;
          fields[2].textContent = '30 Sep 2026';
          fields[3].textContent = S.spec.company;
          fields[4].textContent = S.spec.ref;
        }
        const vendor = band.querySelector('.ref-record-box:nth-child(2) .ref-record-detail');
        if (vendor && vendor.firstElementChild) {
          vendor.firstElementChild.textContent = S.spec.company;
          vendor.children[1].textContent = '100 Market Street';
          const city = S.el('div', '', vendor, 'Riverton, CA 95436');
          vendor.insertBefore(city, vendor.querySelector('.ledger-terms'));
        }
        const amounts = band.querySelectorAll('.ledger-amount-line span:last-child');
        if (amounts.length >= 3) {
          const total = S.spec.voucher.rows.reduce((n, r) => n + (r.debit || 0), 0);
          amounts[0].textContent = S.task.helpers.money(total).replace(/^\$/, '');
          amounts[1].textContent = '—';
          amounts[2].textContent = S.task.helpers.money(total).replace(/^\$/, '') + ' USD';
        }
        const attachment = band.querySelector('.ledger-attachment span:last-child');
        if (attachment) attachment.textContent = S.spec.ref + '.pdf';
      },
      footer: (base, S) => () => {
        const footer = S.el('div', 'af-footer ledger-commit', S.main);
        S.footerNotice = S.el('span', 'af-notice', footer, 'Draft · Changes saved locally');
        const commit = S.P.button(footer, S.D.commitLabels[S.spec.scenario], () => {
          if (S.spec.judge && S.spec.judge.mode === 'confirm') { S.ctx.flag('irreversible'); return; }
          S.P.change({ commit: true });
        }, 'primary');
        S.register({ commit: true }, commit);
      },
    },
  },
});
