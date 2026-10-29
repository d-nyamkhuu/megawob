// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-virtual-03',
  name: 'design',
  split: 'train',
  scenarios: ['virtual'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'ProjectTracker',
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    fixedHeight: 190,
    rowMin: 26,
    rowMax: 30,
    parts: {
      appbar: (base, S) => () => { base(); S.appbar.hidden = true; },
      navigation: () => () => {},
      contextPanel: () => () => {},
      fit: (base, S) => () => {
        S.cardW = S.W - 4;
        S.cardH = S.H - 4;
        S.left = 0;
        S.top = 0;
        S.rowH = 31;
      },
      grid: (base, S) => () => {
        // The virtual window renders six rows. Keep its physical row pitch and
        // scroll viewport identical to the geometry used by the template.
        S.FIXED = S.head.offsetHeight + S.tools.offsetHeight + 38 + 74 + 2;
        S.rowH = Math.max(18, Math.min(31, Math.floor((S.cardH - S.FIXED) / S.spec.pageSize)));
        base();
        Object.assign(S.grid.style, {
          flex: '1 1 auto', minHeight: '0', display: 'flex', flexDirection: 'column',
        });
      },
      heading: (base, S) => () => {
        base();
        S.object.hidden = true;
        S.count.hidden = true;
        S.nb.hidden = true;
        const buttons = [...S.head.querySelectorAll('[data-role="xtra"]')].filter((b) => b !== S.nb);
        buttons.forEach((b, i) => { if (i === 0) b.textContent = 'Reassign'; else b.remove(); });
        S.nb.remove();
      },
      tabs: (base, S) => () => { base(); S.tabs.hidden = true; },
      toolbar: (base, S) => () => {
        base();
        const summary = S.util.el('div', 'irix-summary', S.tools,
          `Showing 1 – ${Math.min(S.spec.pageSize, S.spec.rows.length)} of ${S.spec.rows.length} issues`);
        S.tools.insertBefore(summary, S.tools.firstChild);
        const filters = S.util.el('div', 'irix-filters', S.tools);
        for (const wanted of ['Status', 'Priority', 'Owner', 'Component']) {
          const col = S.spec.cols.find((c) => c.label.toLowerCase() === wanted.toLowerCase());
          if (!col) continue;
          const label = S.util.el('span', 'irix-filter-label', filters, `${wanted}:`);
          const button = S.util.el('button', 'irix-filter-button', filters, 'All');
          button.type = 'button';
          button.setAttribute('aria-label', `${wanted} filter`);
          button.addEventListener('click', () => {
            const part = S.parts && S.parts[col.id];
            if (part && part.funnel) part.funnel.click();
          });
        }
        if (S.input && S.input.parentNode) S.tools.appendChild(S.input.parentNode);
        else {
          const search = S.util.el('label', 'to-search', S.tools);
          S.util.el('span', 'irix-search-glass', search, '⌕');
          S.input = S.util.el('input', '', search);
          S.input.type = 'text';
          S.input.placeholder = 'Search issues…';
          S.input.value = S.ctx.model.query || '';
          S.input.addEventListener('input', () => S.P.act(S.fam.helpers.setQuery(S.ctx.model, S.input.value), false));
        }
        for (const [button, label] of [[S.markBtn, 'Change Status'], [S.archBtn, 'Add Tag'], [S.delBtn, 'Delete'], [S.undoBtn, 'Undo']]) {
          button.textContent = label;
          S.head.appendChild(button);
        }
        S.selBar.hidden = true;
        S.clearAll.hidden = true;
      },
      stream: (base, S) => () => { base(); S.stream.hidden = true; },
    },
  },
});
