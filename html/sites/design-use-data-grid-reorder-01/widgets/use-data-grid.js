// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-reorder-01',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-data-grid/grid',
  design: {
    font: "17px/1.3 Georgia,'Times New Roman',serif",
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
        S.rowH = Math.min(44, Math.max(24, Math.floor((S.H - S.FIXED - 4) / S.spec.pageSize)));
      },
      card: (base, S) => () => {
        base();
        S.card.classList.remove('upper', 'dense');
      },
      heading: (base, S) => () => {
        const width = S.cardW;
        S.cardW = S.organizerOriginalWidth;
        base(); // Preserve the sampled heading actions and their draw count.
        S.cardW = width;
        const toolbar = document.querySelector('.organizer-toolbar');
        const group = toolbar.querySelector('.organizer-record-tools');
        group.replaceChildren();
        for (const button of [...S.head.querySelectorAll('button')]) group.append(button);
        const icon = S.P.el('span', 'organizer-object-icon', S.object);
        icon.innerHTML = window.organizerOfficeIcon('box');
        S.object.prepend(icon);
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
        S.info.style.order = '2';
        S.info.style.marginLeft = '20px';
        S.rpp.hidden = false;
        S.rpp.textContent = 'Rows per page: ';
        S.P.el('span', 'organizer-pagesize', S.rpp, String(S.spec.pageSize) + '　▾');
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
        if (prev) { prev.textContent = '◀'; prev.title = 'Previous page'; }
        if (next) { next.textContent = '▶'; next.title = 'Next page'; }
        const first = S.P.el('button', 'to-pg', S.pagerWrap, '▮◀');
        first.title = 'First page'; first.disabled = m.page === 0;
        first.addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, 0)));
        S.pagerWrap.prepend(first);
        const last = S.P.el('button', 'to-pg', S.pagerWrap, '▶▮');
        last.title = 'Last page'; last.disabled = m.page >= S.fam.helpers.pageCount(m, S.spec) - 1;
        last.addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, S.fam.helpers.pageCount(S.ctx.model, S.spec) - 1)));
        const pageButtons = [...S.pagerWrap.children].filter(n => n !== first && n !== last && n !== prev && n !== next);
        if (next) S.pagerWrap.insertBefore(next, pageButtons[0] || last);
        S.pagerWrap.insertBefore(last, pageButtons[0] || null);
        const pageLabel = S.P.el('span', 'organizer-page-label', S.pagerWrap, 'Page');
        for (const button of pageButtons) S.pagerWrap.append(button);
        S.P.el('span', 'organizer-page-label', S.pagerWrap, 'of ' + S.fam.helpers.pageCount(m, S.spec));
        void pageLabel;
      },
      rendered: (base, S) => ctx => {
        base(ctx);
        const panel = document.querySelector('.organizer-customers');
        const index = panel.querySelector('.organizer-index');
        const detail = panel.querySelector('.organizer-detail');
        const search = panel.querySelector('input');
        const nameCol = S.spec.cols.find(c => /customer|client|name|product|employee|item/i.test(c.id + ' ' + c.label)) || S.spec.cols[0];
        const second = S.spec.cols.find(c => c.type === 'cat' && c.id !== nameCol.id) || S.spec.cols[1];
        panel.querySelector('h2').textContent = /customer|client/i.test(nameCol.label) ? 'Customers' : S.spec.entities.charAt(0).toUpperCase() + S.spec.entities.slice(1);
        const people = S.P.el('span', 'organizer-people-icon', panel.querySelector('h2'));
        people.innerHTML = window.organizerOfficeIcon('people');
        panel.querySelector('h2').prepend(people);
        search.placeholder = '⌕  Search ' + S.spec.entities + '...';
        const heading = S.P.el('div', 'organizer-index-heading', index);
        S.P.el('span', '', heading, nameCol.label);
        S.P.el('span', '', heading, second.label);
        const list = S.P.el('div', 'organizer-record-list', index);
        let selected = S.spec.rows[0].id;
        const choose = r => {
          selected = r.id;
          for (const row of list.children) row.classList.toggle('selected', row.dataset.id === r.id);
          detail.replaceChildren();
          const name = S.P.el('strong', '', detail, String(r.c[nameCol.id]));
          const icon = S.P.el('span', 'organizer-detail-icon', name);
          icon.innerHTML = window.organizerOfficeIcon('building');
          name.prepend(icon);
          const data = S.P.el('dl', '', detail);
          for (const c of S.spec.cols.filter(c => c.id !== nameCol.id)) {
            S.P.el('dt', '', data, c.label + ':');
            S.P.el('dd', '', data, S.fam.helpers.cellText(S.spec, r, c.id, S.ctx.model));
          }
        };
        S.organizerChoose = choose;
        const fill = () => {
          list.replaceChildren();
          for (const r of S.spec.rows.filter(r => Object.values(r.c).some(v => String(v).toLowerCase().includes(search.value.toLowerCase())))) {
            const row = S.P.el('button', 'organizer-customer', list);
            row.type = 'button'; row.dataset.id = r.id;
            row.classList.toggle('selected', r.id === selected);
            S.P.el('span', '', row, String(r.c[nameCol.id]));
            S.P.el('span', '', row, String(r.c[second.id]));
            row.addEventListener('click', () => choose(r));
          }
        };
        search.addEventListener('input', fill);
        fill(); choose(S.spec.rows[0]);
      },
    },
  },
});
