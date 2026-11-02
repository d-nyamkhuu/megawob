// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-expense-01',
  name: 'design',
  split: 'train',
  scenarios: ['expense'],
  template: 'use-accounting/workspace',
  design: {
    inset: 0, radius: 7, font: '16px/1.4 "Segoe UI", sans-serif',
    panel: '#17212a', bg: '#10171d', fg: '#f3f5fa', muted: '#b7c7db',
    line: '#2e3e4b', accent: '#0086ff', inspectorMinWidth: 9999,
    parts: {
      top: () => () => {},
      sidebar: () => () => {},
      navigation: () => () => {},
      toolbar: () => () => {},
      heading: (base, S) => () => {
        // Keep the status/metric sinks used by the shared synchronizer.
        S.statusBadge = S.el('span', '', null);
        S.metrics = S.el('div', '', null);
      },
      renderExpense: (base, S) => () => {
        base();
        const sourceCol = S.work.children[0];
        sourceCol.classList.add('ledger-source');
        S.work.children[1].classList.add('ledger-editor');
        const head = sourceCol.querySelector('.af-colhead');
        head.replaceChildren();
        S.el('span', '', head, 'Receipts (' + S.spec.receipts.length + ')');
        S.el('small', 'ledger-sort', head, 'Sort: Date (newest) ﹀');
        S.work.children[1].querySelector('.af-colhead').replaceChildren();
        S.el('span', '', S.work.children[1].querySelector('.af-colhead'), 'Expense Details');
        S.spec.receipts.forEach((r, i) => {
          const b = S.receiptButtons[i];
          b.replaceChildren();
          const thumb = S.el('span', 'ledger-mini-paper', b);
          S.el('b', '', thumb, 'RECEIPT');
          for (let n = 0; n < 9; n++) S.el('i', '', thumb);
          const text = S.el('span', 'ledger-receipt-caption', b);
          S.el('span', '', text, r.merchant);
          S.el('span', '', text, r.date);
          S.el('strong', '', text, S.task.helpers.money(r.amount));
          b.setAttribute('aria-label', r.id + ' / ' + r.merchant);
        });
        const viewer = S.el('div', 'ledger-viewbar', null);
        S.el('strong', '', viewer, 'Receipt');
        const controls = S.el('div', 'ledger-view-tools', viewer);
        for (const [text, title, path] of [['', 'Zoom out', 'M5 12h14'], ['', 'Zoom in', 'M5 12h14M12 5v14'], ['100% ﹀', 'Zoom level'], ['', 'Fit receipt', 'M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6'], ['', 'Rotate receipt', 'M8 6a8 8 0 1 0 8 0M12 2v10M9 5l3-3 3 3']]) {
          const button = S.P.button(controls, text, () => env.log('decoy', {label: title}), 'ledger-view-tool');
          if (path) {
            const svg = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'af-svg', 'aria-hidden':'true'}, button);
            S.ctx.util.svg('path', {d:path}, svg);
          }
          button.title = title;
        }
        sourceCol.insertBefore(viewer, sourceCol.querySelector('.af-scrollbox'));
      },
      receiptPaper: (base, S) => (parent, r, i) => {
        const paper = S.el('div', 'ledger-paper', parent);
        S.el('h3', '', paper, r.merchant.toUpperCase());
        S.el('div', 'ledger-paper-address', paper, '1234 Market Street');
        S.el('div', 'ledger-paper-address', paper, r.city);
        S.el('div', 'ledger-paper-address', paper, '206-555-0199');
        const detail = S.el('div', 'ledger-paper-detail', paper);
        S.P.kv(detail, r.date, '10:24 AM');
        S.P.kv(detail, 'Receipt ' + r.id, 'RC-' + (10420 + i));
        S.el('hr', '', paper);
        S.P.kv(paper, r.category, S.task.helpers.money(r.amount));
        S.P.kv(paper, 'Tax detail', 'Included');
        S.el('hr', '', paper);
        S.P.kv(paper, 'Subtotal', S.task.helpers.money(r.amount));
        S.P.kv(paper, 'Project', r.project);
        S.el('hr', '', paper);
        const total = S.P.kv(paper, 'Total', S.task.helpers.money(r.amount));
        total.classList.add('ledger-paper-total');
        S.el('div', 'ledger-paper-thanks', paper, 'Thank you!');
        S.el('div', 'ledger-paper-foot', paper, 'Card ending 1042 / Approved');
        S.P.item(paper, r);
        const available = parent.parentElement.clientHeight;
        if (available) paper.style.zoom = String(Math.max(.6, Math.min(1, (available - 1) / paper.scrollHeight)));
      },
      buildReceipt: (base, S) => (i, source, editor) => {
        source.content.replaceChildren(); editor.content.replaceChildren(); editor.positions = {};
        for (const k of Object.keys(S.fields)) delete S.fields[k];
        for (const k of Object.keys(S.pickers)) delete S.pickers[k];
        S.receiptSummary = [];
        S.P.receiptPaper(source.content, S.spec.receipts[i], i);
        if (S.spec.judge && S.spec.judge.mode === 'impossible') S.el('div', 'af-warning', source.content, 'Requested project PRJ-999 has been closed and is unavailable.');
        const grid = S.el('div', 'ledger-fields', editor.content);
        for (const [key, label] of [['date', 'Date'], ['merchant', 'Merchant'], ['category', 'Category'], ['amount', 'Amount (USD)'], ['project', 'Project']]) S.P.expenseField(grid, editor, i, key, label);
        const memo = S.el('div', 'ledger-memo-row', grid);
        S.el('label', 'af-label', memo, 'Memo');
        const input = S.el('textarea', 'ledger-memo', memo);
        input.setAttribute('aria-label', 'Memo');
      },
      expenseField: (base, S) => (grid, editor, i, key, label) => {
        const box = base(grid, editor, i, key, label);
        box.classList.add('ledger-field-' + key);
        if (key === 'date') {
          const icon = S.el('span', 'ledger-calendar', box);
          const svg = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'af-svg', 'aria-hidden':'true'}, icon);
          S.ctx.util.svg('path', {d:'M4 5h16v16H4zM7 2v6M17 2v6M4 10h16M8 14h3v3H8z'}, svg);
        }
        if (key === 'amount') S.el('span', 'ledger-currency', box, '$');
        return box;
      },
      inputControl: (base) => (parent, i, key, label, cls) => {
        const input = base(parent, i, key, label, cls);
        if (key === 'amount') input.placeholder = '';
        return input;
      },
      pickerControl: (base) => (parent, label, action) => {
        const picker = base(parent, label, action);
        picker.label = '';
        return picker;
      },
      footer: (base, S) => () => {
        base();
        const footer = S.main.querySelector('.af-footer');
        S.work.children[1].appendChild(footer);
        footer.classList.add('ledger-file');
        footer.querySelector(':scope > .af-svg').remove();
        const heading = S.el('h3', '', null, 'File Receipt');
        footer.prepend(heading);
        const row = S.el('div', 'ledger-file-report', null);
        S.el('span', '', row, 'Add to report');
        S.el('span', 'ledger-file-picker', row, 'April 2024 - Team Expenses　 ﹀');
        heading.after(row);
        const commit = footer.querySelector('.primary');
        commit.querySelector('.af-svg').remove();
        const documentIcon = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'af-svg', 'aria-hidden':'true'}, commit);
        S.ctx.util.svg('path', {d:'M14 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9zM14 2v7h7M7 13h10M7 17h8'}, documentIcon);
        commit.prepend(documentIcon);
        const actions = S.el('div', 'ledger-file-actions', footer);
        actions.appendChild(commit);
        const remove = S.P.button(actions, '', () => env.log('decoy', {label: 'Remove'}), 'ledger-remove');
        const svg = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'af-svg', 'aria-hidden':'true'}, remove);
        S.ctx.util.svg('path', {d:'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7'}, svg);
        S.el('span', '', remove, 'Remove');
        // The episode's existing footer controls belong in the native form footer.
        // Their handlers, chosen forms, labels, and all sampling stay unchanged.
        const episodeFooter = document.querySelector('.ref-foot');
        if (episodeFooter) {
          const tools = episodeFooter.querySelector('.ref-tools');
          episodeFooter.replaceChildren(tools);
          actions.appendChild(episodeFooter);
        }
        const dock = document.querySelector('.ref-float-dock');
        if (dock) actions.appendChild(dock);
      },
      synced: (base, S) => model => {
        base(model);
        S.footerNotice.closest('.ledger-file').classList.toggle('has-notice', !!model.notice || !!model.final);
        const values = document.querySelectorAll('.ledger-metric strong');
        const total = S.spec.receipts.reduce((sum, r) => sum + r.amount, 0);
        if (values.length === 4) {
          values[0].textContent = S.spec.receipts.length;
          values[1].textContent = S.task.helpers.money(total);
          values[2].textContent = S.task.helpers.money(total);
        }
      },
    },
  },
});
