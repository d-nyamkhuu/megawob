// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-dbrow-05',
  name: 'design',
  split: 'train',
  scenarios: ['dbrow'],
  template: 'use-dev-tools/workspace',
  design: {
    parts: {
      tools: (base, S) => (ctx, work) => {
        const query = base(ctx, work);
        query.placeholder = 'Search accounts...';
        return query;
      },
      columnHead: (base, S) => (ctx, main) => {
        const { el } = S.st;
        const ch = el('div', 'dv-columnhead', main);
        for (const text of ['ID', 'Name', 'Plan', 'Quota limit']) el('span', '', ch, text);
      },
      rowContent: (base, S) => (ctx, row, item, rec) => {
        const { el, s } = S.st;
        const index = s.items.indexOf(item);
        el('span', 'account-id', row, item.id);
        const name = el('span', '', row, item.customer); name.title = item.customer;
        el('span', '', row, ['Pro', 'Team', 'Starter'][index % 3]);
        rec.quota = el('span', '', row);
      },
      detail: (base, S) => (ctx, content) => {
        const { el, refs } = S.st;
        const detail = el('aside', 'dv-detail', content);
        const header = el('div', 'account-head', detail);
        const identity = el('div', 'account-identity', header);
        const title = el('div', 'account-title', identity);
        const dh = el('h3', '', title, '');
        el('span', 'account-pro', title, 'Pro');
        const meta = el('p', '', identity);
        const dates = el('div', 'account-dates', header);
        const created = el('div', '', dates); el('span', '', created, 'Created'); refs.displayCreated = el('strong', '', created, 'Jan 14, 2025 10:22 AM');
        const updated = el('div', '', dates); el('span', '', updated, 'Updated'); refs.displayUpdated = el('strong', '', updated, 'Mar 3, 2026 4:11 PM');
        const more = el('button', 'account-more', header, '⋮'); more.type = 'button'; more.setAttribute('aria-label','More record options');
        const summary = el('div', 'account-summary', detail);
        const sh = el('div', 'account-summary-head', summary);
        const sv = el('div', 'account-summary-values', summary);
        for (const [key,label] of [['id','ID'],['name','Name'],['plan','Plan'],['quota','Quota limit'],['status','Status'],['owner','Owner'],['region','Region']]) {
          el('span', '', sh, label);
          refs['display_'+key] = el('span', key === 'status' ? 'account-status' : '', sv);
        }
        const tabs = el('div', 'account-tabs', detail);
        for (const [i,label] of ['Record','JSON','Activity','Related (3)'].entries()) {
          const tab = el('button', i ? '' : 'active', tabs, label); tab.type = 'button';
          if (i) tab.onclick = () => {};
        }
        return { detail, dh, meta };
      },
      controlsDbrow: (base, S) => (ctx, detail) => {
        const { st, P } = S;
        const { el, refs, s } = st;
        const form = el('div', 'account-form', detail);
        const grid = el('div', 'account-form-grid', form);
        for (const [key,label,kind] of [
          ['id','Account ID','readonly'],['owner','Owner','select'],
          ['name','Name','text'],['email','Contact email','text'],
          ['plan','Plan','select'],['website','Website','text'],
          ['status','Status','select'],['created','Created at','date'],
          ['region','Region','select'],['updated','Updated at','date']
        ]) {
          const field = el('div', 'account-field', grid);
          el('label', '', field, label);
          refs['form_'+key] = el('div', 'account-faux '+kind+' field-'+key, field);
        }
        const footer = el('div', 'account-form-footer', form);
        const quota = el('div', 'account-quota', footer);
        const lab = el('label', '', quota, 'Quota limit');
        const inputWrap = el('div', 'account-quota-input', quota);
        const draft = el('input', 'dv-input', inputWrap); draft.type = 'text'; draft.inputMode = 'numeric'; draft.setAttribute('aria-label','quota_limit');
        el('span', 'account-stepper', inputWrap);
        el('small', '', quota, 'Monthly usage quota (API requests)');
        const save = P.button(footer, 'save', 'Save', true);
        draft.addEventListener('focus', () => {
          if (ctx.model.selected) return;
          // Editing the preview selects the same fixed record shown by paint.
          const preview = s.items[1] || s.items[0];
          if (preview) P.change('row', preview.id);
        });
        st.selectionOnly.push(lab, draft, save);
        refs.quotaLabel = lab;
        return { draft, save };
      },
      facts: (base, S) => (ctx, detail) => S.st.el('div', 'dv-facts', detail),
      paint: (base, S) => (m) => {
        base(m);
        const { s, refs, rows, dh, meta, draft, save, pane } = S.st;
        // Preserve the populated inspector without consulting the episode goal.
        const preview = s.items[1] || s.items[0];
        const item = s.items.find(x => x.id === m.selected) || preview;
        if (!item) return;
        if (!m.selected) {
          rows[item.id].row.classList.add('selected');
          const row = rows[item.id].row;
          if (row.offsetTop + row.offsetHeight > pane.scrollTop + pane.clientHeight)
            pane.scrollTop = Math.max(0, row.offsetTop - Math.round(pane.clientHeight / 2));
          dh.textContent = item.id;
          meta.textContent = item.customer;
          draft.style.display = '';
          save.style.display = '';
          refs.quotaLabel.style.display = '';
          draft.value = String(m.values[item.id] ?? '');
        }
        const index = s.items.indexOf(item);
        const plan = ['Pro','Team','Starter'][index % 3];
        const slug = item.customer.toLowerCase().replace(/[^a-z0-9]+/g,'').replace(/(.)$/, '$1');
        const values = {
          id:item.id, name:item.customer, plan, quota:String(m.values[item.id] ?? ''),
          status:item.state || 'Active', owner:item.owner || 'owner', region:item.region,
          email:'hello@'+slug+'.com', website:'https://www.'+slug+'.com',
          created:'Jan 14, 2025 10:22 AM', updated:'Mar 3, 2026 4:11 PM'
        };
        for (const [key,value] of Object.entries(values)) {
          if (refs['display_'+key]) refs['display_'+key].textContent = value;
          if (refs['form_'+key]) refs['form_'+key].textContent = value;
        }
      }
    }
  },
});
