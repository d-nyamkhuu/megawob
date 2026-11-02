// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-approve-05',
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
        S.current.apWindowTitle = el('div', 'ap-window-title', S.work, 'Approve Invoice   -   ' + s.invoices[0].id);
        const close = el('span', 'ap-window-close', S.current.apWindowTitle, '×');
        close.setAttribute('aria-hidden','true');
        const invoice = el('section', 'ap-box ap-invoice-panel', S.work);
        S.current.apInvoicePanel = invoice;
        const top = el('div', 'ap-invoice-body', invoice);
        const recent = document.querySelector('.ap-summary-recent');
        recent.replaceChildren();
        const selector = el('div', 'ap-selector', recent);
        const source = P.scroll(selector, 'source');
        s.invoices.forEach((r, i) => P.invoiceRow(source, r, i));
        S.invoiceDetail = el('div', 'ap-detail', top);
        P.approvalPolicy(S.work);
        const lower = el('div', 'ap-lower', S.work);
        const staff = el('section', 'ap-box ap-staff', lower);
        el('h2', 'ap-bar', staff, 'Available Staff');
        const staffHead = el('div', 'ap-staff-head', staff);
        ['Name', 'Title', 'Department'].forEach(t => el('b', '', staffHead, t));
        const editor = P.scroll(staff, 'editor');
        for (const p of s.staff) P.approverRow(editor, p);
        const route = el('section', 'ap-box ap-route-panel', lower);
        S.current.apRoutePanel = route;
        el('h2', 'ap-bar', route, 'Approval Route (In Order)');
        const routeHead = el('div', 'ap-route-head', route);
        ['Step', 'Approver', 'Title', 'Department'].forEach(t => el('b', '', routeHead, t));
        S.routeBox = el('div', 'af-route ap-route-body', route);
        const actions = el('div', 'ap-transfer', route);
        S.current.apFocusedPerson = s.staff.find(p => p.available)?.id;
        const add = P.button(actions, 'Add >>', () => {
          const p = s.staff.find(p => p.id === S.current.apFocusedPerson && p.available && !S.ctx.model.selected.includes(p.id));
          if (p) P.change({person: p.id});
        });
        S.current.apAdd = add;
        const remove = P.button(actions, '<< Remove', () => {
          if (S.ctx.model.selected.length) P.change({remove: S.ctx.model.selected.length - 1});
        });
        S.current.apRemove = remove;
        const up = P.button(actions, 'Move Up', () => env.log('decoy',{label:'Move Up'})); up.disabled = true;
        const down = P.button(actions, 'Move Down', () => env.log('decoy',{label:'Move Down'})); down.disabled = true;
      },
      invoiceRow: (base, S) => (source, r, i) => {
        const b = S.P.button(source.content, '', () => S.P.change({active: i}), 'af-invoice ap-invoice-row');
        S.invoices[i] = b; S.register({invoice: i}, b); source.positions['invoice:' + i] = b;
        [r.id, S.task.helpers.money(r.amount)].forEach(t => S.el('span', '', b, t));
        S.P.item(b, r); return b;
      },
      approvalPolicy: (base, S) => parent => {
        const {el, spec: s, task: F} = S;
        const box = el('section', 'ap-box ap-policy', parent);
        el('h2', 'ap-bar', box, 'Approval Policy (Amount Thresholds)');
        const table = el('table', 'ap-policy-table', box);
        const head = el('tr', '', el('thead', '', table));
        ['From (USD)', 'To (USD)', 'Required Approvals (In Order)'].forEach(t => el('th', '', head, t));
        const body = el('tbody', '', table);
        S.current.apPolicyRows = [];
        const split1 = s.policy.director * 5, split2 = s.policy.director * 20;
        S.current.apPolicySplits = [s.policy.controller, s.policy.director, split1, split2];
        [[0, s.policy.controller - 1, 'Budget owner'],
          [s.policy.controller, s.policy.director - 1, 'Budget owner, Controller'],
          [s.policy.director, split1 - 1, 'Budget owner, Controller, Finance director'],
          [split1, split2 - 1, 'Budget owner, Controller, Finance director'],
          [split2, null, 'Budget owner, Controller, Finance director']].forEach(([min, max, roles]) => {
          const tr = el('tr', '', body);
          S.current.apPolicyRows.push(tr);
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
        S.current.apWindowTitle.firstChild.textContent = 'Approve Invoice   -   ' + r.id;
        const tier = S.current.apPolicySplits.filter(value => r.amount >= value).length;
        S.current.apPolicyRows.forEach((row, i) => row.classList.toggle('selected', i === tier));
        el('h3', 'ap-detail-title', S.invoiceDetail, 'Invoice Details');
        const date = value => String(value).replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
        [['Invoice #:', r.id], ['Vendor:', r.merchant], ['Invoice Date:', date(r.date || r.due)],
          ['Due Date:', date(r.due)], ['Amount:', S.task.helpers.money(r.amount)],
          ['Description:', r.description || 'Equipment, parts and supplies'],
          ['Terms:', 'Net 30'], ['Project:', S.spec.projects[0]], ['Account:', S.spec.accounts[0]]].forEach(([k,v]) => field(S.invoiceDetail, k, v, /Project|Account/.test(k) ? 'ap-combo' : ''));
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
        S.current.apInspector = null;
        const note = document.querySelector('.ref-panel');
        if (note) document.querySelector('.ap-summary').appendChild(note);
      },
      syncRoute: (base, S) => m => {
        base(m);
        if (!m.selected.length) S.routeBox.firstChild.textContent = 'No approvers in route yet.';
        S.routeBox.classList.toggle('ap-empty', !m.selected.length);
      },
      routeChip: (base, S) => (id, i) => {
        const chip = base(id, i), person = S.spec.staff.find(p => p.id === id);
        const remove = chip.lastChild;
        chip.firstChild.textContent = '';
        [String(i + 1), person.name, person.role, /budget/i.test(person.role) ? 'Operations' : 'Finance'].forEach(t => S.el('span', '', chip, t));
        chip.appendChild(remove); return chip;
      },
      footer: (base, S) => () => {
        base();
        const footer = S.main.querySelector('.af-footer');
        S.work.appendChild(footer);
        S.work.appendChild(S.footerNotice);
        S.footerNotice.classList.add('ap-payment-notice');
      },
      syncFooter: (base, S) => m => {
        base(m);
        S.footerNotice.hidden = !m.notice && !m.final;
      },
    },
  },
});
