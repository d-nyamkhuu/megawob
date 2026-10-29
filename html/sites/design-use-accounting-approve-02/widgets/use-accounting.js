// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-approve-02',
  name: 'design',
  split: 'train',
  scenarios: ['approve'],
  template: 'use-accounting/workspace',
  design: {
      inset: 0, radius: 0, brand: 'LedgerPro', logo: 'Q',
      panel: '#fcfdfe', bg: '#eef1f5', fg: '#30394c', muted: '#657189',
      line: '#cbd3df', accent: '#ed6c00', font: '14px/1.3 "Arial Narrow", "Liberation Sans Narrow", Arial, sans-serif',
      commitLabels: { approve: 'Approve Payment' },
    parts: {
      top: () => () => {},
      sidebar: () => () => {},
      navigation: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      inspector: () => () => {},
      syncStatus: () => () => {},
      syncMetrics: () => () => {},
      renderApprove: (base, S) => () => {
        const { el, P, spec: s } = S;
        const search = (parent, placeholder) => {
          const bar = el('div', 'lp-search', parent);
          P.icon(bar, 'search');
          const input = el('input', '', bar); input.placeholder = placeholder;
          input.setAttribute('aria-label', placeholder);
          return input;
        };
        const sourceCol = P.column('Invoices'); sourceCol.classList.add('lp-invoices');
        const filters = el('div', 'lp-filters', sourceCol);
        const query = search(filters, 'Search invoices...');
        P.button(filters, 'All Invoices　⌄', () => { query.value = ''; query.dispatchEvent(new Event('input')); }, 'lp-all');
        const columns = ['Invoice No.', 'Date', 'Vendor', 'Amount', 'Status'];
        const head = el('div', 'lp-invoice-head', sourceCol);
        columns.forEach(label => el('span', '', head, label));
        const source = P.scroll(sourceCol, 'source');
        const related = r => {
          const row = el('div', 'lp-related lp-invoice-row', source.content);
          const date = r.date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, month, day) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month) - 1] + ' ' + Number(day) + ', ' + y);
          [r.ref, date, r.company, S.task.helpers.money(r.amount), 'Pending'].forEach((v, i) => el('span', i === 4 ? 'lp-pending' : '', row, v));
        };
        S.background.forEach(related);
        s.invoices.forEach((r, i) => P.invoiceRow(source, r, i));
        S.background.slice(0, 2).forEach((r, i) => related({ ...r, ref: 'AP-' + (4827 + i) }));
        query.addEventListener('input', () => {
          for (const row of source.content.children) row.hidden = !row.textContent.toLowerCase().includes(query.value.toLowerCase());
          source.refresh();
        });
        const details = P.column('Invoice Details'); details.classList.add('lp-details');
        S.invoiceDetail = el('div', 'lp-detail-body', details);
        const right = el('div', 'lp-right', S.work);
        const policy = el('section', 'af-column lp-policy', right);
        el('div', 'af-colhead', policy, 'Approval Policy');
        P.approvalPolicy(policy);
        const lower = el('div', 'lp-lower', right);
        const staff = el('section', 'af-column lp-staff', lower);
        el('div', 'af-colhead', staff, 'Staff');
        const staffQuery = search(staff, 'Search staff...');
        const staffHead = el('div', 'lp-staff-head', staff);
        ['Name', 'Title', 'Department'].forEach(v => el('span', '', staffHead, v));
        const editor = P.scroll(staff, 'editor');
        s.staff.forEach(p => P.approverRow(editor, p));
        staffQuery.addEventListener('input', () => {
          for (const row of editor.content.children) row.hidden = !row.textContent.toLowerCase().includes(staffQuery.value.toLowerCase());
          editor.refresh();
        });
        const route = el('section', 'af-column lp-route-panel', lower);
        el('div', 'af-colhead', route, 'Approval Route');
        const routeHead = el('div', 'lp-route-head', route);
        ['Order', 'Approver', 'Action'].forEach(v => el('span', '', routeHead, v));
        S.routeBox = el('div', 'af-route', route);
        S.current.routePanel = route;
        const tools = el('div', 'lp-route-tools', route);
        P.button(tools, 'Add to Route', () => {
          const candidate = s.staff.find(p => p.available && !S.ctx.model.selected.includes(p.id));
          if (candidate) S.people[candidate.id].click();
        }, 'primary');
        const remove = P.button(tools, 'Remove', () => {
          const n = S.ctx.model.selected.length;
          if (n) P.change({ remove: n - 1 });
        });
        S.current.removeLast = remove;
        for (const label of ['Move Up', 'Move Down']) {
          const b = P.button(tools, label, () => {}); b.disabled = true;
        }
      },
      invoiceRow: (base, S) => (source, r, i) => {
        const row = base(source, r, i); row.replaceChildren(); row.classList.add('lp-invoice-row');
        const date = (r.date || r.due).replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, month, day) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month) - 1] + ' ' + Number(day) + ', ' + y);
        [r.id, date, r.merchant, S.task.helpers.money(r.amount), 'Pending'].forEach((v, j) => S.el('span', j === 4 ? 'lp-pending' : '', row, v));
        return row;
      },
      approvalPolicy: (base, S) => parent => {
        const { el, spec: s, task: F } = S;
        const threshold = amount => F.helpers.money(amount).replace(/\.00$/, '');
        const body = el('div', 'lp-policy-body', parent);
        el('p', '', body, 'Expense approvals are based on total invoice amount (USD).');
        const table = el('table', 'lp-policy-table', body);
        const head = el('tr', '', table);
        ['Amount Range', 'Required Approvals'].forEach(v => el('th', '', head, v));
        const rows = [
          ['Below ' + threshold(s.policy.controller), '1 — Budget owner'],
          [threshold(s.policy.controller) + ' – < ' + threshold(s.policy.director), '1 — Budget owner, 1 — Controller'],
          [threshold(s.policy.director) + ' and above', '1 — Budget owner, 1 — Controller, 1 — Finance director'],
        ];
        rows.forEach(values => { const row = el('tr', '', table); values.forEach(v => el('td', '', row, v)); });
        el('div', 'lp-policy-note', body, 'Add required roles in this order. No substitutions. AP assistants cannot authorize payment.');
      },
      approverRow: (base, S) => (editor, p) => {
        const row = base(editor, p), button = S.people[p.id];
        row.title = p.name + ' — ' + p.role + (!p.available ? ' (Unavailable)' : '');
        row.replaceChildren(button); button.classList.add('lp-staff-button');
        const label = S.el('span', 'lp-staff-label', button);
        [p.name, p.role + (!p.available ? ' (Unavailable)' : ''), p.department || (/owner/i.test(p.role) ? 'Operations' : 'Finance')].forEach(v => S.el('span', '', label, v));
        row.append(label);
        button.setAttribute('aria-label', 'Add ' + p.name + ', ' + p.role);
        return row;
      },
      syncInvoice: (base, S) => m => {
        const { el, spec: s, task: F } = S, r = s.invoices[m.active];
        const date = value => value ? value.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, month, day) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month) - 1] + ' ' + Number(day) + ', ' + y) : '—';
        const facts = [
          ['Invoice No.', r.id], ['Vendor', r.merchant], ['Invoice Date', date(r.date)],
          ['Due Date', date(r.due)], ['Terms', 'Net 30'], ['Department', r.department || 'Finance'],
          ['Project', r.project || s.projects[0]], ['Memo', r.memo || 'Invoice for ' + r.merchant],
        ];
        S.invoiceDetail.replaceChildren();
        facts.forEach(([label, value], i) => {
          const row = el('div', 'lp-detail-row' + (i === 7 ? ' lp-memo' : ''), S.invoiceDetail);
          el('span', '', row, label); const text = el('div', i > 1 ? 'lp-readonly' : '', row, value);
          if (i === 2 || i === 3) el('span', 'lp-field-icon', text, '▦');
          if (i > 3 && i < 7) el('span', 'lp-field-icon', text, '⌄');
        });
        const lines = el('table', 'lp-lines', S.invoiceDetail);
        const header = el('tr', '', lines); ['Description', 'Amount'].forEach(v => el('th', '', header, v));
        const line = el('tr', '', lines); el('td', '', line, 'Invoice charges'); el('td', '', line, F.helpers.money(r.amount));
        for (let i = 0; i < 2; i++) { const blank = el('tr', 'lp-blank-line', lines); blank.setAttribute('aria-hidden', 'true'); el('td', '', blank, '\u00a0'); el('td', '', blank, '\u00a0'); }
        const totals = el('div', 'lp-detail-total', S.invoiceDetail);
        [['Subtotal', F.helpers.money(r.amount)], ['Tax', '—'], ['Total (USD)', F.helpers.money(r.amount)]].forEach(([key, value]) => { const row = el('div', '', totals); el('span', '', row, key); el('strong', '', row, value); });
        const doc = document;
        doc.querySelector('.fin-invoice-title').textContent = 'Invoice　 ' + r.id;
        doc.querySelector('.fin-vendor').textContent = r.merchant;
        const values = [date(r.date), r.id.replace('INV-', 'V-'), date(r.due), r.id.replace('INV-', 'PO-'), F.helpers.money(r.amount), r.department || 'Finance', 'Net 30', r.project || s.projects[0]];
        doc.querySelectorAll('.fin-fact-value').forEach((node, i) => { node.textContent = values[i]; });
        const mark = doc.querySelector('.fin-preview-mark'); mark.replaceChildren();
        el('span', 'fin-paper-logo', mark, '▥'); el('span', 'fin-paper-vendor', mark, r.merchant); el('b', '', mark, 'INVOICE');
        doc.querySelector('.fin-preview-lines').textContent = 'Invoice No.　　　' + r.id + '\n\nVendor: ' + r.merchant + '\n\nDue date: ' + r.due + '\n\nDescription　　　 Amount\n\nInvoice total　　　' + F.helpers.money(r.amount);
        const preview = doc.querySelector('.fin-invoice-preview');
        preview.querySelector('.fin-paper-table')?.remove();
        const paperTable = el('table', 'fin-paper-table', preview);
        [['Description', 'Quantity', 'Amount'], [r.merchant, '1', F.helpers.money(r.amount)], ['Payment terms', 'Net 30', ''], ['Total', '', F.helpers.money(r.amount)]].forEach((values, i) => { const row = el('tr', '', paperTable); values.forEach(v => el(i ? 'td' : 'th', '', row, v)); });
        const total = doc.querySelector('.fin-preview-total'); total.replaceChildren();
        [['Subtotal', F.helpers.money(r.amount)], ['Tax', '—'], ['Total', F.helpers.money(r.amount)]].forEach(([k, v], i) => { const row = el(i === 2 ? 'strong' : 'span', '', total); el('span', '', row, k); el('b', '', row, v); });
        doc.querySelector('.fin-status').textContent = m.final ? 'Approved' : 'Pending Approval';
      },
      footer: (base, S) => () => {
        base();
        const footer = S.main.querySelector('.af-footer');
        S.current.routePanel.insertBefore(footer, S.current.routePanel.querySelector('.lp-route-tools'));
      },
      syncRoute: (base, S) => m => {
        base(m);
        if (!m.selected.length) S.routeBox.firstChild.textContent = 'No approvers added';
        S.current.removeLast.disabled = !m.selected.length;
        S.current.routePanel.classList.toggle('lp-has-route', !!m.selected.length);
      },
      syncFooter: (base, S) => m => {
        base(m);
        S.footerNotice.parentElement.classList.toggle('lp-has-notice', !!m.notice || !!m.final);
      },
      routeChip: (base, S) => (id, i) => {
        const chip = base(id, i), p = S.spec.staff.find(p => p.id === id);
        chip.firstChild.textContent = (i + 1) + '.  ' + p.name + ' — ' + p.role;
        return chip;
      },
    },
  },
});
