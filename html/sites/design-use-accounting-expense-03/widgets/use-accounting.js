// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-expense-03',
  name: 'design',
  split: 'train',
  scenarios: ['expense'],
  template: 'use-accounting/workspace',
  design: {
    brand: 'LedgerWorks', workspaceLabel: 'LedgerWorks expenses', inset: 0, font: '18px/1.35 "Lucida Grande","Segoe UI",Arial,sans-serif',
    parts: {
      begin: (base, S) => ctx => { base(ctx); S.aquaPicked = new Set(); S.aquaFooter = null; S.aquaCommitSlot = null; },
      top: () => () => {},
      sidebar: () => () => {},
      navigation: () => () => {},
      toolbar: () => () => {},
      inspector: () => () => {},
      heading: (base, S) => () => {
        const h = S.el('div', 'aqua-expense-title', S.main);
        S.P.icon(h, 'receipt'); S.el('span', '', h, 'Expenses');
        S.statusBadge = S.el('span', 'aqua-internal', h);
        S.metrics = S.el('div', 'aqua-internal', S.main);
      },
      inputControl: (base, S) => (...args) => { const n = base(...args); n.placeholder = ''; return n; },
      renderExpense: (base, S) => () => {
        const { el, P, spec: s } = S;
        const left = el('section', 'aqua-source-column', S.work);
        el('div', 'aqua-selector-title', left, 'Receipts:');
        const list = el('div', 'aqua-receipt-list', left);
        const head = el('div', 'aqua-receipt-head', list);
        for (const t of ['', 'Date', 'Merchant', 'Amount']) el('span', '', head, t);
        const rows = el('div', 'aqua-receipt-rows', list);
        s.receipts.forEach((r, i) => {
          const b = P.button(rows, '', () => P.change({ active: i }), 'aqua-receipt-row');
          P.icon(b, 'receipt'); el('span', '', b, r.date); el('span', '', b, r.merchant); el('span', '', b, S.task.helpers.money(r.amount));
          b.setAttribute('aria-label', r.id); S.receiptButtons[i] = b; S.register({ receipt: i }, b);
        });
        const source = P.scroll(left, 'source'); source.pane.classList.add('aqua-source-pane');
        const zoom = el('div', 'aqua-zoom', left); el('span', '', zoom, '−'); el('div', 'aqua-slider', zoom); el('span', '', zoom, '+');
        const right = el('section', 'aqua-editor-column', S.work);
        const editor = P.scroll(right, 'editor'); editor.pane.classList.add('aqua-editor-pane');
        S.current.buildReceipt = i => P.buildReceipt(i, source, editor);
      },
      receiptPaper: (base, S) => (parent, r, i) => {
        const { el, task: F } = S;
        const paper = el('article', 'aqua-paper', parent);
        el('h3', '', paper, r.merchant);
        el('div', 'aqua-paper-address', paper, r.city + '\n' + r.id + ' / ' + r.project);
        const date = el('div', 'aqua-paper-date', paper); el('span', '', date, r.date); el('span', '', date, '8:24 AM');
        el('div', 'aqua-paper-rule', paper);
        const item = el('div', 'aqua-paper-item', paper); el('span', '', item, r.category); el('span', '', item, F.helpers.money(r.amount));
        el('div', 'aqua-paper-tax', paper, 'Tax included'); el('div', 'aqua-paper-rule', paper);
        const total = el('div', 'aqua-paper-total', paper); el('span', '', total, 'Total'); el('span', '', total, F.helpers.money(r.amount));
        el('div', 'aqua-paper-card', paper, 'Card  XXXX-1042\nAuth  ' + (82391 + i));
        el('div', 'aqua-paper-thanks', paper, 'Thank You!');
        return paper;
      },
      buildReceipt: (base, S) => (i, source, editor) => {
        const { el, P, spec: s } = S;
        source.content.replaceChildren(); editor.content.replaceChildren(); editor.positions = {};
        for (const k of Object.keys(S.fields)) delete S.fields[k];
        for (const k of Object.keys(S.pickers)) delete S.pickers[k];
        const r = s.receipts[i]; P.receiptPaper(source.content, r, i);
        if (s.judge && s.judge.mode === 'impossible') el('div', 'af-warning', source.content, 'Requested project PRJ-999 has been closed and is unavailable.');
        const form = el('section', 'aqua-form', editor.content); el('div', 'aqua-section-title', form, 'Expense Details');
        const grid = el('div', 'af-fields aqua-fields', form);
        for (const [k, label] of [['date', 'Date:'], ['merchant', 'Merchant:'], ['category', 'Category:'], ['amount', 'Amount:'], ['project', 'Project:']]) {
          const box = P.expenseField(grid, editor, i, k, label); box.dataset.field = k;
          if (k === 'date') { const icon = el('span', 'aqua-date-icon', box, '▦'); icon.setAttribute('aria-hidden', 'true'); }
        }
        const memoBox = el('div', 'aqua-memo-field', grid); el('label', 'af-label', memoBox, 'Memo:');
        S.memo = el('textarea', 'af-input aqua-memo', memoBox); S.memo.setAttribute('aria-label', 'Memo');
        S.memo.addEventListener('input', () => P.change({ memo: S.memo.value }));
        const slot = el('div', 'aqua-commit-slot', form); S.aquaCommitSlot = slot;
        if (S.aquaFooter) slot.append(S.aquaFooter);
        const files = el('section', 'aqua-files', editor.content); el('div', 'aqua-section-title', files, 'Receipt Files');
        const content = el('div', 'aqua-file-content', files);
        const thumb = el('div', 'aqua-file-thumbnail', content); P.receiptPaper(thumb, r, i);
        const details = el('div', 'aqua-file-description', content); el('div', '', details, r.merchant); el('div', '', details, r.date); el('div', '', details, S.task.helpers.money(r.amount)); el('div', '', details, '1 page');
        P.button(content, 'Add File…', () => P.showPanel('Receipt Files', panel => { P.kv(panel, 'Attachment', r.id + '-receipt.pdf'); P.kv(panel, 'Original', r.merchant); }), 'aqua-add-file');
        S.receiptSummary = [];
      },
      footer: (base, S) => () => {
        base(); S.aquaFooter = S.main.querySelector('.af-footer'); if (S.aquaCommitSlot) S.aquaCommitSlot.append(S.aquaFooter);
      },
      option: (base, S) => (parent, i, k, value) => {
        const b = base(parent, i, k, value); b.addEventListener('click', () => S.aquaPicked.add(i + ':' + k), true); return b;
      },
      synced: (base, S) => m => {
        base(m);
        for (const [key, p] of Object.entries(S.pickers)) p.node.classList.toggle('aqua-pristine', !S.aquaPicked.has(key) && !m.final);
        const filename = document.querySelector('.aqua-inspector-filename'); if (filename) filename.textContent = S.spec.receipts[m.active].merchant.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.jpg';
        if (S.aquaFooter) S.aquaFooter.classList.toggle('has-notice', !!m.notice || !!m.final);
      },
    },
  },
});
