// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-crm-05',
  name: 'design',
  split: 'train',
  scenarios: ['crm'],
  template: 'use-data-grid/grid',
  design: {
    font: '14px/1.4 "Segoe UI", "Segoe UI Variable", Arial, sans-serif',
    navWidth: 0, railWidth: 0, contextWidth: 0,
    cardInsetX: 0, cardInsetY: 0, cardTop: 0,
    fixedHeight: 86 + 74 + 40 + 78 + 2,
    rowMin: 18, rowMax: 60,
    brand: 'Support Desk',
    parts: {
      heading(base, S) {
        return (...args) => {
          base(...args);
          if (S.title) S.title.textContent = 'Support Tickets';
        };
      },
      toolbar(base, S) {
        return (...args) => {
          base(...args);
          const commandbar = S.P.el('div', 'crm-commandbar', S.tools);
          const headerButtons = [...S.head.querySelectorAll(':scope > .to-btn')];
          const newTicket = headerButtons.find((button) => button.classList.contains('pri'));
          const decoys = headerButtons.filter((button) => button !== newTicket);
          if (newTicket) commandbar.appendChild(newTicket);
          decoys.forEach((button, index) => {
            const label = index === 0 ? 'Edit' : 'More Actions';
            const icon = button.querySelector('.to-icon');
            if (icon) icon.textContent = index === 0 ? '✎' : '⚙';
            if (button.lastChild && button.lastChild.nodeType === 3) button.lastChild.textContent = label;
            commandbar.appendChild(button);
          });
          const action = (label, glyph, onClick) => {
            const button = S.P.el('button', 'to-btn crm-command', commandbar);
            button.type = 'button';
            const icon = S.P.el('span', 'crm-action-icon', button, glyph);
            icon.setAttribute('aria-hidden', 'true');
            S.P.el('span', '', button, label);
            button.addEventListener('click', onClick);
            return button;
          };
          const deleteButton = action('Delete', '✖', () => S.P.act(S.fam.helpers.askBulk(S.ctx.model, S.spec, 'delete', null)));
          const assignButton = action('Assign', '♙', () => env.log('decoy', { label: 'Assign' }));
          const statusButton = action('Change Status', '▣', () => S.P.act(S.fam.helpers.openMark(S.ctx.model)));
          if (decoys[1]) commandbar.appendChild(decoys[1]);
          if (deleteButton && decoys[0]) commandbar.insertBefore(deleteButton, decoys[1] || null);
          if (assignButton && decoys[1]) commandbar.insertBefore(assignButton, decoys[1]);
          if (statusButton && decoys[1]) commandbar.insertBefore(statusButton, decoys[1]);
          const controls = S.P.el('div', 'crm-head-controls', S.head);
          const space = S.head.querySelector('.sp');
          if (space) S.head.insertBefore(controls, space);
          let search = S.tools.querySelector('.to-search') || S.head.querySelector('.to-search');
          if (search) controls.appendChild(search);
          else {
            const wrap = S.P.el('label', 'to-search crm-search', controls);
            wrap.innerHTML = S.D.icons.search;
            search = S.P.el('input', '', wrap);
            search.type = 'text';
            search.placeholder = 'Search tickets...';
            search.value = S.ctx.model.query || '';
            if (typeof S.fam.helpers.setQuery === 'function') {
              search.addEventListener('input', () => S.P.act(S.fam.helpers.setQuery(S.ctx.model, search.value), false));
            }
          }
          const openColumn = (needle) => {
            const col = S.spec.cols.find((item) => item.type === 'cat' && item.label.toLowerCase().includes(needle))
              || S.spec.cols.find((item) => item.type === 'cat');
            if (col) S.P.act(S.fam.helpers.openMenu(S.ctx.model, S.spec, col.id, 'filter'));
          };
          const fields = S.P.el('div', 'crm-fields', controls);
          const field = (label, control, name) => {
            const wrap = S.P.el('div', `crm-field crm-field-${name}`, fields);
            S.P.el('label', 'crm-field-label', wrap, `${label}:`);
            wrap.appendChild(control);
            return wrap;
          };
          if (search) {
            search.classList.add('crm-search-field');
            const input = search.querySelector('input');
            if (input) input.placeholder = '';
            field('Search', search, 'search');
          }
          const selectField = (label, value, needle, name) => {
            const button = S.P.el('button', 'crm-filter', null, value);
            button.type = 'button';
            button.addEventListener('click', () => openColumn(needle));
            field(label, button, name);
          };
          selectField('Status', 'All', 'status', 'status');
          selectField('Priority', 'All', 'priority', 'priority');
          selectField('Owner', 'All', 'owner', 'owner');
          selectField('Customer', 'All', 'customer', 'customer');
          const date = S.P.el('button', 'crm-filter crm-date', null, 'All dates');
          date.type = 'button';
          date.addEventListener('click', () => env.log('decoy', { label: 'Date Range' }));
          field('Date Range', date, 'date');
        };
      },
      grid(base, S) {
        return (...args) => {
          base(...args);
          for (const name of ['Created', 'Updated']) {
            const head = S.P.el('div', `to-h crm-date-head crm-${name.toLowerCase()}`, S.hrow, name);
            head.setAttribute('aria-hidden', 'true');
            head.style.order = name === 'Created' ? 7 : 8;
          }
        };
      },
      column(base, S) {
        return (col) => {
          base(col);
          const head = S.hcells[col.id];
          const labelText = col.label.toLowerCase();
          const rank = labelText.includes('subject') ? 2 : labelText.includes('customer') || labelText.includes('contact') ? 3
            : labelText.includes('status') ? 4 : labelText.includes('priority') ? 5 : labelText.includes('owner') ? 6 : S.spec.cols.indexOf(col) + 1;
          if (head) {
            head.style.order = rank;
            const kind = labelText.includes('subject') ? 'subject' : labelText.includes('customer') || labelText.includes('contact') ? 'customer'
              : labelText.includes('status') ? 'status' : labelText.includes('priority') ? 'priority' : labelText.includes('owner') ? 'owner' : 'id';
            head.classList.add(`crm-col-${kind}`);
            const label = head.querySelector('.lbl');
            if (label && /^ticket$/i.test(col.label)) label.textContent = 'ID';
            if (label && /^contact$/i.test(col.label)) label.textContent = 'Customer';
          }
        };
      },
      row(base, S) {
        return (record, model, selected) => {
          const row = base(record, model, selected);
          row.querySelectorAll('.to-c[data-col]').forEach((cell) => {
            const col = S.spec.cols.find((item) => item.id === cell.dataset.col);
            if (!col) return;
            const label = col.label.toLowerCase();
            const kind = label.includes('subject') ? 'subject' : label.includes('customer') || label.includes('contact') ? 'customer'
              : label.includes('status') ? 'status' : label.includes('priority') ? 'priority' : label.includes('owner') ? 'owner' : 'id';
            cell.classList.add(`crm-col-${kind}`);
            cell.style.order = label.includes('subject') ? 2 : label.includes('customer') || label.includes('contact') ? 3
              : label.includes('status') ? 4 : label.includes('priority') ? 5 : label.includes('owner') ? 6 : S.spec.cols.indexOf(col) + 1;
          });
          const fill = row.querySelector('.to-fill');
          if (fill) fill.style.order = 99;
          const dates = ['Mar 10, 2002', 'Mar 11, 2002'];
          dates.forEach((value, index) => {
            const cell = S.P.el('div', `to-c crm-date-cell crm-${index ? 'updated' : 'created'}`, row, value);
            cell.setAttribute('aria-hidden', 'true');
            cell.style.order = 7 + index;
          });
          return row;
        };
      },
    },
  },
});
