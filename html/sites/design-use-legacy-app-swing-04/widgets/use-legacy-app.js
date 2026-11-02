// Design on use-legacy-app/desktop; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-swing-04',
  name: 'design',
  split: 'train',
  scenarios: ['swing'],
  template: 'use-legacy-app/desktop',
  design: {
      font: '"Courier New",monospace', fontSize: 20, inset: 0,
      maxWidth: 2000, maxHeight: 1400, treeWidth: 308,
      inputHeight: 33, inputWidth: 220, labelWidth: 160,
      shadow: 'none',
      columns: ['Record ID', 'Description', 'Cost Center', 'Routing Note', 'Retry Limit', 'Status'],
    parts: {
      title: () => () => {},
      breadcrumb: (base, S) => (ctx) => {
        const el = ctx.util.el;
        const band = el('div', 'lg-summary', S.root);
        const mark = el('div', 'lg-factory', band);
        mark.innerHTML = '<svg viewBox="0 0 80 90" aria-hidden="true"><defs><linearGradient id="steel" x2="1"><stop stop-color="#fafafa"/><stop offset=".5" stop-color="#92938f"/><stop offset="1" stop-color="#e6e6e3"/></linearGradient></defs><g stroke="#111" stroke-width="1.5"><path d="M29 47 31 20h6l2 27M51 48 53 7h7l2 41" fill="url(#steel)"/><path d="M30 17h8v4h-8zM52 4h9v4h-9z" fill="#b5b6b3"/><path d="M6 49V39l12 8V36l12 11V35l13 12V36l13 12h13v34H6z" fill="#d6d7d2"/><path d="M4 82h69v3H4z" fill="#444"/><path d="M8 49h59v5H8z" fill="#f7f7f5"/><path d="M13 57h8v8h-8zM31 57h8v8h-8zM50 57h8v8h-8zM13 71h8v10h-8zM31 71h8v10h-8zM50 71h8v10h-8z" fill="#4278a7"/><path d="M14 58v6M32 58v6M51 58v6M14 72v8M32 72v8M51 72v8" stroke="#fff"/></g></svg>';
        const content = el('div', 'lg-summary-content', band);
        el('h1', '', content, 'Operations Records');
        const details = el('div', 'lg-summary-details', content);
        const plant = el('div', '', details);
        el('div', '', plant, 'Plant:  Eastbrook Works');
        el('div', '', plant, 'Record type: Routing');
        const selection = el('div', '', details);
        el('div', '', selection, `Total records: ${S.spec.records.length}`);
        S.refs.summarySelection = selection;
        const audit = el('div', 'lg-summary-audit', details);
        el('div', '', audit, 'Last updated:  12 Mar 1989  14:27');
        S.refs.summaryOwner = el('div', '', audit);
      },
      heading: (base, S) => (ctx) => { base(ctx); S.refs.heading.parentElement.hidden = true; },
      search: (base, S) => (ctx) => {
        base(ctx);
        S.els.searchRow.classList.add('lg-summary-search');
        S.els.searchRow.querySelector('label').textContent = 'Selected:';
        S.refs.summarySelection.appendChild(S.els.searchRow);
      },
      navigator: (base, S) => (ctx) => {
        base(ctx);
        const tree = S.els.tree, el = ctx.util.el;
        const selection = S.refs.tree, children = S.els.treeChildren;
        tree.replaceChildren();
        const group = (name, names) => {
          const head = el('div', 'lg-folder-root', tree);
          el('span', 'lg-tree-box', head, '−'); el('span', 'lg-folder', head); el('span', '', head, name);
          const branch = el('div', 'lg-folder-branch', tree);
          for (const name of names) {
            if (name === 'Customer records') {
              branch.appendChild(selection); selection.className = 'lg-folder-item lg-record-tree';
            } else {
              const item = el('div', 'lg-folder-item', branch);
              el('span', 'lg-folder', item); el('span', '', item, name);
            }
          }
        };
        group('Operations', ['Customer records', 'Work Centers', 'Cost Centers', 'Materials', 'Vendors']);
        group('Production', ['Orders', 'BOMs']);
        group('Administration', ['Users', 'System']);
        children.classList.add('lg-tree-extra'); tree.appendChild(children);
      },
      record: (base, S) => (tbody, r, i) => {
        base(tbody, r, i);
        const row = S.els.rowNodes[i], cells = [...row.children];
        cells[2].textContent = r.company;
        const note = S.ctx.util.el('td', '', null, r.base.memo);
        const retry = S.ctx.util.el('td', '', null, r.base.retries);
        row.replaceChildren(cells[1], cells[2], cells[3], note, retry, cells[5]);
        S.refs[`memo:${i}`] = note; S.refs[`retries:${i}`] = retry;
      },
      directory: (base, S) => (ctx) => {
        base(ctx);
        const el = ctx.util.el, grid = S.els.directory;
        const pane = el('div', 'lg-directory-pane');
        grid.before(pane); pane.appendChild(grid);
        const rail = el('div', 'lg-scroll-rail', pane);
        S.P.button(rail, '▲', () => { grid.scrollTop -= 28; }, 'lg-scroll-arrow');
        const track = el('div', 'lg-scroll-track', rail);
        const thumb = el('div', 'lg-scroll-thumb', track);
        S.P.button(rail, '▼', () => { grid.scrollTop += 28; }, 'lg-scroll-arrow');
        grid.addEventListener('scroll', () => {
          thumb.style.top = `${Math.max(0, track.clientHeight - thumb.clientHeight) * grid.scrollTop / Math.max(1, grid.scrollHeight - grid.clientHeight)}px`;
        });
      },
      tab: (base, S) => (ctx, t) => {
        base(ctx, t);
        const el = ctx.util.el, pane = S.els.panes[t];
        const liveRow = S.inputs[S.spec.fields[t].id].closest('.lg-row');
        const form = el('div', 'lg-record-form');
        const left = el('div', 'lg-record-fields', form);
        const protectedField = (label, key, cls) => {
          const value = S.P.protectedRow(left, label + ':', '');
          value.classList.add(cls || 'lg-wide-value'); value.dataset.mirror = key;
        };
        protectedField('Record ID', 'key', 'lg-record-id');
        protectedField('Description', 'description');
        for (const [id, label] of [['cost', 'Cost center'], ['memo', 'Routing note'], ['retries', 'Retry limit']]) {
          if (id === S.spec.fields[t].id) {
            liveRow.classList.add(`lg-live-${id}`); left.appendChild(liveRow);
            liveRow.querySelector('label').textContent = label + ':';
          } else protectedField(label, id, `lg-value-${id}`);
        }
        const status = S.P.protectedRow(left, 'Status:', 'Active'); status.classList.add('lg-status-value');
        const right = el('fieldset', 'lg-additional', form);
        el('legend', '', right, 'Additional Information');
        for (const [label, text, cls] of [['Work center:', 'A10', 'lg-dropdown-value'], ['Planner:', '', 'lg-planner'], ['Lead time (days):', '5', 'lg-number-value'], ['Batch size:', '10', 'lg-number-value']]) {
          const value = S.P.protectedRow(right, label, text); value.classList.add(cls);
          if (label === 'Planner:') value.dataset.mirror = 'planner';
        }
        // Keep the template's protected-data outputs for its unchanged sync routine.
        const storage = el('div', 'lg-sync-storage', form); storage.hidden = true;
        if (t === 0) for (const name of ['Owner', 'Organization', 'Location']) storage.appendChild(S.refs[name]);
        pane.replaceChildren(form);
      },
      build: (base, S) => (ctx) => {
        base(ctx);
        // Remove the nested application's frame from the visible workbench.
        for (const cls of ['lg-title', 'lg-menu', 'lg-tools', 'lg-breadcrumb', 'lg-record-count', 'lg-editor-title', 'lg-inspector', 'lg-dock', 'lg-status']) {
          for (const node of S.root.querySelectorAll('.' + cls)) node.hidden = true;
        }
        const save = S.refs.saveTool;
        save.classList.remove('lg-btn', 'lg-icon-button');
        save.classList.add('swing-save-tool');
        const iconbar = document.querySelector('.swing-iconbar');
        iconbar.insertBefore(save, iconbar.querySelector('.ref-tools'));
        const actions = S.refs.save.parentElement;
        S.els.editor.appendChild(actions);
        for (const name of ['Costs', 'History']) {
          const tab = S.P.button(S.els.tabstrip, name, () => {}, 'lg-tab lg-decorative-tab');
          tab.setAttribute('aria-label', name);
        }
      },
      sync: (base, S) => (m) => {
        base(m);
        const active = m.active === null ? null : S.spec.records[m.active];
        S.els.count.hidden = true;
        S.els.key.placeholder = active ? active.key : '';
        S.refs.summaryOwner.textContent = `Updated by:    ${active ? active.owner : '—'}`;
        for (const [i, row] of Object.entries(S.els.rowNodes)) {
          S.refs[`memo:${i}`].textContent = m.stored[i].memo;
          S.refs[`retries:${i}`].textContent = m.stored[i].retries;
        }
        for (const node of S.root.querySelectorAll('[data-mirror]')) {
          const id = node.dataset.mirror;
          node.textContent = !active ? '—' : id === 'key' ? active.key : id === 'description' ? active.company : id === 'planner' ? active.owner : S.inputs[id].value;
        }
        S.refs.fieldError.hidden = !/^E\d/.test(m.status);
        S.els.audit.hidden = !m.receipt;
      },
    },
  },
});
