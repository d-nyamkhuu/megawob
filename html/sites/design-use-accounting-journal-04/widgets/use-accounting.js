// Tablet split view; task fields and locate targets remain in the shared template.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-journal-04',
  name: 'design',
  split: 'train',
  scenarios: ['journal'],
  template: 'use-accounting/workspace',
  design: {
      inset: 0, radius: 0, inspectorMinWidth: 0,
      font: '16px/1.35 -apple-system, BlinkMacSystemFont, Arial, sans-serif',
      bg: '#edf2f7', panel: '#fff', fg: '#0b1428', muted: '#6a7891',
      line: '#d8e0eb', accent: '#007aff',
      commitLabels: { journal: 'Post Journal Entry' },
    parts: {
      frame: (base, S) => ctx => {
        const node = base(ctx);
        const header = document.querySelector('.ref-task');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const extraHeader = document.body.classList.contains('finance-header-note') ? Math.max(0, headerHeight - 58) : 0;
        const compactReserve = ctx.size.width < 1250 ? 36 : 0;
        node.style.setProperty('--fj-density', String(Math.min(1, (ctx.size.height - extraHeader - compactReserve) / 941, ctx.size.width / 1546)));
        node.style.setProperty('--fj-header-height', headerHeight + 'px');
        return node;
      },
      top: () => () => {}, sidebar: () => () => {}, navigation: () => () => {}, toolbar: () => () => {},
      heading: (base, S) => () => {
        S.el('h1', 'fj-title', S.main, 'Journal Entry');
        S.statusBadge = S.el('span', 'fj-internal', S.main);
        S.metrics = S.el('div', 'fj-internal', S.main);
      },
      voucher: (base, S) => parent => {
        const { el, spec: s, task: F } = S;
        const layout = el('div', 'fj-voucher-layout', parent);
        const paper = el('div', 'fj-invoice', layout);
        const top = el('div', 'fj-invoice-top', paper);
        const brand = el('div', '', top);
        el('strong', '', brand, s.company);
        el('div', '', brand, 'Finance Operations');
        el('div', '', brand, 'Accrual voucher');
        const number = el('div', 'fj-invoice-number', top);
        el('b', '', number, 'VOUCHER'); el('div', '', number, s.ref);
        el('div', '', number, 'Sep 30, 2026');
        const table = el('div', 'fj-invoice-table', paper);
        const head = el('div', 'fj-invoice-line fj-invoice-head', table);
        ['Account', 'Debit', 'Credit'].forEach(t => el('b', '', head, t));
        for (const r of s.voucher.rows) {
          const row = el('div', 'fj-invoice-line', table);
          el('span', '', row, r.account);
          el('span', '', row, r.debit ? F.helpers.money(r.debit) : '—');
          el('span', '', row, r.credit ? F.helpers.money(r.credit) : '—');
        }
        const total = s.voucher.rows.reduce((sum, r) => sum + (r.debit || 0), 0);
        const foot = el('div', 'fj-invoice-total', paper);
        el('b', '', foot, 'Total'); el('b', '', foot, F.helpers.money(total));
        const summary = el('div', 'fj-voucher-summary', layout);
        for (const [label, value] of [['Vendor', s.company], ['Voucher #', s.ref], ['Effective Date', 'Sep 30, 2026'], ['Total Amount', F.helpers.money(total)], ['Memo', s.voucher.memo]]) {
          const row = el('div', 'fj-summary-row', summary);
          el('span', '', row, label); el('span', '', row, value);
        }
      },
      journalRow: (base, S) => (edit, i) => {
        const line = base(edit, i);
        const description = S.el('input', 'fj-description af-input', line);
        description.setAttribute('aria-label', 'Line ' + (i + 1) + ' description');
        line.insertBefore(description, line.children[2]);
        const remove = S.P.iconButton(line, '', 'close', () => {
          for (const key of ['account', 'debit', 'credit']) S.P.change({ field: [i, key], value: '' });
          description.value = '';
        }, 'fj-delete');
        remove.setAttribute('aria-label', 'Clear line ' + (i + 1));
        remove.title = 'Clear line ' + (i + 1);
        remove.firstChild.firstChild.setAttribute('d', 'M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 10v8m4-8v8');
        return line;
      },
      pickerControl: (base, S) => (parent, label, action) => base(parent, label === 'Choose account' ? 'Select account…' : label, action),
      renderJournal: (base, S) => () => {
        const { el, P, spec: s } = S;
        const source = P.scroll(P.column('Source Voucher'), 'source');
        source.pane.closest('.af-column').classList.add('fj-source');
        P.voucher(source.content);
        if (s.disabled.length) el('div', 'af-warning', source.content, 'Period lock · ' + s.disabled[0] + ' is unavailable. No substitute account is authorized.');
        if (s.note) el('div', 'fj-control-note', source.content.querySelector('.fj-voucher-summary'), s.note);
        const edit = P.scroll(P.column('Journal Entry Lines'), 'editor');
        edit.pane.closest('.af-column').classList.add('fj-editor');
        const th = el('div', 'af-entryhead', edit.content);
        ['#', 'Account', 'Description', 'Debit (USD)', 'Credit (USD)', ''].forEach(t => el('span', '', th, t));
        s.goal.rows.forEach((r, i) => P.journalRow(edit, i));
        const add = P.iconButton(edit.content, 'Add line', 'plus', () => {
          const blank = el('div', 'af-entry fj-extra-line');
          el('span', '', blank, String(edit.content.querySelectorAll('.af-entry').length + 1));
          const account = P.pickerControl(blank, 'Select account…', () => P.showPanel('Additional line', panel => el('p', '', panel, 'Use the voucher lines above to record this entry.')));
          for (const label of ['Description', 'Debit', 'Credit']) { const input = el('input', 'af-input', blank); input.setAttribute('aria-label', label); if (label !== 'Description') input.placeholder = '0.00'; }
          P.iconButton(blank, '', 'close', () => blank.remove(), 'fj-delete');
          edit.content.insertBefore(blank, add);
        }, 'fj-add');
        const memoBox = el('div', 'af-memo', edit.content);
        el('label', 'af-label', memoBox, 'Memo');
        S.memo = el('textarea', 'af-input', memoBox); S.memo.maxLength = 500;
        S.memo.setAttribute('aria-label', 'Memo'); S.register({ memo: true }, S.memo);
        edit.positions.memo = S.memo;
        const count = el('span', 'fj-count', memoBox, '0 / 500');
        S.memo.addEventListener('input', () => { count.textContent = S.memo.value.length + ' / 500'; P.change({ memo: S.memo.value }); });
        S.entryTotal = el('div', 'fj-totals', edit.content);
      },
      footer: (base, S) => () => {
        base();
        const footer = S.main.querySelector('.af-footer');
        S.panes.editor.pane.closest('.af-column').appendChild(footer);
        footer.insertBefore(S.entryTotal, footer.firstChild);
      },
      syncJournal: (base, S) => m => {
        base(m);
        const t = S.task.helpers.totals(m, S.spec);
        S.entryTotal.replaceChildren();
        for (const [label, value] of [['Total Debit', t.debit], ['Total Credit', t.credit]]) {
          const row = S.el('div', '', S.entryTotal);
          S.el('span', '', row, label); S.el('span', '', row, (value / 100).toFixed(2));
        }
      },
      inspector: (base, S) => () => {
        const { el, P, spec: s, task: F } = S;
        const pane = el('aside', 'fj-related', S.shell);
        const sideNote = document.querySelector('.finance-pending-note');
        if (sideNote) {
          sideNote.classList.remove('finance-pending-note');
          pane.appendChild(sideNote);
        }
        el('h2', '', pane, 'Bills & Vouchers');
        const searchBox = el('div', 'fj-search', pane); P.icon(searchBox, 'search');
        const search = el('input', '', searchBox); search.placeholder = 'Search bills and vouchers'; search.setAttribute('aria-label', search.placeholder);
        const filters = el('div', 'fj-filters', pane);
        const list = el('div', 'fj-bills', pane);
        const amount = s.voucher.rows.reduce((sum, r) => sum + (r.debit || 0), 0);
        const records = [{ company: s.company, ref: s.ref, date: '2026-09-30', amount, status: 'Unposted' }, ...S.background.map((r, i) => ({ ...r, status: i % 3 === 0 ? 'Unposted' : 'Posted' }))];
        let filter = 'All', selected = s.ref;
        const draw = () => {
          list.replaceChildren();
          const query = search.value.toLowerCase();
          for (const r of records.filter(r => (filter === 'All' || filter === r.status) && (r.company + r.ref).toLowerCase().includes(query))) {
            const row = P.button(list, '', () => { selected = r.ref; draw(); if (r.ref !== s.ref) P.showPanel(r.company, panel => { P.kv(panel, 'Voucher', r.ref); P.kv(panel, 'Date', r.date); P.kv(panel, 'Amount', F.helpers.money(r.amount)); P.kv(panel, 'Status', r.status); }); }, 'fj-bill' + (r.ref === selected ? ' selected' : ''));
            const icon = el('span', 'fj-bill-icon', row); P.icon(icon, 'invoice');
            const date = r.date.split('-');
            const dateLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(date[1]) - 1] + ' ' + Number(date[2]) + ', ' + date[0];
            const info = el('span', 'fj-bill-info', row); el('span', 'fj-bill-name', info, r.company); el('span', 'fj-bill-meta', info, '#' + r.ref + '  •  ' + dateLabel);
            const right = el('span', 'fj-bill-right', row); el('span', '', right, F.helpers.money(r.amount)); el('span', 'fj-bill-status ' + r.status.toLowerCase(), right, r.status);
          }
        };
        for (const text of ['All', 'Unposted', 'Posted', 'Approved']) {
          const button = P.button(filters, text, () => { filter = text; for (const b of filters.children) b.classList.toggle('selected', b === button); draw(); }, text === 'All' ? 'selected' : '');
        }
        search.addEventListener('input', draw); draw();
      },
    },
  },
});
