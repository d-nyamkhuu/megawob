// Sandridge's inspector uses the same values and edit helpers as the grid.
function sandridgeInspector(S, m) {
  const panel = S.shell.querySelector('.ticket-inspector');
  if (!panel) return;
  const selected = m.selected.join('|');
  if (panel.dataset.selection !== selected && m.selected.length) panel.dataset.row = m.selected[m.selected.length - 1];
  panel.dataset.selection = selected;
  const rows = S.fam.helpers.visibleRows(m, S.spec);
  const record = S.spec.rows.find(r => r.id === panel.dataset.row) || rows[0] || S.spec.rows[0];
  if (!record) return;
  panel.dataset.row = record.id;
  panel.replaceChildren();
  const el = S.P.el;
  const tabs = el('div', 'ticket-detail-tabs', panel);
  for (const text of ['Details', 'Customer', 'Activity']) {
    const b = el('button', text === 'Details' ? 'active' : '', tabs, text);
    b.type = 'button';
    b.addEventListener('click', () => {
      tabs.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
      panel.querySelector('.ticket-detail-body').hidden = text !== 'Details';
      panel.querySelector('.ticket-detail-secondary').textContent = text === 'Customer' ? `${value('contact') || value('customer')} · Customer profile` : text === 'Activity' ? 'All changes are saved automatically.' : '';
    });
  }
  const value = id => S.spec.cols.some(c => c.id === id) ? String(S.fam.helpers.valueOf(m, S.spec, record, id) ?? '') : '';
  const body = el('div', 'ticket-detail-body', panel);
  el('div', 'ticket-detail-secondary', panel);
  const field = (label, text, id) => {
    const line = el('div', 'ticket-detail-field', body);
    el('span', 'ticket-detail-label', line, label);
    if (!id) { el('div', 'ticket-detail-value', line, text); return; }
    const b = el('button', 'ticket-detail-select', line);
    b.type = 'button'; b.setAttribute('aria-label', `Edit ${label}`);
    if (id === 'priority' || id === S.spec.statusCol) el('i', `ticket-dot ${id === 'priority' ? 'priority' : 'status'} ${text.toLowerCase().replace(/[^a-z]+/g, '-')}`, b);
    el('span', '', b, text); el('span', 'ticket-chevron', b, '⌄');
    b.addEventListener('click', () => {
      const old = panel.querySelector('.ticket-detail-menu');
      if (old) { old.remove(); return; }
      const menu = el('div', 'ticket-detail-menu', line);
      const choices = [...new Set(S.spec.rows.map(r => String(S.fam.helpers.valueOf(S.ctx.model, S.spec, r, id) ?? '')))];
      for (const choice of choices) {
        const option = el('button', '', menu, choice); option.type = 'button';
        option.addEventListener('click', () => {
          let next = S.fam.helpers.startEdit(S.ctx.model, S.spec, record.id, id);
          if (!next.editing) { menu.remove(); return; }
          next = S.fam.helpers.setDraftCell(next, choice);
          S.P.act(S.fam.helpers.commitEdit(next, S.spec));
        });
      }
    });
  };
  const idCol = S.spec.cols.find(c => c.type === 'id') || S.spec.cols[0];
  field('ID', value(idCol.id));
  field('Subject', value('subject') || value(S.spec.cols[1].id));
  field('Customer', value('contact') || value('customer') || value('client'));
  for (const id of ['owner', 'priority', S.spec.statusCol]) {
    const col = S.spec.cols.find(c => c.id === id);
    if (col) field(col.label, value(id), id);
  }
  el('hr', '', body);
  field('Created', value('created') || 'Apr 16, 2024, 9:14 AM');
  field('Updated', value('created') || 'Apr 16, 2024, 9:14 AM');
  const tags = el('div', 'ticket-detail-field', body);
  el('span', 'ticket-detail-label', tags, 'Tags');
  const chips = el('div', 'ticket-detail-tags', tags);
  for (const tag of ['support', 'customer']) el('span', '', chips, `${tag} ×`);
  const add = el('button', '', chips, '+ Add tag'); add.type = 'button';
  add.addEventListener('click', () => { if (!chips.querySelector('input')) { const i = el('input', '', chips); i.placeholder = 'Tag name'; i.addEventListener('keydown', e => { if (e.key === 'Enter' && i.value.trim()) { el('span', '', chips, `${i.value.trim()} ×`); i.remove(); } }); i.focus(); } });
  el('hr', '', body);
  el('div', 'ticket-description-label', body, 'Description');
  el('p', 'ticket-description', body, `${value('subject') || 'Customer support request'}. The customer is awaiting a response from the support team.`);
}

env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-virtual-06',
  name: 'design',
  split: 'train',
  scenarios: ['virtual'],
  template: 'use-data-grid/grid',
  design: {
    font: '16px/1.4 Georgia,"Times New Roman",serif',
    cardInsetX: 0,
    cardInsetY: 0,
    navWidth: 0,
    railWidth: 0,
  contextWidth: 0,
    expandedAt: 99999,
  contextAt: 99999,
    rowMin: 18,
    rowMax: 32,
    parts: {
      appbar: (base, S) => () => { base(); if (S.appbar) S.appbar.hidden = true; },
      navigation: (base, S) => () => { base(); if (S.nav) S.nav.hidden = true; },
      contextPanel: (base, S) => () => { base(); const p = S.shell && S.shell.querySelector('.to-context'); if (p) p.hidden = true; },
      fit: (base, S) => () => {
        base();
        S.navW = 0; S.contextW = 0;
        S.cardW = Math.round(S.W * .8525 * .733);
        S.shell.style.setProperty('--ticket-card-width', `${S.cardW}px`);
        const dock = document.documentElement.clientHeight <= 680 || document.documentElement.clientWidth <= 1100 ? 62 : 87;
        S.cardH = Math.max(200, S.H - dock - 12);
        S.shell.style.setProperty('--ticket-card-height', `${S.cardH}px`);
        S.left = Math.round(S.W * .1475);
        S.top = 0;
      },
      heading: (base, S) => () => {
        const width = S.cardW;
        // Preserve the original heading's seeded decoy sample at compact sizes.
        S.cardW = Math.round(S.W * .70);
        base();
        S.cardW = width;
        if (S.title) S.title.textContent = 'All Tickets';
      },
      tabs: (base, S) => () => { base(); if (S.tabs) S.tabs.hidden = true; },
      stream: (base, S) => () => { base(); if (S.stream) S.stream.hidden = true; },
      toolbar: (base, S) => () => {
        base();
        if (S.input) S.head.append(S.input.parentElement);
      },
      grid: (base, S) => () => {
        S.scale = Math.max(.35, Math.min(1.5, (S.card.clientWidth - 90) / S.nominal));
        base();
        // Preserve the native virtualizer's rows-per-wheel distance at this design's larger row height.
        S.body.addEventListener('wheel', e => {
          if (S.virtual && S.rowH > 32) S.body.scrollTop += e.deltaY * (S.rowH / 32 - 1);
        }, { capture: true, passive: true });
        const inspector = S.P.el('aside', 'ticket-inspector', S.shell);
        inspector.setAttribute('aria-label', 'Ticket details');
        const filters = S.P.el('div', 'ticket-filters', S.head);
        for (const id of ['status', 'priority']) {
          const part = S.parts[id];
          const col = S.spec.cols.find(c => c.id === id);
          if (!part || !part.funnel || !col) continue;
          const control = part.funnel;
          control.classList.add('ticket-filter');
          control.setAttribute('role', 'button');
          control.tabIndex = 0;
          control.setAttribute('aria-label', `Filter ${col.label}`);
          const label = S.P.el('span', 'ticket-filter-label', null, `${col.label}: All`);
          control.prepend(label);
          control.querySelector('svg').outerHTML = S.D.icons.down;
          control.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); control.click(); }
          });
          filters.append(control);
        }
        const track = S.P.el('div', 'ticket-scrollbar', S.grid);
        track.setAttribute('aria-hidden', 'true');
        S.P.el('div', 'ticket-scrollbar-thumb', track);
      },
      drawTools: (base, S) => m => {
        base(m);
        sandridgeInspector(S, m);
        const rows = S.fam.helpers.visibleRows(m, S.spec);
        const statuses = rows.map(r => String(S.fam.helpers.valueOf(m, S.spec, r, S.spec.statusCol)));
        const open = statuses.filter(s => /^open$/i.test(s)).length;
        const closed = statuses.filter(s => /^(closed|resolved)$/i.test(s)).length;
        S.count.textContent = `${rows.length.toLocaleString('en-US')} tickets`;
        for (const id of ['status', 'priority']) {
          const label = S.head.querySelector(`[aria-label="Filter ${S.spec.cols.find(c => c.id === id)?.label}"] .ticket-filter-label`);
          if (label) label.textContent = `${S.spec.cols.find(c => c.id === id).label}: ${m.filters[id]?.join(', ') || 'All'}`;
        }
      },
      drawRows: (base, S) => m => {
        // Match the task's six-row window to the space left by the actual
        // heading, tools and footer, including the compact presentation.
        const card = S.head.parentElement;
        const fixed = [...card.children].filter(node => node !== S.grid &&
          getComputedStyle(node).position !== 'absolute').reduce((sum, node) => sum + node.offsetHeight, 0);
        const headerHeight = S.grid.querySelector('.to-hrow').offsetHeight;
        const rowCount = S.H >= 650 ? 10 : S.H >= 500 ? 8 : 6;
        S.rowH = Math.max(20, Math.min(52, Math.floor((card.clientHeight - fixed - headerHeight - 18) / rowCount)));
        if (!S.virtual) { base(m); return; }
        S.drawing = true;
        const scrollTop = S.body.scrollTop;
        S.body.replaceChildren();
        const records = S.fam.helpers.visibleRows(m, S.spec);
        const start = m.virtualTop || 0;
        const rows = records.slice(start, start + rowCount);
        S.P.el('div', '', S.body).style.height = `${start * S.rowH}px`;
        const selected = new Set(m.selected);
        for (const r of rows) S.P.row(r, m, selected);
        // The task's virtual cursor can reach the final six-record window.
        // Keep that scroll range when the visual pane displays additional rows.
        S.P.el('div', '', S.body).style.height = `${Math.max(0, records.length - start - rows.length + rowCount - 6) * S.rowH}px`;
        S.body.scrollTop = Math.floor(scrollTop / S.rowH) === start ? scrollTop : start * S.rowH;
        S.drawing = false;
        if (!S.virtual) return;
        S.body.style.height = `${rowCount * S.rowH}px`;
        S.grid.style.height = `${headerHeight + rowCount * S.rowH}px`;
        const thumb = S.grid.querySelector('.ticket-scrollbar-thumb');
        const trackHeight = Math.max(0, S.grid.clientHeight - 8);
        const thumbHeight = Math.min(200, trackHeight * .44);
        const capacityNow = Math.ceil(S.body.clientHeight / S.rowH);
        thumb.style.height = `${thumbHeight}px`;
        thumb.style.top = `${(m.virtualTop || 0) / Math.max(1, S.spec.rows.length - capacityNow) * (trackHeight - thumbHeight)}px`;
      },
      rowReady: (base, S) => (row, r, m) => {
        base(row, r, m);
        row.addEventListener('click', () => {
          const panel = S.shell.querySelector('.ticket-inspector');
          if (panel) { panel.dataset.row = r.id; sandridgeInspector(S, S.ctx.model); }
        });
      },
      drawFoot: (base, S) => m => {
        base(m);
        if (!S.virtual) return;
        const n = S.fam.helpers.visibleRows(m, S.spec).length;
        const capacity = Math.floor(S.body.clientHeight / S.rowH);
        const start = m.virtualTop || 0;
        S.info.textContent = `${start + 1}–${Math.min(n, start + capacity)} of ${n} tickets`;
      },
    },
  },
});
