/* use-shop/_store-search: store search parts; designs still override each BASE part. */
(function () {
  'use strict';
  function install(BASE, S) {
    installSearchBar(BASE, S);
    installSearchRebuild(BASE, S);
  }

  function installSearchBar(BASE, S) {
    BASE.searchBar = (V) => {
      const { util, spec, rng, col } = V;
      V.bar = util.el('div', 'se-bar', col);
      V.box = util.el('div', 'se-box', V.bar);
      V.box.innerHTML = S.H.ICON.search;
      const input = (V.input = util.el('input', 'se-input', V.box));
      Object.assign(input, {
        type: 'text',
        autocomplete: 'off',
        spellcheck: false,
        placeholder: rng.pick([
          'Search the web',
          `Search ${spec.engine}`,
          'Type to search',
          'What are you looking for?',
        ]),
      });
      if (S.D.placeholder) input.placeholder = S.D.placeholder;
      input.dataset.role = 'search-field';
      V.go = S.H.btn(util, 'as-btn primary se-go', V.bar, rng.pick(['Search', 'Search', 'Go']), 'search-button');
      // Keep the sampled draw, while using this application's fixed menu caption.
      if (S.D.goLabel !== null) V.go.textContent = S.D.goLabel;
    };

    // The result count line, the result list, the pager and the page preview.
    BASE.searchPanes = (V) => {
      const { util, col } = V;
      V.meta = util.el('div', 'se-meta', col);
      V.list = util.el('div', 'se-list', col);
      V.pager = util.el('div', 'se-pager', col);
      V.visit = util.el('div', 'se-visit', col);
      V.visit.hidden = true;
      V.pager.style.minHeight = '44px';
    };

    // Result row height (V.cardH) and description lines (V.lines) from the body height.
    BASE.searchSizing = (V) => {
      const { spec, col, body } = V;
      const bh = body.getBoundingClientRect().height;
      const avail = bh - 32 - 46 - 40 - 50;
      V.cardH = Math.max(60, Math.min(118, Math.floor(avail / spec.perPage)));
      V.lines = V.cardH >= 98 ? 2 : V.cardH >= 78 ? 1 : 0;
      col.style.setProperty('--se-lines', Math.max(1, V.lines));
    };

    // The related searches column on wide stages.
    BASE.searchSide = env.templateLib('use-shop/_shared-search').searchSide(S);

    // The text field, focus tracking and the Search action (button and Enter).
    BASE.searchWire = env.templateLib('use-shop/_shared-search').searchWire(S);

    // The preview of the picked result (Back to results, the page's address, a few paragraphs).
    BASE.searchVisit = (V, m) => {
      const { ctx, util, spec, visit, commit } = V;
      visit.replaceChildren();
      const r = S.H.F().resultsFor(spec, m.query)[m.pick.index];
      const vb = util.el('div', 'se-vbar', visit);
      V.back = S.H.btn(util, 'as-btn sm', vb, S.D.backLabel, 'back');
      V.back.addEventListener('click', () => commit(S.H.F().apply(ctx.model, spec, { click: { back: true } })));
      util.el('span', '', vb, `https://${r.host}/${r.path}`);
      const page = util.el('div', 'se-vpage', visit);
      const site = util.el('div', 'se-vsite', page);
      const fav = util.el('span', 'se-fav', site, r.host.charAt(0).toUpperCase());
      fav.style.background = S.H.FAV[S.H.hashStr(r.host) % S.H.FAV.length];
      util.el('span', '', site, r.host.replace(/^www\./, ''));
      util.el('h2', '', page, r.title);
      util.el('p', '', page, r.desc);
      const extra = env.content.SENTENCES || [];
      if (extra.length) {
        const h = S.H.hashStr(`${r.host}|${r.title}`);
        util.el('p', '', page, [0, 1, 2].map((k) => extra[(h + k * 7919) % extra.length]).join(' '));
      }
    };

    // Before the result view is emptied (state of an earlier build a design has to release).
    BASE.searchReset = env.templateLib('use-shop/_shared-search').searchReset(S);

    // Which parts of the result view are hidden while the preview shows.
    BASE.searchHide = env.templateLib('use-shop/_shared-search').searchHide(S);

    // Before the first search: an empty-state prompt. Returns true when the view is done.
    BASE.searchEmpty = (V, m) => {
      V.meta.textContent = '';
      const e = V.util.el('div', 'se-empty', V.list);
      e.innerHTML = `${S.H.ICON.search}<div>Type your search above and press <b>${V.go.textContent}</b>.</div>`;
    };

    // The result count line (res = all results of the query).
    BASE.searchMeta = (V, m, res) => {
      const n = 1000 + (S.H.hashStr(m.query.toLowerCase()) % 90000) * 13;
      V.meta.textContent = `About ${n.toLocaleString('en-US')} results for "${m.query.trim()}"`;
    };

    // One result row i (r = res[i]) in `parent`; registers its title link in V.titles.
    BASE.searchCard = (V, r, i, res, m, parent = V.list) => {
      const { ctx, util, cardH, lines, titles, commit } = V;
      const card = util.el('div', 'se-card', parent);
      card.style.height = cardH + 'px';
      card.dataset.ordinal = String(i + 1);
      card.classList.toggle('se-dense', cardH < 98);
      const url = util.el('div', 'se-url', card);
      const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
      fav.style.background = S.H.FAV[S.H.hashStr(r.host) % S.H.FAV.length];
      util.el('span', 'se-host', url, r.host);
      util.el('span', 'se-path', url, `/${r.path.replace(/^\//, '')}`);
      const t = util.el('a', 'se-title', card, r.title);
      t.dataset.role = 'result';
      t.dataset.index = i;
      t.addEventListener('click', () => {
        if (ctx.model.pick) return;
        commit(S.H.F().apply(ctx.model, V.spec, { click: { result: i } }));
      });
      titles[i] = t;
      if (lines) util.el('div', 'se-desc', card, r.desc);
    };

    // The rows of the current page. A design that draws the whole result view itself returns true (no pager).
    BASE.searchRows = (V, m, res) => {
      const p0 = m.page * V.spec.perPage;
      res.slice(p0, p0 + V.spec.perPage).forEach((r, k) => S.P.searchCard(V, r, p0 + k, res, m));
    };

    // The pager buttons: previous, 1..pages, next.
    BASE.searchPager = (V, m) => {
      const { ctx, util, spec, pager, commit } = V;
      const mk = (label, page, cls = '') => {
        const b = S.H.btn(util, 'se-pg' + cls, pager, label);
        b.addEventListener('click', () => {
          if (ctx.model.pick || b.disabled) return;
          const p = page === 'prev' ? ctx.model.page - 1 : page === 'next' ? ctx.model.page + 1 : page;
          if (p >= 0 && p < spec.pages && p !== ctx.model.page) commit({ ...ctx.model, page: p });
        });
        return b;
      };
      V.prev = mk('‹', 'prev');
      V.prev.disabled = m.page === 0;
      for (let p = 0; p < spec.pages; p++) V.pages[p] = mk(String(p + 1), p, p === m.page ? ' on' : '');
      V.next = mk('›', 'next');
      V.next.disabled = m.page === spec.pages - 1;
    };
  }

  function installSearchRebuild(BASE, S) {
    BASE.searchRebuild = (V, m) => {
      const { spec } = V;
      S.P.searchReset(V, m);
      V.list.replaceChildren();
      V.pager.replaceChildren();
      V.titles = [];
      V.pages = [];
      S.P.searchHide(V, m);
      V.visit.hidden = !m.pick;
      if (m.pick) {
        S.P.searchVisit(V, m);
        return;
      }
      if (m.query === null) {
        S.P.searchEmpty(V, m);
        return;
      }
      const res = S.H.F().resultsFor(spec, m.query);
      S.P.searchMeta(V, m, res);
      if (S.P.searchRows(V, m, res)) return;
      S.P.searchPager(V, m);
    };

    BASE.searchPaint = env.templateLib('use-shop/_shared-search').searchPaint(S);

    BASE.searchLocate = env.templateLib('use-shop/_shared-search').searchLocate(S);

    BASE.searchCommit = env.templateLib('use-shop/_shared-search').searchCommit(S);

    BASE.buildSearch = (ctx, body) => {
      const { util, spec, rng } = ctx;
      const V = { ctx, body, util, spec, rng, x: {} };
      V.paint = (m) => S.P.searchPaint(V, m);
      V.commit = S.P.searchCommit(V);
      V.main = util.el('div', 'se-main', body);
      V.main.style.paddingLeft = rng.int(18, 40) + 'px';
      V.col = util.el('div', 'se-col', V.main);
      S.P.searchBar(V);
      S.P.searchPanes(V);
      S.P.searchSizing(V);
      S.P.searchSide(V);
      S.P.searchWire(V);
      V.shown = null;
      V.titles = [];
      V.pages = [];
      V.prev = null;
      V.next = null;
      V.back = null;
      V.paint(ctx.model);
      S.P.built(V);
      return { paint: V.paint, locate: (t) => S.P.searchLocate(V, t) };
    };
  }
  env.template('use-shop/_store-search', () => ({ install }), { uses: ['use-shop/_shared-search'] });
})();
