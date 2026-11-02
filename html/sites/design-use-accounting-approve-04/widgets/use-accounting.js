// Macintosh approval desk, retaining the shared template's registered task actions.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-approve-04',
  name: 'design',
  split: 'train',
  scenarios: ['approve'],
  template: 'use-accounting/workspace',
  design: {
      brand: 'LedgerPro', workspaceLabel: 'LedgerPro accounting workspace',
      inset: 0, radius: 2, font: '20px/1.2 Arial, Helvetica, sans-serif',
      panel: '#fff', bg: '#eee', fg: '#000', muted: '#555', line: '#000', accent: '#000',
    parts: {
      top: () => () => {}, sidebar: () => () => {}, navigation: () => () => {}, toolbar: () => () => {}, inspector: () => () => {},
      heading(base, S) {
        return () => {
        const state = S.el('div', 'mac-state', S.main);
        state.hidden = true;
        S.statusBadge = S.el('span', '', state);
        S.metrics = S.el('div', '', state);
        };
      },
      renderApprove(base, S) {
        return () => {
        const { el, P, spec } = S;
        S.root.style.setProperty('--desk-height', S.ctx.size.height + 'px');
        const invoiceCol = P.column('Invoices');
        invoiceCol.classList.add('mac-invoices');
        const tableHead = el('div', 'mac-invoice-head', invoiceCol);
        ['Invoice #', 'Vendor', 'Due Date', 'Amount'].forEach(t => el('span', '', tableHead, t));
        const source = P.scroll(invoiceCol, 'source');
        spec.invoices.forEach((r, i) => P.invoiceRow(source, r, i));
        const details = P.column('Invoice Details');
        details.classList.add('mac-details');
        S.invoiceDetail = el('div', 'mac-detail-fields', details);
        P.approvalPolicy(S.work);
        const staff = P.column('Available Staff');
        staff.classList.add('mac-staff');
        const staffHead = el('div', 'mac-staff-head', staff);
        el('span', '', staffHead, 'Name'); el('span', '', staffHead, 'Title');
        const editor = P.scroll(staff, 'editor');
        for (const person of spec.staff) P.approverRow(editor, person);
        const route = P.column('Approval Route (in order)');
        route.classList.add('mac-route-panel');
        const routeHead = el('div', 'mac-route-head', route);
        ['#', 'Name', 'Title'].forEach(t => el('span', '', routeHead, t));
        S.routeBox = el('div', 'mac-route-body', route);
        const controls = el('div', 'mac-route-controls', route);
        for (const [text, title] of [['⬆', 'Move up'], ['⬇', 'Move down'], ['▤ Remove', 'Remove from route']]) {
          const b = P.button(controls, text, title === 'Remove from route' ? () => {
            const last = S.ctx.model.selected.length - 1;
            const remove = S.refs[JSON.stringify({ remove: last })];
            if (remove) remove.click();
          } : null); b.title = title; b.disabled = true;
          if (title === 'Remove from route') {
            S.current.removeButton = b;
            b.replaceChildren();
            const icon = S.ctx.util.svg('svg', { viewBox: '0 0 24 24', class: 'mac-control-icon', 'aria-hidden': 'true' }, b);
            S.ctx.util.svg('path', { d: 'M5 6h14l-1 16H6zM3 6h18M9 6V2h6v4M9 10v8m6-8v8' }, icon);
            el('span', '', b, 'Remove');
          }
        }
        const add = P.button(controls, '➜ Add to Route', () => {
          const person = spec.staff.find(p => p.id === S.current.staffFocus && !S.people[p.id].disabled) || spec.staff.find(p => !S.people[p.id].disabled);
          if (person) S.people[person.id].click();
        });
        add.classList.add('mac-add-route');
        add.replaceChildren();
        const arrow = S.ctx.util.svg('svg', { viewBox: '0 0 24 24', class: 'mac-control-icon mac-control-arrow', 'aria-hidden': 'true' }, add);
        S.ctx.util.svg('path', { d: 'M2 9h10V3l10 9-10 9v-6H2z' }, arrow);
        el('span', '', add, 'Add to Route');
        S.current.routePanel = route;
        };
      },
      invoiceRow(base, S) {
        return (source, invoice, i) => {
          const b = base(source, invoice, i);
          b.replaceChildren();
          for (const value of [invoice.id, invoice.merchant, invoice.due, S.task.helpers.money(invoice.amount).replace(/^\$/, '')]) S.el('span', '', b, value);
          return b;
        };
      },
      approvalPolicy(base, S) {
        return parent => {
          const policy = S.el('section', 'mac-policy', parent);
          const title = S.el('h3', '', policy, 'Approval Policy ');
          S.el('span', '', title, '(by invoice amount)');
          const table = S.el('table', '', policy);
          const head = S.el('tr', '', S.el('thead', '', table));
          S.el('th', '', head, 'Amount Range'); S.el('th', '', head, 'Required Approvers (in order)');
          const body = S.el('tbody', '', table), p = S.spec.policy, money = n => S.task.helpers.money(n).replace(/^\$/, '').replace(/\.00$/, '');
          const ranges = [
            ['Under ' + money(p.controller), '1. Budget owner'],
            [money(p.controller) + ' – ' + money(p.director - 1), '1. Budget owner　→　2. Controller'],
            [money(p.director) + ' and over', '1. Budget owner　→　2. Controller　→　3. Finance director'],
          ];
          ranges.forEach(([range, roles]) => { const row = S.el('tr', '', body); S.el('td', '', row, range); S.el('td', '', row, roles); });
        };
      },
      approverRow(base, S) {
        return (editor, person) => {
          const row = base(editor, person), b = S.people[person.id];
          row.replaceChildren(b);
          b.classList.add('mac-person-button');
          b.setAttribute('aria-label', 'Add ' + person.name + ' / ' + person.role);
          b.title = person.available ? 'Add ' + person.name + ' to route' : person.name + ' · Unavailable';
          b.addEventListener('pointerenter', () => { S.current.staffFocus = person.id; });
          return row;
        };
      },
      syncInvoice(base, S) {
        return model => {
          const r = S.spec.invoices[model.active], parent = S.invoiceDetail;
          parent.replaceChildren();
          const fields = [['Invoice #:', r.id], ['Vendor:', r.merchant], ['Due Date:', r.due], ['Amount:', S.task.helpers.money(r.amount).replace(/^\$/, '')], ['Description:', r.merchant + '\nInvoice ' + r.id], ['Account:', 'Accounts Payable'], ['Department:', 'Finance'], ['Project:', S.spec.projects[0]], ['Terms:', 'Net 30']];
          fields.forEach(([label, value]) => {
            const line = S.el('div', 'mac-detail-line', parent);
            S.el('span', '', line, label);
            const field = S.el('div', 'mac-value', line, value);
            if (label === 'Description:') line.classList.add('mac-description');
            if (['Account:', 'Department:', 'Project:'].includes(label)) field.classList.add('mac-value-menu');
            if (['Due Date:', 'Amount:'].includes(label)) field.classList.add('mac-short-value');
            if (label === 'Terms:') field.classList.add('mac-terms');
          });
        };
      },
      syncSelection(base, S) {
        return model => {
          base(model);
          S.spec.staff.forEach(person => {
            const b = S.people[person.id]; b.replaceChildren();
            const icon = S.ctx.util.svg('svg', { viewBox: '0 0 24 24', class: 'mac-person-icon', 'aria-hidden': 'true' }, b);
            S.ctx.util.svg('path', { d: 'M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 22v-3a8 8 0 0 1 16 0v3z' }, icon);
            S.el('span', 'mac-person-name', b, person.name);
            S.el('span', 'mac-person-role', b, person.role + (!person.available ? ' · Unavailable' : ''));
          });
        };
      },
      syncRoute(base, S) {
        return model => {
          base(model);
          if (!model.selected.length) S.routeBox.replaceChildren();
        };
      },
      routeChip(base, S) {
        return (id, i) => {
          const chip = base(id, i), remove = chip.querySelector('button'), person = S.spec.staff.find(p => p.id === id);
          chip.replaceChildren();
          S.el('span', '', chip, String(i + 1)); S.el('span', '', chip, person.name); S.el('span', '', chip, person.role);
          chip.appendChild(remove);
          return chip;
        };
      },
      footer(base, S) {
        return () => {
        base();
        const footer = S.main.querySelector('.af-footer');
        S.current.routePanel.appendChild(footer);
        const commit = S.refs[JSON.stringify({ commit: true })];
        commit.firstChild.textContent = 'Approve for Payment';
        S.current.commitButton = commit;
        };
      },
      synced(base, S) {
        return model => {
          const required = ['Budget owner'];
          const amount = S.spec.invoices[model.active].amount;
          if (amount >= S.spec.policy.controller) required.push('Controller');
          if (amount >= S.spec.policy.director) required.push('Finance director');
          const complete = required.length === model.selected.length && required.every((role, i) => S.spec.staff.find(p => p.id === model.selected[i]).role === role);
          S.current.commitButton.disabled = !complete && !model.final;
          S.current.removeButton.disabled = !model.selected.length;
          const rows = S.work.querySelectorAll('.mac-policy tbody tr');
          rows.forEach((row, i) => row.classList.toggle('mac-current-band', i === required.length - 1));
        };
      },
    },
  },
});
