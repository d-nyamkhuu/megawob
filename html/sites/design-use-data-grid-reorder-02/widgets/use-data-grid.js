// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-reorder-02',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-data-grid/grid',
  design: {
    font: "15px/1.3 Arial,'Helvetica Neue',sans-serif",
    parts: {
      appbar: (base, S) => () => {
        S.shell = S.P.el('section', 'to-workspace organizer-workspace', S.ctx.stage);
        S.shell.setAttribute('aria-label', 'Orders workspace');
      },
      navigation: (base, S) => () => {
        base(); // Keep the workspace's four seeded navigation draws.
        S.nav.remove();
      },
      contextPanel: () => () => {},
      fit: (base, S) => () => {
        base();
        S.organizerOriginalWidth = S.cardW;
        S.left = 0; S.top = 0;
        S.cardW = S.W; S.cardH = S.H;
        S.FIXED = S.W < 1000 ? 56 + 80 + 60 : 64 + 96 + 80;
        S.rowH = Math.min(50, Math.max(24, Math.floor((S.H - S.FIXED - 4) / S.spec.pageSize)));
      },
      card: (base, S) => () => {
        base();
        S.card.classList.remove('upper', 'dense');
      },
      heading: (base, S) => () => {
        base(); // Preserve the sampled heading actions and their draw count.
        const actions = S.P.el('div', 'mac-actions', S.head);
        for (const [icon, title, caret] of [
          ['+', 'New Order', false],
          ['✎', 'Edit', true],
          ['', 'Change Status', true],
          ['▣', 'Print', true],
          ['▥', 'Delete', false],
        ]) {
          const item = S.P.el('span', 'mac-action', actions);
          if (icon) S.P.el('b', 'mac-action-icon', item, icon);
          S.P.el('span', '', item, title);
          if (caret) S.P.el('b', 'mac-action-caret', item, '⌄');
        }
        for (const button of [...S.head.children].filter(node => node.tagName === 'BUTTON')) actions.append(button);
      },
      tabs: () => () => {},
      toolbar: (base, S) => () => {
        base();
        if (!S.input) {
          const sb = S.P.el('label', 'to-search', S.head);
          sb.innerHTML = S.D.icons.search;
          S.input = S.P.el('input', '', sb);
          S.input.type = 'text';
          S.input.setAttribute('aria-label', 'Search records');
          S.input.addEventListener('input', () => S.P.act(S.fam.helpers.setQuery(S.ctx.model, S.input.value), false));
        }
        if (S.input) {
          S.input.placeholder = 'Search ' + S.spec.entities + '...';
          S.head.append(S.input.parentElement);
        }
      },
      grid: (base, S) => () => {
        S.scale = (S.cardW - 50) / S.nominal;
        base();
      },
      column: (base, S) => c => {
        base(c);
        const p = S.parts[c.id];
        p.dots.dataset.caption = c.type === 'money' || c.type === 'num' ? 'Any' : c.type === 'date' ? 'All Dates' : '';
        if (p.funnel) p.funnel.dataset.caption = 'All ' + (c.label === 'Category' ? 'Categories' : c.label === 'Status' ? 'Statuses' : c.label);
      },
      stream: () => () => {},
      footer: (base, S) => () => {
        base();
        S.info.style.order = '0';
        S.info.style.marginLeft = '24px';
        S.rpp.hidden = false;
        S.rpp.style.order = '-1';
        S.rpp.style.marginRight = '10px';
        S.rpp.textContent = 'Show ';
        S.P.el('span', 'organizer-pagesize', S.rpp, String(S.spec.pageSize) + '　⌄');
        S.P.el('span', 'page-suffix', S.rpp, ' per page');
      },
      drawTools: (base, S) => m => {
        base(m);
        S.tools.hidden = !(S.ctx.model.selected.length || Object.keys(S.ctx.model.filters).length || S.ctx.model.history.length || S.ctx.model.query);
        if (S.organizerChoose && m.selected.length) {
          const row = S.spec.rows.find(r => r.id === m.selected[m.selected.length - 1]);
          if (row) S.organizerChoose(row);
        }
      },
      drawFoot: (base, S) => m => {
        base(m);
        const prev = S.pgButtons.prev;
        const next = S.pgButtons.next;
        if (prev) { prev.textContent = '‹ Previous'; prev.title = 'Previous page'; }
        if (next) { next.textContent = 'Next ›'; next.title = 'Next page'; }
      },
      rendered: (base, S) => ctx => {
        base(ctx);
      },
    },
  },
});
