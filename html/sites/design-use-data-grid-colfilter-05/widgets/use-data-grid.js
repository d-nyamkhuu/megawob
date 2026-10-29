// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-colfilter-05',
  name: 'design',
  split: 'train',
  scenarios: ['colfilter'],
  template: 'use-data-grid/grid',
  design: {
    navWidth: 350,
    contextWidth: 0,
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    contextAt: 4000,
    contextHeight: 580,
    font: '16px/1.25 Arial, Helvetica, sans-serif',
    rowMin: 24,
    rowMax: 34,
    // Match the heading, search row, toolbar, grid header and footer below.
      fixedHeight: 38 + 142 + 94 + 48 + 2,
    parts: {
      locate: (base, S) => (target) => {
        const id = target && (target.row || target.rowBody || (target.cell && target.cell[0]));
        if (id && S.body) {
          const row = [...S.body.querySelectorAll('.to-row')].find(el => el.dataset.id === String(id));
          if (row) {
            const top = row.offsetTop;
            const bottom = top + row.offsetHeight;
            const visibleTop = S.body.scrollTop;
            const visibleBottom = visibleTop + S.body.clientHeight;
            if (bottom > visibleBottom) S.body.scrollTop = bottom - S.body.clientHeight + 3;
            else if (top < visibleTop) S.body.scrollTop = Math.max(0, top - 3);
          }
        }
        return base(target);
      },
      heading: (base, S) => () => {
        base();
        if (S.title) S.title.textContent = 'Tickets — Acme Corporation';
      },
      tabs: (base) => () => base(),
      toolbar: (base, S) => () => {
        base();
        const actions = S.P.el('div', 'next-actions', S.tools);
        const icons = {
          new: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 2h14l5 5v23H7zM21 2v6h5" fill="#e5e5e5" stroke="#222" stroke-width="2"/></svg>',
          reply: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M14 5 3 16l11 8v-6c10-1 13 4 15 9-1-12-5-16-15-17z" fill="#4b4b4b"/></svg>',
          assign: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="9" r="5" fill="#4a4a4a"/><path d="M6 29c0-7 4-11 10-11s10 4 10 11z" fill="#4a4a4a"/></svg>',
          status: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 6h22M5 12h22M5 18h22M5 24h22" stroke="#4a4a4a" stroke-width="3"/></svg>',
          priority: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 3v26" stroke="#333" stroke-width="2.5"/><path d="M9 5c5-2 8 2 16 0v16c-8 2-11-2-16 0z" fill="#4b4b4b"/></svg>',
          delete: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 8h18M12 8V5h8v3M9 10l1 18h12l1-18M14 13v11m4-11v11" fill="none" stroke="#333" stroke-width="2.5"/></svg>',
          archive: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 7h24v6H4zM7 13h18v15H7zM12 17h8" fill="#d6d6d6" stroke="#333" stroke-width="2"/></svg>',
        };
        const icon = (button, key) => button.insertAdjacentHTML('afterbegin', icons[key]);
        const tool = (label, key, fn) => {
          const b = S.P.el('button', 'to-btn next-action', actions, label);
          b.type = 'button'; b.dataset.key = key; icon(b, key);
          b.addEventListener('click', fn);
          return b;
        };
        actions.appendChild(S.nb);
        S.nb.classList.add('next-action'); S.nb.dataset.key = 'new'; S.nb.textContent = 'New'; icon(S.nb, 'new');
        tool('Reply', 'reply', () => S.P.showUtility('Reply', ['Select a ticket to write a reply.']));
        tool('Assign', 'assign', () => S.P.showUtility('Assign', ['Select tickets to assign.']));
        actions.appendChild(S.markBtn);
        S.markBtn.classList.add('next-action'); S.markBtn.textContent = 'Set Status'; icon(S.markBtn, 'status');
        tool('Set Priority', 'priority', () => S.P.showUtility('Set Priority', ['Select tickets to set priority.']));
        actions.appendChild(S.delBtn);
        S.delBtn.classList.add('next-action'); S.delBtn.textContent = 'Delete'; icon(S.delBtn, 'delete');
        actions.appendChild(S.archBtn);
        S.archBtn.classList.add('next-action', 'next-archive'); S.archBtn.textContent = 'Archive'; icon(S.archBtn, 'archive');
        actions.insertBefore(S.undoBtn, actions.firstChild);
        const searchLine = S.P.el('div', 'next-search-line', S.tools);
        if (!S.input) {
          const sb = S.P.el('label', 'to-search', searchLine);
          S.P.el('span', 'next-search-icon', sb, '⌕');
          S.input = S.P.el('input', '', sb);
          S.input.type = 'text';
          S.input.placeholder = 'Search tickets';
          S.input.value = S.ctx.model.query || '';
          S.input.addEventListener('input', () => S.P.act(S.fam.helpers.setQuery(S.ctx.model, S.input.value), false));
        } else searchLine.appendChild(S.input.parentElement);
        const label = S.P.el('span', 'next-show-label', searchLine, 'Show:');
        const show = S.P.el('button', 'next-show', searchLine, 'All Tickets');
        show.type = 'button'; show.setAttribute('aria-label', 'Show All Tickets');
        show.addEventListener('click', () => S.P.showUtility('Show tickets', ['All Tickets']));
        void label;
      },
      drawTools: (base, S) => (model) => {
        base(model);
        const selected = model.selected.length > 0;
        S.archBtn.hidden = !selected;
        S.archBtn.style.order = selected ? '-1' : '';
      },
      column: (base, S) => (c) => {
        base(c);
        const h = S.hcells[c.id];
        const filter = S.P.el('div', 'next-column-filter', h);
        filter.setAttribute('aria-label', `Filter ${c.label}`);
        if (S.parts[c.id].funnel) {
          const funnel = S.parts[c.id].funnel;
          funnel.innerHTML = '▼';
          filter.appendChild(funnel);
          filter.addEventListener('pointerdown', e => e.stopPropagation());
          filter.addEventListener('click', e => { e.stopPropagation(); if (e.target !== funnel) funnel.click(); });
        } else {
          filter.classList.add('next-text-filter');
          filter.addEventListener('pointerdown', e => e.stopPropagation());
          filter.addEventListener('click', e => { e.stopPropagation(); if (S.input) S.input.focus(); });
        }
      },
      decorate: () => () => {},
      cellContent: (base, S) => (cell, r, id, m, value) => {
        const span = S.P.el('span', '', cell, value);
        span.title = value;
      },
      contextPanel: (base, S) => () => {
        base();
        const panel = S.shell.querySelector('.to-context');
        if (!panel) return;
        panel.classList.add('next-hidden-context');
      },
    },
    extraCss: `
      .to-workspace { background:transparent!important; border:0!important; box-shadow:none!important; width:100%!important; height:100%!important; max-width:none!important; }
      .to-appbar,.to-nav,.to-stream,.to-tabs,.to-facts { display:none!important; }
      .to-card { width:100%!important; height:100%!important; max-width:none!important; max-height:none!important; border-radius:0!important; box-shadow:none!important; }
      .to-context { display:none!important; }
    `,
  },
});
