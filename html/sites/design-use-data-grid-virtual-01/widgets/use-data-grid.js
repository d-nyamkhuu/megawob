// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-virtual-01',
  name: 'design',
  split: 'train',
  scenarios: ['virtual'],
  template: 'use-data-grid/grid',
  design: {
    font: '14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
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
        S.cardW = Math.round(S.W * (S.W < 1035 ? .88 : .70));
        S.shell.style.setProperty('--ticket-card-width', `${S.cardW}px`);
        S.cardH = S.H;
        S.left = Math.round((S.W - S.cardW) / 2);
        S.top = 0;
      },
      heading: (base, S) => () => {
        const width = S.cardW;
        // Preserve the original heading's seeded decoy sample at compact sizes.
        S.cardW = Math.round(S.W * .70);
        base();
        S.cardW = width;
        if (S.title) S.title.textContent = 'Support Tickets';
      },
      tabs: (base, S) => () => { base(); if (S.tabs) S.tabs.hidden = true; },
      stream: (base, S) => () => { base(); if (S.stream) S.stream.hidden = true; },
      grid: (base, S) => () => {
        base();
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
        const rows = S.fam.helpers.visibleRows(m, S.spec);
        const statuses = rows.map(r => String(S.fam.helpers.valueOf(m, S.spec, r, S.spec.statusCol)));
        const open = statuses.filter(s => /^open$/i.test(s)).length;
        const closed = statuses.filter(s => /^(closed|resolved)$/i.test(s)).length;
        S.count.textContent = `${rows.length} tickets · ${open} open · ${closed} closed`;
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
        S.rowH = Math.max(S.D.rowMin, Math.min(S.D.rowMax, Math.floor((card.clientHeight - fixed - headerHeight) / 6)));
        base(m);
        if (!S.virtual) return;
        S.body.style.height = `${6 * S.rowH}px`;
        S.grid.style.height = `${headerHeight + 6 * S.rowH}px`;
        const thumb = S.grid.querySelector('.ticket-scrollbar-thumb');
        const trackHeight = Math.max(0, S.grid.clientHeight - 8);
        const thumbHeight = Math.min(200, trackHeight * .44);
        const capacityNow = Math.ceil(S.body.clientHeight / S.rowH);
        thumb.style.height = `${thumbHeight}px`;
        thumb.style.top = `${(m.virtualTop || 0) / Math.max(1, S.spec.rows.length - capacityNow) * (trackHeight - thumbHeight)}px`;
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
