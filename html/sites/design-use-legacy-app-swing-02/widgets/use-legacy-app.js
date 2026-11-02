// Design on use-legacy-app/desktop; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-swing-02',
  name: 'design',
  split: 'train',
  scenarios: ['swing'],
  template: 'use-legacy-app/desktop',
  design: {
    fontSize: 16, inset: 0, maxWidth: 1800, maxHeight: 1200,
    titles: { swing: 'Maintenance - Routing Records' },
    parts: {
      icon: (base, S) => (kind, parent) => {
        const svg = base(kind, parent);
        if (kind === 'folder') svg.querySelector('path').setAttribute('d', 'M1 4V2h6l2 2h6v11H1Z');
        return svg;
      },
      title: (base, S) => (ctx) => {
        base(ctx);
        const title = S.root.querySelector('.lg-title');
        const svg = title.querySelector('svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', '#2299e7');
        svg.setAttribute('stroke', '#2299e7');
        svg.querySelector('path').setAttribute('d', 'M9 1h6l1 4 4-1 3 5-3 3 3 3-3 5-4-1-1 4H9l-1-4-4 1-3-5 3-3-3-3 3-5 4 1zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8');
        svg.querySelector('path').setAttribute('fill-rule', 'evenodd');
        const note = document.querySelector('.swing-instruction');
        if (note) title.insertBefore(note, title.lastElementChild);
      },
      navigator: (base, S) => (ctx) => {
        const el = ctx.util.el, P = S.P;
        const tree = S.els.tree = el('nav', 'lg-tree breeze-tree', S.els.work);
        tree.setAttribute('aria-label', 'Object navigator');
        const top = el('div', 'breeze-tree-root', tree);
        P.icon('down', top); P.icon('folder', top); el('span', '', top, 'Routing Records');
        S.refs.tree = P.button(tree, '', () => P.patch({ tree: !ctx.model.tree }), 'breeze-all');
        S.refs.treeToggle = P.icon('right', S.refs.tree);
        P.icon('file', S.refs.tree); el('span', '', S.refs.tree, `Customer records (${S.spec.records.length})`);
        S.els.treeChildren = el('div', 'breeze-tree-children', tree);
        for (const label of ['Active accounts', 'Held accounts', 'Archive / 2025']) {
          const b = P.button(S.els.treeChildren, '', () => P.patch(label === 'Active accounts' ? { tree: true } : { dock: label }), 'breeze-leaf');
          P.icon('folder', b); el('span', '', b, label);
        }
        const group = (label, children) => {
          const head = el('div', 'breeze-tree-group', tree);
          P.icon('down', head); P.icon('folder', head); el('span', '', head, label);
          for (const text of children) {
            const row = el('div', 'breeze-tree-leaf', tree);
            P.icon('folder', row); el('span', '', row, text);
          }
        };
        group('By Status', [`Active (${S.spec.records.filter((r, i) => i % 7 !== 3).length})`, `Review (${S.spec.records.filter((r, i) => i % 7 === 3).length})`]);
        group('By Department', ['Assembly (14)', 'Packaging (9)', 'Quality (8)', 'Maintenance (6)', 'Shipping (11)']);
        group('By Cost Center', S.spec.centers.map(c => `${c.code} (${S.spec.records.filter(r => r.base.cost === c.code).length})`));
      },
      directory: (base, S) => (ctx) => {
        const el = ctx.util.el;
        S.els.directory = el('div', 'lg-grid breeze-directory', S.els.main);
        const table = el('table', '', S.els.directory);
        const tr = el('tr', '', el('thead', '', table));
        for (const label of ['Record ID', 'Description', 'Owner', 'Cost Center', 'Routing Note', 'Retry Limit', 'Status']) el('th', '', tr, label);
        el('span', 'breeze-sort', tr.firstElementChild, '⌃');
        S.els.rowNodes = {};
        const tbody = el('tbody', '', table);
        S.spec.records.forEach((r, i) => S.P.record(tbody, r, i));
        S.els.count = el('div', 'lg-record-count', S.els.main);
        S.refs.count = el('span', '', S.els.count);
      },
      record: (base, S) => (tbody, r, i) => {
        base(tbody, r, i);
        const row = S.els.rowNodes[i], cells = Array.from(row.children);
        cells[0].remove();
        cells[7].remove();
        const description = S.ctx.util.el('td', '', row, r.company);
        row.insertBefore(description, cells[2]);
        cells[4].textContent = r.base.memo;
        cells[6].textContent = r.base.retries;
        row.insertBefore(cells[6], cells[5]);
      },
      tab: (base, S) => (ctx, t) => {
        base(ctx, t);
        const el = ctx.util.el, pane = S.els.panes[t];
        const editRow = S.inputs[S.spec.fields[t].id].closest('.lg-row');
        const details = t === 0 ? {
          Owner: S.refs.Owner, Organization: S.refs.Organization, Location: S.refs.Location
        } : null;
        pane.replaceChildren();
        pane.className = 'breeze-form';
        const left = el('div', 'breeze-form-column', pane), right = el('div', 'breeze-form-column', pane);
        const displayRow = (parent, label, key, text = '') => {
          const row = el('div', 'lg-row breeze-readonly', parent);
          el('label', '', row, label + ':');
          const span = el('span', 'lg-protected', row, text);
          if (key) span.dataset.value = key;
          return span;
        };
        displayRow(left, 'Record ID', 'key');
        displayRow(left, 'Description', 'company');
        displayRow(left, 'Status', null, 'Active');
        displayRow(left, 'Department', null, 'Operations');
        for (const f of S.spec.fields) {
          if (f.id === S.spec.fields[t].id) {
            left.appendChild(editRow);
            editRow.querySelector('label').textContent = f.label + ':';
          } else displayRow(left, f.label, f.id);
        }
        for (const [label, key, text] of [['Owner','owner',''], ['Organization','company',''], ['Location','city',''], ['Ledger',null,'AR01 / USD'], ['Batch','batch',''], ['Authority',null,'CUST_MAINT'], ['Record lock',null,'Available']]) {
          const span = displayRow(right, label, key, text);
          if (details && details[label]) {
            span.replaceWith(details[label]);
            details[label].className = 'lg-protected';
          }
        }
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        S.root.classList.add('breeze-workbench');
        // Keep the existing lookup and recovery bindings in the form footer.
        const controls = S.root.querySelector('.lg-actions');
        controls.prepend(S.els.searchRow);
        S.els.searchRow.classList.add('breeze-lookup');
        S.els.searchRow.querySelector('label').textContent = 'Record ID';
        S.els.editor.appendChild(controls);
        S.root.querySelector('.lg-status').classList.add('breeze-internal-status');
      },
      sync: (base, S) => (model) => {
        base(model);
        const r = model.active === null ? null : S.spec.records[model.active];
        for (const span of S.root.querySelectorAll('[data-value]')) {
          const key = span.dataset.value;
          span.textContent = !r ? '-' : ['cost','memo','retries'].includes(key) ? model.stored[model.active][key] : r[key];
        }
        if (r) for (const [i, row] of Object.entries(S.els.rowNodes)) {
          row.children[4].textContent = model.stored[i].memo;
          row.children[5].textContent = model.stored[i].retries;
        }
      }
    }
  },
});
