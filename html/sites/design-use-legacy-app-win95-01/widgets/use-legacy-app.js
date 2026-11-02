// Design on use-legacy-app/desktop; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-win95-01',
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
      main: (base, S) => (ctx) => {
        base(ctx);
        S.els.main.classList.add('mac-directory');
        const heading = ctx.util.el('h2', 'mac-directory-title', S.els.main);
        const tree = S.refs.tree;
        tree.classList.add('mac-directory-disclosure');
        tree.title = 'Customer records';
        tree.setAttribute('aria-label', 'Customer records');
        heading.append(tree);
        ctx.util.el('span', '', heading, `Jobs (${S.spec.records.length})`);
      },
      search: (base, S) => (ctx) => {
        base(ctx);
        S.els.searchRow.classList.add('mac-search');
        S.els.key.placeholder = 'Search job ID or description';
        S.P.icon('search', S.els.searchRow);
      },
      directory: (base, S) => (ctx) => {
        base(ctx);
        const head = S.els.directory.querySelector('thead tr');
        head.replaceChildren();
        for (const label of ['Job ID ▴', 'Description', 'Status']) ctx.util.el('th', '', head, label);
      },
      record: (base, S) => (tbody, r, i) => {
        base(tbody, r, i);
        const row = S.els.rowNodes[i];
        const cells = [...row.children];
        for (const cell of cells) cell.hidden = true;
        cells[1].hidden = false;
        cells[5].hidden = false;
        const description = S.ctx.util.el('td', 'mac-record-description', row, r.base.memo);
        description.dataset.recordMemo = i;
        row.prepend(cells[1], description, cells[5]);
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
        el('h2', '', panel, 'Record Details');
        const details = el('dl', 'mac-details', panel);
        for (const [label, key, text] of [
          ['Job ID', 'key'], ['Description', 'memo'], ['Job Type', null, 'BATCH'],
          ['Status', null, 'Active'], ['Cost center', 'cost'], ['Retry limit', 'retries'],
          ['Owner', 'owner'], ['Last modified', null, 'Mar 4, 2024  10:15'], ['Modified by', null, 'J. Carter'],
        ]) {
          el('dt', '', details, label);
          const output = el('dd', '', details, text || '');
          if (key) output.dataset.value = key;
        }
        const related = el('section', 'mac-related', panel);
        el('h2', '', related, 'Related Information');
        const links = el('dl', 'mac-details', related);
        for (const [label, text] of [['Schedules', '2'], ['Dependencies', '1'], ['Log history', 'View…'], ['Attachments', '0']]) {
          el('dt', '', links, label);
          const item = el('dd', '', links);
          if (label === 'Log history') S.P.button(item, text, () => S.P.patch({ dock: 'Change history', help: 'about' }), 'mac-link');
          else item.textContent = text;
        }
        const actions = el('section', 'mac-quick', panel);
        el('h2', '', actions, 'Quick Actions');
        const icons = {
          'View log history': 'M5 2h10l5 5v17H5z M15 2v6h5 M8 12h9 M8 16h9 M8 20h7',
          'Duplicate record': 'M9 6h10l4 4v15H9z M19 6v5h4 M6 20H3V2h12v4',
          'Export…': 'M5 11H3v14h19V11h-3 M13 18V2 M8 7l5-5 5 5',
          'Delete record': 'M5 7h17 M8 7l1 18h10l1-18 M10 7V3h8v4 M12 11v10 M16 11v10',
        };
        for (const [label, path] of Object.entries(icons)) {
          const button = S.P.button(actions, '', () => label === 'View log history' ? S.P.patch({ dock: 'Change history', help: 'about' }) : env.log('quick-action', { label }), 'mac-quick-action');
          const icon = ctx.util.svg('svg', { viewBox: '0 0 27 28', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, button);
          ctx.util.svg('path', { d: path }, icon);
          el('span', '', button, label);
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
      },
      status: (base, S) => (ctx) => {
        base(ctx);
        S.els.editor.append(S.root.querySelector('.lg-status'));
      },
      sync: (base, S) => (m) => {
        base(m);
        const active = m.active === null ? null : S.spec.records[m.active];
        const values = {
          key: active ? active.key : '—',
          owner: active ? active.owner : '—',
          memo: S.inputs.memo.value,
          cost: S.inputs.cost.value,
          retries: S.inputs.retries.value,
        };
        for (const node of S.root.querySelectorAll('[data-value]')) node.textContent = values[node.dataset.value] || '—';
        for (const node of S.root.querySelectorAll('[data-record-memo]')) node.textContent = m.stored[Number(node.dataset.recordMemo)].memo;
        for (const node of S.root.querySelectorAll('.mac-notes')) node.textContent = `${values.memo} and write results to operations log.`;
        S.root.classList.toggle('mac-dirty', !!active && JSON.stringify(m.drafts[m.active]) !== JSON.stringify(m.stored[m.active]));
        S.root.classList.toggle('mac-error', /^E\d/.test(m.status));
        S.root.classList.toggle('mac-saved', !!m.receipt);
      },
    },
  },
});
