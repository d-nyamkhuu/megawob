// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-dbrow-03',
  name: 'design',
  split: 'train',
  scenarios: ['dbrow'],
  template: 'use-dev-tools/workspace',
  design: {
    parts: {
      layout: (base, S) => (ctx, card) => {
        const out = base(ctx, card);
        // The list owns its toolbar; the inspector starts at the same top edge.
        out.main.prepend(out.query.parentElement);
        return out;
      },
      tools: (base, S) => (ctx, work) => {
        const query = base(ctx, work);
        query.placeholder = 'Search accounts…';
        query.setAttribute('aria-label', 'Search accounts');
        const tools = query.parentElement;
        const title = S.st.el('div', 'account-title', tools);
        S.st.el('strong', '', title, 'Accounts');
        S.st.el('span', '', title, '(1,248)');
        const searchIcon = S.st.el('span', 'account-search-icon', tools);
        S.P.icon(searchIcon, 'search');
        return query;
      },
      columnHead: (base, S) => (ctx, main) => {
        base(ctx, main);
        const head = main.querySelector('.dv-columnhead');
        head.replaceChildren();
        for (const text of ['ID  ▴', 'NAME', 'PLAN', 'STATUS', 'QUOTA LIMIT', 'UPDATED AT'])
          S.st.el('span', 'account-column', head, text);
      },
      rowContent: (base, S) => (ctx, row, item, rec) => {
        base(ctx, row, item, rec);
        const [id, customer, region, quota, status] = [...row.children];
        region.classList.add('account-region');
        const index = S.st.s.items.indexOf(item);
        const plan = S.st.el('span', 'account-plan', row, ['enterprise', 'team', 'pro'][index % 3]);
        const day = String(16 + (index * 5 + 6) % 9).padStart(2, '0');
        const hour = String(9 + (index * 7 + 5) % 11).padStart(2, '0');
        const minute = String((index * 13 + 31) % 60).padStart(2, '0');
        rec.updatedAt = `2025-04-${day} ${hour}:${minute}`;
        const updated = S.st.el('span', 'account-updated', row, rec.updatedAt);
        status.classList.add('account-status', 'account-status-' + item.state);
        row.replaceChildren(id, customer, plan, status, quota, updated, region);
      },
      detail: (base, S) => (ctx, content) => {
        const out = base(ctx, content);
        const heading = S.st.el('div', 'editor-heading', out.detail);
        S.st.el('h2', '', heading, 'Record Editor');
        S.st.el('p', '', heading, 'SELECT A ROW TO VIEW AND EDIT ITS FIELDS');
        out.detail.prepend(heading);
        const strip = S.st.el('div', 'editor-revisions', out.detail);
        S.st.editorRevisionValues = [];
        for (const label of ['REVISION', 'UPDATED BY', 'UPDATED AT']) {
          const cell = S.st.el('div', '', strip);
          S.st.el('label', '', cell, label);
          S.st.editorRevisionValues.push(S.st.el('span', '', cell, '—'));
        }
        return out;
      },
      controlsDbrow: (base, S) => (ctx, detail) => {
        const controls = base(ctx, detail);
        const {el} = S.st;
        const quotaLabel = controls.draft.previousElementSibling;
        const helper = controls.draft.nextElementSibling;
        helper.classList.add('editor-helper');
        const revert = controls.save.nextElementSibling;
        const fields = el('div', 'editor-fields', detail);
        S.st.editorValues = {};
        for (const [key, label, placeholder, kind] of [
          ['id', 'ID', '—', 'muted'], ['customer', 'NAME', '—', 'muted'],
          ['plan', 'PLAN', 'Select a plan', 'choice'], ['state', 'STATUS', 'Select a status', 'choice'],
          ['quota', 'QUOTA LIMIT', '—', 'quota'], ['created', 'CREATED AT', '—', 'date'],
          ['updated', 'UPDATED AT', '—', 'date'], ['description', 'DESCRIPTION', '—', 'description']
        ]) {
          const line = el('div', 'editor-field editor-field-' + kind, fields);
          if (key === 'quota') {
            quotaLabel.textContent = label;
            line.append(quotaLabel, controls.draft);
            controls.draft.placeholder = '—';
          } else {
            el('label', '', line, label);
            const value = el('div', 'editor-value', line, placeholder);
            S.st.editorValues[key] = value;
            if (kind === 'choice') S.P.icon(value, 'chevron');
            if (kind === 'date') {
              const svg = ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'dv-icon', 'aria-hidden':'true'}, value);
              ctx.util.svg('path', {d:'M4 5h16v16H4Z M4 10h16 M8 3v5 M16 3v5 M8 14h1 M12 14h1 M16 14h1 M8 17h1 M12 17h1'}, svg);
            }
          }
        }
        const actions = el('div', 'editor-save', detail);
        actions.append(controls.save, revert);
        revert.classList.add('editor-revert');
        controls.save.classList.add('editor-save-button');
        return controls;
      },
      facts: (base, S) => (ctx, detail) => {
        const facts = base(ctx, detail);
        facts.classList.add('editor-save-facts');
        detail.querySelector('.editor-save').append(facts);
        return facts;
      },
      detailExtra: (base, S) => (ctx, detail) => {
        base(ctx, detail);
        detail.querySelector('.dv-detail-section').classList.add('editor-source-meta');
      },
      footer: (base, S) => (ctx, work) => {
        const out = base(ctx, work);
        const foot = out.footCount.parentElement;
        foot.classList.add('account-pagination');
        S.st.main.append(foot);
        const {el} = S.st;
        el('span', 'account-page-count', foot, '1–15 of 1,248');
        for (const text of ['‹', '1', '2', '3', '4', '5', '›']) {
          const b = el('button', 'account-page' + (text === '1' ? ' current' : ''), foot, text);
          b.type = 'button';
          b.setAttribute('aria-label', 'Page ' + text);
          b.onclick = () => env.log('decoy', {label: 'Page ' + text});
        }
        return out;
      },
      paint: (base, S) => (model) => {
        base(model);
        const {s, editorValues, editorRevisionValues, draft, save} = S.st;
        const item = s.items.find(x => x.id === model.selected);
        for (const node of S.st.selectionOnly) {
          if (!node.classList.contains('editor-revert')) node.style.display = '';
        }
        draft.disabled = !item;
        save.disabled = !item || !/^\d+$/.test(model.draft);
        for (const [key, node] of Object.entries(editorValues)) {
          const value = !item ? null : key === 'plan' ? ['enterprise', 'team', 'pro'][s.items.indexOf(item) % 3]
            : key === 'updated' ? S.st.rows[item.id].updatedAt : key === 'created' ? '—' : item[key];
          node.firstChild.textContent = value || (key === 'plan' ? 'Select a plan' : key === 'state' ? 'Select a status' : '—');
        }
        const revision = S.st.factsBox.querySelector('.dv-fact .dv-mono');
        [item ? (revision ? revision.textContent : s.revision) : '—', item ? item.owner : '—', item ? S.st.rows[item.id].updatedAt : '—']
          .forEach((value, index) => { editorRevisionValues[index].textContent = value; });
        S.st.detail.classList.toggle('has-selection', !!item);
      },
    },
  },
});
