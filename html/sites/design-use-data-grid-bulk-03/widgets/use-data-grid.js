// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-bulk-03',
  name: 'design',
  split: 'train',
  scenarios: ['bulk'],
  template: 'use-data-grid/grid',
  design: {
    parts: {
      heading(base, S) {
        return () => {
        base();
        S.cardW = S.W;
        S.cardH = S.H;
        const compact = S.H < 650;
        let head = compact ? 54 : 70;
        let tools = compact ? 94 : 112;
        let bottom = compact ? 100 : 134;
        const header = compact ? 36 : 46;
        // Preserve the catalog spacing until it would clip the last records.
        // The compact fields need 84px; the actions and pager need 84px.
        let deficit = Math.max(0, head + tools + bottom + header + 14 * S.spec.pageSize + 2 - S.H);
        if (compact && deficit) {
          const headingSpace = Math.min(10, deficit);
          head -= headingSpace;
          deficit -= headingSpace;
          const toolsSpace = Math.min(10, deficit);
          tools -= toolsSpace;
          deficit -= toolsSpace;
          bottom -= Math.min(16, deficit);
        }
        S.rowH = Math.max(14, Math.min(49, Math.floor((S.H - head - tools - bottom - header - 2) / S.spec.pageSize)));
        S.scale = Math.max(.3, (S.W - (compact ? 34 : 52) - (compact ? 44 : 68)) / S.nominal);
        S.card.style.setProperty('--catalog-head', head + 'px');
        S.card.style.setProperty('--catalog-tools', tools + 'px');
        S.card.style.setProperty('--catalog-header', header + 'px');
        S.card.style.setProperty('--catalog-bottom', bottom + 'px');
        S.card.style.setProperty('--catalog-row', S.rowH + 'px');
        S.card.style.setProperty('--catalog-count', S.spec.pageSize);
        S.card.style.setProperty('--catalog-grid', (header + S.rowH * S.spec.pageSize) + 'px');
        S.card.classList.toggle('catalog-compact', compact);
        S.P.el('span', 'catalog-range', S.head);
        const notice = document.body.classList.contains('ref-has-note') && document.querySelector('.ref-note');
        if (notice) {
          S.head.classList.add('catalog-note-head');
          S.head.prepend(notice);
        }
        };
      },
      toolbar(base, S) {
        return () => {
        base();
        const { P, fam, ctx, spec } = S;
        const oldView = S.tools.querySelector(':scope > .to-selinfo');
        if (oldView) oldView.remove();
        let search = S.input && S.input.parentElement;
        if (!search) {
          search = P.el('label', 'to-search', S.tools);
          S.input = P.el('input', '', search);
          S.input.type = 'text';
          S.input.addEventListener('input', () => P.act(fam.helpers.setQuery(ctx.model, S.input.value), false));
        }
        search.querySelectorAll('svg').forEach(x => x.remove());
        S.input.placeholder = '';
        S.input.setAttribute('aria-label', 'Search');
        const row = P.el('div', 'catalog-filters', S.tools);
        const searchGroup = P.el('div', 'catalog-filter catalog-search-group', row);
        P.el('span', '', searchGroup, 'Search:');
        searchGroup.append(search);
        const filter = (label, col) => {
          const group = P.el('div', 'catalog-filter', row);
          P.el('span', '', group, label + ':');
          const b = P.el('button', 'catalog-select', group, 'All');
          b.type = 'button';
          if (col) {
            b.dataset.filterCol = col.id;
            b.dataset.key = 'catalog-filter';
            b.setAttribute('aria-label', 'Filter ' + col.label);
            b.addEventListener('click', () => P.act(fam.helpers.openMenu(ctx.model, spec, col.id, 'filter')));
          } else b.disabled = true;
        };
        const status = spec.cols.find(c => c.id === spec.statusCol);
        const vendor = spec.cols.find(c => /vendor|supplier|client|customer/i.test(c.id + ' ' + c.label));
        filter('Status', status);
        filter(vendor ? vendor.label : 'Vendor', vendor);
        const dates = spec.cols.filter(c => c.type === 'date' || /date/i.test(c.id + ' ' + c.label));
        const dateInputs = [];
        for (const label of ['From', 'To']) {
          const group = P.el('label', 'catalog-filter catalog-date-group', row);
          P.el('span', '', group, label + ':');
          const box = P.el('span', 'catalog-date', group);
          const input = P.el('input', '', box);
          input.type = 'text';
          input.setAttribute('aria-label', label + ' date');
          input.placeholder = '';
          input.disabled = !dates.length;
          const icon = P.el('span', 'catalog-calendar', box);
          icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="17" rx="1"/><path d="M3 10h18M8 2v6m8-6v6M7 13h2m2 0h2m2 0h2M7 16h2m2 0h2m2 0h2M7 19h2m2 0h2m2 0h2"/></svg>';
          dateInputs.push(input);
          input.addEventListener('change', () => {
            const col = dates[0].id;
            const from = dateInputs[0].value, to = dateInputs[1].value;
            if (!from && !to) { P.act(fam.helpers.clearFilter(ctx.model, col)); return; }
            const draft = fam.helpers.distinct(spec, col, ctx.model).filter(v => (!from || v >= from) && (!to || v <= to));
            const opened = fam.helpers.openMenu(ctx.model, spec, col, 'filter');
            P.act(fam.helpers.applyFilter({ ...opened, menu: { ...opened.menu, draft } }, spec));
          });
        }
        const count = P.el('div', 'catalog-selection', S.card);
        count.append(S.selInfo);
        count.append(S.clearSelBtn);
        S.chips.classList.add('catalog-chips');
        S.clearAll.classList.add('catalog-clear-filters');
        S.selBar.classList.add('catalog-actions');
        S.undoBtn.classList.add('catalog-undo');
        };
      },
      drawTools(base, S) { return (m) => {
        base(m);
        const rows = S.fam.helpers.pageRows(m, S.spec);
        S.selInfo.textContent = `${m.selected.length} of ${rows.length} selected`;
        S.clearSelBtn.hidden = !m.selected.length;
        S.undoBtn.hidden = false;
        S.undoBtn.disabled = !m.history.length;
        for (const b of S.tools.querySelectorAll('[data-filter-col]')) {
          const values = m.filters[b.dataset.filterCol];
          b.textContent = values ? values.join(', ') || '(none)' : 'All';
        }
      }; },
      drawPop(base, S) { return (m) => {
        base(m);
        if (m.menu && m.menu.kind === 'filter' && S.pop) {
          const button = [...S.tools.querySelectorAll('[data-filter-col]')].find(b => b.dataset.filterCol === m.menu.col);
          if (button) S.P.place(S.pop, button, false);
        }
      }; },
      drawFoot(base, S) { return (m) => {
        base(m);
        const range = S.head.querySelector('.catalog-range');
        range.textContent = S.info.textContent + ' ' + S.spec.entities;
        S.rpp.textContent = 'Rows per page:';
        const value = S.P.el('span', 'catalog-page-size', S.rpp, String(S.P.sizeOf(m)));
        value.setAttribute('aria-label', 'Rows per page');
        const pages = S.fam.helpers.pageCount(m, S.spec);
        S.pagerWrap.classList.toggle('catalog-one-page', pages === 1);
        if (pages === 1 && S.pgButtons.p0) S.pgButtons.p0.textContent = 'Page 1 of 1';
        else {
          const page = S.P.el('span', 'catalog-page-label', S.pagerWrap, `Page ${Math.min(m.page, pages - 1) + 1} of ${pages}`);
          S.pagerWrap.insertBefore(page, S.pgButtons.next);
        }
      }; },
      decorate() { return () => {}; },
      cellContent(base, S) { return (cell, r, id, m, text) => {
        S.P.el('span', '', cell, text).title = text;
      }; },
    },
  },
});
