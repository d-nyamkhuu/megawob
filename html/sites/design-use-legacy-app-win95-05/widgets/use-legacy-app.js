// Design on use-legacy-app/desktop; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-win95-05',
  name: 'design',
  split: 'train',
  scenarios: ['win95'],
  template: 'use-legacy-app/desktop',
  design: {
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    fontSize: 16,
    inset: 0,
    maxWidth: 1800,
    maxHeight: 1200,
    shadow: 'none',
    parts: {
      locate: (base, S) => (target) => {
        if (target.field || target.tab !== undefined || target.save || target.help || target.option) S.root.classList.add('mac-sheet-open');
        return base(target);
      },
      main: (base, S) => (ctx) => {
        base(ctx);
        S.els.main.classList.add('mac-directory');
        const heading = ctx.util.el('h2', 'mac-directory-title', S.els.main);
        const tree = S.refs.tree;
        tree.classList.add('mac-directory-disclosure');
        tree.title = 'Customer records';
        tree.setAttribute('aria-label', 'Customer records');
        heading.append(tree);
        ctx.util.el('span', '', heading, 'System Parameters');
        ctx.util.el('div', 'mac-directory-subtitle', S.els.main, 'Maintain system parameter records');
        const footer = ctx.util.el('div', 'mac-directory-footer', S.els.main);
        ctx.util.el('span', 'mac-selection-count', footer, `1 of ${S.spec.records.length} records selected`);
        const confirm = document.querySelector('.ref-submit:not(.ref-icon)');
        if (confirm && confirm.textContent.trim() === 'Confirm') footer.append(confirm);
      },
      search: (base, S) => (ctx) => {
        base(ctx);
        S.els.searchRow.classList.add('mac-search');
        S.els.key.placeholder = 'Search records...';
        const open = S.refs.open;
        open.textContent = 'Open...';
        open.classList.add('mac-open');
        open.addEventListener('click', () => S.root.classList.add('mac-sheet-open'));
        const footer = S.els.main.querySelector('.mac-directory-footer');
        footer.insertBefore(open, footer.querySelector('.ref-submit'));
        const header = document.querySelector('.ref-task');
        if (header) header.append(S.els.searchRow);
      },
      directory: (base, S) => (ctx) => {
        base(ctx);
        const head = S.els.directory.querySelector('thead tr');
        head.replaceChildren();
        for (const label of ['ID', 'Description', 'Cost center', 'Retry limit', 'Category', 'Status']) ctx.util.el('th', '', head, label);
      },
      record: (base, S) => (tbody, r, i) => {
        base(tbody, r, i);
        const row = S.els.rowNodes[i];
        const cells = [...row.children];
        for (const cell of cells) cell.hidden = true;
        const description = S.ctx.util.el('td', 'mac-record-description', row, r.base.memo);
        description.dataset.recordMemo = i;
        const cost = S.ctx.util.el('td', '', row, String(r.base.cost ?? ''));
        cost.dataset.recordCost = i;
        const retry = S.ctx.util.el('td', '', row, String(r.base.retries ?? ''));
        retry.dataset.recordRetries = i;
        const categories = ['Processing', 'Interface', 'Communication', 'Maintenance', 'Security', 'Security', 'Security', 'Maintenance', 'Processing', 'Interface', 'Security', 'Monitoring'];
        const category = S.ctx.util.el('td', '', row, categories[i % categories.length]);
        cells[1].hidden = false;
        cells[5].hidden = false;
        row.replaceChildren(cells[1], description, cost, retry, category, cells[5], ...cells.filter((cell, j) => j !== 1 && j !== 5));
        row.addEventListener('click', () => S.root.classList.add('mac-sheet-open'));
      },
      editor: (base, S) => (ctx) => {
        base(ctx);
        S.els.work.append(S.els.editor);
      },
      tab: (base, S) => (ctx, t) => {
        base(ctx, t);
        const el = ctx.util.el;
        const pane = S.els.panes[t];
        const original = [...pane.childNodes];
        const field = pane.querySelector('.lg-group > .lg-row');
        field.classList.add('mac-edit-field', `mac-field-${S.spec.fields[t].id}`);
        pane.replaceChildren();
        const group = (title) => {
          const box = el('section', 'mac-group', pane);
          el('h2', '', box, title);
          return box;
        };
        const value = (parent, label, text, key, kind) => {
          const row = el('div', 'lg-row mac-property-row', parent);
          el('label', '', row, label);
          const output = el('span', `mac-control ${kind || ''}`, row, text);
          if (key) output.dataset.value = key;
          return output;
        };
        const identity = group('Identification');
        value(identity, 'Job ID', '', 'key', 'mac-disabled');
        if (t === 1) identity.append(field);
        else value(identity, 'Description', '', 'memo');
        value(identity, 'Job type', 'BATCH', null, 'mac-combo');
        value(identity, 'Status', 'Active', null, 'mac-combo');
        const settings = group('Operational Settings');
        if (t === 0) settings.append(field);
        else value(settings, 'Cost center', '', 'cost');
        if (t === 2) settings.append(field);
        else value(settings, 'Retry limit', '', 'retries', 'mac-static-spin');
        value(settings, 'Owner', '', 'owner', 'mac-combo');
        value(settings, 'Priority', 'Normal', null, 'mac-combo');
        const notes = group('Notes');
        el('div', 'mac-notes', notes, 'Service configuration and processing settings for this record.');
        const backing = el('div', 'mac-backing', pane);
        backing.hidden = true;
        backing.append(...original);
      },
      inspector: (base, S) => (ctx) => {
        base(ctx);
        const panel = S.els.work.querySelector('.lg-inspector');
        const previous = [...panel.childNodes];
        panel.replaceChildren();
        const el = ctx.util.el;
        el('h2', '', panel, 'Record Summary');
        const details = el('dl', 'mac-summary-list', panel);
        for (const [label, number] of [['Total Records', S.spec.records.length], ['Active', 42], ['Inactive', 6]]) {
          el('dt', '', details, label);
          el('dd', '', details, String(number));
        }
        const related = el('section', 'mac-summary-category', panel);
        el('h3', '', related, 'By Category');
        const links = el('dl', 'mac-summary-list', related);
        for (const [label, number] of [['Processing', 8], ['Interface', 6], ['Communication', 4], ['Maintenance', 8], ['Security', 14], ['Monitoring', 8]]) {
          el('dt', '', links, label);
          el('dd', '', links, String(number));
        }
        const backing = el('div', 'mac-backing', panel);
        backing.hidden = true;
        backing.append(...previous);
      },
      welcome: (base, S) => (ctx) => {
        base(ctx);
        S.els.editor.append(S.refs.fieldError, S.els.audit);
      },
      actions: (base, S) => (ctx) => {
        base(ctx);
        S.els.editor.append(S.root.querySelector('.lg-actions'));
        S.els.editor.addEventListener('click', (event) => {
          const button = event.target.closest('button');
          if (button && /^(OK|Cancel)$/i.test(button.textContent.trim())) S.root.classList.remove('mac-sheet-open');
        });
      },
      status: (base, S) => (ctx) => {
        base(ctx);
        S.els.editor.append(S.root.querySelector('.lg-status'));
      },
      sync: (base, S) => (m) => {
        base(m);
        const active = m.active === null ? null : S.spec.records[m.active];
        Object.entries(S.els.rowNodes).forEach(([i, row]) => row.classList.toggle('mac-selected', Number(i) === m.active));
        const values = {
          key: active ? active.key : '—',
          owner: active ? active.owner : '—',
          memo: S.inputs.memo.value,
          cost: S.inputs.cost.value,
          retries: S.inputs.retries.value,
        };
        for (const node of S.root.querySelectorAll('[data-value]')) node.textContent = values[node.dataset.value] || '—';
        for (const node of S.root.querySelectorAll('[data-record-memo]')) node.textContent = m.stored[Number(node.dataset.recordMemo)].memo;
        for (const node of S.root.querySelectorAll('[data-record-cost]')) node.textContent = String(m.stored[Number(node.dataset.recordCost)].cost ?? '');
        for (const node of S.root.querySelectorAll('[data-record-retries]')) node.textContent = String(m.stored[Number(node.dataset.recordRetries)].retries ?? '');
        for (const node of S.root.querySelectorAll('.mac-notes')) node.textContent = `${values.memo} and write results to operations log.`;
        S.root.classList.toggle('mac-dirty', !!active && JSON.stringify(m.drafts[m.active]) !== JSON.stringify(m.stored[m.active]));
        S.root.classList.toggle('mac-error', /^E\d/.test(m.status));
        S.root.classList.toggle('mac-saved', !!m.receipt);
      },
    },
  },
});
