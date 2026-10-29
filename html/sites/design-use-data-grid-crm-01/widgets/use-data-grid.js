// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-crm-01',
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
          if (S.title) S.title.textContent = 'Tickets';
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
            const label = index === 0 ? 'Reply' : 'Forward';
            const icon = button.querySelector('.to-icon');
            if (icon) icon.textContent = index === 0 ? '↶' : '↗';
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
          action('Assign', '♙', () => env.log('decoy', { label: 'Assign' }));
          action('Mark Resolved', '✓', () => S.P.act(S.fam.helpers.openMark(S.ctx.model)));
          action('Delete', '▤', () => S.P.act(S.fam.helpers.askBulk(S.ctx.model, S.spec, 'delete', null)));
          action('More actions', '⋮', () => env.log('decoy', { label: 'More actions' }));
          const controls = S.P.el('div', 'crm-head-controls', S.head);
          const space = S.head.querySelector('.sp');
          if (space) S.head.insertBefore(controls, space);
          let search = S.tools.querySelector('.to-search');
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
          const filters = S.P.el('div', 'crm-filters', controls);
          for (const [label, needle] of [['All statuses', 'status'], ['All priorities', 'priority'], ['More filters', '']]) {
            const button = S.P.el('button', 'crm-filter', filters, label);
            button.type = 'button';
            button.addEventListener('click', () => openColumn(needle));
          }
        };
      },
      column(base, S) {
        return (col) => {
          base(col);
          const head = S.hcells[col.id];
          const labelText = col.label.toLowerCase();
          const rank = labelText.includes('status') ? 5 : labelText.includes('priority') ? 6 : S.spec.cols.indexOf(col) + 1;
          if (head) {
            head.style.order = rank;
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
            cell.style.order = label.includes('status') ? 5 : label.includes('priority') ? 6 : S.spec.cols.indexOf(col) + 1;
          });
          const fill = row.querySelector('.to-fill');
          if (fill) fill.style.order = 99;
          return row;
        };
      },
    },
  },
});
