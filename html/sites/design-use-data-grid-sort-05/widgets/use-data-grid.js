// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-sort-05',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'use-data-grid/grid',
  design: {
    font: '15px/1.4 Arial, sans-serif',
    parts: {
      fit: (base, S) => function () {
        base();
        S.cardW = Math.round(S.W >= 1000 ? S.W * .735 : S.W - 40);
        S.cardH = S.H - 52;
        S.left = Math.round(S.W >= 1000 ? S.W * .061 : 20);
        S.top = 22;
        S.rowH = S.W >= 1100 ? 46 : 40;
      },
      card: (base, S) => function () {
        base();
        S.card.style.setProperty('--nw-left', S.left + 'px');
        S.card.style.setProperty('--nw-width', S.cardW + 'px');
        S.card.classList.toggle('nw-compact', S.cardW < 850);
        S.card.classList.toggle('nw-narrow', S.cardW < 720);
      },
      fmtShow: (base, S) => (a, b, n) => `${a}–${b} of ${n}`,
      heading: (base, S) => function () {
        base();
        for (const button of S.head.querySelectorAll('button')) button.classList.add('nw-utility');
        const controls = S.util.el('div', 'nw-heading-tools', S.head);
        const search = S.util.el('div', 'nw-search', controls);
        search.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><span>Search orders...</span>';
        const filters = S.util.el('button', 'to-btn nw-filter', controls, 'Filters');
        filters.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3h18l-7 8v9h-4v-9z"/></svg><span>Filters</span><span class="nw-chevron">⌄</span>';
        const columns = S.util.el('button', 'to-btn nw-columns', controls, 'Columns');
        columns.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18"/></svg><span>Columns</span><span class="nw-chevron">⌄</span>';
      },
      toolbar: (base, S) => function () {
        base();
        const row = S.util.el('div', 'nw-bulk', S.card);
        const svg = (paths) => `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${paths}</svg>`;
        row.innerHTML = '<button type="button" class="to-btn nw-select"><i></i><span>⌄</span></button><button type="button" class="to-btn">' + svg('<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>') + '<span>Delete</span></button><button type="button" class="to-btn">' + svg('<path d="M2 4h12v13H2zM14 9h4l4 5v3h-8M5 17a2 2 0 1 0 4 0M16 17a2 2 0 1 0 4 0"/>') + '<span>Change Status</span>⌄</button><button type="button" class="to-btn">' + svg('<path d="m3 12 9-9h9v9l-9 9z"/><circle cx="17" cy="7" r="1"/>') + '<span>Add Tag</span>⌄</button><button type="button" class="to-btn">' + svg('<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>') + '<span>More</span>⌄</button>';
        S.head.after(row);
      },
      grid: (base, S) => function () {
        S.scale = (S.cardW - (S.W >= 1100 ? 96 : 88)) / S.nominal;
        base();
      },
      footer: (base, S) => function () {
        base();
        const dock = S.util.el('div', 'nw-page', S.card.querySelector('.nw-bulk'));
        dock.append(S.info, S.pagerWrap);
        S.info.style.order = '-1';
        S.pagerWrap.style.order = '1';
      },
      pageButton: (base, S) => function (label, key, disabled, cls = '') {
        const button = base(label, key, disabled, cls);
        if (/prev|next/i.test(label)) {
          button.textContent = /prev/i.test(label) ? '‹' : '›';
          button.setAttribute('aria-label', label);
        }
        return button;
      },
      cellContent: (base, S) => function (cell, r, id, m, text) {
        base(cell, r, id, m, text);
        if (S.statusOpts.includes(text) && cell.firstElementChild) {
          const pill = cell.firstElementChild;
          pill.classList.add('nw-status');
          const colors = { Pending: '#ffe9b8', Processing: '#cbe4ff', Shipped: '#cdf2dc', Delivered: '#cdf2d7', Cancelled: '#ffc5c3' };
          if (colors[text]) pill.style.backgroundColor = colors[text];
        }
      },
      cellReady: (base, S) => function (cell, r, id, m) {
        base(cell, r, id, m);
        for (const node of cell.querySelectorAll('code, small, .mono')) {
          node.style.fontSize = 'inherit';
          node.style.fontFamily = 'inherit';
          node.style.color = 'inherit';
        }
      },
      rendered: (base, S) => function (ctx) {
        base(ctx);
        const search = S.head.querySelector('.nw-search');
        if (S.input) {
          search.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg>';
          search.appendChild(S.input);
          S.input.placeholder = 'Search orders...';
        }
        const bulk = S.card.querySelector('.nw-bulk');
        if (S.selBar) {
          S.selBar.classList.add('nw-selection');
          bulk.prepend(S.selBar);
        }
        const buttons = bulk.querySelectorAll(':scope > button');
        buttons[0].addEventListener('click', () => S.allBox.click());
        if (S.delBtn) buttons[1].addEventListener('click', () => S.delBtn.click());
        if (S.markBtn) buttons[2].addEventListener('click', () => S.markBtn.click());
        const menu = S.util.el('div', 'nw-action-menu', S.card);
        menu.hidden = true;
        for (const button of S.head.querySelectorAll('.nw-utility')) menu.appendChild(button);
        buttons[4].addEventListener('click', () => { menu.hidden = !menu.hidden; });
        S.head.querySelector('.nw-columns').addEventListener('click', () => { menu.hidden = !menu.hidden; });
        S.head.querySelector('.nw-filter').addEventListener('click', () => {
          const filter = S.hrow.querySelector('.ib');
          if (filter) filter.click();
        });
      },
    },
  },
});
