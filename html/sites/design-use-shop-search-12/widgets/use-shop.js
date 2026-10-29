// GreenLeaf keeps the notebook search layout, its all-results list, and the side-column preview in the main pane.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-search-12',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  template: 'use-shop/adapted',
  design: {
    brand: 'GreenLeaf',
    sizing: 'reference',
    sideDetail: false,
    extraCss: '\n.design-header{height:94px}.site-shell{grid-template-rows:94px minmax(0,1fr) 62px}.design-brand{font:700 53px Georgia}.design-nav{font:16px Georgia}.task-note{padding:30px;background:#fff8de;font-size:25px;font-weight:400;margin:16px;border:1px solid #d6cfb5;align-self:start}.task-note h2{font:700 36px Georgia}.stage{margin:15px 0 0 24px;border:1px solid #d1cbbd}.se-title{color:#a51c16}.end-control{background:#a92323}',
    parts: {
      searchBar: (base, S) => (V) => {
        const { util, spec, rng, col } = V;
        V.sectionTitle = util.el('h1', 'search-section-title', col, 'SEARCH');
        V.bar = util.el('div', 'se-bar', col);
        V.box = util.el('div', 'se-box', V.bar);
        V.box.innerHTML = S.H.ICON.search;
        const input = (V.input = util.el('input', 'se-input', V.box));
        Object.assign(input, {
          type: 'text',
          autocomplete: 'off',
          spellcheck: false,
          placeholder: rng.pick(['Search the web', `Search ${spec.engine}`, 'Type to search', 'What are you looking for?']),
        });
        input.dataset.role = 'search-field';
        const clear = S.H.btn(util, 'se-clear', V.box, '');
        clear.setAttribute('aria-label', 'Clear search');
        clear.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3l10 10M13 3L3 13"/></svg>';
        clear.addEventListener('click', () => {
          V.tf.set('');
          V.commit({ ...V.ctx.model, text: '' });
          input.focus();
        });
        V.go = S.H.btn(util, 'as-btn primary se-go', V.bar, rng.pick(['Search', 'Search', 'Go']), 'search-button');
        V.go.textContent = 'Search';
      },
      searchSort: (base, S) => (V) => {
        const { util, col } = V;
        const bar = V.bar;
        const sortLabel = util.el('span', 'se-lbl', bar, 'Sort by:');
        const sort = util.el('span', 'se-fsel', bar, 'Relevance');
        sort.setAttribute('aria-hidden', 'true');
        const categoryLabel = util.el('span', 'se-lbl', bar, 'Category:');
        const category = util.el('span', 'se-fsel cat', bar, 'All');
        category.setAttribute('aria-hidden', 'true');
        const save = S.H.btn(util, 'as-btn save-view', bar, '');
        save.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="#444"><path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.3 7.3 0 00-1.69-.98L14.5 3.42a.5.5 0 00-.5-.42h-4a.5.5 0 00-.5.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 00-.61.22l-2 3.46a.5.5 0 00.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 00-.12.64l2 3.46a.5.5 0 00.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65a.5.5 0 00.5.42h4a.5.5 0 00.5-.42l.38-2.65a7.3 7.3 0 001.69-.98l2.49 1a.5.5 0 00.61-.22l2-3.46a.5.5 0 00-.12-.64zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg><span><b>Save view</b><i>(layout only)</i></span>';
        save.title = 'layout only';
        save.addEventListener('click', () => env.log('decoy', { what: 'Save view' }));
        V.meta = util.el('div', 'se-meta', col);
      },
      searchMeta: () => (V, m, res) => {
        V.meta.textContent = `RESULTS   (${res.length} found)`;
      },
      searchCard: (base, S) => (V, r, i, res, m, parent = V.list) => {
        const { ctx, util, spec, cardH, titles, commit } = V;
        const card = util.el('div', 'se-card', parent);
        util.el('b', 'result-number', card, String(i + 1) + '.');
        card.style.height = cardH + 'px';
        card.classList.toggle('compact', cardH < 60);
        const url = util.el('div', 'se-url', card);
        const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
        fav.style.background = S.H.FAV[S.H.hashStr(r.host) % S.H.FAV.length];
        fav.setAttribute('aria-hidden', 'true');
        fav.innerHTML = i % 2 === 0
          ? '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="7" rx="4.3" ry="4.8"/><path d="M3.5 21c0-5.4 3.7-8 8.5-8s8.5 2.6 8.5 8z"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h14v2H5zM4 6h16l1.5 5a3 3 0 01-5 1 3 3 0 01-4.5 0 3 3 0 01-4.5 0 3 3 0 01-5-1zM4 13h3v6h3v-5h4v5h3v-6h3v9H4z"/></svg>';
        util.el('span', 'se-host', url, r.host);
        util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
        const title = util.el('a', 'se-title', card, r.title);
        title.dataset.role = 'result';
        title.dataset.index = i;
        title.addEventListener('click', () => {
          if (ctx.model.pick) return;
          const page = Math.floor(i / spec.perPage);
          if (page !== ctx.model.page) V.pages[page].click();
          commit(S.H.F().apply(ctx.model, spec, { click: { result: i } }));
        });
        titles[i] = title;
        const detail = util.el('div', 'se-desc', card);
        util.el('span', 'se-source', detail, r.host.replace(/^www\./, ''));
        util.el('span', 'se-detail-divider', detail, '|');
        util.el('span', 'se-location', detail, r.path.replace(/\//g, ' › '));
        detail.title = r.desc;
        const hash = S.H.hashStr(r.title);
        const starsCount = 3 + (hash % 3);
        const categories = ['Books', 'Home & Living', 'Music', 'Clothing', 'Art & Prints', 'Office Supplies', 'People'];
        const category = util.el('span', 'se-cat', card, categories[hash % categories.length]);
        category.setAttribute('aria-hidden', 'true');
        const stars = util.el('span', 'se-stars', card);
        stars.setAttribute('aria-hidden', 'true');
        for (let s = 0; s < 5; s++) {
          const star = util.el('span', 'se-star' + (s < starsCount ? ' filled' : ''), stars);
          star.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L1.5 7.7l5.9-.9z"/></svg>';
        }
        util.el('span', 'se-review', stars, `(${20 + hash % 110})`);
      },
      searchPager: (base, S) => (V, m, res) => {
        const { util, spec, list, pager, commit, ctx } = V;
        const make = (label, page, cls = '') => {
          const button = S.H.btn(util, 'se-pg' + cls, pager, label);
          button.setAttribute('aria-label', page === 'prev' ? 'Previous results page' : page === 'next' ? 'Next results page' : `Results page ${page + 1}`);
          button.addEventListener('click', () => {
            if (ctx.model.pick || button.disabled) return;
            const nextPage = page === 'prev' ? ctx.model.page - 1 : page === 'next' ? ctx.model.page + 1 : page;
            if (nextPage >= 0 && nextPage < spec.pages && nextPage !== ctx.model.page) commit({ ...ctx.model, page: nextPage });
          });
          return button;
        };
        V.prev = make('‹', 'prev');
        V.prev.disabled = m.page === 0;
        for (let p = 0; p < spec.pages; p++) V.pages[p] = make(String(p + 1), p, p === m.page ? ' on' : '');
        V.next = make('›', 'next');
        V.next.disabled = m.page === spec.pages - 1;
        const p0 = m.page * spec.perPage;
        list.scrollTop = V.titles[p0] ? V.titles[p0].parentElement.offsetTop : 0;
      },
    },
  },
});
