// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-journal-03',
  name: 'design',
  split: 'train',
  scenarios: ['journal'],
  template: 'use-accounting/workspace',
  design: {
    brand: 'LedgerPro 2014',
    workspaceLabel: 'Create Journal Entry',
    font: '14px/1.2 Arial, sans-serif',
    inset: 0, radius: 0, inspectorMinWidth: 0,
    bg: '#f3f8fb', panel: '#ffffff', fg: '#081932', muted: '#526b7d',
    line: '#a6bccd', accent: '#247ab2',
    parts: {
      top: () => () => {},
      sidebar: () => () => {},
      navigation: () => () => {},
      toolbar: () => () => {},
      heading: (base, S) => () => {
        const h = S.el('div', 'draft-title', S.main, 'Create Journal Entry');
        S.statusBadge = S.el('span', 'af-badge draft-status', h);
        S.metrics = S.el('div', 'draft-metrics', h);
      },
      column: (base, S) => (title) => {
        const c = S.el('section', 'af-column', S.work);
        S.el('div', 'af-colhead', c, title);
        return c;
      },
      pickerControl: (base, S) => (parent, label, action) => {
        const node = S.P.button(parent, '', action, 'af-picker');
        const text = S.el('span', '', node);
        S.el('i', 'draft-arrow', node);
        for (let i = 0; i < 4; i++) S.el('i', 'draft-picker-handle', node);
        node.setAttribute('aria-label', label);
        node.setAttribute('aria-haspopup', 'listbox');
        return { node, text, label: '' };
      },
      voucher: (base, S) => (parent) => {
        const { el, spec: s, task: F } = S;
        const paper = el('div', 'af-paper draft-paper', parent);
        const head = el('div', 'draft-dochead', paper);
        const company = el('div', '', head);
        el('h3', '', company, s.company);
        el('div', '', company, '742 Market Street');
        el('div', '', company, 'Portland, OR 97205');
        el('div', '', company, '(503) 555-0199');
        el('strong', 'draft-watermark', head, 'INVOICE');
        const info = el('div', 'draft-docmeta', paper);
        const to = el('div', '', info);
        el('b', '', to, 'Bill To:');
        el('div', '', to, 'Finance Operations');
        el('div', '', to, '1200 Pine Avenue');
        el('div', '', to, 'Portland, OR 97205');
        const meta = el('div', '', info);
        for (const [k, v] of [['Invoice No:', s.ref], ['Date:', '09/30/2026'], ['Terms:', 'Net 30']]) {
          const row = el('div', 'draft-docpair', meta); el('span', '', row, k); el('span', '', row, v);
        }
        const table = el('table', 'draft-voucher-table', paper);
        const th = el('tr', '', el('thead', '', table));
        for (const t of ['Account / Description', 'Debit', 'Credit']) el('th', '', th, t);
        const tb = el('tbody', '', table);
        s.voucher.rows.forEach(r => {
          const row = el('tr', '', tb);
          el('td', '', row, r.account);
          el('td', '', row, r.debit ? F.helpers.money(r.debit) : '');
          el('td', '', row, r.credit ? F.helpers.money(r.credit) : '');
        });
        const totals = el('div', 'draft-doctotals', paper);
        const debit = s.voucher.rows.reduce((a, r) => a + (r.debit || 0), 0);
        const credit = s.voucher.rows.reduce((a, r) => a + (r.credit || 0), 0);
        S.P.kv(totals, 'Total Debit', F.helpers.money(debit));
        S.P.kv(totals, 'Total Credit', F.helpers.money(credit));
        const memo = el('div', 'draft-source-memo', paper);
        el('b', '', memo, 'Memo: '); el('span', '', memo, s.voucher.memo);
        if (s.disabled.length) el('div', 'af-warning', paper, 'Period lock · ' + s.disabled[0] + ' is unavailable. No substitute account is authorized.');
        el('div', 'draft-controlnote', paper, 'Journal control: total debits must equal total credits. Each line uses one side only. ' + s.note);
      },
      journalRow: (base, S) => (edit, i) => {
        const line = base(edit, i);
        for (const label of ['Project', 'Department']) {
          const field = S.el('div', 'draft-choice', line);
          field.setAttribute('aria-label', label + ' (optional)');
          S.el('i', 'draft-arrow', field);
        }
        return line;
      },
      renderJournal: (base, S) => () => {
        const { P, el, spec: s } = S;
        const source = P.scroll(P.column('Source Voucher'), 'source');
        P.voucher(source.content);
        const edit = P.scroll(P.column('Journal Entry'), 'editor');
        edit.content.classList.add('draft-editor-content');
        const meta = el('div', 'draft-entrymeta', edit.content);
        el('span', '', meta, 'Date');
        const date = el('div', 'draft-date', meta, '09/30/2026');
        P.icon(el('span', 'draft-calendar', date), 'calendar');
        el('span', 'draft-ref-label', meta, 'Reference');
        const ref = el('input', 'af-input draft-ref', meta);
        ref.type = 'text'; ref.setAttribute('aria-label', 'Reference (optional)');
        const table = el('div', 'draft-entrytable', edit.content);
        const th = el('div', 'af-entryhead', table);
        for (const t of ['#', 'Account', 'Debit', 'Credit', 'Project', 'Department']) el('span', '', th, t);
        const rowTarget = { ...edit, content: table };
        s.goal.rows.forEach((r, i) => P.journalRow(rowTarget, i));
        const bottom = el('div', 'draft-entrybottom', edit.content);
        const memoBox = el('div', 'af-memo', bottom);
        el('label', 'af-label', memoBox, 'Memo');
        S.memo = el('textarea', 'af-input', memoBox);
        S.memo.setAttribute('aria-label', 'Memo');
        S.register({ memo: true }, S.memo);
        edit.positions.memo = S.memo;
        S.memo.addEventListener('input', () => P.change({ memo: S.memo.value }));
        S.entryTotal = el('div', 'draft-totals', bottom);
      },
      syncJournal: (base, S) => (model) => {
        const { debit, credit } = S.task.helpers.totals(model, S.spec);
        S.entryTotal.replaceChildren();
        for (const [label, value] of [['Total Debit', debit], ['Total Credit', credit], ['Out of Balance', Math.abs(debit - credit)]]) {
          S.P.kv(S.entryTotal, label, S.task.helpers.money(value).replace('$', ''));
        }
      },
      inspector: (base, S) => () => {
        const { el, spec: s, task: F } = S;
        const rail = el('aside', 'af-inspector', S.shell);
        el('div', 'draft-title', rail, 'Details');
        const body = el('div', 'af-inspectorbody', rail);
        const note = document.querySelector('.ref-panel');
        if (note) body.appendChild(note);
        const total = s.voucher.rows.reduce((a, r) => a + (r.debit || 0), 0);
        for (const [k, v] of [['Vendor', s.company], ['Invoice No.', s.ref], ['Invoice Date', '09/30/2026'], ['Due Date', '10/30/2026'], ['Total Amount', F.helpers.money(total)], ['Currency', 'USD']]) S.P.kv(body, k, v);
        el('hr', '', body);
        for (const [k, v] of [['Expense Category', 'Office Supplies'], ['Project', s.projects[0]], ['Department', 'Administration'], ['Payment Terms', 'Net 30']]) S.P.kv(body, k, v);
        const status = S.P.kv(body, 'Status', '');
        status.lastChild.replaceWith(S.statusBadge);
        const attachment = S.P.kv(body, 'Attachments', '');
        const link = S.P.button(attachment, s.ref + '.pdf', () => S.P.showPanel('Source voucher', panel => S.P.voucher(panel)), 'draft-attachment');
        S.P.icon(link, 'clip');
        attachment.querySelector('b').replaceWith(link);
      },
      footer: (base, S) => () => {
        base();
        S.panes.editor.content.appendChild(S.main.querySelector('.af-footer'));
        const lower = S.el('div', 'draft-lower', S.root);
        const table = (title, headers, records, bank) => {
          const panel = S.el('section', 'draft-ledger-panel', lower);
          S.el('div', 'draft-table-title', panel, title);
          const body = S.el('div', 'draft-ledger-body', panel);
          const table = S.el('table', 'draft-ledger', body);
          const th = S.el('tr', '', S.el('thead', '', table));
          headers.forEach(h => S.el('th', '', th, h));
          const tb = S.el('tbody', '', table);
          records.forEach((r, i) => {
            const row = S.el('tr', bank && i === 2 ? 'selected' : '', tb);
            const values = bank ? [r.date, r.company, '-' + S.task.helpers.money(r.amount)] : [r.date, r.ref.replace('AP-', 'JE-'), ['March rent', 'Utilities', 'Office supplies', 'Consulting income', 'Internet service'][i], S.task.helpers.money(r.amount), S.task.helpers.money(r.amount)];
            values.forEach(v => S.el('td', '', row, v));
          });
          const scroll = S.el('div', 'draft-scrollbar', panel);
          S.el('span', '', scroll, '▲'); S.el('i', '', scroll); S.el('span', '', scroll, '▼');
        };
        table('Bank Transactions (Unreconciled)', ['Date', 'Description', 'Amount'], S.background.slice(0, 5), true);
        table('Recent Journal Entries', ['Date', 'Reference', 'Memo', 'Debit', 'Credit'], S.background.slice(2, 7), false);
        for (const parent of [S.root, S.main, lower]) {
          const handles = S.el('div', 'draft-handles', parent);
          for (let i = 0; i < 4; i++) S.el('i', '', handles);
        }
      },
    },
  },
});
