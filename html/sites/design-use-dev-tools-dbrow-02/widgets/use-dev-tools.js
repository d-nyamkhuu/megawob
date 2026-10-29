// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-dbrow-02',
  name: 'design',
  split: 'train',
  scenarios: ['dbrow'],
  template: 'use-dev-tools/workspace',
  design: {
    font: '"Segoe UI",Arial,sans-serif',
    parts: {
      icon: (base, S) => (parent, name) => {
        const paths = {
          home: ['m2 11 10-9 10 9', 'M5 9v12h5v-7h4v7h5V9'],
          calendar: ['M4 5h16v16H4Z', 'M4 10h16', 'M8 3v4', 'M16 3v4'],
        };
        if (!paths[name]) return base(parent, name);
        const svg = S.st.U.svg('svg', { viewBox: '0 0 24 24', class: 'dv-icon', 'aria-hidden': 'true' }, parent);
        for (const d of paths[name]) S.st.U.svg('path', { d }, svg);
        return svg;
      },
      tabs: (base, S) => (ctx, work) => {
        base(ctx, work);
        const tabs = work.querySelector('.dv-tabs');
        const welcome = ctx.util.el('div', 'fl-tab fl-welcome', tabs);
        S.P.icon(welcome, 'home'); ctx.util.el('span', '', welcome, 'Welcome'); S.P.icon(welcome, 'chevron');
        const account = ctx.util.el('div', 'fl-tab fl-account', tabs);
        S.P.icon(account, 'table'); ctx.util.el('span', '', account, 'accounts');
        S.P.icon(account, 'close');
      },
      tools: (base, S) => (ctx, work) => {
        const query = base(ctx, work);
        query.placeholder = 'Search accounts…';
        const tools = query.parentElement;
        const title = ctx.util.el('div', 'fl-table-title', tools);
        ctx.util.el('strong', '', title, 'acme  ›  accounts');
        ctx.util.el('span', '', title, `${S.spec.items.length} rows`);
        const searchWrap = ctx.util.el('div', 'fl-search-wrap', tools);
        const searchIcon = ctx.util.el('span', 'fl-search-icon', searchWrap); S.P.icon(searchIcon, 'search');
        searchWrap.append(query); tools.insertBefore(searchWrap, tools.querySelector('.dv-toolbtn'));
        const columns = tools.querySelector('.dv-toolbtn:last-of-type');
        columns.replaceChildren(); ctx.util.el('span', 'fl-ellipsis', columns, '···');
        return query;
      },
      columnHead: (base, S) => (ctx, main) => {
        base(ctx, main);
        const header = main.querySelector('.dv-columnhead');
        header.replaceChildren();
        for (const name of ['id ↑', 'name', 'region', 'quota_limit', 'usage', 'status', 'created_at ↓', 'updated_at ↓'])
          ctx.util.el('span', '', header, name);
      },
      rowContent: (base, S) => (ctx, row, item, rec) => {
        base(ctx, row, item, rec);
        const quota = rec.quota;
        const cells = [...row.children];
        const usage = ctx.util.el('span', 'fl-unavailable', row, '—');
        const created = ctx.util.el('span', 'fl-unavailable', row, '—');
        const updated = ctx.util.el('span', 'fl-unavailable', row, '—');
        row.replaceChildren(cells[0], cells[1], cells[2], quota, usage, cells[4], created, updated);
      },
      controlsDbrow: (base, S) => (ctx, detail) => {
        const controls = base(ctx, detail);
        const el = ctx.util.el;
        const label = controls.draft.previousElementSibling;
        label.textContent = 'Quota Limit';
        const revert = controls.save.nextElementSibling;
        const form = el('div', 'fl-record-form', detail);
        const fields = {};
        for (const [key, caption, kind] of [
          ['id', 'ID', 'readonly'], ['usage', 'Usage', 'readonly'],
          ['customer', 'Name', 'plain'], ['state', 'Status', 'choice'],
          ['region', 'Region', 'choice'], ['created', 'Created At', 'date'],
          ['quota', 'Quota Limit', 'quota'], ['updated', 'Updated At', 'date'],
        ]) {
          const field = el('div', `fl-field fl-field-${key}`, form);
          if (kind === 'quota') {
            field.append(label, controls.draft);
            controls.draft.id = 'account-quota'; label.htmlFor = controls.draft.id;
            const arrows = el('span', 'fl-spinner-arrows', field, '⌃\n⌄'); arrows.setAttribute('aria-hidden', 'true');
          } else {
            el('span', 'fl-field-label', field, caption);
            const box = el('div', `fl-field-box fl-${kind}`, field);
            fields[key] = el('span', '', box);
            if (kind === 'choice') S.P.icon(box, 'chevron');
            if (kind === 'date') {
              const svg = S.P.icon(box, 'calendar'); svg.classList.add('fl-calendar');
            }
          }
        }
        const actions = el('div', 'fl-record-actions', detail);
        controls.save.textContent = 'Save'; controls.save.setAttribute('aria-label', 'Save record');
        const saveIcon = S.P.icon(controls.save, 'file');
        saveIcon.replaceChildren();
        for (const d of ['M4 3h13l4 4v14H3V3Z', 'M7 3v7h10V3', 'M7 21v-8h10v8', 'M14 4v4'])
          S.st.U.svg('path', { d }, saveIcon);
        actions.append(controls.save);
        revert.textContent = 'Revert'; revert.setAttribute('aria-label', 'Discard draft');
        S.P.icon(revert, 'refresh'); actions.append(revert);
        const revision = el('div', 'fl-revision', actions);
        S.st.fluentFields = fields; S.st.fluentRevision = revision; S.st.fluentRevert = revert;
        return controls;
      },
      footer: (base, S) => (ctx, work) => {
        const result = base(ctx, work);
        const foot = result.footCount.parentElement;
        const info = ctx.util.el('span', 'fl-info', foot, 'i');
        foot.prepend(info);
        ctx.util.el('span', 'fl-help-text', foot, 'Select a row to view and edit the account record. Changes will update the record in the acme database.');
        ctx.util.el('span', 'fl-help-link', foot, 'Learn more about editing records ↗');
        return result;
      },
      paint: (base, S) => (model) => {
        base(model);
        const st = S.st;
        const item = S.spec.items.find(row => row.id === model.selected);
        st.detail.classList.toggle('fl-selected', !!item);
        st.meta.textContent = item ? `${item.id} · ${item.customer}` : 'No account selected';
        for (const key of ['id', 'customer', 'state', 'region']) st.fluentFields[key].textContent = item ? item[key] : '';
        st.draft.style.display = ''; st.draft.disabled = !item;
        st.save.style.display = ''; st.fluentRevert.style.display = ''; st.fluentRevert.disabled = !item;
        st.draft.previousElementSibling.style.display = '';
        st.fluentRevision.replaceChildren();
        const facts = [...st.factsBox.querySelectorAll('.dv-fact')].map(node => node.textContent);
        const revision = facts.find(text => /revision/i.test(text));
        const updated = facts.find(text => /updated records/i.test(text));
        for (const [name, value] of [['Revision', revision ? revision.split(':').slice(1).join(':').trim() : S.spec.revision], ['Updated records', updated ? updated.split(':').slice(1).join(':').trim() : model.saves || 0], ['Updated by', item ? item.owner : '—']])
          S.ctx.util.el('span', '', st.fluentRevision, `${name}: ${value}`);
      },
    },
  },
});
