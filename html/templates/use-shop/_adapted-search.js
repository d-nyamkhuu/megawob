/* use-shop/_adapted-search: adapted search parts; designs still override each BASE part. */
(function () {
  'use strict';
  function install(BASE, S) {
    installSearchBar(BASE, S);
    installSearchNav(BASE, S);
    installSearchPager(BASE, S);
  }

  function installSearchBar(BASE, S) {
    BASE.searchBar = (V) => {
      const { util, spec, rng, col } = V;
      V.sectionTitle = util.el('h1', 'search-section-title', col, 'Search Results');
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
      input.placeholder = S.D.placeholder(spec);
      input.dataset.role = 'search-field';
      V.go = S.H.btn(util, 'as-btn primary se-go', V.bar, rng.pick(['Search', 'Search', 'Go']), 'search-button');
      if (S.D.goLabel !== null) V.go.textContent = S.D.goLabel;
    };

    // The (inert) sort control and the result count line.
    BASE.searchSort = (V) => {
      const { util, col } = V;
      const resultsHead = (V.resultsHead = util.el('div', 'results-head', col));
      const sortLabel = util.el('div', 'result-sort', resultsHead, 'Sort by: ');
      const sortSelect = S.H.btn(util, 'sort-control', sortLabel, 'Relevance');
      sortSelect.setAttribute('aria-expanded', 'false');
      const sortMenu = util.el('div', 'sort-menu', sortLabel);
      sortMenu.hidden = true;
      for (const name of ['Relevance', 'Title', 'Date']) {
        const option = S.H.btn(util, 'sort-option', sortMenu, name);
        option.addEventListener('click', () => {
          sortSelect.textContent = name;
          sortMenu.hidden = true;
          sortSelect.setAttribute('aria-expanded', 'false');
          env.log('decoy', { what: 'sort ' + name });
        });
      }
      sortSelect.addEventListener('click', () => {
        sortMenu.hidden = !sortMenu.hidden;
        sortSelect.setAttribute('aria-expanded', String(!sortMenu.hidden));
      });
      V.meta = util.el('div', 'se-meta', resultsHead);
    };

    // The result list, the pager and the page preview (the site's side detail pane when it shows one).
    BASE.searchPanes = (V) => {
      const { util, col } = V;
      V.list = util.el('div', 'se-list', col);
      V.pager = util.el('div', 'se-pager', col);
      const detailEl = document.querySelector('.side-detail');
      V.detail = detailEl && getComputedStyle(detailEl).display !== 'none' ? detailEl : null;
      V.emptyDetail = V.detail && V.detail.querySelector('.detail-empty');
      V.visit = util.el('div', 'se-visit', V.detail || col);
      V.visit.hidden = true;
      V.pager.style.minHeight = '44px';
    };

    // Result row height (V.cardH), description lines (V.lines) and the row sizing variables on the column.
    BASE.searchSizing = (V) => {
      const { spec, col, list, body } = V;
      if (S.D.sizing === 'reference') {
        // The base widget's sizing: rows fill the body, descriptions as the height allows.
        const bh = body.getBoundingClientRect().height;
        V.cardH = Math.max(32, Math.min(118, Math.floor((bh - 205) / spec.perPage)));
        V.lines = V.cardH >= 98 ? 2 : V.cardH >= 78 ? 1 : 0;
        col.style.setProperty('--se-lines', Math.max(1, V.lines));
        return;
      }
      // Keep the eight-row density of this design. Page targets remain available to
      // the task oracle, but navigate one continuous, ordered result surface.
      V.cardH = Math.max(34, Math.min(65, Math.floor(list.clientHeight / Math.max(8, spec.perPage))));
      V.lines = 1;
      const { cardH, lines } = V;
      col.style.setProperty('--row-height', cardH + 'px');
      col.style.setProperty(
        '--row-title-size',
        (cardH >= 60 ? 23 : cardH >= 48 ? 19 : cardH >= 43 ? 18 : cardH >= 37 ? 16 : 14) + 'px',
      );
      col.style.setProperty('--row-detail-size', (cardH >= 60 ? 20 : cardH >= 48 ? 16 : cardH >= 37 ? 14 : 12) + 'px');
      col.style.setProperty('--row-pad', (cardH >= 60 ? 6 : cardH >= 48 ? 4 : 2) + 'px');
      col.style.setProperty('--shoe-cell', Math.min(39, cardH - 9, (list.clientWidth * 39) / 965) + 'px');
      col.style.setProperty('--se-lines', Math.max(1, lines));
    };

    // The related searches column on wide stages.
    BASE.searchSide = env.templateLib('use-shop/_shared-search').searchSide(S);

    // The text field, focus tracking and the Search action (button and Enter).
    BASE.searchWire = env.templateLib('use-shop/_shared-search').searchWire(S);
  }

  function installSearchNav(BASE, S) {
    BASE.searchNav = (V) => {
      if (!S.D.pageNav) return;
      const { ctx, spec, list, pager, commit } = V;
      list.addEventListener(
        'wheel',
        (e) => {
          if (!e.deltaY || ctx.model.pick) return;
          e.preventDefault();
          const p = Math.max(0, Math.min(spec.pages - 1, ctx.model.page + Math.sign(e.deltaY)));
          if (p !== ctx.model.page) commit({ ...ctx.model, page: p });
        },
        { passive: false },
      );

      // The brass thumb is a draggable page navigator. Its existing page buttons
      // keep their boxes and click handlers, including the oracle's page targets.
      let scrollDrag = null;
      pager.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || ctx.model.pick || !e.target.closest('.se-pg.on')) return;
        scrollDrag = { id: e.pointerId, y: e.clientY, page: ctx.model.page, moved: false };
      });
      pager.addEventListener('pointermove', (e) => {
        if (!scrollDrag || e.pointerId !== scrollDrag.id || !(e.buttons & 1)) return;
        const dy = e.clientY - scrollDrag.y;
        if (!scrollDrag.moved && Math.abs(dy) < 4) return;
        scrollDrag.moved = true;
        pager.setPointerCapture(e.pointerId);
        const height = Math.max(1, pager.clientHeight - 54);
        const page = Math.max(0, Math.min(spec.pages - 1, scrollDrag.page + Math.round((dy / height) * spec.pages)));
        if (page !== ctx.model.page) commit({ ...ctx.model, page });
      });
      const endScrollDrag = (e) => {
        if (!scrollDrag || e.pointerId !== scrollDrag.id) return;
        if (pager.hasPointerCapture(e.pointerId)) pager.releasePointerCapture(e.pointerId);
        scrollDrag = null;
      };
      pager.addEventListener('pointerup', endScrollDrag);
      pager.addEventListener('pointercancel', endScrollDrag);
      pager.addEventListener('pointerleave', (e) => {
        if (scrollDrag && !pager.hasPointerCapture(e.pointerId)) scrollDrag = null;
      });
    };

    // The preview of the picked result (Back to results, the page's address, a few paragraphs).
    BASE.searchVisit = (V, m) => {
      const { ctx, util, spec, visit, titles, commit } = V;
      visit.replaceChildren();
      if (S.D.markSelected)
        for (const title of titles) {
          if (title) title.parentElement.classList.toggle('selected', Number(title.dataset.index) === m.pick.index);
        }
      const r = S.H.F().resultsFor(spec, m.query)[m.pick.index];
      const vb = util.el('div', 'se-vbar', visit);
      V.back = S.H.btn(util, 'as-btn sm', vb, '← Back to results', 'back');
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

    // Opening the preview: the side detail pane when the site has one. Returns true when the view is the preview.
    BASE.searchPick = (V, m) => {
      if (!S.D.sideDetail) return false;
      if (V.emptyDetail) V.emptyDetail.hidden = !!m.pick;
      V.visit.hidden = !m.pick;
      if (m.pick) {
        V.list.hidden = V.pager.hidden = !V.detail;
        S.P.searchVisit(V, m);
        return true;
      }
      return false;
    };

    // Which parts of the result view are hidden while the preview shows.
    BASE.searchHide = env.templateLib('use-shop/_shared-search').searchHide(S);

    // The result count line (res = all results of the query).
    BASE.searchMeta = (V, m, res) => {
      const n = 1000 + (S.H.hashStr((m.query ?? V.spec.query).toLowerCase()) % 90000) * 13;
      V.meta.textContent = `About ${n.toLocaleString('en-US')} results for "${(m.query ?? V.spec.query).trim()}"`;
    };

    // One result row i (r = res[i]) in V.list; registers its title link in V.titles.
    BASE.searchCard = (V, r, i, res, m, parent = V.list) => {
      const { ctx, util, spec, cardH, lines, titles, commit } = V;
      const card = util.el('div', 'se-card', parent);
      const number = util.el('b', 'result-number', card, String(i + 1) + '.');
      card.style.height = cardH + 'px';
      card.classList.toggle('compact', cardH < 60);
      const thumb = util.el('div', 'search-thumb', card);
      thumb.setAttribute('aria-hidden', 'true');
      thumb.style.setProperty('--shoe-index', String(i % 8));
      const url = util.el('div', 'se-url', card);
      const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
      fav.style.background = S.H.FAV[S.H.hashStr(r.host) % S.H.FAV.length];
      util.el('span', 'se-host', url, r.host);
      util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
      const t = util.el('a', 'se-title', card, r.title);
      t.dataset.role = 'result';
      t.dataset.index = i;
      t.addEventListener('click', () => {
        if (ctx.model.pick) return;
        // Choosing a visible row also navigates to its logical result page.
        // The task still receives its original page and result vocabulary.
        const page = Math.floor(i / spec.perPage);
        commit(S.H.F().apply({ ...ctx.model, page }, spec, { click: { result: i } }));
      });
      titles[i] = t;
      const productMeta = S.H.F().resultMeta(spec, r);
      const price = productMeta.find(([key]) => /price/i.test(key));
      const brand = productMeta.find(([key]) => /brand/i.test(key));
      if (price) util.el('div', 'se-price', card, price[1]);
      if (lines) {
        const detail = util.el('div', 'se-desc', card, brand ? brand[1] : r.host.replace(/^www\./, ''));
        detail.title = brand ? brand[1] : r.desc;
      }
    };

    // The rows of the result list. Default: every result in one scrolling list. Returns true when a design drew
    // the whole result view itself (no pager).
    BASE.searchRows = (V, m, res) => {
      res.forEach((r, i) => S.P.searchCard(V, r, i, res, m));
    };
  }

  function installSearchPager(BASE, S) {
    BASE.searchPager = (V, m, res) => {
      const { util, spec, list, pager, cardH, commit, ctx } = V;
      const mk = (label, page, cls = '') => {
        const b = S.H.btn(util, 'se-pg' + cls, pager, label);
        if (S.D.pagerAria) {
          b.dataset.page = page;
          b.setAttribute(
            'aria-label',
            page === 'prev' ? 'Previous results' : page === 'next' ? 'Next results' : `Results page ${page + 1}`,
          );
        }
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
      if (S.D.pagerSync) {
        const p0 = m.page * spec.perPage;
        list.scrollTop = p0 * cardH;
        const first = Math.floor(list.scrollTop / cardH) + 1;
        const last = Math.min(res.length, Math.ceil((list.scrollTop + list.clientHeight) / cardH));
        V.sectionTitle.textContent = `Search Results (${first} - ${last} of ${res.length})`;
      }
    };

    // Before the result view is emptied (state of an earlier build a design has to release).
    BASE.searchReset = env.templateLib('use-shop/_shared-search').searchReset(S);

    BASE.searchRebuild = (V, m) => {
      const { spec } = V;
      if (S.P.searchPick(V, m)) return;
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
      const res = S.H.F().resultsFor(spec, m.query ?? spec.query);
      S.P.searchMeta(V, m, res);
      if (S.P.searchRows(V, m, res)) return;
      S.P.searchPager(V, m, res);
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
      S.P.searchSort(V);
      S.P.searchPanes(V);
      S.P.searchSizing(V);
      S.P.searchSide(V);
      S.P.searchWire(V);
      S.P.searchNav(V);
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
  env.template('use-shop/_adapted-search', () => ({ install }), { uses: ['use-shop/_shared-search'] });
})();
