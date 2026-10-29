// Adds a clearable search bar, category tabs and a scrollable all-results list.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-search-07',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  template: 'use-shop/store',
  design: {
    parts: {
      searchBar: (base, S) => (V) => {
        base(V);
        const clear = S.H.btn(V.util, 'se-clear', V.box, '×');
        clear.setAttribute('aria-label', 'Clear search');
        clear.addEventListener('click', () => {
          V.tf.set('');
          V.commit({ ...V.ctx.model, text: '' });
          V.input.focus();
        });
        V.go.textContent = 'Search';
        const tabs = V.util.el('div', 'se-tabs', V.col);
        ['All', 'Articles', 'Videos', 'Images', 'Shopping', 'Forums'].forEach((t, i) =>
          V.util.el('span', i ? '' : 'on', tabs, t),
        );
      },
      searchPanes: (base) => (V) => {
        base(V);
        V.list.append(V.pager);
      },
      searchSizing: () => (V) => {
        V.cardH = 90;
        V.lines = 2;
        V.col.style.setProperty('--se-lines', 2);
      },
      searchEmpty: (base) => (V, m) => {
        base(V, m);
        V.list.append(V.pager);
      },
      searchMeta: () => (V, m) => {
        const hash = [...m.query.toLowerCase()].reduce((h, c) => Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0, 2166136261);
        const n = 1000 + (hash % 90000) * 13;
        V.meta.textContent = `About ${n.toLocaleString('en-US')} results (0.32 seconds)`;
      },
      searchCard: (base) => (V, r, i, res, m, parent) => {
        base(V, r, i, res, m, parent);
        const card = V.titles[i].parentElement;
        card.style.height = '';
        card.style.minHeight = V.cardH + 'px';
        card.removeAttribute('data-ordinal');
        card.classList.remove('se-dense');
        const url = card.querySelector('.se-url');
        url.querySelector('.se-host').textContent = `https://${r.host}/${r.path}`;
        url.querySelector('.se-path').textContent = '';
      },
      searchRows: (base, S) => (V, m, res) => {
        res.forEach((r, i) => S.P.searchCard(V, r, i, res, m));
        return false;
      },
      searchPager: (base) => (V, m) => {
        base(V, m);
        V.list.append(V.pager);
        const p0 = m.page * V.spec.perPage;
        V.list.scrollTop = V.titles[p0] ? Math.max(0, V.titles[p0].parentElement.offsetTop - 10) : 0;
      },
      searchLocate: (base, S) => (V, t) => {
        const el = t.page !== undefined ? V.pages[t.page]
          : t.pager ? (t.pager === 'prev' ? V.prev : V.next)
            : t.result !== undefined ? V.titles[t.result] : null;
        if (el) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        return base(V, t);
      },
    },
  },
});
