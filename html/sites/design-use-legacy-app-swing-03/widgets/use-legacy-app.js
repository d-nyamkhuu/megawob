// Design on use-legacy-app/desktop; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-swing-03',
  name: 'design',
  split: 'train',
  scenarios: ['swing'],
  template: 'use-legacy-app/desktop',
  design: {
    font: 'Georgia,"Times New Roman",serif',
    fontSize: 16,
    shadow: 'none',
    parts: {
      title: (base, S) => (ctx) => {
        const title = ctx.util.el('div', 'ql-title', S.root);
        ctx.util.el('h1', '', title, 'Operations Records');
        ctx.util.el('span', 'ql-total', title, `Records: ${S.spec.records.length}`);
      },
      navigator: (base, S) => (ctx) => {
        base(ctx);
        const { tree, treeChildren } = S.els;
        const buttons = [...tree.children].filter(n => n.tagName === 'BUTTON');
        const other = [...tree.children].filter(n => n !== treeChildren && n !== S.refs.tree);
        const root = ctx.util.el('div', 'ql-tree-root', null);
        ctx.util.el('span', 'ql-chevron', root, '▾');
        ctx.util.el('span', 'ql-folder', root);
        ctx.util.el('span', '', root, 'Operations');
        const orders = buttons.find(n => n.textContent === 'Orders and invoices');
        const references = buttons.find(n => n.textContent === 'Reference tables');
        const credit = buttons.find(n => n.textContent === 'Credit management');
        tree.replaceChildren(root);
        for (const n of [orders, S.refs.tree, treeChildren, references, credit]) if (n) tree.appendChild(n);
        const more = ctx.util.el('details', 'ql-tree-more', tree);
        ctx.util.el('summary', '', more, 'Settings');
        for (const n of other) if (n.tagName === 'BUTTON' && !tree.contains(n)) more.appendChild(n);
        for (const n of tree.querySelectorAll('button')) {
          const folder = ctx.util.el('span', 'ql-folder', null);
          n.insertBefore(folder, n.firstChild);
        }
      },
      directory: (base, S) => (ctx) => {
        base(ctx);
        const tr = S.els.directory.querySelector('thead tr');
        tr.replaceChildren();
        for (const label of ['ID  ▴', 'Description', 'Type', 'Cost Center', 'Status']) ctx.util.el('th', '', tr, label);
      },
      record: (base, S) => (tbody, r, i) => {
        base(tbody, r, i);
        const row = S.els.rowNodes[i], cells = [...row.children];
        cells[2].textContent = r.company;
        const type = S.ctx.util.el('td', '', null, 'Standard');
        row.replaceChildren(cells[1], cells[2], type, cells[3], cells[5]);
      },
      editor: (base, S) => (ctx) => {
        base(ctx);
        const el = ctx.util.el;
        S.els.work.appendChild(S.els.editor);
        S.els.editor.appendChild(S.els.searchRow);
        S.els.searchRow.classList.add('ql-lookup');
        S.els.searchRow.querySelector('label').textContent = 'Record ID';
        S.refs.open.textContent = '⌕';
        S.refs.open.title = 'Display';
        S.refs.open.setAttribute('aria-label', 'Display');
        for (let t = 0; t < 3; t++) {
          const pane = S.els.panes[t];
          const activeRow = S.inputs[S.spec.fields[t].id].closest('.lg-row');
          pane.replaceChildren();
          const columns = el('div', 'ql-columns', pane);
          const left = el('div', 'ql-form-column', columns), right = el('div', 'ql-form-column', columns);
          el('div', 'ql-key-space', left);
          const protectedValue = (parent, label, value, id) => {
            const out = S.P.protectedRow(parent, label, value);
            if (id) out.dataset.summary = id;
            return out;
          };
          protectedValue(left, 'Description', '', 'description');
          protectedValue(left, 'Type', 'Standard').classList.add('ql-select-value');
          if (t === 0) left.appendChild(activeRow);
          else protectedValue(left, 'Cost center', '', 'cost');
          protectedValue(left, 'Status', 'Active').classList.add('ql-select-value');
          protectedValue(right, 'Work center', 'WC10').classList.add('ql-select-value');
          protectedValue(right, 'Primary resource', 'RES-04').classList.add('ql-select-value');
          if (t === 1) right.appendChild(activeRow);
          else protectedValue(right, 'Routing note', '', 'memo');
          if (t === 2) right.appendChild(activeRow);
          else protectedValue(right, 'Retry limit', '', 'retries');
          protectedValue(right, 'Effective date', '2023-06-01').classList.add('ql-date-value');
        }
      },
      sync: (base, S) => (m) => {
        base(m);
        const active = m.active === null ? null : S.spec.records[m.active];
        S.refs.key.placeholder = active ? active.key : '';
        for (const node of S.root.querySelectorAll('[data-summary]')) {
          const id = node.dataset.summary;
          node.textContent = id === 'description' ? (active ? active.company : '—') : env.taskDef.helpers.value(m, id);
        }
      },
    },
  },
});
