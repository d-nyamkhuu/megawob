// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-approve-01',
  name: 'design',
  split: 'train',
  scenarios: ['approve'],
  template: 'use-accounting/workspace',
  design: {
    inset: 0, radius: 0, inspectorMinWidth: 0,
    workspaceLabel: 'Accounts Payable',
    font: '16px/1.25 Arial, sans-serif',
    parts: {
      top: () => () => {}, sidebar: () => () => {}, navigation: () => () => {}, toolbar: () => () => {},
      heading: (base, S) => () => {
        const hidden = S.el('div', 'ap-internal', S.main);
        S.statusBadge = S.el('span', '', hidden);
        S.metrics = S.el('div', '', hidden);
      },
      renderApprove: (base, S) => () => {
        const {el, P, spec: s} = S;
        const invoice = el('section', 'ap-box ap-invoice-panel', S.work);
        S.current.apInvoicePanel = invoice;
        el('h2', 'ap-bar', invoice, 'Invoice');
        const top = el('div', 'ap-invoice-body', invoice);
        const selector = el('div', 'ap-selector', top);
        const head = el('div', 'ap-invoice-head', selector);
        ['Invoice #', 'Vendor', 'Date', 'Amount', 'Status'].forEach(t => el('b', '', head, t));
        const source = P.scroll(selector, 'source');
        s.invoices.forEach((r, i) => P.invoiceRow(source, r, i));
        S.invoiceDetail = el('div', 'ap-detail', top);
        P.approvalPolicy(S.work);
        const lower = el('div', 'ap-lower', S.work);
        const staff = el('section', 'ap-box ap-staff', lower);
        el('h2', 'ap-bar', staff, 'Staff Directory');
        const staffHead = el('div', 'ap-staff-head', staff);
        ['Name', 'Title', 'Department'].forEach(t => el('b', '', staffHead, t));
        const editor = P.scroll(staff, 'editor');
        for (const p of s.staff) P.approverRow(editor, p);
        const actions = el('div', 'ap-transfer', lower);
        S.current.apFocusedPerson = s.staff.find(p => p.available)?.id;
        const add = P.button(actions, 'Add >', () => {
          const p = s.staff.find(p => p.id === S.current.apFocusedPerson && p.available && !S.ctx.model.selected.includes(p.id));
          if (p) P.change({person: p.id});
        });
        S.current.apAdd = add;
        const remove = P.button(actions, '< Remove', () => {
          if (S.ctx.model.selected.length) P.change({remove: S.ctx.model.selected.length - 1});
        });
        S.current.apRemove = remove;
        const route = el('section', 'ap-box ap-route-panel', lower);
        S.current.apRoutePanel = route;
        el('h2', 'ap-bar', route, 'Approval Route (in order)');
        const routeHead = el('div', 'ap-route-head', route);
        ['#', 'Approver', 'Title', 'Required By'].forEach(t => el('b', '', routeHead, t));
        S.routeBox = el('div', 'af-route ap-route-body', route);
      },
      invoiceRow: (base, S) => (source, r, i) => {
        const b = S.P.button(source.content, '', () => S.P.change({active: i}), 'af-invoice ap-invoice-row');
        S.invoices[i] = b; S.register({invoice: i}, b); source.positions['invoice:' + i] = b;
        const date = String(r.date || r.due).replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
        [r.id, r.merchant, date, S.task.helpers.money(r.amount), 'Pending'].forEach(t => S.el('span', '', b, t));
        S.P.item(b, r); return b;
      },
      approvalPolicy: (base, S) => parent => {
        const {el, spec: s, task: F} = S;
        const box = el('section', 'ap-box ap-policy', parent);
        el('h2', 'ap-bar', box, 'Amount-Threshold Approval Policy');
        const table = el('table', 'ap-policy-table', box);
        const head = el('tr', '', el('thead', '', table));
        ['Minimum Amount', 'Maximum Amount', 'Required Approver(s)'].forEach(t => el('th', '', head, t));
        const body = el('tbody', '', table);
        [[0, s.policy.controller - 1, 'Budget owner'],
          [s.policy.controller, s.policy.director - 1, 'Budget owner, Controller'],
          [s.policy.director, null, 'Budget owner, Controller, Finance director']].forEach(([min, max, roles]) => {
          const tr = el('tr', '', body);
          [F.helpers.money(min), max === null ? 'and above' : F.helpers.money(max), roles].forEach(t => el('td', '', tr, t));
        });
      },
      approverRow: (base, S) => (editor, p) => {
        const row = S.P.button(editor.content, '', () => S.P.change({person: p.id}), 'ap-person');
        row.setAttribute('aria-label', 'Add ' + p.name);
        row.addEventListener('focus', () => { S.current.apFocusedPerson = p.id; S.current.apAdd.disabled = !p.available || S.ctx.model.selected.includes(p.id); });
        S.el('span', '', row, p.name);
        S.el('span', '', row, p.role + (!p.available ? ' · Unavailable' : ''));
        S.el('span', '', row, /budget/i.test(p.role) ? 'Operations' : 'Finance');
        row.disabled = !p.available;
        S.people[p.id] = row; S.register({person: p.id}, row); editor.positions[p.id] = row;
        S.P.item(row, p); return row;
      },
      syncSelection: (base, S) => m => {
        for (const [i, b] of Object.entries(S.invoices)) {
          b.classList.toggle('selected', Number(i) === m.active);
          b.lastChild.textContent = m.final && Number(i) === m.active ? S.task.helpers.status(m, S.spec) : 'Pending';
        }
        for (const [id, b] of Object.entries(S.people)) {
          b.classList.toggle('ap-added', m.selected.includes(id));
          b.disabled = !S.spec.staff.find(p => p.id === id).available || m.selected.includes(id);
        }
        S.current.apRemove.disabled = !m.selected.length;
        S.current.apAdd.disabled = !S.current.apFocusedPerson || m.selected.includes(S.current.apFocusedPerson);
      },
      syncInvoice: (base, S) => m => {
        const r = S.spec.invoices[m.active], {el} = S;
        const field = (parent, label, value, cls = '') => {
          const row = el('div', 'ap-field ' + cls, parent);
          el('span', '', row, label); el('div', 'ap-value', row, value);
        };
        S.invoiceDetail.replaceChildren();
        el('h3', 'ap-detail-title', S.invoiceDetail, 'Invoice Details');
        const date = value => String(value).replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
        [['Invoice #:', r.id], ['Vendor:', r.merchant], ['Invoice Date:', date(r.date || r.due)],
          ['Due Date:', date(r.due)], ['Amount:', S.task.helpers.money(r.amount)],
          ['Description:', r.description || 'Equipment, parts and supplies']].forEach(([k,v]) => field(S.invoiceDetail, k, v));
        const rail = S.current.apInspector;
        if (!rail) return;
        rail.replaceChildren();
        const panel = title => {const p = el('section', 'ap-box ap-inspect-box', rail); el('h2', 'ap-bar', p, title); return el('div', 'ap-inspect-content', p);};
        const vendor = panel('Vendor Details');
        [['Vendor:', r.merchant], ['Vendor ID:', r.vendorId || 'V-1004'], ['Address:', '2750 Commerce Blvd.\nRaleigh, NC 27601'],
          ['Phone:', '(919) 555-0187'], ['Terms:', 'Net 30'], ['Default Account:', S.spec.accounts[0]]].forEach(([k,v]) => field(vendor,k,v,k === 'Address:' ? 'ap-address' : ''));
        const totals = panel('Invoice Totals');
        [['Subtotal:', S.task.helpers.money(r.amount)], ['Tax (0.0%):', S.task.helpers.money(0)], ['Total:', S.task.helpers.money(r.amount)]].forEach(([k,v]) => field(totals,k,v));
        const coding = panel('Coding');
        [['Account:', S.spec.accounts[0]], ['Project:', S.spec.projects[0]], ['Department:', 'Operations']].forEach(([k,v]) => field(coding,k,v,'ap-combo'));
        const notes = panel('Notes');
        if (S.current.apTaskNote) notes.appendChild(S.current.apTaskNote);
        else el('div', 'ap-notes-text', notes, r.notes || 'Parts and supplies. Supporting documents on file.');
      },
      inspector: (base, S) => () => {
        S.current.apInspector = S.el('aside', 'ap-properties', S.shell);
        const note = document.querySelector('.ref-panel');
        if (note) {
          S.current.apTaskNote = note;
          S.current.apInspector.appendChild(note);
        }
      },
      syncRoute: (base, S) => m => {
        base(m);
        if (!m.selected.length) S.routeBox.firstChild.textContent = 'No approvers added yet.';
        S.routeBox.classList.toggle('ap-empty', !m.selected.length);
      },
      routeChip: (base, S) => (id, i) => {
        const chip = base(id, i), person = S.spec.staff.find(p => p.id === id);
        const remove = chip.lastChild;
        chip.firstChild.textContent = '';
        [String(i + 1), person.name, person.role, 'Policy'].forEach(t => S.el('span', '', chip, t));
        chip.appendChild(remove); return chip;
      },
      footer: (base, S) => () => {
        base();
        const footer = S.main.querySelector('.af-footer');
        S.current.apRoutePanel.appendChild(footer);
        S.current.apInvoicePanel.appendChild(S.footerNotice);
        S.footerNotice.classList.add('ap-payment-notice');
      },
      syncFooter: (base, S) => m => {
        base(m);
        S.footerNotice.hidden = !m.notice && !m.final;
      },
    },
  },
});
