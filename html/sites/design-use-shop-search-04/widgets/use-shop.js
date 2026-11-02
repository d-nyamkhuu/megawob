// This design adds illustrated result marks, accessible paging, and wheel paging.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-search-04',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  scrollable: (spec) => spec.scenario === 'checkout' && spec.layout === 'page',
  template: 'use-shop/store',
  design: {
    parts: {
      built: (base, S) => (V) => {
        base(V);
        V.col.style.setProperty('--result-count', V.spec.perPage);
        V.col.style.setProperty('--page-count', V.spec.pages);
      },
      searchBar: (base, S) => (V) => {
        base(V);
        V.go.innerHTML = '<u>S</u>earch';
      },
      searchVisit: (base, S) => (V, m) => {
        base(V, m);
        const fav = V.visit.querySelector('.se-vsite .se-fav');
        fav.innerHTML = RESULT_ICONS[m.pick.index === 0 ? 0 : m.pick.index % 2 ? 1 : 2];
      },
      searchCard: (base, S) => (V, r, i, res, m, parent = V.list) => {
        base(V, r, i, res, m, parent);
        const card = parent.lastElementChild;
        delete card.dataset.ordinal;
        card.classList.remove('se-dense');
        const fav = card.querySelector('.se-fav');
        fav.innerHTML = RESULT_ICONS[i === 0 ? 0 : i % 2 ? 1 : 2];
        card.querySelector('.se-host').textContent = `https://${r.host}/`;
        card.querySelector('.se-path').textContent = r.path;
        if (!card.querySelector('.se-desc')) V.util.el('div', 'se-desc', card, r.desc);
      },
      searchRows: (base, S) => (V, m, res) => {
        V.list.style.counterReset = `r ${m.page * V.spec.perPage}`;
        return base(V, m, res);
      },
      searchPager: (base, S) => (V, m) => {
        base(V, m);
        const label = (button, text) => {
          button.setAttribute('aria-label', text);
          button.title = text;
        };
        label(V.prev, 'Previous results');
        V.pages.forEach((button, page) => label(button, `Results page ${page + 1}`));
        label(V.next, 'Next results');
      },
      searchWire: (base, S) => (V) => {
        base(V);
        V.list.addEventListener('wheel', (e) => {
          const m = V.ctx.model;
          if (m.query === null || m.pick || !e.deltaY) return;
          e.preventDefault();
          const page = Math.max(0, Math.min(V.spec.pages - 1, m.page + Math.sign(e.deltaY)));
          if (page !== m.page) V.commit({ ...m, page });
        }, { passive: false });
      },
    },
  },
});

const RESULT_ICONS = [
  '<svg viewBox="0 0 32 36" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="18" r="13" fill="#577ab8" stroke="#111" stroke-width="1.5"/><path d="m8 8 6-3 5 3-2 4 4 4-2 4-4-1-2 6-5-4-1-5-4-2zm14 15 6-3-2 6-4 3-2-2z" fill="#6a913b" stroke="#192b18" stroke-width="1.1"/></svg>',
  '<svg viewBox="0 0 32 36" xmlns="http://www.w3.org/2000/svg"><path d="M5 2h17l6 6v26H5z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M22 2v7h6M9 8h8M9 13h14M9 17h14M9 21h14M9 25h14M9 29h14" fill="none" stroke="#111" stroke-width="1.2"/></svg>',
  '<svg viewBox="0 0 32 36" xmlns="http://www.w3.org/2000/svg"><path d="m14 19-1 12-5 2v2h17v-2l-6-2-1-12z" fill="#855839" stroke="#17130f" stroke-width="1.3"/><path d="M3 15 2 11l3-4 2-3 5-1 3-2 5 2h3l4 4 2 4-1 6-4 3-3-2-3 4-4-3-3 1-3-3z" fill="#476c3f" stroke="#111" stroke-width="1.3"/></svg>',
];
